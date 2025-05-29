'use client';

import React, { useState, useEffect } from 'react';
import {
    Presentation,
    Briefcase,
    Siren,
    Toilet,
    X,
    ArrowLeftToLine,
    ArrowRightToLine,
    ChevronLeft,
    BrickWall,
    GraduationCap,
} from 'lucide-react';

// Use same Room interface as in FloorPlanView
interface Room {
    code: string;
    name: string;
    icon: string;
    category: string;
    position: {
        x: number;
        y: number;
    };
}

interface Floor {
    name: string;
    code: string;
    rooms?: Room[];
}

interface FloorSidebarProps {
    selectedFloor: Floor | null;
    selectedRoomCode: string | null;
    setSelectedRoomCode: (code: string | null) => void;
    isOpen?: boolean;
    onToggle?: () => void;
}

const FloorSidebar: React.FC<FloorSidebarProps> = ({
    selectedFloor,
    selectedRoomCode,
    setSelectedRoomCode,
    isOpen = true,
    onToggle,
}) => {
    // State to manage the animation
    const [sidebarOpen, setSidebarOpen] = useState(isOpen);

    // Update sidebar open state when isOpen prop changes and handle mobile default state
    useEffect(() => {
        // On mobile screens, default to closed regardless of isOpen prop
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(isOpen);
        }
    }, [isOpen]);

    // Add window resize listener to adjust sidebar state on screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(isOpen);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Handle body scroll lock when sidebar is open (for mobile)
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

    if (!selectedFloor) {
        return null;
    }

    // Group rooms by category
    const roomsByCategory: { [key: string]: Room[] } = {};

    selectedFloor.rooms?.forEach((room) => {
        if (!roomsByCategory[room.category]) {
            roomsByCategory[room.category] = [];
        }
        roomsByCategory[room.category].push(room);
    });

    const getIconForRoom = (iconName: string) => {
        switch (iconName) {
            case 'briefcase':
                return <Briefcase className="w-4 h-4" strokeWidth={2.5}/>;
            case 'presentation':
                return <Presentation className="w-4 h-4" strokeWidth={2.5}/>;
            case 'emergency':
                return <Siren className="w-4 h-4" strokeWidth={2.5}/>;
            case 'toilet':
                return <Toilet className="w-4 h-4" strokeWidth={2.5}/>;
            case 'graduation':
                return <GraduationCap className="w-4 h-4" strokeWidth={2.5}/>;
            default:
                return <Briefcase className="w-4 h-4" strokeWidth={2.5}/>;
        }
    };

    // Handle toggle button click
    const handleToggle = () => {
        setSidebarOpen(!sidebarOpen);
        if (onToggle) {
            onToggle();
        }
    };

    return (
        <>
            {/* Backdrop overlay (for mobile) - only visible when sidebar is open but non-interactive */}
            <div
                className={`fixed inset-0 z-10 transition-opacity duration-300 pointer-events-none sm:hidden ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Toggle button - only visible when sidebar is closed on desktop */}
            <button
                onClick={handleToggle}
                className={`fixed sm:flex hidden items-center justify-center top-1/2 transform -translate-y-1/2 z-20 bg-[#7F1532] text-white p-2 rounded-l-lg transition-all duration-300 ${
                    sidebarOpen
                        ? 'sm:right-[320px] md:right-[350px] opacity-0'
                        : 'sm:right-0 opacity-100'
                }`}
                aria-label={
                    sidebarOpen ? 'Hide floor panel' : 'Show floor panel'
                }
            >
                <ArrowLeftToLine size={20} />
            </button>

            {/* Mobile toggle button - only visible when sidebar is closed on mobile */}
            <button
                onClick={handleToggle}
                className={`fixed sm:hidden flex items-center justify-center bottom-8 right-8 z-20 bg-[#7F1532] text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
                    sidebarOpen
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100'
                }`}
                aria-label="Show floor panel"
            >
                <BrickWall />
            </button>

            <div
                className={`fixed sm:top-2 sm:right-2 w-full sm:w-[320px] md:w-[350px] bg-[#D45756] shadow-lg z-20 overflow-y-hidden
                transition-all duration-300 ease-in-out rounded-xl
                /* Mobile: Bottom half of screen */
                top-[50%] h-[50%] rounded-t-2xl
                /* Desktop: Full height */
                sm:h-[calc(100%-1rem)] ${
                    sidebarOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            >
                <div className="py-4 text-white font-semibold flex justify-between items-center rounded-t-xl">
                    <div className="flex items-center justify-between gap-2 bg-maroon-accent px-4 py-2 w-full">
                        <span>{selectedFloor.name}</span>
                        <button
                            onClick={handleToggle}
                            className="text-white hover:text-gray-200 transition-colors p-1.5 hover:bg-white/20 rounded-full"
                        >
                            {sidebarOpen ? (
                                <X size={20} />
                            ) : (
                                <ChevronLeft size={20} />
                            )}
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-89px)]">
                    {Object.entries(roomsByCategory).map(([category, rooms]) =>
                        category === 'Comfort Rooms' ? (
                            <div key={category} className="">
                                {rooms.map((room) => (
                                    <div
                                        key={room.code}
                                        className={`flex items-center p-2 text-white cursor-pointer`}
                                        onClick={() =>
                                            setSelectedRoomCode(room.code)
                                        }
                                    >
                                        <div className=" rounded-[5px] bg-white border-2 border-maroon-accent text-maroon-accent flex items-center gap-1 justify-center px-2 py-1 mr-2 mb-2">
                                            <span className="text-xs">
                                                {getIconForRoom(room.icon)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div key={category} className="mb-2">
                                <div className="p-2 bg-[#AA4645] text-white font-medium">
                                    {category}
                                </div>
                                <div className="">
                                    {rooms.map((room) => (
                                        <div
                                            key={room.code}
                                            className={`flex items-start p-2 text-white cursor-pointer hover:bg-white/10 transition-colors`}
                                            onClick={() =>
                                                setSelectedRoomCode(room.code)
                                            }
                                        >
                                            <div className=" rounded-full items-start bg-white border-2 border-maroon-accent text-maroon-accent flex items-start gap-1 justify-center px-2 py-1 mr-2">
                                                <span className="text-xs">
                                                    {getIconForRoom(room.icon)}
                                                </span>
                                                <span className="text-xs font-bold">
                                                    {room.code}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">
                                                        {room.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </>
    );
};

export default FloorSidebar;
