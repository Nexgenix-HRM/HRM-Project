import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FaPaperclip, FaComment, FaCheckSquare, FaUser } from 'react-icons/fa';

const TaskCard = ({ task, index, onClick }) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = localStorage.getItem('userId') || currentUser.id;

    const isAssigned = task.assignees?.some(u => u.id == currentUserId);

    const handleImageError = (e, name) => {
        e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random`;
    };

    const priorityColor = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
    };


    const assignedStyle = isAssigned
        ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm'
        : 'bg-white border-l-4 border-l-transparent border-gray-100 hover:border-gray-200';

    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-3.5 rounded-xl shadow-sm border mb-3 transition-all group cursor-pointer ${assignedStyle} ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-400 scale-[1.02] z-[100] bg-white' : 'hover:shadow-md hover:border-indigo-200'
                        }`}
                    style={{
                        ...provided.draggableProps.style,
                        transition: snapshot.isDragging ? 'none' : 'all 0.2s cubic-bezier(0.2, 0, 0, 1)'
                    }}
                    onClick={onClick}
                >
                    {isAssigned && (
                        <div className="absolute -top-2 -right-1 bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-white uppercase tracking-tighter animate-in zoom-in-50">
                            Mine
                        </div>
                    )}
                    {/* Priority */}
                    <div className="flex gap-2 mb-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorityColor[task.priority]}`}>
                            {task.priority}
                        </span>
                        {task.deadline && (
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${new Date(task.deadline) < new Date() ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600'}`}>
                                {new Date(task.deadline) < new Date() ? 'LATE' : new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>

                    <h4 className="text-gray-800 font-medium text-sm mb-2">{task.title}</h4>

                    {/* Subtasks & Comments */}
                    {(task.subtasks?.length > 0 || task.comments_count > 0 || task.attachments_count > 0) && (
                        <div className="flex items-center gap-3 text-gray-400 text-xs mb-2">
                            {task.subtasks?.length > 0 && (
                                <div className="flex items-center gap-1" title="Subtasks">
                                    <FaCheckSquare />
                                    <span>{task.subtasks.filter(t => t.is_completed).length}/{task.subtasks.length}</span>
                                </div>
                            )}
                            {task.comments_count > 0 && (
                                <div className="flex items-center gap-1">
                                    <FaComment />
                                    <span>{task.comments_count}</span>
                                </div>
                            )}
                            {task.attachments_count > 0 && (
                                <div className="flex items-center gap-1">
                                    <FaPaperclip />
                                    <span>{task.attachments_count}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Creator & Assignees */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                        <div className="flex items-center gap-1.5" title={task.creator ? `Created by ${task.creator.name}` : ''}>
                            <span className="text-[10px] text-gray-400">By</span>
                            {task.creator ? (
                                <div className="flex items-center gap-1">
                                    <img
                                        src={task.creator.profile_image ? (task.creator.profile_image.startsWith('http') ? task.creator.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${task.creator.profile_image}`) : `https://ui-avatars.com/api/?name=${task.creator.name}`}
                                        className="w-4 h-4 rounded-full object-cover"
                                        alt={task.creator.name}
                                        onError={(e) => handleImageError(e, task.creator.name)}
                                    />
                                    <span className="text-[10px] text-gray-600 font-medium truncate max-w-[80px]">{task.creator.name}</span>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400">?</span>
                            )}
                        </div>

                        <div className="flex -space-x-1">
                            {task.assignees?.map((assignee) => (
                                <img
                                    key={assignee.id}
                                    src={assignee.profile_image ? (assignee.profile_image.startsWith('http') ? assignee.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${assignee.profile_image}`) : `https://ui-avatars.com/api/?name=${assignee.name}`}
                                    alt={assignee.name}
                                    className="w-5 h-5 rounded-full border border-white object-cover"
                                    title={`Assigned to ${assignee.name}`}
                                    onError={(e) => handleImageError(e, assignee.name)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
