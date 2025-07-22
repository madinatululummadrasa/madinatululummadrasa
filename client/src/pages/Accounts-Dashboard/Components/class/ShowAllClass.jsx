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
  const [formData, setFormData] = useState({ className: "", status: "" , fee: "", AdmissionFee: "", sesionFee: "" });

  const axiosSecure = useAxiosSecure();

  const openModal = (cls) => {
    setSelectedClass(cls);
    setFormData({ className: cls.className, status: cls.status , fee: cls.fee, AdmissionFee: cls.AdmissionFee , sesionFee: cls.sesionFee });
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
  <div className="p-4 max-w-4xl mx-auto">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">সকল শ্রেণীর তালিকা</h2>

    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header Row */}
      <div className="grid grid-cols-6 bg-emerald-600 text-white font-semibold text-sm">
        <div className="col-span-1 px-4 py-3 border-r border-emerald-500">নাম</div>
        <div className="col-span-1 px-4 py-3 border-r border-emerald-500">অবস্থা</div>
        <div className="col-span-1 px-4 py-3 border-r border-emerald-500">বেতন</div>
        <div className="col-span-1 px-4 py-3 border-r border-emerald-500">ভর্তি ফি</div>
        <div className="col-span-1 px-4 py-3 border-r border-emerald-500">সেশন ফি</div>
        <div className="col-span-1 px-4 py-3 text-center">পরিবর্তন</div>
      </div>

      {/* Data Rows */}
      {classes.map((cls, index) => (
        <div
          key={cls._id}
          className="grid grid-cols-6 text-sm items-center border-t hover:bg-gray-50 transition"
        >
          <div className="col-span-1 px-4 py-3">{cls.className}</div>
          <div className="col-span-1 px-4 py-3">{cls.status}</div>
          <div className="col-span-1 px-4 py-3">{cls.fee} ৳</div>
          <div className="col-span-1 px-4 py-3">{cls.AdmissionFee} ৳</div>
          <div className="col-span-1 px-4 py-3">{cls.sesionFee} ৳</div>
          <div className="col-span-1 px-4 py-3 flex justify-center">
            <button
              onClick={() => openModal(cls)}
              className="text-emerald-600 hover:underline flex items-center gap-1"
            >
             
              পরিবর্তন <Pencil size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Modal Component */}
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
