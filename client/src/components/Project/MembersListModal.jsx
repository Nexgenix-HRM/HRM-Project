import React from 'react';
import axiosInstance from '../../Api/axiosInstance';
import { FaTimes, FaTrash } from 'react-icons/fa';

const MembersListModal = ({ projectId, members, onClose, onMemberRemoved }) => {
    const userRole = localStorage.getItem('role');
    const canRemove = userRole === 'ceo' || userRole === 'hr';
    const currentUserId = localStorage.getItem('userId'); // Assuming we store this, or we can't remove self validation in FE 

    const handleRemove = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await axiosInstance.post(`/projects/${projectId}/remove-member`, {
                user_id: userId
            });
            onMemberRemoved();
        } catch (error) {
            console.error('Error removing member:', error);
            alert(error.response?.data?.message || 'Failed to remove member');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Project Team</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img
                                    src={member.profile_image ? `${import.meta.env.VITE_STORAGE_URL}/${member.profile_image}` : `https://ui-avatars.com/api/?name=${member.name}`}
                                    alt={member.name}
                                    className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-800">{member.name}</h4>
                                    <p className="text-xs text-gray-500">{member.designation || 'Member'}</p>
                                </div>
                            </div>
                            {canRemove && (
                                <button
                                    onClick={() => handleRemove(member.id)}
                                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                                    title="Remove member"
                                >
                                    <FaTrash size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MembersListModal;
