import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginRequest } from '../api/auth';
import { api, getStoredToken, setStoredToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  // 'checking' | 'authenticated' | 'unauthenticated' - starts 'checking' so
  // ProtectedRoute doesn't flash a redirect to /admin/login before we've had
  // a chance to validate a token that's already in storage.
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    api
      .get('/auth/me', { auth: true })
      .then((data) => {
        setAdmin(data);
        setStatus('authenticated');
      })
      .catch(() => {
        // Token expired or invalid - clear it so we don't keep retrying.
        setStoredToken(null);
        setStatus('unauthenticated');
      });
  }, []);

  async function login(email, password) {
    const { access_token: token } = await loginRequest(email, password);
    setStoredToken(token);
    const me = await api.get('/auth/me', { auth: true });
    setAdmin(me);
    setStatus('authenticated');
  }

  function logout() {
    setStoredToken(null);
    setAdmin(null);
    setStatus('unauthenticated');
  }

  return (
    <AuthContext.Provider value={{ admin, status, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
