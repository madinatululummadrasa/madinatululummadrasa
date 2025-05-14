/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
const StudentCard = ({ name, className, roll, year, profileImage,studentId }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 text-center w-full max-w-[280px] mx-auto hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between">
      <img
        src={profileImage}
        alt={name}
        className="w-40 h-40 object-cover rounded-xl mx-auto mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-profile.png";
        }}
      />
      <div className="flex flex-col items-center justify-start">
        <h2 className="text-xl font-bengali font-semibold text-gray-800">{name}</h2>
        <h2 className="text-sm font-bengali font-semibold text-blue-800">Student Id :{studentId}</h2>
        <div className="flex flex-row items-center gap-2 justify-start ">
           <p className="text-[14px] text-gray-500 ">শ্রেণি : ({className})</p>
        <p className="text-[14px] text-gray-600">রোল নং: {roll}</p>
        </div>
       
        <p className="text-[16px] text-gray-600 mb-3">ভর্তির তারিখ : {year}</p>
      </div>
      <button
        onClick={() => navigate(`/students/${studentId}`)}
        className="mt-auto px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition"
      >
        বিস্তারিত দেখুন
      </button>
    </div>
  );
};

export default StudentCard;
