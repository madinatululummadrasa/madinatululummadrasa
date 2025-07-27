/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import ReusableForm from "../Components/ReusableForm/ReusableForm";



const CreateMemeber = () => {

  const fields = [
    { name: "date", label: "তারিখ", type: "date", required: true },
    { name: "name", label: "সদস্যের  নাম", required: true },
    { name: "contact", label: "মোবাইল নম্বর", required: true },
    { name: "nidNumber", label: "জাতীয় পরিচয়পত্র নম্বর", type: "text", required: true },
    { name: "address", label: "ঠিকানা", type: "text", required: true },
    { name: "fixedAmount", label: "ধার্যকৃত টাকা", type: "text", required: true },
    { name: "status", label: "অবস্থা", type: "select", options: ["সক্রিয়", "নিষ্ক্রিয়"] },
  ];

  const initialValues = {
    date: new Date().toISOString().split("T")[0],
    name: "",
    contact: '',
    nidNumber: '',
    address: '',
    fixedAmount: '',
    status: "সক্রিয়",
  };

  const handleSuccess = (res) => {
    alert("✅ সফলভাবে সংরক্ষিত হয়েছে!");
  };

  const extraButtons = [
    {
      type: "navigate",
      label: "সকল সদস্যদের দেখুন",
      to: "/accounts-dashboard/members",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
          নতুন সদস্য যুক্ত করুন
        </h2>

        <ReusableForm
          endpoint="/members"
          fields={fields}
          initialValues={initialValues}
          buttonText="তৈরি করুন"
          onSuccess={handleSuccess}
          buttons={[...extraButtons]}
        />


      </div>
    </div>
  );
};

export default CreateMemeber;
