/* eslint-disable no-unused-vars */
import DynamicFilterTable from "../../../../components/DynamicFiltering/DynamicFilterTable";
import useFetchQuery from "../../../../hooks/useFetchQuery";


const StudentsCollection = () => {
      const { data: collection = [], isLoading, error, refetch } = useFetchQuery({
    key: ["collections"],
    url: "/collections",
  });


  // Example: allowed income sources
const allowedSources = ["ভর্তি ফি", "পরীক্ষার ফি","সেশন ফি", "বেতন","বই-খাতা"];

// Pre-filter your collection
const filteredCollection = collection.filter(item =>
  allowedSources.includes(item.incomeSource)
);




    return (
        <div>
          {/* Example Usage of DynamicFilterTable */}
      <DynamicFilterTable
        data={filteredCollection} // used for filter dropdowns
        tabledata={[...filteredCollection]} // or some modified/cleaned version
        dateField="admissionDate"
        includeKeys={['incomeSource', 'month', 'collector', 'class','amount']}
        excludeKeys={['', 'notes']}
      />
        </div>
    );
};

export default StudentsCollection;