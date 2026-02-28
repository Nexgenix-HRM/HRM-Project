import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ProjectCard from './ProjectCard';
import axiosInstance from '../../Api/axiosInstance';

const ProjectKanban = ({ projects, onProjectUpdate }) => {

    const [localProjects, setLocalProjects] = useState(projects);


    useEffect(() => {
        setLocalProjects(projects);
    }, [projects]);

    const columns = {
        active: { name: 'Active', items: localProjects.filter(p => p.status === 'active') },
        on_hold: { name: 'On Hold', items: localProjects.filter(p => p.status === 'on_hold') },
        completed: { name: 'Completed', items: localProjects.filter(p => p.status === 'completed') }
    };

    const flexBasis = '350px';

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            // Save original state for rollback
            const originalProjects = [...localProjects];

            // Optimistically update local state
            const newStatus = destination.droppableId;
            const updatedProjects = localProjects.map(p =>
                String(p.id) === draggableId ? { ...p, status: newStatus } : p
            );

            setLocalProjects(updatedProjects);

            try {
                await axiosInstance.put(`/projects/${draggableId}`, {
                    status: newStatus
                });
                // Notify parent on success
                onProjectUpdate();
            } catch (error) {
                console.error("Failed to update project status", error);
                // Rollback on failure
                setLocalProjects(originalProjects);
                alert("Failed to move project. Please try again.");
            }
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full items-start">
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(columns).map(([columnId, column]) => (
                    <div key={columnId} className="flex-shrink-0 flex flex-col bg-gray-100 rounded-xl p-3 max-h-full" style={{ width: flexBasis }}>
                        <h3 className="font-bold text-gray-700 mb-3 px-2 flex justify-between items-center">
                            {column.name}
                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                {column.items.length}
                            </span>
                        </h3>
                        <Droppable droppableId={columnId}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 overflow-y-auto custom-scrollbar min-h-[150px] space-y-3 ${snapshot.isDraggingOver ? 'bg-gray-200/50 rounded-lg transition-colors' : ''}`}
                                >
                                    {column.items.map((project, index) => (
                                        <Draggable key={project.id} draggableId={String(project.id)} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{ ...provided.draggableProps.style }}
                                                    className={`${snapshot.isDragging ? 'opacity-80 rotate-2' : ''}`}
                                                >
                                                    <ProjectCard project={project} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
};

export default ProjectKanban;
