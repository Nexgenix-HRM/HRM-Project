import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Api/axiosInstance';
import { FaSearch, FaUserPlus, FaTimes, FaUserMinus } from 'react-icons/fa';

const AddMemberModal = ({ projectId, currentMembers, onClose, onMemberAdded }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [adding, setAdding] = useState(null);
    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/directory');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleAddUser = async (userId) => {
        setAdding(userId);
        try {
            await axiosInstance.post(`/projects/${projectId}/add-member`, {
                user_id: userId
            });
            onMemberAdded();
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Failed to add member');
        } finally {
            setAdding(null);
        }
    };

    const handleRemoveUser = async (userId) => {
        if (!window.confirm("Remove this member from the project?")) return;
        setRemoving(userId);
        try {
            await axiosInstance.post(`/projects/${projectId}/remove-member`, {
                user_id: userId
            });
            onMemberAdded(); // Reuse callback to refresh project data
        } catch (error) {
            console.error('Error removing member:', error);
            const message = error.response?.data?.message || 'Failed to remove member';
            alert(message);
        } finally {
            setRemoving(null);
        }
    };

    // Filter out existing members and search
    const filteredUsers = users.filter(user => {
        const isMember = currentMembers.some(m => m.id === user.id);
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return !isMember && matchesSearch;
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Add Team Members</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Current Members Section */}
                    {!searchTerm && currentMembers && currentMembers.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 px-1">Current Members ({currentMembers.length})</h3>
                            <div className="space-y-2">
                                {currentMembers.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg group">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={member.profile_image ? (member.profile_image.startsWith('http') ? member.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${member.profile_image}`) : `https://ui-avatars.com/api/?name=${member.name}`}
                                                alt={member.name}
                                                className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-white shadow-sm"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{member.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{member.designation || 'Teammate'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveUser(member.id)}
                                            disabled={removing === member.id}
                                            className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100"
                                            title="Remove from project"
                                        >
                                            {removing === member.id ? <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent animate-spin rounded-full"></div> : <FaUserMinus size={14} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Available to Add Section */}
                    <div>
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 px-1">
                            {searchTerm ? 'Search Results' : 'Invite Members'}
                        </h3>
                        {loading ? (
                            <div className="text-center text-gray-500 py-4 animate-pulse uppercase tracking-widest text-[10px] font-black italic">Syncing Directory...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center text-gray-500 py-4 text-xs font-medium italic">No members found to invite.</div>
                        ) : (
                            <div className="space-y-2">
                                {filteredUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 group">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.profile_image ? (user.profile_image.startsWith('http') ? user.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${user.profile_image}`) : `https://ui-avatars.com/api/?name=${user.name}`}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-slate-100 shadow-sm"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{user.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddUser(user.id)}
                                            disabled={adding === user.id}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all disabled:opacity-50"
                                            title="Add to project"
                                        >
                                            {adding === user.id ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full"></div> : <FaUserPlus />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
