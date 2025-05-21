import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFilteredResults } from '../../hooks/useFilteredResults';
import UpdateRoll from '../../components/studentRollUpdate/UpdateRoll';
import SendresultDB from './components/SendresultDB';




const ClassResultPage = () => {

  const [students, setStudents] = useState([]);

  // const [filteredResults, setFilteredResults] = useState([]);
  const { filteredResults, setFilteredResults } = useFilteredResults();
  console.log("the filtered results", filteredResults)

  const resultData = filteredResults.map(student => {
    const result = {};

    student.subjects.forEach(([subjectName, mark]) => {
      result[subjectName] = mark.toString(); // Convert mark to string if needed
    });

    return {
      studentId: student.studentId,
      name: student.name,            // Student's name
      oldRoll: student.originalRoll, // Original roll number
      newRoll: student.newRoll,      // New roll number after ranking
      result: result                 // Subject-wise marks
    };
  });



  const [selectedClass, setSelectedClass] = useState('');

  const [selectedSession, setSelectedSession] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  console.log("the selected year", selectedYear)
  console.log("the selected exam", selectedExam)

  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);

  const navigate = useNavigate();




  useEffect(() => {
    axios.get('http://localhost:8000/debug-students')
      .then(res => {
        const allStudents = res.data;
        setStudents(allStudents);

        const classNames = [...new Set(allStudents.map(s => s.class))];
        const sessions = [...new Set(allStudents.map(s => s.session))];

        const resultYears = new Set();
        const examNames = new Set();

        allStudents.forEach(student => {
          const results = student.results || {};
          Object.keys(results).forEach(year => {
            resultYears.add(year);
            Object.keys(results[year] || {}).forEach(exam => {
              examNames.add(exam);
            });
          });
        });

        const yearArray = Array.from(resultYears).sort();
        const examArray = Array.from(examNames).sort();

        setAvailableClasses(classNames);
        setAvailableSessions(sessions);
        setAvailableYears(yearArray);
        setAvailableExams(examArray);

        setSelectedClass(classNames[0] || '');
        setSelectedSession(sessions[0] || '');
        setSelectedYear(yearArray[0] || '');
        setSelectedExam(examArray[0] || '');
      })
      .catch(err => console.error('Error fetching students:', err));
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      student => student.class === selectedClass && student.session === selectedSession
    );
    console.log("the  ", filtered)

    const resultsWithTotal = filtered.map(student => {
      const resultData = student.results?.[selectedYear]?.[selectedExam];
      if (!resultData) return null;

      const subjects = Object.entries(resultData);
      const total = subjects.reduce((sum, [, mark]) => sum + parseFloat(mark || 0), 0);

      return {
        studentId: student.studentId,
        name: student.name,
        originalRoll: student.roll,
        subjects,
        total,
      };
    }).filter(Boolean);

    resultsWithTotal.sort((a, b) => b.total - a.total);



    const rankedResults = resultsWithTotal.map((student, index) => ({
      ...student,
      newRoll: index + 1,
    }));

    setFilteredResults(rankedResults);
  }, [students, selectedClass, selectedSession, selectedExam, selectedYear]);

  // // Print selected class result 
  //  const handlePrint = useReactToPrint({
  //     content: () => printRef.current,
  //     documentTitle: 'Class-Result',
  //     onAfterPrint: () => console.log('Print success'),
  //   });

  const oldRolls = filteredResults.map(student => student.roll);

  const name = filteredResults.map(student => student.name);

  const newData = {
    name: name,
    oldRolls: oldRolls,
  }
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">ক্লাস ভিত্তিক ফলাফল for admins only</h1>
      <UpdateRoll></UpdateRoll>
      <SendresultDB filteredResults={resultData} selectedExam={selectedExam} selectedYear={selectedYear}></SendresultDB>
      {/* <ResultPdfGenerator filteredResults={filteredResults}
        subjects={filteredResults[0]?.subjects.map(([subject]) => subject)}
        selectedClass={selectedClass}
        selectedExam={selectedExam}
        selectedYear={selectedYear}
      ></ResultPdfGenerator> */}
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="p-2 border rounded w-full">
          {availableClasses.map((className, index) => (
            <option key={index + 1} value={className}>ক্লাস {className}</option>
          ))}
        </select>

        <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)} className="p-2 border rounded w-full">
          {availableSessions.map(session => (
            <option key={session} value={session}>সেশন {session}</option>
          ))}
        </select>

        <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="p-2 border rounded w-full">
          {availableExams.map(exam => (
            <option key={exam} value={exam}>{exam}</option>
          ))}
        </select>

        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="p-2 border rounded w-full">
          {availableYears.map(year => (
            <option key={year} value={year}>বছর {year}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table View */}
      {/* Print Button */}

      <div className="  print-section overflow-x-auto">
        <div className='text-center mb-10'>
          <h1 className='text-4xl '>মাদিনাতুল উলুম মাদরাসা </h1>
          <p>রতনপুর, রামগঞ্জ, লক্ষ্মীপুর </p>
          <p className='text-xl'>{selectedExam} পরীক্ষার  ফলাফল </p>
          <p>শ্রেণি: {selectedClass},  <span>সেশন: {selectedSession}</span></p>
          <p></p>

        </div>
        <table id="resultTable" className="w-full table-auto border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">পুরাতন রোল</th>
              <th className="border p-2">নাম</th>
              {filteredResults[0]?.subjects.map(([subject]) => (
                <th key={subject} className="border p-2">{subject}</th>
              ))}
              <th className="border p-2">মোট নম্বর</th>
              <th className="border p-2">নতুন রোল</th>
              <th className="no-print border p-2">বিস্তারিত</th>
            </tr>
          </thead>
          <tbody>

            {filteredResults.map((student, index) => (


              <tr key={student.studentId} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{student.originalRoll}</td>
                <td className="border p-2">{student.name}</td>
                {student.subjects.map(([subject, mark]) => (
                  <td key={subject} className="border p-2 text-center">{mark}</td>
                ))}
                <td className="border p-2 text-center font-bold">{student.total}</td>
                <td className="border p-2 text-center font-semibold">{student.newRoll}</td>
                <td className="no-print border p-2 text-center">
                  <button
                    onClick={() => navigate(`/students/${student.studentId}`)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    বিস্তারিত দেখুন
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredResults.map(student => (
          <div key={student.studentId} className="border rounded shadow p-4 bg-white">
            <div className="mb-1"><span className="font-semibold">পুরাতন রোল:</span> {student.roll}</div>
            <div className="mb-1"><span className="font-semibold">নাম:</span> {student.name}</div>
            <div className="mb-2">
              <span className="font-semibold">বিষয়সমূহ:</span>
              <ul className="ml-4 list-disc">
                {student.subjects.map(([subject, mark]) => (
                  <li key={subject}><span className="font-medium">{subject}:</span> {mark}</li>
                ))}
              </ul>
            </div>
            <div id='print-section' className="mb-1"><span className="font-semibold">মোট:</span> {student.total}</div>
            <div className="mb-1"><span className="font-semibold">নতুন রোল:</span> {student.newRoll}</div>
            <button
              onClick={() => navigate(`/students/${student.studentId}`)}
              className="text-blue-600 hover:underline font-medium mt-2 block"
            >
              বিস্তারিত দেখুন
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassResultPage;
