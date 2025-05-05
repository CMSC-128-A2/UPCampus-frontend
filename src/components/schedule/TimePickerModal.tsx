import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { MUITimePicker, TimeValue } from './MUITimePicker';
import { TimePickerProvider } from './TimePickerProvider';
import dayjs from 'dayjs';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: TimeValue) => void;
  initialValue: TimeValue;
  title?: string;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialValue,
  title = 'Select Time'
}) => {
  const [selectedTime, setSelectedTime] = useState<TimeValue>(initialValue);
  const [formattedTime, setFormattedTime] = useState<string>('');

  // Format the time to display in 12-hour format with AM/PM
  useEffect(() => {
    if (selectedTime) {
      const timeObj = dayjs(`2023-01-01 ${selectedTime}`);
      setFormattedTime(timeObj.format('h:mm A'));
    } else {
      setFormattedTime('');
    }
  }, [selectedTime]);

  const handleSave = () => {
    onSelect(selectedTime);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTime(initialValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <TimePickerProvider>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <Icon icon="ph:x-bold" width="24" height="24" />
            </button>
          </div>

          {/* TimePicker */}
          <div className="p-4">
            <MUITimePicker 
              value={selectedTime} 
              onChange={setSelectedTime} 
              className="w-full" 
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div className="text-gray-700 font-medium">
              {formattedTime ? (
                <span className="text-blue-600">{formattedTime}</span>
              ) : (
                <span className="text-gray-400">No time selected</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedTime}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </TimePickerProvider>
  );
};

export default TimePickerModal; 