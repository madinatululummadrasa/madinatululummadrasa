import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { toast } from "react-hot-toast";

const useMutateData = ({
method = "patch", // can be 'post' | 'patch' | 'put' | 'delete'
invalidateKey = [],
successMsg = "Data updated successfully",
errorMsg = "Something went wrong",
onSuccessCallback = () => {},
}) => {
const axiosSecure = useAxiosSecure();
const queryClient = useQueryClient();

const mutationFn = async ({ url, data }) => {
const res = await axiosSecure[method](url, data);
return res.data;
};

const mutation = useMutation({
mutationFn,
onSuccess: () => {
toast.success(successMsg);
queryClient.invalidateQueries(invalidateKey);
onSuccessCallback();
},
onError: () => {
toast.error(errorMsg);
},
});

return mutation;
};

export default useMutateData;