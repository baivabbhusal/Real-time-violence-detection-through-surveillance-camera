import cv2
import threading
import numpy as np
import time

from app.services.alert_service import (
    save_alert_frame,
    send_email_alert
)

from app.services.incident_service import (
    save_incident
)

from collections import deque

from app.ai.predictor import (
    predict_violence
)


# ---------------------------------------------------
# GLOBAL CAMERA INSTANCE
# ---------------------------------------------------

camera_instance = None


# ---------------------------------------------------
# CAMERA STREAM CLASS
# ---------------------------------------------------

class CameraStream:

    def __init__(self, source=0):

        self.source = source

        self.cap = None

        self.running = False
        self.thread = None

        self.latest_frame = None

        self.is_violent = False
        self.confidence = 0.0

        # MUST MATCH TRAINING
        self.seq_len = 16
        self.frame_size = (160, 160)

        # PERFORMANCE
        self.frame_counter = 0
        self.last_alert_time = 0

        # VIOLENCE STABILITY
        self.violence_counter = 0

        self.frame_buffer = deque(
            maxlen=self.seq_len
        )

    # ---------------------------------------------------
    # START THREAD
    # ---------------------------------------------------

    def start(self):

        self.running = True

        self.thread = threading.Thread(
            target=self.update,
            daemon=True
        )

        self.thread.start()

    # ---------------------------------------------------
    # MAIN LOOP
    # ---------------------------------------------------

    def update(self):

        self.cap = cv2.VideoCapture(
            self.source
        )

        # LOWER RESOLUTION
        self.cap.set(
            cv2.CAP_PROP_FRAME_WIDTH,
            640
        )

        self.cap.set(
            cv2.CAP_PROP_FRAME_HEIGHT,
            480
        )

        # CHECK CAMERA
        if not self.cap.isOpened():

            print(
                'ERROR: Could not open webcam.'
            )

            self.running = False

            return

        try:

            while self.running:

                ret, frame = self.cap.read()

                if not ret:

                    print(
                        'ERROR: Failed to read frame.'
                    )

                    break

                # ---------------------------------------
                # PREPROCESS FRAME
                # ---------------------------------------

                img = cv2.resize(
                    frame,
                    self.frame_size
                )

                img = cv2.cvtColor(
                    img,
                    cv2.COLOR_BGR2RGB
                )

                img = (
                    img.astype(np.float32) / 127.5
                ) - 1.0

                self.frame_buffer.append(img)

                # ---------------------------------------
                # FRAME SKIPPING
                # ---------------------------------------

                self.frame_counter += 1

                # ---------------------------------------
                # PREDICTION
                # ---------------------------------------

                if (
                    len(self.frame_buffer)
                    == self.seq_len
                    and
                    self.frame_counter % 8 == 0
                ):

                    result = predict_violence(
                        self.frame_buffer
                    )

                    new_confidence = result[
                        'confidence'
                    ]

                    # ---------------------------------------
                    # SMOOTH CONFIDENCE
                    # ---------------------------------------

                    self.confidence = (
                        self.confidence * 0.6
                        +
                        new_confidence * 0.4
                    )

                    # ---------------------------------------
                    # CONSECUTIVE DETECTION
                    # ---------------------------------------

                    if self.confidence > 0.60:

                        self.violence_counter += 1

                    else:

                        self.violence_counter = 0

                    # ---------------------------------------
                    # FINAL DECISION
                    # ---------------------------------------

                    self.is_violent = (
                        self.violence_counter >= 2
                    )

                    # ---------------------------------------
                    # ALERT SYSTEM
                    # ---------------------------------------

                    # ---------------------------------------
                    # ALERT SYSTEM
                    # ---------------------------------------

                    current_time = time.time()

                    if (
                        self.is_violent
                        and
                        current_time - self.last_alert_time > 5
                    ):

                        print("ALERT TRIGGERED")

                        # SAVE IMAGE
                        image_path = save_alert_frame(
                            frame
                        )

                        print("IMAGE SAVED")

                        # SAVE INCIDENT
                        save_incident(
                            self.confidence,
                            image_path
                        )

                        print("INCIDENT SAVED")

                        # SEND EMAIL IN BACKGROUND THREAD
                        try:

                            print("SENDING EMAIL")

                            threading.Thread(

                                target=send_email_alert,

                                args=(self.confidence,),

                                daemon=True

                            ).start()

                            print("EMAIL THREAD STARTED")

                        except Exception as e:

                            print(
                                f"EMAIL FAILED: {e}"
                            )

                        self.last_alert_time = (
                            current_time
                        )

                        print(
                            'Violence alert triggered.'
                        )

                # ---------------------------------------
                # DRAW STATUS
                # ---------------------------------------

                label = (
                    'VIOLENCE'
                    if self.is_violent
                    else 'SAFE'
                )

                color = (
                    (0, 0, 255)
                    if self.is_violent
                    else (0, 255, 0)
                )

                text = (
                    f'{label}: '
                    f'{self.confidence:.2f}'
                )

                cv2.putText(
                    frame,
                    text,
                    (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    color,
                    2
                )

                # ---------------------------------------
                # ENCODE FRAME
                # ---------------------------------------

                _, buffer = cv2.imencode(
                    '.jpg',
                    frame
                )

                self.latest_frame = (
                    buffer.tobytes()
                )

        finally:

            if self.cap is not None:

                self.cap.release()

                self.cap = None

            self.latest_frame = None

            print(
                'Camera released safely.'
            )

    # ---------------------------------------------------
    # STOP CAMERA
    # ---------------------------------------------------

    def stop(self):

        print("Stopping AI camera...")

        self.running = False

        # STOP THREAD
        if self.thread:

            self.thread.join(timeout=2)

        # RELEASE CAMERA
        if self.cap is not None:

            self.cap.release()

            self.cap = None

            print("Camera released.")

        self.latest_frame = None

        print("AI camera stopped.")

    # ---------------------------------------------------
    # STREAM GENERATOR
    # ---------------------------------------------------

    def generate_frames(self):

        while self.running:

            if self.latest_frame:

                yield (
                    b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n'
                    + self.latest_frame +
                    b'\r\n'
                )

        print("Frame generator stopped.")


# ---------------------------------------------------
# START CAMERA
# ---------------------------------------------------

def start_camera():

    global camera_instance

    # CLEAN OLD CAMERA
    if camera_instance is not None:

        if camera_instance.running:

            return {
                'message': 'Camera already running'
            }, 400

        else:

            camera_instance = None

    try:

        camera_instance = CameraStream()

        camera_instance.start()

        return {
            'message': 'AI camera started'
        }, 200

    except Exception as e:

        camera_instance = None

        return {
            'message': str(e)
        }, 500


# ---------------------------------------------------
# STOP CAMERA
# ---------------------------------------------------

def stop_camera():

    global camera_instance

    if camera_instance is None:

        return {
            'message': 'Camera not running'
        }, 400

    camera_instance.stop()

    camera_instance = None

    return {
        'message': 'AI camera stopped'
    }, 200


# ---------------------------------------------------
# GET CAMERA
# ---------------------------------------------------

def get_camera():

    global camera_instance

    return camera_instance


# ---------------------------------------------------
# GET STATUS
# ---------------------------------------------------

def get_status():

    global camera_instance

    if camera_instance is None:

        return {
            'is_violent': False,
            'confidence': 0
        }

    return {
        'is_violent': camera_instance.is_violent,
        'confidence': camera_instance.confidence
    }