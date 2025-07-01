
import StudentFeeCard from "./StudentFeeCard";

const StudentFee = () => {

    const studentFeeData = [
  {
    name: "মোঃ হাফিজুর রহমান",
    মাস: "জানুয়ারি",
    মাসিক_ফি: 500,
    ইউনিফর্ম: 200,
    পরীক্ষা_ফি: 150,
    বই: 300,
    খাতা: 100,
    জরিমানা: 0,
    বকেয়া: 0,
    জমা: 1250,
    ধন্যবাদ_নাম: "মোঃ রফিক",
    মন্তব্য: "পরিপূর্ণ জমা"
  },
  {
    name: "মোঃ কামরুল ইসলাম",
    মাস: "জানুয়ারি",
    মাসিক_ফি: 500,
    ইউনিফর্ম: 0,
    পরীক্ষা_ফি: 150,
    বই: 300,
    খাতা: 100,
    জরিমানা: 50,
    বকেয়া: 100,
    জমা: 1100,
    ধন্যবাদ_নাম: "সালেহ উদ্দিন",
    মন্তব্য: "আংশিক"
  },
  // Add more...
];


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-green-700 mb-4">
        শিক্ষার্থীদের মাসিক ফি রিপোর্ট
      </h2>
      <StudentFeeCard data={studentFeeData} />
    </div>
  );
};

export default StudentFee;
