require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('\nRun this command to create admin user:');
      console.log('npm run seed\n');
    } else {
      console.log(`✅ Found ${users.length} user(s):\n`);
      users.forEach(user => {
        console.log(`- Username: ${user.username}`);
        console.log(`  Created: ${user.createdAt}`);
        console.log(`  Last Login: ${user.lastLogin || 'Never'}\n`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
