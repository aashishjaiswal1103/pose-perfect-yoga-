import asyncio
import json
from fastapi import APIRouter, UploadFile, File, WebSocket, WebSocketDisconnect
import cv2
import numpy as np
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pose_detector import PoseDetector
from pose_classifier import PoseClassifier

router = APIRouter()

detector = None
classifier = None

def get_detector():
    global detector
    if detector is None:
        detector = PoseDetector()
    return detector

def get_classifier():
    global classifier
    if classifier is None:
        classifier = PoseClassifier()
    return classifier


# Format: joint -> (ideal_angle, tolerance, feedback_if_wrong)
POSE_RULES = {
    "Warrior Pose": {
        "right_knee_angle":    (90,  20, "Bend your right knee closer to 90 degrees"),
        "left_knee_angle":     (180, 15, "Keep your back leg fully straight"),
        "right_hip_angle":     (90,  20, "Lower your hips"),
        "left_hip_angle":      (180, 20, "Keep your torso upright"),
        "left_shoulder_angle": (90,  20, "Raise your left arm to shoulder height"),
        "right_shoulder_angle":(90,  20, "Raise your right arm to shoulder height"),
        "left_elbow_angle":    (180, 15, "Straighten your left arm"),
        "right_elbow_angle":   (180, 15, "Straighten your right arm"),
    },
    "Tree Pose": {
        "left_knee_angle":     (180, 15, "Keep your standing leg fully straight"),
        "right_knee_angle":    (60,  25, "Bend your right knee and place foot on thigh"),
        "left_hip_angle":      (180, 15, "Keep your standing hip straight"),
        "left_shoulder_angle": (170, 20, "Raise both arms fully overhead"),
        "right_shoulder_angle":(170, 20, "Raise both arms fully overhead"),
        "left_elbow_angle":    (180, 20, "Straighten your arms overhead"),
        "right_elbow_angle":   (180, 20, "Straighten your arms overhead"),
    },
    "Downward Dog": {
        "left_knee_angle":     (180, 15, "Straighten your left knee"),
        "right_knee_angle":    (180, 15, "Straighten your right knee"),
        "left_hip_angle":      (70,  10, "Push your hips higher into a V-shape"),
        "right_hip_angle":     (70,  10, "Push your hips higher into a V-shape"),
        "left_shoulder_angle": (180, 15, "Press your chest towards your legs"),
        "right_shoulder_angle":(180, 15, "Press your chest towards your legs"),
        "left_elbow_angle":    (180, 15, "Straighten your left arm"),
        "right_elbow_angle":   (180, 15, "Straighten your right arm"),
    },
    "Triangle Pose": {
        "left_knee_angle":     (180, 15, "Keep your front leg straight"),
        "right_knee_angle":    (180, 15, "Keep your back leg straight"),
        "left_hip_angle":      (150, 20, "Keep your torso in line with your back leg"),
        "right_hip_angle":     (90,  20, "Bend deeper at the front hip"),
        "left_shoulder_angle": (90,  20, "Extend your top arm straight up"),
        "right_shoulder_angle":(90,  20, "Reach bottom arm straight down"),
        "left_elbow_angle":    (180, 15, "Straighten your top arm"),
        "right_elbow_angle":   (180, 15, "Straighten your bottom arm"),
    },
    "Half Moon Pose": {
        "left_knee_angle":     (180, 15, "Straighten your standing leg"),
        "right_knee_angle":    (180, 15, "Straighten your raised leg"),
        "left_hip_angle":      (90,  20, "Keep your torso parallel to the floor"),
        "right_hip_angle":     (170, 20, "Lift your raised leg higher"),
        "left_shoulder_angle": (90,  20, "Extend your top arm upward"),
        "right_shoulder_angle":(90,  20, "Reach your bottom arm to the floor"),
    },
    "Chair Pose": {
        "left_knee_angle":     (110, 20, "Bend your knees more like sitting on a chair"),
        "right_knee_angle":    (110, 20, "Bend your knees more like sitting on a chair"),
        "left_hip_angle":      (110, 20, "Sit your hips back and down"),
        "right_hip_angle":     (110, 20, "Sit your hips back and down"),
        "left_shoulder_angle": (170, 20, "Raise your arms straight up alongside ears"),
        "right_shoulder_angle":(170, 20, "Raise your arms straight up alongside ears"),
        "left_elbow_angle":    (180, 20, "Straighten your arms"),
        "right_elbow_angle":   (180, 20, "Straighten your arms"),
    },
    "Butterfly Pose": {
        "left_knee_angle":     (40,  20, "Bring your feet closer to your body"),
        "right_knee_angle":    (40,  20, "Bring your feet closer to your body"),
        "left_hip_angle":      (100, 25, "Sit up tall and open your hips"),
        "right_hip_angle":     (100, 25, "Sit up tall and open your hips"),
        "left_shoulder_angle": (20,  20, "Relax your shoulders down and reach for your feet"),
        "right_shoulder_angle":(20,  20, "Relax your shoulders down and reach for your feet"),
        "left_elbow_angle":    (160, 20, "Keep your arms relatively straight holding your feet"),
        "right_elbow_angle":   (160, 20, "Keep your arms relatively straight holding your feet"),
    },
    
    "Cobra Pose": {
        "left_knee_angle":     (180, 15, "Keep your legs fully straight on the floor"),
        "right_knee_angle":    (180, 15, "Keep your legs fully straight on the floor"),
        "left_hip_angle":      (180, 15, "Keep your hips pressed to the floor"),
        "right_hip_angle":     (180, 15, "Keep your hips pressed to the floor"),
        "left_shoulder_angle": (50,  20, "Pull your shoulders back and down"),
        "right_shoulder_angle":(50,  20, "Pull your shoulders back and down"),
        "left_elbow_angle":    (150, 20, "Keep a slight bend in your elbows"),
        "right_elbow_angle":   (150, 20, "Keep a slight bend in your elbows"),
    },
    "Cat-Cow Pose": {
        "left_knee_angle":     (90,  20, "Keep your knees bent at 90 degrees"),
        "right_knee_angle":    (90,  20, "Keep your knees bent at 90 degrees"),
        "left_hip_angle":      (90,  20, "Keep your hips directly over your knees"),
        "right_hip_angle":     (90,  20, "Keep your hips directly over your knees"),
        "left_shoulder_angle": (90,  20, "Keep shoulders directly over wrists"),
        "right_shoulder_angle":(90,  20, "Keep shoulders directly over wrists"),
        "left_elbow_angle":    (180, 15, "Keep your arms straight"),
        "right_elbow_angle":   (180, 15, "Keep your arms straight"),
    },
    "Mountain Pose": {
        "left_knee_angle":     (180, 15, "Straighten your legs fully"),
        "right_knee_angle":    (180, 15, "Straighten your legs fully"),
        "left_hip_angle":      (180, 15, "Stand tall with hips straight"),
        "right_hip_angle":     (180, 15, "Stand tall with hips straight"),
        "left_shoulder_angle": (170, 20, "Raise your arms straight up over your head"),
        "right_shoulder_angle":(170, 20, "Raise your arms straight up over your head"),
        "left_elbow_angle":    (180, 15, "Keep your arms straight overhead"),
        "right_elbow_angle":   (180, 15, "Keep your arms straight overhead"),
    },
    "Lotus Pose": {
        "left_knee_angle":     (40,  10, "Cross your legs deeply"),
        "right_knee_angle":    (40,  10, "Cross your legs deeply"),
        "left_hip_angle":      (90,  10, "Sit up tall and straight"),
        "right_hip_angle":     (90,  10, "Sit up tall and straight"),
        "left_shoulder_angle": (20,  10, "Relax your shoulders down"),
        "right_shoulder_angle":(20,  10, "Relax your shoulders down"),
    },
    "Bridge Pose": {
        "left_knee_angle":     (90,  20, "Bend your knees to 90 degrees"),
        "right_knee_angle":    (90,  20, "Bend your knees to 90 degrees"),
        "left_hip_angle":      (160, 20, "Lift your hips higher towards the ceiling"),
        "right_hip_angle":     (160, 20, "Lift your hips higher towards the ceiling"),
        "left_shoulder_angle": (30,  20, "Press your shoulders into the floor"),
        "right_shoulder_angle":(30,  20, "Press your shoulders into the floor"),
    },
   
}

