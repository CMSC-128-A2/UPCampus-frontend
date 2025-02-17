'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Map',
        href: '/map',
    },
    {
        label: 'About',
        href: '/about',
    },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex justify-between items-center p-3 px-4 bg-maroon-accent text-white h-[62px] max-h-[62px]">
            <Image
                src="/assets/images/UPC header logo.png"
                alt="UPCampus Explorer"
                height={32}
                width={200}
            />
            <div className="flex gap-6 items-center">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`font-medium ${
                            pathname === item.href
                                ? 'text-yellow-accent'
                                : 'text-white'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
                <div className="w-8 h-8 rounded-full bg-green-accent flex items-center justify-center overflow-hidden">
                    <Image
                        src="/assets/images/gwapo.png"
                        alt="Profile"
                        width={32}
                        height={32}
                        // className="object-cover w-full h-full rounded-full"
                    />
                </div>
            </div>
        </nav>
    );
}
