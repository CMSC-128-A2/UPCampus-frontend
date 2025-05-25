'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { usePathname, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated and get user data
    const user = adminApi.checkAuthenticated();
    setCurrentUser(user);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleSignOut = () => {
    adminApi.logout();
    setCurrentUser(null);
    router.push('/signin');
  };

  return (
    <div className="w-60 bg-white border-r overflow-y-auto flex flex-col">
      <nav className="flex-1">
        <ul className="space-y-1 mt-6">
          <li>
            <Link 
              href="/faculty" 
              className={`flex items-center px-6 py-3 text-gray-700 ${isActive('/faculty') ? 'bg-[#f2f9ec]' : 'hover:bg-gray-50'}`}
            >
              <Icon icon="ph:graduation-cap-bold" width="24" height="24" className="mr-3" />
              <span>Faculty</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/admin" 
              className={`flex items-center px-6 py-3 text-gray-700 ${isActive('/admin') ? 'bg-[#f2f9ec]' : 'hover:bg-gray-50'}`}
            >
              <Icon icon="ph:users-three-bold" width="24" height="24" className="mr-3" />
              <span>Admins</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/map" 
              className={`flex items-center px-6 py-3 text-gray-700 ${isActive('/map') ? 'bg-[#f2f9ec]' : 'hover:bg-gray-50'}`}
            >
              <Icon icon="ph:map-trifold-bold" width="24" height="24" className="mr-3" />
              <span>Campus Map</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto border-t border-gray-200">
        {/* Welcome Message */}
        {currentUser && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Welcome, {currentUser.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <div className="p-6">
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full text-gray-700 hover:text-red-600 transition-colors duration-200"
          >
            <Icon icon="ph:sign-out-bold" width="24" height="24" className="mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 