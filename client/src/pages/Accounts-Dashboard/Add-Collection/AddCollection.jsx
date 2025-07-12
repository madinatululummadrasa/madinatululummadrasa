/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery";
import useAuth from "../../../hooks/useAuth";
import useMutateData from "../../../hooks/useMutateData";

const AddCollection = () => {
  // Hooks & Queries
  const { user } = useAuth();

  const { data: collectionCategories = [], isLoading, error, refetch } = useFetchQuery({
    key: ["collectionCategories"],
    url: "/collections/collection-category",
  });

  const { data: className = [], isLoading: isclassLoading, error: isclassError, refetch: classrefeytch } = useFetchQuery({
    key: ["className"],
    url: "/classes",
  });

  const { data: students = [], isLoading: isStudentLoading, error: isStudentError, refetch: studentRefetch } = useFetchQuery({
    key: ["students"],
    url: "/students",
  });

  // State
  const [selectedIncomeSource, setSelectedIncomeSource] = useState("");
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [AselectedStudent, setASelectedStudent] = useState([]);
  const [Form, setForm] = useState("");

  // Date
  const formattedDate = new Date().toISOString().split("T")[0];
  const monthNames = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const currentMonthIndex = new Date().getMonth();
  const currentMonthName = monthNames[currentMonthIndex];
  const expectedMonths = monthNames.slice(0, currentMonthIndex + 1);

  // Paid & Unpaid Month Logic
  const paidMonths = AselectedStudent?.[0]?.collections
    ?.filter(entry => entry.month && monthNames.includes(entry.month))
    ?.map(entry => entry.month) || [];

  const unpaidMonths = expectedMonths.filter(month => !paidMonths.includes(month));

  // Class Fee Calculation
  const InitialclassFee = parseFloat(className.find(c => c.className === selectedClass)?.fee || "" || 0);
  const totalMonthlyDue = InitialclassFee * unpaidMonths.length || 1;
  const totalDue = AselectedStudent?.[0]?.preDue + totalMonthlyDue || 0;

  const initialPreDue = AselectedStudent?.[0]?.preDue || 0;
  const currentPay = Form?.amount || 0;
  const restDue = initialPreDue - currentPay;

  // Effects
  useEffect(() => {
    if (selectedClass) {
      const filteredStudents = students
        .filter(student => student.class === selectedClass)
        .map(student => student.name);
      setSelectedStudent(filteredStudents);
    }
  }, [selectedClass, students]);

  useEffect(() => {
    if (selectedClass) {
      const filteredStudents = students
        .filter(student => student.class === selectedClass)
        .filter(student => student.name === selectedName);
      setASelectedStudent(filteredStudents);
    }
  }, [selectedClass, students, selectedName]);

  // Initial Values
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
    class: "",
    student: "",
  };

  // Handle Form Change
  const handleFormChange = (updatedForm) => {
    setFormData(updatedForm);
    setSelectedIncomeSource(updatedForm.incomeSource);
    setSelectedClass(updatedForm.class);
    setSelectedName(updatedForm.student);
    setForm(updatedForm);
    console.log("Updated Form Data:", updatedForm);
  };

  // Conditional Fields
  const extraFields = [];

  if (selectedIncomeSource === "মাসিক ফি") {
    extraFields.push(
      { name: "donorName", label: "দাতার নাম", type: "text", required: true },
      { name: "donorPhone", label: "দাতার ফোন নম্বর", type: "text", required: false }
    );
  } else if (selectedIncomeSource === "বেতন") {
    extraFields.push(
      { name: "class", label: "শ্রেণির নাম", type: "select", options: className.map(c => c.className) },
      { name: "student", label: "শিক্ষার্থীর  নাম", type: "select", options: selectedClass ? selectedStudent : [] },
    );
  }

  // All Form Fields
  const CollectionFields = [
    { name: "admissionDate", label: "collectioner  তারিখ", type: "date", required: true },
    { name: "incomeSource", label: "আয়ের খাত", required: true, type: "select", options: collectionCategories.map(c => c.Name) },
    ...extraFields,
    { name: "month", label: "মাস", type: "select", options: monthNames },
    { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
    { name: "colletioner", label: "কালেকশনকারী ", type: "text", required: true },
    { name: "details", label: "বিস্তারিত", type: "textarea", required: false },
  ];

  // Mutation
  const sendTransaction = useMutateData({
    method: "patch",
    invalidateKey: ["users"],
    successMsg: "User updated!",
    errorMsg: "Failed to update user",
    onSuccessCallback: () => {
      console.log("User updated!");
    },
  });

  // Success Handler
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

  // Render
  return (
    <div>
      <div>
        <img src={AselectedStudent?.[0]?.profileImageUrl} alt="" className="w-40 h-40" />
      </div>

      {selectedIncomeSource === "বেতন" && AselectedStudent?.[0] && (
        <div className="col-span-2 bg-yellow-50 p-3 rounded border text-gray-700">
          <p><strong>পূর্বের বকেয়া:</strong> {totalDue || 0} টাকা</p>
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
