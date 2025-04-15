import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

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
                <div className="absolute top-2 left-2 z-10">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                </div>

                <div className="p-4 pt-10 pb-3 flex items-center">
                    <h2 className="text-xl font-semibold">{building.name}</h2>
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
                    <div className="absolute bottom-0 left-0 bg-maroon-accent px-2 py-1">
                        <span className="font-bold text-sm">{building.id}</span>
                    </div>
                </div>
            </div>

            {/* Facilities Section */}
            <div className="p-4 pt-2">
                <h3 className="text-xl mb-1">Facilities</h3>

                {building.floors.map((floor, index) => (
                    <div key={index} className="mb-4">
                        <h4 className="font-semibold">{floor.name}</h4>
                        <ul className="space-y-1 text-sm">
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
