/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery";
import useAuth from "../../../hooks/useAuth";
import useMutateData from "../../../hooks/useMutateData";
import { toast } from "react-hot-toast";
import { BeatLoading, BounceLoading } from 'respinner'
import { use } from "react";
import { FieldValue } from "firebase/firestore";
const AddExpenses = () => {
    const { user } = useAuth();

    const { data: expenseCategories = [], isLoading, error } = useFetchQuery({
        key: ["expenseCategories"],
        url: "/expenses/expenses-category",
    });
    const { data: className = [], isLoading: isClassLoading } = useFetchQuery({
        key: ["className"],
        url: "/classes",
    });
    const { data: students = [], isLoading: isStudentLoading } = useFetchQuery({
        key: ["students"],
        url: "/students",
    });
    const { data: members = [], isLoading: isMembersLoading } = useFetchQuery({
        key: ["members"],
        url: "/members",
    });
    const { data: teachers = [], isLoading: isTeachersLoading } = useFetchQuery({
        key: ["teachers"],
        url: "/teachers",
    });



    const [SelectedExpenseSource, setSelectedExpenseSource] = useState("");
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedStudentList, setSelectedStudentList] = useState("");
    const [selectedStudentNames, setSelectedStudentNames] = useState([]); // for dropdown
    const [SelectedTeacherData, setSelectedTeacherData] = useState([]); // actual object
    const [form, setForm] = useState({});
    console.log("Form Data:", SelectedTeacherData[0]?._id);
    const [selectedMember, setSelectedMember] = useState("");
    const [selectedMemberList, setSelectedMemberList] = useState("");



    // Date setup
    const formattedDate = new Date().toISOString().split("T")[0];
    const monthNames = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = monthNames[currentMonthIndex];
    const expectedMonths = monthNames.slice(0, currentMonthIndex + 1);

    // Effects

    useEffect(() => {
        if (formData?.donorName && selectedMember !== formData.donorName) {
            setSelectedMember(formData.donorName);
        }
    }, [formData?.donorName, selectedMember]);
    useEffect(() => {
        if (selectedClass) {
            const dropdownNames = students
                .filter(student => student.class === selectedClass)
                .map(student => student.name);
            setSelectedStudentNames(dropdownNames);
        }
    }, [selectedClass, students]);
    useEffect(() => {
        if (selectedTeacher && SelectedTeacherData[0]) {
            setFormData(prev => ({
                ...prev,
                salary: SelectedTeacherData[0].salary
            }));
            setForm(prev => ({
                ...prev,
                salary: SelectedTeacherData[0].salary
            }));
        }
    }, [selectedTeacher, SelectedTeacherData]);
    useEffect(() => {
        if (selectedMember) {
            const selected = members.filter(member => member.name === selectedMember);
            setSelectedMemberList(selected);
        }
    }, [selectedMember, members]);
    useEffect(() => {
        if (selectedTeacher) {
            const selected = teachers.filter(teacher => teacher.name === selectedTeacher);
            setSelectedTeacherData(selected);
        }
    }, [selectedTeacher, teachers]);



    const currentStudent = selectedStudentList?.[0];
    const paidMonths = currentStudent?.collections
        ?.filter(entry => entry.month && monthNames.includes(entry.month))
        ?.map(entry => entry.month) || [];

    const unpaidMonths = expectedMonths.filter(month => !paidMonths.includes(month));
    const classFee = parseFloat(className.find(c => c.className === selectedClass)?.fee || 0);
    const admissionFee = (className.find(c => c.className === selectedClass)?.AdmissionFee || 0);

    const totalMonthlyDue = classFee * unpaidMonths.length;
    const totalDue = totalMonthlyDue;


    const currentPay = parseFloat(form?.amount || 0);


    const extraFields = [];
    if (SelectedExpenseSource === "স্টাফ বেতন") {
        extraFields.push(
            { name: "teacher", label: "শিক্ষকের নাম", type: "select", options: teachers.map(t => t.name) }
        );

    } else if (SelectedExpenseSource === "বেতন") {
        extraFields.push(
            { name: "class", label: "শ্রেণির নাম", type: "select", options: className.map(c => c.className) },
            { name: "student", label: "শিক্ষার্থীর নাম", type: "select", options: selectedStudentNames }
        );
    } else if (SelectedExpenseSource === "ভর্তি ফি") {
        extraFields.push(
            { name: "class", label: "শ্রেণির নাম", type: "select", options: className.map(c => c.className) },
            { name: "student", label: "শিক্ষার্থীর নাম", type: "select", options: selectedStudentNames }
        );
    }
    const CollectionFields = [
        { name: "expenseDate", label: " খরচের তারিখ", type: "date", required: true },
        { name: "expenseSource", label: "খরচের খাত", required: true, type: "select", options: expenseCategories.map(c => c.Name) },
        ...extraFields,
        // ...((selectedIncomeSource !== "ভর্তি ফি" && selectedIncomeSource !== "সেশন ফি")
        //     ? [{ name: "month", label: "মাস", type: "select", options: monthNames }]
        //     : []),
        { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
        { name: "collector", label: "কালেকশনকারী", type: "text", required: true },
        { name: "details", label: "বিস্তারিত", type: "textarea", required: false },

    ];

    const initialValues = {
        expenseDate: formattedDate,
        expenseSource: "",
        month: currentMonthName,
        amount: "",
        details: "",
        salary: '',
        collector: user?.displayName || "",
        class: "",
        student: "",
    };

    const sendTransaction = useMutateData({
        method: "patch",
        invalidateKey: ["teachers", "expenses"],
        successMsg: "expenses সফলভাবে যোগ হয়েছে!",
        errorMsg: "expense যোগ করতে ব্যর্থ!",
    });


    const handleSuccess = () => {
        alert("Expense added successfully!");


        if (!SelectedExpenseSource) return toast.error("expenses খাত নির্বাচন করুন");
        if (!form.amount || isNaN(currentPay)) return toast.error("সঠিক পরিমাণ লিখুন");

        sendTransaction.mutate({
            url: `/teachers/teacher/${SelectedTeacherData[0]?.teachersId}`,
            data: {
                name: SelectedExpenseSource,
                amount: currentPay,
                month: form.month,
                collector: form.collector,
                classFee,
                totalMonthlyDue,
                paidForMonths: paidMonths,


            },
        });

        setSuccessMessage("expense সফলভাবে যোগ হয়েছে!");
        setFormData({});
        setForm("");
        setSelectedClass("");
        setSelectedTeacher("");
    };

    const handleFormChange = (updatedForm) => {
        setFormData(updatedForm);
        setForm(updatedForm);
        setSelectedExpenseSource(updatedForm.expenseSource);
        setSelectedClass(updatedForm.class);
        setSelectedTeacher(updatedForm.teacher);

    };

    // Loading & Error states
    if (isLoading || isClassLoading || isStudentLoading || isMembersLoading) return <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"><BounceLoading gap={5} /></span>

    </div>
    if (error) return <p className="text-red-600">ডেটা লোড করতে সমস্যা হয়েছে।</p>;






    return (
        <div className="p-4 flex flex-col items-center justify-center sm:p-6 lg:p-8 min-h-screen max-w-96 mx-auto bg-gradient-to-br to-indigo-100 font-sans">
            {currentStudent?.profileImageUrl && (
                <div className="mb-4">
                    <img
                        src={currentStudent.profileImageUrl}
                        alt=""
                        className="w-40 h-40 object-cover rounded"
                    />
                </div>
            )}

            {/* {selectedIncomeSource === "বেতন" && unpaidMonths.length === 0 && (
                <div className="text-red-600 bg-red-50 border p-2 mt-2 rounded text-center">
                    এই শিক্ষার্থীর জন্য কোনো বকেয়া মাস পাওয়া যায়নি।
                </div>
            )} */}





            {SelectedExpenseSource &&
                selectedTeacher &&
                (
                    <div className="text-red-600 bg-red-50 border text-left p-2 mb-4 mt-2 rounded ">
                        <p > নামঃ {selectedTeacher}    </p>
                        <p > বেতন : {SelectedTeacherData[0]?.salary || ""} </p>




                    </div>
                )}








            {/* {selectedIncomeSource === "বেতন" && selectedClass && currentStudent && unpaidMonths.length > 0 && (
                <div className="col-span-2 bg-yellow-50 p-3 rounded border text-gray-700 text-center mb-4">
                    <p><strong>বকেয়া মাস:</strong> <span className="text-red-700">{unpaidMonths.join(", ")}</span></p>
                    <p><strong>বেতন বকেয়া:</strong> {totalDue} টাকা</p>
                    <p>-----------------------------</p>
                    <p><strong>সর্বমোট বকেয়া:</strong> {totalDue} টাকা</p>
                </div>
            )} */}

            <div className="w-full">
                <ReusableForm
                    endpoint="/expenses"
                    fields={CollectionFields}
                    onSuccess={handleSuccess}
                    initialValues={initialValues}
                    buttonText="expenses যুক্ত করুন"
                    styleMode="modern"
                    onChange={handleFormChange}
                    successMessage={successMessage}
                    setSuccessMessage={setSuccessMessage}
                    buttons={[
                        { type: "navigate", label: "সকল khoroch", to: "/accounts-dashboard/expenses" },
                    ]}
                />
            </div>
        </div>

    );
};

export default AddExpenses;

