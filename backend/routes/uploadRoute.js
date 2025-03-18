import express from 'express';
import { upload, localUpload } from '../middleware/multer.js';
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

        // If using Cloudinary, the file path is already a URL
        if (req.file.path && req.file.path.includes('http')) {
            return res.status(200).json({
                success: true,
                imageUrl: req.file.path,
                publicId: req.file.filename || path.basename(req.file.path)
            });
        }
        
        // If using local storage, construct the URL
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

        // If using Cloudinary, the file path is already a URL
        if (req.file.path && req.file.path.includes('http')) {
            return res.status(200).json({
                success: true,
                videoUrl: req.file.path,
                publicId: req.file.filename || path.basename(req.file.path)
            });
        }
        
        // If using local storage, construct the URL
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
router.post('/local', adminAuth, localUpload.single('file'), (req, res) => {
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