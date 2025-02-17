import React from 'react';
import BuildingView from '@/components/BuildingView';

function page({ params }: { params: { id: string } }) {
    return (
        <>
            <BuildingView id={params.id} />
        </>
    );
}

export default page;
