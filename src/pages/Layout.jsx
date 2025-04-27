import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Layout({ children, title = "Dashboard" }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen white dark:bg-slate-800">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main content */}
            <div className="flex flex-col flex-1 w-full lg:ml-64 transition-all duration-300">
                <Header setIsSidebarOpen={setIsSidebarOpen} title={title} />

                <main className="flex-1 overflow-y-auto p-6 white dark:bg-slate-800">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}