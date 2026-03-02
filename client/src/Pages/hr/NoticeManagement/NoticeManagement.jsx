import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { noticeApi } from '../../../Api/noticeApi';
import { employeeApi } from '../../../Api/employeeApi';

const NoticeManagement = () => {
    const [notices, setNotices] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', is_published: false, recipient_ids: [] });

    const fetchNotices = async () => {
        try {
            const response = await noticeApi.getAllNotices();
            setNotices(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await employeeApi.getDirectory();
            // Filter out current user if necessary, or just keep all
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchNotices();
        fetchUsers();
    }, []);

    const resetForm = () => {
        setFormData({ title: '', content: '', is_published: false, recipient_ids: [] });
        setUserSearch('');
        setShowUserDropdown(false);
        setEditingNotice(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNotice) {
                await noticeApi.updateNotice(editingNotice.id, formData);
            } else {
                await noticeApi.createNotice(formData);
            }
            setShowModal(false);
            resetForm();
            fetchNotices();
        } catch (error) {
            console.error(error);
            alert('Error saving notice');
        }
    };

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setFormData({
            title: notice.title,
            content: notice.content,
            is_published: notice.is_published,
            recipient_ids: notice.recipients?.map(r => r.id) || []
        });
        setUserSearch('');
        setShowModal(true);
    };

    const handleTogglePublish = async (id) => {
        try {
            await noticeApi.togglePublish(id);
            fetchNotices();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await noticeApi.deleteNotice(id);
                fetchNotices();
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notice Management</h1>
                    <p className="text-sm text-slate-500">Create and manage official announcements</p>
                </div>
                <button onClick={() => { setShowModal(true); resetForm(); }} className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-900 transition-all flex items-center gap-2">
                    <FaPlus size={12} /> New Notice
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {notices.map(notice => (
                    <div key={notice.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">{notice.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${notice.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {notice.is_published ? 'Published' : 'Draft'}
                                    </span>
                                    {notice.recipients && notice.recipients.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {notice.recipients.map(r => (
                                                <span key={r.id} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                    Targeted: {r.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100">
                                            Broadcast
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{notice.content}</p>
                                <p className="text-xs text-slate-400">By {notice.creator?.name} • {new Date(notice.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleTogglePublish(notice.id)} className={`p-2 rounded-lg ${notice.is_published ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'} hover:opacity-80 transition-all`} title={notice.is_published ? 'Unpublish' : 'Publish'}>
                                    {notice.is_published ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                                <button onClick={() => handleEdit(notice)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:opacity-80 transition-all">
                                    <FaEdit size={14} />
                                </button>
                                <button onClick={() => handleDelete(notice.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:opacity-80 transition-all">
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {notices.length === 0 && (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <FaBullhorn className="mx-auto mb-4 text-slate-200" size={48} />
                        <p className="text-sm font-bold text-slate-400">No notices yet. Create your first announcement!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">{editingNotice ? 'Edit Notice' : 'New Notice'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                                <FaTimes size={16} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Recipients (Select specific users or keep empty for broadcast)</label>
                                <div className="space-y-3">
                                    {/* Selected Users Tags */}
                                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-50 rounded-xl border border-slate-100">
                                        {formData.recipient_ids.length === 0 ? (
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2 py-1">Broadcast to All Users</span>
                                        ) : (
                                            formData.recipient_ids.map(id => {
                                                const user = users.find(u => u.id === id);
                                                return (
                                                    <div key={id} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-accent/20 shadow-sm animate-in zoom-in-95 duration-200">
                                                        <span className="text-[10px] font-bold text-slate-700">{user?.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, recipient_ids: formData.recipient_ids.filter(rId => rId !== id) })}
                                                            className="text-slate-400 hover:text-rose-500 transition-colors"
                                                        >
                                                            <FaTimes size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Type to find and add users..."
                                            value={userSearch}
                                            onFocus={() => setShowUserDropdown(true)}
                                            onChange={(e) => {
                                                setUserSearch(e.target.value);
                                                setShowUserDropdown(true);
                                            }}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all placeholder:text-slate-400"
                                        />

                                        {showUserDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-[55]" onClick={() => setShowUserDropdown(false)}></div>
                                                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-[60] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {users
                                                        .filter(u => !formData.recipient_ids.includes(u.id))
                                                        .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()))
                                                        .map(user => (
                                                            <div
                                                                key={user.id}
                                                                onClick={() => {
                                                                    setFormData({ ...formData, recipient_ids: [...formData.recipient_ids, user.id] });
                                                                    setUserSearch('');
                                                                    setShowUserDropdown(false);
                                                                }}
                                                                className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-50 group"
                                                            >
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-accent transition-colors">{user.name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.role} • {user.email}</p>
                                                                </div>
                                                                <FaPlus size={10} className="text-slate-300 group-hover:text-accent" />
                                                            </div>
                                                        ))
                                                    }

                                                    {users.filter(u => !formData.recipient_ids.includes(u.id) && u.name.toLowerCase().includes(userSearch.toLowerCase())).length === 0 && (
                                                        <div className="px-4 py-8 text-center bg-slate-50/50">
                                                            <p className="text-xs font-bold text-slate-400">No matching users available</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows="6" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all resize-none" required></textarea>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="publish" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 text-accent" />
                                <label htmlFor="publish" className="text-sm font-medium text-slate-700">Publish immediately</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 bg-accent text-white py-2 rounded-xl font-bold hover:bg-slate-900 transition-all">
                                    {editingNotice ? 'Update' : 'Create'} Notice
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 bg-slate-100 text-slate-700 py-2 rounded-xl font-bold hover:bg-slate-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeManagement;
