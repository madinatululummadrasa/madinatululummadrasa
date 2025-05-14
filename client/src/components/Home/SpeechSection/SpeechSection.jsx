
import Container from '../../Shared/Container';
import SpeechCard from '../../../pages/Speech/Components/SpeechCard';

import ImportantLinks from '../../../pages/Speech/Components/ImportantLinks';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const SpeechSection = () => {


    return (
        <div className='mt-8'>
            <Container >
                <Divider textAlign="left" className=' text-3xl font-bold'>মাদ্রাসা পরিচালকদের বাণী</Divider>
                <div className='flex flex-col sm:flex-row md:flex-row  gap-16  justify-between'>
                    <div className='w-3/5'>
                        <SpeechCard></SpeechCard>
                        <div className='flex justify-center'>
                            <Link to={"/speech"}>
                                <button className="mt-6 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition duration-200">
                                    সকল বাণী দেখুন
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div>

                    </div>
                    <div className='w-2/5'>

                        <ImportantLinks></ImportantLinks>
                    </div>

                </div>
                <div>

                </div>

            </Container>
        </div>
    );
};

export default SpeechSection;