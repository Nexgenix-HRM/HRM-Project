import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserFriends, FaTasks } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
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

    const handleClick = () => {
        navigate(`/dashboard/${role}/projects/${project.id}`);
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
                {project.owner && (
                    <img
                        src={project.owner.profile_image ? `${import.meta.env.VITE_STORAGE_URL}/${project.owner.profile_image}` : "https://ui-avatars.com/api/?name=" + project.owner.name}
                        alt={project.owner.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        title={`Owner: ${project.owner.name}`}
                    />
                )}
            </div>

            <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {project.description || "No description provided."}
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
