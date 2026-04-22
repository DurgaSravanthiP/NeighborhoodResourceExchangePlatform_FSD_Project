const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const dotenv = require('dotenv');

dotenv.config();

const usersData = [
  {
    name: 'Sofia',
    email: 'sofia@gmail.com',
    password: 'sofia@1',
    location: 'New York',
    bio: 'Avid reader and gardener.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'John',
    email: 'john@gmail.com',
    password: 'john@1',
    location: 'Los Angeles',
    bio: 'DIY enthusiast.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Emma',
    email: 'emma@gmail.com',
    password: 'emma@1',
    location: 'Chicago',
    bio: 'Tech lover and sports fan.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Mike',
    email: 'mike@gmail.com',
    password: 'mike@1',
    location: 'Houston',
    bio: 'Chef and bookworm.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }
];

const itemsData = [
  // Sofia's items
  {
    title: 'Gardening Toolkit',
    description: 'Complete set of tools for your garden. Includes trowel, pruner, and gloves.',
    category: 'Garden',
    availabilityStatus: 'available',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=60',
    location: 'New York'
  },
  {
    title: 'The Great Gatsby Book',
    description: 'Classic novel by F. Scott Fitzgerald. In great condition.',
    category: 'Books',
    availabilityStatus: 'available',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: 'New York'
  },
  // John's items
  {
    title: 'Power Drill Set',
    description: 'Cordless power drill with multiple bits. Great for home DIY projects.',
    category: 'Tools',
    availabilityStatus: 'available',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: 'Los Angeles'
  },
  // Emma's items
  {
    title: 'Tennis Racket',
    description: 'Professional grade tennis racket, gently used.',
    category: 'Sports',
    availabilityStatus: 'available',
    image: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVubmlzJTIwcmFja2V0fGVufDB8fDB8fHww',
    location: 'Chicago'
  },
  {
    title: 'Bluetooth Speaker',
    description: 'Portable wireless speaker with good bass and battery life.',
    category: 'Electronics',
    availabilityStatus: 'available',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    location: 'Chicago'
  },
  // Mike's items
  {
    title: 'Stand Mixer',
    description: 'Heavy duty kitchen stand mixer, perfect for baking.',
    category: 'Kitchen',
    availabilityStatus: 'available',
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=500&q=60',
    location: 'Houston'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Optional: Clear existing data before seeding (commented out to preserve any existing user data)
    // await User.deleteMany({});
    // await Item.deleteMany({});
    // console.log('Old data cleared.');

    let users = [];
    for (let userData of usersData) {
      // Check if user exists
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
        console.log(`Created user: ${user.name}`);
      } else {
        console.log(`User ${user.name} already exists.`);
      }
      users.push(user);
    }

    // Assign items to users
    itemsData[0].ownerId = users[0]._id; // Sofia
    itemsData[1].ownerId = users[0]._id; // Sofia
    itemsData[2].ownerId = users[1]._id; // John
    itemsData[3].ownerId = users[2]._id; // Emma
    itemsData[4].ownerId = users[2]._id; // Emma
    itemsData[5].ownerId = users[3]._id; // Mike

    for (let itemData of itemsData) {
      const item = await Item.create(itemData);
      console.log(`Created item: ${item.title} for ${itemData.ownerId}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
