'use client';

import React, { useState, useEffect } from 'react';
import { X, Briefcase, Siren, Toilet, ArrowRightToLine } from 'lucide-react';

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

interface RoomSidebarProps {
    selectedRoom: Room | null;
    onClose: () => void;
}

const RoomSidebar: React.FC<RoomSidebarProps> = ({ selectedRoom, onClose }) => {
    // State to manage the animation
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Update sidebar open state when selectedRoom changes
    useEffect(() => {
        if (selectedRoom) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
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
            case 'emergency':
                return <Siren className="w-5 h-5" />;
            case 'toilet':
                return <Toilet className="w-5 h-5" />;
            default:
                return <Briefcase className="w-5 h-5" />;
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
                <div className="py-4 text-white font-semibold flex justify-between items-center rounded-t-xl">
                    <div className="flex items-center justify-between gap-2 bg-maroon-accent px-4 py-2 w-full">
                        <div className="flex items-center gap-2">
                            {getIconForRoom(selectedRoom.icon)}
                            <span>{selectedRoom.code}</span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 transition-colors p-1.5 hover:bg-white/20 rounded-full"
                        >
                            <ArrowRightToLine size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        {selectedRoom.name}
                    </h2>

                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-white mb-1">
                            Category
                        </h3>
                        <p className="text-white">{selectedRoom.category}</p>
                    </div>

                    {/* Additional information about the room could be added here */}
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-white mb-1">
                            Location
                        </h3>
                        <p className="text-white">
                            Building, {selectedRoom.code}
                        </p>
                    </div>

                    {/* Placeholder for additional information */}
                    <div className="mt-6 p-3 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-500">
                            For more information about this location, please
                            visit the information desk.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomSidebar;
