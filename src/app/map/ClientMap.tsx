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
    type DrawerType = 'buildings' | 'activity' | 'security';
    const [openDrawer, setOpenDrawer] = useState<DrawerType | null>(null);

    // Toggle functions
    const toggleBuilding = () => {
        setOpenDrawer((prev) => (prev === 'buildings' ? null : 'buildings'));
    };

    const toggleActivity = () => {
        setOpenDrawer((prev) => (prev === 'activity' ? null : 'activity'));
    };

    const toggleSecurity = () => {
        setOpenDrawer((prev) => (prev === 'security' ? null : 'security'));
    };

    return (
        <div className="h-screen w-screen relative">
            <SearchBar
                onBuildingClick={toggleBuilding}
                onActivityClick={toggleActivity}
                onSecurityClick={toggleSecurity}
                openDrawer={openDrawer}
            />

            {/* Always render drawers, but control visibility through isOpen prop */}
            <Drawer
                title="Buildings"
                onClose={() => setOpenDrawer(null)}
                isOpen={openDrawer === 'buildings'}
            />

            <Drawer
                title="Activity Area"
                onClose={() => setOpenDrawer(null)}
                isOpen={openDrawer === 'activity'}
            />

            <Drawer
                title="Security & Parking"
                onClose={() => setOpenDrawer(null)}
                isOpen={openDrawer === 'security'}
            />

            {/* Map component */}
            <div className="h-full w-full">
                <Map />
            </div>
        </div>
    );
}
