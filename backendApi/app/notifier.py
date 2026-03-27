"""
notifier.py
-----------
Sends Gmail alerts when violence is detected.
Uses SMTP with an App Password (not your real Gmail password).

Setup:
    1. Enable 2-Step Verification on your Google account
    2. Go to: Google Account → Security → App Passwords
    3. Generate a password for "Mail"
    4. Put it in GMAIL_APP_PASSWORD in your .env file
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from app.config import Config


def send_alert_email(to_email: str, label: str, confidence: float,
                     camera_id: str, alert_id: str):
    """
    Sends a violence detection alert email.

    Args:
        to_email:   recipient (the camera owner's email)
        label:      "Violence" or "Weaponized"
        confidence: model confidence score (0.0 – 1.0)
        camera_id:  which camera triggered the alert
        alert_id:   MongoDB alert document id (for deep-linking)
    """
    if not Config.GMAIL_SENDER or not Config.GMAIL_APP_PASSWORD:
        print("[Notifier] Gmail credentials not configured — skipping email")
        return

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    subject = f"VisionGuard Alert — {label} Detected"

    # Plain text fallback
    body_text = f"""
VisionGuard Violence Detection Alert
-------------------------------------
Event     : {label}
Confidence: {confidence:.0%}
Camera    : {camera_id}
Time      : {timestamp}
Alert ID  : {alert_id}

Log in to your VisionGuard dashboard to view the recorded clip.
"""

    # HTML version
    color = "#A32D2D" if label == "Violence" else "#712B13"
    body_html = f"""
<html><body style="font-family:sans-serif;max-width:480px;margin:auto;color:#222;">
  <div style="background:{color};color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">VisionGuard Alert</h2>
    <p style="margin:4px 0 0;opacity:0.85;">{label} Detected</p>
  </div>
  <div style="background:#f9f9f9;padding:16px 20px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
    <table style="width:100%;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#666;">Event</td>
          <td style="padding:6px 0;font-weight:600;color:{color};">{label}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Confidence</td>
          <td style="padding:6px 0;">{confidence:.0%}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Camera</td>
          <td style="padding:6px 0;">{camera_id}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Time</td>
          <td style="padding:6px 0;">{timestamp}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Alert ID</td>
          <td style="padding:6px 0;font-size:12px;color:#888;">{alert_id}</td></tr>
    </table>
    <p style="margin-top:16px;font-size:13px;color:#555;">
      Log in to your VisionGuard dashboard to view the recorded clip.
    </p>
  </div>
</body></html>
"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = Config.GMAIL_SENDER
    msg["To"]      = to_email

    msg.attach(MIMEText(body_text, "plain"))
    msg.attach(MIMEText(body_html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(Config.GMAIL_SENDER, Config.GMAIL_APP_PASSWORD)
            server.sendmail(Config.GMAIL_SENDER, to_email, msg.as_string())
        print(f"[Notifier] Alert email sent to {to_email}")
    except Exception as e:
        print(f"[Notifier] Failed to send email: {e}")