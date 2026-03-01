import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

const DashboardLayout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            if (mobile) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1035,
                        animation: 'fadeIn 0.3s ease'
                    }}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar isMobile={isMobile} isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Top Navbar */}
            <Navbar isMobile={isMobile} onToggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="content-wrapper" style={{
                paddingTop: '60px',
                marginLeft: !isMobile ? '260px' : '0',
                transition: 'margin-left 0.3s ease',
                paddingLeft: isMobile ? '0.5rem' : '1.5rem',
                paddingRight: isMobile ? '0.5rem' : '1.5rem'
            }}>
                <main style={{ maxWidth: '100%', margin: '0 auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
