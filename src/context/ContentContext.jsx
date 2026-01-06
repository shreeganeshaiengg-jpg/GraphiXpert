import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

// API Base URL
const API_URL = 'http://localhost:5000/api';

const initialData = {
    services: [
        { id: 1, title: 'Web Development', description: 'Modern, responsive websites built with React and Node.js.', icon: 'Code', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' },
        { id: 2, title: 'App Development', description: 'Cross-platform mobile apps using Flutter and React Native.', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80' },
        { id: 3, title: 'UI/UX Design', description: 'User-centric design with focuses on usability and aesthetics.', icon: 'PenTool', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80' },
    ],
    projects: [
        { id: 101, title: 'E-Commerce Platform', description: 'A full-featured online store with payment gateway.', category: 'Web', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80' },
        { id: 102, title: 'Health Tracker', description: 'Mobile application for tracking fitness and diet.', category: 'App', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80' },
    ],
    courses: [
        { id: 201, title: 'Python Mastery', description: 'Zero to Hero in Python programming.', duration: '8 Weeks', price: '₹3,999' },
        { id: 202, title: 'Java Enterprise', description: 'Build scalable enterprise applications.', duration: '12 Weeks', price: '₹4,999' },
        { id: 203, title: 'Full Stack MERN', description: 'Master MongoDB, Express, React, and Node.', duration: '16 Weeks', price: '₹6,999' },
    ]
};

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [useBackend, setUseBackend] = useState(false);

    // Try to fetch from backend, fallback to localStorage
    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await axios.get(`${API_URL}/content`, { timeout: 3000 });
            const formatData = (items) => items.map(item => ({ ...item, id: item._id }));

            setContent({
                services: formatData(res.data.services),
                projects: formatData(res.data.projects),
                courses: formatData(res.data.courses)
            });
            setUseBackend(true);
            console.log('✅ Using MongoDB backend');
            setLoading(false);
        } catch (error) {
            console.log('⚠️ Backend unavailable, using localStorage');
            // Fallback to localStorage
            const storedContent = localStorage.getItem('graphixpert_content');
            if (storedContent) {
                setContent(JSON.parse(storedContent));
            }
            setUseBackend(false);
            setLoading(false);
        }
    };

    const saveToLocalStorage = (newContent) => {
        localStorage.setItem('graphixpert_content', JSON.stringify(newContent));
    };

    const addItem = async (section, item) => {
        if (useBackend) {
            try {
                const res = await axios.post(`${API_URL}/content/${section}`, item);
                const newItem = { ...res.data, id: res.data._id };
                setContent(prev => ({
                    ...prev,
                    [section]: [...prev[section], newItem]
                }));
                return;
            } catch (error) {
                console.error(`Backend error, falling back to localStorage`);
                setUseBackend(false);
            }
        }

        // localStorage fallback
        const newItem = { ...item, id: Date.now() };
        const newContent = {
            ...content,
            [section]: [...content[section], newItem]
        };
        setContent(newContent);
        saveToLocalStorage(newContent);
    };

    const editItem = async (section, updatedItem) => {
        if (useBackend && updatedItem._id) {
            try {
                await axios.put(`${API_URL}/content/${section}/${updatedItem.id}`, updatedItem);
                setContent(prev => ({
                    ...prev,
                    [section]: prev[section].map(item => item.id === updatedItem.id ? updatedItem : item)
                }));
                return;
            } catch (error) {
                console.error(`Backend error, falling back to localStorage`);
                setUseBackend(false);
            }
        }

        // localStorage fallback
        const newContent = {
            ...content,
            [section]: content[section].map(item => item.id === updatedItem.id ? updatedItem : item)
        };
        setContent(newContent);
        saveToLocalStorage(newContent);
    };

    const deleteItem = async (section, id) => {
        if (useBackend) {
            try {
                await axios.delete(`${API_URL}/content/${section}/${id}`);
                setContent(prev => ({
                    ...prev,
                    [section]: prev[section].filter(item => item.id !== id)
                }));
                return;
            } catch (error) {
                console.error(`Backend error, falling back to localStorage`);
                setUseBackend(false);
            }
        }

        // localStorage fallback
        const newContent = {
            ...content,
            [section]: content[section].filter(item => item.id !== id)
        };
        setContent(newContent);
        saveToLocalStorage(newContent);
    };

    const [enrollments, setEnrollments] = useState([]);

    const fetchEnrollments = async () => {
        try {
            const res = await axios.get(`${API_URL}/enrollments`, { timeout: 3000 });
            setEnrollments(res.data.map(item => ({ ...item, id: item._id })));
        } catch (error) {
            console.error('Backend fetch failed, using localStorage for enrollments');
            const storedEnrollments = localStorage.getItem('graphixpert_enrollments');
            if (storedEnrollments) {
                setEnrollments(JSON.parse(storedEnrollments));
            }
        }
    };

    const addEnrollment = async (enrollmentData) => {
        try {
            const res = await axios.post(`${API_URL}/enroll`, enrollmentData);
            setEnrollments(prev => [({ ...res.data, id: res.data._id }), ...prev]);
            return true;
        } catch (error) {
            console.error('Backend enrollment failed, falling back to localStorage');
            const newItem = { ...enrollmentData, id: Date.now(), date: new Date().toISOString() };
            setEnrollments(prev => {
                const updated = [newItem, ...prev];
                localStorage.setItem('graphixpert_enrollments', JSON.stringify(updated));
                return updated;
            });
            // If we are falling back for add, we should probably ensure the 'list' is robust too in case it wasn't fetched yet
            return true;
        }
    };

    const deleteEnrollment = async (id) => {
        try {
            await axios.delete(`${API_URL}/enrollments/${id}`);
            setEnrollments(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Backend delete failed, falling back to localStorage');
            setEnrollments(prev => {
                const updated = prev.filter(item => item.id !== id);
                localStorage.setItem('graphixpert_enrollments', JSON.stringify(updated));
                return updated;
            });
        }
    };

    return (
        <ContentContext.Provider value={{ content, addItem, editItem, deleteItem, loading, useBackend, enrollments, fetchEnrollments, addEnrollment, deleteEnrollment }}>
            {children}
        </ContentContext.Provider>
    );
};
