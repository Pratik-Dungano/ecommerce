
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables for Cloudinary:', missingEnvVars);
    console.error('Please check your .env file and ensure all required variables are set');
} else {
    // Configure cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Test the configuration
    cloudinary.api.ping()
        .then(() => console.log('Cloudinary configuration is valid'))
        .catch(error => {
            console.error('Cloudinary configuration error:', error);
            console.error('Please check your Cloudinary credentials and account status');
        });
}

export default cloudinary;