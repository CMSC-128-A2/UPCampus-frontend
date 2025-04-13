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
            <div className="relative w-1/2 h-full bg-[#FFF8E7]">
                <Image
                    src="/assets/images/sign-in-map.svg"
                    alt="UP Campus Map"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            {/* Sign In Form */}
            <div className="flex flex-col items-center justify-center w-1/2 bg-white px-10">
                <div className="w-full max-w-[500px] mx-auto">
                    {/* Logo */}
                    <div className="flex justify-center mb-12">
                        <div className="relative w-[320px] h-[200px]">
                            <Image
                                src="/assets/images/manager-logo.svg"
                                alt="UP SEE Manager Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSignIn} className="w-full space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="userId" className="block text-base font-normal text-[#008CFF]">
                                User ID
                            </label>
                            <input
                                id="userId"
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] text-lg"
                                placeholder="Enter your user ID"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-base font-normal text-[#008CFF]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] text-lg"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 text-xl font-medium bg-[#008CFF] hover:bg-[#0088E8] text-white rounded-lg mt-8"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 