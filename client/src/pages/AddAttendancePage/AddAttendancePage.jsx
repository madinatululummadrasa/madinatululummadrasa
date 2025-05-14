/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import StudentFilterBar from "../StudentListPage/components/StudentFilterBar";

const months = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

const AddAttendancePage = () => {
  const AxiosSecure = useAxiosSecure();
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchRoll, setSearchRoll] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getDaysInMonth = (monthIndex, year) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const generateEmptyData = (targetYear = year) =>
    months.reduce((acc, month, index) => {
      acc[month] = {
        presentDays: "",
        calendarDays: getDaysInMonth(index, targetYear),
        holidays: "",
        error: false
      };
      return acc;
    }, {});

  const [attendanceData, setAttendanceData] = useState(generateEmptyData());

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

  useEffect(() => {
    if (!selectedStudent) return;

    const fetchAttendance = async () => {
      try {
        const res = await AxiosSecure.get(`/students/${selectedStudent.studentId}`);
        const existingData = res.data?.attendence?.[year];

        if (existingData) {
          const filledData = generateEmptyData(year);
          for (const month of months) {
            if (existingData[month]) {
              filledData[month] = {
                ...filledData[month],
                presentDays: existingData[month].presentDays || "",
                calendarDays: getDaysInMonth(months.indexOf(month), year),
                holidays: existingData[month].holidays || "",
                error: false,
              };
            }
          }
          setAttendanceData(filledData);
        } else {
          setAttendanceData(generateEmptyData(year));
        }
      } catch (err) {
        console.error("Failed to fetch student attendance:", err);
      }
    };

    fetchAttendance();
  }, [selectedStudent, year]);

  const validateMonth = (data) => {
    const present = parseInt(data.presentDays) || 0;
    const calendar = parseInt(data.calendarDays) || 0;
    const holidays = parseInt(data.holidays) || 0;
    return present <= calendar && present + holidays <= calendar;
  };

  const handleChange = (month, field, value) => {
    setAttendanceData((prev) => {
      const updatedMonth = {
        ...prev[month],
        [field]: value
      };
      updatedMonth.error = !validateMonth(updatedMonth);
      return {
        ...prev,
        [month]: updatedMonth
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("⚠️ একজন ছাত্র নির্বাচন করুন");

    const hasErrors = Object.values(attendanceData).some((month) => month.error);
    if (hasErrors) return alert("❌ কিছু ইনপুট ভুল রয়েছে। অনুগ্রহ করে সংশোধন করুন।");

    try {
      const res = await AxiosSecure.patch(`/students/attendance/${selectedStudent.studentId}`, {
        year,
        attendanceData,
      });

      if (res.data.modifiedCount || res.data.acknowledged) {
        alert("✅ হাজিরার তথ্য সংরক্ষিত হয়েছে!");
      } else {
        alert("❌ সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Error submitting attendance:", err);
      alert("❌ কিছু সমস্যা হয়েছে!");
    }
  };

  // Update calendarDays if year changes
  useEffect(() => {
    setAttendanceData((prev) => {
      const updated = {};
      for (const month of months) {
        const index = months.indexOf(month);
        const prevMonth = prev[month] || {};
        updated[month] = {
          ...prevMonth,
          calendarDays: getDaysInMonth(index, year),
        };
      }
      return updated;
    });
  }, [year]);

  const yearOptions = Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i);

  const handleYearNav = (direction) => {
    const newYear = year + direction;
    setYear(newYear);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-4">হাজিরা যুক্ত করুন</h2>

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

      {selectedStudent && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleYearNav(-1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ←
              </button>

              <label htmlFor="year" className="font-medium">সাল:</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="border rounded px-3 py-1"
              >
                {yearOptions.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleYearNav(1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {months.map((month) => {
              const data = attendanceData[month];
              const inputClass = (field) =>
                `input input-bordered w-full mb-2 ${data.error ? "border-red-500" : ""}`;

              return (
                <div key={month} className="border rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold capitalize mb-2">{month}</h3>
                  <input
                    type="number"
                    placeholder="Present Days"
                    value={data.presentDays}
                    onChange={(e) => handleChange(month, "presentDays", e.target.value)}
                    className={inputClass("presentDays")}
                  />
                  <input
                    type="number"
                    placeholder="Calendar Days"
                    value={data.calendarDays}
                    readOnly
                    className="input input-bordered w-full mb-2 bg-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Holidays"
                    value={data.holidays}
                    onChange={(e) => handleChange(month, "holidays", e.target.value)}
                    className={inputClass("holidays")}
                  />
                  {data.error && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ Present + Holiday must not exceed Calendar Days
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddAttendancePage;
