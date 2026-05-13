/**
 * Seed script — creates an admin user if one doesn't exist.
 * Usage: node seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`Admin already exists: ${existingAdmin.email}`);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@taskflow.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log(`Admin user created successfully!`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: admin123`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
