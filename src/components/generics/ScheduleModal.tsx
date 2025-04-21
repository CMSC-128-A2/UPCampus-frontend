import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { Save } from 'lucide-react';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (scheduleData: {
        courseCode: string;
        section: string;
        type: string;
        room: string;
        day: string;
        time: string;
    }) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    if (!isOpen) return null;

    // State for form inputs with empty initial values
    const [formData, setFormData] = useState({
        class: '',
        section: '',
        type: '',
        room: '',
        day: '',
        time: '',
    });

    // Function to handle input changes
    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // Function to determine background color
    const getInputStyle = (value: string) => {
        return value ? 'bg-gray-100' : 'bg-white';
    };

    // Function to handle save
    const handleSave = () => {
        if (onSave) {
            onSave({
                courseCode: formData.class,
                section: formData.section,
                type: formData.type,
                room: formData.room,
                day: formData.day,
                time: formData.time,
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl relative">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-3xl">New Schedule</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <Icon icon="ph:x" width="24" height="24" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-4">
                    {/* Form Fields */}
                    <div className="py-2">
                        {/* Class Input */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Class</label>
                            <input
                                type="text"
                                className={`p-2 rounded-lg text-right ${getInputStyle(
                                    formData.class,
                                )}`}
                                value={formData.class}
                                onChange={(e) =>
                                    handleChange('class', e.target.value)
                                }
                                placeholder="CMSC 126"
                            />
                        </div>

                        {/* Section Input */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Section</label>
                            <input
                                type="text"
                                className={`p-2 rounded-lg text-right ${getInputStyle(
                                    formData.section,
                                )}`}
                                value={formData.section}
                                onChange={(e) =>
                                    handleChange('section', e.target.value)
                                }
                                placeholder="A"
                            />
                        </div>

                        {/* Type Input */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Type</label>
                            <input
                                type="text"
                                className={`p-2 rounded-lg text-right ${getInputStyle(
                                    formData.type,
                                )}`}
                                value={formData.type}
                                onChange={(e) =>
                                    handleChange('type', e.target.value)
                                }
                                placeholder="Lecture"
                            />
                        </div>

                        {/* Room Assigned Input */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Room Assigned</label>
                            <input
                                type="text"
                                className={`p-2 rounded-lg text-right ${getInputStyle(
                                    formData.room,
                                )}`}
                                value={formData.room}
                                onChange={(e) =>
                                    handleChange('room', e.target.value)
                                }
                                placeholder="SCI 405"
                            />
                        </div>

                        {/* Day Input */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Day</label>
                            <input
                                type="text"
                                className={`p-2 rounded-lg text-right ${getInputStyle(
                                    formData.day,
                                )}`}
                                value={formData.day}
                                onChange={(e) =>
                                    handleChange('day', e.target.value)
                                }
                                placeholder="M TH"
                            />
                        </div>

                        {/* Time Input */}
                        <div className="flex justify-between items-center py-2 border-b">
                            <label className="text-lg">Time</label>
                            <input
                                type="text"
                                className={`p-2 rounded-lg text-right ${getInputStyle(
                                    formData.time,
                                )}`}
                                value={formData.time}
                                onChange={(e) =>
                                    handleChange('time', e.target.value)
                                }
                                placeholder="9:00 AM - 10:00 AM"
                            />
                        </div>
                    </div>

                    {/* Save Button - with significant top space */}
                    <div className="py-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="flex items-center px-5 py-2 bg-[#CCE8FF] text-[#4392F1] font-medium rounded-lg border-[1.5px] text-xl border-[#4392F1] hover:bg-[#b3dbff] hover:border-[#2b7ad9] transition-colors duration-200"
                        >
                            <Save size={24} className="mr-2 text-[#4392F1]" />
                            Save schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
