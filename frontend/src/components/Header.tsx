import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className="border-ink bg-mint-200 text-ink border-b-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/quizzes" className="font-pixel text-ink text-sm sm:text-base">
          QUIZ BUILDER
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
