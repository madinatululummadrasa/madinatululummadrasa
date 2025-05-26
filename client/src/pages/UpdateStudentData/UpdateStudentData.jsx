import { useEffect, useState } from 'react';
import Container from '../../components/Shared/Container';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import StudentFilterBar from '../StudentListPage/components/StudentFilterBar';

const UpdateStudentData = () => {



    const currentYear = new Date().getFullYear();

    const [year, setYear] = useState(currentYear);
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

                <div className="mb-6">
                    <label className="block mb-2 font-medium">একজন ছাত্র নির্বাচন করুন:</label>
                    <select
                        value={selectedStudent?._id || ""}
                        onChange={(e) => {
                            const student = students.find((s) => s._id === e.target.value);
                            setSelectedStudent(student);
                        }}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">-- ছাত্র নির্বাচন করুন --</option>
                        {filteredStudents.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.name} (রোল: {student.roll}, ক্লাস: {student.class})
                            </option>
                        ))}
                    </select>
                </div>
               <input
                    type="text"
                    placeholder="Name"
                    value={selectedStudent?.name || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, name: e.target.value }))}
                    className="input input-bordered w-full mb-4 p-2 border rounded"
                  />

            </Container>
        </div>
    );
};

export default UpdateStudentData;