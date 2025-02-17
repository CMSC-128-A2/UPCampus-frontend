'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/app/components/Map'), {
    ssr: false,
    loading: () => <div>Loading map...</div>,
});

export default function ClientMap() {
    return <Map />;
}
