/* eslint-disable react/prop-types */
import './btn.css'
import './an.css'
import { useNavigate } from "react-router-dom";
const StudentCard = ({ name, className, roll, profileImage, studentId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center ">
      <div className="animatedCard bg-white shadow-lg rounded-2xl p-6 mx-auto text-center w-full max-w-[280px] hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between">

        <img
          src={profileImage}
          alt={name}
          className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-blue-100 shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-profile.png";
          }}
        />
        <div className="flex flex-col items-center  justify-center mb-5">
          <h2 className="text-2xl font-bengali font-bold text-gray-800 mb-1">{name}</h2>
          <h2 className="text-md font-bengali font-semibold text-blue-700 mb-1">Student Id: {studentId}</h2>
          <div className="flex flex-row items-center gap-2 justify-center">
            <p className="text-[16px] text-gray-600">শ্রেণি: <span className="font-medium">({className})</span></p>
            <p className="text-[16px] text-gray-600">রোল নং: <span className="font-medium">{roll}</span></p>
          </div>
        </div>


        <button
          onClick={() => navigate(`/students/${studentId}`)}
          className="button-86" role="button">  বিস্তারিত দেখুন</button>


      </div>
    </div>
  );
};

export default StudentCard;
