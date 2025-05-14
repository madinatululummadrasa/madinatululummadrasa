import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const {designation, address, joiningDate, name, phone, profileImageUrl, teachersId} = teachers;
    console.log(designation, address, joiningDate, name, phone, profileImageUrl, teachersId);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure()

     useEffect(() => {
           axiosSecure
               .get("http://localhost:8000/teachers", { withCredentials: true })
               .then((res) => {
                   setTeachers(res.data);
               })
               .catch((err) => {
                   console.error("Error fetching students:", err);
               });
       }, []);
    return { teachers, loading, error, setLoading, setError,designation, address, joiningDate, name, phone, profileImageUrl, teachersId };
};

export default useTeachers;
