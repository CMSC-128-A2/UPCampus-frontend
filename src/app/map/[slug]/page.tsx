'use client';

import { useState, useEffect } from 'react';
import BuildingSearchBar from '@/components/map/building/BuildingSearchBar';
import { useParams } from 'next/navigation';
import { mockBuildingsData } from '@/lib/types/buildings';

type BuildingData = (typeof mockBuildingsData)[keyof typeof mockBuildingsData];

// Local building data that matches the expected structure
const buildingData = [
    {
        id: 'science-building',
        name: 'Science Building',
        image: '/assets/images/random-building.jpg',
        type: 'building',
        slug: 'science-building',
        floors: [
            {
                name: '1st Floor',
                code: '1F',
                facilities: ['Labs', 'Classrooms'],
                floorPlan: '/buildings/NSB/COS-1st.svg',
            },
            {
                name: '2nd Floor',
                code: '2F',
                facilities: ['Faculty Rooms', 'Offices'],
                floorPlan: '/buildings/NSB/COS-2nd.svg',
            },
        ],
    },
];

function Page() {
    const params = useParams();
    const slug = params.slug as string;
    const [selectedFloorCode, setSelectedFloorCode] = useState<string | null>(
        null,
    );
    const [selectedBuilding, setSelectedBuilding] =
        useState<BuildingData | null>(null);

    useEffect(() => {
        console.log(params.slug, 'here');
        const building = buildingData.find((b) => b.slug === slug);
        if (building) {
            setSelectedBuilding(building as unknown as BuildingData);
            setSelectedFloorCode(building.floors[0].code);
        }
    }, [slug]);

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <BuildingSearchBar
                selectedFloorCode={selectedFloorCode}
                setSelectedFloorCode={setSelectedFloorCode}
                selectedBuilding={selectedBuilding}
            />
        </div>
    );
}

export default Page;
