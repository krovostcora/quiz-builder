'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/create', label: 'Create' },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="border-b-4 border-ink bg-mint-200 text-ink">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
                <Link
                    href="/quizzes"
                    className="font-pixel text-sm text-ink sm:text-base"
                >
                    QUIZ BUILDER
                </Link>
                <nav className="flex gap-2">
                    {links.map(({ href, label }) => {
                        const active = pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className={`font-pixel border-4 px-3 py-2 text-[10px] text-ink uppercase ${
                                    active
                                        ? 'border-ink bg-white shadow-pixel-sm'
                                        : 'border-transparent hover:border-ink hover:bg-mint-100'
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}