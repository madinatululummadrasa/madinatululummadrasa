import { FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { axiosSecure } from "../../../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";



const HomepageNotice = () => {
  const [notices, setNotices] = useState([])


  const fetchNotices = async () => {
    try {
      const { data } = await axiosSecure.get('/notices')
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);

    }
  }
  useEffect(() => {
    fetchNotices();
  }, []);
  return (
    <div className="bg-[#F8F8F8] rounded-2xl p-4 shadow-lg w-full max-w-md min-h-[519px] mx-auto flex flex-col justify-between">

      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span className="text-red-500 text-2xl">📢</span>
            নোটিশ বোর্ড
          </h2>
        </div>

        {notices.map((notice) => (
          <div
            key={notice._id}
            className="bg-white px-4 py-3 rounded-xl flex justify-between items-center shadow-sm hover:bg-gray-100 transition"
          >
            <div className=" flex items-start gap-2">
              <FaExclamationCircle className="text-red-600 mt-1" />
              <p className="text-sm text-gray-800 font-medium leading-snug">
                {notice.title}
              </p>
            </div>
            <a
              href={notice.pdfUrl}
              className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full"
            >
              বিস্তারিত
            </a>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center">
        <Link to="/notice">
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2 rounded-full transition">
            সকল নোটিশ ➤
          </button>

        </Link>
      </div>
    </div >
  );
};

export default HomepageNotice;
