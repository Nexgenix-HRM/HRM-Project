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
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-accent to-purple-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daily <span className="text-accent">Activity</span></h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1 opacity-70">Time Block Specification & Audit</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                <div className="xl:col-span-5 space-y-6 sticky top-8">

                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10 relative overflow-hidden group">

                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-900">Log Activity</h3>
                                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                                    <FaPlus size={16} />
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[11px] font-bold uppercase tracking-wider animate-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></div>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all outline-none text-slate-900 font-bold"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                                        <input
                                            type="time"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all outline-none text-slate-900 font-bold"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Activity Context</label>
                                    <textarea
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all outline-none text-sm font-medium text-slate-800 resize-none placeholder:text-slate-300 min-h-[120px]"
                                        name="description"
                                        placeholder="Briefly describe your focus during this block..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-14 bg-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-[0.98] shadow-xl shadow-accent/20 flex items-center justify-center gap-3 group"
                                >
                                    Commit Log <FaHistory className="group-hover:rotate-12 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-950 to-slate-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl group">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                            <FaHourglassHalf size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                                <h6 className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Yield Intensity Analytics</h6>
                            </div>
                            <h2 className="text-5xl font-black tracking-tighter text-white mb-2">
                                {calculateTotalHours()}
                            </h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Aggregate Daily Workload</p>
                        </div>
                    </div>
                </div>


                <div className="xl:col-span-7">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
                        <div className="p-8 md:p-10 flex items-center justify-between border-b border-slate-50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    <FaHistory className="text-slate-200" size={20} />
                                    Phase Log History
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Synchronized Timeline Protocol</p>
                            </div>
                            <div className="px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <FaCalendarDay className="text-accent" size={14} />
                                <span className="text-xs font-black text-slate-900 tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 space-y-6">
                            {activities.map((activity, index) => (
                                <div key={activity.id} className="relative pl-12 group">

                                    <div className="absolute left-[1.35rem] top-0 bottom-0 w-1 bg-slate-50 group-last:bottom-auto group-last:h-4 rounded-full"></div>


                                    <div className="absolute left-0 top-0 w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 group-hover:border-accent group-hover:text-accent transition-all duration-500 z-10 shadow-sm group-hover:shadow-xl group-hover:scale-110">
                                        <FaClock size={14} />
                                    </div>

                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-2xl transition-all duration-500">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 text-[11px] font-black text-slate-900 tracking-tighter shadow-sm flex items-center gap-2">
                                                    <span className="text-slate-400">FROM</span> {activity.start_time?.substring(0, 5)}
                                                    <span className="text-slate-400 mx-1">/</span>
                                                    <span className="text-slate-400">TO</span> {activity.end_time?.substring(0, 5)}
                                                </div>
                                                <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                                                <div className="px-3 py-1 bg-accent/5 text-accent text-[10px] font-black tracking-widest uppercase rounded-lg border border-accent/10">
                                                    {(() => {
                                                        const start = new Date(`1970-01-01T${activity.start_time}`);
                                                        const end = new Date(`1970-01-01T${activity.end_time}`);
                                                        const diff = (end - start) / 60000;
                                                        const h = Math.floor(diff / 60);
                                                        const m = Math.round(diff % 60);
                                                        return `${h > 0 ? h + 'h ' : ''}${m}m Duration`;
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Block Index #{activities.length - index}</div>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {activities.length === 0 && (
                                <div className="py-32 text-center bg-slate-50/30 rounded-[3rem] border border-dashed border-slate-100">
                                    <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <FaClock className="text-slate-200" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Timeline Empty</h3>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Awaiting Primary Phase Initiation</p>
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
