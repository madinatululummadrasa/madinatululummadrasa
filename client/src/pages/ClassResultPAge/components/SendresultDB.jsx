
import { axiosSecure } from '../../../hooks/useAxiosSecure';

const SendresultDB = (FilteredResults) => {

    const { filteredResults } = FilteredResults;
    console.log("the Filterdert ", filteredResults)
    const sendResultToDB = async () => {
        try {
            const response = await axiosSecure.post('/upload-results', {
                filteredResults,
            })

            if (response.status === 200) {
                // Handle success
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

export default SendresultDB;