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

    // check auth function
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const { data } = await api.get('v1/user');
                    setUser(data);
                    setIsAuthenticated(true);
                } catch (err) {
                    logout();
                    navigate('/login');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [token]);

    // 
    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, [token]);

    // Login action
    const login = async (email, password) => {
        const response = await api.post("v1/login", { email, password });        
        const token = response.data.token;

        localStorage.setItem("token", token);
        setToken(token);
        setIsAuthenticated(true);
        navigate("/dashboard");
    };

    // Register action
    const register = async ({ name, email, password, password_confirmation }) => {
        const response = await api.post("/v1/register", {
            name,
            email,
            password,
            password_confirmation,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);
        setToken(token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate("/dashboard");
    };

    // Logout action
    const logout = async () => {
        await api.post("v1/logout");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
    };
    const contextValue = useMemo(() => ({
        login,
        register,
        logout,
        user,
        token,
        isAuthenticated,
        // hasRole,
        loading
    }), [user, token, isAuthenticated, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);