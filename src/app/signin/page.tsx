'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement authentication logic here
        router.push('/admin'); // Redirect to admin page after sign-in
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
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] text-lg"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
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