


const CreateClass = () => {


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto"> {/* max-w-sm sets a max-width around 384px, good for ~300px feel */}
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">শ্রেণী তৈরি করুন</h2>

        <form>
          {/* Date Field */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-1">
              * তারিখঃ
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <span className="p-2 bg-gray-200 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="date"
                id="date"
                className="flex-grow p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-r-md"
                defaultValue="21-06-2025"
                readOnly // Date is typically read-only or picked via a date picker
              />
            </div>
          </div>

          {/* Class Name Field */}
          <div className="mb-4">
            <label htmlFor="className" className="block text-gray-700 text-sm font-medium mb-1">
              * শ্রেণীর নামঃ
            </label>
            <input
              type="text"
              id="className"
              placeholder="শ্রেণীর নাম লিখুন"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Dropdown */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 text-sm font-medium mb-1">
              অবস্থাঃ
            </label>
            <select
              id="status"
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>সক্রিয়</option>
              <option>নিষ্ক্রিয়</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors flex-grow sm:flex-grow-0"
            >
              সংরক্ষণ করুন
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-gray-700 transition-colors flex-grow sm:flex-grow-0"
            >
              সকল শ্রেণীর তথ্য
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;