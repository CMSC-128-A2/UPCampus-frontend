'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    Clock,
    BookOpen,
    Building,
    Users,
    Code,
    Check,
} from 'lucide-react';

export default function Home() {
    const router = useRouter();

    return (
        <div className="h-lvh max-h-lvh overflow-y-auto">
            <div className="w-full overflow-x-hidden bg-gradient-to-b from-background to-white">
                {/* Header */}
                <header className="fixed w-full z-30 bg-white bg-opacity-95 shadow-md">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center py-3">
                            <div className="flex items-center space-x-1">
                                <Image
                                    src="/assets/images/upseelogo.png"
                                    alt="UPsee Logo"
                                    width={100}
                                    height={40}
                                    className="h-8 w-auto"
                                />
                                <Image
                                    src="/assets/images/UPC header logo.png"
                                    alt="UP Cebu Logo"
                                    width={200}
                                    height={200}
                                    className="h-10 w-auto"
                                />
                            </div>
                            <nav className="hidden md:flex space-x-8">
                                <Link
                                    href="/"
                                    className="text-green-accent hover:text-maroon-accent font-medium transition duration-300"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/map"
                                    className="text-green-accent hover:text-maroon-accent font-medium transition duration-300"
                                >
                                    Campus Map
                                </Link>
                                <Link
                                    href="/#about"
                                    className="text-green-accent hover:text-maroon-accent font-medium transition duration-300"
                                >
                                    About Us
                                </Link>
                            </nav>
                            <div className="md:hidden">
                                <button className="p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-green-accent"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section - With grid background pattern */}
                <div className="relative pt-24 pb-16 flex content-center items-center justify-center">
                    {/* Grid background pattern */}
                    <div className="absolute inset-0 bg-white/90 [background-image:linear-gradient(#22c55e1a_1px,transparent_1px),linear-gradient(to_right,#22c55e1a_1.5px,transparent_1.5px)] [background-size:3rem_3rem]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_75%,white_100%)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60"></div>

                    {/* Content */}
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-wrap items-center">
                            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-green-accent mb-4">
                                    Explore UP Cebu Campus
                                </h1>
                                <p className="text-lg md:text-xl text-gray-600 mb-8">
                                    Navigate through buildings, find facilities,
                                    and discover the beauty of UP Cebu campus
                                    with our interactive map.{' '}
                                    <span className="font-semibold text-maroon-accent">
                                        Get real-time room schedules
                                    </span>{' '}
                                    to plan your day efficiently!
                                </p>
                                <Button
                                    onClick={() => router.push('/map')}
                                    variant="default"
                                    size="lg"
                                    className="bg-maroon-accent hover:bg-red-700 text-white font-bold shadow-lg transform hover:-translate-y-1"
                                >
                                    Explore Campus Map
                                    <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto mt-8 lg:mt-0">
                                <Image
                                    src="/assets/images/up_map.png"
                                    alt="UP Cebu Campus Map"
                                    width={800}
                                    height={480}
                                    className="max-w-full h-auto relative z-10"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section - Reducing padding for better spacing */}
                <div className="py-12 md:py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center text-center mb-12">
                            <div className="w-full lg:w-6/12 px-4">
                                <h2 className="text-4xl font-bold text-green-accent">
                                    UPSee Features
                                </h2>
                                <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-600">
                                    Discover what UP Cebu campus has to offer
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            {/* Live Room Schedules Feature */}
                            <div className="w-full md:w-4/12 px-4 text-center mb-10">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full h-full mb-8 shadow-lg rounded-lg p-6 border-t-4 border-maroon-accent">
                                    <div className="p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-5 shadow-lg rounded-full bg-maroon-accent mx-auto">
                                        <Clock className="h-8 w-8 text-white" />
                                    </div>
                                    <h6 className="text-xl font-semibold">
                                        Live Room Schedules
                                    </h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Access real-time information about room
                                        availability and class schedules to
                                        efficiently plan your campus activities.
                                    </p>
                                </div>
                            </div>

                            {/* Academic Excellence */}
                            <div className="w-full md:w-4/12 px-4 text-center mb-10">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full h-full mb-8 shadow-lg rounded-lg p-6 border-t-4 border-green-accent">
                                    <div className="p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-5 shadow-lg rounded-full bg-green-accent mx-auto">
                                        <BookOpen className="h-8 w-8 text-white" />
                                    </div>
                                    <h6 className="text-xl font-semibold">
                                        Academic Excellence
                                    </h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Find your way to lecture halls,
                                        libraries, and research centers that
                                        foster academic growth.
                                    </p>
                                </div>
                            </div>

                            {/* Modern Facilities */}
                            <div className="w-full md:w-4/12 px-4 text-center mb-10">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full h-full mb-8 shadow-lg rounded-lg p-6 border-t-4 border-yellow-600">
                                    <div className="p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-5 shadow-lg rounded-full bg-yellow-600 mx-auto">
                                        <Building className="h-8 w-8 text-white" />
                                    </div>
                                    <h6 className="text-xl font-semibold">
                                        Modern Facilities
                                    </h6>
                                    <p className="mt-2 mb-4 text-gray-600">
                                        Explore our state-of-the-art facilities
                                        designed to enhance learning and student
                                        experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section - Reducing padding for better spacing */}
                <div className="py-12 md:py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center">
                            <div className="w-full md:w-5/12 ml-auto mr-auto px-4 mb-8 md:mb-0">
                                <Image
                                    src="/assets/images/og-image.png"
                                    alt="UP Cebu Campus"
                                    width={500}
                                    height={300}
                                    className="rounded-lg shadow-xl max-w-full h-auto"
                                />
                            </div>
                            <div className="w-full md:w-6/12 ml-auto mr-auto px-4">
                                <div className="md:pr-12">
                                    <h3 className="text-3xl font-bold text-green-accent">
                                        About UP Cebu
                                    </h3>
                                    <p className="mt-4 text-lg leading-relaxed text-gray-600">
                                        The University of the Philippines Cebu
                                        is a constituent university of the
                                        University of the Philippines System. It
                                        offers courses in the fields of
                                        management, humanities, social sciences,
                                        natural sciences, and computer science.
                                    </p>
                                    <div className="mt-4 mb-6">
                                        <a
                                            href="https://www.upcebu.edu.ph"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center bg-green-accent hover:bg-green-accent/80 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                                        >
                                            Visit UP Cebu Website
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </a>
                                    </div>
                                    <ul className="list-none mt-6">
                                        <li className="py-2">
                                            <div className="flex items-center">
                                                <div className="text-green-600 mr-3">
                                                    <Check className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-gray-800 font-semibold">
                                                        Excellence in Education
                                                    </h4>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="py-2">
                                            <div className="flex items-center">
                                                <div className="text-green-600 mr-3">
                                                    <Check className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-gray-800 font-semibold">
                                                        Research and Innovation
                                                    </h4>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="py-2">
                                            <div className="flex items-center">
                                                <div className="text-green-600 mr-3">
                                                    <Check className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-gray-800 font-semibold">
                                                        Live Room Schedules
                                                    </h4>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="py-2">
                                            <div className="flex items-center">
                                                <div className="text-green-600 mr-3">
                                                    <Check className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-gray-800 font-semibold">
                                                        Community Service
                                                    </h4>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us - Student Developers Section */}
                <div className="py-12 md:py-16 bg-white" id="about">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap justify-center text-center mb-12">
                            <div className="w-full lg:w-6/12 px-4">
                                <h2 className="text-4xl font-bold text-green-accent">
                                    About Us
                                </h2>
                                <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-600">
                                    The team behind UPsee
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full md:w-8/12 lg:w-6/12 px-4 text-center">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg p-8">
                                    <div className="p-3 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-green-accent mx-auto">
                                        <Code className="h-10 w-10 text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-2">
                                        Computer Science Students
                                    </h4>
                                    <p className="text-lg text-gray-600 mb-4">
                                        We are computer science students from
                                        the University of the Philippines Cebu.
                                        This project is part of our requirement
                                        in{' '}
                                        <span className="font-bold text-maroon-accent">
                                            CMSC126: Web Engineering
                                        </span>
                                        .
                                    </p>
                                    <p className="text-md text-gray-500">
                                        Our goal is to create a user-friendly
                                        campus explorer that helps students
                                        navigate the UP Cebu campus efficiently
                                        while providing real-time information
                                        about room schedules and facilities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Reducing padding */}
                <footer className="bg-green-accent text-white pt-4 pb-2 md:pt-6 md:pb-2">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap text-center lg:text-left">
                            <div className="w-full lg:w-6/12 px-4">
                                <div className="flex items-center justify-center lg:justify-start mb-4">
                                    <Image
                                        src="/assets/images/upseelogo.png"
                                        alt="UPsee Logo"
                                        width={120}
                                        height={48}
                                        className="h-10 w-auto"
                                    />
                                </div>
                                <h5 className="text-lg mt-0 mb-2">
                                    UPSee - UP Cebu Campus Explorer
                                </h5>
                            </div>
                            <div className="w-full lg:w-6/12 px-4">
                                <div className="flex flex-wrap items-top mb-6">
                                    <div className="w-full lg:w-4/12 px-4 ml-auto mt-10 lg:mt-0">
                                        <ul className="list-unstyled">
                                            <li>
                                                <a
                                                    className="text-white hover:text-gray-300 font-semibold block pb-2 text-sm"
                                                    href="https://www.up.edu.ph/"
                                                >
                                                    UP System
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="text-white hover:text-gray-300 font-semibold block pb-2 text-sm"
                                                    href="https://www.upcebu.edu.ph/"
                                                >
                                                    UP Cebu
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="my-2 border-gray-100/10" />
                    <div className="flex flex-wrap items-center md:justify-between justify-center">
                        <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                            <div className="text-sm text-white font-semibold py-1">
                                © {new Date().getFullYear()} UPsee - UP Cebu
                                Campus Explorer
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
