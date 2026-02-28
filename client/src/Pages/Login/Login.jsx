import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLayerGroup, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authApi } from '../../api/authApi';
import logo from '../../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await authApi.login({
                email,
                password,
            });

            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);

            if (user.role === 'ceo') {
                navigate('/dashboard/ceo');
            } else if (user.role === 'hr') {
                navigate('/dashboard/hr');
            } else if (user.role === 'employee') {
                navigate('/dashboard/employee');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="login-container w-full min-h-screen bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row h-screen">

                <div className="hidden md:flex md:w-1/2 login-left-panel p-16 flex-col relative overflow-hidden z-10 border-r border-slate-100 rounded-r-[3rem] shadow-2xl">

                    <div className="floating-element absolute rounded-full bg-gradient-to-br from-purple-50 to-pink-50" style={{ width: '60px', height: '60px', top: '15%', left: '10%' }}></div>
                    <div className="floating-element absolute rounded-full bg-gradient-to-br from-purple-50 to-pink-50" style={{ width: '40px', height: '40px', bottom: '20%', right: '15%', animationDelay: '2s' }}></div>
                    <div className="floating-element absolute rounded-full bg-gradient-to-br from-purple-50 to-pink-50" style={{ width: '30px', height: '30px', top: '40%', right: '25%', animationDelay: '4s' }}></div>

                    <div className="tech-shape shape-1 absolute bg-purple-50/30 rounded-full blur-[60px]" style={{ width: '600px', height: '600px', top: '-200px', right: '-200px' }}></div>
                    <div className="tech-shape shape-2 absolute bg-purple-50/30 rounded-full blur-[60px]" style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px' }}></div>

                    <div className="relative z-10 my-auto">
                        <h1 className="hero-text text-[4.5rem] font-black leading-none tracking-tighter text-slate-900 mb-6 animate-fade-in delay-100">
                            HRM<br />
                            NexGenix
                        </h1>
                        <p className="hero-subtext max-w-[450px] text-slate-500 text-lg leading-relaxed font-medium animate-fade-in delay-200">
                            A simple HRM system that seamlessly connects employees, HR, and management.
                            Built for efficient, transparent, and controlled workflows.
                        </p>
                    </div>

                    <div className="relative z-10 mt-auto flex gap-6 text-slate-400 text-sm font-bold animate-fade-in delay-300">
                        <span>&copy; 2026 NexGenix Inc.</span>
                        <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                        <a href="#" className="hover:text-accent transition-colors">Terms</a>
                    </div>
                </div>


                <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative z-0">
                    <div className="w-full max-w-[480px] p-12 bg-white/40 backdrop-blur-md border border-white/50 rounded-[2rem] shadow-2xl animate-fade-in">
                        <div className="text-center md:text-left mb-8">
                            <h3 className="text-[2rem] font-black text-slate-900 tracking-tight leading-tight mb-2">Welcome Back</h3>
                            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold shadow-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full h-12 px-5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                        placeholder="············"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-accent transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative w-4 h-4 bg-slate-100 border border-slate-200 rounded-md group-hover:border-accent transition-colors">
                                        <input type="checkbox" id="rememberMe" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                                            <div className="w-2 h-2 bg-accent rounded-sm"></div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 tracking-tight">Remember for 30 days</span>
                                </label>
                                <a href="#" className="text-xs font-bold text-accent hover:underline decoration-2 underline-offset-4">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="w-full h-14 bg-accent text-white rounded-2xl font-bold tracking-tight text-sm hover:bg-slate-900 transition-all active:scale-[0.98] shadow-xl shadow-accent/20 relative overflow-hidden group/btn"
                            >
                                <span className="relative z-10">Sign In</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:animate-shimmer"></div>
                            </button>

                            <p className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Don't have an account? <a href="#" className="text-accent hover:text-slate-900 transition-colors ml-1">Contact Support</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
