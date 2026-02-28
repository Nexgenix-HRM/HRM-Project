import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaCamera, FaEdit, FaSave, FaTimes, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaIdBadge, FaShieldAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { employeeApi } from '../../../Api/employeeApi';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        mobile_number: '',
        profile_image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await employeeApi.getProfile();
            setUser(response.data);
            setFormData({
                name: response.data.name,
                designation: response.data.designation || '',
                mobile_number: response.data.mobile_number || '',
                profile_image: null
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profile_image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('designation', formData.designation);
        data.append('mobile_number', formData.mobile_number);
        if (formData.profile_image) {
            data.append('profile_image', formData.profile_image);
        }

        try {
            await employeeApi.updateProfile(data);
            setIsEditing(false);
            fetchUser();
            alert('Profile updated successfully.');
        } catch (error) {
            console.error(error);
            alert(error.message || 'Update failed.');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-vh-100 bg-white">
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-accent/40 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );

    const getImageUrl = (path) => {
        if (!path) return null;
        return `${import.meta.env.VITE_STORAGE_URL}/${path}`;
    };

    return (
        <div className="min-h-screen pb-12 w-full relative">

            <div className="relative h-40 lg:h-44 bg-white border-b border-slate-100/50 overflow-hidden flex items-center">

                <div className="absolute inset-0 bg-[radial-gradient(at_top_right,_rgba(59,130,246,0.03)_0%,_transparent_50%),_radial-gradient(at_bottom_left,_rgba(112,48,160,0.02)_0%,_transparent_50%)]"></div>

                <div className="container mx-auto px-10 relative z-10">
                    <div className="flex items-center justify-between gap-8">


                        <div className="flex items-center gap-6 animate-in slide-in-from-left-6 duration-700">

                            <div className="relative flex-shrink-0">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 p-1 bg-gradient-to-tr from-accent/20 to-purple-400/10 rounded-2xl shadow-lg border border-white">
                                    <div className="w-full h-full rounded-xl bg-white overflow-hidden relative">
                                        {(previewImage || user.profile_image) ? (
                                            <img
                                                src={previewImage || getImageUrl(user.profile_image)}
                                                alt="Professional Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                                <FaUserCircle className="w-12 h-12 text-slate-100" />
                                            </div>
                                        )}

                                        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                {isEditing && (
                                    <label className="absolute -bottom-1 -right-1 p-2 bg-slate-900 text-white rounded-lg shadow-xl cursor-pointer hover:bg-accent transition-all animate-in zoom-in duration-300 z-20 border border-white">
                                        <FaCamera size={10} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>


                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-[1000] text-slate-900 tracking-tight leading-none mb-1 uppercase">
                                    {user.name}
                                </h1>
                                <span className="text-xs md:text-sm font-bold text-slate-400 tracking-wide">
                                    {user.designation || 'Specialist Officer'}
                                </span>
                            </div>
                        </div>


                        <div className="animate-in slide-in-from-right-6 duration-700">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black hover:shadow-xl hover:shadow-slate-200 transform hover:-translate-y-0.5"
                                >
                                    Modify Profile
                                </button>
                            ) : (
                                <div className="flex gap-2.5">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-5 py-2.5 bg-white text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2.5 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/10 hover:bg-slate-900 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 overflow-hidden relative group min-h-[400px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2 relative z-10">
                                <div className="w-1.5 h-4 bg-accent rounded-full"></div>
                                Employment Info
                            </h3>

                            <div className="space-y-4 relative z-10">
                                <InfoItem
                                    icon={<FaCalendarAlt />}
                                    label="Member Since"
                                    value={new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    color="accent"
                                />
                                <InfoItem
                                    icon={<FaShieldAlt />}
                                    label="System Role"
                                    value={user.role.toUpperCase()}
                                    color="emerald"
                                />
                            </div>
                        </div>

                    </div>


                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
                            <div className="p-10 md:p-12">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">Personal Details</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Configuration</p>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <FaEnvelope size={16} />
                                    </div>
                                </div>

                                {!isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <DetailField label="Full Name" value={user.name} />
                                        <DetailField label="Current Designation" value={user.designation || 'Not Assigned'} />
                                        <DetailField label="Business Email" value={user.email} />
                                        <DetailField label="Mobile Contact" value={user.mobile_number || 'Not Linked'} />
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all text-slate-900 font-bold placeholder:text-slate-300 outline-none"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                                                <input
                                                    type="text"
                                                    name="designation"
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all text-slate-900 font-bold placeholder:text-slate-300 outline-none"
                                                    value={formData.designation}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Lead Designer"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Contact</label>
                                                <input
                                                    type="text"
                                                    name="mobile_number"
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-accent/5 focus:border-accent/20 transition-all text-slate-900 font-bold placeholder:text-slate-300 outline-none"
                                                    value={formData.mobile_number}
                                                    onChange={handleChange}
                                                    placeholder="+880 1XXX-XXXXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const InfoItem = ({ icon, label, value, color }) => (
    <div className={`p-4 ${color === 'accent' ? 'bg-accent/5' : 'bg-emerald-50'} rounded-2xl flex items-center gap-4 border border-white`}>
        <div className={`p-2.5 bg-white rounded-xl shadow-sm ${color === 'accent' ? 'text-accent' : 'text-emerald-500'}`}>
            {React.cloneElement(icon, { size: 16 })}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="font-bold text-slate-700 text-sm">{value}</p>
        </div>
    </div>
);

const DetailField = ({ label, value }) => (
    <div className="group">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 transition-colors group-hover:text-accent">{label}</label>
        <div className="text-lg font-bold text-slate-800 tracking-tight">{value}</div>
    </div>
);

export default Profile;
