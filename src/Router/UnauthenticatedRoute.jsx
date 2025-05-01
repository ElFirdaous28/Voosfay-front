import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const UnauthenticatedRoute = ({ element }) => {
    const { isAuthenticated, loading, navigateToDefaultPage, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user?.role) {
            navigateToDefaultPage(user.role);
        }
    }, [isAuthenticated, user, navigateToDefaultPage]);


    if (isAuthenticated) return null;

    return element;
};

export default UnauthenticatedRoute;
