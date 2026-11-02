import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import QuizList from '@/components/QuizList';
import { pixelButtonClasses } from '@/components/ui/PixelButton';
import { getQuizzes } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Quizzes | Quiz Builder',
};

// Dynamic fetch must live inside Suspense (Cache Components)
async function QuizzesContent() {
    const quizzes = await getQuizzes();

    // Key remounts the list when quizzes change, so its local state resets
    const listKey = quizzes.map((quiz) => quiz.id).join('-');

    return <QuizList key={listKey} initialQuizzes={quizzes} />;
}

function QuizzesFallback() {
    return (
        <p className="animate-pulse font-pixel text-xs text-ink-soft">Loading...</p>
    );
}

export default function QuizzesPage() {
    return (
        <section className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-pixel text-lg text-ink sm:text-2xl">My quizzes</h1>
                <Link href="/create" className={pixelButtonClasses('accent', 'md')}>
                    + Create quiz
                </Link>
            </div>

            <Suspense fallback={<QuizzesFallback />}>
                <QuizzesContent />
            </Suspense>
        </section>
    );
}