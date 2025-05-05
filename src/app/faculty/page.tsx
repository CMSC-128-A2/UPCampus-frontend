'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/ui/Layout';

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
    <Layout>
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
    </Layout>
  );
}

export default FacultyPage;
