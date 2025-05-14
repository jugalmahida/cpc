import apiClient from './apiClient';

const dataService = {

    incrementVisits: async () => {
        try {
            const response = await apiClient.get('/visits/incrementCount');
            return response.data;
        } catch (error) {
            console.error("Error getting visits:", error);
            throw error;
        }
    },

    getVisitCount: async () => {
        try {
            const response = await apiClient.get('/visits/getCount');
            return response.data;
        } catch (error) {
            console.error("Error getting visits:", error);
            throw error;
        }
    },

    getVerticals: async () => {
        try {
            const response = await apiClient.get('/vertical/getAll');
            return response.data;
        } catch (error) {
            console.error("Error getting verticals:", error);
            throw error;
        }
    },


    getAcademicData: async (id) => {
        try {
            const response = await apiClient.get(`/vertical/getVerticalByID/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting verticals:", error);
            throw error;
        }
    },


    getFacultyData: async (id) => {
        try {
            const response = await apiClient.get(`/faculty/getById/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting verticals:", error);
            throw error;
        }
    },

    getFacultyByVertical: async (id) => {
        try {
            const response = await apiClient.get(`/faculty/vertical/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting verticals:", error);
            throw error;
        }
    },

    getStudentVerticals: async (id) => {
        try {
            const response = await apiClient.get(`/placement/vertical/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error getting placements:", error);
            throw error;
        }
    },

    getAllEvents: async () => {
        try {
            const response = await apiClient.get('/event/getAll');
            return response.data;
        } catch (error) {
            console.error("Error getting events:", error);
            throw error;
        }
    },

    getMediaImage: async () => {
        try {
            const response = await apiClient.get('/media/getAll');
            return response.data;
        } catch (error) {
            console.error("Error getting media:", error);
            throw error;
        }
    },

    getAnnouncements: async () => {
        try {
            const response = await apiClient.get('/announcement/getAll');
            return response.data;
        } catch (error) {
            console.error("Error getting announcements:", error);
            throw error;
        }
    },

    getAllJobs: async () => {
        try {
            const response = await apiClient.get('/jobs/getAll');
            return response.data;
        } catch (error) {
            console.error("Error getting announcements:", error);
            throw error;
        }
    },

    getAllCommittees: async () => {
        try {
            const response = await apiClient.get('/committees/getAll');
            return response.data;
        } catch (error) {
            console.error("Error getting announcements:", error);
            throw error;
        }
    },

    createInquiry: async (inquiryData) => {
        try {
            const response = await apiClient.post('/inquiry/create', inquiryData);
            return response.data;
        } catch (error) {
            console.error("Error creating inquiry:", error);
            throw error.response.data; // Throw server response if available
        }
    },

    getResults: async () => {
        try {
            const response = await apiClient.get('/results/getAll');
            return response.data;
        } catch (error) {
            console.error("Error creating inquiry:", error);
            throw error.response.data; // Throw server response if available
        }
    },

    studentInquiry: async (inquiryData) => {
        try {
            const response = await apiClient.post('/placement/studentInquiry', inquiryData);
            return response.data;
        } catch (error) {
            console.error("Error creating inquiry:", error);
            throw error.response.data; // Throw server response if available
        }
    },

    companyInquiry: async (formData) => {
        try {
            const response = await apiClient.post('/placement/companyInquiry', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating inquiry:", error);
            throw error.response.data; // Throw server response if available
        }
    },
    examRegistration: async (formData) => {
        try {
            const response = await apiClient.post('/exam/create', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating inquiry:", error);
            throw error.response.data; // Throw server response if available
        }
    },
};

export default dataService;