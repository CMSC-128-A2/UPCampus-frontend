'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';

export default function SignIn() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    // Check if user is already logged in
    useEffect(() => {
        const user = adminApi.checkAuthenticated();
        if (user) {
            router.push('/admin');
        }
    }, [router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!userId || !password) {
            setError('Please enter both User ID and Password');
            return;
        }
        
        try {
            setIsLoading(true);
            // Authenticate with backend
            await adminApi.authenticate(userId, password);
            
            // Redirect to admin dashboard after successful login
            router.push('/admin');
        } catch (err) {
            console.error('Authentication error:', err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}
                        
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
                                disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
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

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className={`flex-1 h-14 text-xl font-medium bg-[#008CFF] hover:bg-[#0088E8] text-white rounded-lg mt-8 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => router.push('/map')}
                                className="flex-1 h-14 text-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg mt-8"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 