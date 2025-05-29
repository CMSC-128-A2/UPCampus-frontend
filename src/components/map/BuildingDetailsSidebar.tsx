import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightToLine, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore } from '@/store/mapStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBuildingsData } from '@/lib/types/buildings';

// Coming Soon Ribbon component
const ComingSoonRibbon = () => (
    <div className="absolute -right-2 top-2 transform rotate-[30deg] bg-red-600 text-white text-[8px] font-bold py-[2px] w-24 text-center shadow-sm">
        COMING SOON
    </div>
);

// Updated interface to accommodate all building types
interface BuildingDetail {
    id: string;
    name: string;
    image: string;
    type?: string;
    slug?: string | null;
    // Building-specific properties
    floors?: {
        name: string;
        facilities: (
            | string
            | {
                  name: string;
                  email?: string;
                  contactNumber?: string;
                  site?: string;
              }
        )[];
    }[];
    // Activity-specific properties
    description?: string;
    schedule?: string;
    capacity?: string;
    contactPerson?: string;
    contactNumber?: string;
    // Security-specific properties
    personnel?: string;
    services?: string[];
    operatingHours?: string;
}

const BuildingDetailsSidebar: React.FC = () => {
    // Get the selected mark ID from the global store
    const { selectedMarkId, setSelectedMarkId } = useMapStore();

    // State to track sidebar open/close state for animations
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // State to track the active tab for each building type
    const [activeTab, setActiveTab] = useState<{
        building: string;
        activity: string;
        security: string;
    }>({
        building: 'floors',
        activity: 'about',
        security: 'about',
    });

    // Get building data from mockBuildingsData using selectedMarkId
    const building = selectedMarkId
        ? (mockBuildingsData as Record<string, BuildingDetail>)[selectedMarkId]
        : null;

    // Update sidebar open state when selectedMarkId changes
    useEffect(() => {
        if (selectedMarkId !== null && building !== null) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    }, [selectedMarkId, building]);

    // Function to close the sidebar with animation
    const onClose = () => {
        // First set the animation state
        setSidebarOpen(false);

        // Then clear the selected mark after animation completes
        setTimeout(() => {
            setSelectedMarkId(null);
        }, 300); // Match duration with CSS transition
    };

    // Reset active tab when selectedMarkId changes
    useEffect(() => {
        if (building) {
            if (building.type === 'activity') {
                setActiveTab((prev) => ({ ...prev, activity: 'about' }));
            } else if (building.type === 'security') {
                setActiveTab((prev) => ({ ...prev, security: 'about' }));
            } else {
                setActiveTab((prev) => ({ ...prev, building: 'floors' }));
            }
        }
    }, [selectedMarkId, building]);

    // Handle body scroll lock when sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    // If no building data, render a hidden div to maintain transition capabilities
    if (!building) {
        return (
            <div
                className={`fixed sm:top-0 sm:right-0 w-full sm:w-[320px] md:w-[350px] h-full bg-maroon-accent-light text-white overflow-hidden shadow-lg z-60 
                transition-all duration-300 ease-in-out
                top-[50%] max-h-[50%] 
                sm:max-h-full ${
                    sidebarOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            ></div>
        );
    }

    // Floors tab content for buildings
    const renderFloorsTab = () => {
        return (
            <div className="pt-2">
                <h3 className="text-xl mb-1 px-2">Facilities</h3>

                {building.floors &&
                    building.floors.map((floor, index: number) => (
                        <div key={index} className="mb-4">
                            <h4 className="font-semibold bg-white/20 px-2 my-2 py-2">
                                {floor.name}
                            </h4>
                            <ul className="space-y-1 text-sm px-4">
                                {floor.facilities.map(
                                    (facility, facilityIndex: number) => (
                                        <li
                                            key={facilityIndex}
                                            className="pl-2"
                                        >
                                            {typeof facility === 'string'
                                                ? facility
                                                : facility.name}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    ))}
            </div>
        );
    };

    // About tab content for all types
    const renderAboutTab = () => {
        // For activity type
        if (building.type === 'activity') {
            return (
                <div className="px-4 py-3 space-y-4">
                    {building.description && (
                        <div>
                            <h4 className="font-semibold">Description</h4>
                            <p className="mt-1">{building.description}</p>
                        </div>
                    )}

                    {building.schedule && (
                        <div>
                            <h4 className="font-semibold">Schedule</h4>
                            <p className="mt-1">{building.schedule}</p>
                        </div>
                    )}

                    {building.capacity && (
                        <div>
                            <h4 className="font-semibold">Capacity</h4>
                            <p className="mt-1">{building.capacity}</p>
                        </div>
                    )}
                </div>
            );
        }

        // For security type
        if (building.type === 'security') {
            return (
                <div className="px-4 py-3 space-y-4">
                    {building.personnel && (
                        <div>
                            <h4 className="font-semibold">Personnel</h4>
                            <p className="mt-1">{building.personnel}</p>
                        </div>
                    )}

                    {building.operatingHours && (
                        <div>
                            <h4 className="font-semibold">Operating Hours</h4>
                            <p className="mt-1">{building.operatingHours}</p>
                        </div>
                    )}

                    {building.services && building.services.length > 0 && (
                        <div>
                            <h4 className="font-semibold">Services</h4>
                            <ul className="mt-1 space-y-1 pl-4">
                                {building.services.map(
                                    (service: string, index: number) => (
                                        <li
                                            key={index}
                                            className="list-disc pl-1"
                                        >
                                            {service}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }

        // For building type (default)
        return (
            <div className="px-4 py-3 space-y-4">
                <div>
                    <h4 className="font-semibold">Building Type</h4>
                    <p className="mt-1">Academic Building</p>
                </div>
                <div>
                    <h4 className="font-semibold">Total Floors</h4>
                    <p className="mt-1">{building.floors?.length || 0}</p>
                </div>
            </div>
        );
    };

    // Contacts tab content
    const renderContactsTab = () => {
        // For security type
        if (building.type === 'security') {
            return (
                <div className="px-4 py-3 space-y-4">
                    {building.contactNumber && (
                        <div>
                            <h4 className="font-semibold">Contact Number</h4>
                            <p className="mt-1">{building.contactNumber}</p>
                        </div>
                    )}
                </div>
            );
        }

        // For activity type and building type
        return (
            <div className="px-4 py-3 space-y-4">
                {building.contactPerson && (
                    <div>
                        <h4 className="font-semibold">Contact Person</h4>
                        <p className="mt-1">{building.contactPerson}</p>
                    </div>
                )}

                {building.contactNumber && (
                    <div>
                        <h4 className="font-semibold">Contact Number</h4>
                        <p className="mt-1">{building.contactNumber}</p>
                    </div>
                )}

                {building.floors && (
                    <div>
                        <h4 className="font-semibold">Facility Contacts:</h4>
                        <ul className="list-disc pl-5 space-y-2">
                            {building.floors.flatMap((floor) =>
                                floor.facilities
                                    .filter(
                                        (
                                            facility,
                                        ): facility is {
                                            name: string;
                                            email?: string;
                                            contactNumber?: string;
                                            site?: string;
                                        } =>
                                            typeof facility === 'object' &&
                                            'name' in facility &&
                                            Boolean(
                                                facility.email ||
                                                    facility.contactNumber ||
                                                    facility.site,
                                            ),
                                    )
                                    .map((facility) => (
                                        <li
                                            key={`${floor.name}-${facility.name}`}
                                        >
                                            <span className="font-medium">
                                                {facility.name}
                                            </span>
                                            {facility.email && (
                                                <>
                                                    <br />
                                                    Email:{' '}
                                                    <a
                                                        href={`mailto:${facility.email}`}
                                                        className="text-blue-500 underline"
                                                    >
                                                        {facility.email}
                                                    </a>
                                                </>
                                            )}
                                            {facility.contactNumber && (
                                                <div>
                                                    <span>Contact:</span>{' '}
                                                    {facility.contactNumber}
                                                </div>
                                            )}
                                            {facility.site && (
                                                <div>
                                                    <span>Website:</span>{' '}
                                                    <a
                                                        href={facility.site}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline"
                                                    >
                                                        {facility.site}
                                                    </a>
                                                </div>
                                            )}
                                        </li>
                                    )),
                            )}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    // Images tab content
    const renderImagesTab = () => {
        // For any type (we only have one image now, but this could be expanded)
        return (
            <div className="px-4 py-3">
                <div className="w-full h-48 relative mb-2 bg-maroon-accent p-2">
                    <div className="w-full h-full rounded-md border-2 border-maroon-accent overflow-hidden">
                        <Image
                            src={building.image}
                            alt={`Additional image of ${building.name}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>
        );
    };

    // Render tabs based on building type
    const renderTabs = () => {
        // For activity type
        if (building.type === 'activity') {
            return (
                <Tabs
                    value={activeTab.activity}
                    onValueChange={(value) =>
                        setActiveTab((prev) => ({ ...prev, activity: value }))
                    }
                    className="w-full"
                >
                    <TabsList className="w-[95%] mx-auto grid grid-cols-2 bg-maroon-accent/60">
                        <TabsTrigger
                            value="about"
                            className="text-white data-[state=active]:text-foreground"
                        >
                            About
                        </TabsTrigger>
                        <TabsTrigger
                            value="images"
                            className="text-white data-[state=active]:text-foreground"
                        >
                            Images
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="about">{renderAboutTab()}</TabsContent>
                    <TabsContent value="images">
                        {renderImagesTab()}
                    </TabsContent>
                </Tabs>
            );
        }

        // For security type
        if (building.type === 'security') {
            return (
                <Tabs
                    value={activeTab.security}
                    onValueChange={(value) =>
                        setActiveTab((prev) => ({ ...prev, security: value }))
                    }
                    className="w-full"
                >
                    <TabsList className="w-[95%] mx-auto grid grid-cols-3 bg-maroon-accent/60">
                        <TabsTrigger
                            value="about"
                            className="text-white data-[state=active]:text-foreground"
                        >
                            About
                        </TabsTrigger>
                        <TabsTrigger
                            value="contacts"
                            className="text-white data-[state=active]:text-foreground"
                        >
                            Contacts
                        </TabsTrigger>
                        <TabsTrigger
                            value="images"
                            className="text-white data-[state=active]:text-foreground"
                        >
                            Images
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="about">{renderAboutTab()}</TabsContent>
                    <TabsContent value="contacts">
                        {renderContactsTab()}
                    </TabsContent>
                    <TabsContent value="images">
                        {renderImagesTab()}
                    </TabsContent>
                </Tabs>
            );
        }

        // For building type (default)
        return (
            <Tabs
                value={activeTab.building}
                onValueChange={(value) =>
                    setActiveTab((prev) => ({ ...prev, building: value }))
                }
                className="w-full "
            >
                <TabsList className="w-[95%] mx-auto grid grid-cols-4 bg-maroon-accent/60">
                    <TabsTrigger
                        value="floors"
                        className="text-white data-[state=active]:text-foreground"
                    >
                        Floors
                    </TabsTrigger>
                    <TabsTrigger
                        value="about"
                        className="text-white data-[state=active]:text-foreground"
                    >
                        About
                    </TabsTrigger>
                    <TabsTrigger
                        value="contacts"
                        className="text-white data-[state=active]:text-foreground"
                    >
                        Contacts
                    </TabsTrigger>
                    <TabsTrigger
                        value="images"
                        className="text-white data-[state=active]:text-foreground"
                    >
                        Images
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="floors">{renderFloorsTab()}</TabsContent>
                <TabsContent value="about">{renderAboutTab()}</TabsContent>
                <TabsContent value="contacts">
                    {renderContactsTab()}
                </TabsContent>
                <TabsContent value="images">{renderImagesTab()}</TabsContent>
            </Tabs>
        );
    };

    return (
        <>
            {/* Backdrop overlay - only visible when sidebar is open but non-interactive */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 pointer-events-none ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Sidebar */}
            <div
                className={`fixed sm:top-2 sm:right-2 w-full sm:w-[320px] md:w-[350px] bg-maroon-accent-light text-white overflow-hidden shadow-lg z-50 
                transition-all duration-300 ease-in-out md:rounded-xl
                /* Mobile: Bottom half of screen */
                top-[50%] h-[50%] rounded-t-2xl
                /* Desktop: Full height */
                sm:h-[calc(100%-1rem)] ${
                    sidebarOpen
                        ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
                        : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
                }`}
            >
                {/* Header - non-sticky, outside scroll area */}
                <div className="px-4 py-3 bg-maroon-accent flex items-center justify-between font-medium text-xl tracking-tight font-inter rounded-t-xl">
                    <h2 className="text-xl font-semibold truncate">
                        {building.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X size={22} className="text-white" />
                    </button>
                </div>

                {/* Scrollable content area */}
                <div className="overflow-y-auto h-[calc(100%-56px)]">
                    {/* Building Image */}
                    <div className="w-full h-48 relative my-4 bg-maroon-accent">
                        <Image
                            src={building.image}
                            alt={building.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full border-8 border-maroon-accent"
                        />
                    </div>

                    {/* Go inside building button */}
                    {building.type === 'building' && (
                        <div className="w-full px-2 mb-2">
                            {building.slug ? (
                                <Link href={`/map/${building.slug}`}>
                                    <Button className="w-full rounded-xl">
                                        View Building
                                    </Button>
                                </Link>
                            ) : (
                                <div className="relative overflow-hidden">
                                    <Button
                                        className="w-full rounded-xl"
                                        disabled
                                    >
                                        View Building
                                    </Button>
                                    <ComingSoonRibbon />
                                </div>
                            )}
                        </div>
                    )}
                    {/* Tabs based on building type */}
                    <div className="w-full">{renderTabs()}</div>
                </div>
            </div>
        </>
    );
};

export default BuildingDetailsSidebar;
