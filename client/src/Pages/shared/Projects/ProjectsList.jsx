import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaThLarge, FaList } from 'react-icons/fa';
import ProjectCard from '../../../components/Project/ProjectCard';
import ProjectKanban from '../../../components/Project/ProjectKanban';
import axiosInstance from '../../../Api/axiosInstance';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewMode, setViewMode] = useState('list');


    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        start_date: '',
        deadline: ''
    });

    const [allUsers, setAllUsers] = useState([]);
    const [showMentionResults, setShowMentionResults] = useState(false);
    const [mentionSearch, setMentionSearch] = useState('');
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });

    const userRole = localStorage.getItem('role');
    const canCreateProject = userRole === 'ceo' || userRole === 'hr';

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/directory');
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axiosInstance.get('/projects');
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            // Extract mentioned user IDs
            const mentionedUserIds = allUsers
                .filter(user => newProject.description.includes(`@${user.name}`))
                .map(user => user.id);

            const payload = {
                ...newProject,
                members: mentionedUserIds
            };

            await axiosInstance.post('/projects', payload);

            setShowCreateModal(false);
            setNewProject({ name: '', description: '', start_date: '', deadline: '' });
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        }
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        const cursorPosition = e.target.selectionStart;
        setNewProject({ ...newProject, description: text });

        const textBeforeCursor = text.slice(0, cursorPosition);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            setMentionSearch(mentionMatch[1]);
            setShowMentionResults(true);

            // Basic positioning logic for the mention dropdown
            const coords = getCaretCoordinates(e.target, cursorPosition);
            setMentionPosition({
                top: coords.top + 20,
                left: coords.left
            });
        } else {
            setShowMentionResults(false);
        }
    };

    const insertMention = (user) => {
        const text = newProject.description;
        const cursorPosition = document.getElementById('new-project-description').selectionStart;
        const textBeforeCursor = text.slice(0, cursorPosition);
        const textAfterCursor = text.slice(cursorPosition);

        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        const newText = textBeforeCursor.slice(0, lastAtIndex) + `@${user.name} ` + textAfterCursor;

        setNewProject({ ...newProject, description: newText });
        setShowMentionResults(false);

        setTimeout(() => {
            const textarea = document.getElementById('new-project-description');
            if (textarea) {
                textarea.focus();
                const newPos = lastAtIndex + user.name.length + 2;
                textarea.setSelectionRange(newPos, newPos);
            }
        }, 10);
    };

    // Helper for caret coordinates (simplified)
    const getCaretCoordinates = (element, position) => {
        const { offsetLeft, offsetTop } = element;
        return { top: offsetTop, left: offsetLeft };
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="p-8 text-center text-gray-500">Loading projects...</div>;

    return (
        <div className="p-4 lg:p-8 space-y-6 bg-gray-50 min-h-screen">

            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                    <p className="text-gray-500">Manage your projects and tasks</p>
                </div>
                {canCreateProject && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
                    >
                        <FaPlus />
                        <span>New Project</span>
                    </button>
                )}
            </div>


            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <FaFilter className="text-gray-400" />
                    <select
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                    </select>

                    <div className="border-l border-gray-200 pl-4 ml-2 flex gap-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Grid View"
                        >
                            <FaThLarge />
                        </button>
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'board' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title="Board View"
                        >
                            <FaList className="rotate-90" /> {/* Simulating Kanban icon */}
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="text-gray-400 text-xl mb-2">No projects found</div>
                    <p className="text-gray-500">Try adjusting your filters or create a new project.</p>
                </div>
            ) : viewMode === 'board' ? (
                <div className="h-[calc(100vh-280px)]">
                    <ProjectKanban projects={filteredProjects} onProjectUpdate={fetchProjects} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} onRefresh={fetchProjects} />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[2000]">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <div className="relative">
                                    <textarea
                                        id="new-project-description"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        rows="3"
                                        value={newProject.description}
                                        onChange={handleDescriptionChange}
                                        placeholder="Type @ to mention members..."
                                    />
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={newProject.start_date}
                                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={newProject.deadline}
                                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsList;
