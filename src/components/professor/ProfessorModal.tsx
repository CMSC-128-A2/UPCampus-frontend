import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Save } from 'lucide-react';
import { Faculty } from '@/lib/api';

interface ProfessorModalProps {
    isOpen: boolean;
    onClose: () => void;
    professor?: Faculty | null;
    onSave?: (professorData: { name: string; email: string }) => void;
}

function ProfessorModal({
    isOpen,
    onClose,
    professor,
    onSave,
}: ProfessorModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form data when professor prop changes
    useEffect(() => {
        if (professor) {
            setName(professor.name);
            setEmail(professor.email || '');
        } else {
            resetForm();
        }
    }, [professor]);

    const resetForm = () => {
        setName('');
        setEmail('');
        setEmailError(null);
    };

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

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = async () => {
        if (!onSave) return;

        // Validate form
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

        try {
            setIsSaving(true);
            await onSave({
                name,
                email,
            });
            handleClose();
        } catch (error) {
            console.error('Error saving professor:', error);
            // Error is handled in parent component
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">
                            {professor ? 'Edit Professor' : 'Add Professor'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Icon icon="ph:x-bold" width="24" height="24" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4 mb-6">
                        <div className="space-y-2">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter professor name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`w-full p-3 border ${
                                    emailError
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="example@up.edu.ph"
                            />
                            {emailError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {emailError}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                                Email must end with @up.edu.ph
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center min-w-[80px]"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfessorModal;
