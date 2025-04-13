'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';

function AdminPage() {
    return (
        <div className="flex flex-col h-screen">
            {/* Header with logo and faculty button */}
            <div className="flex justify-between items-center px-6 bg-white border-b w-full">
                <div className="flex items-center gap-2">
                    <Image
                        src="/assets/images/manager-page-logo.svg"
                        alt="UP Logo"
                        width={210}
                        height={70}
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <Link href="/faculty" className="text-[#008CFF] border border-[#008CFF] px-5 py-2 mr-3 text-xl rounded-lg flex items-center justify-center hover:bg-[#E6F4FF] hover:border-[#0070cc] transition-colors duration-200">
                    <Icon icon="ph:graduation-cap-bold" width="20" height="20" className="mr-2" />
                    Faculty
                </Link>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - now starts below header */}
                <div className="w-60 bg-white border-r overflow-y-auto flex flex-col">
                    <nav className="flex-1">
                        <ul className="space-y-1">
                            <li>
                                <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] transition-colors duration-200">
                                    <Icon icon="ph:user-bold" width="24" height="24" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] transition-colors duration-200">
                                    <Icon icon="ph:users-bold" width="24" height="24" />
                                </Link>
                            </li>
                            <li className="bg-[#E9F2E1]">
                                <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#dbe9ce] transition-colors duration-200">
                                    <Icon icon="ph:book-open-bold" width="24" height="24" className="mr-3" />
                                    <span>My Classes</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] transition-colors duration-200">
                                    <Icon icon="ph:users-three-bold" width="24" height="24" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] transition-colors duration-200">
                                    <Icon icon="ph:map-trifold-bold" width="24" height="24" className="mr-3" />
                                    <span>Campus Map</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="mt-auto border-t border-gray-200">
                        <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] hover:text-red-600 transition-colors duration-200">
                            <Icon icon="ph:sign-out-bold" width="24" height="24" className="mr-3" />
                            <span>Sign Out</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-[#F3F3F3] overflow-y-auto">
                    <div className="m-8 bg-white border border-gray200 rounded-lg">
                        <div className="p-6">
                            <h1 className="text-3xl font-semibold mb-6">Science Building</h1>

                            {/* Search and Floor Selection */}
                            <div className="mb-6">
                                <div className="mb-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Icon icon="ph:magnifying-glass" width="20" height="20" className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none"
                                            placeholder="Search"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button className="flex items-center px-4 py-2 bg-[#E9F2E1] text-[#93BF6A] font-medium rounded-lg border-[1.5px] text-xl border-[#93BF6A] hover:bg-[#dbe9ce] hover:border-[#7da054] transition-colors duration-200">
                                        <Icon icon="ph:caret-down-bold" width="20" height="20" className="mr-2" />
                                        4th Floor
                                    </button>

                                    <button className="flex items-center px-4 py-2 bg-[#CCE8FF] text-[#4392F1] font-medium rounded-lg border-[1.5px] text-xl border-[#4392F1] hover:bg-[#b3dbff] hover:border-[#2b7ad9] transition-colors duration-200">
                                        <Icon icon="ph:plus-bold" width="20" height="20" className="mr-2" />
                                        Schedule
                                    </button>
                                </div>
                            </div>

                            {/* Class Schedules */}
                            <div className="bg-white overflow-hidden mb-6">
                                {/* CMSC 126 */}
                                <div className="bg-[#CCE8FF] py-3 px-4 text-3xl">
                                    CMSC 126
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-[#F3F3F3]">
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Section</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Type</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Room Assigned</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Schedule</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-gray-300 hover:bg-[#f9f9f9] transition-colors duration-200">
                                                <td className="py-3 px-4">A</td>
                                                <td className="py-3 px-4">Lecture</td>
                                                <td className="py-3 px-4">SCI 405</td>
                                                <td className="py-3 px-4">M TH | 11:00 AM - 12:00 PM</td>
                                            </tr>
                                            <tr className="border-t border-gray-300 hover:bg-[#f9f9f9] transition-colors duration-200">
                                                <td className="py-3 px-4">A1</td>
                                                <td className="py-3 px-4">Laboratory</td>
                                                <td className="py-3 px-4">SCI 402</td>
                                                <td className="py-3 px-4">TH | 3:00 PM - 6:00 PM</td>
                                            </tr>
                                            <tr className="border-t border-gray-300 hover:bg-[#f9f9f9] transition-colors duration-200">
                                                <td className="py-3 px-4">A2</td>
                                                <td className="py-3 px-4">Laboratory</td>
                                                <td className="py-3 px-4">SCI 402</td>
                                                <td className="py-3 px-4">M | 3:00 AM - 6:00 PM</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* CMSC 129 */}
                            <div className="bg-white overflow-hidden">
                                <div className="bg-[#CCE8FF] py-3 px-4 text-3xl">
                                    CMSC 129
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-[#F3F3F3]">
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Section</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Type</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Room Assigned</th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">Schedule</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-gray-300 hover:bg-[#f9f9f9] transition-colors duration-200">
                                                <td className="py-3 px-4">A</td>
                                                <td className="py-3 px-4">Lecture</td>
                                                <td className="py-3 px-4">SCI 405</td>
                                                <td className="py-3 px-4">M TH | 9:00 AM - 10:00 AM</td>
                                            </tr>
                                            <tr className="border-t border-gray-300 hover:bg-[#f9f9f9] transition-colors duration-200">
                                                <td className="py-3 px-4">A1</td>
                                                <td className="py-3 px-4">Laboratory</td>
                                                <td className="py-3 px-4">SCI 404</td>
                                                <td className="py-3 px-4">T | 9:00 AM - 12:00 PM</td>
                                            </tr>
                                            <tr className="border-t border-gray-300 hover:bg-[#f9f9f9] transition-colors duration-200">
                                                <td className="py-3 px-4">A2</td>
                                                <td className="py-3 px-4">Laboratory</td>
                                                <td className="py-3 px-4">SCI 404</td>
                                                <td className="py-3 px-4">F | 9:00 AM - 12:00 PM</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
