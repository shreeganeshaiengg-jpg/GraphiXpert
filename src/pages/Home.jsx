import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal, { ZoomIn } from '../components/ScrollReveal';
import { useContent } from '../context/ContentContext';
import * as Icons from 'lucide-react';
import { ArrowRight, Star, Clock, ShieldCheck, X, Check, Twitter, Linkedin, Instagram } from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = Icons[name] || Icons.Code;
    return <IconComponent className={className} />;
};

const ServiceDetailModal = ({ service, onClose }) => {
    if (!service) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-primary/20"
            >
                <div className="absolute top-4 right-4 z-20">
                    <button onClick={onClose} className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors border border-white/10">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="md:w-1/2">
                            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                                <img src={service.image} alt={service.title} className="w-full h-64 md:h-80 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <div className="bg-primary/90 text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
                                        Featured
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex flex-col justify-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{service.title}</h2>
                            <div className="w-24 h-1.5 bg-primary mb-6 rounded-full" />
                            <p className="text-gray-300 text-lg leading-relaxed">{service.description}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 flex items-center gap-2">
                                    <Check size={16} className="text-primary" /> Professional Support
                                </div>
                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 flex items-center gap-2">
                                    <Check size={16} className="text-primary" /> Quality Assurance
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    {service.images && service.images.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <span className="p-2 bg-white/5 rounded-lg text-primary"><Icons.Image size={24} /></span>
                                Gallery & Work Samples
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {service.images.map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="rounded-xl overflow-hidden border border-white/5 aspect-video group relative cursor-zoom-in"
                                    >
                                        <img src={img} alt={`${service.title} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const Section = ({ title, subtitle, children, id, className = "" }) => (
    <section id={id} className={`py-24 px-6 relative ${className}`}>
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-16 text-center max-w-2xl mx-auto">
                <ScrollReveal>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        <span className="text-white">{title.split(' ')[0]}</span> <span className="text-primary">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                </ScrollReveal>
                {subtitle && (
                    <ScrollReveal delay={0.2}>
                        <p className="text-gray-400 text-lg">{subtitle}</p>
                    </ScrollReveal>
                )}
                <ZoomIn delay={0.3}>
                    <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
                </ZoomIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {children}
            </div>
        </div>
    </section>
);

const EnrollModal = ({ isOpen, onClose, courseTitle }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const { addEnrollment } = useContent();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await addEnrollment({ name, mobile, courseTitle });
        if (success) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
                setName('');
                setMobile('');
            }, 2000);
        } else {
            setError('Enrollment failed. Please try again or contact support.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-primary/20"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
                    <X size={24} />
                </button>

                {submitted ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                        <p className="text-gray-400">Enrollment request submitted.</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-white mb-2">Enroll Now</h3>
                        <p className="text-gray-400 mb-6">Join <span className="text-primary font-semibold">{courseTitle}</span> today.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-orange-600 transition-colors mt-4"
                            >
                                Submit Enrollment
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const Card = ({ title, description, footer, icon, image, badge, delay = 0, onEnroll, onClick }) => (
    <ScrollReveal
        delay={delay}
        whileHover={{ y: -5 }}
        onClick={onClick}
        className={`group relative bg-bg-card border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10 overflow-hidden flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
    >
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex flex-col flex-grow">
            {image ? (
                <div className="relative mb-6">
                    <div className="h-48 w-full rounded-xl overflow-hidden border border-white/10 shadow-inner">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    {badge && (
                        <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 bg-black/60 backdrop-blur-md text-primary rounded-full border border-primary/20 shadow-lg">
                            {badge}
                        </span>
                    )}
                </div>
            ) : (
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                        {icon ? <DynamicIcon name={icon} className="w-8 h-8" /> : <Star className="w-8 h-8" />}
                    </div>
                    {badge && <span className="text-xs font-bold px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/20">{badge}</span>}
                </div>
            )}

            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{title}</h3>

            <p className="text-gray-400 mb-6 leading-relaxed flex-grow">
                {description}
            </p>

            {footer && (
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-sm">
                    {footer}
                </div>
            )}

            {
                onEnroll && (
                    <button
                        onClick={onEnroll}
                        className="mt-4 w-full py-2 bg-primary/10 border border-primary/20 text-primary font-bold rounded-lg hover:bg-primary hover:text-black transition-all duration-300"
                    >
                        Enroll Now
                    </button>
                )
            }
        </div >
    </ScrollReveal >
);

import pongalPopup from '../assets/pongal_popup.jpg';

const Home = () => {
    const { content } = useContent();
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [showPopup, setShowPopup] = useState(true);

    const [heroTextIndex, setHeroTextIndex] = useState(0);
    const heroMessages = [
        <>We help you build your digital presence with premium <span className="text-white font-semibold">Services</span>, showcase <span className="text-white font-semibold">Projects</span>, and master skills with <span className="text-white font-semibold">Courses</span>.</>,
        <>Transform your ideas into reality with our expert <span className="text-white font-semibold">Design</span> and <span className="text-white font-semibold">Development</span> solutions.</>,
        <>Elevate your career with industry-leading <span className="text-white font-semibold">Training</span> and <span className="text-white font-semibold">Mentorship</span> programs.</>
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroTextIndex((prev) => (prev + 1) % heroMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleEnroll = (courseTitle) => {
        setSelectedCourse(courseTitle);
        setIsEnrollModalOpen(true);
    };

    const handleServiceClick = (service) => {
        setSelectedService(service);
    };

    return (
        <div className="bg-bg-dark min-h-screen">

            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 w-full h-full bg-[#0a0a0a]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 filter blur-[120px] rounded-full opacity-30 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-900/10 filter blur-[100px] rounded-full opacity-20" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-primary mb-8 hover:bg-white/10 transition cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Available for New Projects
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
                            Create Digital <br />
                            <span className="gradient-text">Masterpieces</span>
                        </h1>

                        <div className="h-24 md:h-20 mb-12 flex items-center justify-center">
                            <AnimatePresence mode='wait'>
                                <motion.p
                                    key={heroTextIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed absolute"
                                >
                                    {heroMessages[heroTextIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a
                                href="#services"
                                className="px-8 py-4 bg-primary text-bg-dark font-bold text-lg rounded-full shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:shadow-[0_0_40px_rgba(255,95,31,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                            >
                                Start Building <ArrowRight size={20} />
                            </a>
                            <a
                                href="#courses"
                                className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-300"
                            >
                                Browse Courses
                            </a>
                        </div>
                    </motion.div >
                </div >
            </section >

            {/* Services Section */}
            < Section title="Our Services" subtitle="Tailored solutions for your digital growth" id="services" >
                {
                    content.services.map((service, idx) => (
                        <Card
                            key={service.id}
                            title={service.title}
                            description={service.description}
                            icon={service.icon}
                            image={service.image}
                            delay={idx * 0.1}
                            onClick={() => handleServiceClick(service)}
                        />
                    ))
                }
            </Section >

            {/* Projects Section */}
            < div className="bg-bg-card/30" >
                <Section title="Featured Projects" subtitle="A showcase of our best work" id="projects">
                    {content.projects.map((project, idx) => (
                        <Card
                            key={project.id}
                            title={project.title}
                            description={project.description}
                            badge={project.category}
                            image={project.image}
                            delay={idx * 0.1}
                            footer={<span className="text-gray-400 font-mono text-xs">ID: #{project.id}</span>}
                        />
                    ))}
                    {content.projects.length === 0 && <p className="text-gray-500 text-center col-span-3">No projects yet.</p>}
                </Section>
            </div >

            {/* Courses Section */}
            <Section title="Premium Courses" subtitle="Master the skills of tomorrow" id="courses">
                {content.courses.map((course, idx) => (
                    <Card
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        delay={idx * 0.1}
                        onEnroll={() => handleEnroll(course.title)}
                        footer={
                            <div className="flex items-center justify-between w-full">
                                <span className="flex items-center gap-1 text-gray-400"><Clock size={14} /> {course.duration}</span>
                                <span className="text-primary font-bold text-lg flex items-center gap-1">{course.price}</span>
                            </div>
                        }
                    />
                ))}
            </Section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 relative bg-gradient-to-b from-bg-dark to-bg-card/30">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-16 text-center max-w-2xl mx-auto">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                <span className="text-white">Get In</span> <span className="text-primary">Touch</span>
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
                            <p className="text-gray-400 text-lg">Let's bring your ideas to life. Reach out to us!</p>
                        </ScrollReveal>
                        <ZoomIn delay={0.2}>
                            <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
                        </ZoomIn>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Phone */}
                        <ScrollReveal
                            as="a"
                            href="tel:+917358918032"
                            delay={0}
                            whileHover={{ y: -5 }}
                            className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10 cursor-pointer block"
                        >
                            <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300 w-fit mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Phone</h3>
                            <p className="text-gray-400 text-sm">+91 73589 18032</p>
                        </ScrollReveal>

                        {/* Mobile */}
                        <ScrollReveal
                            as="a"
                            href="tel:+919788156637"
                            delay={0.1}
                            whileHover={{ y: -5 }}
                            className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10 cursor-pointer block"
                        >
                            <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300 w-fit mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Mobile</h3>
                            <p className="text-gray-400 text-sm">+91 97881 56637</p>
                        </ScrollReveal>

                        {/* WhatsApp */}
                        <ScrollReveal
                            as="a"
                            href="https://wa.me/918610927831"
                            target="_blank"
                            rel="noopener noreferrer"
                            delay={0.2}
                            whileHover={{ y: -5 }}
                            className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-[#25D366]/50 transition-all duration-300 shadow-lg hover:shadow-[#25D366]/10 cursor-pointer block"
                        >
                            <div className="p-3 bg-white/5 rounded-xl text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-300 w-fit mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#25D366] transition-colors">WhatsApp</h3>
                            <p className="text-gray-400 text-sm">+91 86109 27831</p>
                        </ScrollReveal>

                        {/* Instagram */}
                        <ScrollReveal
                            as="a"
                            href="https://instagram.com/graphixpert18"
                            target="_blank"
                            rel="noopener noreferrer"
                            delay={0.3}
                            whileHover={{ y: -5 }}
                            className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-[#E1306C]/50 transition-all duration-300 shadow-lg hover:shadow-[#E1306C]/10 cursor-pointer block"
                        >
                            <div className="p-3 bg-white/5 rounded-xl text-[#E1306C] group-hover:bg-[#E1306C] group-hover:text-white transition-colors duration-300 w-fit mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E1306C] transition-colors">Instagram</h3>
                            <p className="text-gray-400 text-sm">@graphixpert18</p>
                        </ScrollReveal>

                        {/* Gmail */}
                        <ScrollReveal
                            as="a"
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=graphixpert18@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            delay={0.35}
                            whileHover={{ y: -5 }}
                            className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-[#EA4335]/50 transition-all duration-300 shadow-lg hover:shadow-[#EA4335]/10 cursor-pointer block"
                        >
                            <div className="p-3 bg-white/5 rounded-xl text-[#EA4335] group-hover:bg-[#EA4335] group-hover:text-white transition-colors duration-300 w-fit mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.5 3H19.5L12 8.4L4.5 3H1.5C0.675 3 0 3.675 0 4.5V19.5C0 20.325 0.675 21 1.5 21H7.5V12L12 15.25L16.5 12V21H22.5C23.325 21 24 20.325 24 19.5V4.5C24 3.675 23.325 3 22.5 3Z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#EA4335] transition-colors">Gmail</h3>
                            <p className="text-gray-400 text-sm">graphixpert18</p>
                        </ScrollReveal>
                    </div>

                    {/* LinkedIn - Full Width */}
                    <ScrollReveal
                        as="a"
                        href="https://www.linkedin.com/in/graphixpert-xpert-b79049398"
                        target="_blank"
                        rel="noopener noreferrer"
                        delay={0.4}
                        whileHover={{ y: -5 }}
                        className="group bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-[#0077B5]/50 transition-all duration-300 shadow-lg hover:shadow-[#0077B5]/10 mt-6 flex items-center justify-between cursor-pointer block"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-[#0077B5] group-hover:bg-[#0077B5] group-hover:text-white transition-colors duration-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#0077B5] transition-colors">LinkedIn</h3>
                                <p className="text-gray-400 text-sm">Connect with us professionally</p>
                            </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-600 group-hover:text-[#0077B5] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </ScrollReveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 relative bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <ScrollReveal className="text-center md:text-left">
                        <h4 className="text-2xl font-bold text-white mb-2">GRAPHIX<span className="text-primary">PERT</span></h4>
                        <p className="text-gray-500 text-sm">Empowering creators worldwide.</p>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1} className="flex gap-8 items-center">
                        <a href="#" className="flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                <Twitter size={20} className="text-[#1DA1F2]" />
                            </div>
                            <span className="text-gray-500 text-xs group-hover:text-white transition-colors">Twitter</span>
                        </a>
                        <a href="https://www.linkedin.com/in/graphixpert-xpert-b79049398" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                <Linkedin size={20} className="text-[#0077B5]" />
                            </div>
                            <span className="text-gray-500 text-xs group-hover:text-white transition-colors">LinkedIn</span>
                        </a>
                        <a href="https://instagram.com/graphixpert18" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                <Instagram size={20} className="text-[#E1306C]" />
                            </div>
                            <span className="text-gray-500 text-xs group-hover:text-white transition-colors">Instagram</span>
                        </a>
                        <Link to="/admin/login" className="flex flex-col items-center gap-2 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                <ShieldCheck size={20} className="text-primary" />
                            </div>
                            <span className="text-gray-500 text-xs group-hover:text-primary transition-colors">Admin</span>
                        </Link>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2}>
                        <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
                    </ScrollReveal>
                </div>
            </footer>

            <AnimatePresence>
                {isEnrollModalOpen && (
                    <EnrollModal
                        isOpen={isEnrollModalOpen}
                        onClose={() => setIsEnrollModalOpen(false)}
                        courseTitle={selectedCourse}
                    />
                )}
                {selectedService && (
                    <ServiceDetailModal
                        service={selectedService}
                        onClose={() => setSelectedService(null)}
                    />
                )}
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl shadow-primary/20 max-h-[90vh] flex flex-col"
                        >
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                            >
                                <X size={20} />
                            </button>
                            <div className="overflow-y-auto custom-scrollbar rounded-2xl">
                                <img src={pongalPopup} alt="Happy Pongal" className="w-full h-auto object-cover" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
