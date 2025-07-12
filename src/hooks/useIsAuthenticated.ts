import { useEffect, useState } from 'react';

export const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    window.addEventListener('storageUpdate', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('storageUpdate', checkAuth);
    };
  }, []);

  return { isAuthenticated };
};
