import { Pencil, X } from "lucide-react";
import { useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery"; // ✅ Your fetch hook

const SetClassFee = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: classFees = [], refetch } = useFetchQuery({
    key: ["classFees"],
    url: "/class-fees", // ✅ Replace with your actual endpoint
  });

  const handleSuccess = () => {
    setSuccessMessage("বেতন সফলভাবে সংরক্ষণ করা হয়েছে!");
    setSelectedRow(null);
    refetch();
  };

  const AmountFields = [
    { name: "fee", label: "Amount", type: "number", required: true },
  ];

  return (
    <div className="overflow-x-auto bg-white shadow-lg p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">শ্রেণী অনুযায়ী বেতন নির্ধারণ</h2>
      <table className="min-w-full table-auto text-sm text-center border border-blue-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 border">SL</th>
            <th className="px-4 py-2 border">শ্রেণী</th>
            <th className="px-4 py-2 border">বর্তমান বেতন</th>
            <th className="px-4 py-2 border">পরিবর্তন</th>
          </tr>
        </thead>
        <tbody>
          {classFees.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-4 py-2 border">{idx + 1}</td>
              <td className="px-4 py-2 border">{row.class}</td>
              <td className="px-4 py-2 border">
                {selectedRow === row._id ? (
                  <ReusableForm
                    endpoint={`/class-fees/${row._id}`} // ✅ PATCH or PUT endpoint
                    method="patch"
                    fields={AmountFields}
                    initialValues={{ fee: row.fee }}
                    buttonText="সংরক্ষণ করুন"
                    onSuccess={handleSuccess}
                    grid={false}
                    successMessage={successMessage}
                    setSuccessMessage={setSuccessMessage}
                  />
                ) : (
                  <span>{row.fee} টাকা</span>
                )}
              </td>
              <td className="px-4 py-2 border">
                {selectedRow === row._id ? (
                  <button
                    onClick={() => setSelectedRow(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedRow(row._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SetClassFee;
