/**
 * Application configuration loaded from environment variables
 */

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
};

export default config;
