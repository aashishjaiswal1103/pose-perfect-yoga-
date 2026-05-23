import pickle
import numpy as np
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "pose_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "feature_names.pkl")

class PoseClassifier:
    def __init__(self):
        with open(MODEL_PATH, "rb") as f:
            self.model = pickle.load(f)
        with open(FEATURES_PATH, "rb") as f:
            self.feature_names = pickle.load(f)
        print("Pose classifier loaded successfully")

    def calculate_angle(self, a, b, c):
        """Calculate angle at point b between points a, b, c"""
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - \
                  np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        if angle > 180.0:
            angle = 360 - angle
        return angle

    def extract_angles(self, landmarks):
        """
        Takes 33 landmarks from MediaPipe
        Returns dict of 14 angles needed by the model
        """
        if len(landmarks) < 33:
            return None

        # Helper to get x,y of a landmark by index
        def p(idx):
            return [landmarks[idx]["x"], landmarks[idx]["y"]]

        # MediaPipe landmark indices
        # 11=L_SHOULDER, 12=R_SHOULDER
        # 13=L_ELBOW,    14=R_ELBOW
        # 15=L_WRIST,    16=R_WRIST
        # 23=L_HIP,      24=R_HIP
        # 25=L_KNEE,     26=R_KNEE
        # 27=L_ANKLE,    28=R_ANKLE

        try:
            angles = {
                "left_elbow_angle":              self.calculate_angle(p(11), p(13), p(15)),
                "right_elbow_angle":             self.calculate_angle(p(12), p(14), p(16)),
                "left_shoulder_angle":           self.calculate_angle(p(13), p(11), p(23)),
                "right_shoulder_angle":          self.calculate_angle(p(24), p(12), p(14)),
                "left_knee_angle":               self.calculate_angle(p(23), p(25), p(27)),
                "right_knee_angle":              self.calculate_angle(p(24), p(26), p(28)),
                "left_hip_angle":                self.calculate_angle(p(11), p(23), p(25)),
                "right_hip_angle":               self.calculate_angle(p(12), p(24), p(26)),
                "hand_angle":                    self.calculate_angle(p(13), p(12), p(14)),
                "angle_for_ardhaChandrasana1":   self.calculate_angle(p(27), p(23), p(28)),
                "angle_for_ardhaChandrasana2":   self.calculate_angle(p(27), p(23), p(28)),
                "neck_angle_uk":                 self.calculate_angle(p(11), p(12), p(24)),
                "left_wrist_angle_bk":           self.calculate_angle(p(13), p(15), p(19)),
                "right_wrist_angle_bk":          self.calculate_angle(p(14), p(16), p(20)),
            }
            return angles
        except Exception as e:
            print(f"Angle extraction error: {e}")
            return None

    def predict(self, landmarks):
        """
        Takes landmarks list from MediaPipe
        Returns predicted pose name and confidence %
        """
        angles = self.extract_angles(landmarks)
        if angles is None:
            return "Unknown", 0.0, angles

        # Build feature vector in correct order
        features = np.array([[angles[f] for f in self.feature_names]])

        # Predict
        predicted_pose = self.model.predict(features)[0]

        # Get confidence from probability
        probabilities = self.model.predict_proba(features)[0]
        confidence = round(max(probabilities) * 100, 1)

        return predicted_pose, confidence, angles

    def calculate_score(self, landmarks, target_pose):
        """
        Scores how well user matches the target pose 0-100
        Based on how close their angles are to the average for that pose
        """
        angles = self.extract_angles(landmarks)
        if angles is None:
            return 0, ["Stand in front of camera"]

        predicted_pose, confidence, _ = self.predict(landmarks)

        # If detected pose matches target pose, score = confidence
        if predicted_pose == target_pose:
            score = int(confidence)
            feedback = [f"Great {target_pose} form!"] if score > 80 else ["Keep holding the pose"]
        else:
            score = max(0, int(confidence * 0.5))
            feedback = [f"Detected: {predicted_pose}. Try to match {target_pose}"]

        return score, feedback