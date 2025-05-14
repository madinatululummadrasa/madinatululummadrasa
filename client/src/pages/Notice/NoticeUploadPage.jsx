/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import UploadPdfToGoogleDrive from "../../assets/utility/UploadPdfToGoogleDrive ";


const NoticeUploadPage = () => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
const AxiosSecure = useAxiosSecure()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !time || !file) {
      alert("Please fill all fields and select a PDF.");
      return;
    }

    setUploading(true);


    try {

      // const pdfUrl = await UploadPdfToCloudinary(file)
       const pdfUrl = await UploadPdfToGoogleDrive(file)
console.log(pdfUrl) // 🔁 use utility here
      const noticeData = {
        title: title,
        time: time,
        pdfUrl: pdfUrl,
      }
      const { data } = await AxiosSecure.post('/notices', noticeData)
      console.log(data) // 🔁 use utility here



      if (!data) {
        alert("Notice upload failed. Please try again.");
        return;
      }
      // Show success message
      alert("Notice uploaded successfully!");
      // Reset form fields  





      setSuccess(true);
      setTitle("");
      setTime("");
      setFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };


  // Autofill time once on component mount
  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-GB") + " " +
      now.toLocaleDateString("en-GB").split("/").reverse().join("-");
    setTime(formattedTime); // hh:mm:ss DD-MM-YY
  }, []);
  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg border rounded">
      <h2 className="text-xl font-bold mb-4">Upload Notice</h2>
      {success && <p className="text-green-600 mb-2">Notice uploaded successfully!</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Time (e.g., 17-April-2025 10:00AM)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          disabled={uploading}
 
          // onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {uploading ? "Uploading..." : "Upload Notice"}
        </button>
      </form>
    </div>
  );
};

export default NoticeUploadPage;
