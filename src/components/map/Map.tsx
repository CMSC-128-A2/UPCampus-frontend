'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxExample = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

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

        // Define boundaries approximately 2km from the center point
        // At this latitude, 0.018 degrees ≈ 2km in both directions
        const center = [123.898731, 10.322466];
        const bounds = new mapboxgl.LngLatBounds(
            [center[0] - 0.0018, center[1] - 0.0018], // Southwest: 2km west and south from center
            [center[0] + 0.0018, center[1] + 0.0018], // Northeast: 2km east and north from center
        );

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [123.898731, 10.322466],
            zoom: 17,
            bearing: 80,
            maxBounds: bounds, // Set the map's boundary limits
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl());

        return () => {
            mapRef.current?.remove();
        };
    }, []);

    return <div ref={mapContainerRef} style={{ height: '100%' }}></div>;
};

export default MapboxExample;
