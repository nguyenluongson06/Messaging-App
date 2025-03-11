import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const register = async (userName, email, password) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    userName,
    email,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/signin`, {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/auth/signout`);
  return response.data;
};