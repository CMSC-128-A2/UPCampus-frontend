import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { facultyApi, Department } from '@/lib/api';

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faculty: { name: string; department: string }) => void;
}

const FacultyModal: React.FC<FacultyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/schedules/departments/`);
        if (response.ok) {
          const data = await response.json();
          // Handle paginated response - extract results array
          const departmentsArray = Array.isArray(data) 
            ? data 
            : (data.results && Array.isArray(data.results) ? data.results : []);
          
          setDepartments(departmentsArray);
          if (departmentsArray.length > 0) {
            setDepartmentId(departmentsArray[0].id); // Set default department
          }
        } else {
          setError('Failed to fetch departments');
          setDepartments([]);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        setError('Failed to fetch departments. Please try again.');
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !departmentId) {
      alert('Please fill in all fields');
      return;
    }

    onSave({
      name,
      department: departmentId
    });
    
    // Reset form
    setName('');
    setDepartmentId(departments.length > 0 ? departments[0].id : '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">New Faculty</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon icon="ph:x" width="20" height="20" />
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC34A]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#8BC34A] text-white px-4 py-2 rounded-lg mt-2"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter faculty name"
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  {departments.length > 0 ? (
                    <select
                      className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-500">No departments available</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8BC34A] text-white rounded-md hover:bg-[#7cb342]"
                  disabled={departments.length === 0}
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyModal; 