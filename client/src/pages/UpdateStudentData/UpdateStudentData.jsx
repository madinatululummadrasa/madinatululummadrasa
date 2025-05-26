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


    const handleUpdateStudent = async () => {
        if (!selectedStudent) {
            alert("দয়া করে একটি ছাত্র নির্বাচন করুন।");
            return;
        }
        try {


            const response = await axiosSecure.put(`/students/${selectedStudent._id}`, selectedStudent);
            if (response.data.modifiedCount > 0) {
                alert("✅ ছাত্রের তথ্য সফলভাবে আপডেট হয়েছে!");
                setSelectedStudent(null); // Clear selection after update
            } else {
                alert("❌ ছাত্রের তথ্য আপডেট করা যায়নি।");
            }
        } catch (error) {
            console.error("❌ Error updating student:", error);
            alert("❌ আপডেট করতে সমস্যা হয়েছে!");
        }

    }
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

                <input
                    type="text"
                    placeholder="Roll"
                    value={selectedStudent?.roll || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, roll: e.target.value }))}
                    className="input input-bordered w-full mb-4 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={selectedStudent?.class || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, class: e.target.value }))}
                    className="input input-bordered w-full mb-4 p-2 border rounded"
                />

                <button onClick={() => handleUpdateStudent}>Update</button>
            </Container>
        </div>
    );
};

export default UpdateStudentData;