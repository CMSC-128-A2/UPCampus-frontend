import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Edit } from 'lucide-react';
import { parseSchedule, roomsApi, Room, schedulesApi } from '@/lib/api';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimePickerProvider } from './TimePickerProvider';
import dayjs, { Dayjs } from 'dayjs';

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
    onSave?: (
        sectionId: string,
        scheduleData: {
            course_code?: string;
            section: string;
            type: string;
            room_id: string;
            day: string;
            time: string;
            faculty_id?: string;
        },
    ) => void;
}

function EditScheduleModal({
    isOpen,
    onClose,
    sectionId,
    initialData,
    onSave,
}: EditScheduleModalProps) {
    const [courseCode, setCourseCode] = useState('');
    const [section, setSection] = useState('');
    const [type, setType] = useState<'Lecture' | 'Laboratory'>('Lecture');
    const [room, setRoom] = useState('');
    const [day, setDay] = useState<string[]>([]);
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [courseList, setCourseList] = useState<FrontendCourse[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // Custom dropdown states
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

    // Time state using separate start and end times
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    // Fetch rooms and courses when modal opens (removed faculty fetching)
    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen) return;

            try {
                setIsLoadingData(true);

                // Fetch rooms list
                const roomsData = await roomsApi.getAllRooms();
                setRoomList(roomsData);

                // Fetch courses list
                const coursesData = await schedulesApi.getCourses();
                setCourseList(coursesData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoadingData(false);
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

    // Parse 12-hour format time string (e.g., "11:00 AM") to Dayjs object
    const parseTimeString = (timeStr: string): Dayjs | null => {
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

        return dayjs()
            .hour(hours)
            .minute(parseInt(minutes, 10))
            .second(0)
            .millisecond(0);
    };

    // Initialize form data when modal is opened or initial data changes
    useEffect(() => {
        if (isOpen && initialData) {
            setCourseCode(initialData.courseCode);
            setSection(initialData.section);
            setType(initialData.type);

            // Find the room ID that matches the room display name
            const matchingRoom = roomList.find(
                (roomItem) => roomItem.room === initialData.room,
            );
            setRoom(matchingRoom ? matchingRoom.id : '');

            // Parse schedule string into day and time
            const { day: scheduleDay, time: scheduleTime } = parseSchedule(
                initialData.schedule,
            );
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
    }, [isOpen, initialData, roomList]);

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

        // Check for time validation errors
        if (timeValidationError) {
            alert(timeValidationError);
            return;
        }

        try {
            setIsSaving(true);

            const scheduleData = {
                course_code: courseCode,
                section: section,
                type: type,
                room_id: room,
                day: dayString,
                time: timeString,
            };

            await onSave(sectionId, scheduleData);
            handleClose();
        } catch (error) {
            console.error('Failed to save schedule:', error);
            alert('Failed to save schedule. Please try again.');
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
                            <h2 className="text-2xl font-bold">
                                Edit Schedule
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Icon icon="ph:x-bold" width="24" height="24" />
                            </button>
                        </div>

                        <div className="space-y-4">
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
                                        disabled={isLoadingData}
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
                                            {isLoadingData ? (
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

                            <div className="space-y-2">
                                <label className="block text-gray-700">
                                    Section
                                </label>
                                <input
                                    type="text"
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
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
                                        setType(
                                            e.target.value as
                                                | 'Lecture'
                                                | 'Laboratory',
                                        )
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Lecture">Lecture</option>
                                    <option value="Laboratory">
                                        Laboratory
                                    </option>
                                </select>
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
                                        disabled={isLoadingData}
                                    >
                                        <span
                                            className={
                                                room
                                                    ? 'text-gray-800'
                                                    : 'text-gray-400'
                                            }
                                        >
                                            {room
                                                ? roomList.find(
                                                      (r) => r.id === room,
                                                  )?.room
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
                                                    setRoom('');
                                                    setIsRoomDropdownOpen(
                                                        false,
                                                    );
                                                }}
                                            >
                                                Select a room
                                            </div>
                                            {isLoadingData ? (
                                                <div className="p-3 text-gray-400">
                                                    Loading rooms...
                                                </div>
                                            ) : roomList.length === 0 ? (
                                                <div className="p-3 text-gray-400">
                                                    No rooms available
                                                </div>
                                            ) : (
                                                roomList.map((roomItem) => (
                                                    <div
                                                        key={roomItem.id}
                                                        className="p-3 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            setRoom(
                                                                roomItem.id,
                                                            );
                                                            setIsRoomDropdownOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {roomItem.room}
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
                                                    if (
                                                        day.includes(dayOption)
                                                    ) {
                                                        setDay(
                                                            day.filter(
                                                                (d) =>
                                                                    d !==
                                                                    dayOption,
                                                            ),
                                                        );
                                                    } else {
                                                        setDay([
                                                            ...day,
                                                            dayOption,
                                                        ]);
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
                                        <Icon
                                            icon="ph:floppy-disk"
                                            width="20"
                                            height="20"
                                            className="mr-2"
                                        />
                                        Save Changes
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

export default EditScheduleModal;
