import type { Metadata } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';
import { Suspense } from 'react';
import Header from '@/components/Header';
import './globals.css';

const pressStart = Press_Start_2P({
    weight: '400',
    subsets: ['latin', 'cyrillic'],
    variable: '--font-press-start',
    display: 'swap',
});

const vt323 = VT323({
    weight: '400',
    subsets: ['latin', 'vietnamese'],
    variable: '--font-vt323',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Quiz Builder',
    description: 'Create and browse your quizzes',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${pressStart.variable} ${vt323.variable}`}
            suppressHydrationWarning
        >
        <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <Suspense fallback={<div className="h-20 border-b-4 border-ink bg-mint-200" />}>
            <Header />
        </Suspense>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
        </main>
        </body>
        </html>
    );
}