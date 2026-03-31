const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/decision_support_system';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'anukritisrivastava810@gmail.com';
    const existing = await User.findOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash('123456', 10);

    if (existing) {
      existing.password = hashedPassword;
      existing.role = 'admin';
      existing.name = 'Anukriti Srivastava';
      await existing.save();
      console.log('Admin user updated');
    } else {
      const admin = new User({
        name: 'Anukriti Srivastava',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        domainOfInterest: 'Administration',
        educationLevel: 'System'
      });
      await admin.save();
      console.log('Admin user created');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedAdmin();
