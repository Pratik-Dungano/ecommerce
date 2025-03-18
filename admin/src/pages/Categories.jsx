import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../services/categoryService';

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
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({ name: '', description: '' });
    setEditingSubcategory(null);
    setIsAddingSubcategory(false);
    setSelectedCategoryId(null);
  };

  // Handle category form submission
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingCategory) {
        // Update existing category
        response = await updateCategory(editingCategory._id, categoryForm, token);
        if (response.success) {
          toast.success('Category updated successfully');
        }
      } else {
        // Create new category
        response = await createCategory(categoryForm, token);
        if (response.success) {
          toast.success('Category created successfully');
        }
      }
      
      // Refresh categories list
      fetchCategories();
      resetCategoryForm();
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
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                value={categoryForm.image}
                onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="http://example.com/image.jpg"
              />
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
              <div key={category._id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    {category.active === false && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded">Inactive</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startAddingSubcategory(category._id)}
                      className="bg-purple-500 text-white px-3 py-1 text-sm rounded hover:bg-purple-600 transition"
                    >
                      Add Subcategory
                    </button>
                    <button
                      onClick={() => startEditingCategory(category)}
                      className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{category.description || 'No description'}</p>
                
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