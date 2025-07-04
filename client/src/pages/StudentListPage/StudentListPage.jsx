import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Container from "../../components/Shared/Container";
import StudentCard from "./components/StudentCard";
import StudentFilterBar from "./components/StudentFilterBar";
import axios from "axios";
import defaultImage from "../../assets/images/defaultImg.jpg";

const StudentListPage = () => {
const [students, setStudents] = useState([]);
const [selectedYear, setSelectedYear] = useState("");
const [selectedClass, setSelectedClass] = useState("");
const [searchRoll, setSearchRoll] = useState("");

const location = useLocation();
const isDashboard = location.pathname.startsWith("/dashboard");

useEffect(() => {
axios
.get("http://localhost:8000/students", { withCredentials: true })
.then((res) => {
setStudents(res.data);
})
.catch((err) => {
console.error("Error fetching students:", err);
});
}, []);

const filteredStudents = students.filter((student) => {
const matchYear = selectedYear ? parseInt(student.session) === parseInt(selectedYear) : true;
const matchClass = selectedClass ? student.class === selectedClass : true;
const matchRoll = searchRoll ? parseInt(student.roll) === parseInt(searchRoll) : true;
return matchYear && matchClass && matchRoll;
});

return (
<Container>
<StudentFilterBar selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedClass={selectedClass} setSelectedClass={setSelectedClass} searchRoll={searchRoll} setSearchRoll={setSearchRoll} />

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
    {filteredStudents.map((student) => (
      <StudentCard
        key={student._id}
        name={student.name}
        className={student.class}
        roll={student.roll}
        studentId={student.studentId}
        year={student.admissionDate}
        profileImage={student.profileImageUrl || defaultImage}
        detailLink={`${isDashboard ? "/dashboard" : ""}/students/${student.studentId}`}
      />
    ))}
    {filteredStudents.length === 0 && (
      <p className="text-gray-500 col-span-full text-center">
        কোনো ছাত্র পাওয়া যায়নি
      </p>
    )}
  </div>
</Container>
);
};

export default StudentListPage;
