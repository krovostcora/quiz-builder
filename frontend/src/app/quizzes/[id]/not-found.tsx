import Link from 'next/link';
import PixelCard from '@/components/ui/PixelCard';
import { pixelButtonClasses } from '@/components/ui/PixelButton';

export default function QuizNotFound() {
    return (
        <PixelCard title="Quiz not found" strip="violet">
            <div className="flex flex-col items-start gap-4">
                <p className="text-ink-soft">
                    This quiz does not exist or was deleted.
                </p>
                <Link href="/quizzes" className={pixelButtonClasses('default', 'md')}>
                    ← Back to quizzes
                </Link>
            </div>
        </PixelCard>
    );
}