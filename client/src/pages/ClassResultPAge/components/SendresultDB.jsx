import { axiosSecure } from '../../../hooks/useAxiosSecure';
import PropTypes from 'prop-types';

const SendresultDB = ({ filteredResults, selectedExam, selectedYear }) => {
console.log("FilteredResults", filteredResults);
    const sendResultToDB = async () => {
        try {
            const response = await axiosSecure.post('/upload-results', {
                results: filteredResults,
                exam: selectedExam,
                year: selectedYear
            });

            if (response.status === 200) {
                console.log('Results sent to the database successfully');
            } else {
                console.error('Failed to send results to the database');
            }
        } catch (error) {
            console.error('Error sending results to the database:', error);
        }
    };

    return (
        <div>
            <button onClick={sendResultToDB} className='btn'>Upload Result to database</button>
        </div>
    );
};

SendresultDB.propTypes = {
    FilteredResults: PropTypes.array.isRequired,
    selectedExam: PropTypes.string.isRequired,
    selectedYear: PropTypes.string.isRequired,
};

export default SendresultDB;
