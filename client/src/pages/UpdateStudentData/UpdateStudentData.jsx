import { useEffect, useState } from 'react';
import Container from '../../components/Shared/Container';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StudentFilterBar from '../StudentListPage/components/StudentFilterBar';


const UpdateStudentData = () => {

    const AxiosSecure = useAxiosSecure();

    const currentYear = new Date().getFullYear();

    const [year, setYear] = useState(currentYear);
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [selectedClass, setSelectedClass] = useState("");
    const [searchRoll, setSearchRoll] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

console.log("selected Students:", selectedStudent);

    const [students, setStudents] = useState([]);
    useEffect(() => {
        AxiosSecure.get("/students")
            .then((res) => setStudents(res.data))
            .catch((err) => console.error("Error fetching students:", err));
    }, [AxiosSecure]);


    const filteredStudents = students.filter((student) => {
        const matchYear = selectedYear ? parseInt(student.session) === parseInt(selectedYear) : true;
        const matchClass = selectedClass ? student.class === selectedClass : true;
        const matchRoll = searchRoll ? parseInt(student.roll) === parseInt(searchRoll) : true;
        return matchYear && matchClass && matchRoll;
    });


    const handleUpdateStudent = async () => {


        try {
            // Send the entire selectedStudent object, the server will pick relevant fields
            const response = await AxiosSecure.put(`/students/${selectedStudent._id}`, selectedStudent);

            // Check response.data.result.modifiedCount if you want to know if changes were applied
            // Based on the server-side update, response.data.result will contain the modification details.
            if (response.data.result && response.data.result.modifiedCount > 0) {
                alert("✅ ছাত্রের তথ্য সফলভাবে আপডেট হয়েছে!");
                // Optionally re-fetch students or update the local state to reflect changes
                // For simplicity, let's just clear the selection and re-fetch for now.
                setSelectedStudent(null);
                // Re-fetch students to update the list with the latest data
                const res = await AxiosSecure.get("/students");
                setStudents(res.data);
            } else if (response.data.message === 'No changes made to student data or student not found and not upserted') {
                alert("ছাত্রের তথ্যে কোনো পরিবর্তন হয়নি অথবা ছাত্রটি পাওয়া যায়নি।");
            }
            else {
                alert("❌ ছাত্রের তথ্য আপডেট করা যায়নি।");
            }
        } catch (error) {
            console.error("❌ Error updating student:", error);
            alert("❌ আপডেট করতে সমস্যা হয়েছে!");
        }

    }



    return (
     <div className="py-8 px-4">
  <Container>
    <div className="mb-6">
      <StudentFilterBar
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        searchRoll={searchRoll}
        setSearchRoll={setSearchRoll}
      />
    </div>

    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">🔍 ছাত্র নির্বাচন করুন</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedStudent?._id || ""}
          onChange={(e) => {
            const student = students.find((s) => s._id === e.target.value);
            setSelectedStudent(student);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- ছাত্র নির্বাচন করুন --</option>
          {filteredStudents.map((student, index) => (
            <option key={index} value={student._id}>
              {student.name} (শ্রেণি: {student.class}||রোল: {student.roll} )
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-lg font-medium mb-3 text-gray-700">📝 ছাত্র তথ্য</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Name", key: "name" },
          { label: "Roll", key: "roll" },
          { label: "Class", key: "class", type: "select", options: ["শিশু", "প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম", "হেফজ"] },
          { label: "Session", key: "session" },
          { label: "Group", key: "group" },
          { label: "Admission Date", key: "admissionDate", type: "date" },
          { label: "Phone", key: "phone" },
          { label: "Guardian Name", key: "guardianName" },
          { label: "Address", key: "address" }
        ].map(({ label, key, type, options }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            {type === "select" ? (
              <select
                value={selectedStudent?.[key] || ""}
                onChange={(e) => setSelectedStudent((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- {label} --</option>
                {options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={type || "text"}
                value={selectedStudent?.[key] || ""}
                onChange={(e) => setSelectedStudent((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-medium mt-6 mb-3 text-gray-700">📎 ডকুমেন্ট আপলোড</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Profile Image", key: "profileImage", accept: "image/*" },
          { label: "Admission PDF", key: "admissionPdf", accept: "application/pdf" },
          { label: "Birth Certificate PDF", key: "birthCertificatePdf", accept: "application/pdf" }
        ].map(({ label, key, accept }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSelectedStudent((prev) => ({ ...prev, [key]: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectedStudent?.profileImage && (
          <div>
            <label className="block text-sm font-medium mb-1">Current Profile Image:</label>
            <img
              src={selectedStudent.profileImage}
              alt="Profile"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
        {selectedStudent?.admissionPdf && (
          <div>
            <label className="block text-sm font-medium mb-1">Admission PDF:</label>
            <a
              href={selectedStudent.admissionPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Admission PDF
            </a>
          </div>
        )}
        {selectedStudent?.birthCertificatePdf && (
          <div>
            <label className="block text-sm font-medium mb-1">Birth Certificate:</label>
            <a
              href={selectedStudent.birthCertificatePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Birth Certificate
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={handleUpdateStudent}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          ✅ তথ্য আপডেট করুন
        </button>
      </div>
    </div>
  </Container>
</div>

    );
};

export default UpdateStudentData;