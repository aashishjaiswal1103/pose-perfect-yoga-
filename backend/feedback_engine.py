import numpy as np

class FeedbackEngine:
    def __init__(self):
        pass

    def calculate_angle(self, a, b, c):
        """
        Calculate the angle between three points.
        a, b, c are lists or tuples: [x, y]
        b is the middle point (vertex).
        """
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians*180.0/np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle

    def analyze_pose(self, landmarks, pose_name="Warrior Pose"):
        """
        Analyze the given pose and calculate alignment score and feedback.
        landmarks: List of landmarks from PoseDetector.
        """
        if not landmarks or len(landmarks) < 33:
            return {"score": 0, "message": "Incomplete pose data"}
            
       
        try:
            l_shoulder = [landmarks[11][1], landmarks[11][2]]
            l_elbow = [landmarks[13][1], landmarks[13][2]]
            l_wrist = [landmarks[15][1], landmarks[15][2]]
            
            angle = self.calculate_angle(l_shoulder, l_elbow, l_wrist)
            
            score = 100
            message = "Perfect alignment!"
            
            # Simple logic to adjust score
            if angle < 160:
                score -= int((180 - angle) * 0.5)
                message = "Straighten your left arm."
                
            return {
                "pose": pose_name,
                "score": max(0, score),
                "angle": round(angle, 2),
                "message": message
            }
        except IndexError:
            return {"score": 0, "message": "Landmarks out of range"}
