import { FaExclamationCircle } from 'react-icons/fa';


const ImportantLinks = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-[350px] min-h-[516px]  flex flex-col justify-between">

      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span className="text-red-500 text-2xl">📢</span>
            নোটিশ বোর্ড
          </h2>
        </div>


        <div

          className="bg-gray-50 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm hover:bg-gray-100 transition"
        >
          <div className="flex items-start gap-2">
            <FaExclamationCircle className="text-red-600 mt-1" />
            <p className="text-sm text-gray-800 font-medium leading-snug">
              ghbfh
            </p>
          </div>
          <a
            href={'/'}
            className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full"
          >
            বিস্তারিত
          </a>
        </div>

      </div>


    </div >
  );
};

export default ImportantLinks;