import React, { useState, useEffect } from 'react';
import { ceoApi } from '../../../Api/ceoApi';
import { FaUserPlus, FaEnvelope, FaPhoneAlt, FaShieldAlt, FaIdBadge, FaCheck, FaTimes, FaLock, FaUserTag, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'employee', designation: '', mobile_number: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await ceoApi.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ceoApi.createUser(formData);
            setFormData({ name: '', email: '', password: '', role: 'employee', designation: '', mobile_number: '' });
            setShowAddForm(false);
            fetchUsers();
            alert('User created successfully!');
        } catch (error) {
            alert(error.message || 'Error creating user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
        try {
            await ceoApi.deleteUser(userId);
            fetchUsers();
            alert('User deleted successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Error deleting user');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-vh-100">
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );

    const RoleBadge = ({ role }) => {
        const styles = {
            ceo: "bg-rose-50 text-rose-600 border-rose-100",
            hr: "bg-blue-50 text-blue-600 border-blue-100",
            employee: "bg-emerald-50 text-emerald-600 border-emerald-100"
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest border uppercase ${styles[role] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {role}
            </span>
        );
    };

    const UserAvatar = ({ user, colorClass }) => {
        if (user.profile_image) {
            return (
                <img
                    src={`${import.meta.env.VITE_STORAGE_URL}/${user.profile_image}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-lg object-cover shadow-sm"
                />
            );
        }
        return (
            <div className={`w-9 h-9 text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${colorClass}`}>
                {user.name.charAt(0)}
            </div>
        );
    };

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">

            <div className="flex items-center justify-between gap-4 mb-6">
                <header>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Management</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Access Control Terminal</p>
                        </div>
                    </div>
                </header>

                <button
                    className={`h-10 px-5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 shadow-md ${showAddForm ? 'bg-slate-900 text-white hover:bg-black' : 'bg-accent text-white hover:bg-slate-900 shadow-accent/20'
                        }`}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? (
                        <>Cancel Protocol <FaTimes size={10} /></>
                    ) : (
                        <>New Entry <FaUserPlus size={12} /></>
                    )}
                </button>
            </div>

            {/* Streamlined Creation Form */}
            {showAddForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 lg:p-8 mb-6 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="p-2 bg-accent text-white rounded-lg">
                            <FaUserTag size={16} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Define Identity Profile</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                                <input type="text" name="name" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent outline-none text-[11px] font-semibold" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <input type="email" name="email" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent outline-none text-[11px] font-semibold" value={formData.email} onChange={handleChange} required placeholder="email@enterprise.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Credentials</label>
                                <div className="relative">
                                    <input type="password" name="password" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent outline-none text-[11px] font-semibold" value={formData.password} onChange={handleChange} required placeholder="Password" />
                                    <FaLock size={9} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Role</label>
                                <select name="role" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent outline-none text-[11px] font-bold" value={formData.role} onChange={handleChange}>
                                    <option value="employee">Field Agent (Employee)</option>
                                    <option value="hr">Resource Lead (HR)</option>
                                    <option value="ceo">Executive Lead (CEO)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Title</label>
                                <input type="text" name="designation" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent outline-none text-[11px] font-semibold" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Specialist" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Link</label>
                                <input type="text" name="mobile_number" className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-accent outline-none text-[11px] font-semibold" value={formData.mobile_number} onChange={handleChange} placeholder="+1 234 567 890" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="h-10 px-8 bg-accent text-white rounded-xl text-[10px] font-bold hover:bg-slate-900 transition-all shadow-md shadow-accent/20 flex items-center gap-2">
                                <FaCheck size={10} /> Commit to Registry
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Registry Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <FaShieldAlt className="text-slate-300" size={16} />
                            Active Identity Registry
                        </h3>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-widest">Global personnel status verified</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {/* CEO Section */}
                    {users.filter(u => u.role === 'ceo').length > 0 && (
                        <>
                            <div className="px-6 py-3 bg-rose-50/30 border-b border-rose-100">
                                <h4 className="text-sm font-black text-rose-700 uppercase tracking-wider flex items-center gap-2">
                                    <FaShieldAlt size={12} />
                                    Executive Leadership
                                </h4>
                            </div>
                            <table className="w-full border-collapse">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Identity</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Designation</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Interface Details</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest border-b border-slate-100">Registry Date</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest border-b border-slate-100">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.filter(u => u.role === 'ceo').map(u => (
                                        <tr key={u.id} className="group hover:bg-slate-50/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar user={u} colorClass="bg-rose-600 group-hover:bg-rose-700" />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{u.name}</div>
                                                        <RoleBadge role={u.role} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs italic">
                                                    <FaIdBadge className="text-slate-200" size={11} />
                                                    {u.designation || 'Executive'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <FaEnvelope size={10} className="opacity-30" />
                                                        {u.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <FaPhoneAlt size={10} className="opacity-30" />
                                                        {u.mobile_number || 'Secure Link'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-black text-slate-400 tracking-tighter bg-white border border-slate-100 px-2 py-0.5 rounded-full">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {localStorage.getItem('userId') != u.id && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* HR Section */}
                    {users.filter(u => u.role === 'hr').length > 0 && (
                        <>
                            <div className="px-6 py-3 bg-blue-50/30 border-b border-blue-100 mt-4">
                                <h4 className="text-sm font-black text-blue-700 uppercase tracking-wider flex items-center gap-2">
                                    <FaUserTag size={12} />
                                    Human Resources
                                </h4>
                            </div>
                            <table className="w-full border-collapse">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Identity</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Designation</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Interface Details</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest border-b border-slate-100">Registry Date</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest border-b border-slate-100">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.filter(u => u.role === 'hr').map(u => (
                                        <tr key={u.id} className="group hover:bg-slate-50/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar user={u} colorClass="bg-blue-600 group-hover:bg-blue-700" />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{u.name}</div>
                                                        <RoleBadge role={u.role} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs italic">
                                                    <FaIdBadge className="text-slate-200" size={11} />
                                                    {u.designation || 'HR Manager'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <FaEnvelope size={10} className="opacity-30" />
                                                        {u.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <FaPhoneAlt size={10} className="opacity-30" />
                                                        {u.mobile_number || 'Secure Link'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-black text-slate-400 tracking-tighter bg-white border border-slate-100 px-2 py-0.5 rounded-full">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {localStorage.getItem('userId') != u.id && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Employee Section */}
                    {users.filter(u => u.role === 'employee').length > 0 && (
                        <>
                            <div className="px-6 py-3 bg-emerald-50/30 border-b border-emerald-100 mt-4">
                                <h4 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                                    <FaUserTag size={12} />
                                    Field Personnel
                                </h4>
                            </div>
                            <table className="w-full border-collapse">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Identity</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Designation</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-left tracking-widest border-b border-slate-100">Interface Details</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest border-b border-slate-100">Registry Date</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 text-center tracking-widest border-b border-slate-100">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.filter(u => u.role === 'employee').map(u => (
                                        <tr key={u.id} className="group hover:bg-slate-50/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar user={u} colorClass="bg-emerald-600 group-hover:bg-emerald-700" />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{u.name}</div>
                                                        <RoleBadge role={u.role} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs italic">
                                                    <FaIdBadge className="text-slate-200" size={11} />
                                                    {u.designation || 'Specialist'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <FaEnvelope size={10} className="opacity-30" />
                                                        {u.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <FaPhoneAlt size={10} className="opacity-30" />
                                                        {u.mobile_number || 'Secure Link'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-black text-slate-400 tracking-tighter bg-white border border-slate-100 px-2 py-0.5 rounded-full">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {localStorage.getItem('userId') != u.id && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
