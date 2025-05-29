'use client';

import React, { useState, useEffect } from 'react';
import {
    X,
    Briefcase,
    Siren,
    Toilet,
    ArrowRightToLine,
    Clock,
    Notebook,
    User,
    GraduationCap,
    Presentation,
    Loader2,
} from 'lucide-react';
import { roomApi, parseSchedule, RoomScheduleSection } from '@/lib/api';

interface Room {
    code: string;
    name: string;
    icon: string;
    category: string;
    position: {
        x: number;
        y: number;
    };
    email?: string;
    phone?: string;
}

// Schedule interface for UI display
interface ScheduleItem {
    id: string;
    courseCode: string;
    section: string;
    type: 'Lecture' | 'Laboratory';
    day: string;
    time: string;
    faculty: string;
    isActive: boolean;
}

interface RoomSidebarProps {
    selectedRoom: Room | null;
    onClose: () => void;
}

const RoomSidebar: React.FC<RoomSidebarProps> = ({ selectedRoom, onClose }) => {
    // State to manage the animation
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // State for schedule data
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    const [scheduleError, setScheduleError] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>('TODAY');

    // State for real-time updates
    const [currentTime, setCurrentTime] = useState(new Date());

    // Days of the week for filtering (excluding Today and Sunday)
    const daysOfWeek = [
        { key: 'MONDAY', label: 'Mon' },
        { key: 'TUESDAY', label: 'Tue' },
        { key: 'WEDNESDAY', label: 'Wed' },
        { key: 'THURSDAY', label: 'Thu' },
        { key: 'FRIDAY', label: 'Fri' },
        { key: 'SATURDAY', label: 'Sat' },
    ];

    // Get current day name
    const getCurrentDay = (): string => {
        const today = new Date();
        const dayNames = [
            'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
        ];
        return dayNames[today.getDay()];
    };

    // Function to convert API data to our ScheduleItem format
    const convertApiScheduleToScheduleItem = (
        apiSection: RoomScheduleSection,
    ): ScheduleItem => {
        const { day, time } = parseSchedule(apiSection.schedule);

        return {
            id: apiSection.id,
            courseCode: apiSection.course_code,
            section: apiSection.section,
            type: apiSection.type,
            day: day,
            time: time,
            faculty: apiSection.faculty_name || 'TBA',
            isActive: apiSection.is_active,
        };
    };

    // Function to map frontend room codes to backend room codes
    const mapRoomCodeForAPI = (frontendCode: string): string => {
        // Try different variations of room codes
        const variations = [
            frontendCode, // Original: '301'
            `NSB${frontendCode}`, // With building prefix: 'NSB301'
            `NSB-${frontendCode}`, // With building prefix and dash: 'NSB-301'
            `CSB${frontendCode}`, // Alternative building prefix: 'CSB301'
            `CSB-${frontendCode}`, // Alternative with dash: 'CSB-301'
        ];

        // For now, return the original code, but we can modify this based on API testing
        return frontendCode;
    };

    // Fetch schedules for the selected room
    const fetchRoomSchedules = async (
        roomCode: string,
        day: string = 'TODAY',
    ) => {
        if (!shouldShowSchedules(selectedRoom!)) {
            return;
        }

        console.log(
            `=== Fetching schedules for room: ${roomCode}, day: ${day} ===`,
        );
        console.log(`Room category: ${selectedRoom?.category}`);
        console.log(
            `Should show schedules: ${shouldShowSchedules(selectedRoom!)}`,
        );

        // Map the room code for API
        const apiRoomCode = mapRoomCodeForAPI(roomCode);
        console.log(
            `Frontend room code: ${roomCode}, API room code: ${apiRoomCode}`,
        );

        setIsLoadingSchedules(true);
        setScheduleError(null);

        try {
            let apiSchedules: RoomScheduleSection[] = [];

            if (day === 'TODAY') {
                // Get today's sections
                console.log(
                    `Calling roomApi.getRoomTodaySections(${apiRoomCode})`,
                );
                try {
                    apiSchedules = await roomApi.getRoomTodaySections(
                        apiRoomCode,
                    );
                } catch (todayError) {
                    console.warn(
                        'Today sections failed, trying all sections:',
                        todayError,
                    );
                    // Fallback: get all sections and filter client-side
                    const allSections = await roomApi.getRoomSections(
                        apiRoomCode,
                    );
                    const currentDay = getCurrentDay();
                    apiSchedules = allSections.filter((section) => {
                        const { day: scheduleDay } = parseSchedule(
                            section.schedule,
                        );
                        return scheduleDay.includes(currentDay.substring(0, 3)); // Match first 3 letters
                    });
                }
            } else {
                // Get sections for specific day
                console.log(
                    `Calling roomApi.getRoomSectionsByDay(${apiRoomCode}, ${day})`,
                );
                try {
                    const response = await roomApi.getRoomSectionsByDay(
                        apiRoomCode,
                        day,
                    );
                    apiSchedules = response.sections;
                } catch (dayError) {
                    console.warn(
                        `Day-specific sections failed for ${day}, trying all sections:`,
                        dayError,
                    );
                    // Fallback: get all sections and filter client-side
                    const allSections = await roomApi.getRoomSections(
                        apiRoomCode,
                    );
                    apiSchedules = allSections.filter((section) => {
                        const { day: scheduleDay } = parseSchedule(
                            section.schedule,
                        );
                        return scheduleDay.includes(day.substring(0, 3)); // Match first 3 letters
                    });
                }
            }

            console.log(
                `Received ${apiSchedules.length} schedules:`,
                apiSchedules,
            );

            const formattedSchedules = apiSchedules.map(
                convertApiScheduleToScheduleItem,
            );
            console.log(`Formatted schedules:`, formattedSchedules);
            setSchedules(formattedSchedules);
        } catch (error) {
            console.error('Failed to fetch room schedules:', error);
            setScheduleError(
                `Failed to load schedules: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            setSchedules([]);
        } finally {
            setIsLoadingSchedules(false);
        }
    };

    // Check if a room should show schedules (exclude non-academic spaces)
    const shouldShowSchedules = (room: Room): boolean => {
        const nonScheduleCategories = [
            'Offices',
            'Comfort Rooms',
            'Storage',
            'Cafeteria',
            'Library',
            'Auditorium',
            'Conference Rooms',
            'Study Areas',
            'Lounges',
            'Emergency',
            'Maintenance',
            'Reception',
            'Hallways',
            'Stairs',
            'Emergency Exits',
            'Elevators',
            // Add any other room types that shouldn't show schedules
        ];
        return !nonScheduleCategories.includes(room.category);
    };

    // Handle day selection
    const handleDaySelect = (day: string) => {
        setSelectedDay(day);
        if (selectedRoom) {
            fetchRoomSchedules(selectedRoom.code, day);
        }
    };

    // Update current time every minute for real-time highlighting
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Update sidebar open state when selectedRoom changes
    useEffect(() => {
        if (selectedRoom) {
            setSidebarOpen(true);
            setSelectedDay('TODAY'); // Reset to today when room changes
            // Fetch schedules when room is selected
            if (shouldShowSchedules(selectedRoom)) {
                fetchRoomSchedules(selectedRoom.code, 'TODAY');
            }
        } else {
            setSidebarOpen(false);
            setSchedules([]);
            setScheduleError(null);
            setSelectedDay('TODAY');
        }
    }, [selectedRoom]);

    // Handle close with animation
    const handleClose = () => {
        setSidebarOpen(false);

        // Use setTimeout to allow animation to complete before calling onClose
        setTimeout(() => {
            onClose();
        }, 300); // Match duration with CSS transition
    };

    // Handle body scroll lock when sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    // Debug function to test API
    const testRoomApi = async () => {
        if (!selectedRoom) return;

        console.log(`=== Testing API for room: ${selectedRoom.code} ===`);
        try {
            const roomCode = mapRoomCodeForAPI(selectedRoom.code);

            // Test 1: Basic sections endpoint (what debug button uses)
            console.log('\n--- Test 1: Basic sections endpoint ---');
            const basicResult = await roomApi.testRoomApi(selectedRoom.code);
            console.log('Basic sections result:', basicResult);

            // Test 2: All sections endpoint
            console.log('\n--- Test 2: All sections endpoint ---');
            const allSections = await roomApi.getRoomSections(roomCode);
            console.log('All sections result:', allSections);

            // Test 3: Today's sections endpoint
            console.log("\n--- Test 3: Today's sections endpoint ---");
            try {
                const todaySections = await roomApi.getRoomTodaySections(
                    roomCode,
                );
                console.log('Today sections result:', todaySections);
            } catch (todayError) {
                console.log('Today sections error:', todayError);
            }

            // Test 4: Day-specific endpoint for current day
            console.log('\n--- Test 4: Day-specific endpoint ---');
            const currentDay = getCurrentDay();
            try {
                const daySpecific = await roomApi.getRoomSectionsByDay(
                    roomCode,
                    currentDay,
                );
                console.log(`${currentDay} sections result:`, daySpecific);
            } catch (dayError) {
                console.log(`${currentDay} sections error:`, dayError);
            }

            const summary = {
                roomCode: selectedRoom.code,
                apiRoomCode: roomCode,
                currentDay: getCurrentDay(),
                basicSections: Array.isArray(basicResult)
                    ? basicResult.length
                    : 'Error',
                allSections: allSections.length,
                todaySections: 'Check console',
                daySpecific: 'Check console',
            };

            alert(`API Test Summary:\n${JSON.stringify(summary, null, 2)}`);
        } catch (error) {
            console.error('Test failed:', error);
            alert(
                `API Test Failed: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
        }
    };

    // Add global test function for debugging
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).testRoomScheduleAPI = async (roomCode?: string) => {
                const testCode = roomCode || selectedRoom?.code || '301';
                console.log(`=== Global test for room: ${testCode} ===`);
                try {
                    const result = await roomApi.testRoomApi(testCode);
                    console.log('Global test result:', result);
                    return result;
                } catch (error) {
                    console.error('Global test failed:', error);
                    return {
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    };
                }
            };

            (window as any).testBackendHealth = async () => {
                console.log(`=== Testing Backend Health ===`);
                try {
                    const result = await roomApi.testBackendHealth();
                    console.log('Backend health result:', result);
                    return result;
                } catch (error) {
                    console.error('Backend health test failed:', error);
                    return {
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    };
                }
            };

            (window as any).testRoomCodeVariations = async (
                roomCode?: string,
            ) => {
                const testCode = roomCode || selectedRoom?.code || '301';
                console.log(
                    `=== Testing Room Code Variations for: ${testCode} ===`,
                );
                try {
                    const result = await roomApi.testRoomCodeVariations(
                        testCode,
                    );
                    console.log('Room code variations result:', result);
                    return result;
                } catch (error) {
                    console.error('Room code variations test failed:', error);
                    return {
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    };
                }
            };
        }
    }, [selectedRoom]);

    // If no room data, render a hidden div to maintain transition capabilities
    if (!selectedRoom) {
        return (
            <div
                className={`fixed sm:top-2 sm:right-2 w-full sm:w-[320px] md:w-[350px] bg-white shadow-lg z-30 overflow-y-auto
                transition-all duration-300 ease-in-out rounded-xl
                top-[50%] h-[50%] rounded-t-2xl
                sm:h-[calc(100%-1rem)] ${
                    sidebarOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            ></div>
        );
    }

    const getIconForRoom = (iconName: string) => {
        switch (iconName) {
            case 'briefcase':
                return <Briefcase className="w-5 h-5" />;
            case 'presentation':
                return <Presentation className="w-5 h-5" />;
            case 'emergency':
                return <Siren className="w-5 h-5" />;
            case 'toilet':
                return <Toilet className="w-5 h-5" />;
            case 'graduation':
                return <GraduationCap className="w-5 h-5" />;
            default:
                return <Briefcase className="w-5 h-5" />;
        }
    };

    // Function to check if a class is currently happening
    const isClassCurrentlyActive = (timeString: string): boolean => {
        try {
            // Parse the time string (e.g., "10:00 AM - 11:30 AM")
            const timeMatch = timeString.match(
                /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i,
            );

            if (!timeMatch) return false;

            const [
                ,
                startHour,
                startMin,
                startPeriod,
                endHour,
                endMin,
                endPeriod,
            ] = timeMatch;

            // Convert to 24-hour format
            let startHour24 = parseInt(startHour);
            let endHour24 = parseInt(endHour);

            if (startPeriod.toUpperCase() === 'PM' && startHour24 !== 12) {
                startHour24 += 12;
            } else if (
                startPeriod.toUpperCase() === 'AM' &&
                startHour24 === 12
            ) {
                startHour24 = 0;
            }

            if (endPeriod.toUpperCase() === 'PM' && endHour24 !== 12) {
                endHour24 += 12;
            } else if (endPeriod.toUpperCase() === 'AM' && endHour24 === 12) {
                endHour24 = 0;
            }

            // Create Date objects for start and end times
            const now = new Date();
            const startTime = new Date();
            const endTime = new Date();

            startTime.setHours(startHour24, parseInt(startMin), 0, 0);
            endTime.setHours(endHour24, parseInt(endMin), 0, 0);

            // Check if current time is between start and end time
            return now >= startTime && now <= endTime;
        } catch (error) {
            console.error('Error parsing time:', error);
            return false;
        }
    };

    // Function to get the appropriate background color for a schedule item
    const getScheduleItemBackground = (schedule: ScheduleItem): string => {
        const isCurrentlyActive = isClassCurrentlyActive(schedule.time);
        const isToday =
            selectedDay === 'TODAY' || selectedDay === getCurrentDay();

        if (isCurrentlyActive && isToday) {
            // Currently happening class - bright highlight
            return 'bg-[#FFAE1D] border-[#FFA500]  px-8 pt-2 pb-3';
        } else if (schedule.isActive) {
            // API says it's active but not currently happening
            return 'bg-green-500/20 border-green-500/30 px-8 py-3';
        } else {
            // Regular class
            return 'px-8 py-3';
        }
    };

    // Function to get text color based on background
    const getScheduleItemTextColor = (schedule: ScheduleItem): string => {
        const isCurrentlyActive = isClassCurrentlyActive(schedule.time);
        const isToday =
            selectedDay === 'TODAY' || selectedDay === getCurrentDay();

        if (isCurrentlyActive && isToday) {
            return 'text-white'; // Dark text for bright yellow background
        } else {
            return 'text-white'; // White text for other backgrounds
        }
    };

    return (
        <>
            {/* Backdrop overlay - only visible when sidebar is open but non-interactive */}
            <div
                className={`fixed inset-0 z-20 transition-opacity duration-300 pointer-events-none ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}
            />

            <div
                className={`fixed sm:top-2 sm:right-2 w-full sm:w-[320px] md:w-[350px] bg-[#D45756] text-white shadow-lg z-30 overflow-hidden
                transition-all duration-300 ease-in-out rounded-xl
                /* Mobile: Bottom half of screen */
                top-[30%] h-[70%] rounded-t-2xl
                /* Desktop: Full height */
                sm:h-[calc(100%-1rem)] ${
                    sidebarOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            >
                <div className="pt-4 text-white font-semibold flex justify-between items-center rounded-t-xl">
                    <div className="flex items-center justify-between gap-2 bg-maroon-accent px-4 py-2 w-full">
                        <div className="flex items-center gap-2">
                            {getIconForRoom(selectedRoom.icon)}
                            <span>{selectedRoom.name}</span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 transition-colors p-1.5 hover:bg-white/20 rounded-full"
                        >
                            <ArrowRightToLine size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-89px)]">
                    {/* Show category and location for non-schedule rooms */}
                    {!shouldShowSchedules(selectedRoom) && (
                        <div className="px-4 py-1">
                            <div className="my-4">
                                <h3 className="text-sm font-medium text-white mb-1">
                                    Category
                                </h3>
                                <p className="text-white">
                                    {selectedRoom.category}
                                </p>
                            </div>

                            {/* Contact Information - Only for Offices */}
                            {selectedRoom.category === 'Offices' &&
                                (selectedRoom.email || selectedRoom.phone) && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-white mb-1">
                                            Contact Information
                                        </h3>
                                        {selectedRoom.email && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white">
                                                    Email:
                                                </span>
                                                <span className="text-white">
                                                    {selectedRoom.email}
                                                </span>
                                            </div>
                                        )}
                                        {selectedRoom.phone && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-white">
                                                    Phone:
                                                </span>
                                                <span className="text-white">
                                                    {selectedRoom.phone}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                            {/* Location Information */}
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-white mb-1">
                                    Location
                                </h3>
                                <p className="text-white">
                                    CSB {selectedRoom.code}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Schedule Information - Only for Classrooms/Labs */}
                    {shouldShowSchedules(selectedRoom) && (
                        <div className="mb-4">
                            <div className="mb-2 items-center color">
                                <h3 className="text-lg p-2 bg-[#AA4645] text-white font-normal">
                                    Classes
                                </h3>
                            </div>
                            <div className="mb-4">
                                {/* Day Filter Buttons */}
                                <div>
                                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                                        {daysOfWeek.map((day) => {
                                            const isHighlighted =
                                                selectedDay === 'TODAY'
                                                    ? day.key ===
                                                      getCurrentDay()
                                                    : selectedDay === day.key;

                                            return (
                                                <button
                                                    key={day.key}
                                                    onClick={() =>
                                                        handleDaySelect(day.key)
                                                    }
                                                    className={`border-[#7F1532] border-[1px] px-2.5 py-1 font-normal text-[18] text-[#7F1532] rounded-[5px] transition-colors ${
                                                        isHighlighted
                                                            ? 'bg-[#FFAE1D]'
                                                            : 'bg-white'
                                                    }`}
                                                >
                                                    {day.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="px-3 text-xs text-white/70 mt-1">
                                        {selectedDay === 'TODAY'
                                            ? `Showing today's schedule`
                                            : `Click a day to view its schedule`}
                                    </p>
                                </div>

                                {/* Loading State */}
                                {isLoadingSchedules && (
                                    <div className="rounded-lg p-4 text-center">
                                        <Loader2 className="w-8 h-8 text-white/50 mx-auto mb-2 animate-spin" />
                                        <p className="text-white/70 text-sm">
                                            Loading schedules...
                                        </p>
                                    </div>
                                )}

                                {/* Error State */}
                                {scheduleError && !isLoadingSchedules && (
                                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                                        <p className="text-white text-sm">
                                            {scheduleError}
                                        </p>
                                        <button
                                            onClick={() =>
                                                fetchRoomSchedules(
                                                    selectedRoom.code,
                                                )
                                            }
                                            className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full text-white hover:bg-white/30 transition-colors"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}

                                {/* Schedule Content */}
                                {!isLoadingSchedules && !scheduleError && (
                                    <>
                                        {schedules.length > 0 ? (
                                            <div>
                                                {schedules.map((schedule) => {
                                                    const isCurrentlyActive =
                                                        isClassCurrentlyActive(
                                                            schedule.time,
                                                        );
                                                    const isToday =
                                                        selectedDay ===
                                                            'TODAY' ||
                                                        selectedDay ===
                                                            getCurrentDay();

                                                    return (
                                                        <div
                                                            key={schedule.id}
                                                            className={getScheduleItemBackground(
                                                                schedule,
                                                            )}
                                                        >
                                                            {isCurrentlyActive &&
                                                                isToday && (
                                                                    <span className="text-xs underline decoration-1 decoration-white underline-offset-4">
                                                                        Ongoing
                                                                    </span>
                                                                )}
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span
                                                                    className={`text-xl ${getScheduleItemTextColor(
                                                                        schedule,
                                                                    )}`}
                                                                >
                                                                    {
                                                                        schedule.time
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Notebook className="w-4 h-4" />
                                                                <span
                                                                    className={` text-m ${getScheduleItemTextColor(
                                                                        schedule,
                                                                    )}`}
                                                                >
                                                                    {
                                                                        schedule.courseCode
                                                                    }{' '}
                                                                    {
                                                                        schedule.section
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                <span
                                                                    className={`text-m ${getScheduleItemTextColor(
                                                                        schedule,
                                                                    )}`}
                                                                >
                                                                    {
                                                                        schedule.faculty
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-lg p-4 text-center">
                                                <Clock className="w-8 h-8 text-white/50 mx-auto mb-2" />
                                                <p className="text-white/70 text-sm">
                                                    No classes scheduled for
                                                    today
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* General information - Only for non-schedule rooms */}
                    {/* {!shouldShowSchedules(selectedRoom) && (
                        <div className="p-3">
                            <div className="p-3 bg-white/80 rounded-md">
                                <p className="text-sm text-maroon-accent">
                                    For more information about this location,
                                    please visit the information desk.
                                </p>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </>
    );
};

export default RoomSidebar;
