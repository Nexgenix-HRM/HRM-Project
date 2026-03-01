import React, { useState, useEffect } from 'react';
import { employeeApi } from '../../../Api/employeeApi';
import { FaUserCircle, FaSearch, FaEnvelope, FaPhoneAlt, FaIdBadge, FaShieldAlt, FaBriefcase, FaUsers } from 'react-icons/fa';

const Directory = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDirectory = async () => {
        try {
            const response = await employeeApi.getDirectory();
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching directory", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirectory();
    }, []);

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.designation && member.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedMembers = {
        ceo: filteredMembers.filter(m => m.role === 'ceo'),
        hr: filteredMembers.filter(m => m.role === 'hr'),
        employee: filteredMembers.filter(m => m.role === 'employee'),
    };

    const MemberCard = ({ member }) => (
        <div className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center">

            <div className={`absolute -top-12 -right-12 w-32 h-32 opacity-[0.03] rounded-full transition-transform duration-700 group-hover:scale-150 ${member.role === 'ceo' ? 'bg-rose-500' : member.role === 'hr' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}></div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="relative mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-slate-50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        {member.profile_image ? (
                            <img
                                src={member.profile_image.startsWith('http') ? member.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${member.profile_image}`}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaUserCircle className="w-12 h-12 text-slate-200" />
                        )}
                    </div>
                    <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${member.role === 'ceo' ? 'bg-rose-500' : member.role === 'hr' ? 'bg-blue-500' : 'bg-emerald-500'
                        }`}></div>
                </div>

                <div className="mb-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-accent transition-colors">{member.name}</h4>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {member.designation || (member.role === 'ceo' ? 'Executive Lead' : member.role.toUpperCase())}
                    </span>
                </div>

                <div className="w-full pt-6 border-t border-slate-50 space-y-2">
                    <a
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center gap-3 py-2 px-4 rounded-xl text-slate-600 hover:bg-accent/5 hover:text-accent transition-all group/link !no-underline"
                        style={{ textDecoration: 'none' }}
                    >
                        <FaEnvelope size={14} className="opacity-50 group-hover/link:opacity-100" />
                        <span className="text-xs font-bold truncate">{member.email}</span>
                    </a>

                    <a
                        href={member.mobile_number ? `tel:${member.mobile_number}` : '#'}
                        className="flex items-center justify-center gap-3 py-2 px-4 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all group/link !no-underline"
                        style={{ textDecoration: 'none' }}
                    >
                        <FaPhoneAlt size={14} className="opacity-50 group-hover/link:opacity-100" />
                        <span className="text-xs font-bold">
                            {member.mobile_number || 'No contact linked'}
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );

    const RoleSection = ({ title, members, colorClass, icon: Icon }) => {
        if (members.length === 0) return null;
        return (
            <div className="mb-12">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${colorClass}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{title} Portfolio</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{members.length} Secure Entries</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map(member => <MemberCard key={member.id} member={member} />)}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-accent/40 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 pb-2">
                <header className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-accent to-purple-400 rounded-full shadow-[0_0_15px_rgba(112,48,160,0.4)]"></div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Personnel <span className="text-accent">Directory</span>
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium pl-5 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                        Corporate Asset Management & Communication
                    </p>
                </header>

                <div className="relative group max-w-sm w-full">
                    <input
                        type="text"
                        className="w-full h-14 pl-14 pr-6 bg-white border border-slate-100 rounded-2xl shadow-sm focus:border-accent/30 focus:ring-8 focus:ring-accent/5 transition-all outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={16} />
                </div>
            </div>

            <div className="space-y-4">
                <RoleSection title="CEO" members={groupedMembers.ceo} icon={FaShieldAlt} colorClass="bg-rose-500 shadow-rose-200" />
                <RoleSection title="HR" members={groupedMembers.hr} icon={FaBriefcase} colorClass="bg-blue-600 shadow-blue-200" />
                <RoleSection title="Team" members={groupedMembers.employee} icon={FaUsers} colorClass="bg-emerald-500 shadow-emerald-200" />
            </div>

            {filteredMembers.length === 0 && (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FaSearch className="text-slate-200" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No results discovered</h3>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Identity Scan: Zero Matches Found</p>
                </div>
            )}
        </div>
    );
};

export default Directory;
