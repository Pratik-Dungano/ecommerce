import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  toggleCategoryFeatured
} from '../services/categoryService';
import axios from 'axios';
import { backendUrl } from '../config';

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category form state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Subcategory form state
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: ''
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories(token);
      if (response.success) {
        setCategories(response.categories);
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      setError('Failed to fetch categories. Please try again.');
      toast.error('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // Reset forms
  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', image: '' });
    setEditingCategory(null);
    setIsAddingCategory(false);
    setImageFile(null);
    setImagePreview('');
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({ name: '', description: '' });
    setEditingSubcategory(null);
    setIsAddingSubcategory(false);
    setSelectedCategoryId(null);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setImageLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/upload/image`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'token': token 
          }
        }
      );
      
      if (response.data.success) {
        setImageLoading(false);
        // Return the Cloudinary URL
        return response.data.imageUrl;
      } else {
        toast.error('Image upload failed');
        setImageLoading(false);
        return null;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Image upload failed: ' + (error.response?.data?.message || error.message));
      setImageLoading(false);
      return null;
    }
  };

  // Handle category form submission with image upload
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      let uploadedImageUrl = null;
      
      // Upload image if selected
      if (imageFile) {
        uploadedImageUrl = await uploadImage();
        if (!uploadedImageUrl && !categoryForm.image) {
          // If upload failed and no previous image
          return;
        }
      }
      
      // Prepare category data with image URL if uploaded
      const categoryData = {
        ...categoryForm,
        image: uploadedImageUrl || categoryForm.image
      };
      
      let response;
      
      if (editingCategory) {
        // Update existing category
        response = await updateCategory(editingCategory._id, categoryData, token);
        if (response.success) {
          toast.success('Category updated successfully');
        }
      } else {
        // Create new category
        response = await createCategory(categoryData, token);
        if (response.success) {
          toast.success('Category created successfully');
        }
      }
      
      // Reset form and states
      fetchCategories();
      resetCategoryForm();
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  // Handle subcategory form submission
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingSubcategory) {
        // Update existing subcategory
        response = await updateSubcategory(
          selectedCategoryId, 
          editingSubcategory._id, 
          subcategoryForm, 
          token
        );
        if (response.success) {
          toast.success('Subcategory updated successfully');
        }
      } else {
        // Create new subcategory
        response = await addSubcategory(selectedCategoryId, subcategoryForm, token);
        if (response.success) {
          toast.success('Subcategory created successfully');
        }
      }
      
      // Refresh categories list
      fetchCategories();
      resetSubcategoryForm();
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const response = await deleteCategory(id, token);
        if (response.success) {
          toast.success('Category deleted successfully');
          fetchCategories();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete category. Please try again.');
      }
    }
  };

  // Handle subcategory deletion
  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory? This action cannot be undone.')) {
      try {
        const response = await deleteSubcategory(categoryId, subcategoryId, token);
        if (response.success) {
          toast.success('Subcategory deleted successfully');
          fetchCategories();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete subcategory. Please try again.');
      }
    }
  };

  // Set up category for editing
  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setIsAddingCategory(true);
    setImagePreview(category.image || '');
  };

  // Set up subcategory for editing
  const startEditingSubcategory = (categoryId, subcategory) => {
    setSelectedCategoryId(categoryId);
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description || ''
    });
    setIsAddingSubcategory(true);
  };

  // Start adding subcategory
  const startAddingSubcategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsAddingSubcategory(true);
  };

  // Handle navbar display toggle
  const handleToggleNavbarDisplay = async (category) => {
    try {
      const newNavbarStatus = !category.displayInNavbar;
      const response = await toggleCategoryFeatured(
        category._id, 
        { 
          displayInNavbar: newNavbarStatus,
          displayInCategorySection: category.displayInCategorySection || false,
          displayOrder: category.displayOrder || 0 
        }, 
        token
      );
      
      if (response.success) {
        toast.success(newNavbarStatus 
          ? 'Category will now display in navbar!' 
          : 'Category removed from navbar');
        fetchCategories();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update navbar display status. Please try again.');
    }
  };

  // Handle category section display toggle
  const handleToggleCategorySectionDisplay = async (category) => {
    try {
      const newCategorySectionStatus = !category.displayInCategorySection;
      const response = await toggleCategoryFeatured(
        category._id, 
        { 
          displayInNavbar: category.displayInNavbar || false,
          displayInCategorySection: newCategorySectionStatus,
          displayOrder: category.displayOrder || 0 
        }, 
        token
      );
      
      if (response.success) {
        toast.success(newCategorySectionStatus 
          ? 'Category will now display in category section!' 
          : 'Category removed from category section');
        fetchCategories();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update category section display status. Please try again.');
    }
  };

  // Handle display order change
  const handleDisplayOrderChange = async (category, newOrder) => {
    if (newOrder < 0) return;
    
    try {
      const response = await toggleCategoryFeatured(
        category._id,
        {
          displayInNavbar: category.displayInNavbar || false,
          displayInCategorySection: category.displayInCategorySection || false,
          displayOrder: newOrder
        },
        token
      );
      
      if (response.success) {
        toast.success('Display order updated');
        fetchCategories();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update display order. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading categories...</div>;
  if (error && !categories.length) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Category
        </button>
      </div>

      {/* Category Form */}
      {isAddingCategory && (
        <div className="bg-white p-6 mb-8 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleCategorySubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category Image</label>
              
              {/* Image preview */}
              {(imagePreview || categoryForm.image) && (
                <div className="mb-2">
                  <img 
                    src={imagePreview || categoryForm.image} 
                    alt="Category preview" 
                    className="w-full max-w-xs h-auto object-cover rounded"
                  />
                </div>
              )}
              
              {/* File input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
              
              {/* Alternative URL input */}
              <div className="mt-2">
                <label className="block text-sm text-gray-600 mb-1">Or enter image URL</label>
                <input
                  type="text"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="http://example.com/image.jpg"
                />
              </div>
              
              {imageLoading && (
                <div className="mt-2 flex items-center">
                  <div className="mr-2 h-4 w-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Uploading image...</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={resetCategoryForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subcategory Form */}
      {isAddingSubcategory && (
        <div className="bg-white p-6 mb-8 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
          </h2>
          <form onSubmit={handleSubcategorySubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {editingSubcategory ? 'Update Subcategory' : 'Create Subcategory'}
              </button>
              <button
                type="button"
                onClick={resetSubcategoryForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Categories</h2>
        {categories.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No categories found. Add your first category!</div>
        ) : (
          <div className="divide-y">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded shadow mb-4 p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    {category.active === false && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded ml-2">Inactive</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startAddingSubcategory(category._id)}
                      className="text-purple-500 hover:text-purple-700 mr-2"
                    >
                      Add Subcategory
                    </button>
                    <button
                      onClick={() => startEditingCategory(category)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Display controls */}
                <div className="flex flex-col space-y-3 mt-2 mb-3">
                  {/* Navbar Display Toggle */}
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category.displayInNavbar || false}
                        onChange={() => handleToggleNavbarDisplay(category)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        Display in Navbar
                      </span>
                    </label>
                    {category.displayInNavbar && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                    )}
                  </div>

                  {/* Category Section Display Toggle */}
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category.displayInCategorySection || false}
                        onChange={() => handleToggleCategorySectionDisplay(category)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        Display in Category Section
                      </span>
                    </label>
                    {category.displayInCategorySection && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                    )}
                  </div>
                  
                  {/* Display Order - only show if at least one display option is active */}
                  {(category.displayInNavbar || category.displayInCategorySection) && (
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-700">Display Order:</label>
                      <input
                        type="number"
                        min="0"
                        value={category.displayOrder || 0}
                        onChange={(e) => handleDisplayOrderChange(category, parseInt(e.target.value))}
                        className="w-16 p-1 text-sm border rounded"
                      />
                      <span className="text-xs text-gray-500">(Lower numbers appear first)</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{category.description || 'No description'}</p>
                
                {/* Category Image Display */}
                {category.image && (
                  <div className="mb-3">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
                
                {/* Subcategories */}
                <div className="pl-4 mt-4 border-l-2 border-gray-200">
                  <h4 className="text-md font-medium mb-2">Subcategories</h4>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <div className="space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div>
                            <p className="font-medium">{subcategory.name}</p>
                            <p className="text-gray-500 text-xs">{subcategory.description || 'No description'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingSubcategory(category._id, subcategory)}
                              className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(category._id, subcategory._id)}
                              className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No subcategories found</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;