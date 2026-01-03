import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

// API Base URL
const API_URL = 'http://localhost:5000/api';

const initialData = {
    services: [
        { id: 1, title: 'Web Development', description: 'Modern, responsive websites built with React and Node.js.', icon: 'Code' },
        { id: 2, title: 'App Development', description: 'Cross-platform mobile apps using Flutter and React Native.', icon: 'Smartphone' },
        { id: 3, title: 'UI/UX Design', description: 'User-centric design with focuses on usability and aesthetics.', icon: 'PenTool' },
    ],
    projects: [
        { id: 101, title: 'E-Commerce Platform', description: 'A full-featured online store with payment gateway.', category: 'Web' },
        { id: 102, title: 'Health Tracker', description: 'Mobile application for tracking fitness and diet.', category: 'App' },
    ],
    courses: [
        { id: 201, title: 'Python Mastery', description: 'Zero to Hero in Python programming.', duration: '8 Weeks', price: '$49' },
        { id: 202, title: 'Java Enterprise', description: 'Build scalable enterprise applications.', duration: '12 Weeks', price: '$59' },
        { id: 203, title: 'Full Stack MERN', description: 'Master MongoDB, Express, React, and Node.', duration: '16 Weeks', price: '$79' },
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

    return (
        <ContentContext.Provider value={{ content, addItem, editItem, deleteItem, loading, useBackend }}>
            {children}
        </ContentContext.Provider>
    );
};
