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
    const [isBuildingOpen, setIsBuildingOpen] = useState(false);
    const toggleBuilding = () => {
        setIsBuildingOpen((prev) => !prev);
    };

    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const toggleActivity = () => {
        setIsActivityOpen((prev) => !prev);
    };

    const [isSecurityOpen, setIsSecurityOpen] = useState(false);
    const toggleSecurity = () => {
        setIsSecurityOpen((prev) => !prev);
    };
    
    return (
        <div className="h-screen w-screen relative">
            <SearchBar onBuildingClick={toggleBuilding} onActivityClick={toggleActivity} onSecurityClick={toggleSecurity} />
            
            {isBuildingOpen && <Drawer title="Buildings" />}
            {/* <SearchResults /> */}
            {isActivityOpen && <Drawer title="Activity Area" />}

            {isSecurityOpen && <Drawer title="Security & Parking" />}
            
            {/* Map component */}

            <div className="h-full w-full">
                <Map />
            </div>
        </div>
    );
}
