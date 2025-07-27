// components/EditClassModal.jsx

import PropTypes from "prop-types";
import Modal from "../../../../components/ui/Modal";

const ClassUpdateModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
}) => {

  console.log("formData in modal", formData);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ক্লাস আপডেট করুন">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">শ্রেনির নাম</label>
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
          <label className="block mb-1">ভর্তি ফি</label>
          <input
            type="text"
            name="AdmissionFee"
            className="w-full border rounded px-3 py-1"
            value={formData.AdmissionFee}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block mb-1">সেশন ফি</label>
          <input
            type="text"
            name="sesionFee"
            className="w-full border rounded px-3 py-1"
            value={formData.sesionFee}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block mb-1">পরিক্ষার ফি</label>
          <input
            type="text"
            name="firstExamFee"
            placeholder="প্রথম সাময়িক"
            className="w-1/3 border rounded px-3 py-1"
            value={formData.firstExamFee}
            onChange={onChange}
          />
          <input
            type="text"
            name="secondExamFee"
            placeholder="দ্বিতীয় সাময়িক"
            className="w-1/3 border rounded px-3 py-1"
            value={formData.secondExamFee}
            onChange={onChange}
          />
          <input
            type="text"
            name="finalExamFee"
            placeholder="বার্ষিক"
            className="w-1/3 border rounded px-3 py-1"
            value={formData.finalExamFee}
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

    </Modal>
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
