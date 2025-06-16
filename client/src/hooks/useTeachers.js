import { useEffect, useState } from "react";

import useAxiosCommon from "./useAxiosCommon";

const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosCommon = useAxiosCommon();

  useEffect(() => {
    axiosCommon
      .get("/teachers") // ✅ No need to repeat baseURL
      .then((res) => {
        setTeachers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setError(err);
        setLoading(false);
      });
  }, [axiosCommon]);

  return {
    teachers,
    loading,
    error,
    setLoading,
    setError,
  };
};

export default useTeachers;
