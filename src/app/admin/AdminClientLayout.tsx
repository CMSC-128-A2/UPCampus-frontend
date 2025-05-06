'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminClientLayoutProps {
  children: React.ReactNode;
}

export default function AdminClientLayout({ children }: AdminClientLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="admin-layout">
        {children}
      </div>
    </ProtectedRoute>
  );
} 