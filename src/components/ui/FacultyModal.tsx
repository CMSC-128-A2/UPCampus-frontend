import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { facultyApi, Department } from '@/lib/api';

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faculty: { name: string; email: string; department: string }) => void;
}

const FacultyModal: React.FC<FacultyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

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

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    
    const emailRegex = /^[\w\.-]+@up\.edu\.ph$/;
    if (!emailRegex.test(email)) {
      return 'Email must be in the format: example@up.edu.ph';
    }
    
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Validate email
    setEmailError(validateEmail(newEmail));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!name) {
      alert('Please enter a name');
      return;
    }
    
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      alert(emailValidationError);
      return;
    }
    
    if (!departmentId) {
      alert('Please select a department');
      return;
    }

    onSave({
      name,
      email,
      department: departmentId
    });
    
    // Reset form
    setName('');
    setEmail('');
    setEmailError(null);
    setDepartmentId(departments.length > 0 ? departments[0].id : '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Faculty</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon icon="ph:x-bold" className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter faculty name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full p-2 border rounded-md ${emailError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="example@up.edu.ph"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Email must end with @up.edu.ph</p>
          </div>

          <div className="mb-6">
            <label htmlFor="department" className="block text-gray-700 mb-1">Department</label>
            <select
              id="department"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              {departments.length === 0 ? (
                <option value="">No departments available</option>
              ) : (
                departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md mr-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || departments.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyModal; 