'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Icon } from '@iconify/react';
import { Building, Star } from 'lucide-react';
import BuildingDetailsSidebar from './BuildingDetailsSidebar';
import { useMapStore } from '@/store/mapStore';

import 'mapbox-gl/dist/mapbox-gl.css';

// Building data with details
const buildingsData = {
    9: {
        id: 9,
        name: 'College of Science Building',
        image: '/assets/images/random-building.jpg',
        floors: [
            {
                name: '1st Floor',
                facilities: [
                    'Office of the University Registrar',
                    'Cashier Office',
                    'College of Science Dean Office',
                    'College of Science Secretary Office',
                    'Bids and Awards Committee Office',
                    'Comfort Rooms',
                ],
            },
            {
                name: 'Mezzanine Floor',
                facilities: [
                    'Legal Office',
                    'Resident Psychologist Office',
                    'Faculty Lounge',
                    'Human Resources and Development Office',
                    'Stock Room',
                ],
            },
            {
                name: '2nd Floor',
                facilities: [
                    'Math and Statistics Office',
                    'Math-Stat Laboratory Rooms',
                    'Comfort Rooms',
                ],
            },
            {
                name: '3rd Floor',
                facilities: [
                    'Department of Computer Science (DCS) Faculty Room',
                    'DCS Laboratory Rooms',
                    'DCS Mini Library',
                    'DCS Mini Conference Room',
                    'Comfort Rooms',
                ],
            },
            {
                name: '4th Floor',
                facilities: [
                    'DCS Lecture Rooms',
                    'DCS Teaching Labs',
                    'Comfort Rooms',
                ],
            },
            {
                name: '5th Floor',
                facilities: [
                    'Biology Faculty Room',
                    'Biology Lecture Rooms',
                    'Comfort Rooms',
                ],
            },
            {
                name: '6th Floor',
                facilities: [
                    'Histology Laboratory',
                    'Botany Laboratory',
                    'Zoology Laboratory',
                    'Molecular Biology and Genetics Laboratory',
                ],
            },
        ],
    },
};

