// Admin Registration Codes Service
import apiClient from '../api/client';

export const adminRegistrationCodesService = {
  // Get all registration codes
  async getAll(params = {}) {
    const { email, used } = params;
    const queryParams = {};
    if (email) queryParams.email = email;
    if (typeof used === 'boolean') queryParams.used = used;

    const response = await apiClient.get('/admin/registration-codes', queryParams);
    return response;
  },

  // Get registration code by ID
  async getById(id) {
    const response = await apiClient.get(`/admin/registration-codes/${id}`);
    return response;
  },

  // Create new registration code
  async create(codeData) {
    const response = await apiClient.post('/admin/registration-codes', codeData);
    return response;
  },

  // Update registration code
  async update(id, codeData) {
    const response = await apiClient.put(`/admin/registration-codes/${id}`, codeData);
    return response;
  },

  // Delete registration code
  async delete(id) {
    const response = await apiClient.delete(`/admin/registration-codes/${id}`);
    return response;
  },
};

export default adminRegistrationCodesService;
