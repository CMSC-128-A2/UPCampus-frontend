'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleModal from '@/components/schedule/ScheduleModal';
import ViewScheduleModal from '@/components/schedule/ViewScheduleModal';
import EditScheduleModal from '@/components/schedule/EditScheduleModal';
import Layout from '@/components/ui/Layout';
import RootExtensionWrapper from '@/app/admin/RootExtensionWrapper';
import { schedulesApi, facultyApi, parseSchedule, Course, ClassSection as ApiClassSection, Faculty } from '@/lib/api';

// Define TypeScript types for the data structure
type ScheduleType = 'Lecture' | 'Laboratory';
type Floor = '1st Floor' | '2nd Floor' | '3rd Floor' | '4th Floor' | '5th Floor' | 'All Floors';

interface ClassSection {
    id: string;
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

export default function SchedulePage() {
    const params = useParams();
    const router = useRouter();
    const professorId = params.id as string;
    const [professor, setProfessor] = useState<Faculty | null>(null);
    
    const [classSchedules, setClassSchedules] = useState<CourseSchedule[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<{ course: CourseSchedule, section: ClassSection } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<Floor>('4th Floor');

    // Fetch professor data and schedules
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch professor details
                const professorData = await facultyApi.getFaculty(professorId);
                setProfessor(professorData);
                
                // Fetch courses with schedules that are assigned to this professor
                const courses = await schedulesApi.getCourses();
                
                // Filter and map to frontend format
                const professorCourses = courses.filter(course => 
                    course.sections.some(section => section.faculty === professorId)
                );
                
                setClassSchedules(professorCourses);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load schedule data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [professorId]);

    // Filter schedules based on search query
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
    const handleDeleteSchedule = async (courseId: string, sectionId: string) => {
        try {
            await schedulesApi.deleteSection(courseId, sectionId);
            
            // Update state after successful delete
            setClassSchedules(prevSchedules => 
                prevSchedules.map(course => ({
                    ...course,
                    sections: course.sections.filter(section => section.id !== sectionId)
                })).filter(course => course.sections.length > 0)
            );
            
            closeViewModal();
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
            // Create API request data
            const apiData = {
                course_code: scheduleData.courseCode,
                section: scheduleData.section,
                type: scheduleData.type,
                room: scheduleData.room,
                day: scheduleData.day,
                time: scheduleData.time,
                faculty_id: professorId,
            };

            // Save section via API
            const newSection = await schedulesApi.createSection(apiData);
            
            // Convert to frontend format
            const schedule = `${scheduleData.day} | ${scheduleData.time}`;
            const type = scheduleData.type as ScheduleType;
            
            // Find if the course already exists
            const courseIndex = classSchedules.findIndex(c => 
                c.courseCode.toLowerCase() === scheduleData.courseCode.toLowerCase()
            );
            
            // Create a copy of class schedules to modify
            const updatedSchedules = [...classSchedules];
            
            if (courseIndex >= 0) {
                // Add section to existing course
                updatedSchedules[courseIndex] = {
                    ...updatedSchedules[courseIndex],
                    sections: [
                        ...updatedSchedules[courseIndex].sections,
                        {
                            id: newSection.id,
                            section: scheduleData.section,
                            type,
                            room: scheduleData.room,
                            schedule
                        }
                    ]
                };
            } else {
                // Create new course
                updatedSchedules.push({
                    id: newSection.course, // API returns course ID
                    courseCode: scheduleData.courseCode,
                    sections: [
                        {
                            id: newSection.id,
                            section: scheduleData.section,
                            type,
                            room: scheduleData.room,
                            schedule
                        }
                    ]
                });
            }
            
            setClassSchedules(updatedSchedules);
            closeModal();
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
            // Update via API
            const apiData = {
                ...scheduleData,
                faculty_id: professorId,
            };
            
            await schedulesApi.updateSection(sectionId, apiData);
            
            // Format schedule for frontend
            const schedule = `${scheduleData.day} | ${scheduleData.time}`;
            const type = scheduleData.type as ScheduleType;
            
            // Update the schedule in state
            setClassSchedules(prevSchedules => 
                prevSchedules.map(course => ({
                    ...course,
                    sections: course.sections.map(section => 
                        section.id === sectionId ? {
                            ...section,
                            section: scheduleData.section,
                            type,
                            room: scheduleData.room,
                            schedule
                        } : section
                    )
                }))
            );
            
            closeEditModal();
        } catch (error: any) {
            console.error('Error updating schedule:', error);
            alert(error.message || 'Failed to update schedule. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <RootExtensionWrapper>
                <Layout>
                    <div className="p-6 flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A]"></div>
                    </div>
                </Layout>
            </RootExtensionWrapper>
        );
    }

    if (error) {
        return (
            <RootExtensionWrapper>
                <Layout>
                    <div className="p-6 text-center">
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                            <p>{error}</p>
                        </div>
                        <Link href="/faculty" className="text-[#8BC34A] hover:underline mt-2 inline-block">
                            Return to Faculty List
                        </Link>
                    </div>
                </Layout>
            </RootExtensionWrapper>
        );
    }

    if (!professor) {
        return (
            <RootExtensionWrapper>
                <Layout>
                    <div className="p-6 text-center">
                        <p className="mt-4">Professor not found</p>
                        <Link href="/faculty" className="text-[#8BC34A] hover:underline mt-2 inline-block">
                            Return to Faculty List
                        </Link>
                    </div>
                </Layout>
            </RootExtensionWrapper>
        );
    }

    return (
        <RootExtensionWrapper>
            <Layout>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Professor's Schedule Title */}
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">{professor.name}'s Schedule</h1>
                    
                    {/* Search and Filters */}
                    <div className="mb-6">
                        <div className="relative w-full mb-4">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Icon icon="ph:magnifying-glass" className="text-gray-400" width="20" height="20" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8BC34A]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="relative">
                                <select
                                    className="appearance-none bg-[#F2F9EC] border border-[#8BC34A] text-[#8BC34A] rounded-lg pl-4 pr-10 py-2 focus:outline-none"
                                    value={selectedFloor}
                                    onChange={(e) => setSelectedFloor(e.target.value as Floor)}
                                >
                                    <option value="1st Floor">1st Floor</option>
                                    <option value="2nd Floor">2nd Floor</option>
                                    <option value="3rd Floor">3rd Floor</option>
                                    <option value="4th Floor">4th Floor</option>
                                    <option value="5th Floor">5th Floor</option>
                                    <option value="All Floors">All Floors</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Icon icon="ph:caret-down" className="text-[#8BC34A]" width="16" height="16" />
                                </div>
                            </div>
                            
                            <button
                                onClick={openModal}
                                className="bg-[#E6F4FF] hover:bg-[#d1ebff] text-[#1E88E5] border border-[#1E88E5] px-4 py-2 rounded-lg flex items-center"
                            >
                                <Icon icon="ph:plus" width="20" height="20" className="mr-2" />
                                <span>Schedule</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Course Schedules */}
                    {filteredSchedules.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <Icon icon="ph:calendar-blank" className="mx-auto mb-2" width="48" height="48" />
                            <p>No schedules found. {searchQuery ? 'Try a different search.' : 'Add a new schedule to get started.'}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredSchedules.map(course => (
                                <div key={course.courseCode} className="mb-8">
                                    {/* Course Header */}
                                    <div className="bg-[#E6F4FF] px-4 py-3 rounded-lg mb-2">
                                        <h2 className="text-xl font-semibold text-gray-800">{course.courseCode}</h2>
                                    </div>
                                    
                                    {/* Course Sections */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Section</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Room Assigned</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Schedule</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {course.sections.map(section => (
                                                    <tr 
                                                        key={section.id} 
                                                        className="hover:bg-gray-50 cursor-pointer"
                                                        onClick={() => openViewModal(course, section)}
                                                    >
                                                        <td className="px-4 py-3 text-sm text-gray-700">{section.section}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">{section.type}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">{section.room}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">{section.schedule}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Schedule Modal */}
                <ScheduleModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSave={handleSaveSchedule}
                />

                {/* View Schedule Modal */}
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
                                handleDeleteSchedule(selectedSchedule.course.id, selectedSchedule.section.id);
                            }
                        }}
                        onEdit={openEditModal}
                    />
                )}

                {/* Edit Schedule Modal */}
                {selectedSchedule && (
                    <EditScheduleModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        sectionId={selectedSchedule.section.id}
                        initialData={{
                            courseCode: selectedSchedule.course.courseCode,
                            section: selectedSchedule.section.section,
                            type: selectedSchedule.section.type,
                            room: selectedSchedule.section.room,
                            schedule: selectedSchedule.section.schedule,
                        }}
                        onSave={handleEditSchedule}
                    />
                )}
            </Layout>
        </RootExtensionWrapper>
    );
} 