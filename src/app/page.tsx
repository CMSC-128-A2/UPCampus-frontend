'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push('/map');
        }, 1000);
    }, [router]);
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <Image
                src="/assets/images/upsee main logo.png"
                alt="UPCampus Explorer"
                width={300}
                height={300}
            />
        </div>
    );
}
