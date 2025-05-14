import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import StudentFilterBar from "../StudentListPage/components/StudentFilterBar";

// Dynamic subject list based on exam type (English keys used for saving)
// const subjectByExam = {
//   Midterm: ["Bangla", "English", "Math", "Science", "Religion"],
//   Final: ["Bangla", "English", "Math", "ICT", "Social Science"],
//   "Class Test": ["Bangla", "English"],
//   Assessment: ["Math", "Science", "English"],
// };

const classSubjectMap = {
  sishu: ["বাংলা", "ইংরেজি", "গণিত"],
  one: ["বাংলা", "ইংরেজি", "গণিত", "হাদিস-কালিমা", "আদিয়ায়ে-সালাহ", "কুরআন-মাজিদ"],
  two: ["বাংলা", "ইংরেজি", "গণিত", "ইসলাম শিক্ষা", "আরবি", "বিজ্ঞান"],
  // Add more classes as needed
};

  
const subjectByExam = {
 
  "প্রথম সাময়িক": ["বাংলা", "ইংরেজি", "গণিত", "হাদিস-কালিমা", "আদিয়ায়ে-সালাহ","কুরআন-মাজিদ"  ],

  "দ্বিতীয় সাময়িক": ["বাংলা", "ইংরেজি", "গণিত", "হাদিস-কালিমা", "আদিয়ায়ে-সালাহ","কুরআন-মাজিদ"  ],

  "বার্ষিক পরিক্ষা ": ["বাংলা", "ইংরেজি", "গণিত", "হাদিস-কালিমা", "আদিয়ায়ে-সালাহ","কুরআন-মাজিদ"  ],
  
}; 
// Bengali labels for UI display
const subjectLabels = {
  Bangla: "বাংলা",
  English: "ইংরেজি",
  Math: "গণিত",
  Science: "বিজ্ঞান",
  Religion: "ধর্ম",
  ICT: "তথ্য প্রযুক্তি",
  "Social Science": "সামাজিক বিজ্ঞান",
};

const examOptions = Object.keys(subjectByExam);

const AddResultPage = () => {
  const AxiosSecure = useAxiosSecure();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [year, setYear] = useState("2025");
  const [exam, setExam] = useState("1st Terminal");
  const [marks, setMarks] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  
  const [searchRoll, setSearchRoll] = useState("");

  const subjects = subjectByExam[exam] || [];


  useEffect(() => {
    AxiosSecure.get("/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) => {
      const matchClass = selectedClass ? student.class == selectedClass : true;
      const matchRoll = searchRoll ? student.roll == searchRoll : true;
      return matchClass && matchRoll;
    });
    setFilteredStudents(filtered);
  }, [students, selectedClass, searchRoll]);

  const handleMarkChange = (subject, value) => {
    setMarks((prev) => ({
      ...prev,
      [subject]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("⚠️ একজন ছাত্র নির্বাচন করুন");

    try {
      const res = await AxiosSecure.patch(`/students/result/${selectedStudent.studentId}`, {
        year,
        exam,
        marks,
      });

      if (res.data.modifiedCount || res.data.acknowledged) {
        alert("✅ ফলাফল সংরক্ষিত হয়েছে!");
        setMarks({});
      } else {
        alert("❌ সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Error submitting result:", err);
      alert("❌ কিছু সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">ফলাফল যুক্ত করুন</h2>

      {/* Filter Bar */}
      <StudentFilterBar
        selectedYear={year}
        setSelectedYear={setYear}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        searchRoll={searchRoll}
        setSearchRoll={setSearchRoll}
      />

      {/* Selection Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedStudent?._id || ""}
          onChange={(e) => {
            const student = filteredStudents.find((s) => s._id === e.target.value);
            setSelectedStudent(student);
          }}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">-- ছাত্র নির্বাচন করুন --</option>
          {filteredStudents.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} (রোল: {student.roll}, ক্লাস: {student.class})
            </option>
          ))}
        </select>

        <select
          value={exam}
          onChange={(e) => {
            setExam(e.target.value);
            setMarks({}); // reset marks when exam type changes
          }}
          className="border px-3 py-2 rounded w-full"
        >
          {examOptions.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </select>
      </div>

      {/* Marks Entry Table */}
      {selectedStudent && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">বিষয়</th>
                  <th className="p-2 border">নম্বর</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject}>
                    <td className="p-2 border font-medium">
                      {subjectLabels[subject] || subject}
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        placeholder="০"
                        value={marks[subject] || ""}
                        onChange={(e) => handleMarkChange(subject, e.target.value)}
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              ফলাফল সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddResultPage;








