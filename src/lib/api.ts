// API constants and utility functions for backend communication
import config from './config';

const API_BASE_URL = config.apiUrl;

console.log('API_BASE_URL:', API_BASE_URL); // Debug the API URL

// Types
export interface ClassSection {
    id: string;
    section: string;
    type: 'Lecture' | 'Laboratory';
    room: string;
    schedule: string;
    faculty?: string;
    faculty_name?: string;
}

export interface Course {
    id: string;
    course_code: string;
    sections: ClassSection[];
}

export interface Department {
    id: string;
    name: string;
}

export interface Faculty {
    id: string;
    name: string;
    email: string;
    department: string;
    department_name: string;
}

export interface FacultyDetail extends Faculty {
    class_sections: ClassSection[];
    created_at: string;
    updated_at: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    user_id: string;
    password?: string;
    department?: string;
    department_name?: string;
    is_superuser: boolean;
}

// Convert backend course format to frontend format
export const mapCourseToFrontend = (course: Course) => {
    console.log('Mapping course:', course); // Debug course mapping
    return {
        id: course.id,
        courseCode: course.course_code,
        sections: course.sections.map(section => ({
            id: section.id,
            section: section.section,
            type: section.type,
            room: section.room,
            schedule: section.schedule,
            faculty: section.faculty ? section.faculty.toString() : null,
            facultyName: section.faculty_name
        }))
    };
};

// Helper function to parse schedule string to day and time
export const parseSchedule = (schedule: string) => {
    const parts = schedule.split('|');
    const day = parts[0]?.trim() || '';
    const time = parts[1]?.trim() || '';
    return { day, time };
};

