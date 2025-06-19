/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";


const TeachersCard = ({ designation, detailLink,address, joiningDate, name, phone, profileImageUrl, teachersId }) => {

  const navigate = useNavigate();

  return (



    <div className="bg-white shadow-2xl rounded-2xl  text-center w-full max-w-[380px]  hover:shadow-xl transition-all duration-300 flex  gap-6 items-center ">
      <img
        src={profileImageUrl || "/default-profile.png"}
        alt={name}
        className="w-40 h-48 object-cover rounded-xl "
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-profile.png";
        }}
      />
      <div className="flex flex-col items-center ">
        <h2 className="text-xl font-bengali font-semibold text-gray-800">{name}</h2>

        <div className="flex flex-row items-center gap-2 justify-start ">
          <p className="text-[14px] text-gray-500 "> {designation}</p>
        </div>

        <button
          onClick={() => navigate(detailLink)}
          className="mt-auto px-2 py-2 bg-[#e6f4f0] flex  text-[#019267] text-sm font-medium rounded-2xl hover:bg-[#019267] hover:text-white ease-in transition-all duration-4 00"
        >
          <span className="flex gap-[4px] justify-center items-center"> বিস্তারিত দেখুন <FaArrowRight /></span>
        </button>
      </div>

    </div>


  );
};

export default TeachersCard;