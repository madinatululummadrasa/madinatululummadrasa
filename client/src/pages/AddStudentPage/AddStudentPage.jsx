/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { imageUpload } from "../../assets/utility/index"; // make sure this path is correct
import axios from "axios";

const AddStudentPage = () => {
  const [nextId, setNextId] = useState("");
  const AxiosSecure = useAxiosSecure();
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    studentId: "", // Will be auto-generated
    name: "",
    roll: "",
    class: "",
    session: "2025",
    group: "",
    admissionDate: "",
    profileImage: null, // File object for image
    AdmissionImage: null, // File object for image
    phone: "",
    gender: "ছাত্র",
    guardianName: "",
    FathersName: "",
    mothersName: "",
    address: "",
    admissionPdf: null, // File object for PDF
    birthCertificatePdf: null, // File object for PDF
  });

  // Fetch next available student ID on component mount
  useEffect(() => {
    axios.get('http://localhost:8000/students/next-id')
      .then(res => {
        const generatedId = res.data.nextId;
        setNextId(generatedId);
        // Set formData.studentId only once when nextId is fetched
        setFormData((prev) => ({ ...prev, studentId: generatedId }));
      })
      .catch(err => {
        console.error('Error fetching next student ID:', err);

      });
  }, []);

  const handleFatherChange = (e) => {
    const { value } = e.target;
    setFather(value);
  };
  const handleMotherChange = (e) => {
    const { value } = e.target;
    setMother(value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const uploadFileToDrive = async (file) => {
    if (!file) return ""; // Handle cases where file is null
    try {
      const fileForm = new FormData();
      fileForm.append("file", file);
      const { data } = await AxiosSecure.post("/upload-google-drive", fileForm);
      return data.pdfUrl; // Assuming your backend returns { pdfUrl: "..." }
    } catch (error) {
      console.error("Error uploading file to Google Drive:", error);
      // Handle file upload error gracefully (e.g., show user a message)
      return "";
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // Basic validation before submission
    if (!formData.name || !formData.class || !formData.roll || !formData.session || !formData.studentId) {
      alert("অনুগ্রহ করে নাম, ক্লাস, রোল, সেশন এবং আইডি পূরণ করুন।");
      return;
    }

    try {
      const [profileImageUrl, admissionImageUrl, birthCertificatePdfUrl] = await Promise.all([
        formData.profileImage ? imageUpload(formData.profileImage) : "",
        formData.AdmissionImage ? imageUpload(formData.AdmissionImage) : "",
        formData.birthCertificatePdf ? uploadFileToDrive(formData.birthCertificatePdf) : "",
      ]);

      // Construct documents array
      const documents = [];
      if (birthCertificatePdfUrl) {
        documents.push({
          name: "Birth Certificate",
          type: "pdf",
          url: birthCertificatePdfUrl,
        });
      }


      // }
      if (admissionImageUrl) {
        documents.push({
          name: "Admission Image",
          type: "image",
          url: admissionImageUrl,
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
        FathersName: formData.FathersName,
        mothersName: formData.mothersName,
        address: formData.address,
        profileImageUrl, // Make sure your backend schema expects this name
        admissionImageUrl, // Make sure your backend schema expects this name
        documents,       // Array of documents
      };

      const res = await AxiosSecure.post("/students", newStudent);
      setLoading(false);
      if (res.data.insertedId || res.data.acknowledged) {
        alert("✅ ছাত্র যুক্ত হয়েছে!");
        // Reset form data and re-fetch next ID for the new student
        setFormData({
          studentId: "", // Will be updated by nextId fetch
          name: "",
          roll: "",
          class: "",
          session: "",
          group: "",
          admissionDate: "",
          profileImage: null,
          AdmissionImage: null,
          phone: "",
          gender: "",
          guardianName: "",
          FathersName: "",
          mothersName: "",
          address: "",
          admissionPdf: null,
          birthCertificatePdf: null,
        });

        // Re-fetch next ID to update the studentId field for the next entry
        axios.get('http://localhost:8000/students/next-id')
          .then(res => setNextId(res.data.nextId))
          .catch(err => console.error(err));
      } else {
        alert("❌ ছাত্র যুক্ত করা যায়নি।");
        console.error("Error inserting student:", res.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Student upload failed:", error);
      alert("❌ সমস্যা হয়েছে!");


    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          নতুন ছাত্র যুক্ত করুন
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Student ID (Auto-generated & Readonly) */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">শিক্ষার্থী আইডি</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              placeholder="আইডি স্বয়ংক্রিয়ভাবে তৈরি হবে"
              value={formData.studentId}
              readOnly // Make it read-only
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="শিক্ষার্থীর সম্পূর্ণ নাম"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md p-3 transition duration-150 ease-in-out focus:ring-indigo-500 focus:border-indigo-500
    ${formData.name.length > 0 ? 'border-green-500' : 'border-orange-500'}`}
              required // Add required attribute for basic HTML validation
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">লিঙ্গ</label>
            <select
              id="gender"
              name="gender"

              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out"
              required
            >
              <option value="">লিঙ্গ নির্বাচন করুন</option>
              <option value="ছাত্র">ছাত্র</option>
              <option value="ছাত্রী">ছাত্রী</option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">ক্লাস</label>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out"
              required
            >
              <option value="">ক্লাস নির্বাচন করুন</option>
              <option value="শিশু">শিশু</option>
              <option value="প্রথম">প্রথম</option>
              <option value="দ্বিতীয়">দ্বিতীয়</option>
              <option value="তৃতীয়">তৃতীয়</option>
              <option value="চতুর্থ">চতুর্থ</option>
              <option value="পঞ্চম">পঞ্চম</option>
              <option value="হেফজ">হেফজ</option>
            </select>
          </div>

          {/* Roll Number */}
          <div>
            <label htmlFor="roll" className="block text-sm font-medium text-gray-700 mb-1">রোল নাম্বার</label>
            <input
              type="number"
              id="roll"
              name="roll"
              placeholder="রোল নাম্বার"
              value={formData.roll}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              required
            />
          </div>

          {/* Session */}
          <div>
            <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1">সেশন</label>
            <select
              id="session"
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out"
              required
            >
              <option value="">সেশন নির্বাচন করুন</option>
              {/* Generate dynamic years up to current year + a few future years */}
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 1).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Group */}
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">শাখা</label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out"
            >
              <option value="">শাখা নির্বাচন করুন</option>
              <option value="নূরানি">নূরানি</option>
              <option value="কিতাব">কিতাব</option>
              <option value="হেফজ">হেফজ</option>
            </select>
          </div>

          {/* ---------------------------------------------------------Admission Date-------------------------------------------- */}
          <div>
            <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700 mb-1">ভর্তির তারিখ</label>
            <input
              type="date"
              id="admissionDate"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>



          {/* Fathers name */}
          <div>
            <label htmlFor="FathersName" className="block text-sm font-medium text-gray-700 mb-1">পিতার নাম</label>
            <input
              type="text"
              id="FathersName"
              name="FathersName"
              placeholder="পিতার নাম"
              value={formData.FathersName}
              onChange={(e) => {
                handleChange(e);
                handleFatherChange(e);
              }}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Mothers name */}
          <div>
            <label htmlFor="mothersName" className="block text-sm font-medium text-gray-700 mb-1">মাতার নাম</label>
            <input
              type="text"
              id="mothersName"
              name="mothersName"
              placeholder="মাতার নাম"
              value={formData.mothersName}
              onChange={(e) => {
                handleChange(e);
                handleMotherChange(e);
              }}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
          {/* ------------- --------------------------------------------Guardian Name */}
          {/* <div>
            <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-1">অভিভাবকের নাম</label>
            <input
              type="text"
              id="guardianName"
              name="guardianName"
              placeholder="অভিভাবকের নাম"
              value={formData.guardianName}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />


            <select name="guardianName" id="guardianName" onChange={handleChange} value={formData.guardianName} className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all duration-200 ease-in-out">
              <option value="">অভিভাবকের নাম নির্বাচন করুন</option>
              <option value={father}>পিতা</option>
              <option value={mother}>মাতা</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div> */}
          <div>
            <label htmlFor="guardianType" className="block text-sm font-medium text-gray-700 mb-1">অভিভাবকের ধরন</label>
            <select
              id="guardianType"
              name="guardianType"
              value={formData.guardianType || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  guardianType: value,
                  guardianName: value !== "অন্যান্য" ? value : "",
                }));
              }}
              className="mt-1 block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">অভিভাবক নির্বাচন করুন</option>
              <option value={father}>পিতা</option>
              <option value={mother}>মাতা</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>
          {formData.guardianType === "অন্যান্য" && (
            <div className="mt-4">
              <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-1">অভিভাবকের নাম (অন্যান্য)</label>
              <input
                type="text"
                id="guardianName"
                name="guardianName"
                value={formData.guardianName || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guardianName: e.target.value,
                  }))
                }
                placeholder="অভিভাবকের নাম লিখুন"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}



          {/* ---------------------------------------------------------Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">অভিবাবকের নম্বর</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="অভিবাবকের ফোন নম্বর"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>



          {/*--------------------------------------------------------- Address */}
          <div className="md:col-span-2"> {/* Make address span full width on medium screens */}
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
            <textarea
              id="address"
              name="address"
              placeholder="পূর্ণ ঠিকানা"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
            ></textarea>
          </div>

          {/* ---------------------------------------------------------Profile Image Upload */}
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">প্রোফাইল ছবি</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              alt="Profile Image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100 transition duration-150 ease-in-out"
            />
          </div>
          {/* Admissiom form image */}
          <div>
            <label htmlFor="AdmissionImage" className="block text-sm font-medium text-gray-700 mb-1">ভর্তি ফরম</label>
            <input
              type="file"
              id="AdmissionImage"
              name="AdmissionImage"
              accept="image/*"
              alt="Admission Image"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100 transition duration-150 ease-in-out"
            />
          </div>

          {/* Admission PDF Upload */}
          {/* <div>
            <label htmlFor="admissionPdf" className="block text-sm font-medium text-gray-700 mb-1">ভর্তি ফর্ম (PDF)</label>
            <input
              type="file"
              id="admissionPdf"
              name="admissionPdf"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100 transition duration-150 ease-in-out"
            />
          </div> */}

          {/* Birth Certificate PDF Upload */}
          {/* <div>
            <label htmlFor="birthCertificatePdf" className="block text-sm font-medium text-gray-700 mb-1">জন্ম সনদ (PDF)</label>
            <input
              type="file"
              id="birthCertificatePdf"
              name="birthCertificatePdf"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100 transition duration-150 ease-in-out"
            />
          </div> */}

          {/* Submit Button */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="col-span-2 w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "যোগ করা হচ্ছে..." : "ছাত্র যুক্ত করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;