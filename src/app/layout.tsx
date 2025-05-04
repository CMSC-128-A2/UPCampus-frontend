import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
        'campus map',
        'university',
        'navigation',
        'buildings',
        'campus explorer',
    ],
    authors: [{ name: 'UP Cebu' }],
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
            <body className={`${inter.variable} antialiased`}>
                <div className="h-screen">{children}</div>
            </body>
        </html>
    );
}
