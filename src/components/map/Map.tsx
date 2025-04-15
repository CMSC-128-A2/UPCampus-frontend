'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Icon } from '@iconify/react';
import { Building } from 'lucide-react';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxExample = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const svgOverlayRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});

    const [selectedMark, setSelectedMark] = useState<number | null>(null);

    const marks = [
        {
            id: 9,
            icon: <Building />,
            name: 'Building 9',
            coordinates: [123.898096, 10.323937],
        },
    ];

    // Function to create a custom marker element
    const createCustomMarkerElement = (mark: (typeof marks)[0]) => {
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
        markerContent.style.backgroundColor = '#8A1438'; // rose-500
        markerContent.style.color = 'maroon';
        markerContent.style.borderRadius = '9999px';
        markerContent.style.padding = '2px 6px'; // Reduced padding
        markerContent.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        markerContent.style.border = '2px solid maroon';

        // Building icon
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>';
        iconSpan.style.display = 'flex';
        iconSpan.style.marginRight = '3px'; // Reduced margin

        // Add id text
        const idSpan = document.createElement('span');
        idSpan.textContent = mark.id.toString();
        idSpan.style.fontWeight = 'bold';
        idSpan.style.fontSize = '12px'; // Smaller font size

        markerContent.appendChild(iconSpan);
        markerContent.appendChild(idSpan);
        markerEl.appendChild(markerContent);

        // Add click handler
        markerEl.addEventListener('click', () => {
            setSelectedMark(mark.id);

            // Visual feedback for selection
            document.querySelectorAll('.custom-marker').forEach((el) => {
                (el as HTMLElement).style.zIndex = '1';
            });
            markerEl.style.zIndex = '2';

            if (mark.id === selectedMark) {
                setSelectedMark(null);
            } else {
                setSelectedMark(mark.id);
                // You could show more info or highlight the selected marker here
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

        // Add markers for each location
        marks.forEach((mark) => {
            const markerEl = createCustomMarkerElement(mark);
            const marker = new mapboxgl.Marker({
                element: markerEl,
                anchor: 'bottom',
            })
                .setLngLat(mark.coordinates as [number, number])
                .addTo(mapRef.current!);

            markersRef.current[mark.id] = marker;
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

            // Remove navigation controls comment - we don't want these controls
            // mapRef.current.addControl(new mapboxgl.NavigationControl());

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
        };
    }, []);

    // Effect to handle marker updates when selectedMark changes
    useEffect(() => {
        if (mapLoaded) {
            // Update marker appearance based on selection
            Object.entries(markersRef.current).forEach(([id, marker]) => {
                const element = marker.getElement();
                const markerContent = element.querySelector('div');

                if (parseInt(id) === selectedMark) {
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
                        markerContent.style.backgroundColor = '#FFFFFF'; //
                        markerContent.style.transform = 'scale(1)';
                        markerContent.style.color = 'maroon';
                        markerContent.style.border = '2px solid maroon';
                    }
                }
            });
        }
    }, [selectedMark, mapLoaded]);

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
            <button
                onClick={locateUser}
                disabled={isLocating}
                className="absolute bottom-4 right-4 bg-green-accent text-white rounded-full p-2 shadow-md z-10"
            >
                <Icon icon="mdi:location-outline" width="24" height="24" />
            </button>
        </div>
    );
};

export default MapboxExample;
