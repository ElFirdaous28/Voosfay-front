import React, { useState } from 'react'

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState('ratings');

    return (
        <>
            {/* Tabs */}
            <div className="flexb order-b border-gray-700 mb-4 pl-4 p-4 bg-zinc-800 text-gray-100 rounded-lg">
                <button
                    className={`px-4 py-2 ${activeTab === 'ratings' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('ratings')}>
                    Ratings
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'report' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('report')}>
                    Report
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'settings' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('settings')}>
                    Settings
                </button>
            </div>
        </>)
}
