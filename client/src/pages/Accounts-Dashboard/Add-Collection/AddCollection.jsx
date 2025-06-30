/* eslint-disable no-unused-vars */
import { useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery";
import useAuth from "../../../hooks/useAuth";


const AddCollection = () => {
    // Fetch collection categories
    const { data: collectionCategories = [], isLoading, error, refetch } = useFetchQuery({
        key: ["collectionCategories"],
        url: "/collections/collection-category",
    });
    // Fetch class names
    const { data: className = [], isLoading: isclassLoading, error: isclassError, refetch: classrefeytch } = useFetchQuery({
        key: ["className"],
        url: "/classes",
    });
    // Fetch students
    const { data: students = [], isLoading: isStudentLoading, error: isStudentError, refetch: studentRefetch } = useFetchQuery({
        key: ["students"],
        url: "/students",
    });


    const [selectedClass, setSelectedClass] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
console.log("selectedClass", selectedStudent);

    if (selectedClass) {
        const filteredStudents = students.filter(student =>   student.class === selectedClass).map(student => student.name); 
      setSelectedStudent(filteredStudents || ""); // Set first student as default if available
      
       
    }

//    const studentNames = students
//   .filter(student => student.class === selectedClass)
// //   .map(student => student.name);

//   console.log("studentNames", studentNames);
// console.log(studentNames);


    const [selectedIncomeSource, setSelectedIncomeSource] = useState("");
    const { user } = useAuth();
    const formattedDate = new Date().toISOString().split("T")[0]; // "2025-06-29"

    const [formData, setFormData] = useState({}); // local copy to track changes
    const monthNames = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];

    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = monthNames[currentMonthIndex];

    const [successMessage, setSuccessMessage] = useState("");
    const initialValues = {
        admissionDate: formattedDate,
        incomeSource: "",
        month: currentMonthName,
        amount: "",
        details: "",
        colletioner: user?.displayName || "",
        donorName: "",
        donorPhone: "",


    };

    const handleFormChange = (updatedForm) => {
        setFormData(updatedForm);
        setSelectedIncomeSource(updatedForm.incomeSource); // <-- now it tracks the selected income source
        setSelectedClass(updatedForm.class); // <-- now it tracks the selected class
    };

    const extraFields = [];

    if (selectedIncomeSource === "মাসিক ফি") {
        extraFields.push(
            { name: "donorName", label: "দাতার নাম", type: "text", required: true },
            { name: "donorPhone", label: "দাতার ফোন নম্বর", type: "text", required: false }
        );
    } else if (selectedIncomeSource === "বেতন") {
        extraFields.push(
            { name: "class", label: "শ্রেণির নাম", type: "select", options: className.map(c => c.className) },
            // { name: "student", label: "শিক্ষার্থীর  নাম", type: "select", options: [1,2,3,] }
        );
    }
// students.map(s => s.name)


    const CollectionFields = [

        { name: "admissionDate", label: "collectioner  তারিখ", type: "date", required: true },
        { name: "incomeSource", label: "আয়ের খাত", required: true, type: "select", options: collectionCategories.map(c => c.Name) },
        { name: "month", label: "মাস", required: true, type: "select", options: monthNames },
        { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
        { name: "colletioner", label: "কালেকশনকারী ", type: "text", required: true, },
        { name: "details", label: "বিস্তারিত", type: "textarea", required: false },
        ...extraFields
    ];


    const handleSuccess = () => {
        setSuccessMessage("collection সফলভাবে যোগ করা হয়েছে!");
    };

    return (
        <div>
            <ReusableForm
                endpoint="/collections"
                fields={CollectionFields}
                onSuccess={handleSuccess}
                initialValues={initialValues}
                buttonText="কালেকশন যুক্ত করুন"
                grid={true}
                onChange={handleFormChange}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
                buttons={[
                    { type: "navigate", label: "সকল কালেকশন", to: "/accounts-dashboard/collections" },

                ]}
            />
        </div>
    );
};

export default AddCollection;