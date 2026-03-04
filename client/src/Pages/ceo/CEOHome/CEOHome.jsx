import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarTimes, FaBuilding, FaArrowUp, FaChartLine, FaPercentage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import NoticeAcknowledgment from '../../../components/NoticeAcknowledgment';
import { monitoringApi } from '../../../Api/monitoringApi';
import { ceoApi } from '../../../Api/ceoApi';
import { leaveApi } from '../../../Api/leaveApi';

const CEOHome = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        pendingLeaves: 0,
        presentToday: 0,
        totalTasks: 0,
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

                const filteredEmployees = usersRes.data.filter(u => u.role !== 'ceo');
                const pendingCount = leavesRes.data.filter(l => l.status === 'pending').length;
                const presentCount = overviewRes.data?.summary?.attendance?.present || 0;

                setStats({
                    totalEmployees: filteredEmployees.length,
                    pendingLeaves: pendingCount,
                    presentToday: presentCount,
                    totalTasks: overviewRes.data?.summary?.todos?.submitted || 0,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching CEO dashboard data:", error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    const attendanceRate = stats.totalEmployees > 0
        ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
        : 0;

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">

            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(112,48,160,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">Enterprise Intelligence Hub</p>
                    </div>
                </div>
            </header>

            <NoticeAcknowledgment />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">

                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10 group-hover:bg-purple-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-purple-50 text-accent rounded-lg flex items-center justify-center mb-4">
                            <FaUsers size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Employees</h6>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                                {stats.loading ? "..." : stats.totalEmployees}
                            </h2>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 mb-0.5">
                                <FaArrowUp size={7} /> Active
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50 rounded-full -mr-10 -mt-10 group-hover:bg-rose-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-4">
                            <FaCalendarTimes size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Leave Request Pending</h6>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                                {stats.loading ? "..." : stats.pendingLeaves}
                            </h2>
                            <div className="text-[9px] font-bold text-slate-400 mb-0.5 uppercase tracking-tighter">Queued</div>
                        </div>
                    </div>
                </div>


                <div className="group bg-white rounded-2xl p-6 border border-accent/20 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10 group-hover:bg-purple-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                            <FaPercentage size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Attendance Rate</h6>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                                {stats.loading ? "..." : `${attendanceRate}%`}
                            </h2>
                            <div className="text-[8px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full border border-accent/20 mb-0.5 uppercase tracking-tighter">Daily Attendance</div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '12px 12px' }}></div>

                <div className="relative z-10 text-center md:text-left flex-1">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6 border border-slate-100 shadow-inner">
                        <FaBuilding className="text-slate-300" size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight uppercase">Operational Health</h2>
                    <p className="text-[13px] text-slate-500 font-medium max-w-md leading-relaxed">
                        Interface operational. Modernizing enterprise asset management through real-time data synchronization.
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap justify-center gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[140px] text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company Status</div>
                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                            <FaCheckCircle size={14} /> Normal
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[140px] text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Task Velocity</div>
                        <div className="text-slate-900 font-black text-xl">{stats.loading ? "..." : stats.totalTasks}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CEOHome;
