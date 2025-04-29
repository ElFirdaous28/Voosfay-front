import React, { useState, useEffect } from 'react';
import {
    Users,
    Car,
    TrendingUp,
    AlertTriangle,
    DollarSign,
    UserCheck,
    Calendar,
    UserPlus,
    CheckCircle,
    XCircle,
    Clock,
    Star
} from 'lucide-react';
import Layout from './Layout';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const mockData = {
            "success": true,
            "data": {
                "users": {
                    "total": 7,
                    "new_this_month": 7,
                    "top_rated": [
                        {
                            "id": 3,
                            "name": "Uriah Herman",
                            "picture": null,
                            "reviews_given_avg_rating": null
                        },
                        {
                            "id": 7,
                            "name": "Uesr1",
                            "picture": null,
                            "reviews_given_avg_rating": null
                        },
                        {
                            "id": 6,
                            "name": "Sabina King IV",
                            "picture": "https://via.placeholder.com/640x480.png/00dd11?text=earum",
                            "reviews_given_avg_rating": 3.53
                        },
                        {
                            "id": 5,
                            "name": "Mr. Abdul Rempel Sr.",
                            "picture": "https://via.placeholder.com/640x480.png/003355?text=nemo",
                            "reviews_given_avg_rating": 3.5
                        },
                        {
                            "id": 1,
                            "name": "admin admin",
                            "picture": "",
                            "reviews_given_avg_rating": 3.4
                        }
                    ]
                },
                "rides": {
                    "total": 63,
                    "this_week": 63,
                    "total_reservations": 35,
                    "pending": 0,
                    "completed": 10,
                    "canceled": 0
                },
                "reports": {
                    "total": 3,
                    "resolved": 2
                },
                "payments": {
                    "total_received": "1285.42",
                    "this_month": "1285.42"
                }
            }
        };

        setTimeout(() => {
            setStats(mockData.data);
            setIsLoading(false);
        }, 800); // Simulate network delay
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-800 p-4 rounded-lg text-center">
                <AlertTriangle size={40} className="text-red-500 mx-auto mb-2" />
                <h3 className="text-red-200 text-lg font-semibold">Failed to load statistics</h3>
                <p className="text-red-300">{error}</p>
            </div>
        );
    }

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-zinc-800 rounded-xl p-5 shadow-lg border border-zinc-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total Users</h3>
                            <p className="text-4xl font-bold text-white mt-2">{stats.users.total}</p>
                        </div>
                        <div className="p-3 bg-indigo-500/20 rounded-lg">
                            <Users size={24} className="text-indigo-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <UserPlus size={16} className="text-green-400 mr-1" />
                        <span className="text-green-400 font-medium">{stats.users.new_this_month}</span>
                        <span className="text-gray-400 ml-1">new this month</span>
                    </div>
                </div>

                <div className="bg-zinc-800 rounded-xl p-5 shadow-lg border border-zinc-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total Rides</h3>
                            <p className="text-4xl font-bold text-white mt-2">{stats.rides.total}</p>
                        </div>
                        <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <Car size={24} className="text-cyan-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <Calendar size={16} className="text-cyan-400 mr-1" />
                        <span className="text-cyan-400 font-medium">{stats.rides.this_week}</span>
                        <span className="text-gray-400 ml-1">this week</span>
                    </div>
                </div>

                <div className="bg-zinc-800 rounded-xl p-5 shadow-lg border border-zinc-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Reports</h3>
                            <p className="text-4xl font-bold text-white mt-2">{stats.reports.total}</p>
                        </div>
                        <div className="p-3 bg-amber-500/20 rounded-lg">
                            <AlertTriangle size={24} className="text-amber-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <CheckCircle size={16} className="text-green-400 mr-1" />
                        <span className="text-green-400 font-medium">{stats.reports.resolved}</span>
                        <span className="text-gray-400 ml-1">resolved</span>
                    </div>
                </div>

                <div className="bg-zinc-800 rounded-xl p-5 shadow-lg border border-zinc-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total Revenue</h3>
                            <p className="text-4xl font-bold text-white mt-2">€{stats.payments.total_received}</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <DollarSign size={24} className="text-green-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <TrendingUp size={16} className="text-green-400 mr-1" />
                        <span className="text-green-400 font-medium">€{stats.payments.this_month}</span>
                        <span className="text-gray-400 ml-1">this month</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 rounded-xl p-5 shadow-lg border border-zinc-700">
                    <h3 className="text-lg font-semibold text-white mb-5 border-b border-gray-700 pb-2 flex items-center">
                        <Car size={20} className="mr-2 text-cyan-400" />
                        Ride Status
                    </h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-blue-500/20 mr-3">
                                    <Clock size={18} className="text-blue-400" />
                                </div>
                                <span className="text-gray-300">Pending</span>
                            </div>
                            <div className="bg-blue-900/20 text-blue-400 py-1 px-3 rounded-full font-medium">
                                {stats.rides.pending}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-green-500/20 mr-3">
                                    <CheckCircle size={18} className="text-green-400" />
                                </div>
                                <span className="text-gray-300">Completed</span>
                            </div>
                            <div className="bg-green-900/20 text-green-400 py-1 px-3 rounded-full font-medium">
                                {stats.rides.completed}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-red-500/20 mr-3">
                                    <XCircle size={18} className="text-red-400" />
                                </div>
                                <span className="text-gray-300">Canceled</span>
                            </div>
                            <div className="bg-red-900/20 text-red-400 py-1 px-3 rounded-full font-medium">
                                {stats.rides.canceled}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-purple-500/20 mr-3">
                                    <Users size={18} className="text-purple-400" />
                                </div>
                                <span className="text-gray-300">Total Reservations</span>
                            </div>
                            <div className="bg-purple-900/20 text-purple-400 py-1 px-3 rounded-full font-medium">
                                {stats.rides.total_reservations}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-800 rounded-xl p-5 shadow-lg border border-zinc-700 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-5 border-b border-gray-700 pb-2 flex items-center">
                        <UserCheck size={20} className="mr-2 text-cyan-400" />
                        Top Rated Users
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm">
                                    <th className="pb-3 font-medium">User</th>
                                    <th className="pb-3 font-medium">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-700">
                                {stats.users.top_rated.map(user => (
                                    <tr key={user.id} className="hover:bg-zinc-700/20">
                                        <td className="py-3 pl-1">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden mr-3 flex-shrink-0">
                                                    {user.picture ? (
                                                        <img
                                                            src="/api/placeholder/100/100"
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-cyan-800 text-white text-lg font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.name}</p>
                                                    <p className="text-gray-400 text-sm">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            {user.reviews_given_avg_rating ? (
                                                <div className="flex items-center bg-yellow-900/20 text-yellow-400 py-1 px-3 rounded-full inline-flex font-medium">
                                                    <Star size={16} className="mr-1 fill-yellow-400" />
                                                    {user.reviews_given_avg_rating.toFixed(1)}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic">No ratings</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}