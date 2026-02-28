import React, { useState, useEffect } from 'react';
import { FaPlus, FaClock, FaCalendarDay, FaHistory, FaHourglassHalf } from 'react-icons/fa';
import { employeeApi } from '../../../Api/employeeApi';

const DailyActivity = () => {
    const [activities, setActivities] = useState([]);
    const [formData, setFormData] = useState({
        start_time: '',
        end_time: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchActivities = async () => {
        try {
            const response = await employeeApi.getActivities();
            setActivities(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.end_time <= formData.start_time) {
            setError('End time must be after start time');
            return;
        }

        try {
            await employeeApi.submitActivity(formData);
            setFormData({ start_time: '', end_time: '', description: '' });
            fetchActivities();
        } catch (error) {
            console.error(error);
            setError(error.message || 'Error logging activity');
        }
    };

    const calculateTotalHours = () => {
        let totalMinutes = 0;
        activities.forEach(activity => {
            if (activity.start_time && activity.end_time) {
                const start = new Date(`1970-01-01T${activity.start_time}`);
                const end = new Date(`1970-01-01T${activity.end_time}`);
                totalMinutes += (end - start) / 60000;
            }
        });
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
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

    return (
        <div className="p-4 lg:p-8">

            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Activity Log</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Time Slot Audit Protocol</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">

                <div className="xl:col-span-12 2xl:col-span-5 space-y-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">New Time Block</h3>
                            <div className="p-2 bg-slate-900 text-white rounded-lg">
                                <FaPlus size={14} />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Phase</label>
                                    <input
                                        type="time"
                                        className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-accent transition-all outline-none text-slate-800 font-bold"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Phase</label>
                                    <input
                                        type="time"
                                        className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-accent transition-all outline-none text-slate-800 font-bold"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Activity Specification</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent transition-all outline-none text-xs font-medium text-slate-800 resize-none placeholder:text-slate-300"
                                    rows="3"
                                    name="description"
                                    placeholder="Define the task context..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full h-11 bg-accent text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all active:scale-[0.98] shadow-md shadow-accent/20">
                                Commit Time Block
                            </button>
                        </form>
                    </div>


                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                            <FaHourglassHalf size={60} />
                        </div>
                        <div className="relative z-10">
                            <h6 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Work Intensity Meter</h6>
                            <h2 className="text-3xl font-black tracking-tighter text-white mb-0">
                                {calculateTotalHours()}
                            </h2>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="h-1 w-1 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Real-time Sync</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="xl:col-span-12 2xl:col-span-7">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden h-full">
                        <div className="p-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/30">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <FaHistory className="text-slate-300" size={16} />
                                    Phase Log History
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Protocol Timeline</p>
                            </div>
                            <span className="px-2.5 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                <FaCalendarDay className="text-accent" size={10} />
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>

                        <div className="p-6 space-y-4">
                            {activities.map(activity => (
                                <div key={activity.id} className="relative pl-10 group">
                                    <div className="absolute left-[1.125rem] top-0 bottom-0 w-[1px] bg-slate-100 group-last:bottom-auto group-last:h-4"></div>
                                    <div className="absolute left-0 top-0 w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 group-hover:border-accent group-hover:text-accent transition-all z-10 shadow-sm">
                                        <FaClock size={10} />
                                    </div>

                                    <div className="bg-slate-50/50 p-4 rounded-xl border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="px-2 py-0.5 bg-white rounded-md border border-slate-100 text-[10px] font-black text-slate-700 tracking-tighter">
                                                {activity.start_time?.substring(0, 5)} — {activity.end_time?.substring(0, 5)}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                                {(() => {
                                                    const start = new Date(`1970-01-01T${activity.start_time}`);
                                                    const end = new Date(`1970-01-01T${activity.end_time}`);
                                                    const diff = (end - start) / 60000;
                                                    const h = Math.floor(diff / 60);
                                                    const m = Math.round(diff % 60);
                                                    return `${h > 0 ? h + 'h ' : ''}${m}m`;
                                                })()}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic line-clamp-2">
                                            "{activity.description}"
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {activities.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                                        <FaClock className="text-slate-200 opacity-50" size={18} />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Phase Log Terminal Idle</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyActivity;
