'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

// Define TypeScript types
type Department = 'Biology' | 'Computer Science' | 'Mathematics' | 'Statistics';

interface Professor {
  id: string;
  name: string;
  department: Department;
  avatar?: string;
}

function FacultyPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyData, setFacultyData] = useState<Professor[]>([
    { id: '1', name: 'Prof Name', department: 'Biology' },
    { id: '2', name: 'Alicaya, Erik', department: 'Computer Science' },
    { id: '3', name: 'Prof Name', department: 'Mathematics' },
    { id: '4', name: 'Dulaca, Ryan', department: 'Computer Science' },
    { id: '5', name: 'Prof Name', department: 'Biology' },
    { id: '6', name: 'Noel, Kyle', department: 'Computer Science' },
    { id: '7', name: 'Prof Name', department: 'Mathematics' },
    { id: '8', name: 'Prof Name', department: 'Statistics' },
    { id: '9', name: 'Roldan, Jace', department: 'Computer Science' },
    { id: '10', name: 'Prof Name', department: 'Biology' },
    { id: '11', name: 'Prof Name', department: 'Mathematics' },
    { id: '12', name: 'Tan, Darmae', department: 'Computer Science' },
    { id: '13', name: 'Prof Name', department: 'Biology' },
  ]);
  
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'All'>('All');

  // Filter faculty based on search query and department filter
  const filteredFaculty = facultyData.filter(professor => {
    const matchesSearch = searchQuery === '' || 
      professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDepartment = selectedDepartment === 'All' || professor.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleFacultyClick = (professorId: string) => {
    // Navigate to the classes schedule page for this faculty
    router.push(`/faculty/${professorId}/schedule`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            {/* Logo placeholder - replace with actual logo */}
            <div className="text-[#8BC34A] text-2xl font-semibold flex items-center">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 bg-white border-r overflow-y-auto flex flex-col">
          <nav className="flex-1">
            <ul className="space-y-1">
              <li className="bg-[#F2F9EC]">
                <Link href="/faculty" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#E9F2E1] transition-colors duration-200">
                  <Icon icon="ph:graduation-cap-bold" width="24" height="24" className="mr-3" />
                  <span>Faculty</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] transition-colors duration-200">
                  <Icon icon="ph:users-three-bold" width="24" height="24" className="mr-3" />
                  <span>Admins</span>
                </Link>
              </li>
              <li>
                <Link href="/map" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] transition-colors duration-200">
                  <Icon icon="ph:map-trifold-bold" width="24" height="24" className="mr-3" />
                  <span>Campus Map</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-auto border-t border-gray-200">
            <Link href="/signin" className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f0f0f0] hover:text-red-600 transition-colors duration-200">
              <Icon icon="ph:sign-out-bold" width="24" height="24" className="mr-3" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Search and filters */}
            <div className="flex justify-between mb-4">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="ph:magnifying-glass" className="text-gray-400" width="20" height="20" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8BC34A]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-[#F2F9EC] border border-[#8BC34A] rounded-lg"
                >
                  <Icon icon="ph:list" className="text-[#8BC34A]" width="20" height="20" />
                  <span className="text-[#8BC34A]">Department</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#E6F4FF] border border-[#1E88E5] rounded-lg">
                  <Icon icon="ph:plus" className="text-[#1E88E5]" width="20" height="20" />
                  <span className="text-[#1E88E5]">Teacher</span>
                </button>
              </div>
            </div>

            {/* Department title */}
            <div className="bg-[#E6F4FF] px-4 py-3 rounded-lg mb-4">
              <h2 className="text-xl font-semibold text-gray-800">College of Science</h2>
            </div>

            {/* Faculty table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFaculty.map((professor) => (
                    <tr 
                      key={professor.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleFacultyClick(professor.id)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 mr-3"></div>
                          <span>{professor.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{professor.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyPage;
