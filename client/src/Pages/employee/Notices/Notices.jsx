import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { noticeApi } from '../../../api/noticeApi';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await noticeApi.getNotices();
                setNotices(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto">
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Official Notices</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Company Announcements</p>
                    </div>
                </div>
            </header>

            <div className="space-y-6">
                {notices.map(notice => (
                    <div key={notice.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-accent/10 rounded-xl">
                                <FaBullhorn className="text-accent" size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-bold text-slate-900 mb-2">{notice.title}</h2>
                                    {notice.target_user_id && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>
                                            Personal Notice
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <FaUser size={10} />
                                <span>{notice.creator?.name} ({notice.creator?.role?.toUpperCase()})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt size={10} />
                                <span>{new Date(notice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {notices.length === 0 && (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <FaBullhorn className="mx-auto mb-4 text-slate-200" size={48} />
                        <p className="text-sm font-bold text-slate-400">No notices available at the moment</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notices;
