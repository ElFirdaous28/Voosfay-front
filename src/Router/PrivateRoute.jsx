import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const PrivateRoute = ({ role }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) return <Spinner />

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && !hasRole(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
