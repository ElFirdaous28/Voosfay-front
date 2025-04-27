import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown } from "lucide-react";

export default function NotificationDropdown() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayLimit, setDisplayLimit] = useState(3);
    const notificationRef = useRef(null);

    // Sample notifications data - in a real app, this would come from an API or props
    const allNotifications = [
        {
            id: 1,
            type: "ride",
            message: "John accepted your ride request",
            time: "10 min ago",
            read: false
        },
        {
            id: 2,
            type: "payment",
            message: "Payment confirmed for your last ride",
            time: "1 hour ago",
            read: false
        },
        {
            id: 3,
            type: "system",
            message: "Profile verification completed",
            time: "Yesterday",
            read: true
        },
        {
            id: 4,
            type: "ride",
            message: "Your ride with Michael is scheduled for tomorrow",
            time: "Yesterday",
            read: true
        },
        {
            id: 5,
            type: "system",
            message: "Weekly summary report is available",
            time: "2 days ago",
            read: true
        },
        {
            id: 6,
            type: "payment",
            message: "Your wallet has been credited with $20",
            time: "3 days ago",
            read: true
        },
        {
            id: 7,
            type: "ride",
            message: "New ride offers available in your area",
            time: "5 days ago",
            read: true
        }
    ];
    const notifications = allNotifications.slice(0, displayLimit);
    const hasMoreNotifications = allNotifications.length > displayLimit;

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to load more notifications
    const loadMoreNotifications = () => {
        setIsLoading(true);

        // Simulate loading delay
        setTimeout(() => {
            setDisplayLimit(prev => prev + 3);
            setIsLoading(false);
        }, 600);
    };

    // Reset display limit when dropdown closes
    useEffect(() => {
        if (!showNotifications) {
            setDisplayLimit(3);
        }
    }, [showNotifications]);

    const unreadCount = allNotifications.filter(n => !n.read).length;

    // Function to mark all as read (placeholder)
    const markAllAsRead = (e) => {
        e.preventDefault();
        // In a real app, this would call an API
        console.log("Mark all as read");
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute -right-20 mt-2 w-80 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-white">Notifications</h3>
                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-400 hover:text-blue-300">
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto scrollbar-hidden">
                        {notifications.length > 0 ? (
                            <>
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${!notification.read ? 'bg-gray-750' : ''}`}>
                                        <div className="flex justify-between">
                                            <p className="text-sm font-medium text-gray-200">{notification.message}</p>
                                            {!notification.read && (
                                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                    </div>
                                ))}

                                {hasMoreNotifications && (
                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <button
                                            className="w-full text-center text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center"
                                            onClick={loadMoreNotifications}
                                            disabled={isLoading}>
                                            {isLoading ? (
                                                <span>Loading...</span>
                                            ) : (
                                                <>
                                                    <span>View more</span>
                                                    <ChevronDown size={16} className="ml-1" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400">
                                No notifications
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-700 flex justify-end">
                        <button className="text-xs text-blue-400 hover:text-blue-300">
                            Clear all
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}