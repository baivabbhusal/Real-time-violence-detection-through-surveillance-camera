"""
stream_handler.py
-----------------
Reads frames from an RTSP camera stream (or webcam) using OpenCV.
Maintains a rolling frame buffer of SEQUENCE_LENGTH frames.
When the buffer is full, passes it to the detector.
If violence is detected, saves a short clip and triggers an alert.

Each camera gets its own CameraStream instance running in a background thread.
Flask routes read MJPEG frames from the stream via a generator function.
"""

import os
import cv2
import time
import threading
import numpy as np
from collections import deque
from datetime import datetime, timezone

from app.config import Config
from app.detector import get_detector
from app import models, notifier


class CameraStream:
    """
    Manages a single camera's live stream.

    Lifecycle:
        stream = CameraStream(camera_id, owner_id, rtsp_url, owner_email)
        stream.start()          # starts background capture thread
        ...
        stream.stop()           # stops the thread cleanly

    Frame reading (for MJPEG endpoint):
        for jpeg_bytes in stream.generate_mjpeg():
            yield jpeg_bytes
    """

    def __init__(self, camera_id: str, owner_id: str, rtsp_url: str, owner_email: str):
        self.camera_id   = camera_id
        self.owner_id    = owner_id
        self.owner_email = owner_email

        # OpenCV accepts both RTSP URLs and integer device indices
        self.source = int(rtsp_url) if rtsp_url.isdigit() else rtsp_url

        self.detector   = get_detector()
        self.frame_buf  = deque(maxlen=Config.SEQUENCE_LENGTH)   # rolling buffer
        self.latest_frame = None   # most recent raw frame for MJPEG output
        self.lock       = threading.Lock()
        self.running    = False
        self.thread     = None

        # Clip recording state
        self.clip_writer    = None
        self.clip_path      = None
        self.clip_frame_count = 0
        self.CLIP_SECONDS   = 5
        self.FPS            = 10   # clip playback FPS

        os.makedirs(Config.CLIPS_DIR, exist_ok=True)

    # ── Start / Stop ──────────────────────────────────────────────────────────

    def start(self):
        self.running = True
        self.thread  = threading.Thread(target=self._capture_loop, daemon=True)
        self.thread.start()
        print(f"[Stream {self.camera_id}] Started")

    def stop(self):
        self.running = False
        if self.clip_writer:
            self.clip_writer.release()
        print(f"[Stream {self.camera_id}] Stopped")

    # ── Background capture loop ───────────────────────────────────────────────

    def _capture_loop(self):
        """
        Runs in a background thread.
        Continuously reads frames, fills the buffer, and triggers detection.
        """
        cap = cv2.VideoCapture(self.source)

        if not cap.isOpened():
            print(f"[Stream {self.camera_id}] ERROR: Cannot open {self.source}")
            self.running = False
            return

        frame_idx = 0

        while self.running:
            ret, frame = cap.read()

            if not ret:
                # Stream dropped — wait and retry
                print(f"[Stream {self.camera_id}] Frame read failed, retrying...")
                time.sleep(1)
                cap.release()
                cap = cv2.VideoCapture(self.source)
                continue

            with self.lock:
                self.latest_frame = frame.copy()
                self.frame_buf.append(frame.copy())

            # Write to clip if currently recording
            if self.clip_writer is not None:
                self._write_clip_frame(frame)

            # Run detection every SEQUENCE_LENGTH frames
            if frame_idx % Config.SEQUENCE_LENGTH == 0 and len(self.frame_buf) == Config.SEQUENCE_LENGTH:
                self._run_detection(list(self.frame_buf))

            frame_idx += 1

        cap.release()

    # ── Detection ─────────────────────────────────────────────────────────────

    def _run_detection(self, frames: list):
        """
        Passes the current frame buffer to the model.
        If violence detected above threshold, starts clip and sends alert.
        """
        result = self.detector.predict(frames)

        print(
            f"[Stream {self.camera_id}] "
            f"{result['label']} ({result['confidence']:.0%})"
        )

        if result["is_violent"] and result["confidence"] >= self.detector.threshold:
            print(f"[Stream {self.camera_id}] VIOLENCE DETECTED — saving clip")
            clip_path = self._start_clip_recording()
            self._send_alert(result, clip_path)

    # ── Clip recording ────────────────────────────────────────────────────────

    def _start_clip_recording(self) -> str:
        """
        Begins writing a 5-second MP4 clip starting from the current frame.
        Returns the clip file path.
        """
        if self.clip_writer is not None:
            return self.clip_path   # already recording

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        filename  = f"clip_{self.camera_id}_{timestamp}.mp4"
        self.clip_path = os.path.join(Config.CLIPS_DIR, filename)

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        self.clip_writer = cv2.VideoWriter(
            self.clip_path, fourcc, self.FPS,
            (Config.FRAME_SIZE[0], Config.FRAME_SIZE[1])
        )
        self.clip_frame_count = 0
        return self.clip_path

    def _write_clip_frame(self, frame: np.ndarray):
        """Writes one frame to the current clip, stops after CLIP_SECONDS."""
        resized = cv2.resize(frame, Config.FRAME_SIZE)
        self.clip_writer.write(resized)
        self.clip_frame_count += 1

        if self.clip_frame_count >= self.FPS * self.CLIP_SECONDS:
            self.clip_writer.release()
            self.clip_writer = None
            self.clip_frame_count = 0
            print(f"[Stream {self.camera_id}] Clip saved: {self.clip_path}")

    # ── Alert ─────────────────────────────────────────────────────────────────

    def _send_alert(self, result: dict, clip_path: str):
        """
        Records the incident in MongoDB and sends a Gmail alert.
        Runs in the same background thread — fast enough for our needs.
        """
        alert_id = models.create_alert(
            camera_id  = self.camera_id,
            owner_id   = self.owner_id,
            label      = result["label"],
            confidence = result["confidence"],
            clip_path  = clip_path,
        )

        notifier.send_alert_email(
            to_email   = self.owner_email,
            label      = result["label"],
            confidence = result["confidence"],
            camera_id  = self.camera_id,
            alert_id   = alert_id,
        )

        models.mark_alert_notified(alert_id)

    # ── MJPEG generator (for /stream/<camera_id> endpoint) ────────────────────

    def generate_mjpeg(self):
        """
        Generator that yields MJPEG frames for the browser.
        Flask streams these as multipart/x-mixed-replace.

        The browser renders them as a live video feed without needing WebSockets.
        """
        while self.running:
            with self.lock:
                frame = self.latest_frame

            if frame is None:
                time.sleep(0.05)
                continue

            ret, jpeg = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if not ret:
                continue

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + jpeg.tobytes()
                + b"\r\n"
            )

            time.sleep(1 / 15)   # ~15 FPS to browser


# ── Stream registry ───────────────────────────────────────────────────────────
# Keeps all active streams in memory. Keyed by camera_id string.

_active_streams: dict[str, CameraStream] = {}
_registry_lock = threading.Lock()


def start_stream(camera_id: str, owner_id: str, rtsp_url: str, owner_email: str) -> CameraStream:
    with _registry_lock:
        if camera_id in _active_streams:
            return _active_streams[camera_id]

        stream = CameraStream(camera_id, owner_id, rtsp_url, owner_email)
        stream.start()
        _active_streams[camera_id] = stream
        return stream


def stop_stream(camera_id: str):
    with _registry_lock:
        stream = _active_streams.pop(camera_id, None)
        if stream:
            stream.stop()


def get_stream(camera_id: str) -> CameraStream | None:
    return _active_streams.get(camera_id)