# Map frontend pose names to model labels
POSE_NAME_MAP = {
    "Warrior Pose":   "Warrior Pose",
    "Tree Pose":      "Tree Pose",
    "Downward Dog":   "Downward Dog",
    "Triangle Pose":  "Triangle Pose",
    "Half Moon Pose": "Half Moon Pose",
    "Chair Pose":     "Chair Pose",
    "Butterfly Pose": "Butterfly Pose",
    "Cobra Pose":     "Cobra Pose",
    "Cat-Cow Pose":   "Cat-Cow Pose",
    "Mountain Pose":  "Mountain Pose",
    "Lotus Pose":     "Lotus Pose",
    "Bridge Pose":    "Bridge Pose",
}

# Poses the model was NOT trained on — skip gate for these
UNTRAINED_POSES = {
    "Dancer Pose",
    "Plank Pose",
    "Child's Pose",
}

def score_pose(angles: dict, pose_name: str):
    rules = POSE_RULES.get(pose_name)

    if not rules or not angles:
        return 0, ["Stand in front of the camera"], {}

    total_joints = len(rules)
    correct_joints = 0
    feedback_list = []
    joint_colors = {}

    for joint, (ideal, tolerance, message) in rules.items():
        actual = angles.get(joint)
        if actual is None:
            joint_colors[joint] = "yellow"
            continue

        diff = abs(actual - ideal)

        if diff <= tolerance:
            correct_joints += 1
            joint_colors[joint] = "green"
        elif diff <= tolerance * 2:
            correct_joints += 0.5
            feedback_list.append(message)
            joint_colors[joint] = "orange"
        else:
            feedback_list.append(message)
            joint_colors[joint] = "red"

    score = int((correct_joints / total_joints) * 100)

    if score < 30:
        score = 0
        feedback_list = [f"Get into {pose_name} position"]
    elif score >= 90:
        feedback_list = [f"Perfect {pose_name}! Hold it!"]
    elif score >= 80:
        if not feedback_list:
            feedback_list = ["Almost perfect — keep adjusting"]
    elif not feedback_list:
        feedback_list = [f"Get into {pose_name} position"]

    return score, feedback_list, joint_colors


