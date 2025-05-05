'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import RootExtensionWrapper from './RootExtensionWrapper';
import AdminModal from '@/components/ui/AdminModal';

// Define admin user type
interface AdminUser {
  name: string;
  email: string;
  userId: string;
  password: string;
}

// Mock admin data based exactly on the image
const mockAdmins: AdminUser[] = [
  {
    name: 'Jennie Kim',
    email: 'jennierubyjanet@gmail.com',
    userId: 'jen123',
    password: 'rubyjane1@'
  },
  {
    name: 'Lalisa Manoban',
    email: 'lalalisa@gmail.com',
    userId: 'lalisa0327',
    password: 'lalaLisa2703'
  },
  {
    name: 'Rose Park',
    email: 'rosie@gmail.com',
    userId: 'aptrose1@',
    password: 'apateupateuRSP'
  },
  {
    name: 'Jisoo Kim',
    email: 'sooya@gmail.com',
    userId: 'sooya143',
    password: 'hellojisoopp4'
  }
];

function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter admin users based on search query
  const filteredAdmins = searchQuery.trim() === ''
    ? adminUsers
    : adminUsers.filter(admin => {
        const query = searchQuery.toLowerCase();
        return (
          admin.name.toLowerCase().includes(query) ||
          admin.email.toLowerCase().includes(query) ||
          admin.userId.toLowerCase().includes(query)
        );
      });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAdmin = (admin: AdminUser) => {
    setAdminUsers([...adminUsers, admin]);
    closeModal();
  };

  return (
    <RootExtensionWrapper>
      <div className="flex flex-col h-screen">
        {/* Main Content Area - Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-60 bg-white border-r overflow-y-auto flex flex-col">
            <div className="p-6">
              <Link href="/" className="flex items-center">
                <div className="text-[#8BC34A] text-2xl font-semibold">
                  <span className="text-[#8BC34A]">UP</span>
                  <span className="text-[#8BC34A] ml-1">Manager</span>
                </div>
              </Link>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-1">
                <li>
                  <Link href="/faculty" className="flex items-center px-6 py-3 text-gray-700">
                    <Icon icon="ph:graduation-cap-bold" width="24" height="24" className="mr-3" />
                    <span>Faculty</span>
                  </Link>
                </li>
                <li className="bg-[#f2f9ec]">
                  <Link href="/admin" className="flex items-center px-6 py-3 text-gray-700">
                    <Icon icon="ph:users-three-bold" width="24" height="24" className="mr-3" />
                    <span>Admins</span>
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="flex items-center px-6 py-3 text-gray-700">
                    <Icon icon="ph:map-trifold-bold" width="24" height="24" className="mr-3" />
                    <span>Campus Map</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="mt-auto p-6">
              <Link href="/signin" className="flex items-center text-gray-700">
                <Icon icon="ph:sign-out-bold" width="24" height="24" className="mr-3" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Admin Title */}
              <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admins</h1>
              
              {/* Search and Add Admin */}
              <div className="mb-6">
                <div className="relative w-full mb-4">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Icon icon="ph:magnifying-glass" className="text-gray-400" width="20" height="20" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8BC34A]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={openModal}
                    className="bg-[#E6F4FF] text-[#1E88E5] border border-[#1E88E5] px-4 py-2 rounded-lg flex items-center"
                  >
                    <Icon icon="ph:plus" width="20" height="20" className="mr-2" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>
              
              {/* Admin Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Password</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdmins.map((admin, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{admin.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{admin.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{admin.userId}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{admin.password}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveAdmin}
      />
    </RootExtensionWrapper>
  );
}

export default AdminPage;
