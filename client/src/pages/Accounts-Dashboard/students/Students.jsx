/* eslint-disable no-unused-vars */
import useFetchQuery from "../../../hooks/useFetchQuery";
import { motion } from "framer-motion"; // Import motion for animations

const Students = () => {
  const {
    data: classes = [],
    isLoading,
    error,
    refetch,
  } = useFetchQuery({
    key: ["students"],
    url: "/debug-students",
  });

  // Optional: Log collections for debugging, can be removed in production
  // classes.forEach((student) => {
  //   if (Array.isArray(student.collections)) {
  //     student.collections.forEach(item => {
  //       console.log(item);
  //     });
  //   }
  // });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for each student card
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring", // Use a spring animation for a natural feel
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-800 drop-shadow-sm">
        Our Esteemed Students
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600 animate-pulse">Loading student data...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600 text-lg font-medium">
            Oops! Something went wrong: {error.message}. Please try again.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {classes.map((student) => (
            <motion.div
              key={student._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col h-full"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }} // Slight scale on hover
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Student Header - Image and Basic Info */}
              <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black opacity-10"></div> {/* Subtle overlay */}
                <img
                  src={student.profileImageUrl || `https://ui-avatars.com/api/?name=${student.name}&background=random&color=fff`}
                  alt={student.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md z-10"
                />
                <div className="absolute bottom-3 left-3 text-white text-shadow z-10">
                  <p className="text-xl font-bold">{student.name}</p>
                  <p className="text-sm font-light">ID: {student.studentId}</p>
                </div>
              </div>

              {/* Main Info Section */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 mb-4">
                  <div>
                    <p>
                      <strong>ঠিকানাঃ</strong> {student.address || "N/A"}
                    </p>
                    <p>
                      <strong>অবস্থাঃ</strong>{" "}
                      <span
                        className={`font-semibold ${
                          student.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {student.status || "N/A"}
                      </span>
                    </p>
                    <p>
                      <strong>শ্রেণীঃ</strong> {student.class}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>বেতনের ধরনঃ</strong> {student.feeType || "N/A"}
                    </p>
                    <p>
                      <strong>পূর্বের বকেয়াঃ</strong>{" "}
                      <span className="font-semibold text-red-500">
                        {student.preDue ? `${student.preDue}৳` : "N/A"}
                      </span>
                    </p>
                    <p>
                      <strong>মোবাইলঃ</strong> {student.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Guardian Info */}
                <div className="mb-4 pt-2 border-t border-gray-200">
                  <p className="text-md font-semibold text-gray-800 mb-1">
                    অভিভাবকের তথ্য:
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>
                      {student.guardian?.relation || "অভিভাবক"} নামঃ
                    </strong>{" "}
                    {student.guardianName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>পাসওয়ার্ডঃ</strong>{" "}
                    {student.guardian?.password || "N/A"}
                  </p>
                </div>

                {/* Payment info - Scrollable Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 flex-grow">
                  {Array.isArray(student.collections) &&
                  student.collections.length > 0 ? (
                    <table className="min-w-full text-sm text-left text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 uppercase sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-4 py-2 border-b border-gray-200">
                            মাস
                          </th>
                          <th className="px-4 py-2 border-b border-gray-200">
                            পরিমাণ
                          </th>
                          <th className="px-4 py-2 border-b border-gray-200">
                            সংগ্রহকারী
                          </th>
                          <th className="px-4 py-2 border-b border-gray-200">
                            পেমেন্ট ইতিহাস
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.collections.map((item, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-2">{item.month || "N/A"}</td>
                            <td className="px-4 py-2 font-medium text-green-700">
                              {item.amount}৳
                            </td>
                            <td className="px-4 py-2">
                              {item.colletioner || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {item.paymentInfo && item.paymentInfo.length > 0 ? (
                                <ul className="list-disc list-inside text-xs space-y-0.5">
                                  {item.paymentInfo.map((payment, paymentIdx) => (
                                    <li key={paymentIdx} className="text-gray-500">
                                      {payment.amount}৳ on {new Date(payment.date).toLocaleDateString()}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500 italic">কোন ইতিহাস নেই</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-center text-gray-500 italic">
                      এই শিক্ষার্থীর জন্য কোন পেমেন্ট তথ্য উপলব্ধ নেই।
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Students;