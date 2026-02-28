import React from 'react';
import { FaUsers, FaCalendarTimes, FaBuilding, FaArrowUp, FaChartLine } from 'react-icons/fa';
import NoticeAcknowledgment from '../../../components/NoticeAcknowledgment';

const CEOHome = () => {
    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
           
            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(112,48,160,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
                        <p className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">Enterprise Intelligence Hub</p>
                    </div>
                </div>
            </header>

            <NoticeAcknowledgment />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
             
                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10 group-hover:bg-purple-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-purple-50 text-accent rounded-lg flex items-center justify-center mb-4">
                            <FaUsers size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Human Capital</h6>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">--</h2>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 mb-0.5">
                                <FaArrowUp size={7} /> Active
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50 rounded-full -mr-10 -mt-10 group-hover:bg-rose-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-4">
                            <FaCalendarTimes size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Clearances</h6>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">--</h2>
                            <div className="text-[9px] font-bold text-slate-400 mb-0.5 uppercase tracking-tighter">Queued</div>
                        </div>
                    </div>
                </div>

                
                <div className="group bg-white rounded-2xl p-6 border border-accent/20 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10 group-hover:bg-purple-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                            <FaChartLine size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">System Status</h6>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Optimal</h2>
                            <div className="text-[8px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full border border-accent/20 mb-0.5 uppercase tracking-tighter">Verified</div>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-8 lg:p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '12px 12px' }}></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                        <FaBuilding className="text-slate-300" size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight uppercase">Command Center Active</h2>
                    <p className="text-[13px] text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                        Interface operational. Use the navigation portal to manage enterprise assets and monitor real-time system protocols.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CEOHome;
