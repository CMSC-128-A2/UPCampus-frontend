'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Icon } from '@iconify/react';
import { Building, Star } from 'lucide-react';
import BuildingDetailsSidebar from './BuildingDetailsSidebar';
import MapControls from './MapControls';
import { useMapStore } from '@/store/mapStore';
import { mapMarkers, mockBuildingsData } from '@/lib/types/buildings';

import 'mapbox-gl/dist/mapbox-gl.css';

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

    // Store initial center and zoom for reset functionality
    const initialCenter: [number, number] = [123.898675, 10.322775];
    const initialZoom = 18;
    const initialBearing = 80;

    // Use the global store for selected mark
    const { selectedMarkId, setSelectedMarkId, activeDrawer } = useMapStore();

    // Track if sidebar is open (no longer needs to be local state)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [clickedCoordinates, setClickedCoordinates] = useState<
        [number, number] | null
    >(null);

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

        // Use the ID as is, without trying to convert to number
        return (
            mockBuildingsData[
                selectedMarkId as keyof typeof mockBuildingsData
            ] || null
        );
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
        markerContent.style.backgroundColor = '#FFFFFF'; // White background instead of maroon
        markerContent.style.color = 'maroon';
        markerContent.style.border = '2px solid maroon';
        markerContent.style.borderRadius = '9999px';
        markerContent.style.padding = '2px 6px'; // Reduced padding
        markerContent.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        // Building icon for all markers
        const iconSpan = document.createElement('span');
        // Use different icons based on marker type
        if (marker.icon === 'star') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
        } else if (marker.icon === 'building') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>';
        } else if (marker.icon === 'book') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
        } else if (marker.icon === 'clinic') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 11v4m2-2h-4m6-7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m10 0v14M6 6v14"/><rect width="20" height="14" x="2" y="6" rx="2"/></g></svg>';
        } else if (marker.icon === 'food') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>';
        } else if (marker.icon === 'volleyball') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4M12 12a12.6 12.6 0 0 1-8.7 5m13.5-3.4a16.55 16.55 0 0 1-9 7.5"/><path d="M20.7 17a12.8 12.8 0 0 0-8.7-5a13.3 13.3 0 0 1 0-10M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5"/><circle cx="12" cy="12" r="10"/></g></svg>';
        } else if (marker.icon === 'tent') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.5 21L14 3m6.5 18L10 3m5.5 18L12 15l-3.5 6M2 21h20"/></svg>';
        } else if (marker.icon === 'target') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 2v3h3m-8.6 5.6L22 2"/><circle cx="12" cy="12" r="2"/><path d="M12.3 6H12a6 6 0 1 0 6 6v-.3"/><path d="M15 2.5A9.93 9.93 0 1 0 21.5 9M5.3 19.4L4 22m14.7-2.6L20 22"/></g></svg>';
        } else if (marker.icon === 'football') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M11.9 6.7s-3 1.3-5 3.6c0 0 0 3.6 1.9 5.9c0 0 3.1.7 6.2 0c0 0 1.9-2.3 1.9-5.9c0 .1-2-2.3-5-3.6m0 0V2m5 8.4s3-1.4 4.5-1.6M15 16.3s1.9 2.7 2.9 3.7m-9.1-3.7S6.9 19 6 20"/><path d="M2.6 8.7C4 9 7 10.4 7 10.4"/></g></svg>';
        } else if (marker.icon === 'shield') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M6.376 18.91a6 6 0 0 1 11.249.003"/><circle cx="12" cy="11" r="4"/></g></svg>';
        } else if (marker.icon === 'basketball') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2.1 13.4A10.1 10.1 0 0 0 13.4 2.1M5 4.9l14 14.2m2.9-8.5a10.1 10.1 0 0 0-11.3 11.3"/></g></svg>';
        } else if (marker.icon === 'car') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car-icon lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';
        } else if (marker.icon === 'bike') {
            iconSpan.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bike-icon lucide-bike"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>';
        }
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

        // Filter markers based on activeDrawer
        const filteredMarkers =
            activeDrawer === null
                ? mapMarkers
                : mapMarkers.filter((marker) => marker.type === activeDrawer);

        // Add filtered markers to the map
        filteredMarkers.forEach((mapMarker) => {
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
                            className: 'yellow-popup',
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
                                className: 'yellow-popup',
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

    // Function to handle zoom in
    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomIn();
        }
    };

    // Function to handle zoom out
    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomOut();
        }
    };

    // Function to reset the map view to initial state
    const resetMapView = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: initialCenter,
                zoom: initialZoom,
                bearing: initialBearing,
                duration: 1000, // Animation duration in milliseconds
            });
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
        const center = initialCenter;
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
            // Add CSS to prevent mapbox canvas from causing scrollbars
            const mapboxCanvasStyle = document.createElement('style');
            mapboxCanvasStyle.textContent = `
                .mapboxgl-canvas-container {
                    overflow: hidden !important;
                }
                .mapboxgl-canvas {
                    overflow: hidden !important;
                }
                .yellow-popup .mapboxgl-popup-content {
                    background-color: yellow !important;
                }
            `;
            document.head.appendChild(mapboxCanvasStyle);

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
                center: initialCenter,
                zoom: initialZoom,
                bearing: initialBearing,
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
                // mapRef.current?.on('click', (e) => {
                //     // Remove existing popup if it exists
                //     if (clickPopupRef.current) {
                //         clickPopupRef.current.remove();
                //     }

                //     // Store clicked coordinates
                //     const coords: [number, number] = [
                //         e.lngLat.lng,
                //         e.lngLat.lat,
                //     ];
                //     setClickedCoordinates(coords);

                //     // Format coordinates with 6 decimal places
                //     const lng = coords[0].toFixed(6);
                //     const lat = coords[1].toFixed(6);

                //     // Create popup with coordinates in the requested format
                //     if (mapRef.current) {
                //         clickPopupRef.current = new mapboxgl.Popup({
                //             closeButton: true,
                //             closeOnClick: false,
                //         })
                //             .setLngLat(coords)
                //             .setHTML(
                //                 `
                //                 <div style="font-family: sans-serif; text-align: center;">
                //                     <h3 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">Coordinates</h3>
                //                     <h3 style="margin: 0 0 5px 0; font-size: 12px;">This is for testing purposes only</h3>
                //                     <p style="margin: 0 0 5px 0; font-size: 13px; font-family: monospace;">[${lng}, ${lat}]</p>
                //                     <button
                //                         id="copy-coords-btn"
                //                         style="background-color: #8A1438; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; margin-top: 2px;"
                //                         onclick="navigator.clipboard.writeText('[${lng}, ${lat}]').then(() => {
                //                             const btn = document.getElementById('copy-coords-btn');
                //                             btn.textContent = 'Copied!';
                //                             setTimeout(() => { btn.textContent = 'Copy' }, 2000);
                //                         })"
                //                     >Copy</button>
                //                 </div>
                //             `,
                //             )
                //             .addTo(mapRef.current);
                //     }
                // });

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

    // Effect to reload markers when activeDrawer changes
    useEffect(() => {
        if (mapLoaded) {
            // If we have a selected marker, check if it should still be visible
            if (selectedMarkId !== null) {
                const selectedMarker = mapMarkers.find(
                    (marker) => marker.id === selectedMarkId,
                );
                // If selected marker exists but doesn't match active drawer type, deselect it
                if (
                    selectedMarker &&
                    activeDrawer !== null &&
                    selectedMarker.type !== activeDrawer
                ) {
                    setSelectedMarkId(null);
                }
            }

            addMarkersToMap();

            // Re-apply selection styling after markers are reloaded
            if (selectedMarkId !== null) {
                // Short delay to ensure markers are rendered
                setTimeout(() => {
                    const selectedMarker = markersRef.current[selectedMarkId];
                    if (selectedMarker) {
                        const element = selectedMarker.getElement();
                        const markerContent = element.querySelector('div');

                        element.style.zIndex = '2';
                        if (markerContent) {
                            markerContent.style.backgroundColor = '#8A1438'; // maroon-accent
                            markerContent.style.transform = 'scale(1.1)';
                            markerContent.style.color = 'white';
                            markerContent.style.border = '2px solid white';
                        }
                    }
                }, 10);
            }
        }
    }, [activeDrawer, mapLoaded, selectedMarkId, setSelectedMarkId]);

    // Effect to zoom to selected marker when selectedMarkId changes
    useEffect(() => {
        if (mapLoaded && selectedMarkId && mapRef.current) {
            // Find the selected marker in mapMarkers
            const selectedMarker = mapMarkers.find(
                (marker) => marker.id === selectedMarkId,
            );

            // If marker exists, zoom to its coordinates
            if (selectedMarker) {
                const newCoordinates = [
                    selectedMarker.coordinates[0] - 0.0002,
                    selectedMarker.coordinates[1],
                ];
                mapRef.current.flyTo({
                    center: newCoordinates as [number, number],
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
                overflow: 'hidden',
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
                    overflow: 'hidden',
                }}
                className="w-full h-full"
            ></div>
            <div
                ref={svgOverlayRef}
                style={{
                    position: 'absolute',
                    pointerEvents: 'none', // Allow interactions with the map below
                    overflow: 'hidden',
                }}
                className="w-full h-full"
            />

            {/* Map Controls */}
            <MapControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={resetMapView}
                onLocate={locateUser}
            />


            {/* Building Details Sidebar */}
            <BuildingDetailsSidebar />
        </div>
    );
};

export default MapboxExample;
