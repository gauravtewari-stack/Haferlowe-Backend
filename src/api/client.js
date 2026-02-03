// API Client - Handles all HTTP requests with error handling
import { API_BASE_URL, TIMEOUT } from './config';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.timeout = TIMEOUT;
  }

  // Get auth token from localStorage (for admin, we might not need this initially)
  getAuthToken() {
    return localStorage.getItem('adminToken');
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem('adminToken', token);
  }

  // Clear auth token
  clearAuthToken() {
    localStorage.removeItem('adminToken');
  }

  // Build headers for requests
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Main request method with timeout support
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.buildHeaders(options.headers),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse JSON response
      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        const error = new Error(data.message || 'An error occurred');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }

      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
