/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// components/EditClassModal.jsx
import { Dialog } from "@headlessui/react";
import PropTypes from "prop-types";
import ReusableForm from "../ReusableForm/ReusableForm";
import { useState } from "react";

const CollectionCatModal = ({
    isOpen,
    onClose,
    refetch

}) => {

    const [formData, setFormData] = useState({});


    const fields = [
        { name: "Name", label: "খাতের নাম", required: true },
        { name: "link", label: "টার্গেট লিংক", required: true },
        { name: "status", label: "অবস্থা", type: "select", options: ["সক্রিয়", "নিষ্ক্রিয়"] },
    ];

    const initialValues = {

        Name: "",
        link: "",
        status: "সক্রিয়",
    };
    const handleSuccess = () => {
        alert("✅ সফলভাবে সংরক্ষিত হয়েছে!");
        refetch(); 
        onClose();
    };



    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
                    <Dialog.Title className="text-xl font-semibold mb-4">শ্রেণী পরিবর্তন</Dialog.Title>
                    <ReusableForm
                        fields={fields}
                        initialValues={initialValues}
                        onSuccess={handleSuccess}
                        buttonText="Collection করুন"
                        endpoint="/collections/collection-category"
                      
                    />
             
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

// CollectionCatModal.propTypes = {
//     isOpen: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     formData: PropTypes.object.isRequired,
//     onChange: PropTypes.func.isRequired,
//     onSubmit: PropTypes.func.isRequired,
// };

export default CollectionCatModal;
