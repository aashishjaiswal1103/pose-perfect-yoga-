interface Props {
  feedback: string;
  landmarks_detected: boolean;
}

export function FeedbackPanel({ feedback, landmarks_detected }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-2xl font-serif text-[#5c4a3d] uppercase tracking-wider">Feedback</h3>
      <p className="text-xl text-[#4a4a4a] leading-relaxed">
        {feedback || "Stand in front of the camera"}
      </p>
    </div>
  );
}