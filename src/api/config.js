// API Configuration
// Switch between development and production URLs

const API_CONFIG = {
  // Production URL
  PRODUCTION_URL: 'https://haferlowe.appypie.com/api',

  // Development URLs
  DEVELOPMENT_URL: 'http://localhost:3000/api',

  // Set to true to force production API even in development
  // Changed to true since local server is not running
  FORCE_PRODUCTION: true,

  // Request timeout in milliseconds
  TIMEOUT: 15000,
};

// Determine which base URL to use
// Always use production URL since local server may not be running
export const API_BASE_URL = API_CONFIG.PRODUCTION_URL;

export const TIMEOUT = API_CONFIG.TIMEOUT;

export default API_CONFIG;
