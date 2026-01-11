import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://cinisecretstamil_db_user:3M.%40aFD5A9LC-vb@cluster0.pep6pnt.mongodb.net/graphixpert?appName=Cluster0";

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️ Server will continue running. You can add data manually via the admin panel.');
    });

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('⚠️ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('📴 Mongoose disconnected from MongoDB');
});

import multer from 'multer';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Schemas
const ServiceSchema = new mongoose.Schema({
    title: String,
    description: String,
    icon: String, // lucide icon name
    image: String,
    images: [String] // Array of image URLs
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    image: String,
    images: [String] // Array of image URLs
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    duration: String,
    price: String,
});

const EnrollmentSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    courseTitle: String,
    date: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', ServiceSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Course = mongoose.model('Course', CourseSchema);
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

// Routes

// Upload Route (Single)
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// Upload Route (Multiple)
app.post('/api/upload-multiple', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    res.json({ imageUrls });
});

// Get All Content
app.get('/api/content', async (req, res) => {
    try {
        const services = await Service.find();
        const projects = await Project.find();
        const courses = await Course.find();
        res.json({ services, projects, courses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic Add/Edit/Delete Helper
const getModel = (section) => {
    switch (section) {
        case 'services': return Service;
        case 'projects': return Project;
        case 'courses': return Course;
        default: return null;
    }
};

// Add Item
app.post('/api/content/:section', async (req, res) => {
    const Model = getModel(req.params.section);
    if (!Model) return res.status(400).json({ error: 'Invalid section' });

    try {
        const newItem = new Model(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Item
app.put('/api/content/:section/:id', async (req, res) => {
    const Model = getModel(req.params.section);
    if (!Model) return res.status(400).json({ error: 'Invalid section' });

    try {
        const updatedItem = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Item
app.delete('/api/content/:section/:id', async (req, res) => {
    const Model = getModel(req.params.section);
    if (!Model) return res.status(400).json({ error: 'Invalid section' });

    try {
        await Model.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enrollment Routes

// Get All Enrollments
app.get('/api/enrollments', async (req, res) => {
    try {
        const enrollments = await Enrollment.find().sort({ date: -1 });
        res.json(enrollments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Enrollment
app.post('/api/enroll', async (req, res) => {
    try {
        const newEnrollment = new Enrollment(req.body);
        await newEnrollment.save();
        res.json(newEnrollment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Enrollment
app.delete('/api/enrollments/:id', async (req, res) => {
    try {
        await Enrollment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed Database Route (Optional, for initial setup)
app.post('/api/seed', async (req, res) => {
    try {
        await Service.deleteMany({});
        await Project.deleteMany({});
        await Course.deleteMany({});

        await Service.create([
            {
                title: 'Web Development',
                description: 'Modern, responsive websites built with React and Node.js.',
                icon: 'Code',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
                    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80'
                ]
            },
            {
                title: 'App Development',
                description: 'Cross-platform mobile apps using Flutter and React Native.',
                icon: 'Smartphone',
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&q=80',
                    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&q=80'
                ]
            },
            {
                title: 'UI/UX Design',
                description: 'User-centric design with focuses on usability and aesthetics.',
                icon: 'PenTool',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=800&q=80',
                    'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80'
                ]
            },
        ]);

        await Project.create([
            {
                title: 'E-Commerce Platform',
                description: 'A full-featured online store with payment gateway.',
                category: 'Web',
                image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80',
                    'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=800&q=80'
                ]
            },
            {
                title: 'Health Tracker',
                description: 'Mobile application for tracking fitness and diet.',
                category: 'App',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
                images: [
                    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
                    'https://images.unsplash.com/photo-1574680096141-1cddd32e34e1?w=800&q=80'
                ]
            },
        ]);

        await Course.create([
            { title: 'Python Mastery', description: 'Zero to Hero in Python programming.', duration: '8 Weeks', price: '₹3,999' },
            { title: 'Java Enterprise', description: 'Build scalable enterprise applications.', duration: '12 Weeks', price: '₹4,999' },
            { title: 'Full Stack MERN', description: 'Master MongoDB, Express, React, and Node.', duration: '16 Weeks', price: '₹6,999' },
        ]);

        res.json({ message: "Database Seeded" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Global Error Handlers to prevent crash
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    // Keep running
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
    // Keep running
});

// Helper to get local IP
import os from 'os';
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIp = getLocalIp();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running!`);
    console.log(`> Local:   http://localhost:${PORT}`);
    console.log(`> Network: http://${localIp}:${PORT}`);
    console.log(`\n⚠️  If testing on mobile, use the 'Network' URL for the API.`);
});
