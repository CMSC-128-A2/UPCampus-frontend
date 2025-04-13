'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const [userId, setUserId] = useState('baks123');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement authentication logic here
        router.push('/'); // Redirect to home page after sign-in
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Map/Campus Background */}
            <div className="relative flex-grow h-full bg-[#FFF8E7]">
                <Image
                    src="/assets/images/random-building.jpg"
                    alt="UP Campus Map"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            {/* Sign In Form */}
            <div className="flex flex-col items-center justify-center w-full max-w-md bg-white px-8">
                <div className="w-full max-w-[350px] mx-auto">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-[180px] h-[120px]">
                            <Image
                                src="/assets/images/logo.png"
                                alt="UP SEE Manager Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSignIn} className="w-full space-y-5">
                        <div className="space-y-1">
                            <label htmlFor="userId" className="block text-base font-normal text-gray-700">
                                User ID
                            </label>
                            <input
                                id="userId"
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-base font-normal text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 text-lg font-normal bg-[#0096FF] hover:bg-[#0088E8] text-white rounded-md mt-4"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 