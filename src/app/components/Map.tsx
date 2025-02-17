'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Icon } from '@iconify/react';
import DetailsModal from './DetailsModal';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: '/assets/images/guy.png',
    iconSize: [45, 45],
});

function Map() {
    const mockUserLocation: [number, number] = [10.322176, 123.898442];
    const objectLocation: [number, number] = [10.3222097, 123.8981918];

    // Define map boundaries (approximately 500m around the center point)
    const bounds: L.LatLngBoundsLiteral = [
        [10.319568, 123.895714], // Southwest corner
        [10.325568, 123.901714], // Northeast corner
    ];

    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null,
    );
    const [map, setMap] = useState<L.Map | null>(null);

    const [objectId, setObjectId] = useState<string | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    // Add new state for modal
    const [isModalOpen, setIsModalOpen] = useState(true);

    // Add handler to close modal when clicking outside
    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
            setObjectId(null);
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            setIsGettingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation: [number, number] = [
                        position.coords.latitude,
                        position.coords.longitude,
                    ];
                    setUserLocation(newLocation);
                    map?.flyTo(newLocation, 18);
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.log('Error getting location:', error);
                    alert(
                        'Please enable location services to use this feature.',
                    );
                    setUserLocation(null);
                    setIsGettingLocation(false);
                },
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            setUserLocation(null);
            setIsGettingLocation(false);
        }
    };

    useEffect(() => {
        // getUserLocation();
        setUserLocation(mockUserLocation);
    }, []);

    useEffect(() => {
        if (objectId) {
            console.log('Object ID:', objectId);
        }
    }, [objectId]);

    useEffect(() => {
        if (objectId) {
            setIsModalOpen(true);
        }
    }, [objectId]);

    return (
        <main className="h-[calc(100vh-62px)] w-full relative">
            <MapContainer
                center={[10.322568, 123.898714]}
                zoom={18}
                style={{ height: '100%', width: '100%' }}
                ref={setMap}
                zoomControl={false}
                maxZoom={22}
                minZoom={17}
                wheelPxPerZoomLevel={100}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    maxZoom={22}
                />
                {userLocation && (
                    <Marker position={userLocation} icon={icon}>
                        <Popup>You are here!</Popup>
                    </Marker>
                )}
                <Marker
                    position={objectLocation}
                    icon={L.divIcon({
                        html: `<svg width="20" height="20" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="#4CAF50" stroke="white" stroke-width="3"/>
                              </svg>`,
                        className: 'custom-div-icon',
                    })}
                    eventHandlers={{
                        click: () => setObjectId('1'),
                    }}
                ></Marker>
            </MapContainer>

            <DetailsModal
                isOpen={isModalOpen}
                objectId={objectId}
                onClose={() => {
                    setIsModalOpen(false);
                    setObjectId(null);
                }}
                type="building"
            />

            <button
                onClick={getUserLocation}
                disabled={isGettingLocation}
                className="text-white absolute bottom-4 right-4 bg-green-accent p-2 rounded-full shadow-md hover:bg-green-accent/80 z-[1000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Icon icon="mdi:map-marker" width="24" height="24" />
            </button>
        </main>
    );
}

export default Map;
