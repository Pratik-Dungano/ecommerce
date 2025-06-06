import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';
import { Play, X, Upload } from 'react-feather';

const Add = ({token}) => {
  const [image1,setImage1]=useState(false);
  const [image2,setImage2]=useState(false);
  const [image3,setImage3]=useState(false);
  const [image4,setImage4]=useState(false);
  const [video,setVideo]=useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);

  const [name,setName]=useState("");
  const [description,setDescription]=useState("");
  const [price,setPrice]=useState("");
  const [discountPercentage,setDiscountPercentage]=useState("");
  const [category,setCategory]=useState("");
  const [subcategory,setSubCategory]=useState("");
  const [bestseller,setBestseller]=useState(false);
  const [ecoFriendly,setEcoFriendly]=useState(false);
  const [sizes,setSizes]=useState([]);

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
          // Set default values if categories exist
          if (response.data.categories.length > 0) {
            setCategory(response.data.categories[0]._id);
            // Set default subcategory if available
            if (response.data.categories[0].subcategories.length > 0) {
              setSubCategory(response.data.categories[0].subcategories[0]._id);
            }
          }
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

  // Generate video thumbnail when video is selected
  const handleVideoSelect = (file) => {
    setVideo(file);
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

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!name || !description || !price || !category || !subcategory) {
        toast.error("Please fill in all required fields");
        setIsUploading(false);
        return;
      }

      // Validate at least one image is uploaded
      if (!image1) {
        toast.error("Please upload at least one product image");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();

      // Add text fields
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPercentage", discountPercentage || "0");
      
      // Add category and subcategory data
      const categoryName = getCategoryName();
      const subcategoryName = getSubcategoryName();
      
      if (!categoryName || !subcategoryName) {
        toast.error("Invalid category or subcategory selection");
        setIsUploading(false);
        return;
      }

      // Add category fields
      formData.append("category", categoryName);
      formData.append("subcategory", subcategoryName);
      formData.append("categoryId", category);
      formData.append("subcategoryId", subcategory);
      
      // Add boolean fields
      formData.append("bestseller", bestseller.toString());
      formData.append("ecoFriendly", ecoFriendly.toString());
      
      // Add sizes array
      formData.append("sizes", JSON.stringify(sizes));

      // Add images
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);
      
      // Add video if present
      if (video) {
        formData.append("video", video);
      }

      // Create upload progress handler
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      };

      console.log('Sending request with token:', token); // Debug log

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setVideo(false);
        setVideoThumbnail(null);
        setPrice('');
        setDiscountPercentage('');
        setSizes([]);
        setBestseller(false);
        setEcoFriendly(false);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.message || "Failed to add product");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
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

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-5 p-5 bg-gray-50">
      {/* Upload Image Section */}
      <div>
        <p className="mb-2 font-semibold">Upload Images</p>
        <div className="flex gap-3">
          <label htmlFor="image1" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image1 ? assets.upload_area:URL.createObjectURL(image1)} alt="Upload" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden required accept="image/*" />
          </label>
          <label htmlFor="image2" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image2 ? assets.upload_area:URL.createObjectURL(image2)} alt="Upload" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden accept="image/*" />
          </label>
          <label htmlFor="image3" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image3 ? assets.upload_area:URL.createObjectURL(image3)} alt="Upload" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden accept="image/*" />
          </label>
          <label htmlFor="image4" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image4 ? assets.upload_area:URL.createObjectURL(image4)} alt="Upload" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden accept="image/*" />
          </label>
        </div>
      </div>

      {/* Upload Video Section */}
      <div>
        <p className="mb-2 font-semibold">Upload Product Video (Optional)</p>
        <div className="flex items-start gap-3">
          <div className="relative">
            <label htmlFor="video" className="cursor-pointer flex items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-colors overflow-hidden">
              {!video ? (
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">Upload video</p>
                </div>
              ) : (
                <>
                  {videoThumbnail ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={videoThumbnail} 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-10 w-10 mx-auto text-green-500" />
                      <p className="mt-1 text-sm text-green-600">Video selected</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{video.name}</p>
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

            {video && (
              <button 
                type="button"
                onClick={() => {
                  setVideo(false);
                  setVideoThumbnail(null);
                }}
                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {video && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Video Details:</p>
              <p className="text-xs text-gray-500">
                Name: {video.name}
                <br />
                Size: {(video.size / (1024 * 1024)).toFixed(2)} MB
                <br />
                Type: {video.type}
              </p>
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
          onChange={(e)=>setName(e.target.value)}
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
          onChange={(e)=>setDescription(e.target.value)}
          value={description}
          id="productDescription"
          placeholder="Write content here"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Category, Sub Category, and Price */}
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
            Sub category
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
              required
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
             onChange={(e)=>setPrice(e.target.value)}
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
             onChange={(e)=>setDiscountPercentage(e.target.value)}
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
      </div>

      {/* Product Sizes */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Product Sizes</p>
        <div className="flex gap-3">
        
          <div onClick={()=>setSizes(prev=>prev.includes("S") ? prev.filter(item=>item !== "S"):[...prev,"S"])}>
            <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p> 
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("M") ? prev.filter(item=>item !== "M"):[...prev,"M"])}>
            <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p> 
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("L") ? prev.filter(item=>item !== "L"):[...prev,"L"])}>
            <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p> 
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("XL") ? prev.filter(item=>item !== "XL"):[...prev,"XL"])}>
            <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p> 
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("XXL") ? prev.filter(item=>item !== "XXL"):[...prev,"XXL"])}>
            <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p> 
          </div>
        </div>
      </div>

      {/* Bestseller and Eco-Friendly Checkboxes */}
      <div className="w-full">
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
            />
            <label htmlFor="bestseller">Bestseller</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="ecoFriendly"
              checked={ecoFriendly}
              onChange={(e) => setEcoFriendly(e.target.checked)}
            />
            <label htmlFor="ecoFriendly">Eco-Friendly</label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isUploading}
        className={`px-6 py-2 bg-black text-white font-semibold rounded-md ${
          isUploading 
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-800'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Add Product'}
      </button>
    </form>
  );
};

export default Add;
