'use client';

import dynamic from 'next/dynamic';
import SearchBar from '@/components/map/SearchBar';
import SearchResults from '@/components/map/SearchResults';

const Map = dynamic(() => import('@/components/map/Map'), {
    ssr: false,
    loading: () => (
        <div className="h-full flex items-center justify-center">
            Loading map...
        </div>
    ),
});

export default function ClientMap() {
    return (
        <div className="h-screen w-screen relative">
            <SearchBar />
            {/* <SearchResults /> */}
            <div className="h-full w-full">
                <Map />
            </div>
        </div>
    );
}
