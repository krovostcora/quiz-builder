import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuizForm from '@/components/QuizForm';
import { pixelButtonClasses } from '@/components/ui/PixelButton';
import { ApiError, getQuiz } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Edit quiz | Quiz Builder',
};

type EditQuizPageProps = {
  params: Promise<{ id: string }>;
};

// Awaiting params and fetching must both live inside Suspense (Cache Components)
async function EditQuizContent({ params }: EditQuizPageProps) {
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
      <div>
        <Link href={`/quizzes/${quiz.id}`} className={pixelButtonClasses('default', 'sm')}>
          ← Back
        </Link>
      </div>

      <h1 className="font-pixel text-ink text-lg sm:text-2xl">Edit quiz</h1>

      {/* Key resets the form when the quiz was updated elsewhere */}
      <QuizForm key={quiz.updatedAt} quiz={quiz} />
    </>
  );
}

function EditFallback() {
  return <p className="font-pixel text-ink-soft animate-pulse text-xs">Loading...</p>;
}

export default function EditQuizPage({ params }: EditQuizPageProps) {
  return (
    <section className="flex flex-col gap-8">
      <Suspense fallback={<EditFallback />}>
        <EditQuizContent params={params} />
      </Suspense>
    </section>
  );
}
