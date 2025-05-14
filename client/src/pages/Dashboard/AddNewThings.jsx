import { Link } from 'react-router-dom';
import Container from '../../components/Shared/Container';

const items = [
    { label: 'Upload Notice', link: '/notice-upload' },
    { label: 'Add New Routine', link: '/routine-make' },
    { label: 'Add New Student', link: '/add-student' },
    { label: 'Add Attendence', link: '/students/attendance' },
    { label: 'Add Results', link: '/add-results' },
    { label: 'Add Teachers', link: '/add-teachers' },
    { label: 'Add New Routine', link: '/routine-make' },

];

const AddNewThings = () => {
    return (
        <div className="py-10  min-h-screen">
            <Container>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item, index) => (
                        <Link
                            to={item.link}
                            key={index}
                            className="group p-12 rounded-2xl shadow-md bg-[#22C55E] hover:bg-green-50 border  border-gray-200 hover:border-green-500 transition-all duration-300 ease-in-out"
                        >
                            <h1 className="text-xl  text-white font-bengali group-hover:text-green-600 transition-all duration-300  text-center">
                                {item.label}
                            </h1>
                        </Link>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default AddNewThings;
