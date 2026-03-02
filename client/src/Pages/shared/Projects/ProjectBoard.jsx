import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import axiosInstance from '../../../Api/axiosInstance';
import TaskList from '../../../components/Project/TaskList';
import TaskModal from '../../../components/Project/TaskModal';
import AddMemberModal from '../../../components/Project/AddMemberModal';
import MembersListModal from '../../../components/Project/MembersListModal';
import EditProjectModal from '../../../components/Project/EditProjectModal';
import { FaPlus, FaCog } from 'react-icons/fa';

const ProjectBoard = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);

    const userRole = localStorage.getItem('role');
    const canManageMembers = userRole === 'ceo' || userRole === 'hr';

    useEffect(() => {
        fetchProjectAndTasks();
    }, [id]);

    const fetchProjectAndTasks = async () => {
        try {
            const response = await axiosInstance.get(`/projects/${id}`);
            const projectData = response.data;
            setProject(projectData);
            setLoading(false);

            // Automatically move overdue tasks to Backlog
            autoMoveOverdueTasks(projectData);
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
        }
    };

    const autoMoveOverdueTasks = async (projectData) => {
        if (!projectData || !projectData.lists) return;

        const backlogList = projectData.lists.find(l =>
            l.name.toLowerCase() === 'backlog' ||
            l.name.toLowerCase().includes('todo') ||
            l.name.toLowerCase().includes('to do')
        );

        if (!backlogList) return;

        const now = new Date();
        const overdueTasks = [];

        projectData.lists.forEach(list => {
            if (list.id === backlogList.id) return; // Already in backlog

            list.tasks?.forEach(task => {
                if (task.deadline && new Date(task.deadline) < now) {
                    overdueTasks.push(task);
                }
            });
        });

        if (overdueTasks.length > 0) {
            console.log(`Auto-moving ${overdueTasks.length} overdue tasks to ${backlogList.name}`);
            try {

                for (const task of overdueTasks) {
                    await axiosInstance.put(`/tasks/${task.id}/move`, {
                        list_id: backlogList.id,
                        position: 0
                    });
                }


                const refreshed = await axiosInstance.get(`/projects/${id}`);
                setProject(refreshed.data);
            } catch (error) {
                console.error("Failed to auto-move overdue tasks", error);
            }
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }


        const originalProject = { ...project };


        const startListIndex = project.lists.findIndex(l => String(l.id) === source.droppableId);
        const finishListIndex = project.lists.findIndex(l => String(l.id) === destination.droppableId);

        if (startListIndex === -1 || finishListIndex === -1) return;

        const newLists = project.lists.map(list => ({
            ...list,
            tasks: [...(list.tasks || [])]
        }));

        const startList = newLists[startListIndex];
        const finishList = newLists[finishListIndex];


        const taskToMove = startList.tasks.find(t => String(t.id) === draggableId);
        if (!taskToMove) return;

        startList.tasks.splice(source.index, 1);


        finishList.tasks.splice(destination.index, 0, taskToMove);

        // Optimistically update state
        setProject(prev => ({
            ...prev,
            lists: newLists
        }));

        try {
            await axiosInstance.put(`/tasks/${draggableId}/move`, {
                list_id: finishList.id,
                position: destination.index
            });

            fetchProjectAndTasks();
        } catch (error) {
            console.error("Failed to move task, rolling back", error);
            setProject(originalProject);
            alert("Failed to move task. Please try again.");
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleAddNewTask = (listId, title) => {
        if (title) {
            createTask(listId, title);
        }
    };

    const createTask = async (listId, title) => {
        try {
            await axiosInstance.post('/tasks', {
                project_id: project.id,
                list_id: listId,
                title: title,
                priority: 'medium'
            });
            fetchProjectAndTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading board...</div>;

    return (
        <div className="h-screen flex flex-col bg-[#f4f5f7]">
            {/* Board Header */}
            <div className="bg-white px-4 sm:px-6 py-4 shadow-sm border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-1">{project?.name}</h1>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 capitalize`}>
                            {project?.status?.replace('_', ' ')}
                        </span>
                        <span
                            className="cursor-pointer hover:underline hover:text-indigo-600 transition-colors whitespace-nowrap"
                            onClick={() => setShowMembersModal(true)}
                        >
                            {project?.members?.length} Members
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div
                        className="flex -space-x-2 mr-2 sm:mr-4 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowMembersModal(true)}
                        title="View Team"
                    >
                        {project?.members?.slice(0, 5).map(m => (
                            <img
                                key={m.id}
                                src={m.profile_image ? (m.profile_image.startsWith('http') ? m.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${m.profile_image}`) : `https://ui-avatars.com/api/?name=${m.name}`}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white"
                                title={m.name}
                            />
                        ))}
                        {project?.members?.length > 5 && (
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] sm:text-xs text-gray-500">
                                +{project.members.length - 5}
                            </div>
                        )}
                    </div>
                    {canManageMembers && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAddMemberModal(true)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
                            >
                                <FaPlus /> Invite
                            </button>
                            <button
                                onClick={() => setShowEditProjectModal(true)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
                                title="Project Settings"
                            >
                                <FaCog />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Board  */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="h-full flex px-6 py-6 gap-6 min-w-max items-start">
                        {project?.lists?.map(list => (
                            <TaskList
                                key={list.id}
                                list={list}
                                tasks={list.tasks || []}
                                onTaskClick={handleTaskClick}
                                onAddTask={handleAddNewTask}
                                canManageBoard={canManageMembers}
                            />
                        ))}


                    </div>
                </DragDropContext>
            </div>


            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    projectName={project?.name}
                    projectMembers={project?.members || []}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={fetchProjectAndTasks}
                />
            )}

            {showAddMemberModal && (
                <AddMemberModal
                    projectId={project.id}
                    currentMembers={project.members}
                    onClose={() => setShowAddMemberModal(false)}
                    onMemberAdded={() => {
                        fetchProjectAndTasks();
                    }}
                />
            )}

            {showMembersModal && (
                <MembersListModal
                    projectId={project.id}
                    members={project.members}
                    onClose={() => setShowMembersModal(false)}
                    onMemberRemoved={() => {
                        fetchProjectAndTasks();
                    }}
                />
            )}

            {showEditProjectModal && (
                <EditProjectModal
                    project={project}
                    onClose={() => setShowEditProjectModal(false)}
                    onUpdate={(updatedProject) => {
                        setProject(prev => ({ ...prev, ...updatedProject }));
                        fetchProjectAndTasks();
                    }}
                />
            )}
        </div>
    );
};

export default ProjectBoard;
