/* eslint-disable no-unused-vars */
import DynamicFilterTable from "../../../../components/DynamicFiltering/DynamicFilterTable";
import useFetchQuery from "../../../../hooks/useFetchQuery";


const CollectionReport = () => {

  const { data: collection = [], isLoading, error, refetch } = useFetchQuery({
    key: ["collections"],
    url: "/collections",
  });

  const totalAmount = collection.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  console.log(totalAmount);
  return (
    <div>
      <h2>আয়ের তালিকা (ফিল্টারসহ)</h2> 
      {/* Example Usage of DynamicFilterTable */}
      <DynamicFilterTable
        data={collection} // used for filter dropdowns
        tabledata={[...collection]} // or some modified/cleaned version
        dateField="admissionDate"
        includeKeys={['incomeSource', 'month', 'collector', 'class','amount']}
        excludeKeys={['', 'notes']}
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