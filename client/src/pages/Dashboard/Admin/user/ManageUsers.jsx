import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "../../../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { FaEdit, FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";

const roles = ["admin", "student", "teacher"];

const ManageUsers = () => {
    const queryClient = useQueryClient();
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [expandedLogs, setExpandedLogs] = useState(null); // for toggling logs

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const { mutate: updateUser } = useMutation({
        mutationFn: async ({ userId, updatedData }) => {
            const res = await axiosSecure.patch(`/users/${userId}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            toast.success("User updated");
            queryClient.invalidateQueries(['users']);
            setEditingUserId(null);
        },
        onError: () => {
            toast.error("Failed to update user");
        }
    });

    const handleEditClick = (user) => {
        setEditingUserId(user._id);
        setEditFormData({
            name: user.name,
            email: user.email,
            role: user.role
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = (userId) => {
        updateUser({ userId, updatedData: editFormData });
    };

    const toggleLogs = (userId) => {
        setExpandedLogs(prev => (prev === userId ? null : userId));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

            {isLoading ? (
                <p>Loading users...</p>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => {
                        const isEditing = editingUserId === user._id;
                        const isExpanded = expandedLogs === user._id;
                        const imagelink = user.image || 'https://i.ibb.co/3y0f1bH/user.png'; // Fallback image

                        return (
                            <div
                                key={user._id}
                                className="bg-white shadow rounded-lg p-4 transition hover:shadow-md border"
                            >
                                {/* User row */}
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={imagelink}
                                            alt="User"
                                            className="w-14 h-14 rounded-full border object-cover"
                                        />
                                        <div>
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        name="name"
                                                        value={editFormData.name}
                                                        onChange={handleInputChange}
                                                        className="border rounded px-2 py-1 w-full"
                                                    />
                                                    <input
                                                        name="email"
                                                        value={editFormData.email}
                                                        onChange={handleInputChange}
                                                        className="border rounded px-2 py-1 mt-1 w-full"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="font-semibold text-lg">{user.name}</h3>
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {isEditing ? (
                                            <select
                                                name="role"
                                                value={editFormData.role}
                                                onChange={handleInputChange}
                                                className="border p-1 rounded"
                                            >
                                                {roles.map((role) => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-sm font-medium px-3 py-1 bg-gray-200 rounded-full">
                                                {user.role}
                                            </span>
                                        )}

                                        {isEditing ? (
                                            <button
                                                onClick={() => handleSaveClick(user._id)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <FaCheck />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit />
                                            </button>
                                        )}

                                        {/* Toggle Logs */}
                                        <button
                                            onClick={() => toggleLogs(user._id)}
                                            className="text-gray-600 hover:text-black"
                                        >
                                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </div>
                                </div>

                                {/* Collapsible logs section */}
                                {isExpanded && (
                                    <div className="mt-4 border-t pt-3 text-sm text-gray-700">
                                        <p className="mb-1 font-medium">Recent Activity (placeholder):</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Edited homepage banner</li>
                                            <li>Added a new user</li>
                                            <li>Changed exam schedule</li>
                                            {/* You'll fetch real logs later from backend */}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
