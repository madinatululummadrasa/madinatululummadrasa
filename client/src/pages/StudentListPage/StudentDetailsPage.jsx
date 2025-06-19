/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// Assuming this Container is a simple wrapper or you can replace it with a div

import AttendanceChart from "./components/AttendanceChart";
import ResultChart from "./components/ResultChart";
import defaultImage from "../../assets/images/defaultImg.jpg"; // Default image for profile
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
                // Ensure results is an object before Object.keys
                const resultYears = studentData?.results && typeof studentData.results === 'object'
                    ? Object.keys(studentData.results).sort((a, b) => b - a) // Sort years descending
                    : [];
                if (resultYears.length) {
                    setAvailableYears(resultYears);
                    setSelectedYear(resultYears[0]); // Select the most recent year
                }

                // Attendance
                // Ensure attendence is an object before Object.keys
                const attendanceYears = studentData?.attendence && typeof studentData.attendence === 'object'
                    ? Object.keys(studentData.attendence).sort((a, b) => b - a) // Sort years descending
                    : [];
                if (attendanceYears.length) {
                    setAvailableAttendanceYears(attendanceYears);
                    setSelectedAttendanceYear(attendanceYears[0]); // Select the most recent year
                }
            })
            .catch(err => console.error(err));
    }, [studentId]);

    if (!student) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-lg font-medium text-gray-700 animate-pulse">লোড হচ্ছে...</p>
            </div>
        );
    }

    const {
        name, class: studentClass, roll, studentId: sid, session, group, admissionDate,
        profileImageUrl, guardianName, FathersName, mothersName, address, phone, attendence, documents, results,
    } = student;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Using a simple div instead of Container for full Tailwind control */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl">
                {/* Header Section: Profile Image & Name */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-white flex flex-col items-center justify-center text-center">
                    <div className="relative border-4 border-white rounded-full p-1 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
                        <img
                            src={profileImageUrl || defaultImage}
                            alt={name || "Student"}
                            className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-full"
                        />
                    </div>
                    <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {name || "নাম দেওয়া হয়নি"}
                    </h1>
                   <div className="flex  items-center gap-6  ">
                     <p className="text-blue-200  text-lg sm:text-xl mt-2">আইডি : {sid}</p>
                    <p className="text-blue-200 text-lg sm:text-xl mt-2">শ্রেণি: {studentClass}</p>
                    <p className="text-blue-200 text-lg sm:text-xl mt-2">রোল: {roll}</p>
                   </div>
                </div>

                {/* Main Content Area */}
                <div className="p-6 sm:p-8 lg:p-10 space-y-10">

                    {/* Academic Info */}
                    <SectionTitle title="একাডেমিক তথ্য" icon="📚" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-800">
                    
                        <InfoItemRow label="সেশন" value={session} />
                        <InfoItemRow label="গ্রুপ" value={group} />
                        <InfoItemRow label="ভর্তির তারিখ" value={admissionDate} />
                    </div>

                    {/* Contact Info */}
                    <SectionTitle title="যোগাযোগ" icon="📞" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">

                        <InfoItem label="পিতার নাম" value={FathersName} />
                        <InfoItem label="মাতার নাম" value={mothersName} />
                        <InfoItem label="অভিভাবক" value={guardianName} />
                        <InfoItem label="অভিভাবকের ফোন নম্বর" value={phone} />

                    </div>
                    <InfoItem label="ঠিকানা" value={address} />
                    {/* Attendance Section */}
                    <SectionTitle title="উপস্থিতি" icon="🗓️" />
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                        {availableAttendanceYears.length > 0 && (
                            <div className="mb-6">
                                <label htmlFor="attendance-year-select" className="block text-sm font-medium text-gray-700 mb-2">
                                    বছর নির্বাচন করুন:
                                </label>
                                <select
                                    id="attendance-year-select"
                                    value={selectedAttendanceYear}
                                    onChange={(e) => setSelectedAttendanceYear(e.target.value)}
                                    className="mt-1 block w-full sm:w-1/2 md:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out"
                                >
                                    {availableAttendanceYears.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {attendence?.[selectedAttendanceYear] ? (
                            <>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    {selectedAttendanceYear} সালের উপস্থিতি
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {Object.entries(attendence[selectedAttendanceYear]).map(([month, data]) => {
                                        const { presentDays, calendarDays, holidays } = data;
                                        const absentDays = calendarDays - presentDays - holidays;
                                        const attendancePercent = calendarDays > 0 ? ((presentDays / calendarDays) * 100).toFixed(1) : 0;
                                        return (
                                            <div key={month} className="p-5 bg-white rounded-xl border border-gray-200 shadow-md transform hover:scale-[1.02] transition-transform duration-200 ease-in-out">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="text-base font-semibold capitalize text-gray-900">{month}</h4>
                                                    <span className="text-sm font-medium text-blue-600">{attendancePercent}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-green-500 h-2.5 rounded-full"
                                                        style={{ width: `${attendancePercent}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs mt-2 text-gray-600">
                                                    <span>উপস্থিত: {presentDays} দিন</span>
                                                    <span>ছুটি: {holidays} দিন</span>
                                                </div>
                                                <p className="text-xs text-right mt-1 font-semibold text-red-500">অনুপস্থিত: {absentDays} দিন</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">উপস্থিতির গ্রাফ ({selectedAttendanceYear})</h3>
                                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                        <AttendanceChart attendanceData={attendence[selectedAttendanceYear]} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <EmptyMessage message="এই বছরের জন্য উপস্থিতির তথ্য নেই" />
                        )}
                    </div>


                    {/* Documents Section */}
                    <SectionTitle title="ডকুমেন্টস" icon="📄" />
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                        {documents?.length ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {documents.map((doc, idx) => (
                                    <a
                                        key={idx}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition duration-200 ease-in-out transform hover:scale-[1.02]"
                                    >
                                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0118 8.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2h2v2H6V6zm5 0h2v2h-2V6z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-800 font-medium">{doc.name} ({doc.type?.toUpperCase()})</span>
                                        <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <EmptyMessage message="কোনো ডকুমেন্ট আপলোড করা হয়নি" />
                        )}
                    </div>

                    {/* Results Section */}
                    <SectionTitle title="ফলাফল" icon="📊" />
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                        {results && typeof results === "object" && Object.keys(results).length > 0 ? (
                            <>
                                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                                    <div>
                                        <label htmlFor="result-year-select" className="block text-sm font-medium text-gray-700 mb-2">
                                            বছর নির্বাচন করুন:
                                        </label>
                                        <select
                                            id="result-year-select"
                                            value={selectedYear}
                                            onChange={(e) => {
                                                setSelectedYear(e.target.value);
                                                setSelectedTerm(""); // Reset term when year changes
                                            }}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out"
                                        >
                                            {availableYears.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedYear && results[selectedYear] && Object.keys(results[selectedYear]).length > 0 && (
                                        <div>
                                            <label htmlFor="result-term-select" className="block text-sm font-medium text-gray-700 mb-2">
                                                পরীক্ষা নির্বাচন করুন:
                                            </label>
                                            <select
                                                id="result-term-select"
                                                value={selectedTerm}
                                                onChange={(e) => setSelectedTerm(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out"
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
                                        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 mt-4 sm:mt-0"
                                    >
                                        <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m0 0v1a2 2 0 002 2h4a2 2 0 002-2v-1m-4-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v4h8V9z"></path></svg>
                                        প্রিন্ট বা PDF
                                    </button>
                                </div>

                                {selectedYear && results[selectedYear] && Object.keys(results[selectedYear]).length > 0 ? (
                                    Object.entries(results[selectedYear])
                                        .filter(([term]) => !selectedTerm || term === selectedTerm)
                                        .map(([termName, resultData], index) => {
                                            // Ensure resultData is an object for subjects
                                            const subjects = typeof resultData === 'object' && resultData !== null
                                                ? resultData
                                                : {};
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
                                                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 shadow-md transition-all duration-200 ease-in-out hover:shadow-lg">
                                                    <h3 className="text-xl font-bold text-blue-800 mb-4">{termName}</h3>
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full table-auto text-sm text-left text-gray-700 border-collapse">
                                                            <thead>
                                                                <tr className="bg-blue-100 border-b border-blue-200">
                                                                    <th className="py-3 px-4 border-r border-blue-200 font-semibold text-blue-700">বিষয়</th>
                                                                    <th className="py-3 px-4 text-center font-semibold text-blue-700">প্রাপ্ত নম্বর</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {subjectEntries.map(([subject, marks], idx) => {
                                                                    const numericMark = Number(marks);
                                                                    const isFail = numericMark < 33;
                                                                    return (
                                                                        <tr key={idx} className={`border-b border-gray-200 ${isFail ? "bg-red-100 text-red-700 font-bold" : "even:bg-gray-50 hover:bg-gray-100"}`}>
                                                                            <td className="py-3 px-4 border-r border-gray-200">{subject}</td>
                                                                            <td className="py-3 px-4 text-center">{marks}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                                <tr className="bg-blue-50 font-semibold border-t border-blue-200">
                                                                    <td className="py-3 px-4 border-r border-blue-200 text-blue-800">মোট নম্বর</td>
                                                                    <td className="py-3 px-4 text-center text-blue-800">{total}</td>
                                                                </tr>
                                                                <tr className="bg-blue-100 font-extrabold text-lg">
                                                                    <td className="py-3 px-4 border-r border-blue-200 text-blue-800">গড় নম্বর</td>
                                                                    <td className="py-3 px-4 text-center text-blue-800">{avg.toFixed(1)} ({getGrade(avg)})</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="mt-8">
                                                        <h4 className="text-lg font-semibold mb-2 text-gray-800">ফলাফলের গ্রাফ ({termName})</h4>
                                                        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                                            <ResultChart resultData={resultData} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <EmptyMessage message="এই বছরের জন্য কোনো ফলাফল নেই" />
                                )}
                            </>
                        ) : (
                            <EmptyMessage message="ফলাফল আপলোড করা হয়নি" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsPage;

// Helper components for better readability and reusability
const InfoItem = ({ label, value }) => (
    <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100 flex flex-col items-center text-center transition-transform duration-200 ease-in-out hover:scale-105">
        <p className="font-semibold text-blue-700 text-sm mb-1">{label}</p>
        <p className="text-gray-800 text-lg font-medium">{value || "তথ্য নেই"}</p>
    </div>
);
const InfoItemRow = ({ label, value }) => (
    <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100 flex flex-row items-center gap-2 justify-center text-center transition-transform duration-200 ease-in-out hover:scale-105">
        <p className="font-semibold text-blue-700 text-lg ">{label}:-</p>
        <p className="text-gray-800 text-lg font-medium">{value || "তথ্য নেই"}</p>
    </div>
);

const SectionTitle = ({ title, icon }) => (
    <div className="flex items-center space-x-3 pb-3 border-b-2 border-indigo-200">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
);

const EmptyMessage = ({ message }) => (
    <div className="text-center py-8">
        <p className="text-gray-500 italic text-lg">{message}</p>
        <svg className="mx-auto mt-4 w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10"></path></svg>
    </div>
);  