/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import Container from "../../../components/Shared/Container";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const TeachersDetailsPage = () => {

const axiosSecure = useAxiosSecure();
const { teachersId } = useParams();
console.log(teachersId)

const [teachers, setTeachers] = useState([]);
const { name, phone, address,group,designation,joiningDate,profileImageUrl } = teachers || {};
  // ✅ Fetch teachers data from MongoDB
    useEffect(() => {
        axiosSecure
            .get(`http://localhost:8000/jonobal/techers-details/${teachersId}`,)
            .then((res) => {
                setTeachers(res.data);
            })
            .catch((err) => {
                console.error("Error fetching students:", err);
            });
    }, [teachersId]);


    return (
        <Container>
            <div className="p-4 md:p-6 mt-8 mx-auto border bg-white rounded-xl shadow-md space-y-8">
                {/* Profile */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <img
                        src={profileImageUrl || "/default-profile.png"}
                        alt={name}
                        className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border"
                    />
                    <h1 className="text-2xl md:text-3xl font-bold">{name || "নাম দেওয়া হয়নি"}</h1>
                    <h1 className="text-sm md:text-xl ">({designation || "নাম দেওয়া হয়নি"})</h1>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center justify-center text-gray-800">
                
                    <InfoItem label="সেশন" value='' />
                    <InfoItem label="গ্রুপ" value={''} />
                    <InfoItem label="যোগদানের তারিখ" value={joiningDate} />
                </div>


                   {/* Contact Info */}
                   <SectionTitle title="যোগাযোগ" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                    
                    <InfoItem label="ফোন" value={phone} />
                    <InfoItem label="ঠিকানা" value={address} />
                </div>
                   {/* Contact Info */}
                   <SectionTitle title="বিদ্যালয় প্রসঙ্গে মন্তব্যঃ" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-center text-center text-gray-800">
                  
                  <EmptyMessage message={'ইউনিকোড এর মাধ্যমে বাংলা লেখার সুযোগ তৈরি হওয়ার পর মোবাইল কিংবা কম্পিউটার ডিভাইসে সহজেই বাংলা লেখা যায়। বাংলা লেখার জন্য অ্যান্ড্রয়েড ও অ্যাপল ডিভাইসের রয়েছে আলাদা অ্যাপ। আবার যারা কম্পিউটারে কাজ করেন তাদের জন্যও রয়েছে নানা সুবিধা। অনেকে ভাবতেই পারেন এতগুলো অ্যাপ সম্পর্কে জেনে আখেরে লাভ কি। কিন্তু বড় পরিসরে অনেকেই ভেবে দেখেন না, আপনি যদি বিকল্প অ্যাপের কথা জানতে পারেন তাহলে বাংলা লেখার ক্ষেত্রে আপনার সুবিধা বাড়ে। এ বিষয়ে আমরা এতটাই অসচেতন যে ধরেই নেই অনলাইনে বাংলা লেখার জন্য নির্ভর করতে হবে কিবোর্ডের ওপর। কিছু অনলাইন টুলসের মাধ্যমেও বাংলা লেখা যেতে পারে। এই লেখাটিতে মূলত এসব কিবোর্ড সফটওয়ার এবং অনলাইন টুলের কথাই বলবো। '}></EmptyMessage>
                </div>
            </div>
        </Container>
    );
};

export default TeachersDetailsPage;


const InfoItem = ({ label, value }) => (
    <div className="flex space-x-1 text-sm">
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
