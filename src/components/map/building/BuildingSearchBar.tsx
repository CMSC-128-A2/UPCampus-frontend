'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { mapMarkers, mockBuildingsData } from '@/lib/types/buildings';

type BuildingData = (typeof mockBuildingsData)[keyof typeof mockBuildingsData];

// Define a floor type to avoid implicit any
interface Floor {
    code?: string;
    name: string;
    facilities?: any[];
}

const BuildingSearchBar: React.FC<{
    selectedFloorCode: string | null;
    setSelectedFloorCode: (code: string) => void;
    selectedBuilding: BuildingData | null;
}> = ({ selectedFloorCode, setSelectedFloorCode, selectedBuilding }) => {
    // Function to handle floor navigation
    const handleFloorNavigation = (direction: 'up' | 'down') => {
        if (!selectedBuilding) return;

        // Check if the building has floors property
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];

        if (floors.length === 0) return;

        // Find current index by floor code or name if code is not available
        const currentIndex = selectedFloorCode
            ? floors.findIndex(
                  (floor) =>
                      floor.code === selectedFloorCode ||
                      floor.name === selectedFloorCode,
              )
            : -1;

        if (currentIndex === -1) return;

        if (direction === 'up' && currentIndex < floors.length - 1) {
            const nextFloor = floors[currentIndex + 1];
            setSelectedFloorCode(nextFloor.code || nextFloor.name);
        } else if (direction === 'down' && currentIndex > 0) {
            const prevFloor = floors[currentIndex - 1];
            setSelectedFloorCode(prevFloor.code || prevFloor.name);
        }
    };

    // Determine if buttons should be disabled
    const isBottomFloor = () => {
        if (!selectedBuilding || !selectedFloorCode) return false;
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];
        if (floors.length === 0) return true;

        const currentIndex = floors.findIndex(
            (floor) =>
                floor.code === selectedFloorCode ||
                floor.name === selectedFloorCode,
        );
        return currentIndex === 0;
    };

    const isTopFloor = () => {
        if (!selectedBuilding || !selectedFloorCode) return false;
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];
        if (floors.length === 0) return true;

        const currentIndex = floors.findIndex(
            (floor) =>
                floor.code === selectedFloorCode ||
                floor.name === selectedFloorCode,
        );
        return currentIndex === floors.length - 1;
    };

    return (
        <div className="flex items-center max-w-[calc(100vw-20px)] w-[518px] h-[69.2px] m-[10px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] z-50 absolute top-0 left-0">
            <Link href="/map">
                <Image
                    src="/assets/images/upseelogo.png"
                    alt="Upsee Logo"
                    width={60}
                    height={30}
                />
            </Link>

            <div className="hidden md:flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2 border-2 border-transparent">
                <Search size={20} className="mr-2 text-[#7F1532]" />
                <input
                    type="text"
                    placeholder="Search buildings, facilities, offices..."
                    className="flex-1 bg-transparent outline-none text-[#7F1532] h-8"
                    // disabled={true}
                />
            </div>

            <div className="md:hidden w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center ml-auto">
                <Search size={24} className="text-[#7F1532]" />
            </div>

            <div className="flex gap-1 rounded-md overflow-hidden">
                <div
                    className={`w-[49px] h-[49.2px] p-[10px] gap-[10px] bg-[#FFFFFF] flex items-center justify-center ${
                        isBottomFloor() ? 'opacity-50' : 'cursor-pointer'
                    }`}
                    onClick={() =>
                        !isBottomFloor() && handleFloorNavigation('down')
                    }
                >
                    <ChevronDown size={24} className="text-[#7F1532]" />
                </div>

                <div className="w-[49px] h-[49.2px] p-[10px] gap-[10px] bg-[#FFAE1D] flex items-center justify-center font-bold text-[#7F1532]">
                    {selectedFloorCode}
                </div>

                <div
                    className={`w-[49px] h-[49.2px] p-[10px] gap-[10px] bg-[#FFFFFF] flex items-center justify-center ${
                        isTopFloor() ? 'opacity-50' : 'cursor-pointer'
                    }`}
                    onClick={() => !isTopFloor() && handleFloorNavigation('up')}
                >
                    <ChevronUp size={24} className="text-[#7F1532]" />
                </div>
            </div>
        </div>
    );
};

export default BuildingSearchBar;
