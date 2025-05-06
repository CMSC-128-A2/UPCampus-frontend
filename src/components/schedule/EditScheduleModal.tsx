import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Edit } from 'lucide-react';
import { parseSchedule } from '@/lib/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
    };
    onSave?: (
        sectionId: string,
        scheduleData: {
            course_code?: string;
            section: string;
            type: string;
            room: string;
            day: string;
            time: string;
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
    const [startTimeValue, setStartTimeValue] = useState<dayjs.Dayjs | null>(
        null,
    );
    const [endTimeValue, setEndTimeValue] = useState<dayjs.Dayjs | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form data when modal is opened or initial data changes
    useEffect(() => {
        if (isOpen && initialData) {
            setCourseCode(initialData.courseCode);
            setSection(initialData.section);
            setType(initialData.type);
            setRoom(initialData.room);

            // Parse schedule string into day and time
            const { day: scheduleDay, time: scheduleTime } = parseSchedule(
                initialData.schedule,
            );
            // Split the day string into an array of days and filter out empty strings
            setDay(scheduleDay.split(' ').filter(Boolean));

            // Convert time string to dayjs objects for start and end times
            try {
                // Attempt to parse the time string format (e.g., "11:00 AM - 12:00 PM")
                const timeMatch = scheduleTime.match(/(\d+:\d+ [AP]M)/g);
                if (timeMatch && timeMatch.length >= 2) {
                    setStartTimeValue(
                        dayjs(
                            `2023-01-01 ${timeMatch[0]}`,
                            'YYYY-MM-DD h:mm A',
                        ),
                    );
                    setEndTimeValue(
                        dayjs(
                            `2023-01-01 ${timeMatch[1]}`,
                            'YYYY-MM-DD h:mm A',
                        ),
                    );
                } else if (timeMatch && timeMatch.length === 1) {
                    // If we only have one time, set start time and leave end time empty
                    setStartTimeValue(
                        dayjs(
                            `2023-01-01 ${timeMatch[0]}`,
                            'YYYY-MM-DD h:mm A',
                        ),
                    );
                    setEndTimeValue(null);
                } else {
                    setStartTimeValue(null);
                    setEndTimeValue(null);
                }
            } catch (error) {
                console.error('Error parsing time:', error);
                setStartTimeValue(null);
                setEndTimeValue(null);
            }
        }
    }, [isOpen, initialData]);

    const handleClose = () => {
        onClose();
    };

    const handleSave = async () => {
        if (!onSave) return;

        // Validate form
        if (
            !section ||
            !type ||
            !room ||
            !day.length ||
            !startTimeValue ||
            !endTimeValue
        ) {
            alert('Please fill in all required fields');
            return;
        }

        // Format time from the TimePicker
        const formattedStartTime = startTimeValue.format('h:mm A');
        const formattedEndTime = endTimeValue.format('h:mm A');
        const timeString = `${formattedStartTime} - ${formattedEndTime}`;

        try {
            setIsSaving(true);
            await onSave(sectionId, {
                course_code: courseCode, // Optional, only needed if changing the course
                section,
                type,
                room,
                day: day.join(' '), // Join the array back into a space-separated string
                time: timeString,
            });
            handleClose();
        } catch (error) {
            console.error('Error saving schedule:', error);
            // Error is handled in parent component
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Edit Schedule</h2>
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
                            <input
                                type="text"
                                value={courseCode}
                                onChange={(e) => setCourseCode(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., CMSC 123"
                            />
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
                            <label className="block text-gray-700">Type</label>
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
                            <label className="block text-gray-700">Day</label>
                            <div className="flex flex-wrap gap-2">
                                {['M', 'T', 'W', 'TH', 'F', 'S'].map(
                                    (dayOption) => (
                                        <button
                                            key={dayOption}
                                            type="button"
                                            onClick={() => {
                                                if (day.includes(dayOption)) {
                                                    setDay(
                                                        day.filter(
                                                            (d) =>
                                                                d !== dayOption,
                                                        ),
                                                    );
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
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-gray-700">
                                    Time
                                </label>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <TimePicker
                                        label="Start"
                                        value={startTimeValue}
                                        onChange={(newValue) =>
                                            setStartTimeValue(newValue)
                                        }
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.5rem',
                                                height: '3rem',
                                                paddingLeft: '0.75rem',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-gray-700">
                                    &nbsp;
                                </label>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <TimePicker
                                        label="End"
                                        value={endTimeValue}
                                        onChange={(newValue) =>
                                            setEndTimeValue(newValue)
                                        }
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '0.5rem',
                                                height: '3rem',
                                                paddingLeft: '0.75rem',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end space-x-3">
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
                                    <Edit className="mr-2 h-5 w-5" />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditScheduleModal;
