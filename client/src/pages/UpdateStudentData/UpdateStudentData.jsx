import { useEffect, useState } from 'react';
import Container from '../../components/Shared/Container';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import StudentFilterBar from '../StudentListPage/components/StudentFilterBar';

const UpdateStudentData = () => {




    const [selectedYear, setSelectedYear] = useState(currentYear.toString());
    const [selectedClass, setSelectedClass] = useState("");
    const [searchRoll, setSearchRoll] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);



    const [students, setStudents] = useState([]);
    useEffect(() => {
        axiosSecure.get("/students")
            .then((res) => setStudents(res.data))
            .catch((err) => console.error("Error fetching students:", err));
    }, []);


    const filteredStudents = students.filter((student) => {
        const matchYear = selectedYear ? parseInt(student.session) === parseInt(selectedYear) : true;
        const matchClass = selectedClass ? student.class === selectedClass : true;
        const matchRoll = searchRoll ? parseInt(student.roll) === parseInt(searchRoll) : true;
        return matchYear && matchClass && matchRoll;
    });



    return (
        <div>
            <Container>

                <StudentFilterBar
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedClass={selectedClass}
                    setSelectedClass={setSelectedClass}
                    searchRoll={searchRoll}
                    setSearchRoll={setSearchRoll}
                />
                {
                    students.map((student) => (
                        <div key={student.studentId} className="p-4 border rounded mb-4">
                            <h2 className="text-xl font-bold">{student.name}</h2>
                            <p><strong>Class:</strong> {student.class}</p>
                            <p><strong>Roll:</strong> {student.roll}</p>
                            <p><strong>Session:</strong> {student.session}</p>
                            <p><strong>Group:</strong> {student.group}</p>
                            <p><strong>Admission Date:</strong> {new Date(student.admissionDate).toLocaleDateString()}</p>
                            <p><strong>Phone:</strong> {student.phone}</p>
                            <p><strong>Guardian Name:</strong> {student.guardianName}</p>
                            <p><strong>Address:</strong> {student.address}</p>
                        </div>
                    ))
                }
            </Container>
        </div>
    );
};

export default UpdateStudentData;