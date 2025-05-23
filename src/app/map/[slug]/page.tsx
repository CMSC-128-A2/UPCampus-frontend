'use client';

import { useState, useEffect } from 'react';
import BuildingSearchBar from '@/components/map/building/BuildingSearchBar';
import FloorPlanView from '@/components/map/building/FloorPlanView';
import FloorSidebar from '@/components/map/building/FloorSidebar';
import RoomSidebar from '@/components/map/building/RoomSidebar';
import { useParams, useRouter } from 'next/navigation';
import { mockBuildingsData } from '@/lib/types/buildings';

type BuildingData = (typeof mockBuildingsData)[keyof typeof mockBuildingsData];

// Define Floor and Room types for better type checking
interface Room {
    code: string;
    name: string;
    icon: string;
    position: {
        x: number;
        y: number;
    };
    category: string;
}

interface Floor {
    name: string;
    code: string;
    floorPlan?: string;
    rooms?: Room[];
}

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
                        code: 'CR1',
                        name: 'Comfort Room 1',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
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
                            y: -6,
                        },
                        category: 'Offices',
                    },
                    {
                        code: '1h',
                        name: 'Server Room',
                        icon: 'briefcase',
                        position: {
                            x: -4.4,
                            y: -8,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'E1',
                        name: 'Emergency Exit 1',
                        icon: 'emergency',
                        position: {
                            x: -2.75,
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

                ],
            },
            {
                name: 'Mezzanine',
                code: 'MZ',
                floorPlan: '/buildings/NSB/COS-mezzanine.svg',
                rooms: [
                    {
                        code: 'MCR',
                        name: 'Mezzanine Comfort Room',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
                    {
                        code: 'M1',
                        name: 'Stock Room',
                        icon: 'briefcase',
                        position: {
                            x: 4.45,
                            y: -4,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'M2',
                        name: 'Human Resource Office',
                        icon: 'briefcase',
                        position: {
                            x: 5.8,
                            y: -6.5,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'M3',
                        name: 'Legal Office',
                        icon: 'briefcase',
                        position: {
                            x: -5.3,
                            y: -4.3,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'M4',
                        name: 'Spare Room',
                        icon: 'briefcase',
                        position: {
                            x: -7.3,
                            y: -6.5,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'M5',
                        name: 'Resident Psychologist',
                        icon: 'briefcase',
                        position: {
                            x: -5.9,
                            y: -8,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'M6',
                        name: 'Common Conference Room & Staff Lounge',
                        icon: 'briefcase',
                        position: {
                            x: -4.49,
                            y: -8,
                        },
                        category: 'Offices',
                    },
                ],
            },
            {
                name: '2nd Floor',
                code: '2F',
                floorPlan: '/buildings/NSB/COS-2nd.svg',
                rooms: [
                    {
                        code: 'CR2',
                        name: 'Comfort Room 2',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
                    {
                        code: '201',
                        name: 'Lecture Room',
                        icon: 'presentation',
                        position: {
                            x: 5.9,
                            y: 6,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '202',
                        name: 'Lecture Room',
                        icon: 'presentation',
                        position: {
                            x: 5.9,
                            y: -0.3,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '203',
                        name: 'Lecture Room',
                        icon: 'presentation',
                        position: {
                            x: 5.9,
                            y: -6.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '204',
                        name: 'Mathematics and Statistics  Office',
                        icon: 'graduation',
                        position: {
                            x: -6,
                            y: -0.3,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'E1',
                        name: 'Emergency Exit 1',
                        icon: 'emergency',
                        position: {
                            x: -2.75,
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
                ],
            },
            {
                name: '3rd Floor',
                code: '3F',
                floorPlan: '/buildings/NSB/COS-3rd.svg',
                rooms: [
                    {
                        code: 'CR3',
                        name: 'Comfort Room 3',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
                    {
                        code: '301',
                        name: 'TBD',
                        icon: 'presentation',
                        position: {
                            x: 4.7,
                            y: 7,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '302',
                        name: 'Robotics and Internet of Things Group',
                        icon: 'presentation',
                        position: {
                            x: 6.8,
                            y: 7,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '303',
                        name: 'Bioinformatics Research Interest Group',
                        icon: 'presentation',
                        position: {
                            x: 4.7,
                            y: 1.6,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '304',
                        name: 'TBD',
                        icon: 'presentation',
                        position: {
                            x: 6.8,
                            y: 1.6,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '305',
                        name: 'TBD',
                        icon: 'presentation',
                        position: {
                            x: 4.7,
                            y: -2.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '306',
                        name: 'TBD',
                        icon: 'presentation',
                        position: {
                            x: 6.8,
                            y: -2.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '307',
                        name: 'Image and Video Analysis Research Group',
                        icon: 'presentation',
                        position: {
                            x: 4.7,
                            y: -7.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '308',
                        name: 'Optimization Research Group',
                        icon: 'presentation',
                        position: {
                            x: 6.8,
                            y: -7.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '309',
                        name: 'TBD',
                        icon: 'presentation',
                        position: {
                            x: -5,
                            y: 6.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '310',
                        name: 'Natural Language Processing Group',
                        icon: 'presentation',
                        position: {
                            x: -7,
                            y: 6.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '311',
                        name: 'Mini Library',
                        icon: 'presentation',
                        position: {
                            x: -5,
                            y: 1.1,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '312',
                        name: 'Office of the Chairperson',
                        icon: 'presentation',
                        position: {
                            x: -7,
                            y: 1.1,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '313',
                        name: 'Department of Computer Science',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: -5.5,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'E1',
                        name: 'Emergency Exit 1',
                        icon: 'emergency',
                        position: {
                            x: -2.75,
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
                ],
            },
            {
                name: '4th Floor',
                code: '4F',
                floorPlan: '/buildings/NSB/COS-4th.svg',
                rooms: [
                    {
                        code: 'CR4',
                        name: 'Comfort Room 4',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
                    {
                        code: '401',
                        name: 'Computer Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: 7,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '402',
                        name: 'Computer Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: 2.3,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '403',
                        name: 'Computer Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: -2.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '404',
                        name: 'Computer Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: -7.1,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '405',
                        name: 'Lecture Room',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: 7,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '406',
                        name: 'Lecture Room',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: 2.3,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '407',
                        name: 'Lecture Room',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: -2.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '408',
                        name: 'Lecture Room',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: -7.1,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: 'E1',
                        name: 'Emergency Exit 1',
                        icon: 'emergency',
                        position: {
                            x: -2.75,
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
                ],
            },
            {
                name: '5th Floor',
                code: '5F',
                floorPlan: '/buildings/NSB/COS-5th.svg',
                rooms: [
                    {
                        code: 'CR5',
                        name: 'Comfort Room 5',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
                    {
                        code: '501',
                        name: 'Faculty Research Laboratory 1',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: 7,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '502',
                        name: 'Faculty Research Laboratory 2',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: 2.3,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '503',
                        name: 'Faculty Research Laboratory 3',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: -2.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '504',
                        name: 'Department of Biology and Environmental Science Conference Room',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: -7.1,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '505',
                        name: 'Department of Biology and Environmental Science Office',
                        icon: 'graduation',
                        position: {
                            x: -6,
                            y: -0.2,
                        },
                        category: 'Offices',
                    },
                    {
                        code: 'E1',
                        name: 'Emergency Exit 1',
                        icon: 'emergency',
                        position: {
                            x: -2.75,
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
                ],
            },
            {
                name: '6th Floor',
                code: '6F',
                floorPlan: '/buildings/NSB/COS-6th.svg',
                rooms: [
                    {
                        code: 'CR6',
                        name: 'Comfort Room 6',
                        icon: 'toilet',
                        position: {
                            x: 2.2,
                            y: -8,
                        },
                        category: 'Comfort Rooms',
                    },
                    {
                        code: '601',
                        name: 'Bioassay Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: 7,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '602',
                        name: 'Histology Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: 2.3,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '603',
                        name: 'Botany Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: -2.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '604',
                        name: 'Zoology Laboratory',
                        icon: 'presentation',
                        position: {
                            x: 5.8,
                            y: -7.1,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '605',
                        name: 'Microbiology Laboratory',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: -6.3,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '606',
                        name: 'Biology Instrumentation Room',
                        icon: 'presentation',
                        position: {
                            x: -5.3,
                            y: -2,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '607',
                        name: 'Biology Laboratory Stockroom',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: 0.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: '608',
                        name: 'Molecular Biology and Genetics Laboratory',
                        icon: 'presentation',
                        position: {
                            x: -6,
                            y: 5.5,
                        },
                        category: 'Classrooms',
                    },
                    {
                        code: 'E1',
                        name: 'Emergency Exit 1',
                        icon: 'emergency',
                        position: {
                            x: -2.75,
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
                ],
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

    const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        const building = buildingData.find((b) => b.slug === slug);
        if (building) {
            setSelectedBuilding(building as unknown as BuildingData);
            setSelectedFloorCode(building.floors[0].code);
        } else {
            router.push('/map');
        }
    }, [slug]);

    // Update selectedFloor when selectedFloorCode changes
    useEffect(() => {
        if (selectedBuilding && selectedFloorCode) {
            const floors =
                'floors' in selectedBuilding &&
                Array.isArray(selectedBuilding.floors)
                    ? selectedBuilding.floors
                    : [];

            // Find floor by code and validate it has required properties
            const floor = floors.find(
                (floor: any) =>
                    floor &&
                    typeof floor === 'object' &&
                    'code' in floor &&
                    floor.code === selectedFloorCode,
            );

            // Type check the floor object to ensure it matches our Floor interface
            if (floor && 'name' in floor && 'code' in floor) {
                setSelectedFloor(floor as Floor);
            } else {
                setSelectedFloor(null);
            }

            setSelectedRoom(null); // Reset selected room when floor changes
            setSelectedRoomCode(null);
        }
    }, [selectedFloorCode, selectedBuilding]);

    // Update selectedRoom when selectedRoomCode changes
    useEffect(() => {
        if (selectedFloor && selectedRoomCode && selectedFloor.rooms) {
            const room = selectedFloor.rooms.find(
                (room) => room.code === selectedRoomCode,
            );
            if (room) {
                setSelectedRoom(room);
            } else {
                setSelectedRoom(null);
            }
        } else {
            setSelectedRoom(null);
        }
    }, [selectedRoomCode, selectedFloor]);

    // Handle closing the room sidebar
    const handleCloseRoomSidebar = () => {
        setSelectedRoomCode(null);
        setSelectedRoom(null);
    };

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
            <FloorSidebar
                selectedFloor={selectedFloor}
                selectedRoomCode={selectedRoomCode}
                setSelectedRoomCode={setSelectedRoomCode}
            />
            <RoomSidebar
                selectedRoom={selectedRoom}
                onClose={handleCloseRoomSidebar}
            />
        </div>
    );
}

export default Page;
