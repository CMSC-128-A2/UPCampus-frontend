import { Icon } from '@iconify/react';
import Link from 'next/link';

interface DetailsModalProps {
    isOpen: boolean;
    objectId: string | null;
    type: 'building' | 'object';
    onClose: () => void;
}

function DetailsModal({ isOpen, objectId, onClose }: DetailsModalProps) {
    if (!objectId || !isOpen) return null;

    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[2000]" onClick={handleClickOutside}>
            <div className="absolute right-0 top-[70px] rounded-lg h-full max-h-[calc(100vh-80px)] max-w-[400px] min-w-[300px] w-full bg-white shadow-lg animate-slide-left flex flex-col">
                <button
                    onClick={onClose}
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
                                <div className="text-gray-600">Total Area:</div>
                                <div>3,500 sq. meters</div>
                                <div className="text-gray-600">Completion:</div>
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
                            The New Science Building houses state-of-the-art
                            facilities for research and education in the fields
                            of biology, chemistry, and physics.
                        </p>
                    </div>
                </div>
                <div className="actions p-4 w-full flex">
                    <Link
                        href={`/map/${objectId}`}
                        className="bg-green-accent text-white p-2 rounded-lg flex-grow flex justify-center items-center"
                    >
                        View Building
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DetailsModal;
