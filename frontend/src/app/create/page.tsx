import type { Metadata } from 'next';
import Link from 'next/link';
import QuizForm from '@/components/QuizForm';
import { pixelButtonClasses } from '@/components/ui/PixelButton';

export const metadata: Metadata = {
    title: 'Create quiz | Quiz Builder',
};

export default function CreateQuizPage() {
    return (
        <section className="flex flex-col gap-8">
            <div>
                <Link href="/quizzes" className={pixelButtonClasses('default', 'sm')}>
                    ← Back
                </Link>
            </div>

            <h1 className="font-pixel text-lg text-ink sm:text-2xl">Create quiz</h1>

            <QuizForm />
        </section>
    );
}