// Schedules API
export const schedulesApi = {
    // Get all courses with their sections
    getCourses: async () => {
        try {
            console.log('Fetching courses from:', `${API_BASE_URL}/api/schedules/courses/`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/courses/`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const rawData = await response.text();
            console.log('Raw API response:', rawData);
            
            let data;
            try {
                data = JSON.parse(rawData);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                throw new Error('Invalid JSON response from server');
            }
            
            console.log('Parsed data:', data);
            
            // Handle both paginated and non-paginated responses
            const courses = data.results ? data.results : data;
            console.log('Courses data:', courses);
            
            if (!Array.isArray(courses)) {
                console.error('Courses is not an array:', courses);
                return [];
            }
            
            return courses.map(mapCourseToFrontend);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            throw error;
        }
    },

    // Delete a course
    deleteCourse: async (courseId: string) => {
        try {
            console.log(`Deleting course: courseId=${courseId}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/courses/${courseId}/`, {
                method: 'DELETE',
            });

            console.log('Delete course response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Failed to delete course:', error);
            throw error;
        }
    },

    // Create a new section
    createSection: async (sectionData: {
        course_code: string;
        section: string;
        type: string;
        room: string;
        day: string;
        time: string;
        faculty_id?: string;
    }) => {
        try {
            console.log('Creating section with data:', sectionData);
            const response = await fetch(`${API_BASE_URL}/api/schedules/sections/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(sectionData),
            });

            console.log('Create section response status:', response.status);

            // Always try to get the response data
            let responseData;
            try {
                const responseText = await response.text();
                try {
                    responseData = JSON.parse(responseText);
                } catch (parseError) {
                    responseData = { detail: responseText || `Error: ${response.status}` };
                }
            } catch (readError) {
                responseData = { detail: `Error: ${response.status}` };
            }

            if (!response.ok) {
                // For conflict errors (HTTP 409), return a structured error that the UI can handle
                if (response.status === 409 && responseData.conflicts) {
                    return {
                        error: true,
                        status: response.status,
                        detail: responseData.detail || 'Schedule conflict detected',
                        conflicts: responseData.conflicts
                    };
                }
                
                // For other errors, return a structured error
                return {
                    error: true,
                    status: response.status,
                    detail: responseData.detail || `Error: ${response.status}`
                };
            }

            return responseData;
        } catch (error) {
            console.error('Failed to create section:', error);
            return {
                error: true,
                status: 500,
                detail: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    },

    /**
     * Update an existing class section 
     * 
     * Returns either:
     * - On success: The updated section data from the server
     * - On error: { error: true, status, detail, conflicts? } with structured error information
     * 
     * Conflicts will be present in the response when there's a schedule conflict (HTTP 409)
     * 
     * @param sectionId ID of the section to update
     * @param sectionData Section data to update
     */
    updateSection: async (
        sectionId: string,
        sectionData: {
            course_code?: string;
            section: string;
            type: string;
            room: string;
            day: string;
            time: string;
            faculty_id?: string;
        }
    ) => {
        try {
            console.log(`Updating section ${sectionId} with data:`, sectionData);
            const response = await fetch(`${API_BASE_URL}/api/schedules/sections/${sectionId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(sectionData),
            });

            console.log('Update section response status:', response.status);

            // Always try to get the response data
            let responseData;
            try {
                const responseText = await response.text();
                try {
                    responseData = JSON.parse(responseText);
                } catch (parseError) {
                    responseData = { detail: responseText || `Error: ${response.status}` };
                }
            } catch (readError) {
                responseData = { detail: `Error: ${response.status}` };
            }

            if (!response.ok) {
                // For conflict errors (HTTP 409), return a structured error that the UI can handle
                if (response.status === 409 && responseData.conflicts) {
                    return {
                        error: true,
                        status: response.status,
                        detail: responseData.detail || 'Schedule conflict detected',
                        conflicts: responseData.conflicts
                    };
                }
                
                // For other errors, return a structured error
                return {
                    error: true,
                    status: response.status,
                    detail: responseData.detail || `Error: ${response.status}`
                };
            }

            return responseData;
        } catch (error) {
            console.error('Failed to update section:', error);
            return {
                error: true,
                status: 500,
                detail: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    },

    // Delete a section
    deleteSection: async (courseId: string, sectionId: string) => {
        try {
            console.log(`Deleting section: courseId=${courseId}, sectionId=${sectionId}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/sections/${sectionId}/`, {
                method: 'DELETE',
            });

            console.log('Delete section response status:', response.status);

            // Try to parse error response if present
            if (!response.ok) {
                let errorDetail = '';
                try {
                    const errorText = await response.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorDetail = errorJson.detail || errorText;
                    } catch (e) {
                        errorDetail = errorText;
                    }
                } catch (e) {
                    errorDetail = `Error: ${response.status}`;
                }

                return {
                    error: true,
                    status: response.status,
                    detail: errorDetail
                };
            }

            return {
                error: false,
                status: response.status
            };
        } catch (error) {
            console.error('Failed to delete section:', error);
            return {
                error: true,
                status: 500,
                detail: error instanceof Error ? error.message : 'An unexpected error occurred'
            };
        }
    },

    // Check for schedule conflicts
    checkScheduleConflicts: async (scheduleData: {
        day: string;
        time: string;
        room: string;
        faculty_id: string;
        exclude_section_id?: string;
    }) => {
        try {
            console.log('Checking schedule conflicts with data:', scheduleData);
            const response = await fetch(`${API_BASE_URL}/api/schedules/conflicts/check/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            });
            
            // Always try to parse the JSON response, regardless of status code
            let data;
            try {
                data = await response.json();
            } catch (e) {
                // If we can't parse JSON, use text response
                const textData = await response.text();
                return {
                    hasConflict: !response.ok,
                    details: `Error: ${response.status} - ${textData}`,
                    conflicts: []
                };
            }
            
            // If response is not ok, it means there's a conflict (409) or other error
            if (!response.ok) {
                return {
                    hasConflict: true,
                    details: data.detail || 'Schedule conflict detected.',
                    conflicts: data.conflicts || []
                };
            }
            
            return {
                hasConflict: false
            };
        } catch (error) {
            console.error('Failed to check schedule conflicts:', error);
            return {
                hasConflict: true,
                details: error instanceof Error ? error.message : 'An unexpected error occurred',
                conflicts: []
            };
        }
    }
};

