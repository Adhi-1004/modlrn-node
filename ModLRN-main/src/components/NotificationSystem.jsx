import { useState, useEffect } from "react";
import axios from "axios";

function NotificationSystem({ user }) {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/notifications/${user.id}`);
            setNotifications(response.data);
            
            // Check if there are any unread notifications
            setHasUnread(response.data.some(notification => !notification.read));
        } catch (error) {
            console.error("Error fetching notifications:", error);
            
            // For demo purposes, generate mock notifications
            const mockNotifications = [
                {
                    id: 1,
                    type: "deadline",
                    title: "Assignment Due Soon",
                    message: "Your Computer Networks assignment is due in 2 days.",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    read: false
                },
                {
                    id: 2,
                    type: "exam",
                    title: "Upcoming Exam",
                    message: "Your Thermodynamics exam is scheduled for next Monday at 10:00 AM.",
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    read: false
                },
                {
                    id: 3,
                    type: "performance",
                    title: "Performance Update",
                    message: "You've improved by 15% in your recent Circuit Theory assessment. Keep up the good work!",
                    timestamp: new Date(Date.now() - 259200000).toISOString(),
                    read: true
                },
            ];
            
            setNotifications(mockNotifications);
            setHasUnread(true);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:3001/api/notifications/${id}/read`);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === id 
                        ? { ...notification, read: true }
                        : notification
                )
            );
            
            // Check if all notifications are now read
            const updatedHasUnread = notifications.some(
                notification => notification.id !== id && !notification.read
            );
            setHasUnread(updatedHasUnread);
            
        } catch (error) {
            console.error("Error marking notification as read:", error);
            
            // For demo purposes, update local state anyway
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === id 
                        ? { ...notification, read: true }
                        : notification
                )
            );
            
            const updatedHasUnread = notifications.some(
                notification => notification.id !== id && !notification.read
            );
            setHasUnread(updatedHasUnread);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`http://localhost:3001/api/notifications/read-all/${user.id}`);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, read: true }))
            );
            setHasUnread(false);
            
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            
            // For demo purposes, update local state anyway
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, read: true }))
            );
            setHasUnread(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 30) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "deadline":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case "exam":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            case "performance":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button 
                className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* Unread Indicator */}
                {hasUnread && (
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500"></span>
                )}
            </button>
            
            {/* Notification Panel */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg overflow-hidden z-20">
                    <div className="p-3 bg-gray-900 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        {hasUnread && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs text-blue-400 hover:text-blue-300"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`p-4 border-b border-gray-700 hover:bg-gray-700 ${!notification.read ? 'bg-gray-700/50' : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-white">{notification.title}</p>
                                            <p className="text-sm text-gray-300">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{formatTime(notification.timestamp)}</p>
                                        </div>
                                        {!notification.read && (
                                            <div className="ml-2 h-2 w-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="p-2 bg-gray-900 text-center">
                        <button className="text-sm text-gray-400 hover:text-white">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationSystem; 