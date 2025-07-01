/* eslint-disable no-unused-vars */
import React from 'react'; // Import React for JSX
import useFetchQuery from "../../../hooks/useFetchQuery"; // Assuming this hook works as intended

const Collection = () => {
/* siam from laptop */
  // Fetching data using the custom hook
  const { data: collection = [], isLoading, error, refetch } = useFetchQuery({
    key: ["collections"],
    url: "/collections", // This URL will be relative to your API base URL
  });

  // Log collection data for debugging purposes (can be removed in production)
  console.log(collection);

  return (
    // Main container with responsive padding and max-width for better aesthetics
    <div className="container mx-auto p-4 md:p-8 font-inter">
      {/* Page title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 text-center">
        সকল কালেকশন
      </h1>

      {/* Conditional rendering based on loading, error, or data availability */}
      {isLoading ? (
        // Loading state
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      ) : error ? (
        // Error state
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-red-600">
            ত্রুটি: ডেটা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন। ({error.message})
          </p>
        </div>
      ) : (
        // Data display: Responsive table container for horizontal scrolling on small screens
        <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 rounded-tl-lg"
                >
                  তারিখ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                লেনদেনের ধরন 
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                  মাস
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                  পরিমাণ
                </th>
           
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  border-r border-gray-200 rounded-tr-lg"
                >
                  বিস্তারিত
                </th>
                     <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                  কালেকশনকারী
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {collection.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    কোনো কালেকশন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                collection.map((item, index) => (
                  <tr key={item._id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.admissionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.incomeSource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.amount}
                    </td>
                   
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.details}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {item.colletioner}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Collection;
