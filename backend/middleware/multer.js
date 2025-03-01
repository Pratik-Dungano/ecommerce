import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

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
    } else if (file.fieldname.startsWith('image')) {
        // Accept common image formats
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image format. Allowed formats: JPEG, PNG, WebP'), false);
        }
    } else {
        cb(new Error('Unexpected field'), false);
    }
};

const limits = {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 5 // Max 5 files (4 images + 1 video)
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

export default upload;
