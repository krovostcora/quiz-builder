import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
    return (
        <header className="border-b-4 border-ink bg-mint-200 text-ink">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
                <Link
                    href="/quizzes"
                    className="font-pixel text-sm text-ink sm:text-base"
                >
                    QUIZ BUILDER
                </Link>
                <ThemeToggle />
            </div>
        </header>
    );
}