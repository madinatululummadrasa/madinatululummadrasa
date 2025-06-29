/* eslint-disable no-unused-vars */
import { useState } from "react";
import ReusableForm from "../Components/ReusableForm/ReusableForm";
import useFetchQuery from "../../../hooks/useFetchQuery";
import useAuth from "../../../hooks/useAuth";


const AddCollection = () => {

    const { user } = useAuth();
    console.log(user);

    const formattedDate = new Date().toISOString().split("T")[0]; // "2025-06-29"


    const monthNames = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];

    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = monthNames[currentMonthIndex];

    const [successMessage, setSuccessMessage] = useState("");
    const initialValues = {
        admissionDate: formattedDate,
        incomeSource: "",
        month: currentMonthName,
        amount: "",
        details: "",
        colletioner: user?.displayName || "", // Use user's display name if available
        
        
    };
    const { data: collectionCategories = [], isLoading, error, refetch } = useFetchQuery({
        key: ["collectionCategories"],
        url: "/collections/collection-category",
    });

    const CollectionFields = [

        { name: "admissionDate", label: "collectioner  তারিখ", type: "date", required: true },
        { name: "incomeSource", label: "আয়ের খাত", required: true, type: "select", options: collectionCategories.map(c => c.Name) },
        { name: "month", label: "মাস", required: true, type: "select", options: monthNames },
        { name: "amount", label: "পরিমাণ", type: "number", required: true, min: 0 },
        { name: "colletioner", label: "কালেকশনকারী ", type: "text", required: true ,},
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