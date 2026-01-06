import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, LayoutDashboard } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-lg p-6 relative bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-primary/20"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><X /></button>
                <h3 className="text-2xl font-bold mb-6 text-primary">{title}</h3>
                {children}
            </motion.div>
        </div>
    );
};

const SectionEditor = ({ sectionKey, title, fields }) => {
    const { content, addItem, editItem, deleteItem } = useContent();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        const initialData = {};
        fields.forEach(f => initialData[f] = '');
        setFormData(initialData);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            editItem(sectionKey, { ...editingItem, ...formData });
        } else {
            addItem(sectionKey, formData);
        }
        setIsModalOpen(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
        } catch (err) {
            console.error('Upload failed', err);
            alert('Upload failed');
        }
    };
    return (
        <div className="mb-12 bg-bg-card/50 p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    {title}
                </h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-orange-400 transition hover:shadow-[0_0_15px_rgba(255,95,31,0.4)]"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content[sectionKey].map((item) => (
                    <div key={item.id} className="bg-black/40 p-5 rounded-xl border border-white/5 hover:border-primary/50 transition group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>

                        <h4 className="font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors">{item.title}</h4>
                        <div className="text-sm text-gray-400 mb-6 space-y-1">
                            {Object.keys(item).map(key => {
                                if (key === 'id' || key === 'title') return null;
                                return (
                                    <div key={key} className="flex gap-2">
                                        <span className="capitalize text-gray-600 min-w-[80px]">{key}:</span>
                                        <span className="text-gray-300 truncate">{item[key]}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-2 mt-auto border-t border-white/5 pt-4">
                            <button onClick={() => handleEdit(item)} className="p-2 bg-white/5 rounded-lg hover:bg-primary hover:text-black transition text-gray-300 group-hover:bg-white/10">
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => { if (window.confirm('Delete this item?')) deleteItem(sectionKey, item.id); }}
                                className="p-2 bg-white/5 rounded-lg hover:bg-red-500 hover:text-white transition text-gray-300 group-hover:bg-white/10"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {content[sectionKey].length === 0 && (
                    <div className="col-span-3 py-8 text-center border-2 border-dashed border-gray-800 rounded-xl">
                        <p className="text-gray-500 italic">No items yet. Click "Add New" to get started.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal title={`${editingItem ? 'Edit' : 'Add'} ${title}`} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map(field => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">{field}</label>
                                    {field === 'image' ? (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white"
                                            />
                                            {formData.image && (
                                                <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-white/10" />
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[field] || ''}
                                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                            className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                            required={field !== 'image'}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-300 hover:text-white transition">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-orange-500 shadow-lg shadow-primary/20">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminDashboard = () => {
    const { logout } = useAuth();
    const { enrollments, fetchEnrollments, deleteEnrollment } = useContent();

    useEffect(() => {
        fetchEnrollments();
    }, []);

    return (
        <div className="min-h-screen bg-bg-dark pt-28 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                            <LayoutDashboard size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                            <p className="text-gray-400">Manage and oversee your website content efficiently.</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-2 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Enrollment Notice Board */}
                <div className="mb-12 bg-bg-card/50 p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                            Notice Board - Enrollments
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 border-b border-white/10">
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Mobile</th>
                                    <th className="p-4 font-semibold">Course</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.length > 0 ? (
                                    enrollments.map((enr) => (
                                        <tr key={enr.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white font-medium">{enr.name}</td>
                                            <td className="p-4 text-gray-300">{enr.mobile}</td>
                                            <td className="p-4 text-primary">{enr.courseTitle}</td>
                                            <td className="p-4 text-gray-500 text-sm">{new Date(enr.date).toLocaleDateString()}</td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => { if (window.confirm('Delete this enrollment?')) deleteEnrollment(enr.id); }}
                                                    className="text-red-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                                            No enrollments yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <SectionEditor
                    sectionKey="services"
                    title="Services"
                    fields={['title', 'description', 'icon', 'image']}
                />

                <SectionEditor
                    sectionKey="projects"
                    title="Projects"
                    fields={['title', 'description', 'category', 'image']}
                />

                <SectionEditor
                    sectionKey="courses"
                    title="Courses"
                    fields={['title', 'description', 'duration', 'price']}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
