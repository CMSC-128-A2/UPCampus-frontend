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
}

export interface Course {
    id: string;
    course_code: string;
    sections: ClassSection[];
}

// Convert backend course format to frontend format
export const mapCourseToFrontend = (course: Course) => {
    console.log('Mapping course:', course); // Debug course mapping
    return {
        id: course.id,
        courseCode: course.course_code,
        sections: course.sections.map(section => ({
            section: section.section,
            type: section.type,
            room: section.room,
            schedule: section.schedule
        }))
    };
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

    // Create a new section
    createSection: async (sectionData: {
        course_code: string;
        section: string;
        type: string;
        room: string;
        day: string;
        time: string;
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