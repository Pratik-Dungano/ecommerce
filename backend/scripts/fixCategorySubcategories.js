import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CategoryModel from '../models/categoryModel.js';

// Load environment variables
dotenv.config();

// Get the MongoDB connection string
const mongoURL = process.env.MONGODB_URL;

if (!mongoURL) {
  console.error('MongoDB connection string not found in environment variables.');
  console.error('Please make sure MONGODB_URL is defined in your .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(`${mongoURL}/e-commerce`)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const fixCategorySubcategories = async () => {
  try {
    console.log('Starting to fix categories with null subcategories...');
    
    // Find all categories
    const categories = await CategoryModel.find();
    let fixedCount = 0;
    
    for (const category of categories) {
      let needsSave = false;
      
      // Check if subcategories is null or undefined
      if (!category.subcategories) {
        console.log(`Found category with null subcategories: ${category.name}`);
        category.subcategories = [];
        needsSave = true;
        fixedCount++;
      }
      
      // Save the category if changes were made
      if (needsSave) {
        await category.save();
        console.log(`Saved changes to category: ${category.name}`);
      }
    }
    
    console.log(`Finished fixing categories. Fixed ${fixedCount} categories.`);
    
  } catch (error) {
    console.error('Error fixing categories:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
fixCategorySubcategories();
