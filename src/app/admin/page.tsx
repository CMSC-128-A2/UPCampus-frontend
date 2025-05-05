'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import ScheduleModal from '@/components/schedule/ScheduleModal';
import ViewScheduleModal from '@/components/schedule/ViewScheduleModal';
import EditScheduleModal from '@/components/schedule/EditScheduleModal';
import { schedulesApi, parseSchedule, Course, ClassSection as ApiClassSection } from '@/lib/api';
import RootExtensionWrapper from './RootExtensionWrapper';

// Define TypeScript types for the data structure
type ScheduleType = 'Lecture' | 'Laboratory';

interface ClassSection {
    id: string; // Remove the optional marker (?) to make id required
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

function AdminPage() {
    const [classSchedules, setClassSchedules] = useState<CourseSchedule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<{ course: CourseSchedule, section: ClassSection } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const courses = await schedulesApi.getCourses();
                setClassSchedules(courses);
                setError(null);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load schedules. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Filter class schedules based on search query
    const filteredSchedules = searchQuery.trim() === ''
        ? classSchedules
        : classSchedules.filter(course => {
            // Search in course code
            if (course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())) {
                return true;
            }

            // Search in sections
            return course.sections.some(section =>
                section.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
                section.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                section.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
                section.schedule.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });

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

    const openEditModal = () => {
        setIsViewModalOpen(false);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Handle delete schedule
    const handleDeleteSchedule = async (courseId: string, sectionName: string) => {
        try {
            await schedulesApi.deleteSection(courseId, sectionName);
            
            // Update local state after successful API call
            const updatedSchedules = classSchedules.map(course => {
                if (course.id === courseId) {
                    return {
                        ...course,
                        sections: course.sections.filter(section => section.section !== sectionName)
                    };
                }
                return course;
            });

            // Check if the course has any sections left
            const course = updatedSchedules.find(c => c.id === courseId);
            if (course && course.sections.length === 0) {
                // If no sections left, delete the course
                await schedulesApi.deleteCourse(courseId);
                // Remove the course from the list
                const filteredSchedules = updatedSchedules.filter(c => c.id !== courseId);
                setClassSchedules(filteredSchedules);
            } else {
                // Otherwise just update the schedules
                setClassSchedules(updatedSchedules);
            }
        } catch (error) {
            console.error('Error deleting section:', error);
            alert('Failed to delete section. Please try again.');
        }
    };

    // Handle save new schedule
    const handleSaveSchedule = async (scheduleData: {
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

        try {
            // Format data for API
            const apiData = {
                course_code: scheduleData.courseCode,
                                section: scheduleData.section,
                type: scheduleData.type,
                                room: scheduleData.room,
                day: scheduleData.day,
                time: scheduleData.time
            };

            // Call API to create section
            await schedulesApi.createSection(apiData);
            
            // Refresh the course list to get updated data
            const courses = await schedulesApi.getCourses();
            setClassSchedules(courses);
        } catch (error: any) {
            console.error('Error saving schedule:', error);
            alert(error.message || 'Failed to save schedule. Please try again.');
        }
    };

    // Handle edit schedule
    const handleEditSchedule = async (sectionId: string, scheduleData: {
        course_code?: string;
        section: string;
        type: string;
        room: string;
        day: string;
        time: string;
    }) => {
        try {
            await schedulesApi.updateSection(sectionId, scheduleData);
            
            // Refresh the course list to get updated data
            const courses = await schedulesApi.getCourses();
            setClassSchedules(courses);
        } catch (error: any) {
            console.error('Error updating schedule:', error);
            alert(error.message || 'Failed to update schedule. Please try again.');
        }
    };

    const renderContent = () => (
        <>
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
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
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

                            {/* Loading State */}
                            {isLoading && (
                                <div className="bg-white p-8 rounded-lg text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4392F1] mb-4"></div>
                                        <h3 className="text-xl font-medium text-gray-700">Loading schedules...</h3>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !isLoading && (
                                <div className="bg-white p-8 rounded-lg text-center">
                                    <div className="flex flex-col items-center">
                                        <Icon icon="ph:warning-circle" width="48" height="48" className="text-red-500 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">{error}</h3>
                                        <button 
                                            className="mt-4 px-4 py-2 bg-[#4392F1] text-white rounded-lg"
                                            onClick={() => window.location.reload()}
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Class Schedules */}
                            {!isLoading && !error && filteredSchedules.length > 0 ? (
                                filteredSchedules.map((course) => (
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
                                ))
                            ) : !isLoading && !error && (
                                <div className="bg-white p-8 rounded-lg text-center">
                                    <div className="flex flex-col items-center">
                                        <Icon icon="ph:magnifying-glass" width="48" height="48" className="text-gray-400 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-700 mb-2">No matching schedules found</h3>
                                        <p className="text-gray-500">Try adjusting your search criteria or add a new schedule.</p>
                                    </div>
                                </div>
                            )}
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
                    onEdit={openEditModal}
                />
            )}
            {selectedSchedule && selectedSchedule.section.id && (
                <EditScheduleModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    sectionId={selectedSchedule.section.id}
                    initialData={{
                        courseCode: selectedSchedule.course.courseCode,
                        section: selectedSchedule.section.section,
                        type: selectedSchedule.section.type,
                        room: selectedSchedule.section.room,
                        schedule: selectedSchedule.section.schedule
                    }}
                    onSave={handleEditSchedule}
                />
            )}
        </>
    );

    return (
        <RootExtensionWrapper>
            {renderContent()}
        </RootExtensionWrapper>
    );
}

export default AdminPage;
