import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import logo from '../assets/gx_logo.jpg';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
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
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled ? 'glass-panel border-b border-border-main py-3' : 'bg-transparent py-6'
            }`}
            style={
                scrolled
                    ? { background: 'var(--bg-nav)', backdropFilter: 'blur(16px)' }
                    : {}
            }
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src={logo}
                        alt="GraphiXpert Logo"
                        className="h-10 w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                        className="text-2xl font-bold tracking-wider transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        GRAPHI<span style={{ color: 'var(--primary)' }}>XPERT</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.path}
                            className="text-sm font-medium transition-colors relative group"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            {item.name}
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                                style={{ background: 'var(--primary)' }}
                            />
                        </a>
                    ))}

                    <div className="h-6 w-px mx-4" style={{ background: 'var(--border-color)' }} />

                    {/* ── Theme Toggle Button ── */}
                    <motion.button
                        aria-label="Toggle day/night theme"
                        title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                        className="theme-toggle"
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span className="theme-toggle-thumb">
                            {isDark ? '🌙' : '☀️'}
                        </span>
                    </motion.button>

                    {isAuthenticated && (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/admin"
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    background: 'rgba(255,95,31,0.1)',
                                    color: 'var(--primary)',
                                    border: '1px solid rgba(255,95,31,0.4)'
                                }}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile right-side controls */}
                <div className="md:hidden flex items-center gap-3">
                    {/* Mobile Theme Toggle */}
                    <motion.button
                        aria-label="Toggle day/night theme"
                        className="theme-toggle"
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span className="theme-toggle-thumb">
                            {isDark ? '🌙' : '☀️'}
                        </span>
                    </motion.button>

                    {/* Hamburger */}
                    <button
                        className="p-2 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            background: 'var(--bg-card)',
                            borderBottom: '1px solid var(--border-color)',
                            backdropFilter: 'blur(20px)'
                        }}
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between text-lg p-2 rounded-lg transition-all"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {item.name}
                                    <ChevronRight size={16} />
                                </a>
                            ))}
                            <div className="h-px my-2" style={{ background: 'var(--border-color)' }} />
                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="font-medium p-2"
                                        style={{ color: 'var(--primary)' }}
                                    >
                                        Dashboard Link
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="text-left p-2"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        Logout
                                    </button>
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