const MapboxExample = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const svgOverlayRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
    const testMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const clickPopupRef = useRef<mapboxgl.Popup | null>(null);

    // Use the global store for selected mark
    const { selectedMarkId, setSelectedMarkId } = useMapStore();

    // Track if sidebar is open (no longer needs to be local state)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [clickedCoordinates, setClickedCoordinates] = useState<
        [number, number] | null
    >(null);

    const mapMarkers = [
        {
            id: '9',
            type: 'building',
            icon: <Building />,
            name: 'Building 9',
            coordinates: [123.898096, 10.323937],
        },
        {
            id: '10',
            type: 'building',
            icon: <Building />,
            name: 'Building 10',
            coordinates: [123.897949, 10.323871],
        },
        {
            id: '8',
            type: 'building',
            icon: <Building />,
            name: 'Building 8',
            coordinates: [123.898273, 10.323521],
        },
        {
            id: '7',
            type: 'building',
            icon: <Building />,
            name: 'Building 7',
            coordinates: [123.897928, 10.323404],
        },
        {
            id: '6b',
            type: 'building',
            icon: <Building />,
            name: 'Building 6b',
            coordinates: [123.897771, 10.32311],
        },
        {
            id: '6a',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.897737, 10.32278],
        },
        {
            id: '6c',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.897714, 10.322545],
        },
        {
            id: '6',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.8978, 10.322611],
        },
        {
            id: '1',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.898199, 10.322329],
        },
        {
            id: '2',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.897939, 10.322249],
        },
        {
            id: '5d',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.897523, 10.322135],
        },
        {
            id: '5a',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.897562, 10.321921],
        },
        {
            id: '5',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.89759, 10.321825],
        },
        {
            id: '5b',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.897685, 10.321631],
        },
        {
            id: '5c',
            type: 'building',
            icon: <Building />,
            name: 'Building 6a',
            coordinates: [123.897555, 10.321638],
        },
        {
            id: 'A9',
            type: 'featured',
            icon: <Star />,
            name: 'Featured A9',
            coordinates: [123.897727, 10.323369],
        },
    ];

    // Update sidebar visibility when selectedMarkId changes
    useEffect(() => {
        if (selectedMarkId !== null) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [selectedMarkId]);

    // Function to close sidebar
    const handleCloseSidebar = () => {
        setSelectedMarkId(null); // Update the global state
        setIsSidebarOpen(false);
    };

    // Get building details for selected marker
    const getSelectedBuildingDetails = () => {
        if (selectedMarkId === null) return null;

        // Use a type assertion to handle string IDs
        const numericId = parseInt(selectedMarkId);
        if (isNaN(numericId)) return null;

        return buildingsData[numericId as keyof typeof buildingsData] || null;
    };

    // Function to create a custom marker element
    const createCustomMarkerElement = (marker: (typeof mapMarkers)[0]) => {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker';
        markerEl.style.cursor = 'pointer';
        markerEl.style.transform = 'scale(0.85)'; // Overall scale reduction

        // Create marker content
        const markerContent = document.createElement('div');
        markerContent.className =
            'flex items-center bg-maroon-accent text-white rounded-full px-2 py-1';
        markerContent.style.display = 'flex';
        markerContent.style.alignItems = 'center';

        // Same styling for all markers
        markerContent.style.backgroundColor = '#8A1438'; // Maroon color for all markers
        markerContent.style.color = 'maroon';
        markerContent.style.border = '2px solid maroon';
        markerContent.style.borderRadius = '9999px';
        markerContent.style.padding = '2px 6px'; // Reduced padding
        markerContent.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        // Building icon for all markers
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>';
        iconSpan.style.display = 'flex';
        iconSpan.style.marginRight = '3px'; // Reduced margin

        // Add id text
        const idSpan = document.createElement('span');
        idSpan.textContent = marker.id.toString();
        idSpan.style.fontWeight = 'bold';
        idSpan.style.fontSize = '12px'; // Smaller font size

        markerContent.appendChild(iconSpan);
        markerContent.appendChild(idSpan);
        markerEl.appendChild(markerContent);

        // Add click handler
        markerEl.addEventListener('click', () => {
            const markerId = marker.id.toString();

            // Visual feedback for selection
            document.querySelectorAll('.custom-marker').forEach((el) => {
                (el as HTMLElement).style.zIndex = '1';
            });
            markerEl.style.zIndex = '2';

            if (markerId === selectedMarkId) {
                setSelectedMarkId(null); // Update the global state
            } else {
                setSelectedMarkId(markerId); // Update the global state
            }
        });

        return markerEl;
    };

    // Function to add markers to the map
    const addMarkersToMap = () => {
        if (!mapRef.current) return;

        // Clear any existing markers
        Object.values(markersRef.current).forEach((marker) => marker.remove());
        markersRef.current = {};

        // Add all markers (buildings and featured)
        mapMarkers.forEach((mapMarker) => {
            const markerEl = createCustomMarkerElement(mapMarker);
            const mapboxMarker = new mapboxgl.Marker({
                element: markerEl,
                anchor: 'bottom',
            })
                .setLngLat(mapMarker.coordinates as [number, number])
                .addTo(mapRef.current!);

            markersRef.current[mapMarker.id] = mapboxMarker;
        });
    };

    // Function to get and show user's location
    const locateUser = () => {
        setIsLocating(true);

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;

                    if (mapRef.current) {
                        // Move map to user location
                        mapRef.current.flyTo({
                            center: [longitude, latitude],
                            zoom: 19,
                        });

                        // Remove previous marker and popup if they exist
                        if (markerRef.current) {
                            markerRef.current.remove();
                        }
                        if (popupRef.current) {
                            popupRef.current.remove();
                        }

                        // Create popup
                        popupRef.current = new mapboxgl.Popup({
                            closeButton: false,
                        })
                            .setLngLat([longitude, latitude])
                            .setHTML(
                                '<p style="margin: 0; font-weight: bold;">You are here</p>',
                            )
                            .addTo(mapRef.current);

                        // Create custom marker with man emoji
                        const el = document.createElement('div');
                        el.className = 'user-location-marker';
                        el.innerHTML = '👨';
                        el.style.fontSize = '30px';
                        el.style.display = 'flex';
                        el.style.justifyContent = 'center';
                        el.style.alignItems = 'center';
                        el.style.cursor = 'pointer';

                        // Add click event to the marker element
                        el.addEventListener('click', () => {
                            if (popupRef.current) {
                                popupRef.current.remove();
                            }

                            popupRef.current = new mapboxgl.Popup({
                                closeButton: false,
                            })
                                .setLngLat([longitude, latitude])
                                .setHTML(
                                    '<p style="margin: 0; font-weight: bold;">You are here</p>',
                                )
                                .addTo(mapRef.current!);
                        });

                        // Add marker to map
                        markerRef.current = new mapboxgl.Marker(el)
                            .setLngLat([longitude, latitude])
                            .addTo(mapRef.current);
                    }

                    setIsLocating(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLocating(false);
                },
            );
        } else {
            console.error('Geolocation is not supported by this browser');
            setIsLocating(false);
        }
    };

    // Setup map on component mount
    useEffect(() => {
        // Get access token from environment variable
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (!accessToken) {
            console.error(
                'Mapbox access token is not defined in environment variables',
            );
            return;
        }

        mapboxgl.accessToken = accessToken;

        // Define boundaries approximately 3km from the center point
        // At this latitude, 0.009 degrees ≈ 1km, so 0.0029 ≈ 3km in both directions
        const center = [123.898675, 10.322775];
        // Define overlay parameters
        const overlaySize = 0.0014;
        const overlayRotation = 1; // Rotation adjustment: 90 - 80 = 10 (accounting for map bearing)
        const mapBearing = 80; // Match the map bearing value

        const bounds = new mapboxgl.LngLatBounds(
            [center[0] - 0.0029, center[1] - 0.0029], // Southwest: 3km west and south from center
            [center[0] + 0.0029, center[1] + 0.0029], // Northeast: 3km east and north from center
        );

        // Check if container is available
        if (!mapContainerRef.current) {
            console.error('Map container ref is not available');
            return;
        }

        try {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: {
                    version: 8,
                    sources: {},
                    layers: [
                        {
                            id: 'background',
                            type: 'background',
                            paint: {
                                'background-color': '#FFF5E3',
                            },
                        },
                    ],
                },
                center: [123.898675, 10.322775],
                zoom: 18,
                bearing: 80,
                // maxBounds: bounds, // Set the map's boundary limits
            });

            // Resize map on container resize and setup SVG overlay
            mapRef.current.on('load', () => {
                mapRef.current?.resize();
                setMapLoaded(true);

                // Add a custom layer for the SVG
                mapRef.current?.addSource('svg-overlay', {
                    type: 'image',
                    url: '/assets/images/up_map.png',
                    coordinates: calculateRotatedCoordinates(
                        [center[0], center[1]],
                        overlaySize,
                        overlaySize,
                        overlayRotation - mapBearing,
                    ),
                });

                mapRef.current?.addLayer({
                    id: 'svg-overlay-layer',
                    type: 'raster',
                    source: 'svg-overlay',
                    paint: {
                        'raster-opacity': 1,
                    },
                });

                // Add markers to the map
                addMarkersToMap();

                // Update overlay when map moves
                mapRef.current?.on('move', updateSvgOverlay);
                mapRef.current?.on('zoom', updateSvgOverlay);
                mapRef.current?.on('resize', updateSvgOverlay);

                // Add click event to show coordinates
                mapRef.current?.on('click', (e) => {
                    // Remove existing popup if it exists
                    if (clickPopupRef.current) {
                        clickPopupRef.current.remove();
                    }

                    // Store clicked coordinates
                    const coords: [number, number] = [
                        e.lngLat.lng,
                        e.lngLat.lat,
                    ];
                    setClickedCoordinates(coords);

                    // Format coordinates with 6 decimal places
                    const lng = coords[0].toFixed(6);
                    const lat = coords[1].toFixed(6);

                    // Create popup with coordinates in the requested format
                    if (mapRef.current) {
                        clickPopupRef.current = new mapboxgl.Popup({
                            closeButton: true,
                            closeOnClick: false,
                        })
                            .setLngLat(coords)
                            .setHTML(
                                `
                                <div style="font-family: sans-serif; text-align: center;">
                                    <h3 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">Coordinates</h3>
                                    <p style="margin: 0 0 5px 0; font-size: 13px; font-family: monospace;">[${lng}, ${lat}]</p>
                                    <button 
                                        id="copy-coords-btn" 
                                        style="background-color: #8A1438; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; margin-top: 2px;"
                                        onclick="navigator.clipboard.writeText('[${lng}, ${lat}]').then(() => { 
                                            const btn = document.getElementById('copy-coords-btn');
                                            btn.textContent = 'Copied!';
                                            setTimeout(() => { btn.textContent = 'Copy' }, 2000);
                                        })"
                                    >Copy</button>
                                </div>
                            `,
                            )
                            .addTo(mapRef.current);
                    }
                });

                // Initial update
                updateSvgOverlay();
            });
        } catch (error) {
            console.error('Error initializing map:', error);
        }

        return () => {
            mapRef.current?.off('move', updateSvgOverlay);
            mapRef.current?.off('zoom', updateSvgOverlay);
            mapRef.current?.off('resize', updateSvgOverlay);
            mapRef.current?.remove();
            popupRef.current?.remove();
            clickPopupRef.current?.remove();
        };
    }, []);

    // Effect to handle marker updates when selectedMarkId changes
    useEffect(() => {
        if (mapLoaded) {
            // Update marker appearance based on selection
            Object.entries(markersRef.current).forEach(([id, marker]) => {
                const element = marker.getElement();
                const markerContent = element.querySelector('div');

                if (id === selectedMarkId) {
                    element.style.zIndex = '2';
                    if (markerContent) {
                        markerContent.style.backgroundColor = '#8A1438'; // maroon-accent
                        markerContent.style.transform = 'scale(1.1)';
                        markerContent.style.color = 'white';
                        markerContent.style.border = '2px solid white';
                    }
                } else {
                    element.style.zIndex = '1';
                    if (markerContent) {
                        markerContent.style.backgroundColor = '#FFFFFF';
                        markerContent.style.transform = 'scale(1)';
                        markerContent.style.color = 'maroon';
                        markerContent.style.border = '2px solid maroon';
                    }
                }
            });
        }
    }, [selectedMarkId, mapLoaded]);

    // Effect to zoom to selected marker when selectedMarkId changes
    useEffect(() => {
        if (mapLoaded && selectedMarkId && mapRef.current) {
            // Find the selected marker in mapMarkers
            const selectedMarker = mapMarkers.find(
                (marker) => marker.id === selectedMarkId,
            );

            // If marker exists, zoom to its coordinates
            if (selectedMarker) {
                mapRef.current.flyTo({
                    center: selectedMarker.coordinates as [number, number],
                    zoom: 19,
                    duration: 1000, // Animation duration in milliseconds
                    essential: true, // This animation is considered essential
                });
            }
        }
    }, [selectedMarkId, mapLoaded]);

    // Function to update SVG overlay position and scale
    const updateSvgOverlay = () => {
        if (!mapRef.current || !svgOverlayRef.current) return;

        const map = mapRef.current;
        // Get the bounds of the current map view
        const bounds = map.getBounds();
        if (!bounds) return;

        // Calculate the position and scale for the SVG overlay
        const width = mapContainerRef.current?.offsetWidth || 0;
        const height = mapContainerRef.current?.offsetHeight || 0;

        // Apply transformation to the SVG container
        svgOverlayRef.current.style.width = `${width}px`;
        svgOverlayRef.current.style.height = `${height}px`;
        svgOverlayRef.current.style.left = '0';
        svgOverlayRef.current.style.top = '0';
    };

    // Add this function to calculate rotated coordinates
    function calculateRotatedCoordinates(
        center: [number, number],
        width: number,
        height: number,
        angleDegrees: number,
    ): [
        [number, number],
        [number, number],
        [number, number],
        [number, number],
    ] {
        // Convert angle from degrees to radians
        const angleRadians = (angleDegrees * Math.PI) / 180;

        // Calculate the original unrotated corners (relative to center)
        const corners = [
            [-width, height], // top-left
            [width, height], // top-right
            [width, -height], // bottom-right
            [-width, -height], // bottom-left
        ];

        // Apply rotation to each corner
        const rotatedCorners = corners.map(([x, y]) => {
            const rotatedX =
                x * Math.cos(angleRadians) - y * Math.sin(angleRadians);
            const rotatedY =
                x * Math.sin(angleRadians) + y * Math.cos(angleRadians);
            return [center[0] + rotatedX, center[1] + rotatedY] as [
                number,
                number,
            ];
        });

        // Return as the specific type needed
        return [
            rotatedCorners[0],
            rotatedCorners[1],
            rotatedCorners[2],
            rotatedCorners[3],
        ] as [
            [number, number],
            [number, number],
            [number, number],
            [number, number],
        ];
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: '#FFF5E3',
            }}
            className="w-full h-full"
        >
            <div
                ref={mapContainerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: '#FFF5E3',
                }}
                className="w-full h-full"
            ></div>
            <div
                ref={svgOverlayRef}
                style={{
                    position: 'absolute',
                    pointerEvents: 'none', // Allow interactions with the map below
                }}
                className="w-full h-full"
            />

            {/* Location button */}
            <button
                onClick={locateUser}
                disabled={isLocating}
                className="absolute bottom-4 right-4 bg-green-accent text-white rounded-full p-2 shadow-md z-10"
            >
                <Icon icon="mdi:location-outline" width="24" height="24" />
            </button>

            {/* Building Details Sidebar */}
            <BuildingDetailsSidebar
                building={getSelectedBuildingDetails()}
                onClose={handleCloseSidebar}
            />
        </div>
    );
};

export default MapboxExample;
