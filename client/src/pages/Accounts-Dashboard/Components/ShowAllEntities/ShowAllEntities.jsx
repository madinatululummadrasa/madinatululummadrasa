/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import useFetchQuery from "../../../../hooks/useFetchQuery";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";





const ShowAllEntities = ({
  entityKey, // eg. "classes"
  fetchUrl,  // eg. "/classes"
  title = "Entity List",
  columns = [], // [{ label: 'নাম', key: 'className' }, ...]
  getSubTable = null, // optional: (entity) => JSX
  ModalComponent, // Modal component
  defaultFormData = {}, // object
  extractFormData = (item) => item, // customize if needed
}) => {
  const { data = [], isLoading, error, refetch } = useFetchQuery({
    key: [entityKey],
    url: fetchUrl,
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const axiosSecure = useAxiosSecure();

  const openModal = (item) => {
    setSelectedItem(item);
    setFormData(extractFormData(item));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.patch(`/${entityKey}/${selectedItem._id}`, formData);
      toast.success("Updated successfully");
      refetch();
      closeModal();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (isLoading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-600">Something went wrong</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm text-center">
          <thead className="bg-emerald-600 text-white text-sm">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 border-r border-emerald-500">
                  {col.label}
                </th>
              ))}
              {getSubTable && (
                <th className="px-4 py-3 border-r border-emerald-500">অতিরিক্ত তথ্য</th>
              )}
              <th className="px-4 py-3 text-center">পরিবর্তন</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50 transition">
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3">
                    {item[col.key]} {col.suffix || ""}
                  </td>
                ))}
                {getSubTable && (
                  <td className="px-4 py-3">{getSubTable(item)}</td>
                )}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openModal(item)}
                    className="text-emerald-600 hover:underline flex items-center justify-center gap-1"
                  >
                    পরিবর্তন <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ModalComponent
        isOpen={isOpen}
        onClose={closeModal}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default ShowAllEntities;
