'use client';

import Link from 'next/link';
import { useState } from 'react';
import QuizCardMenu from '@/components/QuizCardMenu';
import { pixelButtonClasses } from '@/components/ui/PixelButton';
import PixelCard from '@/components/ui/PixelCard';
import { EmptyFolderIcon } from '@/components/ui/PixelIcons';
import { ApiError, deleteQuiz } from '@/lib/api';
import type { QuizListItem } from '@/types/quiz';

interface QuizListProps {
  initialQuizzes: QuizListItem[];
}

export default function QuizList({ initialQuizzes }: QuizListProps) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    setError(null);
    setDeletingId(id);
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        // Already deleted elsewhere, just drop it from the page
        setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
      } else {
        setError(e instanceof Error ? e.message : 'Failed to delete quiz');
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className="border-ink bg-surface flex flex-col items-center gap-6 border-4 border-dashed px-4 py-12 text-center">
        <span className="text-ink-soft">
          <EmptyFolderIcon />
        </span>
        <p className="font-pixel text-xs leading-relaxed">No quizzes yet</p>
        <Link href="/create" className={pixelButtonClasses('accent')}>
          Create quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p
          role="alert"
          className="border-danger-dark bg-surface text-danger-dark border-4 px-4 py-3 text-xl"
        >
          {error}
        </p>
      )}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <PixelCard
              className="h-full"
              title={quiz.createdAt.slice(0, 10)}
              actions={
                <QuizCardMenu
                  disabled={deletingId === quiz.id}
                  onDelete={() => handleDelete(quiz.id)}
                  editHref={`/quizzes/${quiz.id}/edit`}
                />
              }
            >
              <div className="flex flex-col gap-4">
                <h2 className="font-pixel text-sm leading-relaxed break-words">{quiz.title}</h2>
                <p className="text-ink-soft text-xl">
                  {quiz.questionsCount} {quiz.questionsCount === 1 ? 'question' : 'questions'}
                </p>
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className={pixelButtonClasses('default', 'sm', 'self-start')}
                >
                  Open
                </Link>
              </div>
            </PixelCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
