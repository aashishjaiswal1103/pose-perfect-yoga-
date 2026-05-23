# Yoga Pose Perfect: Backend Architecture & ML Documentation

## 1. Overview
The backend of **Yoga Pose Perfect** functions as the computational brain of the application. It handles real-time video stream processing, 3D body landmark extraction, machine learning classification, rule-based geometric scoring, and data persistence. The backend is completely decoupled from the frontend, communicating primarily via high-speed WebSockets for live video and REST APIs for session analytics.

---

## 2. Technologies Used

### Core Framework & Communication
- **FastAPI**: Chosen as the primary backend web framework. FastAPI natively supports Python `async`/`await` which is critical for handling high-frequency WebSocket data streams without blocking the server. It also automatically generates interactive API documentation.
- **WebSockets**: Used in place of traditional HTTP requests for the live session. WebSockets provide a persistent, bi-directional, low-latency connection, allowing the client to stream 30 frames per second to the server and receive instantaneous JSON feedback.

### Computer Vision & Machine Learning
- **MediaPipe (by Google)**: Used for skeletal tracking. MediaPipe is highly optimized for real-time edge processing and accurately extracts 33 3D body landmarks from a standard 2D webcam feed.
- **Scikit-Learn**: Used for the machine learning classification layer. We employ a pre-trained **RandomForestClassifier** because ensemble methods are fast to evaluate and robust against noisy data.
- **OpenCV (`cv2`)**: Used for image array manipulation, color space conversion (BGR to RGB), and compressing processed frames into base64 JPEG format for transmission.
- **NumPy**: Essential for all the vector math and geometric calculations required to translate 3D coordinates into joint angles.


---

## 3. Core Modules & Architecture

The backend is modularized into distinct files, each with a single responsibility.

### 3.1 `main.py` (The Orchestrator)
- **Role**: The entry point of the FastAPI application.
- **How it works**: 
  - Exposes REST endpoints (`/api/sessions/save`, `/api/sessions`) for frontend dashboard analytics.
  - Manages the `/api/ws/live` WebSocket route. It receives base64 encoded frames from the frontend, decodes them, passes them down the pipeline (Detector -> Classifier -> Feedback Engine), and then sends a structured JSON response back to the client containing the score, joint colors, and modified frame.

### 3.2 `pose_detector.py` (Vision Layer)
- **Role**: Extracts physical body coordinates from an image.
- **How it works**: Wraps the MediaPipe Pose solution. It takes a raw RGB image frame, processes it, and returns a list of 33 landmarks. Each landmark contains `x`, `y`, `z` coordinates normalized to a [0, 1] scale, and a `visibility` confidence score.

### 3.3 `pose_classifier.py` (Intelligence Layer)
- **Role**: Determines *which* pose the user is doing.
- **How it works**:
  - **Feature Extraction (Geometric Angles)**: It takes the 33 landmarks and uses the `arctan2` trigonometric function to calculate exactly 14 joint angles (e.g., left elbow angle, right knee angle). Angles are rotation-invariant, meaning the model works regardless of where the user stands in the frame.
  - **Random Forest Prediction**: It feeds these 14 angles into a pre-trained `pose_model.pkl` file. The model votes and predicts the pose name.
  - **Classification Gate**: If the predicted pose does not match the target pose selected by the user, the system halts scoring and simply instructs the user to "Get into position."

### 3.4 `feedback_engine.py` (Scoring & Expert System)
- **Role**: Evaluates *how well* the user is doing the pose.
- **How it works**:
  - Relies on a `POSE_RULES` dictionary—a rule-based expert system defined by yoga principles. For a given pose, it defines the ideal angles for critical joints and an acceptable tolerance (e.g., *Right Knee must be 90° ± 20°*).
  - Calculates absolute differences between the user's actual angles and the ideal rules.
  - **Visual Output**: Assigns colors to joints: Green (perfect), Orange (slightly off), Red (incorrect).
  - **Audio Output**: Uses `pyttsx3` to read corrective text strings out loud (e.g., "Straighten your back leg"). Implements a strict **4-second cooldown** to prevent audio spam.

### 3.5 `database.py` (Persistence Layer)
- **Role**: Stores user progress.
- **How it works**: Executes SQL queries against the local `yoga_sessions.db` file. Includes functions to initialize tables, save completed sessions (pose name, best score, average score, duration), and calculate advanced analytics like weekly averages and continuous daily practice streaks.

---

## 4. Data Flow (The Life of a Frame)

To understand the backend, it is easiest to follow the lifecycle of a single video frame during a live session:

1. **Ingestion**: `main.py` receives a base64 string over WebSockets from the frontend.
2. **Decoding**: Base64 is converted into a binary NumPy array image.
3. **Detection**: `pose_detector.py` extracts the 33 skeletal landmarks.
4. **Classification**: `pose_classifier.py` calculates 14 angles and verifies the user is attempting the correct target pose.
5. **Scoring**: `feedback_engine.py` compares the actual angles against the ideal `POSE_RULES` to generate a score out of 100 and assigns joint colors.
6. **Audio Action**: If a correction is needed and the 4-second audio cooldown has expired, `feedback_engine.py` speaks the correction aloud.
7. **Response**: `main.py` packages the score, text feedback, joint colors, and landmarks into a JSON object and fires it back through the WebSocket to the frontend for rendering. 

*(This entire 7-step process occurs in approximately 15 to 30 milliseconds, enabling smooth 30 FPS real-time feedback.)*
