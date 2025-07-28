
import { CiCirclePlus } from "react-icons/ci";
import ShowAllEntities from "../Components/ShowAllEntities/ShowAllEntities";
import MemberUpdateModal from "./MemberUpdateModal";

import { Link } from "react-router-dom";



const AllMembers = () => {




    return (
        <div>
           
            <div className="flex justify-between items-center px-4 ">
                <h1 className="text-emerald-800 text-2xl text-center">সকল সদস্য তালিকা </h1>
                <Link to={"/accounts-dashboard/members/create-member"}>
                    <button

                        className="border p-2 flex space-x-1 items-center justify-center bg-gray-50 rounded-lg hover:shadow-md transition-all text-gray-700"
                    >
                        <CiCirclePlus className="w-6 h-6 mb-1 text-gray-500" />
                        <span className="text-sm font-medium">নতুন সদস্য</span>
                    </button>
                </Link>
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
