import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface ViewScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseCode: string;
    section: string;
    type: 'Lecture' | 'Laboratory';
    room: string;
    schedule: string;
    facultyName?: string;
    facultyEmail?: string;
    onDelete?: () => void;
    onEdit?: () => void;
}

const ViewScheduleModal: React.FC<ViewScheduleModalProps> = ({
    isOpen,
    onClose,
    courseCode,
    section,
    type,
    room,
    schedule,
    facultyName,
    facultyEmail,
    onDelete,
    onEdit
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Parse schedule string to separate day and time - moved before conditional return
    const { day, time } = useMemo(() => {
        // Format is typically "M TH | 11:00 AM - 12:00 PM"
        const parts = schedule.split('|');
        const day = parts[0]?.trim() || '';
        const time = parts[1]?.trim() || schedule; // If no separator, use full string
        return { day, time };
    }, [schedule]);

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        
        // Show delete confirmation dialog
        setShowDeleteConfirm(true);
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit();
        }
    };

    const confirmDelete = async () => {
        if (!onDelete) return;
        
        try {
            setIsDeleting(true);
            await onDelete();
            // The actual cleanup and toast is handled in the parent component
        } catch (error) {
            console.error('Error during deletion:', error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleViewOnMap = () => {
        // Placeholder for future map viewing functionality
        alert(`View ${room} on map functionality coming soon!`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Schedule Details</h2>
                        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                            <Icon icon="ph:x-bold" width="24" height="24" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="bg-[#CCE8FF] py-3 px-4 text-3xl rounded-lg mb-4">
                            {courseCode}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="text-gray-600 font-medium">Section</span>
                                <span className="text-gray-900">{section}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="text-gray-600 font-medium">Type</span>
                                <span className="text-gray-900">{type}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="text-gray-600 font-medium">Room</span>
                                <div className="flex items-center">
                                    <span className="text-gray-900">{room}</span>
                                    <button 
                                        onClick={handleViewOnMap}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                        <Icon icon="ph:map-pin-bold" width="20" height="20" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="text-gray-600 font-medium">Schedule</span>
                                <span className="text-gray-900">{schedule}</span>
                            </div>
                            {facultyName && (
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-gray-600 font-medium">Professor</span>
                                    <div className="text-right">
                                        <div className="text-gray-900">{facultyName}</div>
                                        {facultyEmail && (
                                            <div className="text-gray-500 text-sm">{facultyEmail}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="py-4 flex justify-between gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center px-5 py-2 bg-[#F4DEDE] text-[#EF8281] font-medium rounded-lg border-[1.5px] text-xl border-[#EF8281] hover:bg-[#ffd1d1] hover:border-[#ff6b6b] transition-colors duration-200"
                            >
                                {isDeleting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Icon icon="ph:trash-bold" width="24" height="24" className="mr-2" />
                                        Delete
                                    </>
                                )}
                            </button>
                            {onEdit && (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center px-5 py-2 bg-[#E9F2E1] text-[#93BF6A] font-medium rounded-lg border-[1.5px] text-xl border-[#93BF6A] hover:bg-[#dbe9ce] hover:border-[#7da054] transition-colors duration-200"
                                >
                                    <Icon icon="ph:pencil-bold" width="24" height="24" className="mr-2" />
                                    Edit
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-6 pt-5">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-3xl text-[#EF8281]">Delete schedule?</h3>
                                <button 
                                    onClick={cancelDelete} 
                                    className="text-gray-400 hover:text-gray-600"
                                    disabled={isDeleting}
                                >
                                    <Icon icon="ph:x" width="24" height="24" />
                                </button>
                            </div>
                            <p className="mb-10 text-lg">
                                Are you sure you want to delete this class schedule assigned to you? This schedule cannot be restored after deleting.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelDelete}
                                    disabled={isDeleting}
                                    className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex items-center px-5 py-2 bg-[#F4DEDE] text-[#EF8281] text-lg rounded-xl border border-[#EF8281] hover:bg-[#ffd1d1] transition-colors duration-200 disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#EF8281] mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="ph:trash-bold" width="20" height="20" className="mr-2" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewScheduleModal; 