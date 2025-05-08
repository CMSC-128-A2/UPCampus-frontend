import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Edit } from 'lucide-react';
import { parseSchedule, facultyApi, Faculty } from '@/lib/api';
import TimePickerModal from './TimePickerModal';
import { TimeValue } from './MUITimePicker';
import dayjs from 'dayjs';

interface EditScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionId: string;
    initialData: {
        courseCode: string;
        section: string;
        type: 'Lecture' | 'Laboratory';
        room: string;
        schedule: string;
        faculty?: string;
    };
    onSave?: (sectionId: string, scheduleData: {
        course_code?: string;
        section: string;
        type: string;
        room: string;
        day: string;
        time: string;
        faculty_id?: string;
    }) => void;
}

function EditScheduleModal({ isOpen, onClose, sectionId, initialData, onSave }: EditScheduleModalProps) {
    const [courseCode, setCourseCode] = useState('');
    const [section, setSection] = useState('');
    const [type, setType] = useState<'Lecture' | 'Laboratory'>('Lecture');
    const [room, setRoom] = useState('');
    const [day, setDay] = useState<string[]>([]);
    const [facultyId, setFacultyId] = useState<string>('');
    const [facultyList, setFacultyList] = useState<Faculty[]>([]);
    const [isLoadingFaculty, setIsLoadingFaculty] = useState(false);
    
    // Time state using separate start and end times
    const [startTime, setStartTime] = useState<TimeValue>(null);
    const [endTime, setEndTime] = useState<TimeValue>(null);
    
    // Modal states for time pickers
    const [startTimeModalOpen, setStartTimeModalOpen] = useState(false);
    const [endTimeModalOpen, setEndTimeModalOpen] = useState(false);
    
    const [isSaving, setIsSaving] = useState(false);
    
    // Fetch faculty list when modal opens
    useEffect(() => {
        const fetchFaculty = async () => {
            if (!isOpen) return;
            
            try {
                setIsLoadingFaculty(true);
                const data = await facultyApi.getAllFaculty();
                setFacultyList(data);
            } catch (error) {
                console.error('Failed to fetch faculty list:', error);
            } finally {
                setIsLoadingFaculty(false);
            }
        };
        
        fetchFaculty();
    }, [isOpen]);
    
    // Format time to 12-hour format
    const formatTime = (time: TimeValue): string => {
        if (!time) return '';
        
        const timeObj = dayjs(`2023-01-01 ${time}`);
        return timeObj.format('h:mm A');
    };
    
    // Get the combined time string in the format "11:00 AM - 12:00 PM"
    const getTimeString = (): string => {
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        
        if (!formattedStartTime || !formattedEndTime) {
            return '';
        }
        
        return `${formattedStartTime} - ${formattedEndTime}`;
    };
    
    // Parse 12-hour format time string (e.g., "11:00 AM") to 24-hour format
    const parseTimeString = (timeStr: string): string | null => {
        if (!timeStr) return null;
        
        // Match pattern like "11:00 AM" or "1:30 PM"
        const match = timeStr.match(/(\d+):(\d+)\s*([AP]M)/i);
        if (!match) return null;
        
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'PM' && hours < 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    // Initialize form data when modal is opened or initial data changes
    useEffect(() => {
        if (isOpen && initialData) {
            setCourseCode(initialData.courseCode);
            setSection(initialData.section);
            setType(initialData.type);
            setRoom(initialData.room);
            
            // Set faculty ID if it exists
            if (initialData.faculty) {
                setFacultyId(initialData.faculty);
            }
            
            // Parse schedule string into day and time
            const { day: scheduleDay, time: scheduleTime } = parseSchedule(initialData.schedule);
            // Split the day string into an array of days and filter out empty strings
            setDay(scheduleDay.split(' ').filter(Boolean));
            
            // Parse the time string to extract start and end times
            const timePattern = /(\d+:\d+\s*[AP]M)\s*-\s*(\d+:\d+\s*[AP]M)/i;
            const timeMatch = scheduleTime.match(timePattern);
            
            if (timeMatch) {
                const [, startTimeStr, endTimeStr] = timeMatch;
                setStartTime(parseTimeString(startTimeStr.trim()));
                setEndTime(parseTimeString(endTimeStr.trim()));
            }
        }
    }, [isOpen, initialData]);

    const handleClose = () => {
        onClose();
    };

    const handleSave = async () => {
        if (!onSave) return;
        
        const timeString = getTimeString();
        const dayString = day.join(' ');
        
        // Validate form
        if (!section || !type || !room || !dayString || !timeString) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setIsSaving(true);
            await onSave(sectionId, {
                course_code: courseCode, // Optional, only needed if changing the course
                section,
                type,
                room,
                day: dayString,
                time: timeString,
                faculty_id: facultyId || undefined
            });
            // Don't close modal here, let the parent component decide based on success/failure
        } catch (error) {
            console.error('Error saving schedule:', error);
            // Error is handled in parent component
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Edit Schedule</h2>
                            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                                <Icon icon="ph:x-bold" width="24" height="24" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-gray-700">Course Code</label>
                                <input
                                    type="text"
                                    value={courseCode}
                                    onChange={(e) => setCourseCode(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., CMSC 123"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700">Section</label>
                                <input
                                    type="text"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., A"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as 'Lecture' | 'Laboratory')}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Lecture">Lecture</option>
                                    <option value="Laboratory">Laboratory</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700">Room</label>
                                <input
                                    type="text"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., SCI 405"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700">Professor</label>
                                <select
                                    value={facultyId}
                                    onChange={(e) => setFacultyId(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoadingFaculty}
                                >
                                    <option value="">None (Unassigned)</option>
                                    {isLoadingFaculty ? (
                                        <option value="" disabled>Loading professors...</option>
                                    ) : (
                                        facultyList.map(faculty => (
                                            <option key={faculty.id} value={faculty.id}>
                                                {faculty.name} ({faculty.email})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700">Day</label>
                                <div className="flex flex-wrap gap-2">
                                    {['M', 'T', 'W', 'TH', 'F', 'S'].map((dayOption) => (
                                        <button
                                            key={dayOption}
                                            type="button"
                                            onClick={() => {
                                                if (day.includes(dayOption)) {
                                                    setDay(day.filter(d => d !== dayOption));
                                                } else {
                                                    setDay([...day, dayOption]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                                                day.includes(dayOption)
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            {dayOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Time</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500 font-medium">Start Time</span>
                                        <button 
                                            onClick={() => setStartTimeModalOpen(true)}
                                            className={`w-full p-3 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 ${!startTime ? 'text-gray-400' : 'text-gray-800'}`}
                                        >
                                            {startTime ? formatTime(startTime) : 'Select time...'}
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-500 font-medium">End Time</span>
                                        <button 
                                            onClick={() => setEndTimeModalOpen(true)}
                                            className={`w-full p-3 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 ${!endTime ? 'text-gray-400' : 'text-gray-800'}`}
                                        >
                                            {endTime ? formatTime(endTime) : 'Select time...'}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 rounded-md bg-gray-50 p-2 text-sm text-gray-600 border border-gray-100">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        {getTimeString() ? `Schedule: ${getTimeString()}` : 'Please select start and end times'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={handleClose}
                                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center px-5 py-2 bg-[#93C5FD] text-white font-medium rounded-lg hover:bg-[#60A5FA] transition-colors duration-200 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="ph:floppy-disk" width="20" height="20" className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Picker Modals */}
            <TimePickerModal 
                isOpen={startTimeModalOpen}
                onClose={() => setStartTimeModalOpen(false)}
                onSelect={setStartTime}
                initialValue={startTime}
                title="Select Start Time"
            />
            
            <TimePickerModal 
                isOpen={endTimeModalOpen}
                onClose={() => setEndTimeModalOpen(false)}
                onSelect={setEndTime}
                initialValue={endTime}
                title="Select End Time"
            />
        </>
    );
}

export default EditScheduleModal; 