'use client';

import { X } from 'lucide-react';
import {
    buildingsData,
    activityAreaData,
    securityAndParkingData,
} from '@/assets/assets';
import IndexButton from './IndexButton';
import { useState, useEffect } from 'react';
import { useMapStore } from '@/store/mapStore';

interface DrawerProps {
    title: string;
    onClose?: () => void;
    isOpen?: boolean;
}

// Recursive rendering of buildings with dynamic padding based on the level
const renderBuildings = (buildings: any[], level = 0) => {
    const { setSelectedMarkId } = useMapStore();
    return buildings.map((building, index) => (
        <div
            key={building.index}
            style={{ paddingLeft: `${level * 15}px` }}
            className="py-3 hover:bg-[#BF4043] ransition-colors duration-100"
        >
            {/* If building has children, render as div, otherwise as button */}

            <button
                className={`flex items-start text-left px-3 `}
                onClick={() => {
                    setSelectedMarkId(building.index);
                }}
            >
                <div className="mr-3 flex-shrink-0 ">
                    <IndexButton index={building.index} icon={building.icon} />
                </div>
                <div className="font-inter font-normal text-lg tracking-tight">
                    {building.name}
                </div>
            </button>

            {/* Recursively render children with further increased indentation */}
            {building.children && renderBuildings(building.children, level + 2)}
        </div>
    ));
};

export default function Drawer({ title, onClose, isOpen = true }: DrawerProps) {
    const [drawerOpen, setDrawerOpen] = useState(isOpen);

    // Update internal state when isOpen prop changes
    useEffect(() => {
        setDrawerOpen(isOpen);
    }, [isOpen]);

    const handleCloseDrawer = () => {
        setDrawerOpen(false);

        // Use setTimeout to allow animation to complete before calling onClose
        setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 300); // Match duration with CSS transition
    };

    // Handle body scroll lock when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [drawerOpen]);

    return (
        <>
            <div
                className={`absolute sm:top-2 h-full w-full sm:w-[320px] md:w-[350px] text-[#FFFFFF] bg-[#D45756] shadow-lg z-10 
                transition-all duration-300 ease-in-out rounded-xl
                /* Mobile: Bottom half of screen */
                top-[50%] max-h-[50%] rounded-t-2xl
                /* Desktop: Full height */
                sm:max-h-full sm:h-[calc(100%-1rem)] sm:right-2 ${
                    drawerOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            >
                <div className="px-4 py-3 bg-[#7F1532] flex items-center justify-between font-medium text-xl tracking-tight font-inter sticky top-0 z-20 rounded-t-xl">
                    {title}
                    <button
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        onClick={handleCloseDrawer}
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className=" py-2 overflow-y-auto h-[calc(100%-56px)]">
                    {title === 'Buildings' && renderBuildings(buildingsData)}
                    {title === 'Activity Area' &&
                        renderBuildings(activityAreaData)}
                    {title === 'Security & Parking' &&
                        renderBuildings(securityAndParkingData)}
                </div>
            </div>
        </>
    );
}
