import os
import cv2
import requests

from dotenv import load_dotenv

# ---------------------------------------------------
# LOAD ENV VARIABLES
# ---------------------------------------------------

load_dotenv()

RESEND_API_KEY = os.getenv(
    "RESEND_API_KEY"
)

ALERT_EMAIL = os.getenv(
    "ALERT_EMAIL"
).strip()

# ---------------------------------------------------
# SAVE ALERT FRAME
# ---------------------------------------------------

def save_alert_frame(frame):

    folder = "alerts"

    os.makedirs(
        folder,
        exist_ok=True
    )

    filename = (
        f"alert_{int(__import__('time').time())}.jpg"
    )

    path = os.path.join(
        folder,
        filename
    )

    cv2.imwrite(
        path,
        frame
    )

    return path


# ---------------------------------------------------
# SEND EMAIL ALERT
# ---------------------------------------------------

def send_email_alert(confidence):

    try:

        print(
            "EMAIL FUNCTION CALLED"
        )

        print(
            "SENDING TO:",
            ALERT_EMAIL
        )

        url = (
            "https://api.resend.com/emails"
        )

        headers = {

            "Authorization":
            f"Bearer {RESEND_API_KEY}",

            "Content-Type":
            "application/json"
        }

        data = {

            "from":
            "VisionGuard <onboarding@resend.dev>",

            "to":
            [ALERT_EMAIL],

            "subject":
            "🚨 Violence Detected Alert",

            "html":
            f"""
            <h2>
                🚨 VisionGuard Alert
            </h2>

            <p>
                Violence detected by the system.
            </p>

            <p>
                <strong>Confidence:</strong>
                {confidence:.2f}
            </p>

            <p>
                Immediate attention required.
            </p>
            """
        }

        response = requests.post(

            url,

            headers=headers,

            json=data
        )

        print(
            "STATUS:",
            response.status_code
        )

        print(
            "RESPONSE:",
            response.text
        )

        if response.status_code == 200:

            print(
                "Email sent successfully."
            )

        else:

            print(
                "Email failed."
            )

    except Exception as e:

        print(
            "EMAIL ERROR:",
            str(e)
        )