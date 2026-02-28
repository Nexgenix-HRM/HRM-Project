import React, { useState, useEffect } from 'react';
import { monitoringApi } from '../../../api/monitoringApi';
import { FaTasks, FaCalendarAlt, FaUserCircle, FaProjectDiagram, FaInfoCircle, FaClock, FaCheckCircle, FaDoorOpen, FaDoorClosed, FaSearch } from 'react-icons/fa';
import { formatTo12Hour } from '../../../utils/timeFormatter';

const TodoMonitoring = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [expandedUsers, setExpandedUsers] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await monitoringApi.getTodos(date);
            setTodos(response.data);

            // Submissions are collapsed by default for a cleaner overview
            setExpandedUsers({});
        } catch (error) {
            console.error("Error fetching todos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [date]);

    const toggleUser = (userId) => {
        setExpandedUsers(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const calculateAttendanceDuration = (attendance) => {
        if (!attendance || !attendance.check_in || !attendance.check_out) return null;
        try {
            const start = new Date(`1970-01-01T${attendance.check_in}`);
            const end = new Date(`1970-01-01T${attendance.check_out}`);
            const diff = (end - start) / 60000; // minutes
            const h = Math.floor(diff / 60);
            const m = Math.round(diff % 60);
            return `${h}h ${m}m`;
        } catch (e) {
            return null;
        }
    };

    const groupedTodos = todos.reduce((acc, curr) => {
        if (!acc[curr.user_id]) {
            acc[curr.user_id] = {
                user: curr.user,
                submissions: [],
                attendance: curr.user.attendance[0] || null // Eager loaded in updated MonitoringController
            };
        }
        acc[curr.user_id].submissions.push(curr);
        return acc;
    }, {});

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Work Submissions (To-Dos)</h1>
                    <p className="text-sm text-slate-500">Track task completion and automated work hours.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <input
                            type="text"
                            className="w-64 h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none text-xs font-medium text-slate-800 placeholder:text-slate-300"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={12} />
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <FaCalendarAlt className="text-blue-500" size={14} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-none outline-none text-sm font-semibold text-slate-700 pointer-events-auto"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : todos.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center text-slate-400">
                    <FaTasks className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-bold text-sm uppercase tracking-widest">No work submissions for this date</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.values(groupedTodos).filter(group =>
                        group.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (group.user.designation && group.user.designation.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).map(group => (
                        <div key={group.user.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            {/* Employee Header - Clickable */}
                            <div
                                onClick={() => toggleUser(group.user.id)}
                                className="p-5 flex flex-col md:flex-row items-center gap-5 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="relative">
                                        {group.user.profile_image ? (
                                            <img src={`${import.meta.env.VITE_STORAGE_URL}/${group.user.profile_image}`} className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white" alt="" />
                                        ) : (
                                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-200">
                                                <FaUserCircle size={30} />
                                            </div>
                                        )}
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${group.attendance ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 text-lg leading-tight">{group.user.name}</div>
                                        <div className="text-[10px] font-black text-accent uppercase tracking-widest mt-0.5">{group.user.designation}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl text-center min-w-[100px]">
                                        <div className="text-xl font-black text-emerald-600 leading-none">{group.submissions.length}</div>
                                        <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">Tasks</div>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-center min-w-[120px]">
                                        <div className="text-xl font-black text-white leading-none whitespace-nowrap">
                                            {calculateAttendanceDuration(group.attendance) || "N/A"}
                                        </div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Working Hours</div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 bg-slate-50 border border-slate-100 ${expandedUsers[group.user.id] ? 'rotate-180 bg-emerald-50 border-emerald-200' : ''}`}>
                                        <svg className={`w-5 h-5 ${expandedUsers[group.user.id] ? 'text-emerald-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Tasks List */}
                            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expandedUsers[group.user.id] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 bg-slate-50/50">
                                    {/* Attendance Summary Bar */}
                                    {group.attendance && (
                                        <div className="mb-6 flex items-center gap-6 bg-white p-4 rounded-3xl border border-slate-200/50 shadow-sm max-w-2xl">
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <FaDoorOpen />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Check In</div>
                                                    <div className="text-sm font-black text-slate-900">{formatTo12Hour(group.attendance.check_in)}</div>
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100"></div>
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                                    <FaDoorClosed />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Check Out</div>
                                                    <div className="text-sm font-black text-slate-900">{formatTo12Hour(group.attendance.check_out) || "PUNCHING..."}</div>
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100"></div>
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FaClock />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Stay</div>
                                                    <div className="text-sm font-black text-slate-900">{calculateAttendanceDuration(group.attendance) || "Calculating..."}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {group.submissions.map(todo => (
                                            <div key={todo.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-5 hover:shadow-xl transition-all relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4">
                                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-2">
                                                        <FaCheckCircle size={10} /> SUBMITTED
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3">
                                                    <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                            <FaProjectDiagram size={10} className="text-blue-500" /> Project Identifier
                                                        </div>
                                                        <div className="text-[13px] font-bold text-slate-800 truncate">{todo.project_name}</div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-slate-900 rounded-2xl">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                        <FaInfoCircle size={10} /> Progress Summary
                                                    </div>
                                                    <p className="text-slate-300 text-xs leading-relaxed font-medium whitespace-pre-wrap italic">
                                                        "{todo.description}"
                                                    </p>
                                                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Auth:</div>
                                                            <div className="text-[10px] font-bold text-slate-300">{todo.assigned_by}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodoMonitoring;
