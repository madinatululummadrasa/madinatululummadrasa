/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import ReusableForm from "../ReusableForm/ReusableForm";

const CreateClass = () => {

  const fields = [
    { name: "date", label: "তারিখ", type: "date", required: true },
    { name: "className", label: "শ্রেণীর নাম", required: true },
    { name: "status", label: "অবস্থা", type: "select", options: ["সক্রিয়", "নিষ্ক্রিয়"] },
  ];

  const initialValues = {
    date: new Date().toISOString().split("T")[0],
    className: "",
    status: "সক্রিয়",
  };

  const handleSuccess = (res) => {
    alert("✅ সফলভাবে সংরক্ষিত হয়েছে!");
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
          শ্রেণী তৈরি করুন
        </h2>

        <ReusableForm
          endpoint="/classes"
          fields={fields}
          initialValues={initialValues}
          onSuccess={handleSuccess}
          buttonText="সংরক্ষণ করুন"
        />

      </div>
    </div>
  );
};

export default CreateClass;
