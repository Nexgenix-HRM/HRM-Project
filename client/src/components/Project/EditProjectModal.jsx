import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Api/axiosInstance';
import { FaTimes, FaSave, FaTrash } from 'react-icons/fa';

const EditProjectModal = ({ project, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        deadline: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [showMentionResults, setShowMentionResults] = useState(false);
    const [mentionSearch, setMentionSearch] = useState('');

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                start_date: project.start_date ? project.start_date.split('T')[0] : '',
                deadline: project.deadline ? project.deadline.split('T')[0] : '',
                status: project.status || 'active'
            });
        }
        fetchUsers();
    }, [project]);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/directory');
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/projects/${project.id}`, formData);

            // Extract mentioned user IDs and auto-assign
            const mentionedUserIds = allUsers
                .filter(user => formData.description.includes(`@${user.name}`))
                .map(user => user.id);

            // Sequentially add members (simplified for now as backend syncWithoutDetaching is available)
            for (const userId of mentionedUserIds) {
                const alreadyMember = project.members?.some(m => m.id === userId);
                if (!alreadyMember) {
                    await axiosInstance.post(`/projects/${project.id}/add-member`, {
                        user_id: userId
                    });
                }
            }

            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project');
        } finally {
            setLoading(false);
        }
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        const cursorPosition = e.target.selectionStart;
        setFormData({ ...formData, description: text });

        const textBeforeCursor = text.slice(0, cursorPosition);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            setMentionSearch(mentionMatch[1]);
            setShowMentionResults(true);
        } else {
            setShowMentionResults(false);
        }
    };

    const insertMention = (user) => {
        const text = formData.description;
        const textarea = document.getElementById('edit-project-description');
        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = text.slice(0, cursorPosition);
        const textAfterCursor = text.slice(cursorPosition);

        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        const newText = textBeforeCursor.slice(0, lastAtIndex) + `@${user.name} ` + textAfterCursor;

        setFormData({ ...formData, description: newText });
        setShowMentionResults(false);

        setTimeout(() => {
            if (textarea) {
                textarea.focus();
                const newPos = lastAtIndex + user.name.length + 2;
                textarea.setSelectionRange(newPos, newPos);
            }
        }, 10);
    };

    const handleDeleteProject = async () => {
        if (!window.confirm("Are you sure you want to delete this project? This action is permanent and will remove all tasks and data.")) return;

        setLoading(true);
        try {
            await axiosInstance.delete(`/projects/${project.id}`);
            onUpdate(); // Refresh the list
            onClose();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        } finally {
            setLoading(true); // Keep loading state until closed
        }
    };

    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const canDelete = userRole === 'ceo' || userRole === 'hr' || project.created_by == userId;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Edit Project Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <div className="relative">
                            <textarea
                                id="edit-project-description"
                                name="description"
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Type @ to mention members..."
                            ></textarea>
                            {showMentionResults && (
                                <div
                                    className="absolute z-[3000] bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto w-64 mt-1 animate-in fade-in slide-in-from-top-2 duration-200"
                                    style={{ top: '100%', left: 0 }}
                                >
                                    <div className="p-2 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm">
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">Mention Member</span>
                                    </div>
                                    {allUsers.filter(u => u.name.toLowerCase().includes(mentionSearch.toLowerCase())).length === 0 ? (
                                        <div className="p-4 text-center text-xs text-slate-400 font-medium italic">No members found</div>
                                    ) : (
                                        allUsers
                                            .filter(u => u.name.toLowerCase().includes(mentionSearch.toLowerCase()))
                                            .map(user => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => insertMention(user)}
                                                    className="w-full flex items-center gap-3 p-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50/50 last:border-0 group"
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={user.profile_image ? (user.profile_image.startsWith('http') ? user.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${user.profile_image}`) : `https://ui-avatars.com/api/?name=${user.name}`}
                                                            alt={user.name}
                                                            className="w-7 h-7 rounded-full object-cover border border-slate-200 group-hover:border-indigo-200 transition-colors shadow-sm"
                                                        />
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                                                    </div>
                                                    <div className="flex flex-col items-start overflow-hidden">
                                                        <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate w-full">{user.name}</span>
                                                        <span className="text-[10px] text-slate-400 group-hover:text-indigo-400 transition-colors truncate w-full uppercase tracking-tighter font-black">{user.role}</span>
                                                    </div>
                                                </button>
                                            ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={formData.start_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={formData.deadline}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        {canDelete && (
                            <button
                                type="button"
                                onClick={handleDeleteProject}
                                disabled={loading}
                                className="flex items-center gap-2 text-rose-500 hover:text-rose-700 font-bold text-xs p-2 transition-colors disabled:opacity-50"
                            >
                                <FaTrash />
                                Delete Project
                            </button>
                        )}
                        <div className="flex justify-end gap-3 flex-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;
