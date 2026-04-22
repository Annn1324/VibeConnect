import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authStorage';

export default function RedirectIfAuthenticated() {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
