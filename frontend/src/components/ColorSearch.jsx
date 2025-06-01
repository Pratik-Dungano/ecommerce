import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ColorSearch = () => {
  const { backendUrl } = useContext(ShopContext);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const navigate = useNavigate();

  // Fetch available colors
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/colors/available`);
        if (response.data.success) {
          setAvailableColors(response.data.colors);
        }
      } catch (error) {
        console.error('Error fetching colors:', error);
      }
    };

    fetchColors();
  }, [backendUrl]);

  // Handle color search
  const handleColorSearch = async (color) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/colors/search`, {
        params: { color }
      });

      if (response.data.success) {
        navigate('/collection', {
          state: {
            searchTerm: `Color: ${color}`,
            searchResults: response.data.products
          }
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error searching products by color');
    } finally {
      setLoading(false);
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    handleColorSearch(color);
  };

  // Handle color picker change
  const handleColorPickerChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    handleColorSearch(color);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Search by Color</h2>
        
        {/* Color Picker */}
        <div className="mb-4">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <span>Use Color Picker</span>
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: selectedColor }}
            />
          </button>
          
          {showColorPicker && (
            <div className="mt-2">
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorPickerChange}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Available Colors */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableColors.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => handleColorSelect(name)}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition"
              disabled={loading}
            >
              <div
                className="w-8 h-8 rounded-full mb-1"
                style={{ backgroundColor: name }}
              />
              <span className="text-xs text-gray-600">{name}</span>
              <span className="text-xs text-gray-400">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  );
};

export default ColorSearch; 