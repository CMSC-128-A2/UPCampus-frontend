'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Icon } from '@iconify/react';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: '/assets/icons/location.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function Map() {
    const mockUserLocation: [number, number] = [10.322176, 123.898442];

    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null,
    );
    const [map, setMap] = useState<L.Map | null>(null);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation: [number, number] = [
                        position.coords.latitude,
                        position.coords.longitude,
                    ];
                    setUserLocation(newLocation);
                    map?.flyTo(newLocation, 18);
                },
                (error) => {
                    console.log('Error getting location:', error);
                    alert(
                        'Please enable location services to use this feature.',
                    );
                    setUserLocation(null);
                },
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            setUserLocation(null);
        }
    };

    useEffect(() => {
        // getUserLocation();
        setUserLocation(mockUserLocation);
    }, []);

    return (
        <main className="h-[calc(100vh-62px)] w-full relative">
            <MapContainer
                center={[10.322568, 123.898714]}
                zoom={25}
                style={{ height: '100%', width: '100%' }}
                ref={setMap}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {userLocation && (
                    <Marker position={userLocation} icon={icon}>
                        <Popup>You are here!</Popup>
                    </Marker>
                )}
            </MapContainer>
            <button
                onClick={getUserLocation}
                className="text-white absolute bottom-4 right-4 bg-green-accent p-2 rounded-full shadow-md hover:bg-green-accent/80 z-[1000]"
            >
                <Icon icon="mdi:map-marker" width="24" height="24" />
            </button>
        </main>
    );
}

export default Map;
