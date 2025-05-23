'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { mockBuildingsData } from '@/lib/types/buildings';
import { Briefcase, Expand, Minus, Plus, Presentation, Siren, Toilet, GraduationCap } from 'lucide-react';

type BuildingData = (typeof mockBuildingsData)[keyof typeof mockBuildingsData];

// Define a floor type to match what's in BuildingSearchBar
interface Floor {
    code?: string;
    name: string;
    facilities?: any[];
    floorPlan?: string;
    rooms?: Room[];
}

interface Room {
    code: string;
    name: string;
    icon: string;
    position: {
        x: number;
        y: number;
    };
}

interface FloorPlanViewProps {
    selectedFloorCode: string | null;
    selectedBuilding: BuildingData | null;
    selectedRoomCode: string | null;
    setSelectedRoomCode: (code: string) => void;
}

const FloorPlanView: React.FC<FloorPlanViewProps> = ({
    selectedFloorCode,
    selectedBuilding,
    selectedRoomCode,
    setSelectedRoomCode,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [floorPlanSrc, setFloorPlanSrc] = useState<string | null>(null);
    const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);
    const [floorPlanDimensions, setFloorPlanDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [aspectRatio, setAspectRatio] = useState(0.75); // Default 4:3 aspect ratio

    // Pan and zoom state
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Reset pan and zoom when floor changes
        // setScale(1);
        // setPosition({ x: 0, y: 0 });

        if (!selectedBuilding || !selectedFloorCode) {
            return;
        }

        setLoading(true);
        setError(null);

        // Find the selected floor
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];

        const selectedFloor = floors.find(
            (floor) =>
                floor.code === selectedFloorCode ||
                floor.name === selectedFloorCode,
        );

        if (!selectedFloor || !selectedFloor.floorPlan) {
            setError('Floor plan not found');
            setLoading(false);
            return;
        }

        setCurrentFloor(selectedFloor);
        setFloorPlanSrc(selectedFloor.floorPlan);
    }, [selectedFloorCode, selectedBuilding]);

    // Add effect to prevent SVG selection after load
    useEffect(() => {
        // Add event listener to SVG elements to prevent selection
        const handleSVGLoad = () => {
            // Find all SVG elements in the container
            const svgElements = containerRef.current?.querySelectorAll('svg');
            if (svgElements) {
                svgElements.forEach((svg) => {
                    svg.style.pointerEvents = 'none';
                    svg.style.userSelect = 'none';

                    // Also prevent selection for all child elements
                    const allSvgElements = svg.querySelectorAll('*');
                    allSvgElements.forEach((el) => {
                        (el as HTMLElement).style.pointerEvents = 'none';
                        (el as HTMLElement).style.userSelect = 'none';
                    });
                });
            }
        };

        // Run initially and every time the image changes
        if (!loading && floorPlanSrc) {
            setTimeout(handleSVGLoad, 100);
        }
    }, [loading, floorPlanSrc]);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        setFloorPlanDimensions({
            width: imgWidth,
            height: imgHeight,
        });
        setAspectRatio(imgHeight / imgWidth);
        setLoading(false);
    };

    const handleImageError = () => {
        setError('Failed to load floor plan image');
        setLoading(false);
    };

    // Pan functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't start dragging if clicking on a room badge
        if ((e.target as HTMLElement).closest('.room-badge')) {
            return;
        }

        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Zoom functionality
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        // Get mouse position relative to the container
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate position relative to the current scale
        const mouseXInImage = (mouseX - position.x) / scale;
        const mouseYInImage = (mouseY - position.y) / scale;

        // Calculate new scale
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const newScale = Math.min(Math.max(scale * zoomFactor, 0.5), 5);

        // Calculate new position to zoom in/out at the mouse position
        const newX = mouseX - mouseXInImage * newScale;
        const newY = mouseY - mouseYInImage * newScale;

        setScale(newScale);
        setPosition({ x: newX, y: newY });
    };

    // Reset zoom and position
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Handle room selection
    const handleRoomClick = (roomCode: string) => {
        setSelectedRoomCode(roomCode);
    };

    // Calculate room badge position based on floor plan dimensions
    const getRoomPosition = (room: Room) => {
        // Convert from coordinates to percentage of floor plan size
        // room.position.x and y are normalized values (-10 to 10) where 0,0 is center
        // We convert them to percentages of the actual image dimensions

        if (
            floorPlanDimensions.width === 0 ||
            floorPlanDimensions.height === 0
        ) {
            return { left: '50%', top: '50%' };
        }

        // Map from [-10, 10] range to [0, 100] percentage range
        const leftPercent = ((room.position.x + 10) / 20) * 100;
        const topPercent = ((room.position.y + 10) / 20) * 100;

        return {
            left: `${leftPercent}%`,
            top: `${topPercent}%`,
        };
    };

    useEffect(() => {
        console.log(position);
    }, [position]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
            style={{
                touchAction: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
            }}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F1532]"></div>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20">
                    <div className="text-red-600 font-bold mb-2">Error</div>
                    <div className="text-center px-4">{error}</div>
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center select-none">
                {floorPlanSrc && (
                    <div
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: '0 0',
                            transition: isDragging ? 'none' : 'transform 0.1s',
                            cursor: isDragging ? 'grabbing' : 'grab',
                            position: 'relative',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                        }}
                    >
                        <img
                            ref={imageRef}
                            src={floorPlanSrc}
                            alt={`Floor plan for ${selectedFloorCode}`}
                            className="w-[80%] object-contain select-none mx-auto"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            draggable={false}
                            style={{
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                pointerEvents: 'none',
                                height: 'auto',
                                maxWidth: '100vw',
                                maxHeight: `calc(100vw * ${aspectRatio})`,
                            }}
                        />

                        {/* Room badges */}
                        {currentFloor?.rooms?.map((room) => {
                            const position = getRoomPosition(room);

                            return (
                                <div
                                    key={room.code}
                                    className={`room-badge absolute flex items-center gap-1.4 md:gap-1 px-2 py-1 rounded-full cursor-pointer transition-all select-none
                                        ${
                                            selectedRoomCode === room.code
                                                ? 'bg-[#7F1532] text-white'
                                                : 'bg-white text-[#7F1532] border border-[#7F1532]'
                                        } 
                                        hover:bg-[#7F1532] hover:text-white`}
                                    style={{
                                        left: position.left,
                                        top: position.top,
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 100,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                        userSelect: 'none',
                                        WebkitUserSelect: 'none',
                                    }}
                                    onClick={() => handleRoomClick(room.code)}
                                    title={room.name}
                                >
                                    <span className="text-sm select-none">
                                        {room.icon === 'briefcase' ? (
                                            <Briefcase className="w-3 h-3 md:w-5 md:h-5" />
                                        ) : room.icon === 'emergency' ? (
                                            <Siren className="w-3 h-3 md:w-5 md:h-5" />
                                        ) : room.icon === 'toilet' ? (
                                            <Toilet className="w-3 h-3 md:w-5 md:h-5" />
                                        ) : room.icon === 'presentation' ? (
                                            <Presentation className="w-3 h-3 md:w-5 md:h-5" /> 
                                        ) : room.icon === 'graduation' ? (
                                            <GraduationCap className="w-3 h-3 md:w-5 md:h-5" /> 
                                        ) : (
                                            room.icon
                                        )}
                                    </span>

                                    {room.icon !== "toilet" && (
                                        <span className="text-xs md:text-xl select-none">
                                            {room.code}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-4 flex gap-1 z-10 p-1.5 rounded-lg bg-green-accent">
                <button
                    className="bg-white rounded-md w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
                    onClick={() => setScale((prev) => Math.min(prev * 1.2, 5))}
                >
                    <Plus className="text-green-accent" />
                </button>
                <button
                    className="bg-white rounded-md w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
                    onClick={() =>
                        setScale((prev) => Math.max(prev * 0.8, 0.5))
                    }
                >
                    <Minus className="text-green-accent" />
                </button>
                <button
                    className="bg-white rounded-md w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
                    onClick={handleReset}
                >
                    <Expand className="text-green-accent" />
                </button>
            </div>
        </div>
    );
};

export default FloorPlanView;
