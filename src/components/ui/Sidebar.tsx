import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
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

      <div className="mt-auto p-6 border-t border-gray-200">
        <Link href="/signin" className="flex items-center text-gray-700 hover:text-red-600">
          <Icon icon="ph:sign-out-bold" width="24" height="24" className="mr-3" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 