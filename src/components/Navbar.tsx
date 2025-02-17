'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
    {
        label: 'Contact',
        href: '/contact',
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
                    <a
                        key={item.href}
                        href={item.href}
                        className={`font-medium ${
                            pathname === item.href
                                ? 'text-yellow-accent'
                                : 'text-white'
                        }`}
                    >
                        {item.label}
                    </a>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </nav>
    );
}
