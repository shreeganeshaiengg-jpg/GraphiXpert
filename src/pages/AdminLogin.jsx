import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(username, password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-dark">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-[100px] opacity-20 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full filter blur-[100px] opacity-20" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 w-full max-w-md z-10 relative border-t border-l border-white/10 shadow-2xl shadow-primary/5"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Enter your credentials to access the admin panel.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            placeholder="Username"
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-primary text-black font-bold rounded-xl mt-4 hover:bg-orange-500 hover:shadow-[0_0_20px_rgba(255,95,31,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-sm text-gray-500 hover:text-primary transition">Return to Home</a>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
