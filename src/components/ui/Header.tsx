'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { adminApi, newSemesterApi } from '@/lib/api';

const Header: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const user = adminApi.checkAuthenticated();
    setIsAuthenticated(!!user);
  }, []);
  
  const handleNewSemester = () => {
    setShowConfirmDialog(true);
  };

  const confirmNewSemester = async () => {
    try {
      setIsResetting(true);
      await newSemesterApi.resetForNewSemester();
      setShowConfirmDialog(false);
      
      // Show success message or redirect
      alert('New semester started successfully! All schedules have been cleared.');
      
      // Optionally redirect to a specific page
      router.push('/map');
    } catch (error) {
      console.error('Failed to start new semester:', error);
      alert('Failed to start new semester. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const cancelNewSemester = () => {
    setShowConfirmDialog(false);
  };
  
  return (
    <>
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b w-full">
        <div className="flex items-center gap-2">
          <Link href="/map" className="flex items-center">
            <div className="text-[#8BC34A] text-2xl font-semibold">
              <span className="text-[#8BC34A]">UP</span>
              <span className="text-[#8BC34A] ml-1">Manager</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <Link 
              href="/signin" 
              className="text-[#008CFF] border border-[#008CFF] px-5 py-2 rounded-lg flex items-center hover:bg-[#F0F8FF] transition-colors duration-200"
            >
              <Icon icon="material-symbols:login" className="mr-2" width="20" height="20" />
              Sign In
            </Link>
          )}
          
          {isAuthenticated && (
            <button 
              onClick={handleNewSemester}
              className="text-[#FF5722] border border-[#FF5722] px-5 py-2 rounded-lg flex items-center hover:bg-[#FFF3E0] transition-colors duration-200"
              disabled={isResetting}
            >
              <Icon icon="material-symbols:refresh" className="mr-2" width="20" height="20" />
              {isResetting ? 'Starting...' : 'New Sem'}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <Icon icon="material-symbols:warning" className="text-red-500 mr-3" width="24" height="24" />
              <h2 className="text-xl font-bold text-gray-800">Start New Semester?</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              This action will permanently delete all current schedules and class sections. 
              Rooms, courses and faculty will be preserved. This action cannot be undone.
            </p>
            
            <p className="text-red-600 font-semibold mb-6">
              Are you sure you want to start a new semester?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelNewSemester}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                disabled={isResetting}
              >
                Cancel
              </button>
              <button
                onClick={confirmNewSemester}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:check" className="mr-2" width="16" height="16" />
                    Yes, Start New Semester
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 