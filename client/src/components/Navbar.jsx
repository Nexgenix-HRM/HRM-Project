import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt, FaBars, FaClock, FaBullhorn } from 'react-icons/fa';
import { attendanceApi } from '../Api/attendanceApi';
import { employeeApi } from '../Api/employeeApi';
import { noticeApi } from '../Api/noticeApi';
import { notificationApi } from '../Api/notificationApi';

const Navbar = ({ isMobile, onToggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notices, setNotices] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [attendanceStatus, setAttendanceStatus] = useState('not_checked_in');
    const [userProfile, setUserProfile] = useState({
        name: localStorage.getItem('userName') || 'User',
        profile_image: null
    });
    const role = localStorage.getItem('role');

    const fetchUserData = async () => {
        try {

            const profileResponse = await employeeApi.getProfile();
            setUserProfile({
                name: profileResponse.data.name,
                profile_image: profileResponse.data.profile_image
            });


            localStorage.setItem('userName', profileResponse.data.name);

            if (role === 'employee') {
                const statusResponse = await attendanceApi.getStatus();
                setAttendanceStatus(statusResponse.data.status);
            }

            // Fetch notices for all users
            const noticesResponse = await noticeApi.getNotices();
            setNotices(noticesResponse.data.slice(0, 3));

            // Fetch system notifications
            const notificationsResponse = await notificationApi.getNotifications();
            setNotifications(notificationsResponse.data.notifications.slice(0, 3));
            setUnreadCount(notificationsResponse.data.unread_count);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();

        // Simple polling for "real-time" updates every 30 seconds
        const pollInterval = setInterval(fetchUserData, 30000);
        return () => clearInterval(pollInterval);
    }, [role]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/attendance')) return 'Time & Attendance';
        if (path.includes('/todo')) return 'Daily Work Submission';
        if (path.includes('/activity')) return 'Daily Activity Log';
        if (path.includes('/leave')) return 'Leave Management';
        if (path.includes('/directory')) return 'Personnel Directory';
        if (path.includes('/profile')) return 'Profile';
        if (path.includes('/users')) return 'User Management';
        if (path.includes('/ceo')) return 'Executive Dashboard';
        if (path.includes('/hr')) return 'HR Operations';
        return 'Dashboard';
    };

    const getStatusBadge = () => {
        if (role !== 'employee') return null;

        const statusConfig = {
            'checked_in': { label: 'Active Session', color: 'emerald', icon: true },
            'checked_out': { label: 'Session Complete', color: 'slate', icon: false },
            'not_checked_in': { label: 'Offline', color: 'slate', icon: false }
        };

        const config = statusConfig[attendanceStatus] || statusConfig['not_checked_in'];

        return (
            <div className={`status-badge status-${config.color}`}>
                {config.icon && <div className="status-pulse"></div>}
                <FaClock size={10} />
                <span>{config.label}</span>
            </div>
        );
    };

    const getProfileImage = () => {
        if (userProfile.profile_image) {
            return (
                <img
                    src={`${import.meta.env.VITE_STORAGE_URL}/${userProfile.profile_image}`}
                    alt={userProfile.name}
                    className="navbar-profile-image"
                />
            );
        }
        return <FaUserCircle size={20} />;
    };

    return (
        <nav className={`fixed top-0 right-0 h-[60px] bg-white/80 backdrop-blur-md border-b border-slate-100 z-[1000] transition-all duration-300 ${isMobile ? 'left-0' : 'left-[260px]'}`}>
            <div className="h-full px-6 flex items-center justify-between max-w-full">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Toggle button - only visible on mobile */}
                    {isMobile && (
                        <button
                            className="bg-none border-none text-slate-700 cursor-pointer p-2 rounded-lg transition-all duration-200 flex items-center justify-center hover:bg-slate-700/10 hover:scale-105 active:scale-95"
                            onClick={onToggleSidebar}
                        >
                            <FaBars size={20} />
                        </button>
                    )}
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-[14px] font-bold text-slate-900 m-0 leading-tight">{getPageTitle()}</h1>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NexGenix HRM</span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {role === 'employee' && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${attendanceStatus === 'checked_in'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                            }`}>
                            {attendanceStatus === 'checked_in' && (
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            )}
                            <FaClock size={10} />
                            <span className={isMobile ? 'hidden' : 'block'}>
                                {attendanceStatus === 'checked_in' ? 'Active Session' : attendanceStatus === 'checked_out' ? 'Session Complete' : 'Offline'}
                            </span>
                        </div>
                    )}

                    <div className="relative">
                        <button
                            className="relative bg-none border-none text-slate-500 cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:-translate-y-0.5 active:translate-y-0"
                            onClick={async () => {
                                if (!showNotifications && unreadCount > 0) {
                                    try {
                                        await notificationApi.markAllAsRead();
                                        setUnreadCount(0);
                                    } catch (err) {
                                        console.error('Error marking notifications as read:', err);
                                    }
                                }
                                setShowNotifications(!showNotifications);
                                setShowProfileMenu(false);
                            }}
                        >
                            <FaBell size={16} />
                            {(notices.length > 0 || unreadCount > 0) && (
                                <span className="absolute top-1.5 right-1.5 min-w-[12px] h-3 px-1 flex items-center justify-center bg-rose-500 text-white text-[8px] font-bold rounded-full border-2 border-white/80">
                                    {notices.length + unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute top-[calc(100%+0.5rem)] right-0 md:right-[-40px] w-screen max-w-[350px] bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border-b border-slate-200 mb-2">
                                    <FaBell size={16} className="text-accent" />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] font-bold text-slate-900">Notifications & Notices</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest activity</span>
                                    </div>
                                </div>

                                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                    {/* System Notifications Section */}
                                    {notifications.length > 0 && (
                                        <div className="py-2">
                                            <div className="px-4 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50">System Alerts</div>
                                            {notifications.map(notif => (
                                                <div key={notif.id} className="relative flex flex-col gap-1 p-3 px-4 border-b border-slate-100 hover:bg-accent/5 transition-colors cursor-pointer group">
                                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-0.5 h-[70%] bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <p className="text-[13px] font-bold text-slate-900 leading-tight m-0">{notif.data.message}</p>
                                                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(notif.created_at).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Notices Section */}
                                    <div className="py-2">
                                        <div className="px-4 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50">Company Notices</div>
                                        {notices.map(notice => (
                                            <div key={notice.id} className="relative flex flex-col gap-1 p-3 px-4 border-b border-slate-100 hover:bg-accent/5 transition-colors cursor-pointer group">
                                                <p className="text-[13px] font-bold text-slate-900 leading-tight m-0">{notice.title}</p>
                                                <p className="text-[12px] text-slate-500 leading-normal m-0">{notice.content.substring(0, 80)}...</p>
                                                <span className="text-[10px] text-slate-400 font-semibold">{new Date(notice.created_at).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {notifications.length === 0 && notices.length === 0 && (
                                        <div className="p-6 text-center text-slate-400 text-[12px]">
                                            No new activity
                                        </div>
                                    )}
                                </div>
                                <div className="h-px bg-slate-200/80 my-1.5"></div>
                                <button
                                    className="w-full p-2.5 rounded-lg text-xs font-bold text-accent hover:bg-accent/5 transition-all text-center flex items-center justify-center"
                                    onClick={() => {
                                        setShowNotifications(false);
                                        navigate(role === 'ceo' ? '/dashboard/ceo/notices-manage' : role === 'hr' ? '/dashboard/hr/notices-manage' : '/dashboard/employee/notices');
                                    }}
                                >
                                    View Archived Notices
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            className="flex items-center gap-2 bg-none border-none text-slate-700 cursor-pointer p-1.5 pr-3 rounded-xl transition-all duration-200 hover:bg-accent/10 hover:-translate-y-0.5 active:translate-y-0"
                            onClick={() => {
                                setShowProfileMenu(!showProfileMenu);
                                setShowNotifications(false);
                            }}
                        >
                            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/80 shadow-sm flex items-center justify-center bg-slate-100 flex-shrink-0">
                                {userProfile.profile_image ? (
                                    <img
                                        src={`${import.meta.env.VITE_STORAGE_URL}/${userProfile.profile_image}`}
                                        alt={userProfile.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle size={20} className="text-slate-400" />
                                )}
                            </div>
                            <span className="text-[12px] font-semibold text-slate-700 max-w-[120px] truncate hidden md:block">
                                {userProfile.name}
                            </span>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute top-[calc(100%+0.5rem)] right-0 min-w-[220px] bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 mb-1.5">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-white flex-shrink-0">
                                        {userProfile.profile_image ? (
                                            <img
                                                src={`${import.meta.env.VITE_STORAGE_URL}/${userProfile.profile_image}`}
                                                alt={userProfile.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUserCircle size={28} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                        <span className="text-[13px] font-bold text-slate-900 truncate">{userProfile.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{role?.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="h-px bg-slate-200/80 my-1.5 mx-1"></div>
                                <button
                                    className="flex items-center gap-2.5 w-full p-2.5 px-3 rounded-lg text-[12px] font-semibold text-slate-700 hover:bg-accent/5 hover:pl-3.5 hover:text-accent group transition-all"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate(role === 'ceo' ? '/dashboard/ceo/profile' : role === 'hr' ? '/dashboard/hr/profile' : '/dashboard/employee/profile');
                                    }}
                                >
                                    <FaUserCircle size={14} className="transition-transform group-hover:translate-x-0.5" />
                                    <span>View Profile</span>
                                </button>
                                <div className="h-px bg-slate-200/80 my-1.5 mx-1"></div>
                                <button
                                    className="flex items-center gap-2.5 w-full p-2.5 px-3 rounded-lg text-[12px] font-semibold text-rose-600 hover:bg-rose-50 hover:pl-3.5 group transition-all"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt size={14} className="transition-transform group-hover:translate-x-0.5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
