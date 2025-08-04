/* eslint-disable no-unused-vars */
import useFetchQuery from "../../../hooks/useFetchQuery";



const Expenses = () => {

      const { data: expenses = [], isLoading, error, refetch } = useFetchQuery({
    key: ["expenses"],
    url: "/expenses",
  });
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense Report - জুলাই 2025</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Source</th>
              <th className="px-4 py-2 border">Month</th>
              <th className="px-4 py-2 border">Amount (৳)</th>
              <th className="px-4 py-2 border">Details</th>
              <th className="px-4 py-2 border">Collector</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {expenses.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{item.expenseDate}</td>
                <td className="px-4 py-2 border text-center">{item.expenseSource}</td>
                <td className="px-4 py-2 border text-center">{item.month}</td>
                <td className="px-4 py-2 border text-center font-semibold text-green-600">{item.amount}</td>
                <td className="px-4 py-2 border text-center">{item.details || "-"}</td>
                <td className="px-4 py-2 border text-center capitalize">{item.collector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
