/* eslint-disable react/prop-types */

import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className=" text-gray-600 hover:text-red-600"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        {title && (
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            {title}
          </h2>
        )}

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
