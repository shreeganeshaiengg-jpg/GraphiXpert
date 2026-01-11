import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/gx_logo.jpg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/#services' },
        { name: 'Courses', path: '/#courses' },
        { name: 'Projects', path: '/#projects' },
        { name: 'Contact', path: '/#contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src={logo} alt="GraphiXpert Logo" className="h-10 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300" />
                    <span className="text-2xl font-bold tracking-wider text-white group-hover:text-primary transition-colors">
                        GRAPHIX<span className="text-primary">PERT</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.path}
                            className="text-sm font-medium text-gray-300 hover:text-primary transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </a>
                    ))}

                    <div className="h-6 w-px bg-gray-800 mx-4" />

                    {isAuthenticated && (
                        <div className="flex items-center gap-4">
                            <Link to="/admin" className="px-4 py-2 bg-primary/10 text-primary border border-primary/50 rounded-lg hover:bg-primary hover:text-white transition-all text-sm font-medium">
                                Dashboard
                            </Link>
                            <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-bg-card/95 backdrop-blur-xl border-b border-white/10"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between text-lg text-gray-300 hover:text-primary p-2 rounded-lg hover:bg-white/5 transition-all"
                                >
                                    {item.name}
                                    <ChevronRight size={16} />
                                </a>
                            ))}
                            <div className="h-px bg-gray-800 my-2" />
                            {isAuthenticated && (
                                <>
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-primary font-medium p-2">Dashboard Link</Link>
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-left text-gray-400 p-2">Logout</button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
