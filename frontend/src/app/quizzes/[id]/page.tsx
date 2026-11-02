import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuizViewer from '@/components/QuizViewer';
import { pixelButtonClasses } from '@/components/ui/PixelButton';
import { ApiError, getQuiz } from '@/lib/api';

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

// Awaiting params and fetching must both live inside Suspense (Cache Components)
async function QuizContent({ params }: QuizDetailPageProps) {
  const { id } = await params;

  let quiz;
  try {
    quiz = await getQuiz(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-pixel text-ink text-lg break-words sm:text-2xl">{quiz.title}</h1>
        <p className="text-ink-soft">
          {quiz.questions.length} questions · created{' '}
          {dateFormatter.format(new Date(quiz.createdAt))}
        </p>
      </div>

      <QuizViewer key={quiz.updatedAt} quiz={quiz} />
    </>
  );
}

function QuizFallback() {
  return <p className="font-pixel text-ink-soft animate-pulse text-xs">Loading...</p>;
}

export default function QuizDetailPage({ params }: QuizDetailPageProps) {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <Link href="/quizzes" className={pixelButtonClasses('default', 'sm')}>
          ← Back
        </Link>
      </div>

      <Suspense fallback={<QuizFallback />}>
        <QuizContent params={params} />
      </Suspense>
    </section>
  );
}
