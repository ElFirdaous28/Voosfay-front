import React, { useEffect, useState, useRef } from 'react';
import Layout from '../Layout';
import { Search, Ban, Trash2, UserCheck, Clock, UserSearch } from 'lucide-react';
import api from '../../Services/api';
import { format } from 'date-fns';
import { useConfirmation } from '../../context/ConfirmationDialogContext';
import { userService } from '../../Services/userService';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const { openDialog } = useConfirmation();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [suspendDuration, setSuspendDuration] = useState(1);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdownId(null);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (userId) => {
        setActiveDropdownId(activeDropdownId === userId ? null : userId);
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('v1/admin/users');
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.log("error fetching users", error);
            toast.error('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (userId) => {
        openDialog({
            title: 'Delete user',
            message: 'Are you sure you want to delete this user?',
            actionType: 'delete',
            confirmText: 'Delete'
        }, async () => {
            const success = await userService.delete(userId);
            if (success) {
                toast.success('User deleted');
                fetchUsers();
            }
            else toast.error('Failed to delete user');
        });
    };

    const handleBan = (userId) => {
        openDialog({
            title: 'Ban user',
            message: 'Are you sure you want to ban this user?',
            actionType: 'ban',
            confirmText: 'Ban'
        }, async () => {
            const success = await userService.changeStatus(userId, { 'status': 'banned' });
            if (success) {
                toast.success('User banned');
                fetchUsers();
            }
            else toast.error('Failed to ban user');
        });
    };

    const handleActivate = (userId) => {
        openDialog({
            title: 'Activate user',
            message: 'Are you sure you want to activate this user?',
            actionType: 'activate',
            confirmText: 'Activate'
        }, async () => {
            const success = await userService.changeStatus(userId, { 'status': 'active' });
            if (success) {
                toast.success('User activated');
                fetchUsers();
            }
            else toast.error('Failed to activate user');
        });
    };

    const handleSuspend = (userId, duration) => {
        setSuspendDuration(duration);
        setActiveDropdownId(null);
        console.log(duration);
        
        
        openDialog({
            title: 'Suspend user',
            message: `Are you sure you want to suspend this user for ${duration} ${duration === '1' ? 'day' : 'days'}?`,
            actionType: 'suspend',
            confirmText: 'Suspend'
        }, async () => {
            const success = await userService.changeStatus(userId, { 
                'status': 'suspended', 
                'suspend_duration': parseInt(duration) 
            });
            
            if (success) {
                toast.success('User suspended');
                fetchUsers();
            }
            else toast.error('Failed to suspend user');
        });
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'suspended':
                return 'bg-yellow-100 text-yellow-800';
            case 'banned':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return (<Layout><Spinner /></Layout>);

    return (
        <Layout title="User Management">
            <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
                        User Management
                    </h2>
                    <div className="relative">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
                        </div>
                    </div>
                </div>

                {/* users table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-cyan-500">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">
                                    Reports
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {user.created_at ? format(new Date(user.created_at), 'MMMM dd, yyyy') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-full ${user.reports_against_count > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.reports_against_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2 relative">
                                            <Link to={`/profile/ratings/${user.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                title="View Profile">
                                                <UserSearch size={18} />
                                            </Link>

                                            {['suspended', 'banned'].includes(user.status) && (
                                                <button
                                                    onClick={() => handleActivate(user.id)}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                                    title="Activate User">
                                                    <UserCheck size={18} />
                                                </button>
                                            )}

                                            {user.status === 'active' && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => toggleDropdown(user.id)}
                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 cursor-pointer"
                                                        title="Suspend User">
                                                        <Clock size={18} />
                                                    </button>

                                                    {activeDropdownId === user.id && (
                                                        <div ref={dropdownRef} className="absolute z-10 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 w-36">
                                                            <div className="py-1 px-3 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                                                Suspend duration
                                                            </div>
                                                            <button onClick={() => handleSuspend(user.id, '1')} 
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                1 Day
                                                            </button>
                                                            <button onClick={() => handleSuspend(user.id, '3')} 
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                3 Days
                                                            </button>
                                                            <button onClick={() => handleSuspend(user.id, '7')} 
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                1 Week
                                                            </button>
                                                            <button onClick={() => handleSuspend(user.id, '30')} 
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                1 Month
                                                            </button>
                                                            <button onClick={() => handleSuspend(user.id, '60')} 
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                2 Months
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {user.status !== 'banned' && (
                                                <button
                                                    onClick={() => handleBan(user.id)}
                                                    className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300 cursor-pointer"
                                                    title="Ban User">
                                                    <Ban size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                                                title="Delete User">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}