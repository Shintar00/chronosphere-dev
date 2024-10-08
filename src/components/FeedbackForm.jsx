import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FeedbackForm = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
    setFeedback("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="フィードバックを入力してください"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button type="submit">フィードバックを送信</Button>
    </form>
  );
};

export default FeedbackForm;