import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { imageUpload } from "../../assets/utility/index"; // make sure this path is correct
import axios from "axios";

const AddStudentPage = () => {
  const AxiosSecure = useAxiosSecure();
useEffect(() => {
  axios.get('http://localhost:8000/students/next-id')
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
}, []);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    roll: "",
    class: "",
    session: "",
    group: "",
    admissionDate: "",
    profileImage: null,
    phone: "",
    gender: "",
    guardianName: "",
    address: "",
    admissionPdf: null,
    birthCertificatePdf: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const uploadFileToDrive = async (file) => {
    const fileForm = new FormData();
    fileForm.append("file", file);
    const { data } = await AxiosSecure.post("/upload-google-drive", fileForm);
    return data.pdfUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const profileImageUrl = formData.profileImage ? await imageUpload(formData.profileImage) : "";
      const admissionPdfRaw = formData.admissionPdf ? await uploadFileToDrive(formData.admissionPdf) : "";
      const birthCertificatePdfRaw = formData.birthCertificatePdf ? await uploadFileToDrive(formData.birthCertificatePdf) : "";


      const documents = [];

      if (birthCertificatePdfRaw) {
        documents.push({
          name: "Birth Certificate",
          type: "pdf",
          url: birthCertificatePdfRaw,
        });
      }

      if (admissionPdfRaw) {
        documents.push({
          name: "Admission Form",
          type: "pdf",
          url: admissionPdfRaw,
        });
      }


      const newStudent = {
        studentId: formData.studentId,
        name: formData.name,
        class: formData.class,
        roll: formData.roll,
        session: formData.session,
        group: formData.group,
        admissionDate: formData.admissionDate,
        phone: formData.phone,
        gender: formData.gender,
        guardianName: formData.guardianName,
        address: formData.address,
        profileImageUrl,
        documents
      };

      const res = await AxiosSecure.post("/students", newStudent);
      if (res.data.insertedId || res.data.acknowledged) {
        alert("✅ ছাত্র যুক্ত হয়েছে!");
        setFormData({
          studentId: "",
          name: "",
          roll: "",
          class: "",
          session: "",
          group: "",
          admissionDate: "",
          profileImage: null,
          phone: "",
          gender: "",
          guardianName: "",
          address: "",
          admissionPdf: null,
          birthCertificatePdf: null,
        });
      } else {
        alert("❌ ছাত্র যুক্ত করা যায়নি।");
      }
    } catch (error) {
      console.error("❌ Student upload failed:", error);
      alert("❌ সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-center mb-6">নতুন ছাত্র যুক্ত করুন</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="studentId" placeholder="আইডি" value={formData.studentId} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />
       
        <input type="text" name="name" placeholder="নাম" value={formData.name} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />

        <select name="gender" value={formData.gender} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
          <option value="">লিঙ্গ নির্বাচন করুন</option>
          <option value="ছাত্র">ছাত্র</option>
          <option value="ছাত্রী">ছাত্রী</option>
        </select>


        <select name="class" value={formData.class} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
          <option value="">ক্লাস নির্বাচন করুন</option>
          <option value="শিশু">শিশু</option>
          <option value="প্রথম"> প্রথম</option>
          <option value="দ্বিতীয়"> দ্বিতীয়</option>
          <option value="তৃতীয়"> তৃতীয় </option>
          <option value="চতুর্থ"> চতুর্থ </option>
          <option value="পঞ্চম"> পঞ্চম</option>
          <option value="হেফজ"> হেফজ</option>
        </select>


        <input type="number" name="roll" placeholder="রোল নাম্বার" value={formData.roll} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />

        <select name="session" value={formData.session} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
          <option value="">সেশন নির্বাচন করুন</option>
          {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select name="group" value={formData.group} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
          <option value="">শাখা নির্বাচন করুন</option>
          <option value="নূরানি">নূরানি</option>
          <option value="কিতাব">কিতাব</option>
          <option value="হেফজ">হেফজ</option>
        </select>

        <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">প্রোফাইল ছবি</label>
          <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} className="input input-bordered w-full p-2 border rounded" />
        </div>

        <input type="text" name="phone" placeholder="ফোন নম্বর" value={formData.phone} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />
        <input type="text" name="guardianName" placeholder="অভিভাবকের নাম" value={formData.guardianName} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />
        <input type="text" name="address" placeholder="ঠিকানা" value={formData.address} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">ভর্তি ফর্ম (PDF)</label>
          <input type="file" name="admissionPdf" accept="application/pdf" onChange={handleFileChange} className="input input-bordered w-full p-2 border rounded" />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm">জন্ম সনদ (PDF)</label>
          <input type="file" name="birthCertificatePdf" accept="application/pdf" onChange={handleFileChange} className="input input-bordered w-full p-2 border rounded" />
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
            সাবমিট করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentPage;
