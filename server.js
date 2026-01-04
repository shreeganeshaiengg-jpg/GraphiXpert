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
const MONGO_URI = "mongodb+srv://cinisecretstamil_db_user:AEWTsIydworhOwSG@cluster0.pep6pnt.mongodb.net/graphixpert?retryWrites=true&w=majority&tls=true";

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

// ... (imports remain)

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

// ... (rest of server)

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Schemas
const ServiceSchema = new mongoose.Schema({
    title: String,
    description: String,
    icon: String, // lucide icon name
    image: String,
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    image: String,
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    duration: String,
    price: String,
});

const Service = mongoose.model('Service', ServiceSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Course = mongoose.model('Course', CourseSchema);

// Routes

// Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// Routes

// Get All Content

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

// Seed Database Route (Optional, for initial setup)
app.post('/api/seed', async (req, res) => {
    try {
        await Service.deleteMany({});
        await Project.deleteMany({});
        await Course.deleteMany({});

        await Service.create([
            { title: 'Web Development', description: 'Modern, responsive websites built with React and Node.js.', icon: 'Code' },
            { title: 'App Development', description: 'Cross-platform mobile apps using Flutter and React Native.', icon: 'Smartphone' },
            { title: 'UI/UX Design', description: 'User-centric design with focuses on usability and aesthetics.', icon: 'PenTool' },
        ]);

        await Project.create([
            { title: 'E-Commerce Platform', description: 'A full-featured online store with payment gateway.', category: 'Web' },
            { title: 'Health Tracker', description: 'Mobile application for tracking fitness and diet.', category: 'App' },
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

const EnrollmentSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    courseTitle: String,
    date: { type: Date, default: Date.now }
});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

// ... (other routes)

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
