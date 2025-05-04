'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/map/SearchBar';
import SearchResults from '@/components/map/SearchResults';
import Drawer from '@/components/map/Drawer';

const Map = dynamic(() => import('@/components/map/Map'), {
    ssr: false,
    loading: () => (
        <div className="h-full flex items-center justify-center">
            Loading map...
        </div>
    ),
});

export default function ClientMap() {
    // State for drawer visibility
    const [isBuildingOpen, setIsBuildingOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);

    // Toggle functions
    const toggleBuilding = () => {
        setIsBuildingOpen((prev) => !prev);
    };

    const toggleActivity = () => {
        setIsActivityOpen((prev) => !prev);
    };

    const toggleSecurity = () => {
        setIsSecurityOpen((prev) => !prev);
    };

    return (
        <div className="h-screen w-screen relative">
            <SearchBar
                onBuildingClick={toggleBuilding}
                onActivityClick={toggleActivity}
                onSecurityClick={toggleSecurity}
            />

            {/* Always render drawers, but control visibility through isOpen prop */}
            <Drawer
                title="Buildings"
                onClose={() => setIsBuildingOpen(false)}
                isOpen={isBuildingOpen}
            />

            <Drawer
                title="Activity Area"
                onClose={() => setIsActivityOpen(false)}
                isOpen={isActivityOpen}
            />

            <Drawer
                title="Security & Parking"
                onClose={() => setIsSecurityOpen(false)}
                isOpen={isSecurityOpen}
            />

            {/* Map component */}
            <div className="h-full w-full">
                <Map />
            </div>
        </div>
    );
}
