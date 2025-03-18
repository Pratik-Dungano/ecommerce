import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB using the same approach as the server
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(`${process.env.MONGODB_URL}/e-commerce`);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

const fixCategoryIndex = async () => {
  try {
    console.log('Starting to fix category index...');
    
    // Get the database
    const db = mongoose.connection.db;
    
    // List all indexes on the categories collection
    const indexes = await db.collection('categories').indexes();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Find and drop any index on subcategories.slug
    for (const index of indexes) {
      if (index.name !== '_id_' && (index.key['subcategories.slug'] || index.name.includes('subcategories.slug'))) {
        console.log(`Dropping index ${index.name}...`);
        await db.collection('categories').dropIndex(index.name);
        console.log(`Index ${index.name} dropped successfully`);
      }
    }
    
    console.log('Fix completed successfully!');
  } catch (error) {
    console.error('Error fixing category index:', error);
  } finally {
    // Close mongoose connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
(async () => {
  const connected = await connectDB();
  if (connected) {
    await fixCategoryIndex();
  } else {
    process.exit(1);
  }
})();
