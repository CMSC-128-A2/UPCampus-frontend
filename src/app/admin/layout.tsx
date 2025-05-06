// Metadata and viewport exports (server component)
import type { Metadata, Viewport } from 'next';
import AdminClientLayout from './AdminClientLayout';

export const metadata: Metadata = {
  title: 'Admin Dashboard - UPCampus',
  description: 'Manage admin users in the UPCampus system',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
} 