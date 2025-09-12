import axios from 'axios';

const API_URL = 'https://bacendofleave.onrender.com/api';

const api = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  register: async (name, email, password, role, profile) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (profile) formData.append('profile', profile);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  fetchLeaves: async (userId, token) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to load leave statuses';
    }
  },

  applyLeave: async (startDate, endDate, reason, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/leaves`,
        { startDate, endDate, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to apply leave';
    }
  },

  approveLeave: async (leaveId, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/leaves/${leaveId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to approve';
    }
  },

  rejectLeave: async (leaveId, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/leaves/${leaveId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reject';
    }
  },

  fetchEmployees: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to load employees';
    }
  },

  fetchApprover: async (role, token) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/approver/${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return { role, profileImage: null, name: `${role} (Not Assigned)` };
    }
  },
};

export default api;