import React, { useState, useEffect } from 'react';
import { monitoringApi } from '../../../Api/monitoringApi';
import { FaClipboardList, FaCalendarAlt, FaUserCircle, FaClock, FaSearch } from 'react-icons/fa';

const ActivityMonitoring = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [expandedUsers, setExpandedUsers] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await monitoringApi.getActivities(date);
            setActivities(response.data);


            setExpandedUsers({});
        } catch (error) {
            console.error("Error fetching activities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [date]);

    const toggleUser = (userId) => {
        setExpandedUsers(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return null;
        try {
            const s = new Date(`1970-01-01T${start}`);
            const e = new Date(`1970-01-01T${end}`);
            const diff = (e - s) / 60000;
            const h = Math.floor(diff / 60);
            const m = Math.round(diff % 60);
            return `${h > 0 ? h + 'h ' : ''}${m}m`;
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            return "N/A";
        }
    };

    const calculateTotalWork = (logs) => {
        let totalMinutes = 0;
        logs.forEach(log => {
            const s = new Date(`1970-01-01T${log.start_time}`);
            const e = new Date(`1970-01-01T${log.end_time}`);
            totalMinutes += (e - s) / 60000;
        });
        const h = Math.floor(totalMinutes / 60);
        const m = Math.round(totalMinutes % 60);
        return `${h}h ${m}m`;
    };

    const groupedActivities = activities.reduce((acc, curr) => {
        if (!acc[curr.user_id]) {
            acc[curr.user_id] = {
                user: curr.user,
                logs: []
            };
        }
        acc[curr.user_id].logs.push(curr);
        return acc;
    }, {});

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Activity Logs</h1>
                    <p className="text-sm text-slate-500">Monitor employee work progress and task duration.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className={`relative group transition-all duration-300 ${isSearchExpanded ? 'flex-[5] md:flex-none' : 'flex-1 md:flex-none'}`}>
                        <input
                            type="text"
                            onFocus={() => setIsSearchExpanded(true)}
                            onBlur={() => setIsSearchExpanded(false)}
                            className={`h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all outline-none text-xs font-medium text-slate-800 placeholder:text-slate-300 w-full ${isSearchExpanded ? 'md:w-80' : 'md:w-64'}`}
                            placeholder={isSearchExpanded ? "Search employees..." : ""}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={12} />
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex-1 md:flex-none">
                        <FaCalendarAlt className="text-blue-500" size={14} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-none opacity-80 outline-none text-sm font-semibold text-slate-700 pointer-events-auto w-full"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : activities.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center text-slate-400">
                    <FaClipboardList className="mx-auto mb-4 opacity-20" size={48} />
                    <p className="font-bold text-sm uppercase tracking-widest">No activities logged for this date</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {Object.values(groupedActivities).filter(group =>
                        group.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (group.user.designation && group.user.designation.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).map(group => (
                        <div key={group.user.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                            {/* Employee Header - Clickable */}
                            <div
                                onClick={() => toggleUser(group.user.id)}
                                className="p-5 flex flex-col md:flex-row items-center gap-5 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="relative">
                                        {group.user.profile_image ? (
                                            <img
                                                src={group.user.profile_image.startsWith('http') ? group.user.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${group.user.profile_image}`}
                                                className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white"
                                                alt=""
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-200 shadow-inner">
                                                <FaUserCircle size={30} />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 leading-tight text-lg">{group.user.name}</div>
                                        <div className="text-[10px] font-black text-accent uppercase tracking-widest mt-0.5">{group.user.designation || group.user.role}</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                                    <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl text-center min-w-[80px] md:min-w-[100px] flex-1 md:flex-none">
                                        <div className="text-lg md:text-xl font-black text-blue-600 leading-none">{group.logs.length}</div>
                                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">Logs</div>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-center min-w-[100px] md:min-w-[120px] flex-1 md:flex-none">
                                        <div className="text-lg md:text-xl font-black text-white leading-none whitespace-nowrap">{calculateTotalWork(group.logs)}</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Time</div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 bg-slate-50 border border-slate-100 ${expandedUsers[group.user.id] ? 'rotate-180 bg-blue-50 border-blue-200' : ''}`}>
                                        <svg className={`w-5 h-5 ${expandedUsers[group.user.id] ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Logs List */}
                            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expandedUsers[group.user.id] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 bg-slate-50/50 space-y-4">
                                    {group.logs.map((activity, idx) => (
                                        <div key={activity.id} className="relative group/log">
                                            <div className="flex flex-col md:flex-row gap-5 p-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                                                <div className="md:w-56 shrink-0 flex flex-col gap-2">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-black tracking-wider border border-blue-100 uppercase">
                                                        <FaClock size={12} />
                                                        {activity.start_time?.substring(0, 5)} - {activity.end_time?.substring(0, 5)}
                                                    </div>
                                                    <div className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                                                        Slot duration: <span className="text-slate-900">{calculateDuration(activity.start_time, activity.end_time)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="text-slate-700 text-sm leading-relaxed p-4 bg-slate-50/50 rounded-2xl border border-slate-100 font-medium whitespace-pre-wrap italic">
                                                        "{activity.description}"
                                                    </div>
                                                </div>
                                            </div>
                                            {idx < group.logs.length - 1 && (
                                                <div className="h-4 w-0.5 bg-slate-200 ml-12 my-[-4px] relative z-0"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActivityMonitoring;
