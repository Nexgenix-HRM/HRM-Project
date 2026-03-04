import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../Api/axiosInstance';
import {
    FaTimes, FaUser, FaTag, FaClock, FaCheckSquare, FaAlignLeft,
    FaComment, FaPlus, FaTrash, FaCheck, FaEdit, FaAt,
    FaExclamationCircle, FaPaperclip, FaFileImage, FaFilePdf,
    FaFileWord, FaFile, FaDownload, FaUpload, FaLink
} from 'react-icons/fa';

const TaskModal = ({ task, projectName, projectMembers = [], onClose, onUpdate }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [localTask, setLocalTask] = useState(task);
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [descriptionText, setDescriptionText] = useState('');
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [deadlineDate, setDeadlineDate] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showMentionResults, setShowMentionResults] = useState(false);
    const [mentionSearch, setMentionSearch] = useState('');
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkInput, setLinkInput] = useState({ text: '', url: '' });

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localStorage.getItem('userId') || currentUser.id;

    const handleImageError = (e, name) => {
        e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random`;
    };

    useEffect(() => {
        if (task) {
            setLocalTask(task);
            setDescriptionText(task.description || '');
            setDeadlineDate(task.deadline ? task.deadline.split('T')[0] : '');
            if (task.comments) setComments(task.comments);
            if (task.attachments) setAttachments(task.attachments);
        }
    }, [task]);

    useEffect(() => {
        if (isEditingDescription && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditingDescription]);

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescriptionText(value);
        checkForMention(value, e.target.selectionStart);
    };

    const checkForMention = (value, cursorPosition) => {
        const textBeforeCursor = value.slice(0, cursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const query = textBeforeCursor.slice(lastAtIndex + 1);
            if (!query.includes(' ') && !query.includes('\n')) {
                setShowMentionResults(true);
                setMentionSearch(query);
            } else {
                setShowMentionResults(false);
            }
        } else {
            setShowMentionResults(false);
        }
    };

    const insertMention = (member) => {
        const targetRef = textareaRef;
        const currentText = descriptionText;
        const setText = setDescriptionText;

        const cursorPosition = targetRef.current.selectionStart;
        const lastAtIndex = currentText.slice(0, cursorPosition).lastIndexOf('@');
        const textBeforeAt = currentText.slice(0, lastAtIndex);
        const textAfterCursor = currentText.slice(cursorPosition);

        const newText = `${textBeforeAt}@${member.name} ${textAfterCursor}`;
        setText(newText);
        setShowMentionResults(false);
        handleToggleAssignee(member.id, true);

        setTimeout(() => {
            if (targetRef.current) {
                targetRef.current.focus();
                const newPos = textBeforeAt.length + member.name.length + 2;
                targetRef.current.setSelectionRange(newPos, newPos);
            }
        }, 10);
    };

    const handleSaveDescription = async () => {
        try {
            await axiosInstance.put(`/tasks/${localTask.id}`, {
                description: descriptionText
            });

            setLocalTask(prev => ({ ...prev, description: descriptionText }));
            setIsEditingDescription(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating description:', error);
        }
    };

    const handleInsertLink = () => {
        const selectionStart = textareaRef.current?.selectionStart || 0;
        const selectionEnd = textareaRef.current?.selectionEnd || 0;
        const selectedText = descriptionText.substring(selectionStart, selectionEnd);

        setLinkInput({
            text: selectedText,
            url: ''
        });
        setShowLinkInput(true);
    };

    const confirmInsertLink = () => {
        if (!linkInput.url) return;

        const selectionStart = textareaRef.current?.selectionStart || 0;
        const selectionEnd = textareaRef.current?.selectionEnd || 0;

        const linkText = linkInput.text || linkInput.url;
        const markdownLink = `[${linkText}](${linkInput.url})`;

        const newText = descriptionText.substring(0, selectionStart) + markdownLink + descriptionText.substring(selectionEnd);
        setDescriptionText(newText);
        setShowLinkInput(false);
        setLinkInput({ text: '', url: '' });

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newPos = selectionStart + markdownLink.length;
                textareaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 10);
    };

    const closeLinkInput = () => {
        setShowLinkInput(false);
        setLinkInput({ text: '', url: '' });
    };

    const renderDescriptionWithHighlights = (text) => {
        if (!text) return "Add a more detailed description...";

        // Escape special characters in names for regex usage
        const escapedNames = (projectMembers || [])
            .map(m => m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .filter(name => name.length > 0);

        // Sort names by length descending to match longest names first (preventing partial matches)
        const sortedNames = [...escapedNames].sort((a, b) => b.length - a.length);
        const mentionRegex = sortedNames.length > 0 ? `@(?:${sortedNames.join('|')})` : '@\\w+';
        const linkRegex = '\\[.*?\\]\\(.*?\\)';

        const combinedRegex = new RegExp(`(${mentionRegex}|${linkRegex})`, 'g');
        const parts = text.split(combinedRegex);

        return parts.map((part, index) => {
            if (!part) return null;

            if (part.startsWith('@')) {
                return <span key={index} className="text-blue-600 font-bold">{part}</span>;
            }
            if (part.startsWith('[') && part.includes('](')) {
                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                    const [_, linkText, url] = match;
                    return (
                        <a
                            key={index}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline font-bold"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {linkText}
                        </a>
                    );
                }
            }
            return part;
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('task_id', localTask.id);

        try {
            const response = await axiosInstance.post('/task-attachments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAttachments([...attachments, response.data]);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAttachment = async (id) => {
        if (!window.confirm("Delete this attachment?")) return;
        try {
            await axiosInstance.delete(`/task-attachments/${id}`);
            setAttachments(attachments.filter(a => a.id !== id));
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
    };

    const handleSaveDeadline = async (newDate) => {
        try {
            await axiosInstance.put(`/tasks/${localTask.id}`, {
                deadline: newDate
            });

            setLocalTask({ ...localTask, deadline: newDate });
            setDeadlineDate(newDate);
            setIsEditingDeadline(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating deadline:', error);
        }
    };

    const handleUpdatePriority = async (newPriority) => {
        try {
            await axiosInstance.put(`/tasks/${localTask.id}`, {
                priority: newPriority
            });

            setLocalTask({ ...localTask, priority: newPriority });
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const response = await axiosInstance.post('/task-comments', {
                task_id: localTask.id,
                comment: commentText
            });

            setComments([...comments, response.data]);
            setCommentText('');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };


    const handleToggleAssignee = async (memberId, forceAssign = false) => {
        const currentAssigneeIds = localTask.assignees?.map(u => u.id) || [];
        let newAssigneeIds;

        if (forceAssign) {
            if (currentAssigneeIds.includes(memberId)) return;
            newAssigneeIds = [...currentAssigneeIds, memberId];
        } else {
            if (currentAssigneeIds.includes(memberId)) {
                newAssigneeIds = currentAssigneeIds.filter(id => id !== memberId);
            } else {
                newAssigneeIds = [...currentAssigneeIds, memberId];
            }
        }

        try {
            const response = await axiosInstance.put(`/tasks/${localTask.id}`, {
                assignees: newAssigneeIds
            });

            setLocalTask(response.data);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating assignees:', error);
        }
    };

    const handleDeleteTask = async () => {
        if (!window.confirm("Archive this task?")) return;
        try {
            await axiosInstance.delete(`/tasks/${localTask.id}`);
            onClose();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const getFileIcon = (type) => {
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type.toLowerCase())) return <FaFileImage className="text-accent" />;
        if (type.toLowerCase() === 'pdf') return <FaFilePdf className="text-rose-500" />;
        if (['doc', 'docx'].includes(type.toLowerCase())) return <FaFileWord className="text-blue-500" />;
        return <FaFile className="text-slate-400" />;
    };

    const isImage = (type) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type.toLowerCase());

    if (!localTask) return null;


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[2000] p-2 md:p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${localTask.priority === 'high' ? 'bg-red-100 text-red-600' :
                                localTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'
                                }`}>
                                {localTask.priority}
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">in List "{localTask.list?.name}"</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{localTask.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:row md:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 space-y-8">

                        {/* Description & Attachments */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-gray-800 font-bold">
                                    <FaAlignLeft />
                                    <h3>Description</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleInsertLink}
                                        className="flex items-center gap-2 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold border border-slate-200 transition-all shadow-sm"
                                        title="Insert Link"
                                    >
                                        <FaLink />
                                        Link
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="flex items-center gap-2 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold border border-slate-200 transition-all shadow-sm"
                                    >
                                        <FaPaperclip className={isUploading ? "animate-pulse" : ""} />
                                        {isUploading ? "Uploading..." : "Attach"}
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                </div>
                            </div>

                            {showLinkInput && (
                                <div className="p-4 bg-white border border-indigo-100 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 mb-4 space-y-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Insert Link</h4>
                                        <button onClick={closeLinkInput} className="text-slate-400 hover:text-slate-600 p-1">
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Display Text</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Documentation"
                                                value={linkInput.text}
                                                onChange={(e) => setLinkInput({ ...linkInput, text: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-400 outline-none transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">URL</label>
                                            <input
                                                type="text"
                                                placeholder="https://example.com"
                                                value={linkInput.url}
                                                onChange={(e) => setLinkInput({ ...linkInput, url: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-400 outline-none transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-1">
                                        <button
                                            onClick={closeLinkInput}
                                            className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmInsertLink}
                                            disabled={!linkInput.url}
                                            className="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200 transition-all"
                                        >
                                            Add Link
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isEditingDescription ? (
                                <div className="space-y-3 relative">
                                    <textarea
                                        ref={textareaRef}
                                        value={descriptionText}
                                        onChange={handleDescriptionChange}
                                        className="w-full p-4 text-sm border-2 border-indigo-100 rounded-xl focus:ring-0 focus:border-indigo-400 outline-none min-h-[150px] transition-colors bg-white shadow-inner"
                                        placeholder="Add more details or use @ to mention teammates..."
                                    />
                                    {showMentionResults && (
                                        <div className="absolute top-12 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                            {projectMembers.filter(m => m.name.toLowerCase().includes(mentionSearch.toLowerCase())).map(member => (
                                                <button key={member.id} onClick={() => insertMention(member)} className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 transition-colors text-left">
                                                    <img src={member.profile_image ? (member.profile_image.startsWith('http') ? member.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${member.profile_image}`) : `https://ui-avatars.com/api/?name=${member.name}`} className="w-8 h-8 rounded-full border border-gray-200" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-800">{member.name}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase">{member.designation}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveDescription} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors">Save</button>
                                        <button onClick={() => { setIsEditingDescription(false); setDescriptionText(localTask.description || ''); }} className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-bold">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsEditingDescription(true)}
                                    className={`p-4 rounded-xl cursor-text transition-all border-2 ${!localTask.description
                                        ? 'bg-slate-50 border-slate-200 border-dashed hover:border-indigo-300 hover:bg-slate-100/50'
                                        : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <p className={`whitespace-pre-wrap text-sm leading-relaxed ${!localTask.description ? 'text-slate-400 font-bold italic' : 'text-gray-600 font-medium'}`}>
                                        {renderDescriptionWithHighlights(localTask.description)}
                                    </p>
                                </div>
                            )}

                            {/* Attachment Previews in the same section */}
                            {attachments.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                    {attachments.map(a => (
                                        <div
                                            key={a.id}
                                            className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1"
                                        >
                                            {isImage(a.file_type) ? (
                                                <div
                                                    className="h-28 bg-slate-50 cursor-pointer overflow-hidden relative"
                                                    onClick={() => setPreviewImageUrl(a.file_path.startsWith('http') ? a.file_path : `${import.meta.env.VITE_STORAGE_URL}/${a.file_path}`)}
                                                >
                                                    <img
                                                        src={a.file_path.startsWith('http') ? a.file_path : `${import.meta.env.VITE_STORAGE_URL}/${a.file_path}`}
                                                        alt={a.file_name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                                                        <FaDownload className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-28 bg-slate-50 flex items-center justify-center text-4xl">
                                                    {getFileIcon(a.file_type)}
                                                </div>
                                            )}

                                            <div className="p-2.5 bg-white border-t border-slate-100">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[10px] font-black text-slate-800 truncate mb-0.5" title={a.file_name}>{a.file_name}</p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{(a.file_size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <a
                                                            href={a.file_path.startsWith('http') ? a.file_path : `${import.meta.env.VITE_STORAGE_URL}/${a.file_path}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1 text-slate-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                                                            title="Download"
                                                        >
                                                            <FaDownload size={10} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteAttachment(a.id)}
                                                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Activity */}
                        <div className="space-y-4 pt-4 pb-8 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-gray-800 font-bold">
                                <FaComment />
                                <h3>Activity</h3>
                            </div>
                            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {comments.map(c => (
                                    <div key={c.id} className="flex gap-3">
                                        <img src={c.user?.profile_image ? (c.user.profile_image.startsWith('http') ? c.user.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${c.user.profile_image}`) : `https://ui-avatars.com/api/?name=${c.user?.name}`} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs font-bold text-gray-800">{c.user?.name}</span>
                                                <span className="text-[10px] text-gray-400 uppercase font-medium">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl rounded-tl-none border border-gray-100">
                                                <p className="text-sm text-gray-600 font-medium leading-relaxed">{c.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handlePostComment} className="flex gap-3 mt-6 mb-4">
                                <input
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="flex-1 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none font-medium shadow-sm"
                                />
                                <button type="submit" disabled={!commentText.trim()} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm">Send</button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-6">
                        {/* Members */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignees</h4>
                            <div className="flex flex-wrap gap-2 relative">
                                {localTask.assignees?.map(u => (
                                    <div key={u.id} className="relative group">
                                        <img src={u.profile_image ? (u.profile_image.startsWith('http') ? u.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${u.profile_image}`) : `https://ui-avatars.com/api/?name=${u.name}`} className="w-8 h-8 rounded-full border border-gray-100" title={u.name} />
                                        <button onClick={() => handleToggleAssignee(u.id)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FaTimes size={8} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)} className="w-8 h-8 rounded-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition-colors">
                                    <FaPlus size={12} />
                                </button>

                                {showAssigneeDropdown && (
                                    <div className="absolute top-10 left-0 bg-white rounded-lg shadow-xl border border-gray-100 w-64 z-50 max-h-48 overflow-y-auto">
                                        {projectMembers.map(m => (
                                            <button key={m.id} onClick={() => handleToggleAssignee(m.id)} className="w-full p-2 flex items-center gap-3 hover:bg-gray-50 border-b last:border-0 text-left">
                                                <img src={m.profile_image ? (m.profile_image.startsWith('http') ? m.profile_image : `${import.meta.env.VITE_STORAGE_URL}/${m.profile_image}`) : `https://ui-avatars.com/api/?name=${m.name}`} className="w-8 h-8 rounded-full" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-700 truncate">{m.name}</p>
                                                    <p className="text-[10px] text-gray-400">{m.designation}</p>
                                                </div>
                                                {localTask.assignees?.some(au => au.id === m.id) && <FaCheck size={12} className="text-indigo-600" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</h4>
                            <div className="flex flex-col gap-2">
                                {['low', 'medium', 'high'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => handleUpdatePriority(p)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-colors flex items-center justify-between group ${localTask.priority === p
                                            ? (p === 'high' ? 'bg-red-500 text-white' : p === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white')
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {p}
                                        {localTask.priority === p && <FaCheck size={10} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Date</h4>
                            {isEditingDeadline ? (
                                <input
                                    type="date"
                                    value={deadlineDate}
                                    onChange={(e) => handleSaveDeadline(e.target.value)}
                                    onBlur={() => setIsEditingDeadline(false)}
                                    autoFocus
                                    className="w-full text-xs p-2 border border-indigo-200 rounded-lg outline-none focus:border-indigo-500"
                                />
                            ) : (
                                <div onClick={() => setIsEditingDeadline(true)} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                                        {localTask.deadline ? new Date(localTask.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                                    </span>
                                    <FaClock className="text-gray-300 group-hover:text-indigo-400 transition-colors" size={14} />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-gray-100 space-y-3">
                            <button onClick={handleDeleteTask} className="w-full py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-red-100">
                                <FaTrash size={12} /> Archive Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox / Full Image Viewer */}
            {previewImageUrl && (
                <div
                    className="fixed inset-0 z-[1200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setPreviewImageUrl(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={() => setPreviewImageUrl(null)}
                    >
                        <FaTimes size={32} />
                    </button>
                    <img
                        src={previewImageUrl}
                        alt="Full size preview"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                        <a
                            href={previewImageUrl}
                            download
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-all"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaDownload /> Download Original
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskModal;
