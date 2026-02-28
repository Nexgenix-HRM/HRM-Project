import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { FaPlus, FaEllipsisH, FaTimes } from 'react-icons/fa';

const TaskList = ({ list, tasks, onTaskClick, onAddTask, canManageBoard }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (isAdding && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isAdding]);

    const handleAdd = () => {
        if (newTaskTitle.trim()) {
            onAddTask(list.id, newTaskTitle.trim());
            setNewTaskTitle('');
            setIsAdding(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        } else if (e.key === 'Escape') {
            setIsAdding(false);
            setNewTaskTitle('');
        }
    };

    return (
        <div className="w-72 flex-shrink-0 flex flex-col max-h-full bg-[#f1f2f4] rounded-xl shadow-sm border border-white/50">
            {/* List Header */}
            <div className="flex justify-between items-center px-4 py-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    {list.name}
                    <span className="text-gray-500 text-xs font-normal">{tasks.length}</span>
                </h3>
                {canManageBoard && (
                    <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors">
                        <FaEllipsisH size={12} />
                    </button>
                )}
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={String(list.id)}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto custom-scrollbar px-2 pb-2 min-h-[100px] transition-all duration-200 ${snapshot.isDraggingOver ? 'bg-indigo-50/30' : ''}`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onClick={() => onTaskClick(task)}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {/* Add Task Multi-state Footer */}
            {canManageBoard && (
                <div className="p-2">
                    {isAdding ? (
                        <div className="space-y-2">
                            <textarea
                                ref={textareaRef}
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter a title for this card..."
                                className="w-full p-3 text-sm bg-white rounded-lg shadow-sm border-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[80px] custom-scrollbar"
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleAdd}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Add card
                                </button>
                                <button
                                    onClick={() => { setIsAdding(false); setNewTaskTitle(''); }}
                                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full py-2 flex items-center gap-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-sm px-3"
                        >
                            <FaPlus size={12} />
                            <span>Add a card</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskList;
