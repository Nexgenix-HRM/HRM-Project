import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCalendarCheck, FaTasks, FaClock, FaArrowRight,
    FaUserClock, FaClipboardList, FaDoorOpen, FaHistory,
    FaRegCalendarAlt, FaChevronRight, FaBullhorn
} from 'react-icons/fa';
import { employeeApi } from '../../../api/employeeApi';
import { noticeApi } from '../../../api/noticeApi';
import NoticeAcknowledgment from '../../../components/NoticeAcknowledgment';

const EmployeeHome = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const userName = localStorage.getItem('userName') || 'Employee';

    useEffect(() => {
        fetchRecentNotices();
    }, []);

    const fetchRecentNotices = async () => {
        try {
            const response = await noticeApi.getNotices();
            setNotices(response.data.slice(0, 2));
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-accent to-purple-400 rounded-full shadow-[0_0_15px_rgba(112,48,160,0.4)]"></div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {getGreeting()}, <span className="text-accent">{userName.split(' ')[0]}</span>!
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium pl-5 flex items-center gap-2">
                        <FaRegCalendarAlt className="text-accent/60" /> {formatDate(currentTime)}
                    </p>
                </div>
            </header>

            <NoticeAcknowledgment />


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                    icon={<FaUserClock size={28} />}
                    title="Attendance"
                    link="/dashboard/employee/attendance"
                    color="accent"
                />
                <ActionCard
                    icon={<FaClipboardList size={28} />}
                    title="To-DO"
                    link="/dashboard/employee/todo"
                    color="blue"
                />
                <ActionCard
                    icon={<FaHistory size={28} />}
                    title="Daily Activity"
                    link="/dashboard/employee/activity"
                    color="emerald"
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FaBullhorn className="text-accent" /> Recent Announcements
                        </h3>
                        <Link to="/dashboard/employee/notices" className="text-xs font-bold text-accent hover:underline">View Intelligence Archive</Link>
                    </div>

                    <div className="space-y-3">
                        {notices.map(notice => (
                            <div key={notice.id} className="bg-white/60 backdrop-blur-sm border border-slate-100 p-5 rounded-2xl hover:bg-white transition-all shadow-sm group">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h5 className="font-bold text-slate-900 group-hover:text-accent transition-colors">{notice.title}</h5>
                                        <p className="text-sm text-slate-500 line-clamp-1">{notice.content}</p>
                                        <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>By {notice.creator?.name}</span>
                                        </div>
                                    </div>
                                    <FaChevronRight size={12} className="text-slate-200 mt-2" />
                                </div>
                            </div>
                        ))}
                        {notices.length === 0 && (
                            <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-sm text-slate-400 font-bold">No active announcements discovered.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Access Sidebar */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Personnel Actions</h3>
                    <div className="space-y-3">
                        <QuickLink
                            icon={<FaDoorOpen />}
                            title="Leave Request"
                            link="/dashboard/employee/leave"
                        />
                        <QuickLink
                            icon={<FaCalendarCheck />}
                            title="Attendance History"
                            link="/dashboard/employee/attendance"
                        />
                        <QuickLink
                            icon={<FaTasks />}
                            title="Directory"
                            link="/dashboard/employee/directory"
                        />
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-50">
                        <div className="bg-accent/5 p-4 rounded-2xl">
                            <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">System Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-slate-600">All Modules Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionCard = ({ icon, title, link, color }) => {
    const colorMap = {
        accent: {
            bg: 'bg-accent/10',
            text: 'text-accent',
            hoverBg: 'group-hover:bg-accent',
            shadow: 'hover:shadow-purple-500/20',
        },
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            hoverBg: 'group-hover:bg-blue-600',
            shadow: 'hover:shadow-blue-500/20',
        },
        emerald: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            hoverBg: 'group-hover:bg-emerald-600',
            shadow: 'hover:shadow-emerald-500/20',
        }
    };

    const styles = colorMap[color] || colorMap.accent;

    return (
        <Link to={link} className="group h-full !no-underline" style={{ textDecoration: 'none' }}>
            <div className={`bg-white h-full rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl ${styles.shadow} transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center`}>
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.05] ${styles.text} -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-45`}>
                    {icon}
                </div>

                <div className={`w-16 h-16 ${styles.bg} ${styles.text} rounded-2xl flex items-center justify-center mb-6 ${styles.hoverBg} group-hover:text-white transition-all duration-500 shadow-sm group-hover:scale-110 group-hover:rotate-6`}>
                    {icon}
                </div>

                <h3 className="text-xl font-bold !text-slate-900 mb-2 tracking-tight group-hover:!text-accent transition-colors !no-underline" style={{ textDecoration: 'none' }}>{title}</h3>

                <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black !text-slate-400 group-hover:!text-accent group-hover:translate-x-1 transition-all duration-300 tracking-widest uppercase !no-underline" style={{ textDecoration: 'none' }}>
                    Go <FaChevronRight size={8} />
                </div>
            </div>
        </Link>
    );
};

const QuickLink = ({ icon, title, link }) => (
    <Link to={link} className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent/5 border border-transparent hover:border-accent/10 transition-all group !no-underline" style={{ textDecoration: 'none' }}>
        <div className="flex items-center gap-3 !no-underline" style={{ textDecoration: 'none' }}>
            <div className="text-accent group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-sm font-bold !text-slate-700 group-hover:!text-accent transition-colors !no-underline" style={{ textDecoration: 'none' }}>{title}</span>
        </div>
        <FaChevronRight size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
    </Link>
);

export default EmployeeHome;
