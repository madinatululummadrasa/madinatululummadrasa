/* eslint-disable react/prop-types */

import Modal from "../../../components/ui/Modal";


const MemberUpdateModal = ({ isOpen, onClose, formData, onChange, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="সদস্য তথ্য পরিবর্তন করুন">
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="নাম"
          className="input input-bordered w-full"
        />

        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={onChange}
          placeholder="মোবাইল নম্বর"
          className="input input-bordered w-full"
        />

        <input
          type="text"
          name="nidNumber"
          value={formData.nidNumber}
          onChange={onChange}
          placeholder="জাতীয় পরিচয়পত্র নম্বর"
          className="input input-bordered w-full"
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="ঠিকানা"
          className="input input-bordered w-full"
        />

        <input
          type="text"
          name="fixedAmount"
          value={formData.fixedAmount}
          onChange={onChange}
          placeholder="নির্ধারিত পরিমাণ"
          className="input input-bordered w-full"
        />

        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="input input-bordered w-full"
        >
          <option value="সক্রিয়">সক্রিয়</option>
          <option value="নিষ্ক্রিয়">নিষ্ক্রিয়</option>
        </select>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn btn-success">আপডেট করুন</button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberUpdateModal;
