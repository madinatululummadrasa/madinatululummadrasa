import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useFilteredResults } from "../../hooks/useFilteredResults";

const UpdateRoll = () => {
  const axiosSecure = useAxiosSecure();
  const { filteredResults } = useFilteredResults();

  const handleUpdateRolls = async () => {
    const payload = filteredResults.map(student => ({
      studentId: student.studentId,
      newRoll: student.newRoll
    }));

    try {
      await axiosSecure.put('/update-rolls', payload);
      alert('Rolls updated');
    } catch (error) {
      console.error(error);
      alert('Failed to update rolls');
    }
  };

  return (
    <div>
      <button onClick={handleUpdateRolls}>
        Update New Roll to Database
      </button>
    </div>
  );
};

export default UpdateRoll;
