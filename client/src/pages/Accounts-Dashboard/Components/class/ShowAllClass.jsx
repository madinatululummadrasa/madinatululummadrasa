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
  const [formData, setFormData] = useState({
    className: "",
    status: "",
    fee: "",
    AdmissionFee: "",
    sesionFee: "",
  });

  const axiosSecure = useAxiosSecure();

  const openModal = (cls) => {
    setSelectedClass(cls);
    setFormData({
      className: cls.className,
      status: cls.status,
      fee: cls.fee,
      AdmissionFee: cls.AdmissionFee,
      sesionFee: cls.sesionFee,
    });
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
      await axiosSecure.patch(`/classes/${selectedClass._id}`, formData);
      toast.success("Updated successfully");
      refetch();
      closeModal();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (isLoading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-600">Something went wrong</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">সকল শ্রেণীর তালিকা</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm text-center">
          <thead className="bg-emerald-600 text-white text-sm">
            <tr>
              <th className="px-4 py-3 border-r border-emerald-500">নাম</th>
              <th className="px-4 py-3 border-r border-emerald-500">অবস্থা</th>
              <th className="px-4 py-3 border-r border-emerald-500">বেতন</th>
              <th className="px-4 py-3 border-r border-emerald-500">ভর্তি ফি</th>
              <th className="px-4 py-3 border-r border-emerald-500">সেশন ফি</th>
              <th className="px-4 py-3 border-r border-emerald-500">সাময়িক পরীক্ষার ফি</th>
              <th className="px-4 py-3 text-center">পরিবর্তন</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{cls.className}</td>
                <td className="px-4 py-3">{cls.status}</td>
                <td className="px-4 py-3">{cls.fee} ৳</td>
                <td className="px-4 py-3">{cls.AdmissionFee} ৳</td>
                <td className="px-4 py-3">{cls.sesionFee} ৳</td>
                <td className="px-4 py-3">
                  <table className="w-full border border-gray-200 text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 border-r text-center">প্রথম</th>
                        <th className="px-2 py-1 border-r text-center">দ্বিতীয়</th>
                        <th className="px-2 py-1 text-center">বার্ষিক</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 border-r text-center">{cls.firstExamFee|| 'X'}</td>
                        <td className="px-2 py-1 border-r text-center">{cls.secondExamFee || 'X'} </td>
                        <td className="px-2 py-1 text-center">{cls.finalExamFee || 'X'} </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openModal(cls)}
                    className="text-emerald-600 hover:underline text-center flex items-center justify-center gap-1"
                  >
                    পরিবর্তন <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
