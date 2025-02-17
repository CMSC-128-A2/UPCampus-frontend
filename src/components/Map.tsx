'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Icon } from '@iconify/react';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: '/assets/images/guy.png',
    iconSize: [45, 45],
});

function Map() {
    const mockUserLocation: [number, number] = [10.322176, 123.898442];
    const objectLocation: [number, number] = [10.3222097, 123.8981918];

    const [userLocation, setUserLocation] = useState<[number, number] | null>(
        null,
    );
    const [map, setMap] = useState<L.Map | null>(null);

    const [objectId, setObjectId] = useState<string | null>(null);

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
                wheelPxPerZoomLevel={100}
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

            {/* Add modal */}
            {objectId && isModalOpen && (
                <div
                    className="fixed inset-0 z-[2000]"
                    onClick={handleClickOutside}
                >
                    <div className="absolute right-0 top-[70px] rounded-lg h-full max-h-[calc(100vh-80px)] max-w-[400px] min-w-[300px] w-full bg-white shadow-lg animate-slide-left flex flex-col">
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setObjectId(null);
                            }}
                            className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <Icon icon="mdi:close" width="24" height="24" />
                        </button>
                        <div className="p-4 flex-grow overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4">
                                New Science Building
                            </h2>

                            <div className="overflow-x-auto mb-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <img
                                            key={index}
                                            src="/assets/images/random-building.jpg"
                                            alt={`Building image ${index + 1}`}
                                            className="w-[200px] h-[150px] object-cover rounded-lg flex-shrink-0"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Building Details
                                    </h3>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-gray-600">
                                            Floor Count:
                                        </div>
                                        <div>5 floors</div>
                                        <div className="text-gray-600">
                                            Total Area:
                                        </div>
                                        <div>3,500 sq. meters</div>
                                        <div className="text-gray-600">
                                            Completion:
                                        </div>
                                        <div>2022</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Facilities
                                    </h3>
                                    <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                                        <li>Research Laboratories</li>
                                        <li>Lecture Halls</li>
                                        <li>Computer Labs</li>
                                        <li>Faculty Offices</li>
                                    </ul>
                                </div>

                                <p className="text-sm text-gray-600">
                                    The New Science Building houses
                                    state-of-the-art facilities for research and
                                    education in the fields of biology,
                                    chemistry, and physics.
                                </p>
                            </div>
                        </div>
                        <div className="actions p-4 w-full flex">
                            <a
                                href="https://www.google.com"
                                className="bg-green-accent text-white p-2 rounded-lg flex-grow flex justify-center items-center"
                            >
                                View Building Bitch
                            </a>
                        </div>
                    </div>
                </div>
            )}

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
