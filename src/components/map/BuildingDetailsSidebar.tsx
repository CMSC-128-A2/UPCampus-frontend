import React, { useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeftToLine } from 'lucide-react';
import { useMapStore } from '@/store/mapStore';

// Updated interface to accommodate all building types
interface BuildingDetail {
    id: string;
    name: string;
    image: string;
    type?: string;
    // Building-specific properties
    floors?: {
        name: string;
        facilities: string[];
    }[];
    // Activity-specific properties
    description?: string;
    schedule?: string;
    capacity?: string;
    contactPerson?: string;
    contactNumber?: string;
    // Security-specific properties
    personnel?: string;
    services?: string[];
    operatingHours?: string;
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
                className={`fixed sm:top-0 sm:right-0 w-full sm:w-[320px] md:w-[350px] h-full bg-maroon-accent-light text-white overflow-hidden shadow-lg z-60 
                transition-all duration-300 ease-in-out
                top-[50%] max-h-[50%] 
                sm:max-h-full ${
                    isOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            ></div>
        );
    }

    // Determine the type of content to display
    const renderContent = () => {
        // Handle activity type
        if (building.type === 'activity') {
            return (
                <div className="pt-2 px-4">
                    <h3 className="text-xl mb-3">Activity Information</h3>

                    <div className="space-y-4">
                        {building.description && (
                            <div>
                                <h4 className="font-semibold">Description</h4>
                                <p className="mt-1">{building.description}</p>
                            </div>
                        )}

                        {building.schedule && (
                            <div>
                                <h4 className="font-semibold">Schedule</h4>
                                <p className="mt-1">{building.schedule}</p>
                            </div>
                        )}

                        {building.capacity && (
                            <div>
                                <h4 className="font-semibold">Capacity</h4>
                                <p className="mt-1">{building.capacity}</p>
                            </div>
                        )}

                        {building.contactPerson && (
                            <div>
                                <h4 className="font-semibold">
                                    Contact Person
                                </h4>
                                <p className="mt-1">{building.contactPerson}</p>
                            </div>
                        )}

                        {building.contactNumber && (
                            <div>
                                <h4 className="font-semibold">
                                    Contact Number
                                </h4>
                                <p className="mt-1">{building.contactNumber}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Handle security type
        if (building.type === 'security') {
            return (
                <div className="pt-2 px-4">
                    <h3 className="text-xl mb-3">Security Information</h3>

                    <div className="space-y-4">
                        {building.personnel && (
                            <div>
                                <h4 className="font-semibold">Personnel</h4>
                                <p className="mt-1">{building.personnel}</p>
                            </div>
                        )}

                        {building.services && building.services.length > 0 && (
                            <div>
                                <h4 className="font-semibold">Services</h4>
                                <ul className="mt-1 space-y-1 pl-4">
                                    {building.services.map((service, index) => (
                                        <li
                                            key={index}
                                            className="list-disc pl-1"
                                        >
                                            {service}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {building.operatingHours && (
                            <div>
                                <h4 className="font-semibold">
                                    Operating Hours
                                </h4>
                                <p className="mt-1">
                                    {building.operatingHours}
                                </p>
                            </div>
                        )}

                        {building.contactNumber && (
                            <div>
                                <h4 className="font-semibold">
                                    Contact Number
                                </h4>
                                <p className="mt-1">{building.contactNumber}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Handle building type (default)
        return (
            <div className="pt-2">
                <h3 className="text-xl mb-1 px-2">Facilities</h3>

                {building.floors &&
                    building.floors.map((floor, index) => (
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
        );
    };

    return (
        <>
            {/* Backdrop overlay - only visible when sidebar is open but non-interactive */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 pointer-events-none ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Sidebar */}
            <div
                className={`fixed sm:top-2 sm:right-2 w-full sm:w-[320px] md:w-[350px] bg-maroon-accent-light text-white overflow-y-auto shadow-lg z-50 
                transition-all duration-300 ease-in-out rounded-xl
                /* Mobile: Bottom half of screen */
                top-[50%] h-[50%] rounded-t-2xl
                /* Desktop: Full height */
                sm:h-[calc(100%-1rem)] ${
                    isOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            >
                {/* Sticky header */}
                <div className="sticky top-0 z-10">
                    <div className="px-4 py-3 bg-maroon-accent flex items-center justify-between font-medium text-xl tracking-tight font-inter rounded-t-xl">
                        <h2 className="text-xl font-semibold truncate">
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
                </div>

                {/* Building Image - outside of sticky header */}
                <div className="w-full h-48 relative">
                    <Image
                        src={building.image}
                        alt={building.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="border-y border-white/20"
                    />
                </div>

                {/* Content based on building type */}
                {renderContent()}
            </div>
        </>
    );
};

export default BuildingDetailsSidebar;
