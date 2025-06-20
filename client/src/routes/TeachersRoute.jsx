import PropTypes from 'prop-types'

import LoadingSpinner from '../hooks/LoadingSpinner/LoadingSpinner';
import useRole from '../hooks/useRole';

const TeachersRoute = ({ children }) => {
    const [role, isLoading] = useRole()

    if (isLoading) return <LoadingSpinner></LoadingSpinner>
    if (role === 'teacher') return children

};
export default TeachersRoute;
TeachersRoute.propTypes = {
    children: PropTypes.element,
}
