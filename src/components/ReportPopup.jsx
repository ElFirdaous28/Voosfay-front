import React, { useState } from 'react';
import api from '../Services/api';
import { toast } from 'react-toastify';

const ReportPopup = ({ show, onClose, ride, reportedUserId }) => {
    const [report, setReport] = useState('');

    if (!show) return null;

    const handleReportSubmit = async () => {
        try {
            const response = await api.post('v1/reports', {
                reported_user_id: reportedUserId,
                reason: report
            })
            toast.success('report submitted successfully');
        } catch (error) {
            console.log('Error while reserving', error);
            toast.error(error);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-zinc-800 rounded-lg shadow-lg w-1/3 p-6">
                <div className="text-lg font-bold mb-4 text-white">Report Ride</div>
                <p className="text-white text-sm">Ride from {ride.start_location} to {ride.ending_location}</p>
                <textarea
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    placeholder="Describe the issue"
                    className="w-full p-2 mt-2 border border-gray-600 rounded-lg text-white bg-zinc-700"
                    rows="4"
                />
                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400">
                        Close
                    </button>
                    <button
                        onClick={handleReportSubmit}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400">
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;