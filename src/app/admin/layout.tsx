import React from 'react';
import type { Metadata, Viewport } from 'next';

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
    <div className="admin-layout">
      {children}
    </div>
  );
} 