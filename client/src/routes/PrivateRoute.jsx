/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import {
  BeatLoading, BounceLoading, CircularLoading,
  ClockLoading, RotateLoading, SpinLoading,
  WaveLoading, DashLoading, CopperLoading
} from 'respinner'
const PrivateRoute = ({ children }) => {
  const { user, loading, isAuthChecked } = useContext(AuthContext);
  console.log('PrivateRoute: user, loading, isAuthChecked', user, loading, isAuthChecked);

  // Log current state to debug
// console.log(`PrivateRoute: user=${user?.email || 'null'}, loading=${loading}, isAuthChecked=${isAuthChecked}`);


  // CRUCIAL CHANGE: Wait until the initial auth check is complete AND loading is false
  if (loading || !isAuthChecked) {
    console.log('PrivateRoute: Still loading or initial auth check not complete. Showing loading indicator.');
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"><BounceLoading gap={5} /></span>
        <p className="text-xl ml-2">Loading authentication...</p>
      </div>
    );
  }

  // If initial auth check is complete, not loading, and no user, then redirect to login
  if (!user) {
    console.log('PrivateRoute: Not authenticated, redirecting to /login.');
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  console.log('PrivateRoute: Authenticated. Rendering children.');
  return children;
};

export default PrivateRoute;