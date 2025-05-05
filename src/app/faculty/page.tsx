'use client';
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/ui/Layout';
import { facultyApi, Faculty } from '@/lib/api';

function FacultyPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch faculty data on component mount
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setIsLoading(true);
        const data = await facultyApi.getAllFaculty();
        setFacultyData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch faculty members:', err);
        setError('Failed to load faculty members. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  // Get all unique departments
  const departments = ['All', ...new Set(facultyData.map(prof => prof.department_name))];

  // Filter faculty based on search query and department filter
  const filteredFaculty = facultyData.filter(professor => {
    const matchesSearch = searchQuery === '' || 
      professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professor.department_name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDepartment = selectedDepartment === 'All' || professor.department_name === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleFacultyClick = (professorId: string) => {
    // Navigate to the classes schedule page for this faculty
    router.push(`/faculty/${professorId}/schedule`);
  };

  // Render loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A]"></div>
        </div>
      </Layout>
    );
  }

  // Render error state
  if (error) {
    return (
      <Layout>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#8BC34A] text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

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
            <select
              className="flex items-center space-x-2 px-4 py-2 bg-[#F2F9EC] border border-[#8BC34A] rounded-lg text-[#8BC34A]"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
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
          {filteredFaculty.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No faculty members found. {searchQuery ? 'Try a different search.' : ''}</p>
            </div>
          ) : (
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
                    <td className="px-4 py-3 text-sm text-gray-700">{professor.department_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default FacultyPage;
