/* eslint-disable no-unused-vars */
import React from 'react';
import useFetchQuery from "../../../hooks/useFetchQuery";

const Collection = () => {
  const { data: collection = [], isLoading, error, refetch } = useFetchQuery({
    key: ["collections"],
    url: "/collections",
  });

  return (
    <div className="container mx-auto p-4 md:p-8 font-inter">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 text-center">
        সকল কালেকশন
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-red-600">
            ত্রুটি: ডেটা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন। ({error.message})
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Define all columns */}
                {[
                  "তারিখ",
                  "লেনদেনের ধরন",
                  "মাস",
                  "পরিমাণ",
                  "বিস্তারিত",
                  "শ্রেণি",
                  "ছাত্রের নাম",
                  "দাতার নাম",
                  "দাতার মোবাইল",
                  "কালেকশনকারী",
                ].map((heading, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 ${
                      i === 0 ? "rounded-tl-lg" : ""
                    } ${i === 9 ? "rounded-tr-lg" : ""}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collection.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    কোনো কালেকশন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                collection.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.admissionDate || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.incomeSource || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.month || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.amount || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.details || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.class || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.student || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.donorName || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {item.donorPhone || item.contact || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{item.collector || "-"}</td>
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
