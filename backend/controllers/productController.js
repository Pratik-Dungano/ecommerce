import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import Product from '../models/productModel.js';

// Add Product Controller
export const addProduct = async (req, res) => {
    try {
        const imageUrls = [];
        let videoUrl = null;

        // Handle file uploads to Cloudinary
        if (req.files) {
            // Upload images
            const imagePromises = [];
            for (let i = 1; i <= 4; i++) {
                const imageField = `image${i}`;
                if (req.files[imageField]?.[0]) {
                    const imagePromise = cloudinary.uploader.upload(req.files[imageField][0].path, {
                        folder: 'products'
                    });
                    imagePromises.push(imagePromise);
                }
            }

            // Wait for all image uploads to complete
            const imageResults = await Promise.all(imagePromises);
            imageUrls.push(...imageResults.map(result => result.secure_url));

            // Upload video if present
            if (req.files.video?.[0]) {
                const videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
                    resource_type: 'video',
                    folder: 'product_videos',
                    eager: [
                        { format: 'mp4', transformation: [
                            {quality: 'auto:good'},
                            {fetch_format: 'auto'},
                            {width: 1280, crop: 'limit'}
                        ]}
                    ]
                });
                videoUrl = videoResult.secure_url;
            }

            // Clean up uploaded files
            Object.values(req.files).flat().forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
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

        // Handle file uploads to Cloudinary
        if (req.files) {
            // Upload new images
            const imagePromises = [];
            for (let i = 1; i <= 4; i++) {
                const imageField = `image${i}`;
                if (req.files[imageField]?.[0]) {
                    const imagePromise = cloudinary.uploader.upload(req.files[imageField][0].path, {
                        folder: 'products'
                    });
                    imagePromises.push({ index: i - 1, promise: imagePromise });
                }
            }

            // Replace images at specific indices
            for (const { index, promise } of imagePromises) {
                const result = await promise;
                imageUrls[index] = result.secure_url;
            }

            // Upload new video if provided
            if (req.files.video?.[0]) {
                const videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
                    resource_type: 'video',
                    folder: 'product_videos',
                    eager: [
                        { format: 'mp4', transformation: [
                            {quality: 'auto:good'},
                            {fetch_format: 'auto'},
                            {width: 1280, crop: 'limit'}
                        ]}
                    ]
                });
                videoUrl = videoResult.secure_url;
            }

            // Clean up uploaded files
            Object.values(req.files).flat().forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }

        const updates = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discountPercentage: req.body.discountPercentage || 0,
            image: imageUrls,
            video: videoUrl,
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