import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sms_auth_token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('sms_user_role') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize and validate session on mount or token change
  useEffect(() => {
    const verifyUserSession = async () => {
      const savedToken = localStorage.getItem('sms_auth_token');
      if (!savedToken) {
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        return;
      }

      try {
        const response = await api.auth.getMe();
        if (response && response.success && response.user) {
          const profileData = response.user.profile || {};
          const fullUser = {
            ...profileData,
            ...response.user,
            id: profileData.studentId || profileData.teacherId || response.user.id || response.user._id,
            _id: response.user.id || response.user._id,
            avatar: response.user.profileImage || profileData.profileImage || (
              response.user.role === 'teacher'
                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            )
          };
          setUser(fullUser);
          setRole(response.user.role);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session verification failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, [token]);

  const login = async (email, password, expectedRole) => {
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem('sms_auth_token', res.token);
        localStorage.setItem('sms_user_role', res.user.role);
        setToken(res.token);
        setRole(res.user.role);
        
        const profileData = res.user.profile || {};
        const fullUser = {
          ...profileData,
          ...res.user,
          id: profileData.studentId || profileData.teacherId || res.user.id || res.user._id,
          _id: res.user.id || res.user._id,
          avatar: res.user.profileImage || profileData.profileImage || (
            res.user.role === 'teacher'
              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          )
        };
        setUser(fullUser);
        setIsAuthenticated(true);
        return { success: true, role: res.user.role };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message: msg };
    }
  };

  const demoLogin = async (targetRole) => {
    if (targetRole === 'student') {
      return await login('student@demo.com', 'student123', 'student');
    } else {
      return await login('teacher@demo.com', 'teacher123', 'teacher');
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('sms_auth_token');
    localStorage.removeItem('sms_user_role');
    setToken(null);
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedData) => {
    try {
      if (user?.role === 'student') {
        const studentKey = user.studentId || user.id || user._id;
        const res = await api.students.update(studentKey, updatedData);
        setUser(prev => ({ ...prev, ...res, ...updatedData }));
      } else if (user?.role === 'teacher') {
        const teacherKey = user.teacherId || user.id || user._id;
        const res = await api.teachers.update(teacherKey, updatedData);
        setUser(prev => ({ ...prev, ...res, ...updatedData }));
      } else {
        setUser(prev => ({ ...prev, ...updatedData }));
      }
    } catch (err) {
      console.error('Failed to sync profile update with backend:', err);
      setUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