// Faculty API
export const facultyApi = {
    getAllFaculty: async (adminId?: string) => {
        try {
            const url = new URL(`${API_BASE_URL}/api/schedules/faculty/`);
            if (adminId) {
                url.searchParams.append('admin_id', adminId);
            }
            const response = await fetch(url.toString(), {
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            // Log the response for debugging
            console.log('Faculty API Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch faculty:', error);
            throw error;
        }
    },
    
    // Get a single faculty member by ID
    getFaculty: async (id: string) => {
        try {
            console.log(`Fetching faculty with id ${id}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/faculty/${id}/`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch faculty with id ${id}:`, error);
            throw error;
        }
    },
    
    // Get schedules for a faculty member
    getFacultySchedules: async (id: string) => {
        try {
            console.log(`Fetching schedules for faculty with id ${id}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/faculty/${id}/schedules/`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch schedules for faculty with id ${id}:`, error);
            throw error;
        }
    },
    
    // Create a new faculty member
    createFaculty: async (facultyData: {
        name: string;
        email: string;
        department: string;
    }) => {
        try {
            console.log('Creating faculty with data:', facultyData);
            const response = await fetch(`${API_BASE_URL}/api/schedules/faculty/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(facultyData),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                
                throw new Error(errorData.detail || `Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to create faculty:', error);
            throw error;
        }
    },
    
    // Update a faculty member
    updateFaculty: async (
        id: string,
        facultyData: {
            name: string;
            email: string;
            department: string;
        }
    ) => {
        try {
            console.log(`Updating faculty ${id} with data:`, facultyData);
            const response = await fetch(`${API_BASE_URL}/api/schedules/faculty/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(facultyData),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                
                throw new Error(errorData.detail || `Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Failed to update faculty ${id}:`, error);
            throw error;
        }
    },
    
    // Delete a faculty member
    deleteFaculty: async (id: string) => {
        try {
            console.log(`Deleting faculty with id ${id}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/faculty/${id}/`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to delete faculty with id ${id}:`, error);
            throw error;
        }
    }
};

// Admin API
export const adminApi = {
    // Get all admin users
    getAllAdmins: async () => {
        try {
            console.log('Fetching admins from:', `${API_BASE_URL}/api/schedules/admins/`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/admins/`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            // Safely parse the response as JSON
            const rawData = await response.text();
            console.log('Raw API response:', rawData);
            
            let data;
            try {
                data = JSON.parse(rawData);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                throw new Error('Invalid JSON response from server');
            }
            
            console.log('Parsed data structure:', data);
            
            // Return the data array or results array if it's paginated
            if (Array.isArray(data)) {
                return data;
            } else if (data && typeof data === 'object') {
                if (Array.isArray(data.results)) {
                    return data.results;
                } else if (data.admins && Array.isArray(data.admins)) {
                    return data.admins;
                } else if (Object.values(data).some(val => Array.isArray(val))) {
                    // Fallback: try to find any array property in the response
                    const arrayProps = Object.entries(data)
                        .filter(([_, value]) => Array.isArray(value));
                    if (arrayProps.length > 0) {
                        console.log('Found array property:', arrayProps[0][0]);
                        return arrayProps[0][1];
                    }
                }
                // If we still have an object but no arrays, check if it's a single admin object
                if (data.id && data.name && data.email) {
                    return [data]; // Return as array with single item
                }
            }
            
            // If we couldn't identify the structure, return empty array
            console.error('Unrecognized data structure received from API:', data);
            return [];
        } catch (error) {
            console.error('Failed to fetch admins:', error);
            throw error;
        }
    },
    
    // Get a single admin by ID
    getAdmin: async (id: string) => {
        try {
            console.log(`Fetching admin with id ${id}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/admins/${id}/`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch admin with id ${id}:`, error);
            throw error;
        }
    },
    
    // Create a new admin user
    createAdmin: async (adminData: {
        name: string;
        email: string;
        user_id: string;
        password: string;
        department?: string;
        is_superuser: boolean;
    }) => {
        try {
            console.log('Creating admin with data:', adminData);
            const response = await fetch(`${API_BASE_URL}/api/schedules/admins/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(adminData),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                
                throw new Error(errorData.detail || `Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to create admin:', error);
            throw error;
        }
    },
    
    // Update an admin user
    updateAdmin: async (
        id: string,
        adminData: {
            name: string;
            email: string;
            user_id: string;
            password?: string;
            department?: string;
            is_superuser: boolean;
        }
    ) => {
        try {
            console.log(`Updating admin ${id} with data:`, adminData);
            const response = await fetch(`${API_BASE_URL}/api/schedules/admins/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(adminData),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }
                
                throw new Error(errorData.detail || `Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Failed to update admin ${id}:`, error);
            throw error;
        }
    },
    
    // Delete an admin user
    deleteAdmin: async (id: string) => {
        try {
            console.log(`Deleting admin with id ${id}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/admins/${id}/`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to delete admin with id ${id}:`, error);
            throw error;
        }
    },
    
    authenticate: async (userId: string, password: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/schedules/admins/authenticate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, password }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Authentication failed: ${response.status}`);
            }
            
            const adminData = await response.json();
            
            // Store admin data in localStorage for persistence
            localStorage.setItem('adminUser', JSON.stringify(adminData));
            
            return adminData;
        } catch (error) {
            console.error('Authentication failed:', error);
            throw error;
        }
    },
    
    checkAuthenticated: () => {
        const adminUser = localStorage.getItem('adminUser');
        return adminUser ? JSON.parse(adminUser) : null;
    },
    
    logout: () => {
        localStorage.removeItem('adminUser');
    }
}; 