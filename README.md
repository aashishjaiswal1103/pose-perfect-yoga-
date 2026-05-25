The AI-Driven Yoga Pose Checker System addresses this problem by leveraging MediaPipe's real-time body landmark detection and a machine learning-based classification engine to analyze user postures, calculate joint angles, and provide instant corrective feedback and alignment scores — all through a clean, browser-based interface.
The system utilizes the power of MediaPipe Pose Estimation to detect and track 33 key anatomical landmarks (including shoulders, elbows, hips, knees, and ankles) from a standard webcam feed in real-time. By computing precise joint angles and comparing them against reference posture data, the application provides instant, actionable corrective feedback to the user — such as "Straighten your back" or "Bend your knee to 90°" — displayed visually on the live video stream.

Built on a modern full-stack architecture comprising a Python FastAPI backend and a React + TypeScript frontend, the system supports 7 curated yoga poses ranging from beginner to intermediate difficulty. Users receive a live Alignment Score for each pose and can track their improvement through a dedicated Progress Dashboard backed by a supabase

This project demonstrates the convergence of Computer Vision, Machine Learning, and Web Technologies to deliver a practical, real-world health application. It is designed with accessibility in mind — requiring only a webcam and a browser — making professional-grade yoga guidance available to everyone.

The system follows a client-server architecture with three primary layers:
•	Presentation Layer: React + TypeScript frontend — displays live video, feedback, scores, and dashboard.
•	Application Layer: Python FastAPI backend — handles pose detection, angle computation, classification, and scoring.
•	Data Layer: Supabase database — stores user session records, pose history, and alignment scores.

