import axios from 'axios';
import { backendUrl } from '../config';

// Configure axios defaults
const api = axios.create({
  baseURL: `${backendUrl}/api/category`,
});

// Add token to requests
const setAuthHeader = (token) => {
  return {
    headers: {
      token: token,
    },
  };
};

// Category APIs
export const getAllCategories = async (token) => {
  try {
    const response = await api.get('/admin/all', setAuthHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Get categories for shop display
export const getShopCategories = async () => {
  try {
    const response = await api.get('/shop');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

export const createCategory = async (categoryData, token) => {
  try {
    const response = await api.post('/', categoryData, setAuthHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

export const updateCategory = async (id, categoryData, token) => {
  try {
    const response = await api.put(`/${id}`, categoryData, setAuthHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

export const deleteCategory = async (id, token) => {
  try {
    const response = await api.delete(`/${id}`, setAuthHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

export const toggleCategoryFeatured = async (id, data, token) => {
  try {
    const response = await api.put(`/${id}/featured`, data, setAuthHeader(token));
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Subcategory APIs
export const addSubcategory = async (categoryId, subcategoryData, token) => {
  try {
    const response = await api.post(
      `/${categoryId}/subcategory`, 
      subcategoryData, 
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

export const updateSubcategory = async (categoryId, subcategoryId, subcategoryData, token) => {
  try {
    const response = await api.put(
      `/${categoryId}/subcategory/${subcategoryId}`, 
      subcategoryData, 
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

export const deleteSubcategory = async (categoryId, subcategoryId, token) => {
  try {
    const response = await api.delete(
      `/${categoryId}/subcategory/${subcategoryId}`, 
      setAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
}; 