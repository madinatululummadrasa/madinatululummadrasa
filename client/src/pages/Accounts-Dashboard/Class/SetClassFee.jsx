/* eslint-disable no-unused-vars */
import { Pencil, Type } from "lucide-react"; 
import { useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";

const initialData = [
    { sl: 1, year: 2025, class: "প্রথম", fee: 500 },
    { sl: 2, year: 2025, class: "দ্বিতীয়", fee: 0 },
    { sl: 3, year: 2025, class: "তৃতীয়", fee: 0 },
    { sl: 4, year: 2025, class: "চতুর্থ", fee: 0 },
    { sl: 5, year: 2025, class: "পঞ্চম", fee: 0 },
    { sl: 6, year: 2025, class: "হেফজ", fee: 0 },
];


const SetClassFee = () => {
    const [formData, setFormData] = useState({}); // local copy to track changes
    const initialValues = {
        Amount: 0,
    };
    const handleFormChange = (updatedForm) => {
        setFormData(updatedForm);
    };
    const [successMessage, setSuccessMessage] = useState("");

    const handleSuccess = () => {
        setSuccessMessage("ছাত্র সফলভাবে যোগ করা হয়েছে!");
    };
   
    const AmountFields = [
        { name: "Amount", label: "Amount", type: 'number', required: true },
    ];
    return (
        <div className="overflow-x-auto bg-white shadow-md p-4 rounded-lg">
            <table className="min-w-full table-auto text-sm text-center border border-blue-200">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="px-3 py-2 border">SLN</th>
                        <th className="px-3 py-2 border">শ্রেণী</th>
                        <th className="px-3 py-2 border">বেতনের পরিমাণ</th>
                        <th className="px-3 py-2 border">পরিবর্তন</th>
                    </tr>
                </thead>
                <tbody>
                    {initialData.map((row, idx) => (
                        <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                            <td className="px-3 py-2 border">{row.sl}</td>
                            <td className="px-3 py-2 border">{row.class}</td>
                            <td className="px-3 py-2 border">
                                <ReusableForm
                                    endpoint="/classes"
                                    fields={AmountFields}
                                    onSuccess={handleSuccess}
                                    initialValues={initialValues}
                                    buttonText="amount যুক্ত করুন"
                                    grid={true}
                                    onChange={handleFormChange}
                                    successMessage={successMessage}
                                    setSuccessMessage={setSuccessMessage}
                                   
                                />
                            </td>
                            <td className="px-3 py-2 border">
                                <button className="text-blue-600 hover:text-blue-800">
                                    <Pencil size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SetClassFee;
