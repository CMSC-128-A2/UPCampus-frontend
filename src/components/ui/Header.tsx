import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white border-b w-full">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center">
          <div className="text-[#8BC34A] text-2xl font-semibold">
            <span className="text-[#8BC34A]">UP</span>
            <span className="text-[#8BC34A] ml-1">Manager</span>
          </div>
        </Link>
      </div>
      <Link href="/admin" className="text-[#FF5252] border border-[#FF5252] px-5 py-2 rounded-lg flex items-center hover:bg-[#FFF5F5] transition-colors duration-200">
        <Icon icon="ph:user-gear" className="mr-2" width="20" height="20" />
        Admin
      </Link>
    </div>
  );
};

export default Header; 