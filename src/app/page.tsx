import Image from 'next/image';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <Image
                src="/assets/images/logo.png"
                alt="UPCampus Explorer"
                width={100}
                height={100}
            />
            <h1 className="text-4xl font-bold mb-2">UPCampus Explorer</h1>
            <a
                href="/map"
                className="bg-accent text-white px-4 py-2 rounded-md"
            >
                View Map
            </a>
        </div>
    );
}
