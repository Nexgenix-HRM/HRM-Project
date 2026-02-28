import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaEdit, FaClipboardCheck, FaProjectDiagram, FaUserTie, FaHistory, FaArrowRight, FaClock } from 'react-icons/fa';
import { todoApi } from '../../../Api/todoApi';

const Todo = () => {
    const [formData, setFormData] = useState({
        project_name: '',
        description: '',
        assigned_by: ''
    });
    const [existingId, setExistingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const fetchData = async () => {
        try {
            const response = await todoApi.getTodos();
            const todos = response.data;
            setHistory(todos);

            const today = new Date().toISOString().split('T')[0];
            const todaysEntry = todos.find(todo => todo.date === today);

            if (todaysEntry) {
                setExistingId(todaysEntry.id);
                setFormData({
                    project_name: todaysEntry.project_name,
                    description: todaysEntry.description,
                    assigned_by: todaysEntry.assigned_by
                });
            } else {
                setExistingId(null);
                setFormData({ project_name: '', description: '', assigned_by: '' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (existingId) {
                await todoApi.updateTodo(existingId, formData);
                alert('Work submission updated successfully');
            } else {
                await todoApi.submitTodo(formData);
                alert('Work submitted and Checked Out successfully');
            }
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error.message || 'Error submitting work');
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

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-accent to-purple-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Work <span className="text-accent">Submission</span></h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1 opacity-70">Operational Report & Accountability Gateway</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                <div className="xl:col-span-5 space-y-6 sticky top-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10 relative overflow-hidden group">

                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {existingId ? "Synchronize Report" : "Daily Protocol"}
                                </h3>
                                <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                                    <FaClipboardCheck size={16} />
                                </div>
                            </div>

                            {!existingId && (
                                <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700 text-[11px] font-bold uppercase tracking-wider animate-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></div>
                                    Secure Check-Out Trigger Enabled
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Identifier</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="project_name"
                                            className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                            value={formData.project_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Enterprise CRM Evolution"
                                        />
                                        <FaProjectDiagram size={12} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-accent transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Summary of Progress</label>
                                    <textarea
                                        name="description"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all outline-none text-sm font-medium text-slate-800 resize-none placeholder:text-slate-300 min-h-[140px]"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Outline your primary achievements and milestones reached today..."
                                    ></textarea>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reporting Authority</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="assigned_by"
                                            className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                            value={formData.assigned_by}
                                            onChange={handleChange}
                                            required
                                            placeholder="Direct Supervisor / Lead"
                                        />
                                        <FaUserTie size={12} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-accent transition-colors" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 group shadow-xl ${existingId
                                        ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                                        : 'bg-accent text-white hover:bg-slate-900 shadow-accent/20'
                                        }`}
                                >
                                    {existingId ? (
                                        <>Refine Submission <FaEdit size={16} className="group-hover:rotate-12 transition-transform" /></>
                                    ) : (
                                        <>Commit & Check Out <FaPaperPlane size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>


                <div className="xl:col-span-7">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
                        <div className="p-8 md:p-10 flex items-center justify-between border-b border-slate-50 bg-slate-50/10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    <FaHistory className="text-slate-200" size={20} />
                                    Archive Protocol
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{history.length} Verified Validations</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 space-y-6">
                            {history.map((todo, index) => (
                                <div key={todo.id} className="group relative">
                                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-2xl transition-all duration-500">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-accent group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                                    <FaProjectDiagram size={16} />
                                                </div>
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-accent transition-colors">{todo.project_name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-md border border-slate-100">
                                                            Auth: {todo.assigned_by}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-1.5 bg-white rounded-xl text-[10px] font-black tracking-widest text-slate-400 border border-slate-100 shadow-sm">
                                                {new Date(todo.date || todo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>

                                        <div className="relative pl-4">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-full opacity-30 group-hover:bg-accent group-hover:opacity-100 transition-all duration-500"></div>
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                                "{todo.description}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {history.length === 0 && (
                                <div className="py-32 text-center bg-slate-50/30 rounded-[3rem] border border-dashed border-slate-100">
                                    <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <FaClipboardCheck className="text-slate-200" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Archive Protocol Empty</h3>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Synchronizing Operational Relays...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;
