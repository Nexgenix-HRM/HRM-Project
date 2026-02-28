import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaEdit, FaClipboardCheck, FaProjectDiagram, FaUserTie, FaHistory, FaArrowRight, FaClock } from 'react-icons/fa';
import { todoApi } from '../../../api/todoApi';

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
        <div className="p-4 lg:p-8">
            {/* Branded Header */}
            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Work Submission</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Operational Report Gateway</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                {/* Submission Form */}
                <div className="xl:col-span-12 2xl:col-span-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 lg:p-8 sticky top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">
                                {existingId ? "Synchronize Report" : "Daily Protocol"}
                            </h3>
                            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
                                <FaClipboardCheck size={16} />
                            </div>
                        </div>

                        {!existingId && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-amber-700 text-[11px] font-medium">
                                <FaClock size={12} className="text-amber-500 shrink-0" />
                                Submitting will trigger an automated Secure Check-Out.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Project Identifier</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="project_name"
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent transition-all outline-none text-xs font-semibold text-slate-800"
                                        value={formData.project_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Project NEX"
                                    />
                                    <FaProjectDiagram size={10} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Summary of Progress</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent transition-all outline-none text-xs font-medium text-slate-800 resize-none placeholder:text-slate-300"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Outline your key achievements today..."
                                ></textarea>
                            </div>

                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reporting Authority</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="assigned_by"
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent transition-all outline-none text-xs font-semibold text-slate-800"
                                        value={formData.assigned_by}
                                        onChange={handleChange}
                                        required
                                        placeholder="Lead/Manager Name"
                                    />
                                    <FaUserTie size={10} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full h-11 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn shadow-md ${existingId
                                    ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                                    : 'bg-accent text-white hover:bg-slate-900 shadow-accent/20'
                                    }`}
                            >
                                {existingId ? (
                                    <>Refine Submission <FaEdit size={10} className="group-hover/btn:rotate-12 transition-transform" /></>
                                ) : (
                                    <>Commit & Check Out <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History List */}
                <div className="xl:col-span-12 2xl:col-span-7">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <FaHistory className="text-slate-300" size={16} />
                                    Archive Protocol
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{history.length} Validations</p>
                            </div>
                        </div>

                        <div className="p-4 lg:p-6 space-y-3">
                            {history.map(todo => (
                                <div key={todo.id} className="group bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:bg-white hover:border-accent/10 hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-accent group-hover:text-white transition-colors">
                                                <FaProjectDiagram size={12} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{todo.project_name}</h4>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Auth: {todo.assigned_by}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 bg-white rounded-full text-[9px] font-black tracking-widest text-slate-400 border border-slate-100">
                                            {new Date(todo.date || todo.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200 rounded-full opacity-30 group-hover:bg-accent transition-colors"></div>
                                        <p className="ml-3 text-[11px] text-slate-600 font-medium leading-relaxed italic line-clamp-2" title={todo.description}>
                                            "{todo.description}"
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {history.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                                        <FaClipboardCheck className="text-slate-200" size={18} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Archives...</p>
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
