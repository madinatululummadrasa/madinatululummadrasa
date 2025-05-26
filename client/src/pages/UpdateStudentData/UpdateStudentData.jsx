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



    const [students, setStudents] = useState([]);
    useEffect(() => {
        AxiosSecure.get("/students")
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

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        {filteredStudents.map((student, index) => (
                            <option key={index} value={student._id}>
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
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />

                <input
                    type="text"
                    placeholder="Roll"
                    value={selectedStudent?.roll || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, roll: e.target.value }))}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                

                <select
                    placeholder="Class"
                    value={selectedStudent?.class || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, class: e.target.value }))}
                   className="input input-bordered w-1/3 mb-4 p-2 border rounded">
                    <option value="">ক্লাস নির্বাচন করুন</option>
                    <option value="শিশু">শিশু</option>
                    <option value="প্রথম"> প্রথম</option>
                    <option value="দ্বিতীয়"> দ্বিতীয়</option>
                    <option value="তৃতীয়"> তৃতীয় </option>
                    <option value="চতুর্থ"> চতুর্থ </option>
                    <option value="পঞ্চম"> পঞ্চম</option>
                    <option value="হেফজ"> হেফজ</option>
                </select>



                <input
                    type="text"
                    placeholder="Session"
                    value={selectedStudent?.session || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, session: e.target.value }))}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Group"
                    value={selectedStudent?.group || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, group: e.target.value }))}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <input
                    type="date"
                    placeholder="Admission Date"
                    value={selectedStudent?.admissionDate || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, admissionDate: e.target.value }))}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={selectedStudent?.phone || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, phone: e.target.value }))}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Guardian Name"
                    value={selectedStudent?.guardianName || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, guardianName: e.target.value }))}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={selectedStudent?.address || ""}
                    onChange={(e) => setSelectedStudent((prev) => ({ ...prev, address: e.target.value }))}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
               <h2>Image</h2>
                <input
                    type="file"
                    accept="image/*"
                    placeholder='fgjh'
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setSelectedStudent((prev) => ({ ...prev, profileImage: reader.result }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <h1>Admission Pdf</h1>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setSelectedStudent((prev) => ({ ...prev, admissionPdf: reader.result }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <h1>Birth Certificate</h1>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setSelectedStudent((prev) => ({ ...prev, birthCertificatePdf: reader.result }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="input input-bordered w-1/3 mb-4 p-2 border rounded"
                />
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Profile Image:</label>
                    {selectedStudent?.profileImage && (
                        <img
                            src={selectedStudent.profileImage}
                            alt="Profile"
                            className="w-32 h-32 object-cover rounded mb-2"
                        />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Admission PDF:</label>
                    {selectedStudent?.admissionPdf && (
                        <a
                            href={selectedStudent.admissionPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            View Admission PDF
                        </a>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Birth Certificate PDF:</label>
                    {selectedStudent?.birthCertificatePdf && (
                        <a
                            href={selectedStudent.birthCertificatePdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            View Birth Certificate PDF
                        </a>
                    )}
                </div>



                <button onClick={() => handleUpdateStudent()}>Update</button>
            </Container>
        </div>
    );
};

export default UpdateStudentData;