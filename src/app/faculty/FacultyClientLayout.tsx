'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface FacultyClientLayoutProps {
  children: React.ReactNode;
}

export default function FacultyClientLayout({ children }: FacultyClientLayoutProps) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
} 