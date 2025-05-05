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
            console.error('Failed to create section:', error);
            throw error;
        }
    },

    // Update an existing section
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
            console.error('Failed to update section:', error);
            throw error;
        }
    },

    // Delete a section
    deleteSection: async (courseId: string, sectionName: string) => {
        try {
            console.log(`Deleting section: courseId=${courseId}, sectionName=${sectionName}`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/courses/${courseId}/sections/${sectionName}/`, {
                method: 'DELETE',
            });

            console.log('Delete section response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Failed to delete section:', error);
            throw error;
        }
    }
};

// Faculty API
export const facultyApi = {
    // Get all faculty members
    getAllFaculty: async () => {
        try {
            console.log('Fetching faculty from:', `${API_BASE_URL}/api/schedules/faculty/`);
            const response = await fetch(`${API_BASE_URL}/api/schedules/faculty/`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch faculty members:', error);
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
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
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
    }
}; 