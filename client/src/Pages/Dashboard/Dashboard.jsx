import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Ideally call API to logout
            // await axiosInstance.post('/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/');
        }
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 mt-12 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">{role ? role.toUpperCase() : 'User'} Dashboard</h1>
                <button className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-100 active:scale-[0.98]" onClick={handleLogout}>Logout</button>
            </div>

            {role === 'ceo' && (
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl mb-4">
                    <h4 className="text-blue-900 font-bold mb-2">Welcome CEO</h4>
                    <p className="text-blue-700 text-sm">Here you can view all company reports and manage high-level operations.</p>
                </div>
            )}

            {role === 'hr' && (
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl mb-4">
                    <h4 className="text-emerald-900 font-bold mb-2">Welcome HR</h4>
                    <p className="text-emerald-700 text-sm">Here you can manage employees, attendance, and payroll.</p>
                </div>
            )}

            {role === 'employee' && (
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl mb-4">
                    <h4 className="text-amber-900 font-bold mb-2">Welcome Employee</h4>
                    <p className="text-amber-700 text-sm">Here you can view your tasks, attendance, and leaves.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
