// useAxiosCommon.jsx
import axios from 'axios';

const axiosCommon = axios.create({
  baseURL: 'http://localhost:8000', 
    withCredentials: true,
});

const useAxiosCommon = () => {
  return axiosCommon;
};

export default useAxiosCommon;
