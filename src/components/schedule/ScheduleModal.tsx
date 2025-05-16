import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { Save } from 'lucide-react';
import TimePickerModal from './TimePickerModal';
import { TimeValue } from './MUITimePicker';
import dayjs from 'dayjs';
import { facultyApi, Faculty } from '@/lib/api';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (scheduleData: {
        courseCode: string;
        section: string;
        type: string;
        room: string;
        day: string;
        time: string;
        facultyId: string;
    }) => void;
}

function ScheduleModal({ isOpen, onClose, onSave }: ScheduleModalProps) {
    const [courseCode, setCourseCode] = useState('');
    const [section, setSection] = useState('');
    const [type, setType] = useState('Lecture');
    const [room, setRoom] = useState('');
    const [day, setDay] = useState('');
    const [facultyId, setFacultyId] = useState<string>('');
    const [facultyList, setFacultyList] = useState<Faculty[]>([]);
    
    // Time state - using separate start and end time
    const [startTime, setStartTime] = useState<TimeValue>(null);
    const [endTime, setEndTime] = useState<TimeValue>(null);
    
    // Modal states for time pickers
    const [startTimeModalOpen, setStartTimeModalOpen] = useState(false);
    const [endTimeModalOpen, setEndTimeModalOpen] = useState(false);
    
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Fetch faculty list when modal opens
    useEffect(() => {
        const fetchFaculty = async () => {
            if (!isOpen) return;
            
            try {
                setIsLoading(true);
                const data = await facultyApi.getAllFaculty();
                setFacultyList(data);
                
                // Set default faculty if available
                if (data.length > 0 && !facultyId) {
                    setFacultyId(data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch faculty list:', error);
            } finally {
                setIsLoading(false);
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

    const resetForm = () => {
        setCourseCode('');
        setSection('');
        setType('Lecture');
        setRoom('');
        setDay('');
        setStartTime(null);
        setEndTime(null);
        // Don't reset faculty to maintain selected faculty for next use
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = async () => {
        if (!onSave) return;
        
        const timeString = getTimeString();
        
        // Validate form
        if (!courseCode || !section || !type || !room || !day || !timeString) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setIsSaving(true);
            await onSave({
                courseCode,
                section,
                type,
                room,
                day,
                time: timeString,
                facultyId: facultyId || ''
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Add Schedule</h2>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                                <Icon icon="ph:x-bold" width="24" height="24" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700">Course Code</label>
                                <input
                                    type="text"
                                    value={courseCode}
                                    onChange={(e) => setCourseCode(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., CMSC 126"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Lecture">Lecture</option>
                                        <option value="Laboratory">Laboratory</option>
                                    </select>
                                </div>
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
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <option value="">Loading professors...</option>
                                    ) : facultyList.length === 0 ? (
                                        <option value="">No professors available</option>
                                    ) : (
                                        facultyList.map(faculty => (
                                            <option key={faculty.id} value={faculty.id}>
                                                {faculty.name}
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
                                                const currentDays = day.split(' ');
                                                if (currentDays.includes(dayOption)) {
                                                    setDay(currentDays.filter(d => d !== dayOption).join(' '));
                                                } else {
                                                    setDay([...currentDays, dayOption].join(' '));
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                                                day.split(' ').includes(dayOption)
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
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center min-w-[80px]"
                            >
                                {isSaving ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        Save
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

export default ScheduleModal;