@router.websocket("/ws/live")
async def live_pose_stream(websocket: WebSocket):
    await websocket.accept()
    print("Frontend connected to live stream")

    det = get_detector()
    clf = get_classifier()

    current_pose = "Warrior Pose"
    recent_scores = []

    async def receive_pose_updates():
        nonlocal current_pose
        try:
            while True:
                msg = await websocket.receive_text()
                data = json.loads(msg)
                if "pose_name" in data:
                    current_pose = data["pose_name"]
                    print(f"Pose updated to: {current_pose}")
        except Exception:
            pass

    asyncio.create_task(receive_pose_updates())

    try:
        while True:
            frame_base64, landmarks = det.get_frame_and_landmarks()

            if frame_base64 is None:
                await websocket.send_json({"error": "Camera not available"})
                break

            if landmarks and len(landmarks) == 33:
                angles = clf.extract_angles(landmarks)

                if current_pose is None:
                    # Wait for frontend to send the chosen pose
                    await websocket.send_json({
                        "frame": frame_base64,
                        "landmarks": landmarks,
                        "score": 0,
                        "feedback": "Waiting for pose...",
                        "feedback_list": ["Waiting for pose..."],
                        "predicted_pose": "Unknown",
                        "confidence": 0.0,
                        "joint_colors": {},
                        "landmarks_detected": True,
                        "status": "not_in_pose"
                    })
                    continue

                angles = clf.extract_angles(landmarks)

                # Still run prediction so we can send it to the UI, but DO NOT use it as a gate
                detected_pose, confidence, _ = clf.predict(landmarks)

                # Score strictly using the pose rules
                raw_score, feedback_list, joint_colors = score_pose(angles, current_pose)
                
                # Smooth the score using a moving average
                recent_scores.append(raw_score)
                if len(recent_scores) > 5:
                    recent_scores.pop(0)
                score = int(sum(recent_scores) / len(recent_scores))

                status = "in_pose"

                await websocket.send_json({
                    "frame": frame_base64,
                    "landmarks": landmarks,
                    "score": score,
                    "feedback": feedback_list[0] if feedback_list else "",
                    "feedback_list": feedback_list,
                    "predicted_pose": detected_pose,
                    "confidence": confidence,
                    "joint_colors": joint_colors,
                    "landmarks_detected": True,
                    "status": status
                })

            else:
                await websocket.send_json({
                    "frame": frame_base64,
                    "landmarks": [],
                    "score": 0,
                    "feedback": "Stand in front of camera",
                    "feedback_list": ["Stand in front of camera"],
                    "predicted_pose": current_pose,
                    "confidence": 0,
                    "joint_colors": {},
                    "landmarks_detected": False,
                    "status": "not_detected"
                })

            await asyncio.sleep(0.033)

    except WebSocketDisconnect:
        print("Frontend disconnected")
    except Exception as e:
        print(f"Stream error: {e}")


@router.post("/analyze_frame")
async def analyze_frame(file: UploadFile = File(...)):
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return {"status": "success", "landmarks_detected": False}