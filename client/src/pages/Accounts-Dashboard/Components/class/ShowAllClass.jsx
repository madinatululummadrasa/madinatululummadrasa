/* eslint-disable no-unused-vars */
import { useState } from "react";
import useFetchQuery from "../../../../hooks/useFetchQuery";
import { Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ClassUpdateModal from "./ClassUpdateModal";


const ShowAllClass = () => {
  const { data: classes = [], isLoading, error, refetch } = useFetchQuery({
    key: ["classes"],
    url: "/classes",
  });

  const [selectedClass, setSelectedClass] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ className: "", status: "" , fee: "" });

  const axiosSecure = useAxiosSecure();

  const openModal = (cls) => {
    setSelectedClass(cls);
    setFormData({ className: cls.className, status: cls.status , fee: cls.fee });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedClass(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosSecure.patch(`/classes/${selectedClass._id}`, formData);
      toast.success("Updated successfully");
      refetch();
      closeModal();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="p-4">
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border text-left">শ্রেণীর তথ্য</th>
            <th className="p-2 border text-left">পরিবর্তন</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls._id} className="border">
              <td className="p-2 border">
                <p>নামঃ {cls.className}</p>
                <p>অবস্থা: {cls.status}</p>
               <p>বেতন: {cls.fee}</p>
              </td>
              <td className="p-2 border text-center">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => openModal(cls)}
                >
                  <Pencil className="inline mr-1" />
                  পরিবর্তন করুন
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reusable Modal Component */}
      <ClassUpdateModal
        isOpen={isOpen}
        onClose={closeModal}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default ShowAllClass;
