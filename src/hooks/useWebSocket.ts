import { useEffect, useRef, useState } from "react";

interface PoseData {
  frame: string;
  landmarks: any[];
  score: number;
  feedback: string;
  feedback_list: string[];
  predicted_pose: string;
  confidence: number;
  joint_colors: Record<string, string>;
  landmarks_detected: boolean;
}

export function useWebSocket(poseName: string) {
  const [poseData, setPoseData] = useState<PoseData | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/api/ws/live");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to backend");
      setConnected(true);
      // Tell backend which pose user selected
      ws.send(JSON.stringify({ pose_name: poseName }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPoseData(data);
      } catch (e) {
        console.error("Failed to parse data", e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    return () => { ws.close(); };
  }, [poseName]);

  return { poseData, connected };
}