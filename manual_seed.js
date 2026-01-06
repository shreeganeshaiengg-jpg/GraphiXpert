import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb+srv://cinisecretstamil_db_user:3M.%40aFD5A9LC-vb@cluster0.pep6pnt.mongodb.net/graphixpert?appName=Cluster0";

const ServiceSchema = new mongoose.Schema({
    title: String,
    description: String,
    icon: String,
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

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        console.log('Clearing old data...');
        await Service.deleteMany({});
        await Project.deleteMany({});
        await Course.deleteMany({});

        console.log('Seeding Services...');
        await Service.create([
            { title: 'Web Development', description: 'Modern, responsive websites built with React and Node.js.', icon: 'Code', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' },
            { title: 'App Development', description: 'Cross-platform mobile apps using Flutter and React Native.', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80' },
            { title: 'UI/UX Design', description: 'User-centric design with focuses on usability and aesthetics.', icon: 'PenTool', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80' },
        ]);

        console.log('Seeding Projects...');
        await Project.create([
            { title: 'E-Commerce Platform', description: 'A full-featured online store with payment gateway.', category: 'Web', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80' },
            { title: 'Health Tracker', description: 'Mobile application for tracking fitness and diet.', category: 'App', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80' },
        ]);

        console.log('Seeding Courses...');
        await Course.create([
            { title: 'Python Mastery', description: 'Zero to Hero in Python programming.', duration: '8 Weeks', price: '₹3,999' },
            { title: 'Java Enterprise', description: 'Build scalable enterprise applications.', duration: '12 Weeks', price: '₹4,999' },
            { title: 'Full Stack MERN', description: 'Master MongoDB, Express, React, and Node.', duration: '16 Weeks', price: '₹6,999' },
        ]);

        console.log('✅ Database Seeded Successfully with Images!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seed();
