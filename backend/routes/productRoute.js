import express from 'express';
import { 
    listProducts, 
    addProduct, 
    singleProduct, 
    removeProduct, 
    editProduct 
} from '../controllers/productController.js';
import { upload, handleMulterError } from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Add product route with video support
productRouter.post('/add', 
    adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    handleMulterError,
    addProduct
);

productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

// Edit product route with video support
productRouter.post('/edit', 
    adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    handleMulterError,
    editProduct
);

export default productRouter;
