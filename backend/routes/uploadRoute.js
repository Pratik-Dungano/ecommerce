import express from 'express';
import { upload, uploadToCloudinary } from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Upload a single image (for category thumbnails, look thumbnails, etc.)
router.post('/image', adminAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.path, {
            folder: 'ecommerce/images',
            resource_type: 'image'
        });

        if (result) {
            return res.status(200).json({
                success: true,
                imageUrl: result.secure_url,
                publicId: result.public_id
            });
        }
        
        // If Cloudinary upload failed, return the local path
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
        return res.status(200).json({
            success: true,
            imageUrl: fileUrl,
            localPath: req.file.path
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
        });
    }
});

// Upload a video (for product videos, look videos, etc.)
router.post('/video', adminAuth, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.path, {
            folder: 'ecommerce/videos',
            resource_type: 'video'
        });

        if (result) {
            return res.status(200).json({
                success: true,
                videoUrl: result.secure_url,
                publicId: result.public_id
            });
        }
        
        // If Cloudinary upload failed, return the local path
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
        return res.status(200).json({
            success: true,
            videoUrl: fileUrl,
            localPath: req.file.path
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({
            success: false,
            message: 'Video upload failed',
            error: error.message
        });
    }
});

// Fallback route for local upload if needed
router.post('/local', adminAuth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
        res.status(200).json({
            success: true,
            fileUrl,
            localPath: req.file.path
        });
    } catch (error) {
        console.error('Error with local upload:', error);
        res.status(500).json({
            success: false,
            message: 'Local upload failed',
            error: error.message
        });
    }
});

export default router; 