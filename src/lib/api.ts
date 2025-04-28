// API constants and utility functions for backend communication
import config from './config';

const API_BASE_URL = config.apiUrl;

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
            const response = await fetch(`${API_BASE_URL}/api/schedules/courses/`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            return data.results.map(mapCourseToFrontend);
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
            const response = await fetch(`${API_BASE_URL}/api/schedules/sections/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sectionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
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
            const response = await fetch(`${API_BASE_URL}/api/schedules/courses/${courseId}/sections/${sectionName}/`, {
                method: 'DELETE',
            });

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