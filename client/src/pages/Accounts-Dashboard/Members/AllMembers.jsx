
import { CiCirclePlus } from "react-icons/ci";
import ShowAllEntities from "../Components/ShowAllEntities/ShowAllEntities";
import MemberUpdateModal from "./MemberUpdateModal";
import CreateMemeber from "./CreateMemeber";
import { useState } from "react";



const AllMembers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // This function will now toggle the modal's visibility
    const toggleModal = () => {
        setIsModalOpen(prevState => !prevState); // Toggles true to false, and false to true
    };

    // The closeModal function is still useful for the modal to close itself
    const closeModal = () => {
        setIsModalOpen(false);
    };



    return (
        <div>
             {isModalOpen && <CreateMemeber isOpen={isModalOpen} onClose={closeModal}  />}
            <div className="flex justify-between items-center px-4 ">
                <h1 className="text-emerald-800 text-2xl text-center">সকল সদস্য তালিকা </h1>
                <button
                    onClick={toggleModal}
                    className="border p-2 flex space-x-1 items-center justify-center bg-gray-50 rounded-lg hover:shadow-md transition-all text-gray-700"
                >
                    <CiCirclePlus className="w-6 h-6 mb-1 text-gray-500" />
                    <span className="text-sm font-medium">নতুন সদস্য</span>
                </button>
            </div>
            <ShowAllEntities
                entityKey="members"
                fetchUrl="/members"

                columns={[
                    { label: "নাম", key: "name" },
                    { label: "মোবাইল", key: "contact" },
                    { label: "ঠিকানা", key: "address" },
                    { label: "পরিচয়পত্র", key: "nidNumber" },
                    { label: "পরিমাণ", key: "fixedAmount", suffix: " ৳" },
                    { label: "অবস্থা", key: "status" },
                ]}
                ModalComponent={MemberUpdateModal}
                defaultFormData={{
                    name: "",
                    contact: "",
                    nidNumber: "",
                    address: "",
                    fixedAmount: "",
                    status: "সক্রিয়",
                }}
                extractFormData={(member) => ({
                    name: member.name,
                    contact: member.contact,
                    nidNumber: member.nidNumber,
                    address: member.address,
                    fixedAmount: member.fixedAmount,
                    status: member.status,
                })}
            />

            

        </div>

    );
};

export default AllMembers;
