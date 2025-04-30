import React, { useState } from 'react';
import Layout from '../Layout';
import { Search, AlertTriangle, Ban, Trash2, UserCheck, Clock } from 'lucide-react';

export default function UserManagement() {
    // Dummy data for users
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            status: 'active',
            joinDate: '2023-01-15',
            lastActive: '2023-04-28',
            reports: 2
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            status: 'active',
            joinDate: '2023-02-20',
            lastActive: '2023-04-25',
            reports: 0
        },
        {
            id: 3,
            name: 'Michael Brown',
            email: 'michael@example.com',
            status: 'suspended',
            joinDate: '2023-03-10',
            lastActive: '2023-04-15',
            reports: 5
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            status: 'blocked',
            joinDate: '2023-01-05',
            lastActive: '2023-03-20',
            reports: 8
        },
        {
            id: 5,
            name: 'Robert Johnson',
            email: 'robert@example.com',
            status: 'active',
            joinDate: '2023-02-28',
            lastActive: '2023-04-27',
            reports: 1
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalAction, setModalAction] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle user action (block, delete, warn)
    const handleUserAction = (action, user) => {
        setSelectedUser(user);
        setModalAction(action);
        setShowModal(true);
    };

    // Confirm action
    const confirmAction = () => {
        let updatedUsers = [...users];

        switch (modalAction) {
            case 'block':
                updatedUsers = updatedUsers.map(user =>
                    user.id === selectedUser.id ? { ...user, status: 'blocked' } : user
                );
                setNotificationMessage(`${selectedUser.name} has been blocked.`);
                break;
            case 'suspend':
                updatedUsers = updatedUsers.map(user =>
                    user.id === selectedUser.id ? { ...user, status: 'suspended' } : user
                );
                setNotificationMessage(`${selectedUser.name} has been temporarily suspended.`);
                break;
            case 'delete':
                updatedUsers = updatedUsers.filter(user => user.id !== selectedUser.id);
                setNotificationMessage(`${selectedUser.name}'s account has been deleted.`);
                break;
            case 'warn':
                setNotificationMessage(`Warning sent to ${selectedUser.name}.`);
                setWarningMessage('');
                break;
            case 'activate':
                updatedUsers = updatedUsers.map(user =>
                    user.id === selectedUser.id ? { ...user, status: 'active' } : user
                );
                setNotificationMessage(`${selectedUser.name}'s account has been activated.`);
                break;
            default:
                break;
        }

        setUsers(updatedUsers);
        setShowModal(false);

        // Clear notification after 3 seconds
        setTimeout(() => {
            setNotificationMessage('');
        }, 3000);
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'suspended':
                return 'bg-yellow-100 text-yellow-800';
            case 'blocked':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout title="User Management">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
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

                {/* Notification */}
                {notificationMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                        {notificationMessage}
                    </div>
                )}

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Reports
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
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
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.reports > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.reports}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUserAction('warn', user)}
                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                title="Warn User">
                                                <AlertTriangle size={18} />
                                            </button>

                                            {user.status === 'active' ? (
                                                <button
                                                    onClick={() => handleUserAction('suspend', user)}
                                                    className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                                    title="Suspend User">
                                                    <Clock size={18} />
                                                </button>
                                            ) : null}

                                            {user.status !== 'blocked' ? (
                                                <button
                                                    onClick={() => handleUserAction('block', user)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    title="Block User">
                                                    <Ban size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUserAction('activate', user)}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                    title="Activate User">
                                                    <UserCheck size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleUserAction('delete', user)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete User">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Confirmation Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Confirm Action
                            </h3>
                            <div className="text-gray-600 dark:text-gray-400 mb-6">
                                {modalAction === 'block' && `Are you sure you want to block ${selectedUser.name}? They will not be able to access their account.`}
                                {modalAction === 'suspend' && `Are you sure you want to temporarily suspend ${selectedUser.name}? They will not be able to access their account for a period of time.`}
                                {modalAction === 'delete' && `Are you sure you want to delete ${selectedUser.name}'s account? This action cannot be undone.`}
                                {modalAction === 'warn' && (
                                    <div>
                                        <div className="mb-3">Send a warning to {selectedUser.name} about their behavior:</div>
                                        <textarea
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-cyan-500 focus:border-cyan-500 mb-3"
                                            rows="3"
                                            placeholder="Enter warning message..."
                                            value={warningMessage}
                                            onChange={(e) => setWarningMessage(e.target.value)} />
                                    </div>
                                )}
                                {modalAction === 'activate' && `Are you sure you want to activate ${selectedUser.name}'s account? They will regain access to their account.`}
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}