
import { Container, Divider } from '@mui/material';
import useTeachers from '../../../hooks/useTeachers';
import TeachersCard from '../../../pages/Teachers/Components/TeachersCard';

const TeachersSection = () => {
     const { teachers } = useTeachers();
    return (
        <Container>
            <div className='mt-6'>
                    <Divider textAlign="left" className=' text-3xl font-bold'> মাদ্রাসার শিক্ষক মন্ডলী</Divider>
            </div>
           <div className=' grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6'>
            {teachers.map((teacher) => (
                        <div className='' key={teacher._id}>
                            <TeachersCard

                                designation={teacher.designation}
                                address={teacher.address}
                                joiningDate={teacher.joiningDate}
                                name={teacher.name}
                                phone={teacher.phone}
                                profileImageUrl={teacher.profileImageUrl}
                                teachersId={teacher.teachersId}
                                group={teacher.group}
                            />
                        </div>
                    ))}
           </div>
        </Container>
    );
};

export default TeachersSection;