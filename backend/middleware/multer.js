import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Local storage fallback
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Try to create Cloudinary storage
let cloudinaryStorage;
try {
    cloudinaryStorage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'ecommerce',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm', 'mov'],
            resource_type: (req, file) => {
                if (file.fieldname === 'video') return 'video';
                return 'image';
            }
        }
    });
    console.log('Cloudinary storage initialized successfully');
} catch (error) {
    console.error('Error initializing Cloudinary storage:', error);
    cloudinaryStorage = null;
}

// Fallback to local storage if Cloudinary fails
const diskStorage = multer.diskStorage({
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

// Choose storage based on Cloudinary availability
const storage = cloudinaryStorage || diskStorage;

// Create upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits
});

// Fallback uploader with disk storage
const localUpload = multer({
    storage: diskStorage,
    fileFilter,
    limits
});

export { upload, localUpload };
