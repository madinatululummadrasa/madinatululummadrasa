import React, { useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import TeachersCard from '../Components/TeachersCard';
import Container from '../../../components/Shared/Container';

const TeachersList = () => {
    const axiosSecure = useAxiosSecure();

    const [teachers, setTeachers] = React.useState([]);
    console.log(teachers)
  

    // ✅ Fetch teachers data from MongoDB
    useEffect(() => {
        axiosSecure
            .get("http://localhost:8000/teachers", { withCredentials: true })
            .then((res) => {
                setTeachers(res.data);
            })
            .catch((err) => {
                console.error("Error fetching students:", err);
            });
    }, []);


    return (


        
          <Container>
              <div className=" grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 ">
                {teachers.map((teacher) => (
                    <TeachersCard
                        key={teacher._id}
                        designation={teacher.designation}
                        address={teacher.address}
                        joiningDate={teacher.joiningDate}
                        name={teacher.name}
                        phone={teacher.phone}
                        profileImageUrl={teacher.profileImageUrl}
                        teachersId={teacher.teachersId}
                        group={teacher.group}
                    />
                ))}
            </div>
          </Container>
       
        
    );
};

export default TeachersList;