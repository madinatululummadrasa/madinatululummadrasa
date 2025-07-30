/* eslint-disable no-unused-vars */
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useState } from "react";

import CollectionCatModal from "../Components/Modal/CollectionCatModal";
import useFetchQuery from "../../../hooks/useFetchQuery";
import ExpenseCatModal from "../Components/Modal/ExpenseCatModal";
import { constructNow } from "date-fns";

const CollectionCategory = () => {
  const {
    data: collectionCategories = [],
    isLoading: isCollectionLoading,
    error: collectionError,
    refetch: refetchCollection,
  } = useFetchQuery({
    key: ["collectionCategories"],
    url: "/collections/collection-category",
  });

  const {
    data: expensesCategories = [],
    isLoading: isExpenseLoading,
    error: expenseError,
    refetch: refetchExpenses,
  } = useFetchQuery({
    key: ["expensesCategories"],
    url: "/expenses/expenses-category",
  });


  console.log("Expenses Categories:", expensesCategories);

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const openCollectionModal = () => setIsCollectionModalOpen(true);
  const closeCollectionModal = () => setIsCollectionModalOpen(false);

  const openExpenseModal = () => setIsExpenseModalOpen(true);
  const closeExpenseModal = () => setIsExpenseModalOpen(false);

  // You might want to handle loading and error states more explicitly in the UI
  if (isCollectionLoading || isExpenseLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading categories...
      </div>
    );
  }

  if (collectionError || expenseError) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Error loading categories. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Income Categories Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">আয়ের খাতগুলো (Income Categories)</h1>
          <button
            onClick={openCollectionModal}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <CiCirclePlus className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">Add Income Category</span>
          </button>
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 bg-white p-5 rounded-xl shadow-lg">
          {collectionCategories.map((item) => (
            <Link
              to={item.link || "#"} // Use Link for internal navigation, fallback to '#'
              key={item._id}
              className="group border border-gray-200 p-4 sm:p-5 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md hover:border-green-400 transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
            >
              <p className="text-base font-medium text-gray-700 group-hover:text-green-600 text-center line-clamp-2">
                {item.Name}
              </p>
            </Link>
          ))}
        </section>
      </div>

      {/* --- */}

      {/* Expense Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">ব্যয়ের খাতগুলো (Expense Categories)</h1>
          <button
            onClick={openExpenseModal}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <CiCirclePlus className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">Add Expense Category</span>
          </button>
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 bg-white p-5 rounded-xl shadow-lg">
          {expensesCategories.map((item) => (
            
            <Link
              to={item.link || "#"} // Use Link for internal navigation, fallback to '#'
              key={item._id}
              className="group border border-gray-200 p-4 sm:p-5 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md hover:border-red-400 transform hover:-translate-y-1 transition-all duration-200 ease-in-out"
            >
              <p className="text-base font-medium text-gray-700 group-hover:text-red-600 text-center line-clamp-2">
                {item.Name}
              </p>
            </Link>
          ))}
        </section>
      </div>

      {/* Modals */}
      <CollectionCatModal
        isOpen={isCollectionModalOpen}
        onClose={closeCollectionModal}
        refetch={refetchCollection}
      />
      <ExpenseCatModal
        isOpen={isExpenseModalOpen}
        onClose={closeExpenseModal}
        refetch={refetchExpenses}
      />
    </div>
  );
};

export default CollectionCategory;