require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const addUser = async () => {
  try {
    // Conectare la MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Citește datele utilizatorului
    const username = await question('Username: ');
    const password = await question('Password: ');

    if (!username || !password) {
      console.log('❌ Username și password sunt obligatorii');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    if (username.length < 3) {
      console.log('❌ Username trebuie să aibă minim 3 caractere');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    if (password.length < 4) {
      console.log('❌ Password trebuie să aibă minim 4 caractere');
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    // Verifică dacă user există
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`❌ User "${username}" există deja`);
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    // Creează user
    const user = new User({ username, password });
    await user.save();

    console.log('\n✅ User creat cu succes!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding user:', error);
    rl.close();
    process.exit(1);
  }
};

addUser();
