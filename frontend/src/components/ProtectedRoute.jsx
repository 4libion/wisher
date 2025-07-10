import { Navigate } from "react-router-dom";
import { getAccessToken } from "../auth/AuthService";

const ProtectedRoute = ({ children }) => {
    return getAccessToken() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute