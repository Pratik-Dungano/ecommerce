import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Log Cloudinary configuration (without sensitive data)
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'missing',
    api_secret: process.env.CLOUDINARY_SECRET_KEY ? '***' : 'missing'
});

// Verify Cloudinary configuration
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
    console.error('Cloudinary configuration is missing. Please check your .env file.');
    process.exit(1); // Exit if Cloudinary config is missing
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        console.log('Upload directory:', uploadDir);
        
        if (!fs.existsSync(uploadDir)) {
            console.log('Creating upload directory...');
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + uniqueSuffix + ext;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

// File filter configuration (strict whitelist)
const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_MIME = ['video/mp4', 'video/quicktime', 'video/x-matroska'];
const ALLOWED_IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_VIDEO_EXT = ['.mp4', '.mov', '.qt', '.mkv'];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const type = file.mimetype.toLowerCase();

    const isImageField = file.fieldname.startsWith('image');
    const isVideoField = file.fieldname === 'video';

    if (isImageField) {
        const ok = ALLOWED_IMAGE_MIME.includes(type) && ALLOWED_IMAGE_EXT.includes(ext);
        if (!ok) {
            return cb(new Error(`Invalid image type. Allowed: ${ALLOWED_IMAGE_EXT.join(', ')}`), false);
        }
        return cb(null, true);
    }

    if (isVideoField) {
        const ok = ALLOWED_VIDEO_MIME.includes(type) && ALLOWED_VIDEO_EXT.includes(ext);
        if (!ok) {
            return cb(new Error(`Invalid video type. Allowed: ${ALLOWED_VIDEO_EXT.join(', ')}`), false);
        }
        return cb(null, true);
    }

    return cb(new Error(`Invalid field name: ${file.fieldname}`), false);
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB total per file (frontend should compress/resize before upload)
        files: 5 // Max 5 files (4 images + 1 video)
    }
});

// Function to compress image
const compressImage = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .resize(2000, 2000, { // Max dimensions
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 }) // Compress to JPEG with 80% quality
            .toFile(outputPath);
        
        return outputPath;
    } catch (error) {
        console.error('Error compressing image:', error);
        return inputPath; // Return original path if compression fails
    }
};

// Function to upload file to Cloudinary
const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        console.log('Starting Cloudinary upload for:', filePath);
        console.log('Upload options:', options);
        
        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            throw new Error(`File not found: ${filePath}`);
        }

        // Verify Cloudinary configuration before upload
        if (!cloudinary.config().cloud_name) {
            console.error('Cloudinary configuration is missing');
            throw new Error('Cloudinary configuration is missing');
        }

        // Compress image if it's an image file
        let uploadPath = filePath;
        if (options.resource_type === 'image') {
            const compressedPath = filePath.replace(/\.[^/.]+$/, '') + '-compressed.jpg';
            uploadPath = await compressImage(filePath, compressedPath);
            console.log('Image compressed:', uploadPath);
        }

        console.log('Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(uploadPath, {
            ...options,
            resource_type: 'auto',
            chunk_size: 20000000, // 20MB chunks for large files
            folder: options.folder || 'products', // Default folder if not specified
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            invalidate: true
        });

        if (!result || !result.secure_url) {
            console.error('Cloudinary upload failed: No secure_url returned');
            throw new Error('Cloudinary upload failed: No secure_url returned');
        }

        console.log('Successfully uploaded to Cloudinary:', result.secure_url);

        // Clean up files
        fs.unlinkSync(filePath); // Delete original file
        if (uploadPath !== filePath) {
            fs.unlinkSync(uploadPath); // Delete compressed file if different
        }
        console.log('Local files cleaned up');
        
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        console.error('Error details:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            stack: error.stack
        });
        
        // Important: Keep the local file on error so callers can fall back to serving from /uploads
        // Cleanup of local files will be handled by the caller if desired.
        
        throw error;
    }
};

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    console.error('Multer error:', err);
    
    if (err instanceof multer.MulterError) {
        console.error('Multer error details:', {
            code: err.code,
            field: err.field,
            message: err.message
        });
        
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 50MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 5 files allowed.'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next(err);
};

export { upload, uploadToCloudinary, handleMulterError };
