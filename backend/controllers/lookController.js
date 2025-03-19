import Look from '../models/lookModel.js';
import Product from '../models/productModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Helper function to check if product has video
const hasVideo = (product) => {
  // Handle both string and array video fields during transition
  if (Array.isArray(product.video)) {
    return product.video && product.video.length > 0;
  }
  return product.video && product.video !== "";
};

// Create a new look
export const createLook = catchAsync(async (req, res, next) => {
  // Verify all products exist and have videos
  const productIds = req.body.products.map(product => product.productId);
  
  const products = await Product.find({ _id: { $in: productIds } });
  
  // Check if all products were found
  if (products.length !== productIds.length) {
    return next(new AppError('One or more products do not exist', 404));
  }
  
  // Check if all products have videos
  const productsWithoutVideos = products.filter(product => !hasVideo(product));
  if (productsWithoutVideos.length > 0) {
    return next(new AppError('One or more products do not have videos', 400));
  }

  // Create the look with the provided data including the thumbnail if present
  const lookData = {
    name: req.body.name,
    description: req.body.description,
    products: req.body.products,
    active: req.body.active !== undefined ? req.body.active : true,
    featured: req.body.featured !== undefined ? req.body.featured : false
  };

  // Add thumbnail if provided
  if (req.body.thumbnail) {
    lookData.thumbnail = req.body.thumbnail;
  }

  const look = await Look.create(lookData);

  res.status(201).json({
    success: true,
    look
  });
});

// Get all looks
export const getAllLooks = catchAsync(async (req, res, next) => {
  const looks = await Look.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: looks.length,
    looks
  });
});

// Get active looks for the frontend
export const getActiveLooks = catchAsync(async (req, res, next) => {
  try {
    const looks = await Look.find({ active: true })
      .populate({
        path: 'products.productId',
        select: 'name price image video discountPercentage sizes',
        model: 'product'
      })
      .sort({ featured: -1, createdAt: -1 });
    
    // Filter out any looks where product population failed
    const validLooks = looks.filter(look => 
      look.products && look.products.length > 0 && 
      look.products.every(product => product.productId && product.productId._id)
    );

    res.status(200).json({
      success: true,
      count: validLooks.length,
      looks: validLooks
    });
  } catch (error) {
    console.error('Error in getActiveLooks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch looks',
      error: error.message
    });
  }
});

// Get look by ID
export const getLookById = catchAsync(async (req, res, next) => {
  try {
    const look = await Look.findById(req.params.id).populate({
      path: 'products.productId',
      select: 'name price image video discountPercentage sizes',
      model: 'product'
    });

    if (!look) {
      return res.status(404).json({
        success: false,
        message: 'Look not found'
      });
    }

    res.status(200).json({
      success: true,
      look
    });
  } catch (error) {
    console.error('Error in getLookById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch look',
      error: error.message
    });
  }
});

// Update look
export const updateLook = catchAsync(async (req, res, next) => {
  if (req.body.products) {
    // Verify all products exist and have videos
    const productIds = req.body.products.map(product => product.productId);
    
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Check if all products were found
    if (products.length !== productIds.length) {
      return next(new AppError('One or more products do not exist', 404));
    }
    
    // Check if all products have videos
    const productsWithoutVideos = products.filter(product => !hasVideo(product));
    if (productsWithoutVideos.length > 0) {
      return next(new AppError('One or more products do not have videos', 400));
    }
  }

  // Handle the thumbnail update separately
  const updateData = { ...req.body };
  
  const look = await Look.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  if (!look) {
    return next(new AppError('Look not found', 404));
  }

  res.status(200).json({
    success: true,
    look
  });
});

// Delete look
export const deleteLook = catchAsync(async (req, res, next) => {
  const look = await Look.findByIdAndDelete(req.params.id);

  if (!look) {
    return next(new AppError('Look not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Look deleted successfully'
  });
}); 