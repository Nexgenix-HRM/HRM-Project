import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarTimes, FaBuilding, FaArrowRight, FaPercentage, FaCheckCircle, FaUserPlus, FaUserClock, FaBriefcase } from 'react-icons/fa';
import NoticeAcknowledgment from '../../../components/NoticeAcknowledgment';
import { monitoringApi } from '../../../Api/monitoringApi';
import { ceoApi } from '../../../Api/ceoApi';
import { leaveApi } from '../../../Api/leaveApi';
import RecentNotifications from '../../../components/RecentNotifications';

const CEOHome = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        pendingLeaves: 0,
        presentToday: 0,
        totalTasks: 0,
        recentHires: [],
        loading: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersRes, leavesRes, overviewRes] = await Promise.all([
                    ceoApi.getUsers(),
                    leaveApi.getLeaves(),
                    monitoringApi.getOverview({ date: new Date().toISOString().split('T')[0] })
                ]);

                // Filter out CEO
                const filteredEmployees = usersRes.data.filter(u => u.role !== 'ceo');

                // Sort and get last 3 registered users as "Recent Hires"
                const sortedUsers = [...filteredEmployees].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

                const pendingCount = leavesRes.data.filter(l => l.status === 'pending').length;
                const presentCount = overviewRes.data?.summary?.attendance?.present || 0;

                setStats({
                    totalEmployees: filteredEmployees.length,
                    pendingLeaves: pendingCount,
                    presentToday: presentCount,
                    totalTasks: overviewRes.data?.summary?.todos?.submitted || 0,
                    recentHires: sortedUsers,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching CEO dashboard data:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="p-4 lg:p-8 pb-16 max-w-6xl mx-auto">

            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(112,48,160,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Operations</h1>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">Enterprise Intelligence Hub</p>
                    </div>
                </div>
            </header>

            <NoticeAcknowledgment />

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10 group-hover:bg-purple-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-purple-50 text-accent rounded-lg flex items-center justify-center mb-4">
                            <FaUsers size={16} />
                        </div>
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Employees</h6>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                            {stats.loading ? "..." : stats.totalEmployees}
                        </h2>
                    </div>
                </div>


                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:bg-blue-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <FaCheckCircle size={16} />
                        </div>
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Present Today</h6>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                            {stats.loading ? "..." : stats.presentToday}
                        </h2>
                    </div>
                </div>
                <div className="group bg-slate-900 rounded-2xl p-6 text-white shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-accent/20 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                            <FaUserClock size={16} />
                        </div>
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Leaves</h6>
                        <h2 className="text-2xl font-black text-white tracking-tighter">
                            {stats.loading ? "..." : `${stats.pendingLeaves} Pending`}
                        </h2>
                    </div>
                </div>

            </div>


            {/* Status Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Activity */}
                <RecentNotifications />

                {/* Recent Onboardings */}
                <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6 overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                        <div className="p-2 bg-purple-50 text-accent rounded-lg">
                            <FaUserPlus size={14} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Recent Onboardings</h3>
                    </div>
                    <div className="space-y-4">
                        {stats.loading ? (
                            <div className="text-[10px] text-slate-400 font-bold uppercase py-2">Loading profiles...</div>
                        ) : stats.recentHires.length > 0 ? (
                            stats.recentHires.map(user => (
                                <div key={user.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        {user.profile_image ? (
                                            <img
                                                src={user.profile_image.startsWith('http') ? user.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${user.profile_image}`}
                                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                                                alt={user.name}
                                            />
                                        ) : (
                                            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200 shrink-0">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide truncate">{user.designation || user.role}</div>
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-black text-slate-300 group-hover:text-accent transition-colors uppercase ml-2 whitespace-nowrap">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-[10px] text-slate-400 font-bold uppercase py-2">No recent hires found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Terminal / Call to Action */}
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-8 lg:p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '12px 12px' }}></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <FaBriefcase className="text-slate-300" size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight uppercase">Control Center</h2>
                    <p className="text-[13px] text-slate-500 font-medium max-w-md mx-auto mb-6 leading-relaxed">
                        Interface operational. Monitor enterprise assets and oversee personnel lifecycle protocols through the executive command portal.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/dashboard/ceo/directory" className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-black transition-all flex items-center gap-2">
                            Directory <FaArrowRight size={9} />
                        </Link>
                        <Link to="/dashboard/ceo/leave" className="h-10 px-6 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                            Leaves <FaArrowRight size={9} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CEOHome;
