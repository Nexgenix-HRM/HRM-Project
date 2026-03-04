import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarCheck, FaBriefcase, FaArrowRight, FaChartPie, FaUserPlus, FaPlaneDeparture, FaUserClock } from 'react-icons/fa';
import NoticeAcknowledgment from '../../../components/NoticeAcknowledgment';
import { hrApi } from '../../../Api/hrApi';
import { monitoringApi } from '../../../Api/monitoringApi';
import { leaveApi } from '../../../Api/leaveApi';

const HRHome = () => {
    const [data, setData] = useState({
        totalWorkforce: 0,
        presentToday: 0,
        pendingLeaves: 0,
        recentHires: [],
        loading: true
    });

    useEffect(() => {
        const fetchHRData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const [usersRes, leavesRes, overviewRes] = await Promise.all([
                    hrApi.getUsers(),
                    leaveApi.getLeaves(),
                    monitoringApi.getOverview({ date: today })
                ]);

                // Filter out CEO
                const filteredUsers = usersRes.data.filter(u => u.role !== 'ceo');

                // Sort and get last 3 registered users as "Recent Hires"
                const sortedUsers = [...filteredUsers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

                setData({
                    totalWorkforce: filteredUsers.length,
                    presentToday: overviewRes.data?.summary?.attendance?.present || 0,
                    pendingLeaves: leavesRes.data.filter(l => l.status === 'pending').length,
                    recentHires: sortedUsers,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching HR dashboard data:", error);
                setData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchHRData();
    }, []);

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">

            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Operations</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Management Gateway</p>
                    </div>
                </div>
            </header>

            <NoticeAcknowledgment />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">

                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -mr-10 -mt-10 group-hover:bg-emerald-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                            <FaUsers size={16} />
                        </div>
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Employees</h6>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                            {data.loading ? "..." : data.totalWorkforce}
                        </h2>
                    </div>
                </div>


                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:bg-blue-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <FaCalendarCheck size={16} />
                        </div>
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Present Today</h6>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                            {data.loading ? "..." : data.presentToday}
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
                            {data.loading ? "..." : `${data.pendingLeaves} Pending`}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Recent Hires - Relatable Content */}
                <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <FaUserPlus size={14} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Recent Onboardings</h3>
                    </div>
                    <div className="space-y-4">
                        {data.loading ? (
                            <div className="text-[10px] text-slate-400 font-bold uppercase py-2">Loading profiles...</div>
                        ) : data.recentHires.length > 0 ? (
                            data.recentHires.map(user => (
                                <div key={user.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        {user.profile_image ? (
                                            <img
                                                src={user.profile_image.startsWith('http') ? user.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${user.profile_image}`}
                                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm"
                                                alt={user.name}
                                            />
                                        ) : (
                                            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-xs font-bold text-slate-900">{user.name}</div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{user.designation || user.role}</div>
                                        </div>
                                    </div>
                                    <div className="text-[8px] font-black text-slate-300 group-hover:text-emerald-500 transition-colors uppercase">
                                        Joined {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-[10px] text-slate-400 font-bold uppercase py-2">No recent hires found</div>
                        )}
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-8 lg:p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '12px 12px' }}></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <FaBriefcase className="text-slate-300" size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight uppercase">Operations Terminal</h2>
                    <p className="text-[13px] text-slate-500 font-medium max-w-md mx-auto mb-6 leading-relaxed">
                        Connection secure. Access operational logs and monitor personnel lifecycle protocols via the command portal.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/dashboard/hr/directory" className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-black transition-all flex items-center gap-2">
                            Directory <FaArrowRight size={9} />
                        </Link>
                        <Link to="/dashboard/hr/leave-request" className="h-10 px-6 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                            Leaves <FaArrowRight size={9} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRHome;
