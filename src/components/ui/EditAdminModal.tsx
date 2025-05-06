import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface AdminUser {
  name: string;
  email: string;
  userId: string;
  password: string;
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: AdminUser) => void;
  initialData: AdminUser;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<AdminUser>(initialData);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.name || !formData.email || !formData.userId) {
      setError('Name, email, and user ID are required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <h2 className="text-lg font-medium text-gray-900">Edit admin</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <Icon icon="ph:x" width="20" height="20" />
          </button>
        </div>
        
        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="mb-4">
            <label className="block text-sm font-normal text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-normal text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-normal text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-normal text-gray-700 mb-1">Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Leave empty to keep current password"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to keep current password</p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#2196F3] text-white px-5 py-2 rounded-lg hover:bg-[#1976D2] text-sm font-medium"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal; 