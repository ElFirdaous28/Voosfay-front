import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { Search } from 'lucide-react';
import api from '../../Services/api';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

export default function ReportsManagement() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statutFilter, setStatutFilter] = useState('');

    const fetchReports = async () => {
        try {
            const response = await api.get('v1/reports', {
                params: {
                    search: searchTerm,
                    status: statutFilter
                }
            });
            console.log(response.data.reports);
            setReports(response.data.reports);
            setLoading(false);
        } catch (error) {
            console.log("error fetching users", error);
        }
    }
    useEffect(() => {
        fetchReports();
    }, [searchTerm, statutFilter])

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'warned':
                return 'bg-orange-100 text-orange-800';
            case 'suspended':
                return 'bg-orange-100 text-orange-800';
            case 'blocked':
                return 'bg-red-100 text-red-800';
            case 'dismissed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return (<Layout><Spinner /></Layout>);

    return (
        <Layout title="Report Management">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
                        Report Management
                    </h2>
                    <div className="relative">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search by users..."
                                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
                        </div>
                    </div>
                    <select
                        className="ml-4 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={statutFilter}
                        onChange={(e) => setStatutFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                {/* Reports Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-cyan-500">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    Reported User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    Reported By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {reports?.map((report) => (
                                <tr key={report.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/profile/ratings/${report.reported_user.id}`} className="text-sm font-medium text-gray-900 dark:text-white">
                                            {report.reported_user.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <Link to={`/profile/ratings/${report.reporter.id}`} className="text-sm font-medium text-gray-900 dark:text-white">
                                            {report.reporter.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {report.reason.length > 30 ? report.reason.substring(0, 30) + '...' : report.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {report.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/admin/reports/${report.id}`} className='text-blue-400 hover:underline'>See Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
