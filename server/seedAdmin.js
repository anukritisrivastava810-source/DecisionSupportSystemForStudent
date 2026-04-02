const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config(); // Load MONGO_URI from .env (MongoDB Atlas)

const User = require('./models/User');

async function seedAdmin() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI not set in .env — aborting to prevent seeding wrong database.');
    }
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    const adminEmail = 'anukritisrivastava810@gmail.com';

    // bcrypt hash manually so we can use findByIdAndUpdate without triggering pre-save hook issues
    const hashedPassword = await bcrypt.hash('123456', 10);

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      // Use findByIdAndUpdate to avoid double-hashing via pre-save hook
      await User.findByIdAndUpdate(existing._id, {
        password: hashedPassword,
        role: 'admin',
        name: 'Anukriti Srivastava',
      });
      console.log('✅ Admin user updated in Atlas');
    } else {
      // Use create() — pre-save hook will hash the password a second time
      // So we pass plaintext here and let the hook handle hashing
      await User.create({
        name: 'Anukriti Srivastava',
        email: adminEmail,
        password: '123456', // pre-save hook will hash this
        role: 'admin',
        primaryDomain: 'Administration',
        educationLevel: 'System',
      });
      console.log('✅ Admin user created in Atlas');
    }

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedAdmin();

