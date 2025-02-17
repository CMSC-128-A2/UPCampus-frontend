import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-2">
            <Image
                src="/assets/images/logo.png"
                alt="UPCampus Explorer"
                width={200}
                height={200}
            />
            <h1 className="text-6xl font-extrabold text-center">
                <span className="text-maroon-accent">UPC</span>
                <span className="text-yellow-accent">ampus</span>
                <span className="text-green-accent"> Explorer</span>
            </h1>
            <p className="text-center text-gray-500 mb-4">
                This will be a landing page
            </p>
            <Link
                href="/map"
                className="bg-green-accent text-white px-4 py-2 rounded-md"
            >
                View Map
            </Link>
        </div>
    );
}
