/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import { axiosSecure } from '../../../hooks/useAxiosSecure';

const NoticeTable = () => {
  const [notices, setNotices] = useState([])


  const fetchNotices = async () => {
    try {
      const {data} = await axiosSecure.get('/notices')
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);

    }
  }
  useEffect(() => {
    fetchNotices();
  }, []);


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 text-sm text-center">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-2 border">ক্রমিক</th>
            <th className="px-4 py-2 border">বিষয়</th>
            <th className="px-4 py-2 border">তারিখ এবং সময়</th>
            <th className="px-4 py-2 border">কার্যকলাপ</th>
          </tr>
        </thead>
        <tbody>
        {notices.map((notice, index) => {
  const fileIdMatch = notice.pdfUrl.match(/\/d\/(.*?)\//);
  const fileId = fileIdMatch?.[1];
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : notice.pdfUrl;

  return (
    <tr key={index} className="border-t">
      <td className="px-4 py-2 border">{index + 1}</td>
      <td className="px-4 py-2 border text-left">{notice.title}</td>
      <td className="px-4 py-2 border">{notice.time}</td>
      <td className="px-4 py-2 border space-x-2">
        <a
          href={notice.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition"
        >
          <FaEye className="mr-1" />
          প্রদর্শন করুন
        </a>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
        >
          <FaDownload className="mr-1" />
          ডাউনলোড করুন
        </a>
      </td>
    </tr>
  );
})}

        </tbody>
      </table>
    </div>
  );
};

export default NoticeTable;
