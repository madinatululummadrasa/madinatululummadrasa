/* eslint-disable no-unused-vars */
import useFetchQuery from "../../../hooks/useFetchQuery";

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Students</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Something went wrong: {error.message}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {classes.map((student) => (
            <div
              key={student._id}
              className="border border-gray-300 rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-3 divide-x">
                {/* Student Info */}
                <div className="p-2 text-sm">
                  <p><strong>নামঃ</strong> {student.name}</p>
                  <p><strong>আইডিঃ</strong> {student.studentId}</p>
                  <p><strong>ঠিকানাঃ</strong> {student.address || "N/A"}</p>
                  <p><strong>অবস্থাঃ</strong> {student.status || "N/A"}</p>
                  <p><strong>শ্রেণীঃ</strong> {student.class}</p>
                  <p><strong>বেতনের ধরনঃ</strong> {student.feeType || "N/A"}</p>
                  <p><strong>Due</strong> {student.preDue || "N/A"}</p>
                </div>

                {/* Student Image */}
                <div className="p-2 flex items-center justify-center">
                  <img
                    src={student.profileImageUrl}
                    alt={student.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>

                {/* Guardian Info */}
                <div className="p-2 text-sm">
                  <p><strong>{student.guardian?.relation || "অভিভাবক"}ঃ</strong> {student.guardianName || "N/A"}</p>
                  <p><strong>মোবাইলঃ</strong> {student.phone || "N/A"}</p>
                  <p><strong>পাসওয়ার্ডঃ</strong> {student.guardian?.password || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
