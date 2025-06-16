import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

export const axiosSecure = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Add request interceptor to attach token
    axiosSecure.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // ❗ Existing response interceptor
    axiosSecure.interceptors.response.use(
      res => res,
      async error => {
        console.log('error tracked in the interceptor', error.response);
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
