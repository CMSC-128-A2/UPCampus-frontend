'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Building, Map, X, Goal, ShieldUser } from 'lucide-react';
import { useMapStore, MapDrawerType } from '@/store/mapStore';
import { mapMarkers, mockBuildingsData } from '@/lib/types/buildings';

type BuildingData = (typeof mockBuildingsData)[keyof typeof mockBuildingsData];

// Create a helper function to safely check if a property exists
const hasProperty = <T extends object, K extends string>(
    obj: T,
    prop: K,
): obj is T & Record<K, unknown> => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

const SearchBar: React.FC = () => {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<typeof mapMarkers>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { activeDrawer, toggleDrawer, setSelectedMarkId } = useMapStore();

    const handleDrawerClick = (drawer: MapDrawerType) => {
        setSelectedMarkId(null);
        toggleDrawer(drawer);
    };

    // Function to check if a building contains the search term in any of its data
    const buildingContainsSearchTerm = (
        buildingId: string,
        searchTerm: string,
    ): boolean => {
        const buildingData =
            mockBuildingsData[buildingId as keyof typeof mockBuildingsData];
        if (!buildingData) return false;

        const searchTermLower = searchTerm.toLowerCase();

        // Check name (high priority)
        if (
            buildingData.name &&
            buildingData.name.toLowerCase().includes(searchTermLower)
        ) {
            return true;
        }

        // Check departments if they exist
        if (
            hasProperty(buildingData, 'departments') &&
            Array.isArray(buildingData.departments)
        ) {
            if (
                buildingData.departments.some(
                    (dept: unknown) =>
                        typeof dept === 'string' &&
                        dept.toLowerCase().includes(searchTermLower),
                )
            ) {
                return true;
            }
        }

        // Check contact details
        if (
            hasProperty(buildingData, 'contactNumber') &&
            typeof buildingData.contactNumber === 'string' &&
            buildingData.contactNumber.includes(searchTermLower)
        ) {
            return true;
        }

        if (
            hasProperty(buildingData, 'email') &&
            typeof buildingData.email === 'string' &&
            buildingData.email.toLowerCase().includes(searchTermLower)
        ) {
            return true;
        }

        if (
            hasProperty(buildingData, 'dean') &&
            typeof buildingData.dean === 'string' &&
            buildingData.dean.toLowerCase().includes(searchTermLower)
        ) {
            return true;
        }

        // Check floors and facilities
        if (
            hasProperty(buildingData, 'floors') &&
            Array.isArray(buildingData.floors)
        ) {
            for (const floor of buildingData.floors) {
                if (
                    typeof floor.name === 'string' &&
                    floor.name.toLowerCase().includes(searchTermLower)
                ) {
                    return true;
                }

                if (Array.isArray(floor.facilities)) {
                    if (
                        floor.facilities.some((facility: any) => {
                            // Check facility name
                            if (
                                facility.name &&
                                typeof facility.name === 'string' &&
                                facility.name
                                    .toLowerCase()
                                    .includes(searchTermLower)
                            ) {
                                return true;
                            }

                            // Check facility email
                            if (
                                facility.email &&
                                typeof facility.email === 'string' &&
                                facility.email
                                    .toLowerCase()
                                    .includes(searchTermLower)
                            ) {
                                return true;
                            }

                            // Check facility contact number
                            if (
                                facility.contactNumber &&
                                typeof facility.contactNumber === 'string' &&
                                facility.contactNumber.includes(searchTermLower)
                            ) {
                                return true;
                            }

                            // Check facility site
                            if (
                                facility.site &&
                                typeof facility.site === 'string' &&
                                facility.site
                                    .toLowerCase()
                                    .includes(searchTermLower)
                            ) {
                                return true;
                            }

                            return false;
                        })
                    ) {
                        return true;
                    }
                }
            }
        }

        // For activity and security locations
        if (
            hasProperty(buildingData, 'type') &&
            buildingData.type === 'activity'
        ) {
            if (
                hasProperty(buildingData, 'description') &&
                typeof buildingData.description === 'string' &&
                buildingData.description.toLowerCase().includes(searchTermLower)
            ) {
                return true;
            }
            if (
                hasProperty(buildingData, 'schedule') &&
                typeof buildingData.schedule === 'string' &&
                buildingData.schedule.toLowerCase().includes(searchTermLower)
            ) {
                return true;
            }
            if (
                hasProperty(buildingData, 'contactPerson') &&
                typeof buildingData.contactPerson === 'string' &&
                buildingData.contactPerson
                    .toLowerCase()
                    .includes(searchTermLower)
            ) {
                return true;
            }
        }

        if (
            hasProperty(buildingData, 'type') &&
            buildingData.type === 'security'
        ) {
            if (
                hasProperty(buildingData, 'personnel') &&
                typeof buildingData.personnel === 'string' &&
                buildingData.personnel.toLowerCase().includes(searchTermLower)
            ) {
                return true;
            }
            if (
                hasProperty(buildingData, 'services') &&
                Array.isArray(buildingData.services)
            ) {
                if (
                    buildingData.services.some(
                        (service: unknown) =>
                            typeof service === 'string' &&
                            service.toLowerCase().includes(searchTermLower),
                    )
                ) {
                    return true;
                }
            }

            // Check capacity and description for security/parking locations
            if (
                hasProperty(buildingData, 'capacity') &&
                typeof buildingData.capacity === 'string' &&
                buildingData.capacity.toLowerCase().includes(searchTermLower)
            ) {
                return true;
            }

            if (
                hasProperty(buildingData, 'description') &&
                typeof buildingData.description === 'string' &&
                buildingData.description.toLowerCase().includes(searchTermLower)
            ) {
                return true;
            }

            if (
                hasProperty(buildingData, 'restrictions') &&
                typeof buildingData.restrictions === 'string' &&
                buildingData.restrictions
                    .toLowerCase()
                    .includes(searchTermLower)
            ) {
                return true;
            }
        }

        return false;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === '') {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // First filter by marker name/id (exact name matches get highest priority)
        const nameMatches = mapMarkers.filter((marker) =>
            marker.name.toLowerCase().includes(value.toLowerCase()),
        );

        // Then filter by ID
        const idMatches = mapMarkers.filter(
            (marker) =>
                !nameMatches.includes(marker) &&
                marker.id.toLowerCase().includes(value.toLowerCase()),
        );

        // Then add results from detailed building data
        const contentMatches = mapMarkers.filter(
            (marker) =>
                !nameMatches.includes(marker) &&
                !idMatches.includes(marker) &&
                buildingContainsSearchTerm(marker.id, value),
        );

        // Combine results in priority order
        const combined = [...nameMatches, ...idMatches, ...contentMatches];

        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
    };

    const handleSuggestionClick = (markerId: string) => {
        setSearchTerm('');
        setShowSuggestions(false);
        setSelectedMarkId(markerId);

        // Find marker type and set active drawer
        const marker = mapMarkers.find((m) => m.id === markerId);
        if (marker) {
            toggleDrawer(marker.type as MapDrawerType);
        }
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

    // Function to get matched content for display in suggestion
    const getMatchContext = (markerId: string, searchTerm: string): string => {
        const buildingData =
            mockBuildingsData[markerId as keyof typeof mockBuildingsData];
        if (!buildingData) return '';

        const searchTermLower = searchTerm.toLowerCase();

        // If the name contains the search term, it's the highest priority match
        if (buildingData.name.toLowerCase().includes(searchTermLower)) {
            return ''; // No need to show context if name matches
        }

        // Check floors and facilities first (most likely what people search for)
        if (
            hasProperty(buildingData, 'floors') &&
            Array.isArray(buildingData.floors)
        ) {
            for (const floor of buildingData.floors) {
                if (Array.isArray(floor.facilities)) {
                    for (const facility of floor.facilities) {
                        // Check facility name
                        if (
                            facility.name &&
                            typeof facility.name === 'string' &&
                            facility.name
                                .toLowerCase()
                                .includes(searchTermLower)
                        ) {
                            return `${floor.name}: ${facility.name}`;
                        }

                        // Check facility email
                        if (
                            facility.email &&
                            typeof facility.email === 'string' &&
                            facility.email
                                .toLowerCase()
                                .includes(searchTermLower)
                        ) {
                            return `${floor.name}: ${facility.name} (${facility.email})`;
                        }

                        // Check facility contact number
                        if (
                            facility.contactNumber &&
                            typeof facility.contactNumber === 'string' &&
                            facility.contactNumber.includes(searchTermLower)
                        ) {
                            return `${floor.name}: ${facility.name} (${facility.contactNumber})`;
                        }

                        // Check facility site
                        if (
                            facility.site &&
                            typeof facility.site === 'string' &&
                            facility.site
                                .toLowerCase()
                                .includes(searchTermLower)
                        ) {
                            return `${floor.name}: ${facility.name} (${facility.site})`;
                        }
                    }
                }
            }
        }

        // Check departments
        if (
            hasProperty(buildingData, 'departments') &&
            Array.isArray(buildingData.departments)
        ) {
            for (const dept of buildingData.departments) {
                if (
                    typeof dept === 'string' &&
                    dept.toLowerCase().includes(searchTermLower)
                ) {
                    return `Department: ${dept}`;
                }
            }
        }

        // For activity locations
        if (
            hasProperty(buildingData, 'type') &&
            buildingData.type === 'activity'
        ) {
            if (
                hasProperty(buildingData, 'description') &&
                typeof buildingData.description === 'string' &&
                buildingData.description.toLowerCase().includes(searchTermLower)
            ) {
                return buildingData.description;
            }
        }

        // For security locations
        if (
            hasProperty(buildingData, 'type') &&
            buildingData.type === 'security'
        ) {
            if (
                hasProperty(buildingData, 'services') &&
                Array.isArray(buildingData.services)
            ) {
                for (const service of buildingData.services) {
                    if (
                        typeof service === 'string' &&
                        service.toLowerCase().includes(searchTermLower)
                    ) {
                        return `Service: ${service}`;
                    }
                }
            }

            // Check capacity for parking locations
            if (
                hasProperty(buildingData, 'capacity') &&
                typeof buildingData.capacity === 'string' &&
                buildingData.capacity.toLowerCase().includes(searchTermLower)
            ) {
                return `Capacity: ${buildingData.capacity}`;
            }

            // Check description
            if (
                hasProperty(buildingData, 'description') &&
                typeof buildingData.description === 'string' &&
                buildingData.description.toLowerCase().includes(searchTermLower)
            ) {
                return buildingData.description;
            }
        }

        return '';
    };

    return (
        <div className="flex items-center max-w-[calc(100vw-20px)] w-[538px] h-[69.2px] m-[10px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] z-50 absolute top-0 left-0">
            {!showSearchInput && (
                <>
                    <Link href="/">
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
                            placeholder="Search buildings or facilities"
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
                                {suggestions.map((suggestion) => {
                                    const matchContext = searchTerm
                                        ? getMatchContext(
                                              suggestion.id,
                                              searchTerm,
                                          )
                                        : '';

                                    return (
                                        <div
                                            key={suggestion.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    suggestion.id,
                                                )
                                            }
                                        >
                                            <div className="flex items-center">
                                                {suggestion.type ===
                                                    'buildings' && (
                                                    <Building
                                                        size={16}
                                                        className="mr-2 text-[#7F1532]"
                                                    />
                                                )}
                                                {suggestion.type ===
                                                    'activity' && (
                                                    <Goal
                                                        size={16}
                                                        className="mr-2 text-[#7F1532]"
                                                    />
                                                )}
                                                {suggestion.type ===
                                                    'security' && (
                                                    <ShieldUser
                                                        size={16}
                                                        className="mr-2 text-[#7F1532]"
                                                    />
                                                )}
                                                <div>
                                                    <span className="font-medium">
                                                        {suggestion.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        ({suggestion.id})
                                                    </span>
                                                </div>
                                            </div>
                                            {matchContext && (
                                                <div className="text-xs text-gray-600 mt-1 ml-6">
                                                    {matchContext}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div
                        className="md:hidden w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center ml-auto"
                        onClick={() => setShowSearchInput(true)}
                    >
                        <Search size={24} className="text-[#7F1532]" />
                    </div>

                    <div
                        onClick={() => handleDrawerClick('buildings')}
                        className={`group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] cursor-pointer flex items-center justify-center 
                        hover:bg-[#FFAE1D] transition-colors duration-300 ease-in-out ${
                            activeDrawer === 'buildings'
                                ? 'bg-[#FFAE1D]'
                                : 'bg-white'
                        }`}
                    >
                        <Building
                            size={24}
                            className="text-[#7F1532] group-hover:text-[#004D37] transition-colors duration-300 ease-in-out"
                        />
                    </div>

                    <div
                        onClick={() => handleDrawerClick('activity')}
                        className={`group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] cursor-pointer flex items-center justify-center 
                        hover:bg-[#FFAE1D] transition-colors duration-300 ease-in-out ${
                            activeDrawer === 'activity'
                                ? 'bg-[#FFAE1D]'
                                : 'bg-white'
                        }`}
                    >
                        <Goal
                            size={24}
                            className="text-[#7F1532] group-hover:text-[#004D37] transition-colors duration-300 ease-in-out"
                        />
                    </div>
                    <div
                        onClick={() => handleDrawerClick('security')}
                        className={`group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] cursor-pointer flex items-center justify-center 
                        hover:bg-[#FFAE1D] transition-colors duration-300 ease-in-out ${
                            activeDrawer === 'security'
                                ? 'bg-[#FFAE1D]'
                                : 'bg-white'
                        }`}
                    >
                        <ShieldUser
                            size={24}
                            className="text-[#7F1532] group-hover:text-[#004D37] transition-colors duration-300 ease-in-out"
                        />
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
                            placeholder="Search buildings, facilities, offices..."
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
                            {suggestions.map((suggestion) => {
                                const matchContext = searchTerm
                                    ? getMatchContext(suggestion.id, searchTerm)
                                    : '';

                                return (
                                    <div
                                        key={suggestion.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleSuggestionClick(
                                                suggestion.id,
                                            );
                                            setShowSearchInput(false);
                                        }}
                                    >
                                        <div className="flex items-center">
                                            {suggestion.type ===
                                                'buildings' && (
                                                <Building
                                                    size={16}
                                                    className="mr-2 text-[#7F1532]"
                                                />
                                            )}
                                            {suggestion.type === 'activity' && (
                                                <Goal
                                                    size={16}
                                                    className="mr-2 text-[#7F1532]"
                                                />
                                            )}
                                            {suggestion.type === 'security' && (
                                                <ShieldUser
                                                    size={16}
                                                    className="mr-2 text-[#7F1532]"
                                                />
                                            )}
                                            <div>
                                                <span className="font-medium">
                                                    {suggestion.name}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({suggestion.id})
                                                </span>
                                            </div>
                                        </div>
                                        {matchContext && (
                                            <div className="text-xs text-gray-600 mt-1 ml-6">
                                                {matchContext}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
