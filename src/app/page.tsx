import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <Image
                src="/assets/images/upsee main logo.png"
                alt="UPCampus Explorer"
                width={200}
                height={200}
            />
            <div className="flex gap-4">
                <Link href="/map">
                    <Button>View Map</Button>
                </Link>
                <Link href="/signin">
                    <Button variant="outline">Sign In as Admin</Button>
                </Link>
            </div>
        </div>
    );
}
