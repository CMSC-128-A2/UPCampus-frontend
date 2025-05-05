import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: { name: string; email: string; userId: string; password: string }) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !userId || !password) {
      // In a real app, we'd show validation errors
      alert('Please fill in all fields');
      return;
    }

    onSave({ name, email, userId, password });
    
    // Reset form
    setName('');
    setEmail('');
    setUserId('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">New admin</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon icon="ph:x" width="20" height="20" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input
                  type="text"
                  placeholder="Enter user ID"
                  className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end pt-4 mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50"
                >
                  Add admin
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminModal; 