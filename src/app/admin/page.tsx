'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import ScheduleModal from '@/components/generics/ScheduleModal';
import ViewScheduleModal from '@/components/generics/ViewScheduleModal';

// Define TypeScript types for the data structure
type ScheduleType = 'Lecture' | 'Laboratory';

interface ClassSection {
    section: string;
    type: ScheduleType;
    room: string;
    schedule: string;
}

interface CourseSchedule {
    id: string;
    courseCode: string;
    sections: ClassSection[];
}

// Mock data for class schedules
const mockClassSchedules: CourseSchedule[] = [
    {
        id: '1',
        courseCode: 'CMSC 126',
        sections: [
            {
                section: 'A',
                type: 'Lecture',
                room: 'SCI 405',
                schedule: 'M TH | 11:00 AM - 12:00 PM'
            },
            {
                section: 'A1',
                type: 'Laboratory',
                room: 'SCI 402',
                schedule: 'TH | 3:00 PM - 6:00 PM'
            },
            {
                section: 'A2',
                type: 'Laboratory',
                room: 'SCI 402',
                schedule: 'M | 3:00 PM - 6:00 PM'
            }
        ]
    },
    {
        id: '2',
        courseCode: 'CMSC 129',
        sections: [
            {
                section: 'A',
                type: 'Lecture',
                room: 'SCI 405',
                schedule: 'M TH | 9:00 AM - 10:00 AM'
            },
            {
                section: 'A1',
                type: 'Laboratory',
                room: 'SCI 404',
                schedule: 'T | 9:00 AM - 12:00 PM'
            },
            {
                section: 'A2',
                type: 'Laboratory',
                room: 'SCI 404',
                schedule: 'F | 9:00 AM - 12:00 PM'
            }
        ]
    }
];

function AdminPage() {
    const [classSchedules, setClassSchedules] = useState(mockClassSchedules);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<{ course: CourseSchedule, section: ClassSection } | null>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openViewModal = (course: CourseSchedule, section: ClassSection) => {
        setSelectedSchedule({ course, section });
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedSchedule(null);
    };

    // Handle delete schedule - would connect to API in real application
    const handleDeleteSchedule = (courseId: string, sectionName: string) => {
        // Filter out the deleted section
        const updatedSchedules = classSchedules.map(course => {
            if (course.id === courseId) {
                return {
                    ...course,
                    sections: course.sections.filter(section => section.section !== sectionName)
                };
            }
            return course;
        });

        // Remove courses with no sections
        const filteredSchedules = updatedSchedules.filter(course => course.sections.length > 0);

        setClassSchedules(filteredSchedules);
    };

    // Handle save new schedule
    const handleSaveSchedule = (scheduleData: {
        courseCode: string;
        section: string;
        type: string;
        room: string;
        day: string;
        time: string;
    }) => {
        // Check if all required fields are filled
        if (!scheduleData.courseCode || !scheduleData.section || !scheduleData.type ||
            !scheduleData.room || !scheduleData.day || !scheduleData.time) {
            alert('Please fill in all fields');
            return;
        }

        // Create the schedule string format
        const scheduleString = `${scheduleData.day} | ${scheduleData.time}`;

        // Find if the course already exists
        const existingCourse = classSchedules.find(
            course => course.courseCode === scheduleData.courseCode
        );

        if (existingCourse) {
            // Add a new section to the existing course
            const updatedSchedules = classSchedules.map(course => {
                if (course.courseCode === scheduleData.courseCode) {
                    // Check if section already exists
                    const sectionExists = course.sections.some(
                        section => section.section === scheduleData.section
                    );

                    if (sectionExists) {
                        alert(`Section ${scheduleData.section} already exists for ${scheduleData.courseCode}`);
                        return course;
                    }

                    return {
                        ...course,
                        sections: [
                            ...course.sections,
                            {
                                section: scheduleData.section,
                                type: scheduleData.type as ScheduleType,
                                room: scheduleData.room,
                                schedule: scheduleString
                            }
                        ]
                    };
                }
                return course;
            });

            setClassSchedules(updatedSchedules);
        } else {
            // Create a new course with the section
            const newCourse: CourseSchedule = {
                id: `${Date.now()}`, // Generate a unique ID
                courseCode: scheduleData.courseCode,
                sections: [
                    {
                        section: scheduleData.section,
                        type: scheduleData.type as ScheduleType,
                        room: scheduleData.room,
                        schedule: scheduleString
                    }
                ]
            };

            setClassSchedules([...classSchedules, newCourse]);
        }
    };

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

                                    <button
                                        onClick={openModal}
                                        className="flex items-center px-4 py-2 bg-[#CCE8FF] text-[#4392F1] font-medium rounded-lg border-[1.5px] text-xl border-[#4392F1] hover:bg-[#b3dbff] hover:border-[#2b7ad9] transition-colors duration-200"
                                    >
                                        <Icon icon="ph:plus-bold" width="20" height="20" className="mr-2" />
                                        Schedule
                                    </button>
                                </div>
                            </div>

                            {/* Class Schedules */}
                            {classSchedules.map((course) => (
                                <div key={course.id} className="bg-white overflow-hidden mb-6 last:mb-0">
                                    <div className="bg-[#CCE8FF] py-3 px-4 text-3xl">
                                        {course.courseCode}
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
                                                {course.sections.map((section, index) => (
                                                    <tr
                                                        key={`${course.id}-${section.section}`}
                                                        className="border-t border-gray-300 hover:bg-[#f9f9f9] transition-colors duration-200 cursor-pointer"
                                                        onClick={() => openViewModal(course, section)}
                                                    >
                                                        <td className="py-3 px-4">{section.section}</td>
                                                        <td className="py-3 px-4">{section.type}</td>
                                                        <td className="py-3 px-4">{section.room}</td>
                                                        <td className="py-3 px-4">{section.schedule}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Modals */}
            <ScheduleModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveSchedule}
            />
            {selectedSchedule && (
                <ViewScheduleModal
                    isOpen={isViewModalOpen}
                    onClose={closeViewModal}
                    courseCode={selectedSchedule.course.courseCode}
                    section={selectedSchedule.section.section}
                    type={selectedSchedule.section.type}
                    room={selectedSchedule.section.room}
                    schedule={selectedSchedule.section.schedule}
                    onDelete={() => {
                        if (selectedSchedule) {
                            handleDeleteSchedule(selectedSchedule.course.id, selectedSchedule.section.section);
                            closeViewModal();
                        }
                    }}
                />
            )}
        </div>
    );
}

export default AdminPage;
