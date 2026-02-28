import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarCheck, FaBriefcase, FaArrowRight, FaChartPie } from 'react-icons/fa';
import NoticeAcknowledgment from '../../../components/NoticeAcknowledgment';

const HRHome = () => {
    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">

            <header className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Operations</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Management Gateway</p>
                    </div>
                </div>
            </header>

            <NoticeAcknowledgment />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">

                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -mr-10 -mt-10 group-hover:bg-emerald-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                            <FaUsers size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Workforce Count</h6>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">--</h2>
                    </div>
                </div>


                <div className="group bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:bg-blue-100/50 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <FaCalendarCheck size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Daily Presence</h6>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">--</h2>
                    </div>
                </div>


                <div className="group bg-slate-900 rounded-2xl p-6 text-white shadow-lg transition-all hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-accent/20 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                            <FaChartPie size={16} />
                        </div>
                        <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Resource Meta</h6>
                        <h2 className="text-2xl font-black text-white tracking-tighter">Active</h2>
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-8 lg:p-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '12px 12px' }}></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <FaBriefcase className="text-slate-300" size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight uppercase">Operations Terminal</h2>
                    <p className="text-[13px] text-slate-500 font-medium max-w-md mx-auto mb-6 leading-relaxed">
                        Connection secure. Access operational logs and monitor personnel lifecycle protocols via the command portal.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/dashboard/hr/directory" className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-black transition-all flex items-center gap-2">
                            Directory <FaArrowRight size={9} />
                        </Link>
                        <Link to="/dashboard/hr/leave" className="h-10 px-6 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                            Leaves <FaArrowRight size={9} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRHome;
