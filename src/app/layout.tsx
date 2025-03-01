import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/generics/Navbar';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'UPCampus Explorer',
    description: 'UPCampus Explorer',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} antialiased`}>
                <Navbar />
                <div className="h-[calc(100vh-62px)] overflow-y-auto">
                    {children}
                </div>
            </body>
        </html>
    );
}
