import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb+srv://cinisecretstamil_db_user:3M.%40aFD5A9LC-vb@cluster0.pep6pnt.mongodb.net/graphixpert?appName=Cluster0";

const ServiceSchema = new mongoose.Schema({
    title: String,
    description: String,
    icon: String,
    image: String,
    images: [String]
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    image: String,
    images: [String]
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

const BASE_URL = 'http://localhost:5000/uploads';

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Atlas.');

        console.log('Clearing old data...');
        await Service.deleteMany({});
        await Project.deleteMany({});
        await Course.deleteMany({});

        console.log('Seeding Services...');
        await Service.create([
            {
                title: 'Web Development',
                description: 'Modern, responsive websites built with React and Node.js.',
                icon: 'Code',
                image: `${BASE_URL}/1768126336664-WEB DEVELOMENT.jpg`,
                images: []
            },
            {
                title: 'App Development',
                description: 'Cross-platform mobile apps using Flutter and React Native.',
                icon: 'Smartphone',
                image: `${BASE_URL}/1768126353579-dk.jpg`,
                images: [
                    `${BASE_URL}/1768126353579-dk2.jpg`,
                    `${BASE_URL}/1768126353579-dk3.jpg`,
                    `${BASE_URL}/1768126353581-dk4.jpg`
                ]
            },
            {
                title: 'UI/UX Design',
                description: 'User-centric design with focuses on usability and aesthetics.',
                icon: 'PenTool',
                image: `${BASE_URL}/1768126471825-Interface.jpg`,
                images: []
            },
        ]);

        console.log('Seeding Projects...');
        await Project.create([
            {
                title: 'City Rider App',
                description: 'A comprehensive taxi booking solution with driver and passenger interfaces.',
                category: 'App',
                image: `${BASE_URL}/1768125861806-driver deatils.jpg`,
                images: [
                    `${BASE_URL}/1768125861807-Driver or passenger.jpg`,
                    `${BASE_URL}/1768125861810-Interface.jpg`,
                    `${BASE_URL}/1768125861815-Passenger.jpg`,
                    `${BASE_URL}/1768125861818-pulish details.jpg`,
                    `${BASE_URL}/1768125861821-Searching.jpg`
                ]
            },
            {
                title: 'Modern Architecture',
                description: 'Innovative architectural designs and construction planning.',
                category: 'Architecture',
                image: `${BASE_URL}/1768125669780-c1.jpg`,
                images: [
                    `${BASE_URL}/1768125687477-c2.jpg`,
                    `${BASE_URL}/1768125687478-c3.png`,
                    `${BASE_URL}/1768126000921-h1.jpg`
                ]
            },
            {
                title: 'Creative Portfolio',
                description: 'Showcase of digital art and design projects.',
                category: 'Design',
                image: `${BASE_URL}/1768126160198-p1.png`,
                images: [
                    `${BASE_URL}/1768126167353-p2.png`
                ]
            }
        ]);

        console.log('Seeding Courses...');
        await Course.create([
            { title: 'Python Mastery', description: 'Zero to Hero in Python programming.', duration: '8 Weeks', price: '₹3,999' },
            { title: 'Java Enterprise', description: 'Build scalable enterprise applications.', duration: '12 Weeks', price: '₹4,999' },
            { title: 'Full Stack MERN', description: 'Master MongoDB, Express, React, and Node.', duration: '16 Weeks', price: '₹6,999' },
        ]);

        console.log('✅ Database Seeded Successfully with Local Images!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seed();
