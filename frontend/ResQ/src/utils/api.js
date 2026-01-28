// API Configuration for Node.js + Express Backend
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    VERIFY_TOKEN: `${API_BASE_URL}/api/auth/verify`,
  },

  // Admin endpoints
  ADMIN: {
    DISASTERS: {
      LIST: `${API_BASE_URL}/api/admin/disasters`,
      CREATE: `${API_BASE_URL}/api/admin/disasters`,
      UPDATE: (id) => `${API_BASE_URL}/api/admin/disasters/${id}`,
      DELETE: (id) => `${API_BASE_URL}/api/admin/disasters/${id}`,
      VERIFY: (id) => `${API_BASE_URL}/api/admin/disasters/${id}/verify`,
      REJECT: (id) => `${API_BASE_URL}/api/admin/disasters/${id}/reject`,
      PENDING: `${API_BASE_URL}/api/admin/disasters/pending`,
    },
    VOLUNTEERS: {
      LIST: `${API_BASE_URL}/api/admin/volunteers`,
      GET: (id) => `${API_BASE_URL}/api/admin/volunteers/${id}`,
    },
    DONATIONS: {
      LIST: `${API_BASE_URL}/api/admin/donations`,
      PENDING: `${API_BASE_URL}/api/admin/donations/pending`,
      VERIFY: (id) => `${API_BASE_URL}/api/admin/donations/${id}/verify`,
      REJECT: (id) => `${API_BASE_URL}/api/admin/donations/${id}/reject`,
    },
    AID_REQUESTS: {
      LIST: `${API_BASE_URL}/api/admin/aid-requests`,
      PENDING: `${API_BASE_URL}/api/aid-requests/pending`,
      APPROVE: (id) => `${API_BASE_URL}/api/aid-requests/${id}/approve`,
      REJECT: (id) => `${API_BASE_URL}/api/aid-requests/${id}/reject`,
    },
  },

  // Disasters endpoints
  DISASTERS: {
    LIST: `${API_BASE_URL}/api/disasters`,
    GET: (id) => `${API_BASE_URL}/api/disasters/${id}`,
    SEARCH: (keyword) => `${API_BASE_URL}/api/disasters/search/${keyword}`,
    BY_CITY: (city) => `${API_BASE_URL}/api/disasters/city/${city}`,
    BY_AREA: (areaCode) => `${API_BASE_URL}/api/disasters/area/${areaCode}`,
    REPORT: `${API_BASE_URL}/api/disasters/report`,
  },

  // Volunteer endpoints
  VOLUNTEERS: {
    PROFILE: (id) => `${API_BASE_URL}/api/volunteers/${id}`,
    UPDATE_ROLE: (id) => `${API_BASE_URL}/api/volunteers/${id}/role`,
    TASKS: {
      LIST: `${API_BASE_URL}/api/volunteers/tasks`,
      ASSIGNED: (id) => `${API_BASE_URL}/api/volunteers/${id}/tasks`,
      ASSIGN: (id) => `${API_BASE_URL}/api/volunteers/${id}/task`,
      UPDATE: (taskId) => `${API_BASE_URL}/api/volunteers/tasks/${taskId}`,
    },
    VICTIMS_NEARBY: `${API_BASE_URL}/api/volunteers/victims/nearby`,
  },

  // Donor endpoints
  DONORS: {
    DONATIONS: {
      CREATE: `${API_BASE_URL}/api/donations`,
      HISTORY: (id) => `${API_BASE_URL}/api/donors/${id}/donations`,
    },
    SHELTERS: {
      CREATE: `${API_BASE_URL}/api/shelters`,
      LIST: `${API_BASE_URL}/api/shelters`,
    },
  },

  // Victim endpoints
  VICTIMS: {
    AID_REQUESTS: {
      CREATE: `${API_BASE_URL}/api/aid-requests`,
      LIST: (id) => `${API_BASE_URL}/api/aid-requests/victim/${id}`,
      CONFIRM: (id) => `${API_BASE_URL}/api/aid-requests/${id}/confirm`,
    },
    SHELTERS: {
      AVAILABLE: `${API_BASE_URL}/api/shelters/available`,
    },
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': user.token ? `Bearer ${user.token}` : '',
  };
};

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default API_BASE_URL;
