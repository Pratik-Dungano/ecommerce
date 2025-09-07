import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = ({ token }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [video, setVideo] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState(null);
  const videoRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [sizes, setSizes] = useState([]);

  // State for categories data
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get(`${backendUrl}/api/category/list`);
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Get subcategories for the selected category
  const getSubcategories = () => {
    const selectedCategory = categories.find(cat => cat._id === category);
    return selectedCategory ? selectedCategory.subcategories : [];
  };

  // Get category and subcategory names for the form submission
  const getCategoryName = () => {
    const selectedCategory = categories.find(cat => cat._id === category);
    return selectedCategory ? selectedCategory.name : "";
  };

  const getSubcategoryName = () => {
    const selectedCategory = categories.find(cat => cat._id === category);
    if (!selectedCategory) return "";
    
    const selectedSubcategory = selectedCategory.subcategories.find(sub => sub._id === subcategory);
    return selectedSubcategory ? selectedSubcategory.name : "";
  };

  // Check if selected category has subcategories
  const selectedCategoryHasSubcategories = () => {
    const selectedCategory = categories.find(cat => cat._id === category);
    return selectedCategory && selectedCategory.subcategories.length > 0;
  };

  // Handle category change and reset subcategory
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setCategory(newCategoryId);
    
    // Reset subcategory selection
    const newCategory = categories.find(cat => cat._id === newCategoryId);
    if (newCategory && newCategory.subcategories.length > 0) {
      setSubCategory(newCategory.subcategories[0]._id);
    } else {
      setSubCategory("");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
        if (response.data.success) {
          const product = response.data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setDiscountPercentage(product.discountPercentage || "");
          setQuantity(product.quantity || "");
          
          // Store the original category and subcategory name for matching with fetched categories
          const originalCategory = product.category;
          const originalSubcategory = product.subcategory;
          
          // Match by IDs if available, otherwise use the names for backward compatibility
          if (categories.length > 0) {
            // Try to find matching category either by id or by name
            let matchedCategory = categories.find(cat => cat._id === product.categoryId);
            if (!matchedCategory) {
              matchedCategory = categories.find(cat => cat.name === originalCategory);
            }
            
            if (matchedCategory) {
              setCategory(matchedCategory._id);
              
              // Try to find matching subcategory either by id or by name
              let matchedSubcategory = matchedCategory.subcategories.find(sub => sub._id === product.subcategoryId);
              if (!matchedSubcategory) {
                matchedSubcategory = matchedCategory.subcategories.find(sub => sub.name === originalSubcategory);
              }
              
              if (matchedSubcategory) {
                setSubCategory(matchedSubcategory._id);
              } else if (matchedCategory.subcategories.length > 0) {
                // Fallback to first subcategory if no match
                setSubCategory(matchedCategory.subcategories[0]._id);
              }
            } else if (categories.length > 0) {
              // Fallback to first category if no match
              setCategory(categories[0]._id);
              if (categories[0].subcategories.length > 0) {
                setSubCategory(categories[0].subcategories[0]._id);
              }
            }
          }
          
          setBestseller(product.bestseller);
          setEcoFriendly(product.ecoFriendly);
          setSizes(product.sizes);
          setExistingImages(product.image);
          setExistingVideo(product.video);
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
      }
    };

    // Only fetch the product after categories are loaded
    if (categories.length > 0) {
      fetchProduct();
    }
  }, [id, categories]);

  // Generate video thumbnail when video is selected
  const handleVideoSelect = (file) => {
    setVideo(file);
    setExistingVideo(null); // Clear existing video when new one is selected
    if (file) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        // Create a canvas to capture the thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0);
        setVideoThumbnail(canvas.toDataURL());
      };
      videoElement.src = URL.createObjectURL(file);
    } else {
      setVideoThumbnail(null);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate required fields
      const hasSubcategories = selectedCategoryHasSubcategories();
      if (!name || !description || !price || !quantity || !category || (hasSubcategories && !subcategory)) {
        const missingFields = [];
        if (!name) missingFields.push("Product Name");
        if (!description) missingFields.push("Description");
        if (!price) missingFields.push("Price");
        if (!quantity) missingFields.push("Stock Quantity");
        if (!category) missingFields.push("Category");
        if (hasSubcategories && !subcategory) missingFields.push("Subcategory");
        
        toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      
      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPercentage", discountPercentage);
      formData.append("quantity", quantity);
      formData.append("category", getCategoryName());
      formData.append("subcategory", getSubcategoryName());
      formData.append("categoryId", category);
      formData.append("subcategoryId", subcategory);
      formData.append("bestseller", bestseller);
      formData.append("ecoFriendly", ecoFriendly);
      formData.append("sizes", JSON.stringify(sizes));

      // Debug: Log the form data being sent
      console.log('Form data being sent:', {
        id, name, description, price, discountPercentage, quantity,
        category: getCategoryName(), subcategory: getSubcategoryName(),
        categoryId: category, subcategoryId: subcategory,
        bestseller, ecoFriendly, sizes
      });
      
      // Add existing images if no new ones are uploaded
      formData.append("existingImages", JSON.stringify(existingImages));
      
      // Add existing video if no new one is uploaded
      if (existingVideo && !video) {
        formData.append("existingVideo", existingVideo);
      }

      // Append new files if available
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      video && formData.append("video", video);

      // Create upload progress handler
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      };

      const response = await axios.post(
        `${backendUrl}/api/product/edit`,
        formData,
        { 
          headers: { 'Authorization': `Bearer ${token}` },
          onUploadProgress
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-5 p-5 bg-gray-50">
      {/* Current Images Section */}
      <div>
        <p className="mb-2 font-semibold">Current Images</p>
        <div className="flex gap-3 mb-4">
          {existingImages.map((img, index) => (
            <img key={index} src={img} alt={`Product ${index + 1}`} className="w-20 h-20 object-cover rounded-md" />
          ))}
        </div>
      </div>

      {/* Upload New Images Section */}
      <div>
        <p className="mb-2 font-semibold">Upload New Images (Optional)</p>
        <div className="flex gap-3">
          <label htmlFor="image1" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="Upload" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="Upload" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="Upload" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="Upload" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      {/* Current Video Section */}
      {existingVideo && (
        <div>
          <p className="mb-2 font-semibold">Current Video</p>
          <div className="mb-4">
            <video 
              ref={videoRef}
              src={existingVideo} 
              controls 
              className="w-64 h-auto rounded-md border border-gray-200"
              onLoadedMetadata={() => {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
                setVideoThumbnail(canvas.toDataURL());
              }}
            />
          </div>
        </div>
      )}

      {/* Upload New Video Section */}
      <div>
        <p className="mb-2 font-semibold">Upload New Video (Optional)</p>
        <div className="flex items-start gap-3">
          <div className="relative">
            <label htmlFor="video" className="cursor-pointer flex items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-colors overflow-hidden">
              {!video && !existingVideo ? (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">Upload video</p>
                </div>
              ) : (
                <>
                  {video ? (
                    // Show thumbnail for newly selected video
                    <>
                      {videoThumbnail ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={videoThumbnail} 
                            alt="Video thumbnail" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-1 text-sm text-green-600">Video selected</p>
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">{video.name}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    // Show existing video thumbnail
                    <div className="relative w-full h-full">
                      <img 
                        src={videoThumbnail} 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </>
              )}
              <input 
                onChange={(e) => handleVideoSelect(e.target.files[0])} 
                type="file" 
                id="video" 
                hidden 
                accept="video/*"
              />
            </label>

            {(video || existingVideo) && (
              <button 
                type="button"
                onClick={() => {
                  setVideo(false);
                  setVideoThumbnail(null);
                  setExistingVideo(null);
                }}
                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {(video || existingVideo) && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Video Details:</p>
              {video ? (
                <p className="text-xs text-gray-500">
                  Name: {video.name}
                  <br />
                  Size: {(video.size / (1024 * 1024)).toFixed(2)} MB
                  <br />
                  Type: {video.type}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Current video URL: {existingVideo}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
            </p>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="w-full">
        <label className="block mb-1 font-semibold" htmlFor="productName">
          Product name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          id="productName"
          placeholder="Type here"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full">
        <label className="block mb-1 font-semibold" htmlFor="productDescription">
          Product description
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          id="productDescription"
          placeholder="Write content here"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Category, Sub Category, Price and Discount */}
      <div className="flex flex-wrap gap-5 w-full">
        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-semibold" htmlFor="productCategory">
            Product category
          </label>
          {loadingCategories ? (
            <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-100">
              Loading categories...
            </div>
          ) : (
            <select
              onChange={handleCategoryChange}
              value={category}
              id="productCategory"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-semibold" htmlFor="subCategory">
            Sub category {selectedCategoryHasSubcategories() ? <span className="text-red-500">*</span> : <span className="text-gray-500">(Optional)</span>}
          </label>
          {loadingCategories ? (
            <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-100">
              Loading subcategories...
            </div>
          ) : (
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subcategory}
              id="subCategory"
              required={selectedCategoryHasSubcategories()}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getSubcategories().length === 0 ? (
                <option value="">No subcategories available</option>
              ) : (
                getSubcategories().map((subcat) => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.name}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-semibold" htmlFor="productPrice">
            Product Price
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="number"
            id="productPrice"
            placeholder="25"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-semibold" htmlFor="discountPercentage">
            Discount Percentage
          </label>
          <input
            onChange={(e) => setDiscountPercentage(e.target.value)}
            value={discountPercentage}
            type="number"
            id="discountPercentage"
            placeholder="0-100"
            required
            min="0"
            max="100"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 font-semibold" htmlFor="productQuantity">
            Stock Quantity
          </label>
          <input
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            type="number"
            id="productQuantity"
            placeholder="100"
            min="0"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Product Sizes</p>
        <div className="flex gap-3">
          <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
            <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
            <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
            <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
            <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
            <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>

      {/* Bestseller and Eco-Friendly Checkboxes */}
      <div className="w-full">
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="bestseller" className="text-gray-700">Bestseller</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ecoFriendly"
              checked={ecoFriendly}
              onChange={(e) => setEcoFriendly(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="ecoFriendly" className="text-gray-700">Eco-Friendly</label>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isUploading}
          className={`px-5 py-2 bg-black text-white font-semibold rounded-md ${
            isUploading 
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-800'
          }`}
        >
          {isUploading ? 'Updating...' : 'Update Product'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/list')}
          disabled={isUploading}
          className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Edit;