/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery";
import useAuth from "../../../hooks/useAuth";
import useMutateData from "../../../hooks/useMutateData";
import { toast } from "react-hot-toast";

const AddCollection = () => {
  const { user } = useAuth();

  const { data: collectionCategories = [], isLoading, error } = useFetchQuery({
    key: ["collectionCategories"],
    url: "/collections/collection-category",
  });

  const { data: className = [], isLoading: isClassLoading } = useFetchQuery({
    key: ["className"],
    url: "/classes",
  });

  const { data: students = [], isLoading: isStudentLoading } = useFetchQuery({
    key: ["students"],
    url: "/students",
  });

  const [selectedIncomeSource, setSelectedIncomeSource] = useState("");
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedStudentNames, setSelectedStudentNames] = useState([]); // for dropdown
  const [selectedStudentList, setSelectedStudentList] = useState([]); // actual object
  const [form, setForm] = useState({});

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
    if (selectedClass) {
      const dropdownNames = students
        .filter(student => student.class === selectedClass)
        .map(student => student.name);
      setSelectedStudentNames(dropdownNames);
    }
  }, [selectedClass, students]);

  useEffect(() => {
    if (selectedClass && selectedStudentName) {
      const selected = students.filter(
        student => student.class === selectedClass && student.name === selectedStudentName
      );
      setSelectedStudentList(selected);
    }
  }, [selectedClass, selectedStudentName, students]);

  const currentStudent = selectedStudentList?.[0];
  const paidMonths = currentStudent?.collections
    ?.filter(entry => entry.month && monthNames.includes(entry.month))
    ?.map(entry => entry.month) || [];

  const unpaidMonths = expectedMonths.filter(month => !paidMonths.includes(month));
  const classFee = parseFloat(className.find(c => c.className === selectedClass)?.fee || 0);
  const totalMonthlyDue = classFee * unpaidMonths.length;
  const totalDue = totalMonthlyDue;
  const preDue = parseFloat(currentStudent?.preDue || 0);
  const currentPay = parseFloat(form?.amount || 0);
  const remainingDue = Math.max(totalDue + preDue - currentPay, 0);

  // Fields
  const extraFields = [];
  if (selectedIncomeSource === "মাসিক ফি") {
    extraFields.push(
      { name: "donorName", label: "দাতার নাম", type: "text", required: true },
      { name: "donorPhone", label: "দাতার ফোন নম্বর", type: "text", required: false }
    );
  } else if (selectedIncomeSource === "বেতন") {
    extraFields.push(
      { name: "class", label: "শ্রেণির নাম", type: "select", options: className.map(c => c.className) },
      { name: "student", label: "শিক্ষার্থীর নাম", type: "select", options: selectedStudentNames }
    );
  }

  const CollectionFields = [
    { name: "admissionDate", label: "কালেকশন তারিখ", type: "date", required: true },
    { name: "incomeSource", label: "আয়ের খাত", required: true, type: "select", options: collectionCategories.map(c => c.Name) },
    ...extraFields,
    { name: "month", label: "মাস", type: "select", options: monthNames },
    { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
    { name: "collector", label: "কালেকশনকারী", type: "text", required: true },
    { name: "details", label: "বিস্তারিত", type: "textarea", required: false },
    { name: "preDue", label: "পূর্বের বকেয়া", type: "number", value: preDue, readOnly: true },
  ];

  const initialValues = {
    admissionDate: formattedDate,
    incomeSource: "",
    month: currentMonthName,
    amount: "",
    details: "",
    collector: user?.displayName || "",
    preDue: preDue,
    donorName: "",
    donorPhone: "",
    class: "",
    student: "",
  };

  const sendTransaction = useMutateData({
    method: "patch",
    invalidateKey: ["students", "collections"],
    successMsg: "কালেকশন সফলভাবে যোগ হয়েছে!",
    errorMsg: "কালেকশন যোগ করতে ব্যর্থ!",
  });

  const handleSuccess = () => {
    if (!currentStudent) return toast.error("শিক্ষার্থী নির্বাচন করুন");
    if (!form.amount || isNaN(currentPay)) return toast.error("সঠিক পরিমাণ লিখুন");

    sendTransaction.mutate({
      url: `/students/student/${currentStudent?.studentId}`,
      data: {
        name: selectedIncomeSource,
        amount: currentPay,
        month: form.month,
        collector: form.collector,
        monthsCovered: selectedIncomeSource === "বেতন" ? unpaidMonths : [],
        classFee,
        totalMonthlyDue,
        paidForMonths: paidMonths,
        preDue: remainingDue,
      },
    });

    setSuccessMessage("কালেকশন সফলভাবে যোগ হয়েছে!");
    setFormData({});
    setForm("");
    setSelectedClass("");
    setSelectedStudentName("");
  };

  const handleFormChange = (updatedForm) => {
    setFormData(updatedForm);
    setForm(updatedForm);
    setSelectedIncomeSource(updatedForm.incomeSource);
    setSelectedClass(updatedForm.class);
    setSelectedStudentName(updatedForm.student);
  };

  // Loading & Error states
  if (isLoading || isClassLoading || isStudentLoading) return <p>লোড হচ্ছে...</p>;
  if (error) return <p className="text-red-600">ডেটা লোড করতে সমস্যা হয়েছে।</p>;

  return (
    <div>
      {currentStudent?.profileImageUrl && (
        <div className="mb-4">
          <img src={currentStudent.profileImageUrl} alt="" className="w-40 h-40 object-cover rounded" />
        </div>
      )}

      {selectedIncomeSource === "বেতন" && unpaidMonths.length === 0 && (
        <div className="text-red-600 bg-red-50 border p-2 mt-2 rounded">
          এই শিক্ষার্থীর জন্য কোনো বকেয়া মাস পাওয়া যায়নি।
        </div>
      )}

      {selectedIncomeSource === "বেতন" && selectedClass && currentStudent && unpaidMonths.length > 0 && (
        <div className="col-span-2 bg-yellow-50 p-3 rounded border text-gray-700">
          <p><strong>বকেয়া মাস:</strong> <span className="text-red-700">{unpaidMonths.join(", ")}</span></p>
          <p><strong>বেতন বকেয়া:</strong> {totalDue} টাকা</p>
          <p><strong>পূর্বের বকেয়া:</strong> {preDue} টাকা</p>
          <p>-----------------------------</p>
          <p><strong>সর্বমোট বকেয়া:</strong> {totalDue + preDue} টাকা</p>
          <p><strong>বর্তমান পরিশোধ:</strong> {currentPay} টাকা</p>
          <p><strong>বাকি থাকলো:</strong> {remainingDue} টাকা</p>
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








































// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from "react";
// import ReusableForm from "../Components/ReusableForm/ReusableForm";
// import useFetchQuery from "../../../hooks/useFetchQuery";
// import useAuth from "../../../hooks/useAuth";
// import useMutateData from "../../../hooks/useMutateData";

// const AddCollection = () => {
//   // Hooks & Queries
//   const { user } = useAuth();

//   const { data: collectionCategories = [], isLoading, error, refetch } = useFetchQuery({
//     key: ["collectionCategories"],
//     url: "/collections/collection-category",
//   });

//   const { data: className = [], isLoading: isclassLoading, error: isclassError, refetch: classrefeytch } = useFetchQuery({
//     key: ["className"],
//     url: "/classes",
//   });

//   const { data: students = [], isLoading: isStudentLoading, error: isStudentError, refetch: studentRefetch } = useFetchQuery({
//     key: ["students"],
//     url: "/students",
//   });

//   // State
//   const [selectedIncomeSource, setSelectedIncomeSource] = useState("");
//   const [formData, setFormData] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedName, setSelectedName] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState([]);
//   const [AselectedStudent, setASelectedStudent] = useState([]);
//   console.log("AselectedStudent:", AselectedStudent);
//   console.log("selected student",selectedStudent)
//   const [Form, setForm] = useState("");

//   // Date
//   const formattedDate = new Date().toISOString().split("T")[0];
//   const monthNames = [
//     "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
//     "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
//   ];
//   const currentMonthIndex = new Date().getMonth();
//   const currentMonthName = monthNames[currentMonthIndex];
//   const expectedMonths = monthNames.slice(0, currentMonthIndex + 1);

//   // Paid & Unpaid Month Logic
//   const paidMonths = AselectedStudent?.[0]?.collections
//     ?.filter(entry => entry.month && monthNames.includes(entry.month))
//     ?.map(entry => entry.month) || [];


//   const unpaidMonths = expectedMonths.filter(month => !paidMonths.includes(month));

//   // Class Fee Calculation
//   const InitialclassFee = parseFloat(className.find(c => c.className === selectedClass)?.fee || "" || 0);
//   const totalMonthlyDue = InitialclassFee && unpaidMonths.length
//     ? InitialclassFee * unpaidMonths.length
//     : 0;


//   const totalDue = totalMonthlyDue;

//   const initialPreDue =  parseFloat(AselectedStudent?.[0]?.preDue || 0);
//   const currentPay = parseFloat(Form?.amount || 0);




//   // Effects
//   useEffect(() => {
//     if (selectedClass) {
//       const filteredStudents = students
//         .filter(student => student.class === selectedClass)
//         .map(student => student.name);
//       setSelectedStudent(filteredStudents);
//     }
//   }, [selectedClass, students]);

//   useEffect(() => {
//     if (selectedClass) {
//       const filteredStudents = students
//         .filter(student => student.class === selectedClass)
//         .filter(student => student.name === selectedName);
//       setASelectedStudent(filteredStudents);
//     }
//   }, [selectedClass, students, selectedName]);

//   // Initial Values
//   const initialValues = {
//     admissionDate: formattedDate,
//     incomeSource: "",
//     month: currentMonthName,
//     amount: "",
//     details: "",
//     colletioner: user?.displayName || "",
//     preDue: '',
//     donorName: "",
//     donorPhone: "",
//     class: "",
//     student: "",
//   };

//   // Handle Form Change
//   const handleFormChange = (updatedForm) => {
//     setFormData(updatedForm);
//     setSelectedIncomeSource(updatedForm.incomeSource);
//     setSelectedClass(updatedForm.class);
//     setSelectedName(updatedForm.student);
//     setForm(updatedForm);
//     console.log("Updated Form Data:", updatedForm);
//   };

//   // Conditional Fields
//   const extraFields = [];

//   if (selectedIncomeSource === "মাসিক ফি") {
//     extraFields.push(
//       { name: "donorName", label: "দাতার নাম", type: "text", required: true },
//       { name: "donorPhone", label: "দাতার ফোন নম্বর", type: "text", required: false }
//     );
//   } else if (selectedIncomeSource === "বেতন") {
//     extraFields.push(
//       { name: "class", label: "শ্রেণির নাম", type: "select", options: className.map(c => c.className) },
//       { name: "student", label: "শিক্ষার্থীর  নাম", type: "select", options: selectedClass ? selectedStudent : [] },
//     );
//   }

//   // All Form Fields
//   const CollectionFields = [
//     { name: "admissionDate", label: "collectioner  তারিখ", type: "date", required: true },
//     { name: "incomeSource", label: "আয়ের খাত", required: true, type: "select", options: collectionCategories.map(c => c.Name) },
//     ...extraFields,
//     { name: "month", label: "মাস", type: "select", options: monthNames },
//     { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
//     { name: "colletioner", label: "কালেকশনকারী ", type: "text", required: true },
//     { name: "details", label: "বিস্তারিত", type: "textarea", required: false },
//   ];

//   // Mutation
//   const sendTransaction = useMutateData({
//     method: "patch",
//     invalidateKey: ["users"],
//     successMsg: "User updated!",
//     errorMsg: "Failed to update user",
//     onSuccessCallback: () => {
//       console.log("User updated!");

//     },
//   });

//   // Success Handler
//   const handleSuccess = () => {
//     setSuccessMessage("collection সফলভাবে যোগ করা হয়েছে!");

//     try {
//       sendTransaction.mutate({
//         url: `/students/student/${AselectedStudent?.[0]?.studentId}`,
//         data: {
//           name: selectedIncomeSource,
//           amount: parseFloat(Form.amount),
//           // preDue: restDue,
//           month: Form.month,
//           colletioner: Form.colletioner,
//           monthsCovered: selectedIncomeSource === "বেতন" ? unpaidMonths : [],
//           classFee: InitialclassFee,
//           totalMonthlyDue,
//           paidForMonths: paidMonths,
//         }

//       });
//     } catch (error) {
//       console.error("Error fetching collection categories:", error);
//     }
//   };

//   // Render
//   return (
//     <div>
//       <div>
//         <img src={AselectedStudent?.[0]?.profileImageUrl} alt="" className="w-40 h-40" />
//       </div>

//       {selectedIncomeSource === "বেতন" && unpaidMonths.length === 0 && (
//         <div className="text-red-600 bg-red-50 border p-2 mt-2 rounded">
//           এই শিক্ষার্থীর জন্য কোনো বকেয়া মাস পাওয়া যায়নি।
//         </div>
//       )}
//       {selectedIncomeSource === "বেতন" && selectedClass && AselectedStudent[0] && unpaidMonths.length > 0  && (
//         <div className="col-span-2 bg-yellow-50 p-3 rounded border text-gray-700">
//           <p><strong>বকেয়া মাস:</strong> <span className="text-red-700">{unpaidMonths.join(", ")}</span></p>
//           <p><strong>বেতন বকেয়া:</strong> {totalDue || 0} টাকা</p>
//           <p><strong>পূর্বের বকেয়া:</strong> {initialPreDue || 0} টাকা</p>
//           <p>-----------------------------</p>
//           <p>সর্বমোট বকেয়া: {totalDue + initialPreDue} টাকা</p>
//         </div>
//       )}

//       <ReusableForm
//         endpoint="/collections"
//         fields={CollectionFields}
//         onSuccess={handleSuccess}
//         initialValues={initialValues}
//         buttonText="কালেকশন যুক্ত করুন"
//         grid={true}
//         onChange={handleFormChange}
//         successMessage={successMessage}
//         setSuccessMessage={setSuccessMessage}
//         buttons={[
//           { type: "navigate", label: "সকল কালেকশন", to: "/accounts-dashboard/collections" },
//         ]}
//       />
//     </div>
//   );
// };

// export default AddCollection;
