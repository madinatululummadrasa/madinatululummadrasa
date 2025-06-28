/* eslint-disable no-unused-vars */
import { useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery";


const AddCollection = () => {

    const [successMessage, setSuccessMessage] = useState("");
    const initialValues = {
        admissionDate: "",
        incomeSource: "",
        month: "",
        amount: "",
        details: ""
    };
    const { data: collectionCategories = [], isLoading, error, refetch } = useFetchQuery({
        key: ["collectionCategories"],
        url: "/collections/collection-category",
    });

    const CollectionFields = [

        { name: "admissionDate", label: "collectioner  তারিখ", type: "date", required: true },
        { name: "incomeSource", label: "আয়ের খাত", required: true, type: "select", options: collectionCategories.map(c => c.Name) },
        { name: "month", label: "মাস", required: true, type: "select", options: ["1", "2", "3", "4", "5", "6"] },
        { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
        { name: "details", label: "বিস্তারিত", type: "textarea", required: false }
    ];
    const handleSuccess = () => {
        setSuccessMessage("collection সফলভাবে যোগ করা হয়েছে!");
    };

    return (
        <div>
            <ReusableForm
                endpoint="/collections"
                fields={CollectionFields}
                onSuccess={handleSuccess}
                initialValues={initialValues}
                buttonText="Collection যুক্ত করুন"
                grid={true}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
                buttons={[
                    { type: "reset", label: "রিসেট" },

                ]}
            />
        </div>
    );
};

export default AddCollection;