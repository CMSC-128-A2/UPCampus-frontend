import { useState, forwardRef, useEffect } from 'react';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// Custom styled container for the time picker
const TimePickerContainer = styled(Box)(({ theme }) => ({
  '.MuiStaticTimePicker-root': {
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    backgroundColor: 'white',
    width: '100%',
  },
  '.MuiStaticTimePicker-content': {
    backgroundColor: 'white',
    padding: '1rem',
  },
  '.MuiPickersToolbar-root': {
    backgroundColor: '#f3f4f6',
    padding: '0.75rem 1rem',
    color: '#1f2937',
  },
  '.MuiTimePickerToolbar-hourMinuteLabel': {
    color: '#1f2937',
  },
  '.MuiTimePickerToolbar-ampmLabel': {
    color: '#4b5563',
  },
  '.MuiPickersToolbar-penIconButton': {
    color: '#4b5563',
  },
  '.MuiDigitalClock-root': {
    padding: '0.5rem',
  },
  '.MuiDigitalClock-item': {
    fontSize: '1rem',
    padding: '0.5rem',
    margin: '0.25rem',
    borderRadius: '0.375rem',
    '&.Mui-selected': {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#e5e7eb',
    },
  },
  '.MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected)': {
    borderRadius: '50%',
  },
  '.MuiDialogActions-root': {
    padding: '0.75rem 1rem',
    borderTop: '1px solid #e5e7eb',
  },
}));

export type TimeValue = string | null;

interface MUITimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  className?: string;
  required?: boolean;
  label?: string;
}

// Helper function to parse time string to Dayjs object
const parseTime = (timeStr: TimeValue): Dayjs | null => {
  if (!timeStr) return null;
  return dayjs(`2023-01-01 ${timeStr}`);
};

// Helper function to format Dayjs to time string
const formatTime = (time: Dayjs | null): TimeValue => {
  if (!time) return null;
  return time.format('HH:mm');
};

export const MUITimePicker = forwardRef<HTMLDivElement, MUITimePickerProps>(
  ({ value, onChange, className = '', label = 'Select time' }, ref) => {
    // Convert string time value to Dayjs
    const [timeValue, setTimeValue] = useState<Dayjs | null>(parseTime(value));

    // Update the timeValue when the value prop changes
    useEffect(() => {
      setTimeValue(parseTime(value));
    }, [value]);

    // Handle time change
    const handleTimeChange = (newValue: Dayjs | null) => {
      setTimeValue(newValue);
      onChange(formatTime(newValue));
    };

    return (
      <TimePickerContainer ref={ref} className={className}>
        <StaticTimePicker
          value={timeValue}
          onChange={handleTimeChange}
          orientation="portrait" 
          ampm={true}
          minutesStep={5}
          className={className}
          sx={{
            width: '100%',
            '.MuiDigitalClock-item[data-value="00"]': {
              letterSpacing: '0.05em',
              fontFeatureSettings: '"tnum"',
            },
          }}
        />
      </TimePickerContainer>
    );
  }
);

MUITimePicker.displayName = 'MUITimePicker';

export default MUITimePicker; 