import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Department } from '@/lib/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: { 
    name: string; 
    email: string; 
    userId: string; 
    password: string;
    department?: string;
    is_superuser: boolean;
  }) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [isSuperuser, setIsSuperuser] = useState(false);
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
          const departmentsArray = Array.isArray(data) 
            ? data 
            : (data.results && Array.isArray(data.results) ? data.results : []);
          
          setDepartments(departmentsArray);
          if (departmentsArray.length > 0) {
            setDepartmentId(departmentsArray[0].id);
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
    setError(null);
    
    if (!name || !email || !userId || !password) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    onSave({ 
      name, 
      email, 
      userId, 
      password,
      department: isSuperuser ? undefined : departmentId,
      is_superuser: isSuperuser
    });
    
    // Reset form
    setName('');
    setEmail('');
    setUserId('');
    setPassword('');
    setDepartmentId(departments[0]?.id || '');
    setIsSuperuser(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Admin</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon icon="ph:x" width="24" height="24" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              placeholder="Enter user ID"
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Superuser</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isSuperuser}
                onChange={(e) => setIsSuperuser(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Grant superuser privileges</span>
            </div>
          </div>

          {!isSuperuser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal; 