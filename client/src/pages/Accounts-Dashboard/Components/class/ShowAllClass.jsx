import { useState, useCallback } from "react";
import useFetchQuery from "../../../../hooks/useFetchQuery";
import { Pencil } from "lucide-react";



const ShowAllClass = () => {
    const { data: classes = [], isLoading, error } = useFetchQuery({
        key: ["classes"],
        url: "/classes",
    });

    



    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong</p>;

    return (
        <div className="p-4">
       

            <table className="w-full border border-collapse">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="p-2 border text-left">শ্রেণীর তথ্য</th>
                        <th className="p-2 border text-left">পরিবর্তন</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((cls) => (
                        <tr key={cls._id} className="border">
                            <td className="p-2 border">
                                <p>নামঃ {cls.className}</p>
                                <p>অবস্থা: {cls.status}</p>
                            </td>
                            <td className="p-2 border text-center">
                                <button className="text-blue-600 hover:text-blue-800">
                                    <Pencil size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowAllClass;
