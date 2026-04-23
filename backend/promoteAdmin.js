require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const promoteUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Success! User ${user.name} (${user.email}) promoted to ADMIN.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email: node promoteAdmin.js <email>');
  process.exit(1);
}

promoteUser(email);
