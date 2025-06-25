/* eslint-disable no-unused-vars */
import useFetchQuery from "../../../hooks/useFetchQuery";

const Students = () => {

      const { data: classes = [], isLoading, error, refetch } = useFetchQuery({
        key: ["students"],
        url: "/debug-students",
      });
   

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Students</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Something went wrong: {error.message}</p>
            ) : (
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Student ID</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Class</th>
                            <th className="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((student) => (
                            <tr key={student._id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{student.studentId}</td>
                                <td className="border px-4 py-2">{student.name}</td>
                                <td className="border px-4 py-2">{student.class}</td>
                                <td className="border px-4 py-2">{student.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Students;