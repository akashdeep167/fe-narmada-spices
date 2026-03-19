/**
 * Application configuration loaded from environment variables
 */

export const config = {
  apiBaseUrl: import.meta.env.API_BASE_URL || "http://localhost:5001",
};

export default config;
