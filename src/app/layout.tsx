import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'UPsee',
    description: 'UP Cebu Campus Explorer',
    keywords: [
        'UP Cebu',
        'UP Cebu campus',
        'UP Cebu campus map',
        'UP Cebu campus buildings',
        'UP Cebu campus facilities',
        'UP Cebu campus navigation',
        'UP Cebu campus explorer',
        'UP Cebu campus map',
        'UP Cebu campus tour',
        'University of the Philippines Cebu',
        'UP Cebu',
        'UP Cebu campus',
        'UP Cebu campus map',
        'UP Cebu campus buildings',
        'UP Cebu campus facilities',
        'UP Cebu campus navigation',
        'UP Cebu campus explorer',
        'UP Cebu campus map',
        'campus map',
        'university',
        'navigation',
        'buildings',
        'campus explorer',
    ],
    authors: [{ name: 'UP Cebu' }, { name: 'Sheldon Arthurs Sagrado' }],
    creator: 'UP Cebu',
    publisher: 'UP Cebu',
    openGraph: {
        title: 'UPsee - UP Cebu Campus Explorer',
        description:
            'Interactive map and navigation for UP Cebu campus buildings and facilities',
        url: 'https://upsee.sheldonarthursagrado.site',
        siteName: 'UPsee',
        images: '/assets/images/og-image.png',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'UPsee - UP Cebu Campus Explorer',
        description:
            'Interactive map and navigation for UP Cebu campus buildings and facilities',
        images: '/assets/images/og-image.png',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} antialiased`}
                suppressHydrationWarning={true}
            >
                <div className="min-h-screen">{children}</div>
                <Analytics />
            </body>
        </html>
    );
}
