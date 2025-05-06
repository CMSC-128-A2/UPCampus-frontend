'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleModal from '@/components/schedule/ScheduleModal';
import ViewScheduleModal from '@/components/schedule/ViewScheduleModal';
import EditScheduleModal from '@/components/schedule/EditScheduleModal';
import Toast, { ToastType } from '@/components/ui/Toast';
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
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('info');

    // Fetch professor data and schedules
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch professor details
                const professorData = await facultyApi.getFaculty(professorId);
                setProfessor(professorData);
                console.log('Fetched professor data:', professorData);
                
                // Try to fetch schedules directly from facultySchedules endpoint for comparison
                try {
                    const facultySchedules = await facultyApi.getFacultySchedules(professorId);
                    console.log('Faculty schedules from direct API call:', facultySchedules);
                } catch (scheduleErr) {
                    console.error('Error fetching faculty schedules directly:', scheduleErr);
                }
                
                // Fetch courses with schedules that are assigned to this professor
                const courses = await schedulesApi.getCourses();
                console.log('Fetched all courses:', courses);
                
                // Filter and map to frontend format
                const professorCourses = courses.filter(course => {
                    const hasFacultySection = course.sections.some(section => {
                        // Compare strings, ensuring consistent types
                        const sectionFacultyId = section.faculty?.toString();
                        const currentProfessorId = professorId?.toString();
                        
                        const matches = sectionFacultyId === currentProfessorId;
                        if (matches) {
                            console.log(`Found matching section for faculty ${professorId} in course ${course.courseCode}`);
                        }
                        return matches;
                    });
                    return hasFacultySection;
                });
                
                console.log('Filtered professor courses:', professorCourses);
                
                // Filter sections to only include those assigned to this professor
                const coursesWithFilteredSections = professorCourses.map(course => ({
                    ...course,
                    sections: course.sections.filter(section => {
                        return section.faculty?.toString() === professorId?.toString();
                    })
                }));
                
                console.log('Courses with filtered sections:', coursesWithFilteredSections);
                setClassSchedules(coursesWithFilteredSections);
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
        // Keep the selectedSchedule set so it's available for the edit modal
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        // If coming from view modal, re-open it
        if (selectedSchedule) {
            setIsViewModalOpen(true);
        }
    };

    // Close toast
    const closeToast = () => {
        setToastOpen(false);
    };

    // Show toast notification
    const showToast = (message: string, type: ToastType = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setToastOpen(true);
    };

    // Handle delete schedule
    const handleDeleteSchedule = async (courseId: string, sectionId: string) => {
        try {
            const response = await schedulesApi.deleteSection(courseId, sectionId);
            
            if (response.error) {
                showToast(response.detail || 'Failed to delete section. Please try again.', 'error');
                return;
            }
            
            // Update state after successful delete
            setClassSchedules(prevSchedules => 
                prevSchedules.map(course => ({
                    ...course,
                    sections: course.sections.filter(section => section.id !== sectionId)
                })).filter(course => course.sections.length > 0)
            );
            
            closeViewModal();
            showToast('Schedule deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting section:', error);
            showToast('Failed to delete section. Please try again.', 'error');
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
            showToast('Please fill in all fields', 'error');
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
            const response = await schedulesApi.createSection(apiData);
            
            // Check if there was an error
            if (response.error) {
                // Handle conflict errors specifically
                if (response.status === 409 && response.conflicts) {
                    const roomConflicts = response.conflicts.filter((c: any) => c.type === 'room');
                    const facultyConflicts = response.conflicts.filter((c: any) => c.type === 'faculty');
                    
                    let message = 'The following conflicts were detected:\n\n';
                    
                    if (roomConflicts.length > 0) {
                        message += 'Room Conflicts:\n';
                        roomConflicts.forEach((conflict: any, index: number) => {
                            message += `${index + 1}. ${conflict.course} ${conflict.section} in room ${conflict.room}\n`;
                        });
                        message += '\n';
                    }
                    
                    if (facultyConflicts.length > 0) {
                        message += 'Faculty Conflicts:\n';
                        facultyConflicts.forEach((conflict: any, index: number) => {
                            message += `${index + 1}. ${conflict.course} ${conflict.section} (${conflict.schedule})\n`;
                        });
                    }
                    
                    showToast(message, 'error');
                } else {
                    // Handle other errors
                    showToast(response.detail || 'Failed to save schedule', 'error');
                }
                return; // Exit without closing modal
            }
            
            // If we've reached here, the creation was successful
            const newSection = response;
            
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
            closeModal(); // Only close modal on success
            showToast(`Successfully added ${scheduleData.courseCode} ${scheduleData.section} schedule`, 'success');
        } catch (error: any) {
            console.error('Error saving schedule:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
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
            
            const response = await schedulesApi.updateSection(sectionId, apiData);
            
            // Check if there was an error
            if (response.error) {
                // Handle conflict errors specifically
                if (response.status === 409 && response.conflicts) {
                    const roomConflicts = response.conflicts.filter((c: any) => c.type === 'room');
                    const facultyConflicts = response.conflicts.filter((c: any) => c.type === 'faculty');
                    
                    let message = 'The following conflicts were detected:\n\n';
                    
                    if (roomConflicts.length > 0) {
                        message += 'Room Conflicts:\n';
                        roomConflicts.forEach((conflict: any, index: number) => {
                            message += `${index + 1}. ${conflict.course} ${conflict.section} in room ${conflict.room}\n`;
                        });
                        message += '\n';
                    }
                    
                    if (facultyConflicts.length > 0) {
                        message += 'Faculty Conflicts:\n';
                        facultyConflicts.forEach((conflict: any, index: number) => {
                            message += `${index + 1}. ${conflict.course} ${conflict.section} (${conflict.schedule})\n`;
                        });
                    }
                    
                    showToast(message, 'error');
                } else {
                    // Handle other errors
                    showToast(response.detail || 'Failed to update schedule', 'error');
                }
                return; // Exit without closing modal
            }
            
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
            
            closeEditModal(); // Only close modal on success
            showToast('Schedule updated successfully', 'success');
        } catch (error: any) {
            console.error('Error updating schedule:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
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
                    <div className="mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800">{professor.name}'s Schedule</h1>
                        <p className="text-gray-600 mt-1">{professor.email}</p>
                        <p className="text-gray-500 mt-1">Department: {professor.department_name}</p>
                    </div>
                    
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
                {isViewModalOpen && selectedSchedule && (
                    <ViewScheduleModal
                        isOpen={isViewModalOpen}
                        onClose={closeViewModal}
                        courseCode={selectedSchedule.course.courseCode}
                        section={selectedSchedule.section.section}
                        type={selectedSchedule.section.type}
                        room={selectedSchedule.section.room}
                        schedule={selectedSchedule.section.schedule}
                        facultyName={professor?.name}
                        facultyEmail={professor?.email}
                        onDelete={() => handleDeleteSchedule(selectedSchedule.course.id, selectedSchedule.section.id)}
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
                
                {/* Toast notifications */}
                <Toast
                    isOpen={toastOpen}
                    onClose={closeToast}
                    message={toastMessage}
                    type={toastType}
                />
            </Layout>
        </RootExtensionWrapper>
    );
} 