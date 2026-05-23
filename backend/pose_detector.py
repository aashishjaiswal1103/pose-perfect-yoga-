import cv2
import mediapipe as mp
import base64
import numpy as np

class PoseDetector:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        # Open webcam
        # Using cv2.CAP_DSHOW makes camera load significantly faster on Windows
        self.cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    def get_frame_and_landmarks(self):
        success, frame = self.cap.read()
        if not success:
            return None, []

        # Mirror ONLY the display frame — NOT before MediaPipe
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb)

        # Now flip the frame for display
        frame = cv2.flip(frame, 1)

        landmarks = []
        if results.pose_landmarks:
            for i, lm in enumerate(results.pose_landmarks.landmark):
                landmarks.append({
                    "id": i,
                    "x": lm.x,
                    "y": lm.y,
                    "z": lm.z,
                    "visibility": lm.visibility
                })

        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        return frame_base64, landmarks

    def find_pose(self, img, draw=True):
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb)
        landmarks = []
        if results.pose_landmarks:
            h, w, _ = img.shape
            for i, lm in enumerate(results.pose_landmarks.landmark):
                cx = int(lm.x * w)
                cy = int(lm.y * h)
                landmarks.append([i, cx, cy, lm.z, lm.visibility])
        return landmarks

    def release(self):
        self.cap.release()