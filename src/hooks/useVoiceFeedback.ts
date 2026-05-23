import { useEffect, useRef } from 'react';

export function useVoiceFeedback(feedback: string, soundEnabled: boolean) {
  const lastSpokenRef = useRef<number>(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const previousFeedbackRef = useRef<string>("");

  // Initialize synthesis engine
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Handle the speech logic
  useEffect(() => {
    if (!soundEnabled || !synthRef.current || !feedback) return;

    // Ignore placeholder messages
    if ( feedback === "Adjusting...") {
      return;
    }

    const now = Date.now();
    const timeSinceLastSpoken = now - lastSpokenRef.current;
    
    const isNewFeedback = feedback !== previousFeedbackRef.current;
    
    if ((isNewFeedback && timeSinceLastSpoken > 3000) || timeSinceLastSpoken > 6000) {
      
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(feedback);
      utterance.rate = 1.0;  // Normal speed
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Max volume
      
      synthRef.current.speak(utterance);
      
      // Update our refs to track what we just spoke and when
      lastSpokenRef.current = now;
      previousFeedbackRef.current = feedback;
    }
  }, [feedback, soundEnabled]);
}
