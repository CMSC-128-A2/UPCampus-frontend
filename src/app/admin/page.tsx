'use client';
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import RootExtensionWrapper from './RootExtensionWrapper';
import AdminModal from '@/components/ui/AdminModal';
import EditAdminModal from '@/components/ui/EditAdminModal';
import Layout from '@/components/ui/Layout';
import { adminApi, AdminUser } from '@/lib/api';
import Toast, { ToastType } from '@/components/ui/Toast';

// Interface for frontend admin user format
interface AdminUserFrontend {
  id?: string;
  name: string;
  email: string;
  userId: string;
  password: string;
  department?: string;
  is_superuser: boolean;
}

// Toast notification state
interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUsers, setAdminUsers] = useState<AdminUserFrontend[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUserFrontend | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    isOpen: false, 
    message: '',
    type: 'info'
  });

  // Fetch admin users on component mount
    useEffect(() => {
    fetchAdmins();
  }, []);

  // Show toast notification
  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({
      isOpen: true,
      message,
      type
    });
  };

  // Close toast notification
  const closeToast = () => {
    setToast(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const fetchAdmins = async () => {
            try {
                setIsLoading(true);
      const data = await adminApi.getAllAdmins();
      console.log('Received admin data:', data); // Log the received data structure
      
      // Check if data is an array or if it has a results property (pagination)
      const adminArray = Array.isArray(data) ? data : 
                        (data?.results && Array.isArray(data.results)) ? data.results : 
                        [];
      
      // Map backend format to frontend format
      const frontendAdmins = adminArray.map((admin: AdminUser) => ({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        userId: admin.user_id,
        password: admin.password || '',  // Handle potential undefined password
        department: admin.department || '',
        is_superuser: admin.is_superuser || false
      }));
      
      setAdminUsers(frontendAdmins);
                setError(null);
            } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('Failed to load admin users. Please try again later.');
      showToast('Failed to load admin users', 'error');
            } finally {
                setIsLoading(false);
            }
        };

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

  const openEditModal = (admin: AdminUserFrontend, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click from also triggering
    setSelectedAdmin(admin);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    setSelectedAdmin(null);
  };

  const openDeleteConfirm = (admin: AdminUserFrontend, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click from also triggering
    setSelectedAdmin(admin);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedAdmin(null);
  };

  const handleSaveAdmin = async (admin: AdminUserFrontend) => {
    try {
      // Convert to backend format
      const backendAdmin = {
        name: admin.name,
        email: admin.email,
        user_id: admin.userId,
        password: admin.password,
        department: admin.department,
        is_superuser: admin.is_superuser
      };
      
      await adminApi.createAdmin(backendAdmin);
      fetchAdmins(); // Refresh the admin list
      closeModal();
      
      // Show success toast
      showToast(`Admin ${admin.name} added successfully`, 'success');
    } catch (err) {
      console.error('Failed to create admin:', err);
      showToast('Failed to create admin. Please try again.', 'error');
    }
  };

  const handleUpdateAdmin = async (updatedAdmin: AdminUserFrontend) => {
    if (!selectedAdmin?.id) return;
    
    try {
      // Convert to backend format
      const backendAdmin = {
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        user_id: updatedAdmin.userId,
        password: updatedAdmin.password,
        department: updatedAdmin.department,
        is_superuser: updatedAdmin.is_superuser
      };
      
      await adminApi.updateAdmin(selectedAdmin.id, backendAdmin);
      fetchAdmins(); // Refresh the admin list
      closeEditModal();
      
      // Show success toast
      showToast(`Admin ${updatedAdmin.name} updated successfully`, 'success');
    } catch (err) {
      console.error('Failed to update admin:', err);
      showToast('Failed to update admin. Please try again.', 'error');
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin?.id) return;
    
    try {
      await adminApi.deleteAdmin(selectedAdmin.id);
      
      // Show success toast - capture name before refreshing list
      const adminName = selectedAdmin.name;
      
      fetchAdmins(); // Refresh the admin list
      closeDeleteConfirm();
      
      showToast(`Admin ${adminName} deleted successfully`, 'success');
    } catch (err) {
      console.error('Failed to delete admin:', err);
      showToast('Failed to delete admin. Please try again.', 'error');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <RootExtensionWrapper>
        <Layout>
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A]"></div>
                </div>
        </Layout>
      </RootExtensionWrapper>
    );
  }

  // Render error state
  if (error) {
    return (
      <RootExtensionWrapper>
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
      </RootExtensionWrapper>
    );
  }

  return (
    <RootExtensionWrapper>
      <Layout>
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
            {filteredAdmins.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No admin users found. {searchQuery ? 'Try a different search.' : 'Add some admins to get started.'}</p>
                                        </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Password</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.map((admin, index) => (
                    <tr 
                      key={admin.id || index} 
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">{admin.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{admin.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{admin.userId}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {admin.password}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => openEditModal(admin, e)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Icon icon="ph:pencil" width="18" height="18" />
                          </button>
                                            <button 
                            onClick={(e) => openDeleteConfirm(admin, e)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                                            >
                            <Icon icon="ph:trash" width="18" height="18" />
                                            </button>
                                        </div>
                      </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                )}
                            </div>
                        </div>

        {/* Add Admin Modal */}
        <AdminModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveAdmin}
        />

        {/* Edit Admin Modal */}
        {selectedAdmin && (
          <EditAdminModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSave={handleUpdateAdmin}
            initialData={selectedAdmin}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the admin user <span className="font-medium">{selectedAdmin.name}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteConfirm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                                        <button
                  onClick={handleDeleteAdmin}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                  Delete
                                        </button>
                                </div>
                            </div>
                        </div>
                    )}

        {/* Toast Notification */}
        <Toast
          isOpen={toast.isOpen}
          onClose={closeToast}
          message={toast.message}
          type={toast.type}
          duration={5000}
        />
      </Layout>
    </RootExtensionWrapper>
    );
}

export default AdminPage;
