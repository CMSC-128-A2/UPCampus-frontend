'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';

const Header: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const user = adminApi.checkAuthenticated();
    setIsAuthenticated(!!user);
  }, []);
  
  const handleLogout = () => {
    adminApi.logout();
    setIsAuthenticated(false);
    router.push('/map');
  };
  
  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white border-b w-full">
      <div className="flex items-center gap-2">
        <Link href="/map" className="flex items-center">
          <div className="text-[#8BC34A] text-2xl font-semibold">
            <span className="text-[#8BC34A]">UP</span>
            <span className="text-[#8BC34A] ml-1">Manager</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {!isAuthenticated && (
          <Link 
            href="/signin" 
            className="text-[#008CFF] border border-[#008CFF] px-5 py-2 rounded-lg flex items-center hover:bg-[#F0F8FF] transition-colors duration-200"
          >
            <Icon icon="material-symbols:login" className="mr-2" width="20" height="20" />
            Sign In
          </Link>
        )}
        
        {isAuthenticated && (
          <>
            <Link 
              href="/admin" 
              className="text-[#FF5252] border border-[#FF5252] px-5 py-2 rounded-lg flex items-center hover:bg-[#FFF5F5] transition-colors duration-200"
            >
              <Icon icon="ph:user-gear" className="mr-2" width="20" height="20" />
              Admin
            </Link>
            <Link 
              href="/faculty" 
              className="text-[#4CAF50] border border-[#4CAF50] px-5 py-2 rounded-lg flex items-center hover:bg-[#F1F8E9] transition-colors duration-200"
            >
              <Icon icon="mdi:teacher" className="mr-2" width="20" height="20" />
              Faculty
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-700 border border-gray-300 px-5 py-2 rounded-lg flex items-center hover:bg-gray-100 transition-colors duration-200"
            >
              <Icon icon="material-symbols:logout" className="mr-2" width="20" height="20" />
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header; 