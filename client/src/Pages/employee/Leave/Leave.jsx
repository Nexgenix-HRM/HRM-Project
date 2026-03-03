import React, { useState, useEffect } from 'react';
import {
    FaCalendarPlus, FaCheck, FaTimes, FaFileAlt, FaHistory,
    FaCloudUploadAlt, FaCalendarAlt, FaEnvelope,
    FaInfoCircle, FaRegClock, FaChevronRight, FaArrowRight, FaCheckCircle
} from 'react-icons/fa';
import { leaveApi } from '../../../Api/leaveApi';

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        reason: '',
        document: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userRole = localStorage.getItem('role');

    const fetchLeaves = async () => {
        try {
            const response = userRole === 'employee' ? await leaveApi.getMyLeaves() : await leaveApi.getLeaves();
            setLeaves(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'document') {
            setFormData({ ...formData, document: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const data = new FormData();
        data.append('start_date', formData.start_date);
        data.append('end_date', formData.end_date);
        data.append('reason', formData.reason);
        if (formData.document) {
            data.append('document', formData.document);
        }

        try {
            await leaveApi.submitLeave(data);
            setSuccessMessage('Leave request submitted successfully');
            setFormData({ start_date: '', end_date: '', reason: '', document: null });

            // Fetch in background, success message is already shown
            fetchLeaves();

            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            console.error('Submission error:', error);
            setError(error.message || 'Error submitting leave request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        setUpdatingId(id);
        setError('');
        try {
            await leaveApi.updateStatus(id, status);
            await fetchLeaves();
            setSuccessMessage(`Request ${status} successfully`);
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            console.error(error);
            setError('Error updating status');
        } finally {
            setUpdatingId(null);
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

    const StatusBadge = ({ status }) => {
        const styles = {
            approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
            rejected: "bg-rose-50 text-rose-600 border-rose-100",
            pending: "bg-blue-50 text-blue-600 border-blue-100"
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="min-h-screen p-4 lg:p-8 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>

            {/* Header Section */}
            <header className="max-w-7xl mx-auto mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Time Off</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Leave Management Protocol</p>
                    </div>
                </div>
            </header>

            <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[9999] pointer-events-none">
                {error && (
                    <div className="mb-2 p-3 bg-white border-2 border-rose-500 rounded-xl flex items-center justify-between gap-3 text-rose-600 text-[11px] shadow-2xl pointer-events-auto">
                        <div className="flex items-center gap-2">
                            <FaInfoCircle className="shrink-0" size={14} />
                            <span className="font-bold">{error}</span>
                        </div>
                        <button onClick={() => setError('')} className="p-1 hover:bg-rose-50 rounded-lg transition-colors">
                            <FaTimes size={10} />
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-2 p-3 bg-white border-2 border-emerald-500 rounded-xl flex items-center justify-between gap-3 text-emerald-600 text-[11px] shadow-2xl pointer-events-auto">
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className="shrink-0" size={14} />
                            <span className="font-bold">{successMessage}</span>
                        </div>
                        <button onClick={() => setSuccessMessage('')} className="p-1 hover:bg-emerald-50 rounded-lg transition-colors">
                            <FaTimes size={10} />
                        </button>
                    </div>
                )}
            </div>

            <div className={`max-w-7xl mx-auto grid grid-cols-1 ${userRole === 'employee' ? 'xl:grid-cols-12' : ''} gap-6 lg:gap-8 relative z-10`}>


                {userRole === 'employee' && (
                    <div className="xl:col-span-5">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 lg:p-8 xl:sticky xl:top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Request Leave</h3>
                                <div className="p-2.5 bg-accent text-white rounded-xl shadow-lg shadow-accent/20">
                                    <FaCalendarPlus size={16} />
                                </div>
                            </div>



                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1 group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="start_date"
                                                className="w-full h-11 px-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 transition-all outline-none text-slate-800 font-semibold cursor-pointer"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                required
                                            />
                                            <FaCalendarAlt size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1 group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="end_date"
                                                className="w-full h-11 px-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 transition-all outline-none text-slate-800 font-semibold cursor-pointer"
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                required
                                            />
                                            <FaCalendarAlt size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>


                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason for Absence</label>
                                    <textarea
                                        rows="3"
                                        name="reason"
                                        className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 transition-all outline-none text-slate-800 font-medium resize-none placeholder:text-slate-300"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        required
                                        placeholder="Briefly explain your request..."
                                    />
                                </div>

                                {/* Document Upload */}
                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Documents (Optional)</label>
                                    <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50/50 hover:border-slate-400 transition-all group/upload bg-slate-50/30">
                                        <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                            <FaCloudUploadAlt className="w-6 h-6 mb-1 text-slate-300 group-hover/upload:text-slate-900 transition-colors" />
                                            <p className="text-[10px] font-bold text-slate-500 group-hover/upload:text-slate-900 text-center px-4 truncate max-w-full">
                                                {formData.document ? formData.document.name : 'Click to select file'}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleChange}
                                            name="document"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full h-11 bg-accent text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group/btn shadow-md shadow-accent/10 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span className="animate-pulse">Uploading...</span>
                                        </div>
                                    ) : (
                                        <>Submit Request <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}


                <div className={userRole === 'employee' ? 'xl:col-span-7' : 'w-full max-w-5xl mx-auto'}>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <FaHistory className="text-slate-300" size={16} />
                                    {userRole === 'employee' ? 'Latest 10 Requests' : 'Latest 10 Applications'}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">{leaves.length} Total</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-y-2 px-4">
                                <thead>
                                    <tr className="text-slate-400 uppercase text-[9px] font-black tracking-widest">
                                        {userRole !== 'employee' && <th className="px-4 pb-1 text-left">Applicant</th>}
                                        <th className="px-4 pb-1 text-left">Period</th>
                                        <th className="px-4 pb-1 text-left">Context</th>
                                        <th className="px-4 pb-1 text-left">Status</th>
                                        {userRole !== 'employee' && <th className="px-4 pb-1 text-center">Action</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/50">
                                    {leaves.map(leave => (
                                        <tr key={leave.id} className="group hover:bg-slate-50/50 transition-all">
                                            {userRole !== 'employee' && (
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                                                            {leave.user?.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-800">{leave.user?.name}</div>
                                                            <div className="text-[9px] text-slate-400 font-semibold lowercase">{leave.user?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400">
                                                        <FaCalendarAlt size={12} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-bold text-slate-700">{leave.start_date}</div>
                                                        <div className="text-[9px] text-slate-400 font-bold uppercase">
                                                            to <span className="text-slate-500">{leave.end_date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="max-w-[150px]">
                                                    <p className="text-[11px] text-slate-600 line-clamp-1 italic" title={leave.reason}>
                                                        "{leave.reason}"
                                                    </p>
                                                    {leave.document_path && (
                                                        <a
                                                            href={leave.document_path.startsWith('http') ? leave.document_path : `${import.meta.env.VITE_STORAGE_URL}/${leave.document_path}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="text-[8px] text-slate-900 font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-full inline-flex items-center mt-1 hover:bg-slate-900 hover:text-white transition-colors"
                                                        >
                                                            <FaFileAlt size={8} className="mr-1 opacity-50" /> Verify
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <StatusBadge status={leave.status} />
                                            </td>
                                            {userRole !== 'employee' && (
                                                <td className="py-3 px-4">
                                                    {leave.status === 'pending' ? (
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => handleStatusUpdate(leave.id, 'approved')}
                                                                disabled={updatingId === leave.id}
                                                                className={`w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50 hover:bg-emerald-600 hover:text-white transition-all shadow-sm ${updatingId === leave.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {updatingId === leave.id ? (
                                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <FaCheck size={10} />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                                                                disabled={updatingId === leave.id}
                                                                className={`w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100/50 hover:bg-rose-600 hover:text-white transition-all shadow-sm ${updatingId === leave.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {updatingId === leave.id ? (
                                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <FaTimes size={10} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center text-slate-200">
                                                            <FaRegClock size={12} />
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {leaves.length === 0 && (
                                        <tr>
                                            <td colSpan={userRole === 'employee' ? 3 : 5} className="py-16 text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Records</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leave;
