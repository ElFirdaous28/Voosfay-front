import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">
            Logout
        </button>
    );
};

export default LogoutButton;