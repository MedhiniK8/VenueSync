require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Venue = require('./models/Venue');

const venues = [
  {
    name: 'Prabhakar Kore Sports Arena',
    capacity: 5000,
    type: 'sports_arena',
    amenities: ['Seating', 'Audio System', 'Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Architecture Seminar Hall',
    capacity: 150,
    type: 'seminar_hall',
    amenities: ['Projector', 'AC', 'Wi-Fi'],
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'SMSR Hall',
    capacity: 300,
    type: 'seminar_hall',
    amenities: ['Projector', 'Whiteboard', 'AC'],
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Mechanical Seminar Hall',
    capacity: 150,
    type: 'seminar_hall',
    amenities: ['Projector', 'Wi-Fi'],
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'KLE Tech Auditorium',
    capacity: 1200,
    type: 'auditorium',
    amenities: ['Stage', 'Audio System', 'Projection'],
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Deshpande Auditorium',
    capacity: 800,
    type: 'auditorium',
    amenities: ['Stage', 'Lighting', 'Audio System'],
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Civil Amphitheatre',
    capacity: 400,
    type: 'amphitheatre',
    amenities: ['Open Air', 'Seating'],
    imageUrl: 'https://images.unsplash.com/photo-1480511361210-b1b966c50e9c?auto=format&fit=crop&w=1200&q=80'
  }
]

const seed = async () => {
  await connectDB();

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const passwordHash = await bcrypt.hash('student123', 10);
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    await User.insertMany([
      { name: 'Raj Kumar', email: 'student@kletech.ac.in', password: passwordHash, role: 'student', department: 'CSE' },
      { name: 'Dr. Priya Sharma', email: 'teacher@kletech.ac.in', password: teacherHash, role: 'teacher', department: 'ECE' },
      { name: 'Admin User', email: 'admin@kletech.ac.in', password: adminHash, role: 'admin' }
    ]);
  }

  const venueCount = await Venue.countDocuments();
  if (venueCount === 0) {
    await Venue.insertMany(venues);
  }

  return { seeded: true };
};

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seed;
