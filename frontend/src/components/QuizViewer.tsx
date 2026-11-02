'use client';

import { useState } from 'react';
import QuestionView, { type Answer } from '@/components/QuestionView';
import PixelButton from '@/components/ui/PixelButton';
import type { Quiz } from '@/types/quiz';

type QuizViewerProps = {
  quiz: Quiz;
};

function isAnswered(answer: Answer) {
  if (typeof answer === 'string') return answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.length > 0;
  return answer !== undefined;
}

export default function QuizViewer({ quiz }: QuizViewerProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [revealed, setRevealed] = useState(false);

  const allAnswered = quiz.questions.every((question) => isAnswered(answers[String(question.id)]));

  function handleChange(id: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: answer }));
  }

  function handleReset() {
    setAnswers({});
    setRevealed(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col gap-6">
        {quiz.questions.map((question, index) => {
          const id = String(question.id);
          return (
            <li key={id}>
              <QuestionView
                question={question}
                index={index}
                answer={answers[id]}
                revealed={revealed}
                onChange={(answer) => handleChange(id, answer)}
              />
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-4">
        {revealed ? (
          <PixelButton onClick={handleReset}>Try again</PixelButton>
        ) : (
          allAnswered && (
            <PixelButton variant="accent" onClick={() => setRevealed(true)}>
              Show answers
            </PixelButton>
          )
        )}
      </div>
    </div>
  );
}
