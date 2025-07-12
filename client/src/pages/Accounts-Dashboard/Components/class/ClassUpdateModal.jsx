// components/EditClassModal.jsx
import { Dialog } from "@headlessui/react";
import PropTypes from "prop-types";

const ClassUpdateModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
}) => {

  console.log("formData in modal", formData);
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-4">শ্রেণী পরিবর্তন</Dialog.Title>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">নাম</label>
              <input
                type="text"
                name="className"
                className="w-full border rounded px-3 py-1"
                value={formData.className}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="block mb-1">বেতন</label>
              <input
                type="text"
                name="fee"
                className="w-full border rounded px-3 py-1"
                value={formData.fee}
                onChange={onChange}
              />
            </div>


            <div>
              <label className="block mb-1">অবস্থা</label>
              <select
                name="status"
                className="w-full border rounded px-3 py-1"
                value={formData.status}
                onChange={onChange}
              >
                <option value="সক্রিয়">সক্রিয়</option>
                <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                আপডেট
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

ClassUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ClassUpdateModal;
