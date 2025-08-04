/* eslint-disable no-unused-vars */
import DynamicFilterTable from "../../../../components/DynamicFiltering/DynamicFilterTable";
import useFetchQuery from "../../../../hooks/useFetchQuery";


const CollectionReport = () => {

  const { data: collection = [], isLoading, error, refetch } = useFetchQuery({
    key: ["collections"],
    url: "/collections",
  });
  return (
    <div>
      <h2>আয়ের তালিকা (ফিল্টারসহ)</h2>
       {/* Example Usage of DynamicFilterTable */}
      <DynamicFilterTable
        data={collection}
        dateField="admissionDate" // Specify the key that holds date strings
        includeKeys={[ 'incomeSource', 'month', 'collector', 'class',]} // Select specific columns to display and filter
        excludeKeys={['id', 'notes']} // Exclude 'id' and 'notes' from both display and dynamic filters
      />

        {/* <DynamicFilterTable
        data={collection}
        dateField="admissionDate"
        excludeKeys={["_id", "details", "donorPhone"]}
      /> */}
    </div>
  );
};

export default CollectionReport;