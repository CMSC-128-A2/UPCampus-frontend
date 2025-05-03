'use client';

import { X } from 'lucide-react';
import { buildingsData } from '@/assets/assets';
import IndexButton from './IndexButton';
import { useState } from 'react';

interface DrawerProps {
    title: string;
}

// Recursive rendering of buildings with dynamic padding based on the level
const renderBuildings = (buildings: any[], level = 0) => {
    return buildings.map((building, index) => (
        <div key={building.index} style={{ paddingLeft: `${level * 20}px` }} className="mb-5">
            {/* Add margin-top to first child only */}
            <div className={`flex flex-row cursor-pointer text-lg font-inter font-normal text-[28px] leading-[100%] tracking-[-0.05em] ${index === 0 && level > 0 ? 'mt-5' : ''}`}>
                <div className='mr-2'>
                    <IndexButton index={building.index} icon={building.icon}/>
                </div>
                <div className="font-inter font-normal text-[28px] leading-[100%] tracking-[-0.05em]">
                    {building.name}
                </div>

                
            </div>
            {/* Recursively render children with further increased indentation */}
            {building.children && renderBuildings(building.children, level + 3)}
        </div>
    ));
};

export default function Drawer({ title }: DrawerProps) {
    const [isOpen, setIsOpen] = useState(true); // State to control visibility

    const handleCloseDrawer = () => {
        setIsOpen(false); // Close the Drawer when X is clicked
    };

    if (!isOpen) return null; // If Drawer is closed, don't render it


    return (
        <div className="absolute top-0 right-0 h-full w-[400px] rounded-[10px] text-[#FFFFFF] gap-[10px] bg-[#D45756] shadow-lg z-50 overflow-y-auto">
            <div className="h-[71px] px-[20px] py-[10px] bg-[#7F1532] flex items-center justify-between mt-5 font-medium text-[38px] leading-[100%] tracking-[-0.05em] font-inter">
                {title}
                <button className="p-1 hover:opacity-80" onClick={handleCloseDrawer}>
                    <X size={30} />
                </button>
            </div>

            {title === 'Buildings' && (
                <div className="p-4">
                    {renderBuildings(buildingsData)}
                </div>
            )}
        </div>
    );
}
