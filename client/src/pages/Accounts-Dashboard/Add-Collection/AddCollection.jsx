/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery";
import useAuth from "../../../hooks/useAuth";
import useMutateData from "../../../hooks/useMutateData";


const AddCollection = () => {
    // Fetch collection categories
    const { data: collectionCategories = [], isLoading, error, refetch } = useFetchQuery({
        key: ["collectionCategories"],
        url: "/collections/collection-category",
    });
    
/* ddddfg */

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
    console.log("students----------------------------------", students);
    const [selectedIncomeSource, setSelectedIncomeSource] = useState("");
    const [formData, setFormData] = useState({}); // local copy to track changes
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedName, setSelectedName] = useState("");

    
    console.log("selectedName", selectedName);
    console.log("selectedClass", selectedClass);
    const [selectedStudent, setSelectedStudent] = useState([]);
    console.log("selectedStudent", selectedStudent);

    const [AselectedStudent, setASelectedStudent] = useState([]);
    console.log("AselectedStudent", AselectedStudent);
console.log("selectedIncomeSource", selectedIncomeSource);
    const { user } = useAuth();
    const formattedDate = new Date().toISOString().split("T")[0]; // "2025-06-29"






    // Update selectedIncomeSource when formData changes
    useEffect(() => {
        if (selectedClass) {
            const filteredStudents = students
                .filter(student => student.class === selectedClass)
                .map(student => student.name);
            setSelectedStudent(filteredStudents);
        }
    }, [selectedClass, students]);
    // Update selectedClass when formData changes
    useEffect(() => {
        if (selectedClass) {
            const filteredStudents = students
                .filter(student => student.class === selectedClass).filter(student => student.name === selectedName);

            setASelectedStudent(filteredStudents);
        }
    }, [selectedClass, students, selectedName]);

    // name === student
    const monthNames = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];

    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = monthNames[currentMonthIndex];


    const initialValues = {
        admissionDate: formattedDate,
        incomeSource: "",
        month: currentMonthName,
        amount: "",
        details: "",
        colletioner: user?.displayName || "",
        preDue: '',
        donorName: "",
        donorPhone: "",
        class: "", // Initialize class field
        student: "", // Initialize student field


    };
    const [Form, setForm] = useState('');
    const handleFormChange = (updatedForm) => {
        setFormData(updatedForm);
        setSelectedIncomeSource(updatedForm.incomeSource); // <-- now it tracks the selected income source
        setSelectedClass(updatedForm.class); // <-- now it tracks the selected class
        setSelectedName(updatedForm.student); // <-- now it tracks the selected student name
        console.log("Updated Form Data:", updatedForm);
        setForm(updatedForm); // Update the form state with the new data
        setSelectedIncomeSource(updatedForm.incomeSource); // Update the selected source
        // Return the updated form data
    };


    // const sendTransaction = useMutateData({
    //     method: "patch", // or "put"
    //     invalidateKey: ["users"], // which query to refresh after mutation
    //     successMsg: "User updated!",
    //     errorMsg: "Failed to update user",
    //     onSuccessCallback: () => {
    //         console.log("User updated!");
    //     },
    // });

    // try {
    //     sendTransaction.mutate({
    //         url: `/student/${AselectedStudent?.[0]?.studentId}`, // API endpoint
    //         data: {
    //             name: "Updated Name",
    //             amount: Form.amount,
    //         },
    //     });

    // } catch (error) {
    //     console.error("Error fetching collection categories:", error);

    // }

    const extraFields = [];

    if (selectedIncomeSource === "মাসিক ফি") {
        extraFields.push(
            { name: "donorName", label: "দাতার নাম", type: "text", required: true },
            { name: "donorPhone", label: "দাতার ফোন নম্বর", type: "text", required: false }
        );
    } else if (selectedIncomeSource === "বেতন") {
        extraFields.push(
            { name: "class", label: "শ্রেণির নাম", type: "select", options: className.map(c => c.className) },
            { name: "student", label: "শিক্ষার্থীর  নাম", type: "select", options: selectedClass ? selectedStudent : [], },


        );
    }
    // students.map(s => s.name)
    const initialPreDue = AselectedStudent?.[0]?.preDue || 0;
    const currentPay = Form?.amount || 0;
    const restDue = initialPreDue - currentPay;
    console.log("restDue", restDue);


    const CollectionFields = [

        { name: "admissionDate", label: "collectioner  তারিখ", type: "date", required: true },
        { name: "incomeSource", label: "আয়ের খাত", required: true, type: "select", options: collectionCategories.map(c => c.Name) },
        ...extraFields,
        { name: "month", label: "মাস", required: true, type: "select", options: monthNames },
        { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
        { name: "colletioner", label: "কালেকশনকারী ", type: "text", required: true, },
        { name: "details", label: "বিস্তারিত", type: "textarea", required: false },

    ];

    const sendTransaction = useMutateData({
        method: "patch", // or "put"
        invalidateKey: ["users"],
        successMsg: "User updated!",
        errorMsg: "Failed to update user",
        onSuccessCallback: () => {
            console.log("User updated!");
        },
    });

    const handleSuccess = () => {
        setSuccessMessage("collection সফলভাবে যোগ করা হয়েছে!");



        try {
            sendTransaction.mutate({
                url: `/students/student/${AselectedStudent?.[0]?.studentId}`,
                data: {
                    name: selectedIncomeSource,
                    amount: Form.amount,
                    preDue: restDue,
                    month: Form.month,
                    colletioner: Form.colletioner,
                },
            });

        } catch (error) {
            console.error("Error fetching collection categories:", error);

        }


    };

    return (
        <div>
            <div><img src={AselectedStudent?.[0]?.profileImageUrl} alt="" className="w-40 h-40" /></div>
            {selectedIncomeSource === "বেতন" && AselectedStudent?.[0] && (
                <div className="col-span-2 bg-yellow-50 p-3 rounded border text-gray-700">
                    <p><strong>পূর্বের বকেয়া:</strong> {AselectedStudent[0].preDue || 0} টাকা</p>
                </div>
            )}
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