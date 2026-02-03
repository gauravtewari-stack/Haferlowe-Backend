// Admin Users Service - Handles all user-related admin API calls
import apiClient from '../api/client';

export const adminUsersService = {
  // Get all users with pagination and filtering
  async getAll(params = {}) {
    const { page = 1, limit = 50, search, email } = params;
    const queryParams = { page, limit };
    if (search) queryParams.search = search;
    if (email) queryParams.email = email;

    const response = await apiClient.get('/admin/users', queryParams);
    return response;
  },

  // Get user by ID
  async getById(id) {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response;
  },

  // Create new user
  async create(userData) {
    const response = await apiClient.post('/admin/users', userData);
    return response;
  },

  // Update user
  async update(id, userData) {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response;
  },

  // Delete user
  async delete(id) {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response;
  },

  // Update user status (active/inactive)
  async updateStatus(id, status) {
    const response = await apiClient.put(`/admin/users/${id}/status`, { status });
    return response;
  },

  // Reset user password
  async resetPassword(id, newPassword) {
    const response = await apiClient.post(`/admin/users/${id}/reset-password`, {
      newPassword,
    });
    return response;
  },

  // Get weight entries for a user
  async getWeightEntries(params = {}) {
    const { page = 1, limit = 50, userId, startDate, endDate } = params;
    const queryParams = { page, limit };
    if (userId) queryParams.userId = userId;
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    const response = await apiClient.get('/admin/weight-entries', queryParams);
    return response;
  },

  // Get wellbeing entries for a user
  async getWellbeingEntries(params = {}) {
    const { page = 1, limit = 50, userId, startDate, endDate } = params;
    const queryParams = { page, limit };
    if (userId) queryParams.userId = userId;
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    const response = await apiClient.get('/admin/wellbeing-entries', queryParams);
    return response;
  },

  // Get HbA1c entries for a user
  async getHbA1cEntries(params = {}) {
    const { page = 1, limit = 50, userId, startDate, endDate } = params;
    const queryParams = { page, limit };
    if (userId) queryParams.userId = userId;
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    const response = await apiClient.get('/admin/hba1c-entries', queryParams);
    return response;
  },
};

export default adminUsersService;
