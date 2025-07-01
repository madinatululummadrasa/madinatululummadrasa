/* eslint-disable react/prop-types */


const StudentFeeCard = ({ data }) => {
  const headers = [
    "ছাত্রের নাম", "মাস", "মাসিক ফি", "ইউনিফর্ম", "পরীক্ষা ফি", "বই", "খাতা", "জরিমানা", "বকেয়া", "জমা", "ধন্যবাদ নাম", "মন্তব্য"
  ];

  return (
    <div className="overflow-auto rounded-lg border border-green-600 p-4 shadow-md bg-white">
      <table className="min-w-full table-auto text-sm text-center">
        <thead className="bg-green-700 text-white sticky top-0 z-10">
          <tr>
            {headers.map((head, index) => (
              <th key={index} className="border px-3 py-2 whitespace-nowrap">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((student, idx) => (
            <tr
              key={idx}
              className="hover:bg-green-50 even:bg-green-100 text-sm text-gray-800"
            >
              <td className="border px-2 py-1">{student.name}</td>
              <td className="border px-2 py-1">{student.মাস}</td>
              <td className="border px-2 py-1">{student.মাসিক_ফি}</td>
              <td className="border px-2 py-1">{student.ইউনিফর্ম}</td>
              <td className="border px-2 py-1">{student.পরীক্ষা_ফি}</td>
              <td className="border px-2 py-1">{student.বই}</td>
              <td className="border px-2 py-1">{student.খাতা}</td>
              <td className="border px-2 py-1">{student.জরিমানা}</td>
              <td className="border px-2 py-1">{student.বকেয়া}</td>
              <td className="border px-2 py-1">{student.জমা}</td>
              <td className="border px-2 py-1">{student.ধন্যবাদ_নাম}</td>
              <td className="border px-2 py-1">{student.মন্তব্য}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentFeeCard;
