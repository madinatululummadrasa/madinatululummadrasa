import PropTypes from 'prop-types'

import LoadingSpinner from '../hooks/LoadingSpinner/LoadingSpinner';
import useRole from '../hooks/useRole';

const StudentRoute = ({ children }) => {
    const [role, isLoading] = useRole()

    if (isLoading) return <LoadingSpinner></LoadingSpinner>
    if (role === 'student') return children
   
};
export default StudentRoute;
StudentRoute.propTypes = {
    children: PropTypes.element, 
}
