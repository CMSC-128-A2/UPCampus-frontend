import type { Metadata } from 'next';
import FacultyClientLayout from './FacultyClientLayout';

export const metadata: Metadata = {
  title: 'Faculty Dashboard - UPCampus',
  description: 'Manage faculty members in the UPCampus system',
};

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FacultyClientLayout>
      {children}
    </FacultyClientLayout>
  );
} 