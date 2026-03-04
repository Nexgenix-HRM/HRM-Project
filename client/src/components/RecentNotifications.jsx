import React, { useState, useEffect } from 'react';
import { FaBell, FaClock, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { notificationApi } from '../Api/notificationApi';

const RecentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await notificationApi.getNotifications();
                // Take the 5 most recent notifications
                setNotifications(response.data.notifications.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
        // Poll every 60 seconds for dashboard updates
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'task_assigned': return <FaClock className="text-amber-500" />;
            case 'project_assigned': return <FaBell className="text-indigo-500" />;
            case 'task_comment': return <FaCheckCircle className="text-emerald-500" />;
            default: return <FaBell className="text-slate-400" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm h-full">
                <div className="flex items-center gap-2 mb-4 animate-pulse">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                    <div className="h-4 w-32 bg-slate-100 rounded"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-3/4 bg-slate-50 rounded"></div>
                                <div className="h-2 w-1/4 bg-slate-50 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FaBell size={14} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Recent Activity</h3>
                </div>
                {notifications.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">
                        Live updates
                    </span>
                )}
            </div>

            <div className="space-y-5">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className="group flex items-start gap-4 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                {getIcon(notif.data.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-900 leading-snug mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {notif.data.message}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide italic">
                                        {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                            <FaBell className="text-slate-200" size={20} />
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">No recent activity detected</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentNotifications;
