import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const UnauthenticatedRoute = ({ element }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Spinner />

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return element;
};

export default UnauthenticatedRoute;