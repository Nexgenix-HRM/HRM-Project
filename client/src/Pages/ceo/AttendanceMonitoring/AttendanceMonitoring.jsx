import React, { useState, useEffect } from 'react';
import { monitoringApi } from '../../../Api/monitoringApi';
import { FaCalendarCheck, FaCalendarAlt, FaUserCircle, FaClock, FaCheckCircle, FaExclamationCircle, FaSearch } from 'react-icons/fa';
import { formatTo12Hour } from '../../../utils/timeFormatter';

const AttendanceMonitoring = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                const response = await monitoringApi.getAttendance(date);
                setRecords(response.data);
            } catch (error) {
                console.error("Error fetching attendance", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [date]);

    const calculateDuration = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return null;
        try {
            const start = new Date(`1970-01-01T${checkIn}`);
            const end = new Date(`1970-01-01T${checkOut}`);
            const diff = (end - start) / 60000; // minutes
            const h = Math.floor(diff / 60);
            const m = Math.round(diff % 60);
            return `${h}h ${m}m`;
        } catch (e) {
            return "N/A";
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personnel Attendance Records</h1>
                    <p className="text-sm text-slate-500">Detailed check-in and check-out tracking.</p>
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
                            className="border-none outline-none text-sm font-semibold text-slate-700 w-full"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : records.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <FaCalendarCheck className="text-slate-200" size={24} />
                    </div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No attendance records for this date</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    <th className="px-6 py-4">Personnel</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Check-In</th>
                                    <th className="px-6 py-4">Check-Out</th>
                                    <th className="px-6 py-4">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {records.filter(record =>
                                    record.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (record.user.designation && record.user.designation.toLowerCase().includes(searchQuery.toLowerCase()))
                                ).map(record => (
                                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-[200px]">
                                                {record.user.profile_image ? (
                                                    <img
                                                        src={record.user.profile_image.startsWith('http') ? record.user.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${record.user.profile_image}`}
                                                        className="w-10 h-10 rounded-xl object-cover shadow-sm"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                                        <FaUserCircle size={20} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 leading-tight">{record.user.name}</div>
                                                    <div className="text-[10px] font-semibold text-accent uppercase tracking-wider whitespace-nowrap">{record.user.designation || record.user.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-wider uppercase border border-emerald-100 whitespace-nowrap">
                                                <FaCheckCircle size={10} /> {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 text-[13px] font-bold whitespace-nowrap">
                                                <FaClock className="text-blue-500" size={12} />
                                                {formatTo12Hour(record.check_in) || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 text-[13px] font-bold whitespace-nowrap">
                                                <FaClock className="text-orange-500" size={12} />
                                                {formatTo12Hour(record.check_out) || '--:--'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.check_in && record.check_out ? (
                                                <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg whitespace-nowrap">
                                                    {calculateDuration(record.check_in, record.check_out)}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-black text-rose-400 bg-rose-50 px-2 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap">
                                                    <FaExclamationCircle size={10} /> ACTIVE
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceMonitoring;
