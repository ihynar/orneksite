import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('piril_token'));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('piril_admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('piril_token', data.token);
      localStorage.setItem('piril_admin', JSON.stringify(data.admin));
      setToken(data.token);
      setAdmin(data.admin);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Giriş başarısız' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('piril_token');
    localStorage.removeItem('piril_admin');
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      token,
      admin,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [admin, loading, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
