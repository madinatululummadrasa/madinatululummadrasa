import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { imageUpload } from "../../../assets/utility";
import Container from "../../../components/Shared/Container";


const AddTeachersPage = () => {
    const AxiosSecure = useAxiosSecure();

    const [formData, setFormData] = useState({
        teachersId: "",
        designation: "",
        name: "",
        group: "",
        joiningDate: "",
        profileImage: null,
        phone: "",
       
        address: "",
        nidPdf: null,
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
            const nidPdfRaw = formData.nidPdf ? await uploadFileToDrive(formData.nidPdf) : "";
            const birthCertificatePdfRaw = formData.birthCertificatePdf ? await uploadFileToDrive(formData.birthCertificatePdf) : "";


            const documents = [];

            if (birthCertificatePdfRaw) {
                documents.push({
                    name: "Birth Certificate",
                    type: "pdf",
                    url: birthCertificatePdfRaw,
                });
            }

            if (nidPdfRaw) {
                documents.push({
                    name: "Admission Form",
                    type: "pdf",
                    url: nidPdfRaw,
                });
            }


            const newTeachers = {
                teachersId: formData.studentId,
                name: formData.name,
                designation: formData.designation,
                class: formData.class,
                roll: formData.roll,
                session: formData.session,
                group: formData.group,
                joiningDate: formData.joiningDate,
                phone: formData.phone,
              
                address: formData.address,
                profileImageUrl,
                documents
            };

            const res = await AxiosSecure.post("/teachers", newTeachers);
            if (res.data.insertedId || res.data.acknowledged) {
                alert("✅ ডাটাবেসে নতুন শিক্ষক যুক্ত হয়েছে!");
                setFormData({
                    studentId: "",
                    name: "",
                    designation: "",
                    roll: "",
                    class: "",
                    session: "",
                    group: "",
                    joiningDate: "",
                    profileImage: null,
                    phone: "",
                    address: "",
                    nidPdf: null,
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

        <Container>
        <div className=" mx-auto flex border px-4 py-6">


            <div>
                <h2>fdgjsdioj</h2>
            </div>

            <div className="max-w-4xl mx-auto border px-4 py-6">
                <h1 className="text-2xl font-semibold text-center mb-6">নতুন শিক্ষক যুক্ত করুন</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="studentId" placeholder="আইডি" value={formData.studentId} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />
                    <input type="text" name="name" placeholder="নাম" value={formData.name} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />

                    {/* <select name="class" value={formData.class} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
          <option value="">ক্লাস নির্বাচন করুন</option>
          <option value="0">শিশু</option>
          <option value="1">প্রথম</option>
          <option value="2">দ্বিতীয়</option>
          <option value="3">তৃতীয়</option>
          <option value="4">চতুর্থ</option>
          <option value="5">পঞ্চম</option>
          <option value="hefz">হেফজ</option>
        </select> */}

                    {/* <input type="number" name="roll" placeholder="রোল নাম্বার" value={formData.roll} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" /> */}

                    {/* <select name="session" value={formData.session} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
          <option value="">সেশন নির্বাচন করুন</option>
          {[2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select> */}

                    <select name="group" value={formData.group} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
                        <option value="">নিযুক্ত শাখা নির্বাচন করুন</option>
                        <option value="nurani">নূরানি</option>
                        <option value="kitab">কিতাব</option>
                        <option value="hefz">হেফজ</option>
                    </select>

                    
                    <select name="designation" value={formData.designation} onChange={handleChange} className="input input-bordered w-full p-2 border rounded">
                        <option value="">পদবী নির্বাচন করুন</option>
                        <option value="প্রধান শিক্ষক">প্রধান শিক্ষক</option>
                        <option value="সহকারি প্রধান শিক্ষক">সহকারি প্রধান শিক্ষক </option>
                        <option value="সহকারি শিক্ষক">সহকারি শিক্ষক </option>
                        
                    </select>

                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />

                 

                    <input type="text" name="phone" placeholder="ফোন নম্বর" value={formData.phone} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />
                    {/* <input type="text" name="guardianName" placeholder="অভিভাবকের নাম" value={formData.guardianName} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" /> */}
                    <input type="text" name="address" placeholder="ঠিকানা" value={formData.address} onChange={handleChange} className="input input-bordered w-full p-2 border rounded" />
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm">প্রোফাইল ছবি</label>
                        <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} className="input input-bordered w-full p-2 border rounded" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm"> জাতীয় পরিচয় পত্র(PDF)</label>
                        <input type="file" name="nidPdf" accept="application/pdf" onChange={handleFileChange} className="input input-bordered w-full p-2 border rounded" />
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

        </div>
        </Container>
    );
};

export default AddTeachersPage;