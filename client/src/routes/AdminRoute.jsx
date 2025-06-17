import PropTypes from 'prop-types'



import LoadingSpinner from '../hooks/LoadingSpinner/LoadingSpinner';
import useRole from '../hooks/useRole';

const AdminRoute = ({ children }) => {
    const [role, isLoading] = useRole()

    if (isLoading) return <LoadingSpinner></LoadingSpinner>
    if (role === 'admin') return children
   
};
export default AdminRoute;
AdminRoute.propTypes = {
    children: PropTypes.element, 
}
