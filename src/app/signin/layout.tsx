import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'Sign In - UPCampus Explorer',
    description: 'Sign in to UPCampus Explorer',
};

export default function SignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen overflow-y-auto">
            {children}
        </div>
    );
} 