import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import QuizForm from '@/components/QuizForm';
import { pixelButtonClasses } from '@/components/ui/PixelButton';

export const metadata: Metadata = {
  title: 'Create quiz | Quiz Builder',
};

function FormFallback() {
  return <p className="font-pixel text-ink-soft animate-pulse text-xs">Loading...</p>;
}

export default function CreateQuizPage() {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <Link href="/quizzes" className={pixelButtonClasses('default', 'sm')}>
          ← Back
        </Link>
      </div>

      <h1 className="font-pixel text-ink text-lg sm:text-2xl">Create quiz</h1>

      {/* useFieldArray generates random ids, so it must stream (Cache Components) */}
      <Suspense fallback={<FormFallback />}>
        <QuizForm />
      </Suspense>
    </section>
  );
}
