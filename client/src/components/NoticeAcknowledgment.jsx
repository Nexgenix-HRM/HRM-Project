import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBullhorn, FaTimes, FaArrowRight } from 'react-icons/fa';
import { noticeApi } from '../api/noticeApi';

const NoticeAcknowledgment = () => {
    const navigate = useNavigate();
    const [latestNotice, setLatestNotice] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const checkNewNotices = async () => {
            try {
                const response = await noticeApi.getNotices({ dashboard: true });
                const publishedNotices = response.data;

                if (publishedNotices && publishedNotices.length > 0) {
                    const mostRecent = publishedNotices[0];
                    const userEmail = localStorage.getItem('userEmail') || 'guest';
                    const acknowledgedId = localStorage.getItem(`acknowledged_notice_${userEmail}_${mostRecent.id}`);

                    if (!acknowledgedId) {
                        setLatestNotice(mostRecent);
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching notices for acknowledgment:', error);
            }
        };

        checkNewNotices();
    }, []);

    const handleAcknowledge = () => {
        if (latestNotice) {
            const userEmail = localStorage.getItem('userEmail') || 'guest';
            localStorage.setItem(`acknowledged_notice_${userEmail}_${latestNotice.id}`, 'true');
            setIsVisible(false);
        }
    };

    const handleView = () => {
        handleAcknowledge();
        const path = role === 'ceo' ? '/dashboard/ceo/notices-manage' :
            role === 'hr' ? '/dashboard/hr/notices-manage' :
                '/dashboard/employee/notices';
        navigate(path);
    };

    if (!isVisible || !latestNotice) return null;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white rounded-[2rem] p-1 border border-purple-100 shadow-xl overflow-hidden relative group">
                {/* Decorative background element - Lightened */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-purple-100 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 p-5 md:pl-8 md:pr-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
                            <FaBullhorn className="text-white" size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">New Official Notice</span>
                                <span className="w-1 h-1 bg-purple-200 rounded-full"></span>
                                <span className="text-[10px] font-bold text-slate-400">{new Date(latestNotice.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{latestNotice.title}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleView}
                            className="flex-1 md:flex-none h-11 px-8 bg-accent text-white rounded-xl text-xs font-black hover:bg-primary transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn shadow-lg shadow-accent/20"
                        >
                            Review Details <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={handleAcknowledge}
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-50 text-accent hover:text-white hover:bg-accent transition-all"
                            title="Dismiss"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeAcknowledgment;
