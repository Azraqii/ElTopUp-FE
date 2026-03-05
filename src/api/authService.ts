// src/api/authService.ts
import axios from 'axios';

// URL dasar API backend - menggunakan environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${API_BASE_URL}/auth/`;

// Tipe data dasar untuk request dan response
interface AuthData {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
}

// Tipe untuk disimpan di localStorage
interface StoredUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  access_token: string;
  refresh_token: string;
}

// --- FUNGSI 1: Register User ---
const register = async (userData: AuthData): Promise<StoredUser> => {
  const response = await axios.post<AuthResponse>(API_URL + 'register', userData);
  const { access_token, refresh_token } = response.data;

  // Fetch full profile after registration
  const profileResponse = await axios.get<UserProfile>(API_URL + 'me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const storedUser: StoredUser = {
    ...profileResponse.data,
    access_token,
    refresh_token,
  };

  // Simpan data user ke Local Storage setelah register berhasil
  localStorage.setItem('user', JSON.stringify(storedUser));
  return storedUser;
};

// --- FUNGSI 2: Login User ---
const login = async (userData: AuthData): Promise<StoredUser> => {
  const response = await axios.post<AuthResponse>(API_URL + 'login', userData);
  const { access_token, refresh_token } = response.data;

  // Fetch full profile after login
  const profileResponse = await axios.get<UserProfile>(API_URL + 'me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const storedUser: StoredUser = {
    ...profileResponse.data,
    access_token,
    refresh_token,
  };

  // Simpan data user ke Local Storage setelah login berhasil
  localStorage.setItem('user', JSON.stringify(storedUser));
  return storedUser;
};

// --- FUNGSI 3: Logout User ---
const logout = (): void => {
  // Hapus data user dari Local Storage
  localStorage.removeItem('user');
};

// --- FUNGSI 4: Get Current User Profile ---
const getMe = async (token: string): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(API_URL + 'me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const authService = {
  register,
  logout,
  login,
  getMe,
};

export default authService;