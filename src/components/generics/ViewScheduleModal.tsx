import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface ViewScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseCode: string;
    section: string;
    type: string;
    room: string;
    schedule: string;
    onDelete?: () => void;
}

const ViewScheduleModal: React.FC<ViewScheduleModalProps> = ({
    isOpen,
    onClose,
    courseCode,
    section,
    type,
    room,
    schedule,
    onDelete
}) => {
    if (!isOpen) return null;

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Parse schedule string to separate day and time
    const { day, time } = useMemo(() => {
        // Format is typically "M TH | 11:00 AM - 12:00 PM"
        const parts = schedule.split('|');
        const day = parts[0]?.trim() || '';
        const time = parts[1]?.trim() || schedule; // If no separator, use full string
        return { day, time };
    }, [schedule]);

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        // In a real application, this would make an API call to delete the schedule
        if (onDelete) {
            onDelete();
        } else {
            alert(`Schedule for ${courseCode} section ${section} has been deleted`);
            onClose();
        }
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleViewInMap = () => {
        // In a real application, this would navigate to the map view and highlight the room
        alert(`Viewing ${room} on map`);
        // Keep the modal open for now, but in a real app you might navigate away
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl relative">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-3xl">Schedule Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <Icon icon="ph:x" width="24" height="24" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-4">
                    {/* Details Fields */}
                    <div className="py-2">
                        {/* Class */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Class</label>
                            <div className="p-2 rounded-lg bg-gray-100 text-right">{courseCode}</div>
                        </div>

                        {/* Section */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Section</label>
                            <div className="p-2 rounded-lg bg-gray-100 text-right">{section}</div>
                        </div>

                        {/* Type */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Type</label>
                            <div className="p-2 rounded-lg bg-gray-100 text-right">{type}</div>
                        </div>

                        {/* Room Assigned */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Room Assigned</label>
                            <div className="p-2 rounded-lg bg-gray-100 text-right">{room}</div>
                        </div>

                        {/* Day */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Day</label>
                            <div className="p-2 rounded-lg bg-gray-100 text-right">{day}</div>
                        </div>

                        {/* Time */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Time</label>
                            <div className="p-2 rounded-lg bg-gray-100 text-right">{time}</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="py-4 flex justify-between gap-4">
                        <button
                            onClick={handleDelete}
                            className="flex items-center px-5 py-2 bg-[#F4DEDE] text-[#EF8281] font-medium rounded-lg border-[1.5px] text-xl border-[#EF8281] hover:bg-[#ffd1d1] hover:border-[#ff6b6b] transition-colors duration-200"
                        >
                            <Icon icon="ph:trash-bold" width="24" height="24" className="mr-2" />
                            Delete
                        </button>
                        <button
                            onClick={handleViewInMap}
                            className="flex items-center px-5 py-2 bg-[#CCE8FF] text-[#4392F1] font-medium rounded-lg border-[1.5px] text-xl border-[#4392F1] hover:bg-[#b3dbff] hover:border-[#2b7ad9] transition-colors duration-200"
                        >
                            <Icon icon="ph:map-pin-bold" width="24" height="24" className="mr-2" />
                            View in map
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">
                            Are you sure you want to delete this schedule for {courseCode} section {section}?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-[#FFD7D7] text-[#F14343] border border-[#F14343] rounded-lg hover:bg-[#ffbdbd]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewScheduleModal; 