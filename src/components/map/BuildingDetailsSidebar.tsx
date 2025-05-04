import React, { useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeftToLine } from 'lucide-react';
import { useMapStore } from '@/store/mapStore';

interface BuildingDetail {
    id: string;
    name: string;
    image: string;
    floors: {
        name: string;
        facilities: string[];
    }[];
}

interface BuildingDetailsSidebarProps {
    building: BuildingDetail | null;
    onClose: () => void;
}

const BuildingDetailsSidebar: React.FC<BuildingDetailsSidebarProps> = ({
    building,
    onClose,
}) => {
    // Get the selected mark ID from the global store
    const { selectedMarkId } = useMapStore();

    // Derive isOpen from selectedMarkId (sidebar is open when a mark is selected)
    const isOpen = selectedMarkId !== null && building !== null;

    // Handle body scroll lock when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // If no building data, render a hidden div to maintain transition capabilities
    if (!building) {
        return (
            <div
                className={`fixed top-0 right-0 w-full sm:w-[320px] md:w-[350px] h-full bg-maroon-accent-light text-white overflow-hidden shadow-lg z-60 transition-all duration-300 ease-in-out ${
                    isOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0'
                }`}
            ></div>
        );
    }

    return (
        <>
            {/* Backdrop overlay - only visible when sidebar is open */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 w-full sm:w-[320px] md:w-[350px] h-full bg-maroon-accent-light text-white overflow-y-auto shadow-lg z-50 transition-all duration-300 ease-in-out ${
                    isOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-full opacity-0'
                }`}
            >
                {/* Header */}
                <div className="relative">
                    <div className="px-4 py-3 bg-maroon-accent flex items-center justify-between font-medium text-xl tracking-tight font-inter sticky top-0 z-10">
                        <h2 className="text-xl font-semibold">
                            {building.name}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close sidebar"
                        >
                            <ArrowLeftToLine size={22} className="text-white" />
                        </button>
                    </div>

                    {/* Building Image */}
                    <div className="w-full h-48 relative">
                        <Image
                            src={building.image}
                            alt={building.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="border-y border-white/20"
                        />
                    </div>
                </div>

                {/* Facilities Section */}
                <div className="pt-2">
                    <h3 className="text-xl mb-1 px-2">Facilities</h3>

                    {building.floors.map((floor, index) => (
                        <div key={index} className="mb-4">
                            <h4 className="font-semibold bg-white/20 px-2 my-2 py-2">
                                {floor.name}
                            </h4>
                            <ul className="space-y-1 text-sm px-4">
                                {floor.facilities.map(
                                    (facility, facilityIndex) => (
                                        <li
                                            key={facilityIndex}
                                            className="pl-2"
                                        >
                                            {facility}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BuildingDetailsSidebar;
