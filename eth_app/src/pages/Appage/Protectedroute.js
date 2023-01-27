import { useContext} from 'react';
import {AuthContext} from '../../utils/AuthContext';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  
  const {allowed} = useContext(AuthContext);

  return allowed ? <Outlet /> : <Navigate to="/" />;

};

export default ProtectedRoutes;