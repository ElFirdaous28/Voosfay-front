import { Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function Header({ setIsSidebarOpen, title = "Dashboard" }) {
    const { user } = useAuth();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userDropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="flex justify-between items-center h-16 px-6 bg-zinc-800 border-gray-700 shadow-md">
            <div className="flex items-center">
                <button
                    className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open sidebar">
                    <Menu size={24} />
                </button>
                <h1 className="ml-4 text-xl font-semibold text-white tracking-wide">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
                <NotificationDropdown />

                <div className="relative" ref={userDropdownRef}>
                    <button
                        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setShowUserDropdown(!showUserDropdown)}>
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-600 ring-2 ring-gray-500">
                            <img
                                src={user?.picture ? `http://127.0.0.1:8000/storage/${user.picture}` : "/images/default-avatar.png"}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-white text-sm font-medium hidden md:block">{user?.name || "User Name"}</span>
                        <ChevronDown size={16} className="text-gray-400 hidden md:block" />
                    </button>

                    {showUserDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Your Profile</a>
                            <a href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</a>
                            <div className="border-t border-gray-700 my-1"></div>
                            <a href="/logout" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Sign out</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}