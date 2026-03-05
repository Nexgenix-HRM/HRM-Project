import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUser,
    FaCalendarCheck,
    FaTasks,
    FaClipboardList,
    FaSignOutAlt,
    FaLayerGroup,
    FaCalendarTimes,
    FaUsersCog,
    FaChartBar,
    FaTimes,
    FaChalkboardTeacher,
    FaColumns
} from 'react-icons/fa';
import logo from '../assets/logo.png';

const Sidebar = ({ isMobile, isOpen, onClose }) => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const handleLinkClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    const menuItems = {
        employee: [
            { path: '/dashboard/employee', icon: FaHome, label: 'Home', end: true },
            { path: '/dashboard/employee/projects', icon: FaColumns, label: 'Projects' },
            { path: '/dashboard/employee/directory', icon: FaUser, label: 'Directory' },
            { path: '/dashboard/employee/attendance', icon: FaCalendarCheck, label: 'Attendance' },
            { path: '/dashboard/employee/activity', icon: FaClipboardList, label: 'Daily Activity' },
            { path: '/dashboard/employee/todo', icon: FaTasks, label: 'To-Do' },
            { path: '/dashboard/employee/leave', icon: FaCalendarTimes, label: 'Leave Request' },
            { path: '/dashboard/employee/notices', icon: FaLayerGroup, label: 'Notices' },
            { path: 'https://aspirementor.thenexgenix.com', icon: FaChalkboardTeacher, label: 'Mentor', external: true },
        ],
        ceo: [
            { path: '/dashboard/ceo', icon: FaHome, label: 'CEO Home', end: true },
            { path: '/dashboard/ceo/projects', icon: FaColumns, label: 'Projects' },
            { path: '/dashboard/ceo/users', icon: FaUsersCog, label: 'User Management' },
            { path: '/dashboard/ceo/notices-manage', icon: FaLayerGroup, label: 'Notice Management' },
            { path: '/dashboard/ceo/leave', icon: FaCalendarTimes, label: 'Leave Management' },
            { path: '/dashboard/ceo/directory', icon: FaUser, label: 'Team Directory' },
            { path: '/dashboard/ceo/monitoring', icon: FaChartBar, label: 'Monitoring' },
            { path: 'https://aspirementor.thenexgenix.com', icon: FaChalkboardTeacher, label: 'Mentor', external: true },
        ],
        hr: [
            { path: '/dashboard/hr', icon: FaHome, label: 'HR Home', end: true },
            { path: '/dashboard/hr/projects', icon: FaColumns, label: 'Projects' },
            { path: '/dashboard/hr/users', icon: FaUsersCog, label: 'User Management' },
            { path: '/dashboard/hr/attendance', icon: FaCalendarCheck, label: 'Attendance' },
            { path: '/dashboard/hr/todo', icon: FaTasks, label: 'To-Do' },
            { path: '/dashboard/hr/activity', icon: FaClipboardList, label: 'Daily Activity' },
            { path: '/dashboard/hr/leave-request', icon: FaCalendarTimes, label: 'Leave Request' },
            { path: '/dashboard/hr/notices-manage', icon: FaLayerGroup, label: 'Notice Management' },
            { path: '/dashboard/hr/leave', icon: FaCalendarTimes, label: 'Leave Management' },
            { path: '/dashboard/hr/directory', icon: FaUser, label: 'Team Directory' },
            { path: '/dashboard/hr/monitoring', icon: FaChartBar, label: 'Monitoring' },
            { path: 'https://aspirementor.thenexgenix.com', icon: FaChalkboardTeacher, label: 'Mentor', external: true },
        ]
    };

    const currentMenu = menuItems[role] || [];


    const getSidebarClass = () => {
        if (isMobile) {
            return `sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`;
        }
        return 'sidebar';
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-screen w-[260px] bg-gradient-to-b from-white via-[#faf8ff] to-[#f3e8ff] text-slate-900 border-r-2 border-[#7030A026] border-t-2 border-[#7030A00D] border-b-2 border-[#7030A00D] rounded-r-[2rem] z-[1040] transition-transform duration-300 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-accent/20 ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
                }`}
        >
            <div className="px-4 pt-4 pb-3 flex flex-col items-center gap-2.5 relative border-b border-[#7030A00D] mb-10 text-center">
                <div className="flex flex-col items-center gap-2.5 w-full">
                    <img src={logo} alt="NexGenix Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                    <span className="tracking-tight uppercase text-[10px] font-black text-slate-900 opacity-80">NexGenix HRM</span>
                </div>
                {/* Close button - only visible on mobile */}
                {isMobile && (
                    <button
                        className="absolute top-3 right-3 bg-none border-none text-slate-400 cursor-pointer p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center hover:bg-accent/10 hover:text-accent hover:scale-110 active:scale-95"
                        onClick={onClose}
                    >
                        <FaTimes size={18} />
                    </button>
                )}
            </div>

            <ul className="list-none p-0 m-0 space-y-0.5">
                {currentMenu.map((item, index) => (
                    <li key={index} className="px-0">
                        {item.external ? (
                            <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-6 py-3 text-[#475569] no-underline transition-all duration-200 text-[14px] font-bold relative group hover:bg-accent/5 hover:text-accent hover:pl-7"
                                onClick={handleLinkClick}
                            >
                                <div className="absolute left-0 top-0 h-full w-0 bg-accent/5 transition-all duration-300 group-hover:w-full"></div>
                                <item.icon className="w-5 mr-3 transition-transform duration-200 group-hover:translate-x-0.5 text-[#94a3b8] group-hover:text-accent relative z-10" />
                                <span className="relative z-10">{item.label}</span>
                            </a>
                        ) : (
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => `flex items-center px-6 py-3 no-underline transition-all duration-200 text-[14px] font-bold relative group ${isActive
                                    ? 'text-accent bg-accent/10'
                                    : 'text-[#475569] hover:bg-accent/5 hover:text-accent hover:pl-7'
                                    }`}
                                onClick={handleLinkClick}
                            >
                                {!item.end && <div className="absolute left-0 top-0 h-full w-0 bg-accent/5 transition-all duration-300 group-hover:w-full"></div>}
                                <item.icon className={`w-5 mr-3 transition-transform duration-200 relative z-10 ${({ isActive }) => isActive ? 'text-accent' : 'text-[#94a3b8] group-hover:text-accent group-hover:translate-x-0.5'
                                    }`} />
                                <span className="relative z-10">{item.label}</span>
                            </NavLink>
                        )}
                    </li>
                ))}

                <li className="mt-6 pt-6 border-t border-[#7030A01A]">
                    <NavLink
                        to={role === 'ceo' ? '/dashboard/ceo/profile' : role === 'hr' ? '/dashboard/hr/profile' : '/dashboard/employee/profile'}
                        className={({ isActive }) => `flex items-center px-6 py-3 no-underline transition-all duration-200 text-[14px] font-bold relative group ${isActive
                            ? 'text-accent bg-accent/10'
                            : 'text-[#475569] hover:bg-accent/5 hover:text-accent hover:pl-7'
                            }`}
                        onClick={handleLinkClick}
                    >
                        <FaUser className="w-5 mr-3 transition-all group-hover:translate-x-0.5 text-[#94a3b8] group-hover:text-accent" />
                        <span>Profile</span>
                    </NavLink>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-3 text-[#475569] no-underline transition-all duration-200 text-[14px] font-bold border-0 bg-transparent text-left hover:bg-rose-50 hover:text-rose-600 hover:pl-7 group"
                    >
                        <FaSignOutAlt className="w-5 mr-3 transition-all group-hover:translate-x-0.5 text-[#94a3b8] group-hover:text-rose-600" />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
