import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = ({ token }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubCategory] = useState("Kurtas");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
        if (response.data.success) {
          const product = response.data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category);
          setSubCategory(product.subcategory);
          setBestseller(product.bestseller);
          setSizes(product.sizes);
          setExistingImages(product.image);
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
      }
    };
    fetchProduct();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/edit`,
        formData,
        { headers: { token } }
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
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-5 p-5 bg-gray-50">
      {/* Upload Image Section */}
      <div>
        <p className="mb-2 font-semibold">Current Images</p>
        <div className="flex gap-3 mb-4">
          {existingImages.map((img, index) => (
            <img key={index} src={img} alt={`Product ${index + 1}`} className="w-20 h-20 object-cover rounded-md" />
          ))}
        </div>
        <p className="mb-2 font-semibold">Upload New Images (Optional)</p>
        <div className="flex gap-3">
          <label htmlFor="image1" className="cursor-pointer">
            <img className="w-20 h-20 object-cover rounded-md" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="Upload" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          {/* Repeat for image2, image3, image4 */}
        </div>
      </div>

      {/* Rest of the form fields similar to Add.jsx */}
      {/* ... Copy the input fields from Add.jsx ... */}
      
      <button
        type="submit"
        className="px-5 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800"
      >
        Update Product
      </button>
    </form>
  );
};

export default Edit; 