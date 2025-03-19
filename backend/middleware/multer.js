import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Local storage setup
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Use disk storage for multer (we'll handle Cloudinary upload separately)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'video') {
        // Accept common video formats
        const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid video format. Allowed formats: MP4, WebM, QuickTime'), false);
        }
    } else if (
        file.fieldname === 'image' || 
        file.fieldname === 'thumbnail' || 
        file.fieldname === 'image1' || 
        file.fieldname === 'image2' || 
        file.fieldname === 'image3' || 
        file.fieldname === 'image4'
    ) {
        // Accept common image formats
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image format. Allowed formats: JPEG, PNG, WebP'), false);
        }
    } else {
        console.log('Unexpected field:', file.fieldname);
        cb(new Error(`Unexpected field: ${file.fieldname}`), false);
    }
};

const limits = {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 5 // Max 5 files (4 images + 1 video)
};

// Create upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits
});

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, options);
        // Delete local file after Cloudinary upload
        fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return null;
    }
};

export { upload, uploadToCloudinary };
