from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Yoga Pose Perfect Backend API"}
    print("Root endpoint test passed.")

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    print("Health check endpoint test passed.")

if __name__ == "__main__":
    test_read_root()
    test_health_check()
    print("All tests passed successfully.")
