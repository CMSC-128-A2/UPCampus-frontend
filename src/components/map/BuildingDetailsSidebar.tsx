import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowLeftToLine } from 'lucide-react';

interface BuildingDetail {
    id: number;
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
    isOpen: boolean;
}

const BuildingDetailsSidebar: React.FC<BuildingDetailsSidebarProps> = ({
    building,
    onClose,
    isOpen,
}) => {
    if (!building) return null;

    return (
        <div
            className={`fixed top-0 right-0 w-80 h-full bg-maroon-accent-light text-white overflow-y-auto shadow-lg z-20 transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {/* Header */}
            <div className="relative">
                <div className="px-4 py-2 my-2 flex items-start gap-4 bg-maroon-accent">
                    <h2 className="text-xl font-semibold">{building.name}</h2>
                    <button onClick={onClose} className="">
                        <ArrowLeftToLine size={24} className="text-white" />
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
                            {floor.facilities.map((facility, facilityIndex) => (
                                <li key={facilityIndex} className="pl-2">
                                    {facility}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuildingDetailsSidebar;
