import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  VideoFile as VideoIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditLookForm = ({ look, onClose }) => {
  const [formData, setFormData] = useState({
    name: look.name || '',
    description: look.description || '',
    thumbnail: look.thumbnail || '',
    active: look.active !== false,
    featured: look.featured || false,
    products: []
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productDetails, setProductDetails] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  // Fetch products with videos and existing look details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get product details for the look
        const lookDetailsResponse = await axios.get(`${backendURL}/api/looks/${look._id}`, {
          headers: { token: token }
        });
        
        if (lookDetailsResponse.data.success && lookDetailsResponse.data.look) {
          const lookData = lookDetailsResponse.data.look;
          
          // Get product details for UI display
          const lookProducts = lookData.products.map(product => ({
            productId: product.productId._id,
            displayOrder: product.displayOrder,
            _tempName: product.productId.name,
            _tempImage: product.productId.image?.[0] || '',
            _tempVideo: product.productId.video?.[0] || ''
          }));
          
          // Sort products by display order
          lookProducts.sort((a, b) => a.displayOrder - b.displayOrder);
          
          setFormData(prev => ({
            ...prev,
            products: lookProducts
          }));
        }
        
        // Get all products with videos for the dropdown
        const productsResponse = await axios.get(`${backendURL}/api/product/list`, {
          headers: { token: token }
        });

        if (productsResponse.data.products) {
          // Filter products that have videos
          const productsWithVideos = productsResponse.data.products.filter(
            product => product.video && product.video.length > 0
          );
          setAvailableProducts(productsWithVideos);
          
          // Create a lookup for product details
          const productLookup = {};
          productsWithVideos.forEach(product => {
            productLookup[product._id] = {
              name: product.name,
              image: product.image?.[0] || '',
              video: product.video?.[0] || ''
            };
          });
          setProductDetails(productLookup);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch look data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [look._id]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'active' || name === 'featured' ? checked : value
    });
  };

  const handleProductSelect = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    // Check if product is already added
    if (formData.products.some(p => p.productId === selectedProduct)) {
      toast.warning('This product is already added to the look');
      return;
    }

    const productInfo = productDetails[selectedProduct] || {};
    
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          productId: selectedProduct,
          displayOrder: formData.products.length,
          _tempName: productInfo.name || 'Unknown Product',
          _tempImage: productInfo.image || '',
          _tempVideo: productInfo.video || ''
        }
      ]
    });
    
    setSelectedProduct('');
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    
    // Update display order after removal
    const reorderedProducts = updatedProducts.map((product, i) => ({
      ...product,
      displayOrder: i
    }));
    
    setFormData({
      ...formData,
      products: reorderedProducts
    });
  };

  const moveProduct = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formData.products.length - 1)
    ) {
      return;
    }

    const newProducts = [...formData.products];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap products
    [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]];
    
    // Update display order
    const reorderedProducts = newProducts.map((product, i) => ({
      ...product,
      displayOrder: i
    }));
    
    setFormData({
      ...formData,
      products: reorderedProducts
    });
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  // Upload thumbnail to Cloudinary
  const uploadThumbnail = async () => {
    if (!thumbnailFile) return null;
    
    setThumbnailLoading(true);
    const formData = new FormData();
    formData.append('image', thumbnailFile);
    
    try {
      const response = await axios.post(
        `${backendURL}/api/upload/image`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'token': token 
          }
        }
      );
      
      if (response.data.success) {
        setThumbnailLoading(false);
        return response.data.imageUrl;
      } else {
        toast.error('Thumbnail upload failed');
        setThumbnailLoading(false);
        return null;
      }
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast.error('Thumbnail upload failed: ' + (error.response?.data?.message || error.message));
      setThumbnailLoading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.products.length === 0) {
      toast.error('Please add at least one product to the look');
      return;
    }

    try {
      setSubmitting(true);
      
      // Upload thumbnail if selected
      let uploadedThumbnailUrl = null;
      if (thumbnailFile) {
        uploadedThumbnailUrl = await uploadThumbnail();
      }
      
      // Strip temporary fields before submission
      const productsToSubmit = formData.products.map(({ productId, displayOrder }) => ({
        productId,
        displayOrder
      }));

      const lookData = {
        ...formData,
        products: productsToSubmit,
        thumbnail: uploadedThumbnailUrl || formData.thumbnail
      };

      const response = await axios.put(
        `${backendURL}/api/looks/${look._id}`,
        lookData,
        { headers: { token: token } }
      );

      if (response.data.success) {
        toast.success('Look updated successfully');
        onClose(true); // Refresh the parent component
      }
    } catch (error) {
      console.error('Error updating look:', error);
      toast.error(error.response?.data?.message || 'Failed to update look');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Look Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        
        <Grid item xs={12}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Thumbnail Image
            </label>
            
            {/* Image preview */}
            {(thumbnailPreview || formData.thumbnail) && (
              <div className="mb-2">
                <img 
                  src={thumbnailPreview || formData.thumbnail} 
                  alt="Look thumbnail preview" 
                  className="w-full max-w-xs h-auto object-cover rounded"
                />
              </div>
            )}
            
            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full p-2 border rounded"
            />
            
            {/* Alternative URL input */}
            <div className="mt-2">
              <label className="block text-sm text-gray-600 mb-1">
                Or enter thumbnail URL
              </label>
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="http://example.com/image.jpg"
              />
            </div>
            
            {thumbnailLoading && (
              <div className="mt-2 flex items-center">
                <div className="mr-2 h-4 w-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Uploading thumbnail...</span>
              </div>
            )}
          </div>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.active} 
                  onChange={handleChange} 
                  name="active" 
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.featured} 
                  onChange={handleChange} 
                  name="featured" 
                />
              }
              label="Featured"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Products with Videos
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControl fullWidth>
              <InputLabel>Select Product with Video</InputLabel>
              <Select
                value={selectedProduct}
                label="Select Product with Video"
                onChange={handleProductSelect}
                disabled={loading}
              >
                {availableProducts.length === 0 ? (
                  <MenuItem disabled>No products with videos available</MenuItem>
                ) : (
                  availableProducts.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name}
                      <VideoIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <Button 
              variant="outlined" 
              onClick={handleAddProduct}
              disabled={!selectedProduct || loading}
            >
              Add
            </Button>
          </Box>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Products ({formData.products.length})
            </Typography>
            
            {formData.products.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  No products selected yet. Add products with videos to create a look.
                </Typography>
              </Paper>
            ) : (
              <Paper variant="outlined">
                <List>
                  {formData.products.map((product, index) => (
                    <React.Fragment key={product.productId}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box 
                            component="img" 
                            src={product._tempImage} 
                            alt="Product" 
                            sx={{ width: 40, height: 40, objectFit: 'cover', mr: 2, borderRadius: 1 }}
                          />
                          <ListItemText 
                            primary={product._tempName} 
                            secondary={`Display order: ${product.displayOrder + 1}`}
                          />
                          <Box sx={{ display: 'flex' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => moveProduct(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUpIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => moveProduct(index, 'down')}
                              disabled={index === formData.products.length - 1}
                            >
                              <ArrowDownIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              edge="end" 
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button onClick={() => onClose()} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={submitting || formData.products.length === 0}
        >
          {submitting ? <CircularProgress size={24} /> : 'Update Look'}
        </Button>
      </Box>
    </Box>
  );
};

export default EditLookForm; 