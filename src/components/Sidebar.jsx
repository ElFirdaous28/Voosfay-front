import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Car, List, Users, Star, CreditCard, Flag, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    }, [location.pathname, setIsOpen]);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const isAdmin = user?.role === "admin";

    const MenuLink = ({ to, icon: Icon, text }) => (
        <Link
            to={to}
            className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 group ${isActive(to)
                ? "bg-blue-600 text-white font-medium"
                : "text-gray-300 hover:bg-gray-700"
                }`}>
            <Icon size={20} className={`${isActive(to) ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
            <span className="ml-3">{text}</span>
        </Link>
    );

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)} />
            )}

            <aside
                className={`fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                            <Car size={20} className="text-white" />
                        </div>
                        <h2 className="ml-2 text-xl font-bold text-white">RideShare</h2>
                    </div>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="py-4 px-3 overflow-y-auto h-[calc(100%-4rem)] border-r border-gray-700 ">
                    <div className="space-y-1 mt-10">
                        {!isAdmin && (<div className="border-gray-700 space-y-2">
                            <MenuLink to="/search-rides" icon={Search} text="Search Rides" />
                            <MenuLink to="/offer-ride" icon={Car} text="Offer a Ride" />
                            <MenuLink to="/my-offered-rides" icon={List} text="My Offered Rides" />
                            <MenuLink to="/my-joined-rides" icon={List} text="My Joined Rides" />
                            <MenuLink to="/ratings" icon={Star} text="Ratings & Reviews" />
                            <MenuLink to="/payments" icon={CreditCard} text="Payments" />
                            <MenuLink to="/reports" icon={Flag} text="Reports" />
                        </div>)}

                        {/* admin links */}
                        {isAdmin && (
                            <div className="border-gray-700 space-y-2">
                                <div className="space-y-1">
                                    <MenuLink to="/dashboard" icon={Home} text="Dashboard" />
                                    <MenuLink to="/admin/users" icon={Users} text="Users" />
                                    <MenuLink to="/admin/rides" icon={Car} text="Rides" />
                                    <MenuLink to="/admin/reports" icon={Flag} text="Reports" />
                                    <MenuLink to="/admin/payments" icon={CreditCard} text="Payments" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-700">
                        <button
                            onClick={logout}
                            className="flex items-center w-full py-3 px-4 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                            <LogOut size={20} className="text-gray-400" />
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}