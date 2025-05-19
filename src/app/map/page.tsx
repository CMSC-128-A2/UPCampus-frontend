'use client';

import dynamic from 'next/dynamic';

const ClientMap = dynamic(() => import('./ClientMap'), {
    ssr: false,
    loading: () => <div>Loading map...</div>,
});

export default function Page() {
    return <ClientMap />;
}
