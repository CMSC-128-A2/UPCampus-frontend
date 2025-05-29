'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { mapMarkers, mockBuildingsData } from '@/lib/types/buildings';

type BuildingData = (typeof mockBuildingsData)[keyof typeof mockBuildingsData];

// Define a floor type to avoid implicit any
interface Floor {
    code?: string;
    name: string;
    facilities?: any[];
    rooms?: any[];
}

// Define room type for search
interface Room {
    code: string;
    name: string;
    icon?: string;
    position?: { x: number; y: number };
    category?: string;
}

interface SearchResult {
    room: Room;
    floor: Floor;
    matchType: 'name' | 'code' | 'category';
    matchText: string;
}

const BuildingSearchBar: React.FC<{
    selectedFloorCode: string | null;
    setSelectedFloorCode: (code: string) => void;
    selectedBuilding: BuildingData | null;
}> = ({ selectedFloorCode, setSelectedFloorCode, selectedBuilding }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Search through building rooms and facilities
    const searchBuildingContent = (searchTerm: string): SearchResult[] => {
        if (!selectedBuilding || !searchTerm.trim()) return [];

        const results: SearchResult[] = [];
        const searchLower = searchTerm.toLowerCase();

        // Check if the building has floors property
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];

        floors.forEach((floor) => {
            // Search through rooms (for detailed building data)
            if (floor.rooms && Array.isArray(floor.rooms)) {
                floor.rooms.forEach((room: Room) => {
                    // Check room name
                    if (
                        room.name &&
                        room.name.toLowerCase().includes(searchLower)
                    ) {
                        results.push({
                            room,
                            floor,
                            matchType: 'name',
                            matchText: room.name,
                        });
                    }
                    // Check room code
                    else if (
                        room.code &&
                        room.code.toLowerCase().includes(searchLower)
                    ) {
                        results.push({
                            room,
                            floor,
                            matchType: 'code',
                            matchText: room.code,
                        });
                    }
                    // Check room category
                    else if (
                        room.category &&
                        room.category.toLowerCase().includes(searchLower)
                    ) {
                        results.push({
                            room,
                            floor,
                            matchType: 'category',
                            matchText: room.category,
                        });
                    }
                });
            }

            // Search through facilities (for building data from mockBuildingsData)
            if (floor.facilities && Array.isArray(floor.facilities)) {
                floor.facilities.forEach((facility: any) => {
                    // Check facility name
                    if (
                        facility.name &&
                        typeof facility.name === 'string' &&
                        facility.name.toLowerCase().includes(searchLower)
                    ) {
                        results.push({
                            room: {
                                code: facility.name.substring(0, 10) + '...',
                                name: facility.name,
                                category: 'Facility',
                            },
                            floor,
                            matchType: 'name',
                            matchText: facility.name,
                        });
                    }
                    // Check facility email
                    else if (
                        facility.email &&
                        typeof facility.email === 'string' &&
                        facility.email.toLowerCase().includes(searchLower)
                    ) {
                        results.push({
                            room: {
                                code: 'EMAIL',
                                name: facility.name || 'Unknown Facility',
                                category: 'Contact',
                            },
                            floor,
                            matchType: 'name',
                            matchText: facility.email,
                        });
                    }
                });
            }
        });

        return results.slice(0, 10); // Limit to 10 results
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const results = searchBuildingContent(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
    };

    const handleSuggestionClick = (result: SearchResult) => {
        // Navigate to the floor containing the selected room/facility
        const floorCode = result.floor.code || result.floor.name;
        setSelectedFloorCode(floorCode);

        // Clear search
        setSearchTerm('');
        setShowSuggestions(false);
        setShowSearchInput(false);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Function to handle floor navigation
    const handleFloorNavigation = (direction: 'up' | 'down') => {
        if (!selectedBuilding) return;

        // Check if the building has floors property
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];

        if (floors.length === 0) return;

        // Find current index by floor code or name if code is not available
        const currentIndex = selectedFloorCode
            ? floors.findIndex(
                  (floor) =>
                      floor.code === selectedFloorCode ||
                      floor.name === selectedFloorCode,
              )
            : -1;

        if (currentIndex === -1) return;

        if (direction === 'up' && currentIndex < floors.length - 1) {
            const nextFloor = floors[currentIndex + 1];
            setSelectedFloorCode(nextFloor.code || nextFloor.name);
        } else if (direction === 'down' && currentIndex > 0) {
            const prevFloor = floors[currentIndex - 1];
            setSelectedFloorCode(prevFloor.code || prevFloor.name);
        }
    };

    // Determine if buttons should be disabled
    const isBottomFloor = () => {
        if (!selectedBuilding || !selectedFloorCode) return false;
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];
        if (floors.length === 0) return true;

        const currentIndex = floors.findIndex(
            (floor) =>
                floor.code === selectedFloorCode ||
                floor.name === selectedFloorCode,
        );
        return currentIndex === 0;
    };

    const isTopFloor = () => {
        if (!selectedBuilding || !selectedFloorCode) return false;
        const floors =
            'floors' in selectedBuilding &&
            Array.isArray(selectedBuilding.floors)
                ? (selectedBuilding.floors as Floor[])
                : [];
        if (floors.length === 0) return true;

        const currentIndex = floors.findIndex(
            (floor) =>
                floor.code === selectedFloorCode ||
                floor.name === selectedFloorCode,
        );
        return currentIndex === floors.length - 1;
    };

    return (
        <div className="flex items-center max-w-[calc(100vw-20px)] w-[518px] h-[69.2px] m-[10px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] z-50 absolute top-0 left-0">
            {!showSearchInput && (
                <>
                    <Link href="/map">
                        <Image
                            src="/assets/images/mainlogo.svg"
                            alt="Upsee Logo"
                            width={60}
                            height={30}
                        />
                    </Link>

                    <div className="hidden md:flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2 border-2 border-transparent focus-within:border-[#FFAE1D] relative">
                        <Search size={20} className="mr-2 text-[#7F1532]" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search rooms, facilities, offices..."
                            className="flex-1 bg-transparent outline-none text-[#7F1532] h-8"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onClick={() => {
                                if (
                                    searchTerm.trim() !== '' &&
                                    suggestions.length > 0
                                ) {
                                    setShowSuggestions(true);
                                }
                            }}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-[300px] overflow-y-auto z-50"
                                style={{ width: '100%' }}
                            >
                                {suggestions.map((result, index) => (
                                    <div
                                        key={`${
                                            result.floor.code ||
                                            result.floor.name
                                        }-${result.room.code}-${index}`}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleSuggestionClick(result)
                                        }
                                    >
                                        <div className="flex items-center">
                                            <Search
                                                size={16}
                                                className="mr-2 text-[#7F1532]"
                                            />
                                            <div>
                                                <span className="font-medium">
                                                    {result.room.name}
                                                </span>
                                                {result.room.code && (
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        ({result.room.code})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1 ml-6">
                                            {result.floor.name}
                                            {result.room.category &&
                                                ` • ${result.room.category}`}
                                            {result.matchType === 'category' &&
                                                ` • Category: ${result.matchText}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        className="md:hidden w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center ml-auto"
                        onClick={() => setShowSearchInput(true)}
                    >
                        <Search size={24} className="text-[#7F1532]" />
                    </div>

                    <div className="flex gap-1 rounded-md overflow-hidden">
                        <div
                            className={`w-[49px] h-[49.2px] p-[10px] gap-[10px] bg-[#FFFFFF] flex items-center justify-center ${
                                isBottomFloor()
                                    ? 'opacity-50'
                                    : 'cursor-pointer'
                            }`}
                            onClick={() =>
                                !isBottomFloor() &&
                                handleFloorNavigation('down')
                            }
                        >
                            <ChevronDown size={24} className="text-[#7F1532]" />
                        </div>

                        <div className="w-[49px] h-[49.2px] p-[10px] gap-[10px] bg-[#FFAE1D] flex items-center justify-center font-bold text-[#7F1532]">
                            {selectedFloorCode}
                        </div>

                        <div
                            className={`w-[49px] h-[49.2px] p-[10px] gap-[10px] bg-[#FFFFFF] flex items-center justify-center ${
                                isTopFloor() ? 'opacity-50' : 'cursor-pointer'
                            }`}
                            onClick={() =>
                                !isTopFloor() && handleFloorNavigation('up')
                            }
                        >
                            <ChevronUp size={24} className="text-[#7F1532]" />
                        </div>
                    </div>
                </>
            )}

            {showSearchInput && (
                <div className="flex items-center w-full relative">
                    <div className="flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2 border-2 border-transparent focus-within:border-[#FFAE1D]">
                        <Search size={20} className="mr-2 text-[#7F1532]" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search rooms, facilities, offices..."
                            className="flex-1 bg-transparent outline-none text-[#7F1532]"
                            autoFocus
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onClick={() => {
                                if (
                                    searchTerm.trim() !== '' &&
                                    suggestions.length > 0
                                ) {
                                    setShowSuggestions(true);
                                }
                            }}
                        />
                    </div>
                    <div
                        className="w-[49px] h-[49.2px] rounded-[5px] ml-2 p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center"
                        onClick={() => {
                            setShowSearchInput(false);
                            setSearchTerm('');
                            setShowSuggestions(false);
                        }}
                    >
                        <X size={24} className="text-[#7F1532]" />
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute top-full left-0 right-[60px] mt-1 bg-white shadow-lg rounded-md max-h-[300px] overflow-y-auto z-50"
                        >
                            {suggestions.map((result, index) => (
                                <div
                                    key={`${
                                        result.floor.code || result.floor.name
                                    }-${result.room.code}-${index}`}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        handleSuggestionClick(result);
                                        setShowSearchInput(false);
                                    }}
                                >
                                    <div className="flex items-center">
                                        <Search
                                            size={16}
                                            className="mr-2 text-[#7F1532]"
                                        />
                                        <div>
                                            <span className="font-medium">
                                                {result.room.name}
                                            </span>
                                            {result.room.code && (
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({result.room.code})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1 ml-6">
                                        {result.floor.name}
                                        {result.room.category &&
                                            ` • ${result.room.category}`}
                                        {result.matchType === 'category' &&
                                            ` • Category: ${result.matchText}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BuildingSearchBar;
