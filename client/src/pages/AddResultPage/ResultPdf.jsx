// 📄 ResultPdf.jsx

/* eslint-disable react/prop-types */
// useCodeComments()
/**
 * 📄 ResultPdf.jsx
 *
 * 🔧 Purpose: Render a class-wise result PDF matching screenshot design with Bengali support.
 *
 * 🧩 Props:
 * - filteredResults (array): Student data including name, subjects, total, rank.
 * - subjects (array): Subject names to generate table columns.
 * - selectedClass, selectedYear, selectedExam (string): Metadata for the top section.
 *
 * 🛠️ Tools:
 * - @react-pdf/renderer for PDF generation.
 * - Custom Bengali font via CDN.
 *
 * 🎯 Best Practices:
 * - Dynamic subject columns.
 * - Responsive Bengali font.
 * - Screenshot-matching layout.
 */


import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";

// 📌 Register Bengali font
Font.register({
    family: "NotoBengali",
    src: "public/fonts/NotoSansBengali_Condensed-Regular.ttf", // served statically from public folder
});


// 🎨 Styles
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: "NotoBengali",
    },
    logo: {
        width: 60,
        height: 60,
        alignSelf: "center",
        marginBottom: 5,
    },
    header: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",

    },
    infoRow: {
        textAlign: "center",
        marginBottom: 10,
    },
    table: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid black",
    },
    cell: {
        padding: 5,
        borderRight: "1px solid black",
        textAlign: "center",
        // width: "90px",
    },
    nameColumn: {
        width: "120px",
        textAlign: "left",
        fontWeight: "bold",
        paddingLeft: 5,
        borderRight: "1px solid black",
        padding: 5,
    },
});

// 📄 PDF Component
const ResultPdf = ({
    filteredResults,
    subjects,
    selectedClass,
    selectedYear,
    selectedExam,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* 🖼️ Logo */}
            <Image src="../../../public/logom.jpg" style={styles.logo} />

            {/* 🏫 Title */}
            <Text style={styles.header}>মাদিনাতুল উলুম মাদরাসা </Text>

            {/* 📚 Info */}
            <Text style={styles.infoRow}>
                Class: {selectedClass} | Exam: {selectedExam} | Year: {selectedYear} | Session: {selectedYear}
            </Text>

            {/* 📊 Table */}
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                <Text style={{ ...styles.cell, width: 60 }}>ক্রমিক</Text> {/* New Column */}
                    <Text style={styles.nameColumn}>নাম</Text>
                    {Array.isArray(subjects) &&
                        subjects.map((subject, index) => (
                            <Text key={index} style={{ ...styles.cell, width: 90 }}>
                                {subject}
                            </Text>
                        ))}
                    <Text style={{ ...styles.cell, width: 60 }}>মোট </Text>
                   
                    <Text style={{ ...styles.cell, width: 50 }}>নতুন ক্রমিক</Text>
                </View>

                {/* Data Rows */}
                {filteredResults.map((student, index) => (
                    console.log(student),
                    <View key={index} style={styles.tableRow}>
                         <Text style={{ ...styles.cell, width: 60 }}>{student.roll ?? ""}</Text> {/* New Column */}
                        <Text style={styles.nameColumn}>{student.name}</Text>
                        {Array.isArray(subjects) &&
                            subjects.map((subject, idx) => (
                                <Text key={idx} style={{ ...styles.cell, width: 90 }}>
                                    {student.subjects.find(([subName]) => subName === subject)?.[1] ?? 0}

                                </Text>
                            ))}

                        <Text style={{ ...styles.cell, width: 60 }}>{student.total}</Text>
                       
                        <Text style={{ ...styles.cell, width: 50 }}>{student.newRoll}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default ResultPdf;
