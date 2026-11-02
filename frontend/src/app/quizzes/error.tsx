'use client';

import PixelButton from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';

type QuizzesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function QuizzesError({ error, reset }: QuizzesErrorProps) {
  return (
    <PixelCard title="Something went wrong" strip="violet">
      <div className="flex flex-col items-start gap-4">
        <p className="text-ink-soft">Could not load quizzes. Check that the backend is running.</p>
        {error.digest && <p className="text-ink-soft text-sm">Error ID: {error.digest}</p>}
        <PixelButton onClick={reset}>Try again</PixelButton>
      </div>
    </PixelCard>
  );
}
