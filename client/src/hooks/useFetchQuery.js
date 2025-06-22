import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";


const useFetchQuery = ({ key, url, enabled = true }) => {
const axiosSecure = useAxiosSecure();

return useQuery({
queryKey: key,
queryFn: async () => {
const res = await axiosSecure.get(url);
return res.data;
},
enabled,
});
};

export default useFetchQuery;