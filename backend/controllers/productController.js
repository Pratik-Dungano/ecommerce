import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import Product from '../models/productModel.js';
import { uploadToCloudinary } from '../middleware/multer.js';

// Add Product Controller
export const addProduct = async (req, res) => {
    try {
        console.log('Starting addProduct controller...');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const imageUrls = [];
        let videoUrl = null;

        // Process image files
        if (req.files) {
            console.log('Processing files...');
            // Handle image uploads - supports both local and Cloudinary
            for (let i = 1; i <= 4; i++) {
                const imageField = `image${i}`;
                console.log(`Checking ${imageField}...`);
                
                if (req.files[imageField] && req.files[imageField][0]) {
                    const imageFile = req.files[imageField][0];
                    console.log(`Processing ${imageField}:`, {
                        filename: imageFile.filename,
                        path: imageFile.path,
                        mimetype: imageFile.mimetype,
                        size: imageFile.size
                    });
                    
                    // Try to upload to Cloudinary
                    try {
                        console.log(`Attempting to upload ${imageField} to Cloudinary...`);
                        const result = await uploadToCloudinary(imageFile.path, {
                            folder: 'ecommerce/products',
                            resource_type: 'image'
                        });
                        
                        if (result) {
                            console.log(`Successfully uploaded ${imageField} to Cloudinary:`, result.secure_url);
                            imageUrls.push(result.secure_url);
                        } else {
                            console.log(`Cloudinary upload failed for ${imageField}, falling back to local URL`);
                            const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                            imageUrls.push(imageUrl);
                        }
                    } catch (error) {
                        console.error(`Error uploading ${imageField}:`, error);
                        console.error('Error details:', {
                            message: error.message,
                            http_code: error.http_code,
                            name: error.name
                        });
                        const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                        imageUrls.push(imageUrl);
                    }
                } else {
                    console.log(`No file found for ${imageField}`);
                }
            }
        } else {
            console.log('No files found in request');
        }

        // Process video file
        if (req.files && req.files.video && req.files.video[0]) {
            const videoFile = req.files.video[0];
            console.log('Processing video file:', {
                filename: videoFile.filename,
                path: videoFile.path,
                mimetype: videoFile.mimetype,
                size: videoFile.size
            });
            
            // Try to upload to Cloudinary
            try {
                console.log('Attempting to upload video to Cloudinary...');
                const result = await uploadToCloudinary(videoFile.path, {
                    folder: 'ecommerce/products',
                    resource_type: 'video'
                });
                
                if (result) {
                    console.log('Successfully uploaded video to Cloudinary:', result.secure_url);
                    videoUrl = result.secure_url;
                } else {
                    console.log('Cloudinary upload failed for video, falling back to local URL');
                    videoUrl = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                console.error('Error details:', {
                    message: error.message,
                    http_code: error.http_code,
                    name: error.name
                });
                videoUrl = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
            }
        }

        if (imageUrls.length === 0) {
            console.log('No images were successfully uploaded');
            return res.status(400).json({
                success: false,
                message: 'At least one product image is required'
            });
        }

        console.log('Creating new product with data:', {
            name: req.body.name,
            category: req.body.category,
            subcategory: req.body.subcategory,
            imageCount: imageUrls.length,
            hasVideo: !!videoUrl
        });

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
        console.log('Product saved successfully:', product._id);

        res.status(201).json({ 
            success: true, 
            message: 'Product added successfully', 
            product 
        });

    } catch (error) {
        console.error('Error in addProduct:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        // Clean up any uploaded files if there's an error
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error('Error deleting file:', err);
                        else console.log('Deleted file:', file.path);
                    });
                }
            });
        }
        
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

        // Check if existing images should be preserved
        let finalImages = [];
        if (req.body.existingImages) {
            try {
                finalImages = JSON.parse(req.body.existingImages);
            } catch (error) {
                console.error('Error parsing existingImages:', error);
            }
        }

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
                            finalImages.push(result.secure_url);
                        } else {
                            // Fallback to local URL if Cloudinary upload fails
                            const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                            finalImages.push(imageUrl);
                        }
                    } catch (error) {
                        console.error(`Error uploading ${imageField}:`, error);
                        const imageUrl = `${req.protocol}://${req.get('host')}/${imageFile.path.replace(/\\/g, '/')}`;
                        finalImages.push(imageUrl);
                    }
                }
            }
        }

        // Handle video file
        let finalVideo = req.body.existingVideo || null;
        
        if (req.files && req.files.video && req.files.video[0]) {
            const videoFile = req.files.video[0];
            
            // Try to upload to Cloudinary
            try {
                const result = await uploadToCloudinary(videoFile.path, {
                    folder: 'ecommerce/products',
                    resource_type: 'video'
                });
                
                if (result) {
                    finalVideo = result.secure_url;
                } else {
                    // Fallback to local URL if Cloudinary upload fails
                    finalVideo = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                finalVideo = `${req.protocol}://${req.get('host')}/${videoFile.path.replace(/\\/g, '/')}`;
            }
        }

        const updates = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discountPercentage: req.body.discountPercentage || 0,
            image: finalImages,
            video: finalVideo,
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

// CSV Bulk Upload Controller
export const addProductFromCsv = async (req, res) => {
    try {
        console.log('Starting CSV product upload...');
        console.log('Request body:', req.body);

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
            sizes,
            image,
            video
        } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !subcategory || !categoryId || !subcategoryId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, description, price, category, subcategory, categoryId, subcategoryId'
            });
        }

        // Validate image array
        if (!image || !Array.isArray(image) || image.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one product image is required'
            });
        }

        // Filter out empty image URLs
        const validImages = image.filter(img => img && img.trim() !== '');
        
        if (validImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one valid product image URL is required'
            });
        }

        console.log('Creating new product from CSV with data:', {
            name,
            category,
            subcategory,
            imageCount: validImages.length,
            hasVideo: video && video.length > 0
        });

        const product = new Product({
            name,
            description,
            price: parseFloat(price) || 0,
            discountPercentage: parseFloat(discountPercentage) || 0,
            image: validImages,
            video: video && video.length > 0 ? video : [],
            category,
            subcategory,
            categoryId,
            subcategoryId,
            bestseller: bestseller === true || bestseller === 'true',
            ecoFriendly: ecoFriendly === true || ecoFriendly === 'true',
            sizes: Array.isArray(sizes) ? sizes : [],
            date: Date.now()
        });

        await product.save();
        console.log('CSV product saved successfully:', product._id);

        res.status(201).json({ 
            success: true, 
            message: 'Product added successfully from CSV', 
            product 
        });

    } catch (error) {
        console.error('Error in addProductFromCsv:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error during CSV upload' 
        });
    }
};  