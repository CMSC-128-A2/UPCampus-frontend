'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { Plus, Minus, Shrink, MapPin } from 'lucide-react';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    onLocate: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onReset,
    onLocate,
}) => {
    return (
        <div className="absolute bottom-4 left-4 flex gap-1 z-10 p-1.5 rounded-lg bg-green-accent">
                    <button
                        onClick={onZoomIn}
                        className="bg-white rounded-tl-sm rounded-bl-sm w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
                        aria-label="Zoom in"
                    >

                            <Plus
                                width="24"
                                height="24"
                                className="text-[#004D37]"
                            />

                    </button>
         
 

            <button
                onClick={onZoomOut}
                className="bg-white  w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
                aria-label="Zoom out"
            >

                    <Minus
                        width="24"
                        height="24"
                        className="text-[#004D37]"
                    />

            </button>

            <button
                onClick={onReset}
                className="bg-white  w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
                aria-label="Reset map view"
            >
 
                    <Shrink
                        width="24"
                        height="24"
                        className="text-[#004D37]"
                    />

            </button>

            <button
                onClick={onLocate}
                className="bg-white rounded-tr-sm rounded-br-sm w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
                aria-label="Show my location"
            >

                    <MapPin
                        width="24"
                        height="24"
                        className="text-[#004D37]"
                    />

            </button>
        </div>
    );
};

export default MapControls;
