import { ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface TimePickerProviderProps {
  children: ReactNode;
}

export function TimePickerProvider({ children }: TimePickerProviderProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  );
} 