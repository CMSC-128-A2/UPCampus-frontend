'use client';

import dynamic from 'next/dynamic';
import SearchBar from '@/components/map/SearchBar';
import SearchResults from '@/components/map/SearchResults';
import Drawer from '@/components/map/Drawer';
import { useMapStore } from '@/store/mapStore';

const Map = dynamic(() => import('@/components/map/Map'), {
    ssr: false,
    loading: () => (
        <div className="h-full flex items-center justify-center">
            Loading map...
        </div>
    ),
});

export default function ClientMap() {
    // Use global state for drawer management
    const { activeDrawer, setActiveDrawer } = useMapStore();

    return (
        <div className="h-screen w-screen relative">
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

            {/* Map component */}
            <div className="h-full w-full">
                <Map />
            </div>
        </div>
    );
}
