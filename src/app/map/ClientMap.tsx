'use client';

import dynamic from 'next/dynamic';
import SearchBar from '@/components/map/SearchBar';
import SearchResults from '@/components/map/SearchResults';

const Map = dynamic(() => import('@/components/map/Map'), {
    ssr: false,
    loading: () => <div>Loading map...</div>,
    
});

export default function ClientMap() {
    return (
        <div>
            <SearchBar />
            <SearchResults/>
            <Map />
        </div>
    );

}
