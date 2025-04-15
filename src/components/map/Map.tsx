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

    const [selectedMark, setSelectedMark] = useState<number | null>(null);

    const marks = [
        {
            id: 9,
            icon: <Building />,
            name: 'Building 9',
            coordinates: [123.898036, 10.323917],
        },
    ];

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
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [123.898731, 10.322466],
                zoom: 18,
                bearing: 80,
                // maxBounds: bounds, // Set the map's boundary limits
            });

            // Add navigation controls
            mapRef.current.addControl(new mapboxgl.NavigationControl());

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

                // If needed, you can adjust the layer to use the rotation
                mapRef.current?.addLayer({
                    id: 'svg-overlay-layer',
                    type: 'raster',
                    source: 'svg-overlay',
                    paint: {
                        'raster-opacity': 1,
                    },
                    layout: {
                        visibility: 'visible',
                    },
                });

                // If rotation is needed in the future, we can implement it using CSS transforms
                // on the SVG overlay container or by using a custom layer

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
            style={{ position: 'relative', width: '100%', height: '100%' }}
            className="bg-[#FFF5E3] w-full h-full"
        >
            <div
                ref={mapContainerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
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
