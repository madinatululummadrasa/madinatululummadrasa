
import ShowAllEntities from "../Components/ShowAllEntities/ShowAllEntities";
import MemberUpdateModal from "./MemberUpdateModal";

const AllMembers = () => {
 return (
    <ShowAllEntities
      entityKey="members"
      fetchUrl="/members"
      title="সকল সদস্য তালিকা"
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
  );
};

export default AllMembers;
