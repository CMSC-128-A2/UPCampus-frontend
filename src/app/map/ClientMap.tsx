'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/map/SearchBar';
import SearchResults from '@/components/map/SearchResults';
import Drawer from '@/components/map/Drawer';
import { useMapStore } from '@/store/mapStore';
import LottieLoading from '@/components/LottieLoading';

const Map = dynamic(() => import('@/components/map/Map'), {
    ssr: false,
});

export default function ClientMap() {
    // Use global state for drawer management
    const { activeDrawer, setActiveDrawer } = useMapStore();

    // State to control when to start loading the map
    const [shouldLoadMap, setShouldLoadMap] = useState(false);

    // Start the 2-second timer when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldLoadMap(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <SearchBar />

            {/* Always render drawers, but control visibility through isOpen prop */}
            <Drawer
                title="Buildings"
                onClose={() => setActiveDrawer(null)}
                isOpen={activeDrawer === 'buildings'}
            />

            <Drawer
                title="Activity Area"
                onClose={() => setActiveDrawer(null)}
                isOpen={activeDrawer === 'activity'}
            />

            <Drawer
                title="Security & Parking"
                onClose={() => setActiveDrawer(null)}
                isOpen={activeDrawer === 'security'}
            />

            {/* Map component with 2-second delay */}
            <div className="h-full w-full overflow-hidden">
                {shouldLoadMap ? <Map /> : <LottieLoading />}
            </div>
        </div>
    );
}
