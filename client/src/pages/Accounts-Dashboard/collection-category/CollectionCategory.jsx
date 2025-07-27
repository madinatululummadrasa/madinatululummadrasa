/* eslint-disable no-unused-vars */
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useState } from "react";

import CollectionCatModal from "../Components/Modal/CollectionCatModal";
import useFetchQuery from "../../../hooks/useFetchQuery";

const CollectionCategory = () => {
  const { data: collectionCategories = [], isLoading, error, refetch } = useFetchQuery({
    key: ["collectionCategories"],
    url: "/collections/collection-category",
  });

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-white rounded-lg">
        {/* All Categories */}
        {collectionCategories.map((item) => (
          <a
            href={item.link}
            key={item._id}
            className="border p-4 flex flex-col items-center justify-center bg-gray-50 rounded-lg hover:text-red-500 hover:shadow transition-all"
          >
            <p className="text-sm font-medium text-center text-gray-700">
              {item.Name}
            </p>
          </a>
        ))}

        {/* Add New Category */}
        <button
          onClick={openModal}
          className="border p-4 flex flex-col items-center justify-center bg-gray-50 rounded-lg hover:shadow-md transition-all text-gray-700"
        >
          <CiCirclePlus className="w-6 h-6 mb-1 text-gray-500" />
          <span className="text-sm font-medium">Add New</span>
        </button>
      </section>

      {/* Modal */}
      <CollectionCatModal isOpen={isOpen} onClose={closeModal} refetch={refetch}  />
    </div>
  );
};

export default CollectionCategory;
