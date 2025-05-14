/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from "../../components/Shared/Container";
import AttendanceChart from "./components/AttendanceChart";
import ResultChart from "./components/ResultChart";

const StudentDetailsPage = () => {

    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [availableAttendanceYears, setAvailableAttendanceYears] = useState([]);
    const [selectedAttendanceYear, setSelectedAttendanceYear] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/students/${studentId}`)
            .then(res => {
                const studentData = res.data;
                setStudent(studentData);

                // Results
                const resultYears = Object.keys(studentData?.results || {});
                if (resultYears.length) {
                    setAvailableYears(resultYears);
                    setSelectedYear(resultYears[0]);
                }

                // Attendance
                const attendanceYears = Object.keys(studentData?.attendence || {});
                if (attendanceYears.length) {
                    setAvailableAttendanceYears(attendanceYears);
                    setSelectedAttendanceYear(attendanceYears[0]);
                }
            })
            .catch(err => console.error(err));
    }, [studentId]);

    if (!student) return <p className="text-center mt-10">লোড হচ্ছে...</p>;

    const {
        name, class: studentClass, roll, studentId: sid, session, group, admissionDate,
        profileImageUrl, guardianName, address, phone, attendence, documents, results,
    } = student;

    return (
        <Container>
            <div className=" flex flex-col p-4 md:p-6 mt-8 mx-auto bg-white rounded-xl shadow-md space-y-8">


     {/* Profile */}
                <div className="flex flex-col  items-center text-center space-y-4">
                    <img
                        src={profileImageUrl || "/default-profile.png"}
                        alt={name}
                        className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border"
                    />
                    <h1 className="text-2xl md:text-3xl font-bold">{name || "নাম দেওয়া হয়নি"}</h1>
                </div>

                {/* Basic Info */}
                <SectionTitle title="একাডেমিক তথ্য" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-800">
                    <InfoItem label="আইডি" value={sid} />
                    <InfoItem label="শ্রেণি" value={studentClass} />
                    <InfoItem label="রোল" value={roll} />

                    <InfoItem label="সেশন" value={session} />
                    <InfoItem label="গ্রুপ" value={group} />
                    <InfoItem label="ভর্তির তারিখ" value={admissionDate} />
                </div>


               
                {/* Contact Info */}
                <SectionTitle title="যোগাযোগ" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                    <InfoItem label="অভিভাবক" value={guardianName} />
                    <InfoItem label="ফোন" value={phone} />
                    <InfoItem label="ঠিকানা" value={address} />
                </div>

                {/* Attendance */}
                <SectionTitle title={`উপস্থিতি (${selectedAttendanceYear || "নির্বাচিত নয়"})`} />
                {availableAttendanceYears.length > 0 && (
                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">বছর নির্বাচন করুন:</label>
                        <select
                            value={selectedAttendanceYear}
                            onChange={(e) => setSelectedAttendanceYear(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1"
                        >
                            {availableAttendanceYears.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                )}

                {attendence?.[selectedAttendanceYear] ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(attendence[selectedAttendanceYear]).map(([month, data]) => {
                            const { presentDays, calendarDays, holidays } = data;
                            const absentDays = calendarDays - presentDays - holidays;
                            const attendancePercent = ((presentDays / calendarDays) * 100).toFixed(1);
                            return (
                                <div key={month} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-semibold capitalize text-gray-800">{month}</h3>
                                        <span className="text-xs text-gray-600">{presentDays}/{calendarDays} দিন</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-green-500 h-3 rounded-full"
                                            style={{ width: `${attendancePercent}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-xs mt-1 text-gray-500">অফিশিয়াল ছুটি: {holidays} দিন</p>
                                        <p className="text-xs mt-1 font-bengali font-extralight text-purple-900">অনুপুস্থিত: {absentDays} দিন</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyMessage message="এই বছরের জন্য উপস্থিতির তথ্য নেই" />
                )}

                {/* Documents */}
                <SectionTitle title="ডকুমেন্টস" />
                {documents?.length ? (
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {documents.map((doc, idx) => (
                            <li key={idx}>
                                {doc.name} ({doc.type}) —{" "}
                                <a
                                    className="text-blue-600 underline"
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    দেখুন
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyMessage message="ডকুমেন্ট আপলোড করা হয়নি" />
                )}

                {/* Results */}
                <SectionTitle title="ফলাফল" />
                {results && typeof results === "object" ? (
                    <>
                        <div className="mb-4 grid gap-2 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">বছর নির্বাচন করুন:</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => {
                                        setSelectedYear(e.target.value);
                                        setSelectedTerm("");
                                    }}
                                    className="border border-gray-300 rounded px-3 py-1"
                                >
                                    {availableYears.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedYear && results[selectedYear] && (
                                <div>
                                    <label className="block mb-1 font-medium text-gray-700">পরীক্ষা নির্বাচন করুন:</label>
                                    <select
                                        value={selectedTerm}
                                        onChange={(e) => setSelectedTerm(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1"
                                    >
                                        <option value="">সকল পরীক্ষা</option>
                                        {Object.keys(results[selectedYear]).map((term) => (
                                            <option key={term} value={term}>{term}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={() => window.print()}
                                className="mt-3 sm:mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                প্রিন্ট বা PDF
                            </button>
                        </div>

                        {selectedYear && results[selectedYear] ? (
                            Object.entries(results[selectedYear])
                                .filter(([term]) => !selectedTerm || term === selectedTerm)
                                .map(([termName, subjects], index) => {
                                    const subjectEntries = Object.entries(subjects);
                                    const total = subjectEntries.reduce((sum, [, mark]) => sum + Number(mark || 0), 0);
                                    const avg = subjectEntries.length ? total / subjectEntries.length : 0;

                                    const getGrade = (gpa) => {
                                        if (gpa >= 80) return "A+";
                                        if (gpa >= 70) return "A";
                                        if (gpa >= 60) return "A-";
                                        if (gpa >= 50) return "B";
                                        if (gpa >= 40) return "C";
                                        if (gpa >= 33) return "D";
                                        return "F";
                                    };

                                    return (
                                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 overflow-x-auto">
                                            <h3 className="text-lg font-bold mb-2">{termName}</h3>
                                            <table className="min-w-full table-auto text-sm text-left text-gray-700">
                                                <thead>
                                                    <tr className="bg-blue-100">
                                                        <th className="py-2 px-4 border">বিষয়</th>
                                                        <th className="py-2 px-4 border text-center">প্রাপ্ত নম্বর</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subjectEntries.map(([subject, marks], idx) => {
                                                        const numericMark = Number(marks);
                                                        const isFail = numericMark < 33;
                                                        return (
                                                            <tr key={idx} className={isFail ? "bg-red-100 text-red-700 font-bold" : ""}>
                                                                <td className="py-2 px-4 border">{subject}</td>
                                                                <td className="py-2 px-4 border text-center">{marks}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                    <tr className="bg-blue-50 font-semibold">
                                                        <td className="py-2 px-4 border">মোট নম্বর</td>
                                                        <td className="py-2 px-4 border text-center">{total}</td>
                                                    </tr>
                                                    <tr className="bg-blue-100 font-semibold">
                                                        <td className="py-2 px-4 border">গড় নম্বর</td>
                                                        <td className="py-2 px-4 border text-center">{avg.toFixed(1)} ({getGrade(avg)})</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })
                        ) : (
                            <EmptyMessage message="এই বছরের কোনো ফলাফল নেই" />
                        )}
                    </>
                ) : (
                    <EmptyMessage message="ফলাফল আপলোড করা হয়নি" />
                )}

                {/* Analytics */}
                <SectionTitle title="বিশ্লেষণ" />
                <div className="space-y-6 flex flex-col">
                    {selectedAttendanceYear && attendence?.[selectedAttendanceYear] ? (
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mb-2">উপস্থিতির গ্রাফ ({selectedAttendanceYear})</h3>
                            <AttendanceChart attendanceData={attendence[selectedAttendanceYear]} />
                        </div>
                    ) : (
                        <div className="w-full">
                            <EmptyMessage message="উপস্থিতির বিশ্লেষণ পাওয়া যায়নি" />
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row">
                        {selectedYear && results?.[selectedYear] ? (
                            Object.entries(results[selectedYear]).map(([termName, resultData], index) => (
                                <div key={index} className="flex-1 bg-white border border-gray-200 rounded-lg p-2 mb-2 shadow-sm">
                                    <h3 className="text-lg font-semibold mb-2">{termName}</h3>
                                    <ResultChart resultData={resultData} />
                                </div>
                            ))
                        ) : (
                            <div className="w-full">
                                <EmptyMessage message="ফলাফলের বিশ্লেষণ পাওয়া যায়নি" />
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </Container>
    );
};

export default StudentDetailsPage;

const InfoItem = ({ label, value }) => (
    <div className=" flex space-x-1 text-lg">
        <p className="font-semibold text-gray-700">{label}</p>:
        <p>{value || "তথ্য নেই"}</p>
    </div>
);

const SectionTitle = ({ title }) => (
    <h2 className="text-xl font-bold border-b border-gray-200 pb-2 text-gray-800 mt-8">{title}</h2>
);

const EmptyMessage = ({ message }) => (
    <p className="text-gray-500 italic py-4 text-center">{message}</p>
);
