import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  console.log("hello");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;