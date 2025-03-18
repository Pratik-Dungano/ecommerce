import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import Product from '../models/productModel.js';
import { uploadToCloudinary } from '../middleware/multer.js';

// Add Product Controller
export const addProduct = async (req, res) => {
    try {
        const imageUrls = [];
        let videoUrl = null;

        // Process image files
        if (req.files) {
            // Handle image uploads - supports both local and Cloudinary
            for (let i = 1; i <= 4; i++) {
                const imageField = `image${i}`;
                if (req.files[imageField] && req.files[imageField][0]) {
                    const imageFile = req.files[imageField][0];
                    
                    // Try to upload to Cloudinary
                    try {
                        const result = await uploadToCloudinary(imageFile.path, {
                            folder: 'ecommerce/products',
                            resource_type: 'image'
                        });
                        
                        if (result) {
                            imageUrls.push(result.secure_url);
                        } else {
                            // Fallback to local URL if Cloudinary upload fails
                            const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                            imageUrls.push(imageUrl);
                        }
                    } catch (error) {
                        console.error(`Error uploading ${imageField}:`, error);
                        const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                        imageUrls.push(imageUrl);
                    }
                }
            }
        }

        // Process video file
        if (req.files && req.files.video && req.files.video[0]) {
            const videoFile = req.files.video[0];
            
            // Try to upload to Cloudinary
            try {
                const result = await uploadToCloudinary(videoFile.path, {
                    folder: 'ecommerce/products',
                    resource_type: 'video'
                });
                
                if (result) {
                    videoUrl = result.secure_url;
                } else {
                    // Fallback to local URL if Cloudinary upload fails
                    videoUrl = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                videoUrl = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
            }
        }

        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one product image is required'
            });
        }

        const { 
            name, 
            description, 
            price, 
            discountPercentage,
            category,
            subcategory,
            categoryId,
            subcategoryId,
            bestseller,
            ecoFriendly,
            sizes 
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPercentage: discountPercentage || 0,
            image: imageUrls,
            video: videoUrl,
            category,
            subcategory,
            categoryId,
            subcategoryId,
            bestseller: bestseller === 'true',
            ecoFriendly: ecoFriendly === 'true',
            sizes: JSON.parse(sizes),
            date: Date.now()
        });

        await product.save();
        res.status(201).json({ 
            success: true, 
            message: 'Product added successfully', 
            product 
        });

    } catch (error) {
        // Clean up any uploaded files if there's an error
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                fs.unlink(file.path, () => {});
            });
        }
        console.error('Error in addProduct:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error'
        });
    }
};

// Edit Product Controller
export const editProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found'
            });
        }

        let imageUrls = [...product.image];
        let videoUrl = product.video;

        // Process image files
        const imagesArray = [];
        if (req.files) {
            // Handle image uploads - supports both local and Cloudinary
            for (let i = 1; i <= 4; i++) {
                const imageField = `image${i}`;
                if (req.files[imageField] && req.files[imageField][0]) {
                    const imageFile = req.files[imageField][0];
                    
                    // Try to upload to Cloudinary
                    try {
                        const result = await uploadToCloudinary(imageFile.path, {
                            folder: 'ecommerce/products',
                            resource_type: 'image'
                        });
                        
                        if (result) {
                            imagesArray.push(result.secure_url);
                        } else {
                            // Fallback to local URL if Cloudinary upload fails
                            const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                            imagesArray.push(imageUrl);
                        }
                    } catch (error) {
                        console.error(`Error uploading ${imageField}:`, error);
                        const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                        imagesArray.push(imageUrl);
                    }
                }
            }
        }

        // Process video file
        let videoArray = [];
        if (req.files && req.files.video && req.files.video[0]) {
            const videoFile = req.files.video[0];
            
            // Try to upload to Cloudinary
            try {
                const result = await uploadToCloudinary(videoFile.path, {
                    folder: 'ecommerce/products',
                    resource_type: 'video'
                });
                
                if (result) {
                    videoArray.push(result.secure_url);
                } else {
                    // Fallback to local URL if Cloudinary upload fails
                    const videoUrl = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
                    videoArray.push(videoUrl);
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                const videoUrl = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
                videoArray.push(videoUrl);
            }
        }

        const updates = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discountPercentage: req.body.discountPercentage || 0,
            image: imagesArray,
            video: videoArray.length > 0 ? videoArray[0] : null,
            category: req.body.category,
            subcategory: req.body.subcategory,
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId,
            bestseller: req.body.bestseller === 'true',
            ecoFriendly: req.body.ecoFriendly === 'true',
            sizes: JSON.parse(req.body.sizes)
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        res.json({ 
            success: true, 
            message: 'Product updated successfully', 
            product: updatedProduct 
        });

    } catch (error) {
        // Clean up any uploaded files if there's an error
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                fs.unlink(file.path, () => {});
            });
        }
        console.error('Error in editProduct:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error'
        });
    }
};

// List Products Controller
export const listProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ date: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error in listProducts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Single Product Controller
export const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error in singleProduct:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove Product Controller
export const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required' 
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // Delete the product
        await Product.findByIdAndDelete(id);

        res.json({ 
            success: true, 
            message: 'Product removed successfully' 
        });
    } catch (error) {
        console.error('Error in removeProduct:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to remove product' 
        });
    }
};