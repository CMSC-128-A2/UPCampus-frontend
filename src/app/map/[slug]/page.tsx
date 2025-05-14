'use client';

import { useState, useEffect } from 'react';
import BuildingSearchBar from '@/components/map/building/BuildingSearchBar';
import FloorPlanView from '@/components/map/building/FloorPlanView';
import { useParams, useRouter } from 'next/navigation';
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
                floorPlan: '/buildings/NSB/COS-1st.svg',
                rooms: [
                    {
                        code: '1a',
                        name: 'Budget Office',
                        icon: 'briefcase',
                        position: {
                            x: 6,
                            y: 6.5,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1b',
                        name: 'Office of the Registrar',
                        icon: 'briefcase',
                        position: {
                            x: 6,
                            y: 1,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1c',
                        name: 'Supply and Property Management Office',
                        icon: 'briefcase',
                        position: {
                            x: 6,
                            y: -6,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1d',
                        name: 'College of Science',
                        icon: 'briefcase',
                        position: {
                            x: -6,
                            y: 7,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1e',
                        name: 'Bids and Awards Committee Office',
                        icon: 'briefcase',
                        position: {
                            x: -6.5,
                            y: 3,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1f',
                        name: 'Cash Office',
                        icon: 'briefcase',
                        position: {
                            x: -6.5,
                            y: -1,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1g',
                        name: 'Accounting office',
                        icon: 'briefcase',
                        position: {
                            x: -6.5,
                            y: -7,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1h',
                        name: 'Server Room',
                        icon: 'briefcase',
                        position: {
                            x: -4.5,
                            y: -8,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'E1',
                        name: 'Emergency Exit 1',
                        icon: 'emergency',
                        position: {
                            x: -2.8,
                            y: -8,
                        },
                        category: 'Emergency Exits',
                    },
                    {
                        code: 'E2',
                        name: 'Emergency Exit 2',
                        icon: 'emergency',
                        position: {
                            x: -3.3,
                            y: 8,
                        },
                        category: 'Emergency Exits',
                    },
                    {
                        code: 'E3',
                        name: 'Emergency Exit 3',
                        icon: 'emergency',
                        position: {
                            x: 3,
                            y: 8,
                        },
                        category: 'Emergency Exits',
                    },
                    {
                        code: 'CR1',
                        name: 'Comfort Room 1',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
                ],
            },
            {
                name: 'Mezzanine',
                code: 'MZ',
                floorPlan: '/buildings/NSB/COS-mezzanine.svg',
            },
            {
                name: '2nd Floor',
                code: '2F',
                floorPlan: '/buildings/NSB/COS-2nd.svg',
            },
            {
                name: '3rd Floor',
                code: '3F',
                floorPlan: '/buildings/NSB/COS-3rd.svg',
            },
            {
                name: '4th Floor',
                code: '4F',
                floorPlan: '/buildings/NSB/COS-4th.svg',
            },
            {
                name: '5th Floor',
                code: '5F',
                floorPlan: '/buildings/NSB/COS-5th.svg',
            },
            {
                name: '6th Floor',
                code: '6F',
                floorPlan: '/buildings/NSB/COS-6th.svg',
            },
        ],
    },
];

function Page() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [selectedFloorCode, setSelectedFloorCode] = useState<string | null>(
        null,
    );
    const [selectedRoomCode, setSelectedRoomCode] = useState<string | null>(
        null,
    );
    const [selectedBuilding, setSelectedBuilding] =
        useState<BuildingData | null>(null);

    useEffect(() => {
        const building = buildingData.find((b) => b.slug === slug);
        if (building) {
            setSelectedBuilding(building as unknown as BuildingData);
            setSelectedFloorCode(building.floors[0].code);
        } else {
            router.push('/map');
        }
    }, [slug]);

    useEffect(() => {
        setSelectedRoomCode(null);
    }, [selectedFloorCode]);

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <BuildingSearchBar
                selectedFloorCode={selectedFloorCode}
                setSelectedFloorCode={setSelectedFloorCode}
                selectedBuilding={selectedBuilding}
            />
            <FloorPlanView
                selectedFloorCode={selectedFloorCode}
                selectedBuilding={selectedBuilding}
                selectedRoomCode={selectedRoomCode}
                setSelectedRoomCode={setSelectedRoomCode}
            />
        </div>
    );
}

export default Page;
