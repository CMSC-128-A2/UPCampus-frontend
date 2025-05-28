import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { Save } from 'lucide-react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimePickerProvider } from './TimePickerProvider';
import dayjs, { Dayjs } from 'dayjs';
import { roomsApi, Room, schedulesApi } from '@/lib/api';

// Frontend course format (mapped from backend)
interface FrontendCourse {
    id: string;
    courseCode: string;
    sections: {
        id: string;
        section: string;
        type: 'Lecture' | 'Laboratory';
        room: string;
        schedule: string;
        faculty: string | null;
        facultyName?: string;
    }[];
}

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    facultyId: string;
    onSave?: (scheduleData: {
        courseCode: string;
        section: string;
        type: string;
        roomId: string;
        day: string;
        time: string;
        facultyId: string;
    }) => void;
}

function ScheduleModal({
    isOpen,
    onClose,
    facultyId,
    onSave,
}: ScheduleModalProps) {
    const [courseCode, setCourseCode] = useState('');
    const [section, setSection] = useState('');
    const [type, setType] = useState('Lecture');
    const [roomId, setRoomId] = useState('');
    const [day, setDay] = useState('');
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [courseList, setCourseList] = useState<FrontendCourse[]>([]);

    // Custom dropdown states
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

    // Time state - using separate start and end time
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch rooms and courses when modal opens (removed faculty fetching)
    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen) return;

            try {
                setIsLoading(true);

                // Fetch rooms list
                const roomsData = await roomsApi.getAllRooms();
                setRoomList(roomsData);

                // Fetch courses list
                const coursesData = await schedulesApi.getCourses();
                setCourseList(coursesData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isOpen]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.dropdown-container')) {
                setIsRoomDropdownOpen(false);
                setIsCourseDropdownOpen(false);
            }
        };

        if (isRoomDropdownOpen || isCourseDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isRoomDropdownOpen, isCourseDropdownOpen]);

    // Format time to 12-hour format
    const formatTime = (time: Dayjs | null): string => {
        if (!time) return '';

        return time.format('h:mm A');
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

    // Validate time range
    const validateTimeRange = (): string | null => {
        if (!startTime || !endTime) {
            return null;
        }

        const startHour = startTime.hour();
        const endHour = endTime.hour();
        const startMinute = startTime.minute();
        const endMinute = endTime.minute();

        // Check if start time is PM and end time is AM
        const isStartPM = startHour >= 12;
        const isEndAM = endHour < 12;

        if (isStartPM && isEndAM) {
            return 'End time cannot be AM when start time is PM';
        }

        // Check if end time is before start time on the same day
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        if (endTotalMinutes <= startTotalMinutes) {
            return 'End time must be after start time';
        }

        return null;
    };

    const timeValidationError = validateTimeRange();

    const resetForm = () => {
        setCourseCode('');
        setSection('');
        setType('Lecture');
        setRoomId('');
        setDay('');
        setStartTime(null);
        setEndTime(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = async () => {
        if (!onSave) return;

        const timeString = getTimeString();

        // Validate form
        if (
            !courseCode ||
            !section ||
            !type ||
            !roomId ||
            !day ||
            !timeString
        ) {
            alert('Please fill in all required fields');
            return;
        }

        // Check for time validation errors
        if (timeValidationError) {
            alert(timeValidationError);
            return;
        }

        try {
            setIsSaving(true);
            await onSave({
                courseCode,
                section,
                type,
                roomId,
                day,
                time: timeString,
                facultyId: facultyId,
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
                            <h2 className="text-2xl font-semibold">
                                Add Schedule
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Icon icon="ph:x-bold" width="24" height="24" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700">
                                    Course Code
                                </label>
                                <div className="relative dropdown-container">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsCourseDropdownOpen(
                                                !isCourseDropdownOpen,
                                            )
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white flex justify-between items-center"
                                        disabled={isLoading}
                                    >
                                        <span
                                            className={
                                                courseCode
                                                    ? 'text-gray-800'
                                                    : 'text-gray-400'
                                            }
                                        >
                                            {courseCode || 'Select a course'}
                                        </span>
                                        <Icon
                                            icon="ph:caret-down"
                                            className="text-gray-400"
                                            width="16"
                                            height="16"
                                        />
                                    </button>

                                    {isCourseDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            <div
                                                className="p-3 hover:bg-gray-100 cursor-pointer text-gray-400"
                                                onClick={() => {
                                                    setCourseCode('');
                                                    setIsCourseDropdownOpen(
                                                        false,
                                                    );
                                                }}
                                            >
                                                Select a course
                                            </div>
                                            {isLoading ? (
                                                <div className="p-3 text-gray-400">
                                                    Loading courses...
                                                </div>
                                            ) : courseList.length === 0 ? (
                                                <div className="p-3 text-gray-400">
                                                    No courses available
                                                </div>
                                            ) : (
                                                courseList.map((course) => (
                                                    <div
                                                        key={course.id}
                                                        className="p-3 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            setCourseCode(
                                                                course.courseCode,
                                                            );
                                                            setIsCourseDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {course.courseCode}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-gray-700">
                                        Section
                                    </label>
                                    <input
                                        type="text"
                                        value={section}
                                        onChange={(e) =>
                                            setSection(e.target.value)
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., A"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700">
                                        Type
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) =>
                                            setType(e.target.value)
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Lecture">Lecture</option>
                                        <option value="Laboratory">
                                            Laboratory
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700">
                                    Room
                                </label>
                                <div className="relative dropdown-container">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsRoomDropdownOpen(
                                                !isRoomDropdownOpen,
                                            )
                                        }
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white flex justify-between items-center"
                                        disabled={isLoading}
                                    >
                                        <span
                                            className={
                                                roomId
                                                    ? 'text-gray-800'
                                                    : 'text-gray-400'
                                            }
                                        >
                                            {roomId
                                                ? roomList.find(
                                                      (r) => r.id === roomId,
                                                  )?.code
                                                : 'Select a room'}
                                        </span>
                                        <Icon
                                            icon="ph:caret-down"
                                            className="text-gray-400"
                                            width="16"
                                            height="16"
                                        />
                                    </button>

                                    {isRoomDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            <div
                                                className="p-3 hover:bg-gray-100 cursor-pointer text-gray-400"
                                                onClick={() => {
                                                    setRoomId('');
                                                    setIsRoomDropdownOpen(
                                                        false,
                                                    );
                                                }}
                                            >
                                                Select a room
                                            </div>
                                            {isLoading ? (
                                                <div className="p-3 text-gray-400">
                                                    Loading rooms...
                                                </div>
                                            ) : roomList.length === 0 ? (
                                                <div className="p-3 text-gray-400">
                                                    No rooms available
                                                </div>
                                            ) : (
                                                roomList.map((room) => (
                                                    <div
                                                        key={room.id}
                                                        className="p-3 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            setRoomId(room.id);
                                                            setIsRoomDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {room.room}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700">
                                    Day
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['M', 'T', 'W', 'TH', 'F', 'S'].map(
                                        (dayOption) => (
                                            <button
                                                key={dayOption}
                                                type="button"
                                                onClick={() => {
                                                    const currentDays =
                                                        day.split(' ');
                                                    if (
                                                        currentDays.includes(
                                                            dayOption,
                                                        )
                                                    ) {
                                                        setDay(
                                                            currentDays
                                                                .filter(
                                                                    (d) =>
                                                                        d !==
                                                                        dayOption,
                                                                )
                                                                .join(' '),
                                                        );
                                                    } else {
                                                        setDay(
                                                            [
                                                                ...currentDays,
                                                                dayOption,
                                                            ].join(' '),
                                                        );
                                                    }
                                                }}
                                                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                                                    day
                                                        .split(' ')
                                                        .includes(dayOption)
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                                }`}
                                            >
                                                {dayOption}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">
                                    Time
                                </label>
                                <TimePickerProvider>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            {/* <span className="text-sm text-gray-500 font-medium">
                                                Start Time
                                            </span> */}
                                            <TimePicker
                                                value={startTime}
                                                onChange={(
                                                    newValue: Dayjs | null,
                                                ) => setStartTime(newValue)}
                                                label="Start time"
                                                slotProps={{
                                                    textField: {
                                                        className: 'w-full',
                                                        size: 'small',
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            {/* <span className="text-sm text-gray-500 font-medium">
                                                End Time
                                            </span> */}
                                            <TimePicker
                                                value={endTime}
                                                onChange={(
                                                    newValue: Dayjs | null,
                                                ) => setEndTime(newValue)}
                                                label="End time"
                                                slotProps={{
                                                    textField: {
                                                        className: 'w-full',
                                                        size: 'small',
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </TimePickerProvider>
                                <div className="mt-2 rounded-md bg-gray-50 p-2 text-sm text-gray-600 border border-gray-100">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1 text-blue-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {getTimeString()
                                            ? `Schedule: ${getTimeString()}`
                                            : 'Please select start and end times'}
                                    </div>
                                </div>
                                {timeValidationError && (
                                    <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-600 border border-red-200">
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1 text-red-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {timeValidationError}
                                        </div>
                                    </div>
                                )}
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
        </>
    );
}

export default ScheduleModal;
