// src/api/authService.ts
import axios from 'axios';

// URL dasar API backend
const API_URL = 'http://localhost:5001/api/users/';

// Tipe data dasar untuk request dan response
interface AuthData {
  email: string;
  password: string;
}

interface AuthResponse {
  _id: string;
  email: string;
  role: string;
  token: string;
}

// --- FUNGSI 1: Register User ---
const register = async (userData: AuthData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(API_URL + 'register', userData);

  if (response.data.token) {
    // Simpan data user ke Local Storage setelah register berhasil
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// --- FUNGSI 2: Login User ---
const login = async (userData: AuthData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(API_URL + 'login', userData);

  if (response.data.token) {
    // Simpan data user ke Local Storage setelah login berhasil
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// --- FUNGSI 3: Logout User ---
const logout = (): void => {
  // Hapus data user dari Local Storage
  localStorage.removeItem('user');
};

const authService = {
  register,
  logout,
  login,
};

export default authService;