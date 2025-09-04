import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getRole } from "../utils/auth";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const role = getRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
