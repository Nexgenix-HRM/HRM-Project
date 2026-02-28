import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaSignOutAlt, FaHistory, FaFingerprint, FaClock } from 'react-icons/fa';
import { attendanceApi } from '../../../api/attendanceApi';
import { formatTo12Hour } from '../../../utils/timeFormatter';

const Attendance = () => {
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState('not_checked_in');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [logsRes, statusRes] = await Promise.all([
                attendanceApi.getLogs(),
                attendanceApi.getStatus()
            ]);
            setLogs(logsRes.data);
            setStatus(statusRes.data.status);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckIn = async () => {
        try {
            await attendanceApi.checkIn();
            fetchData();
        } catch (error) {
            alert(error.message || 'Error checking in');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );

    const StatusBadge = ({ logStatus }) => {
        const styles = {
            present: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
            late: "bg-amber-50 text-amber-600 border-amber-100/50",
            absent: "bg-rose-50 text-rose-600 border-rose-100/50"
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wider uppercase ${styles[logStatus] || 'bg-slate-50 text-slate-500'}`}>
                {logStatus}
            </span>
        );
    };

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">

            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Time & Attendance</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Access Registry Protocol</p>
                    </div>
                </div>
            </header>


            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 p-8 mb-6 overflow-hidden relative group text-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-accent/5 transition-colors"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                        <FaFingerprint size={28} className={status === 'checked_in' ? 'text-emerald-500' : 'text-slate-300'} />
                    </div>

                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Systems Status</h3>
                    <div className="mb-6">
                        <span className={`text-2xl font-black tracking-tight ${status === 'checked_in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {status.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    {status === 'not_checked_in' && (
                        <button
                            onClick={handleCheckIn}
                            className="bg-accent text-white h-11 px-10 rounded-xl text-xs font-bold hover:bg-slate-900 transition-all active:scale-[0.98] shadow-lg shadow-accent/20 flex items-center gap-2 group/btn"
                        >
                            <FaSignInAlt size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            Initialize Check-In
                        </button>
                    )}

                    {status === 'checked_in' && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl max-w-sm">
                            <p className="text-emerald-700 text-[11px] font-medium leading-relaxed">
                                Terminal Active. To finalize, please submit your
                                <a href="/dashboard/employee/todo" className="text-emerald-900 font-bold underline ml-1 hover:text-black">Work Report</a>.
                            </p>
                        </div>
                    )}

                    {status === 'checked_out' && (
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-2">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                            Log Complete for Target Date
                        </div>
                    )}
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FaHistory className="text-slate-300" size={14} />
                        Access Protocol History
                    </h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-0.5 rounded-full">
                        {logs.length} Entries
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Date</th>
                                <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">In-Time</th>
                                <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Out-Time</th>
                                <th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center tracking-widest border-b border-slate-100">Registry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map(log => (
                                <tr key={log.id} className="group hover:bg-slate-50/10 transition-colors">
                                    <td className="px-6 py-3 font-bold text-slate-700 text-xs">{log.date}</td>
                                    <td className="px-6 py-3 font-semibold text-slate-600 text-[11px]">
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-slate-200" size={10} />
                                            {formatTo12Hour(log.check_in)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 font-semibold text-slate-600 text-[11px]">
                                        {log.check_out ? (
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-slate-200" size={10} />
                                                {formatTo12Hour(log.check_out)}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <StatusBadge logStatus={log.status} />
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">No Registry Data</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
