/* eslint-disable react/prop-types */
// 📄 ResultPdfGenerator.jsx
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResultPdf from "./ResultPdf";

// 🧾 Props: filteredResults, subjects, selectedClass, selectedExam, selectedYear
const ResultPdfGenerator = ({
    filteredResults,
  subjects,
  selectedClass,
  selectedExam,
  selectedYear,
}) => {
  return (
    <PDFDownloadLink
      document={
        <ResultPdf
          filteredResults={filteredResults}
          subjects={subjects}
          selectedClass={selectedClass}
          selectedExam={selectedExam}
          selectedYear={selectedYear}
        />
      }
      fileName={`${selectedClass}_${selectedExam}_results.pdf`}
    >
      {({ loading }) =>
        loading ? "Generating PDF..." : "Download Result PDF"
      }
    </PDFDownloadLink>
  );
};

export default ResultPdfGenerator;
