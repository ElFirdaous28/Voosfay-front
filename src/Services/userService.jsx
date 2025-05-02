import api from "./api";

export const userService = {
    block: async (userId) => {
        try {
            await api.put(`users/${userId}/block`);
            return true;
        } catch (error) {
            console.error('Error blocking user:', error);
            return false;
        }
    },

    delete: async (userId) => {
        try {
            await api.delete(`v1/admin/users/${userId}/force-delete`);
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },

    changeStatus: async (userId, data) => {
        try {
            await api.post(`v1/admin/users/${userId}/status`, {
                _method: 'PATCH',
                ...data
            });
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },
    warn: async (userId) => {
        try {
            await api.post(`v1/admin/users/${userId}/warn`)
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },
    resolveReport: async (reportId) => {
        try {
            await api.post(`v1/reports/${reportId}/status`, {
                _method: 'PATCH',
                'status': 'resolved'
            })
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },
};