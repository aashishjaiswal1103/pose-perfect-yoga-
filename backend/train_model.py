import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# ── 1. Load all CSV files and combine them ──────────────────────────────────

DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")

# Map each file to a clean pose name
FILES = {
    "DownwardDog_Combined.csv":      "Downward Dog",
    "Veerabhadrasana_Combined.csv":  "Warrior Pose",
    "Vrukshana_Combined.csv":        "Tree Pose",
    "Triangle_Combined.csv":         "Triangle Pose",
    "ArdhaChandrasana_Combined.csv": "Half Moon Pose",
    "UtkataKonasana_Combined.csv":   "Chair Pose",
    "BaddhaKonasana_Combined.csv":   "Butterfly Pose",
    "Bridge_Combined.csv":           "Bridge Pose",
    "CatCow_Combined.csv":           "Cat-Cow Pose",
    "Cobra_Combined.csv":            "Cobra Pose",
    "Lotus_Combined.csv":            "Lotus Pose",
    "Mountain_Combined.csv":         "Mountain Pose",
}

# The 14 angle columns we use as features
FEATURES = [
    "left_elbow_angle",
    "right_elbow_angle",
    "left_shoulder_angle",
    "right_shoulder_angle",
    "left_knee_angle",
    "right_knee_angle",
    "left_hip_angle",
    "right_hip_angle",
    "hand_angle",
    "angle_for_ardhaChandrasana1",
    "angle_for_ardhaChandrasana2",
    "neck_angle_uk",
    "left_wrist_angle_bk",
    "right_wrist_angle_bk",
]

all_data = []

for filename, pose_name in FILES.items():
    filepath = os.path.join(DATASET_DIR, filename)
    df = pd.read_csv(filepath)

    # Keep only the 14 feature columns
    df = df[FEATURES].copy()

    # Add the label column
    df["pose"] = pose_name

    all_data.append(df)
    print(f"Loaded {filename} — {len(df)} rows — label: {pose_name}")

# Combine all into one dataframe
combined = pd.concat(all_data, ignore_index=True)
print(f"\nTotal rows: {len(combined)}")
print(f"Poses: {combined['pose'].unique()}")

# ── 2. Prepare features and labels ──────────────────────────────────────────

X = combined[FEATURES].values
y = combined["pose"].values

# ── 3. Split into train and test ─────────────────────────────────────────────

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\nTraining on {len(X_train)} samples")
print(f"Testing on  {len(X_test)} samples")

# ── 4. Train the Random Forest model ─────────────────────────────────────────

print("\nTraining Random Forest classifier...")

model = RandomForestClassifier(
    n_estimators=100,   # 100 decision trees
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

# ── 5. Evaluate accuracy ──────────────────────────────────────────────────────

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy * 100:.1f}%")
print("\nDetailed Report:")
print(classification_report(y_test, y_pred))

# ── 6. Save the trained model ─────────────────────────────────────────────────

MODEL_PATH = os.path.join(os.path.dirname(__file__), "pose_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "feature_names.pkl")

with open(MODEL_PATH, "wb") as f:
    pickle.dump(model, f)

with open(FEATURES_PATH, "wb") as f:
    pickle.dump(FEATURES, f)

print(f"\nModel saved to: pose_model.pkl")
print(f"Features saved to: feature_names.pkl")
print("\nTraining complete!")