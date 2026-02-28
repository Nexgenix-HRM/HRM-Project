import React, { useState, useEffect } from 'react';
import { monitoringApi } from '../../../Api/monitoringApi';
import {
    FaUsers, FaCalendarCheck, FaTasks, FaClipboardList,
    FaChevronRight, FaCalendarAlt, FaUserCircle, FaCheckCircle, FaTimesCircle, FaSearch
} from 'react-icons/fa';
import { formatTo12Hour } from '../../../utils/timeFormatter';
import { Link } from 'react-router-dom';

const MonitoringOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        attendance: 'all',
    });

    useEffect(() => {
        const fetchOverview = async () => {
            setLoading(true);
            try {
                const response = await monitoringApi.getOverview({
                    date,
                    search: searchQuery,
                    attendance: filters.attendance,
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching monitoring overview", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, [date, searchQuery, filters]);

    if (loading && !data) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    const StatCard = ({ title, value, colorClass, link, details, icon: Icon }) => (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClass} text-white shadow-lg`}>
                    <Icon size={20} />
                </div>
                {link && (
                    <Link to={link} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <FaChevronRight size={14} />
                    </Link>
                )}
            </div>
            <h3 className="text-slate-500 font-semibold text-sm mb-1">{title}</h3>
            <div className="text-2xl font-bold text-slate-900 mb-2">{value}</div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider space-x-2">
                {details}
            </div>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Monitoring</h1>
                </div>
                <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
                    {/* Search */}
                    <div className="relative group">
                        <input
                            type="text"
                            className="w-40 h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none text-[11px] font-bold text-slate-800 placeholder:text-slate-300"
                            placeholder="Search name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={10} />
                    </div>

                    {/* Attendance Filter */}
                    <div className="relative">
                        <select
                            value={filters.attendance}
                            onChange={(e) => setFilters({ ...filters, attendance: e.target.value })}
                            className="h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-700 outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-sm w-40 appearance-none"
                        >
                            <option value="all">ALL STATUS</option>
                            <option value="present">PRESENT</option>
                            <option value="absent">ABSENT</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <div className={`w-1.5 h-1.5 rounded-full ${filters.attendance === 'present' ? 'bg-emerald-500' : filters.attendance === 'absent' ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 h-9 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-400 transition-all">
                        <FaCalendarAlt className="text-blue-500 group-hover:scale-110 transition-transform" size={12} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-none outline-none text-[11px] font-black text-slate-700 bg-transparent pointer-events-auto cursor-pointer"
                        />
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1"></div>

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setFilters({ attendance: 'all' });
                            setSearchQuery('');
                        }}
                        className="h-9 px-4 bg-white text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all uppercase tracking-widest"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Attendance"
                    value={`${data?.summary.attendance.present} Present`}
                    icon={FaCalendarCheck}
                    colorClass="bg-emerald-500"
                    link="attendance"
                    details={`${data?.summary.attendance.absent} Absent today`}
                />
                <StatCard
                    title="Daily Activities"
                    value={`${data?.summary.activities.submitted} Logs`}
                    icon={FaClipboardList}
                    colorClass="bg-blue-500"
                    link="activities"
                    details={`${data?.summary.activities.pending} Pending submissions`}
                />
                <StatCard
                    title="To-Do Submissions"
                    value={`${data?.summary.todos.submitted} Done`}
                    icon={FaTasks}
                    colorClass="bg-rose-500"
                    link="todos"
                    details={`${data?.summary.todos.pending} Not started`}
                />
            </div>

            {/* Employee List Snapshot */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Pulse</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Attendance</th>
                                <th className="px-6 py-4">Daily Logs</th>
                                <th className="px-6 py-4">To-Do Submit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data?.employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {emp.profile_image ? (
                                                <img src={`${import.meta.env.VITE_STORAGE_URL}/${emp.profile_image}`} className="w-9 h-9 rounded-xl object-cover shadow-sm" alt="" />
                                            ) : (
                                                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                                                    <FaUserCircle size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 leading-tight">{emp.name}</div>
                                                <div className="text-[10px] font-semibold text-accent uppercase tracking-wider">{emp.designation || emp.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {emp.attendance ? (
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                                    <FaCheckCircle size={10} /> Present
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400">IN: {formatTo12Hour(emp.attendance.check_in)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                                                <FaTimesCircle size={10} /> Absent
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {emp.has_activity ? (
                                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg">SUBMITTED</span>
                                        ) : (
                                            <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-lg">PENDING</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {emp.has_todo ? (
                                            <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-lg">SUBMITTED</span>
                                        ) : (
                                            <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-lg">PENDING</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MonitoringOverview;
