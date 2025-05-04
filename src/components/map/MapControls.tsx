'use client';

import React from 'react';
import { Icon } from '@iconify/react';

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
        <div className="absolute bottom-4 left-4 z-10 flex flex-row bg-green-800 rounded-md shadow-md overflow-hidden">
            <button
                onClick={onZoomIn}
                className="p-3 hover:bg-green-700 border-r border-green-900 transition-colors focus:outline-none"
                aria-label="Zoom in"
            >
                <Icon
                    icon="mdi:plus"
                    width="24"
                    height="24"
                    className="text-white"
                />
            </button>

            <button
                onClick={onZoomOut}
                className="p-3 hover:bg-green-700 border-r border-green-900 transition-colors focus:outline-none"
                aria-label="Zoom out"
            >
                <Icon
                    icon="mdi:minus"
                    width="24"
                    height="24"
                    className="text-white"
                />
            </button>

            <button
                onClick={onReset}
                className="p-3 hover:bg-green-700 border-r border-green-900 transition-colors focus:outline-none"
                aria-label="Reset map view"
            >
                <Icon
                    icon="mdi:restore"
                    width="24"
                    height="24"
                    className="text-white"
                />
            </button>

            <button
                onClick={onLocate}
                className="p-3 hover:bg-green-700 transition-colors focus:outline-none"
                aria-label="Show my location"
            >
                <Icon
                    icon="mdi:map-marker"
                    width="24"
                    height="24"
                    className="text-white"
                />
            </button>
        </div>
    );
};

export default MapControls;
