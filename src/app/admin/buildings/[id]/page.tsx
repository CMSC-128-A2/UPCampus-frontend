import React from 'react';

function page({ params }: { params: { id: string } }) {
    return <div>building {params.id}</div>;
}

export default page;
