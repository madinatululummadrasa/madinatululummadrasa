/* eslint-disable no-unused-vars */
import React from 'react';
import useAuth from './useAuth';
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from './useAxiosSecure';


const useRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: role, isLoading } = useQuery({ 
        queryKey: ['role'],
        enabled: !loading && !!user?.email,
        queryFn: async () => {            
            const {data} = await axiosSecure.get(`/users/${user?.email}`)  
            return data?.role
        },
    })
    return [role, isLoading]
};
export default useRole;
 

