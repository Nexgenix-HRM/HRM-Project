import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserFriends, FaTasks, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../Api/axiosInstance';

const ProjectCard = ({ project, onRefresh }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'on_hold': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            await axiosInstance.delete(`/projects/${project.id}`);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    const canDelete = role === 'ceo' || role === 'hr' || project.created_by == userId;

    const handleClick = () => {
        navigate(`/dashboard/${role}/projects/${project.id}`);
    };

    const renderDescriptionWithHighlights = (text) => {
        if (!text) return "No description provided.";

        // Match @Name (assuming name doesn't have markdown special chars for simplicity in this view)
        // or more robustly we could pass members to ProjectCard, but project already has members.
        const escapedNames = (project.members || [])
            .map(m => m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .filter(name => name.length > 0);

        const sortedNames = [...escapedNames].sort((a, b) => b.length - a.length);
        const mentionRegex = sortedNames.length > 0 ? `@(?:${sortedNames.join('|')})` : '@\\w+';

        const parts = text.split(new RegExp(`(${mentionRegex})`, 'g'));

        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return <span key={index} className="text-blue-600 font-bold">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                    </span>
                    {project.deadline && new Date(project.deadline) < new Date() && project.status === 'active' && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold border border-red-200 ml-2">
                            DELAYED
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    {project.owner && (
                        <img
                            src={project.owner.profile_image ? (project.owner.profile_image.startsWith('http') ? project.owner.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${project.owner.profile_image}`) : "https://ui-avatars.com/api/?name=" + project.owner.name}
                            alt={project.owner.name}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                            title={`Owner: ${project.owner.name}`}
                        />
                    )}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                            title="Delete Project"
                        >
                            <FaTrash size={14} />
                        </button>
                    )}
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px] whitespace-pre-wrap">
                {renderDescriptionWithHighlights(project.description)}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1" title="Members">
                        <FaUserFriends />
                        <span>{project.members ? project.members.length : 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
