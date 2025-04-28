import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    }, [token]);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const { data } = await api.get('v1/user');
                    setUser(data);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error("Authentication check failed:", err);
                    localStorage.removeItem("token");
                    setToken(null);
                    setIsAuthenticated(false);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        };

        checkAuth();
    }, [token]);

    const navigateToDefaultPage = (role) => {
        if (role === 'admin') {
            navigate('/dashboard');
        } else if (role === 'user') {
            navigate('/search-rides');
        } else {
            navigate('/');
        }
    };

    // login
    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await api.post("v1/login", { email, password });
            const newToken = response.data.token;

            localStorage.setItem("token", newToken);
            setToken(newToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

            const { data: userData } = await api.get('v1/user');
            setUser(userData);
            setIsAuthenticated(true);
            setLoading(false);

            navigateToDefaultPage(userData.role);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setLoading(false);
            throw error;
        }
    };

    // register
    const register = async ({ name, email, password, password_confirmation }) => {
        try {
            setLoading(true);
            const response = await api.post("/v1/register", {
                name,
                email,
                password,
                password_confirmation,
            });

            const newToken = response.data.token;
            localStorage.setItem("token", newToken);
            setToken(newToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

            let userData;
            if (!response.data.user) {
                const { data } = await api.get('v1/user');
                console.log(userData);

                userData = data;
                setUser(userData);
            } else {
                userData = response.data.user;
                setUser(userData);
            }

            setIsAuthenticated(true);
            setLoading(false);

            navigateToDefaultPage(userData.role);
            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            setLoading(false);
            throw error;
        }
    };

    // logout
    const logout = async () => {
        setLoading(true);
        try {
            if (token) {
                await api.post("v1/logout");
            }
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            navigate("/login");
        }
    };

    const hasRole = (requiredRoles) => {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        if (!user?.role) return false;
        return requiredRoles.includes(user.role);
    };

    const contextValue = useMemo(() => ({
        login,
        register,
        logout,
        user,
        token,
        isAuthenticated,
        hasRole,
        navigateToDefaultPage,
        loading
    }), [user, token, isAuthenticated, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);