'use client';
import { ReactNode, useEffect, useState } from 'react';

interface RootExtensionWrapperProps {
  children: ReactNode;
}

/**
 * This component handles browser extensions like Grammarly that add attributes to the DOM
 * By mounting children only on the client side, we avoid hydration mismatches
 */
export default function RootExtensionWrapper({ children }: RootExtensionWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During server-side rendering and initial client-side rendering, return a placeholder
  // This avoids hydration mismatches from browser extensions
  if (!isMounted) {
    return <div className="flex flex-col h-screen" suppressHydrationWarning={true} />;
  }

  // Once mounted on the client, return the actual children
  return (
    <div className="flex flex-col h-screen" suppressHydrationWarning={true}>
      {children}
    </div>
  );
} 