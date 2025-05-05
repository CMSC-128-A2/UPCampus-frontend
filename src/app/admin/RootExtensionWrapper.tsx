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
    // Set mounted state to true when component mounts on client
    setIsMounted(true);
    
    // Remove any browser extension attributes from the document that might cause hydration errors
    const removeExtensionAttributes = () => {
      // Try to remove Grammarly attributes specifically
      if (document && document.body) {
        document.body.removeAttribute('data-new-gr-c-s-check-loaded');
        document.body.removeAttribute('data-gr-ext-installed');
      }
    };
    
    // Run cleanup immediately and set a periodic check
    removeExtensionAttributes();
    const interval = setInterval(removeExtensionAttributes, 1000);
    
    return () => clearInterval(interval);
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