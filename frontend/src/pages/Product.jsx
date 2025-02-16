import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { Heart, Search, Truck, RefreshCw, Shield, Share2 } from 'lucide-react';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, addToWishList, wishListItems } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setImgSize] = useState([0, 0]);
  const magnifierRef = useRef(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const fetchProductData = () => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleMouseMove = (e) => {
    const elem = magnifierRef.current;
    const { top, left } = elem.getBoundingClientRect();
    // Calculate position relative to the image container
    const x = e.clientX - left;
    const y = e.clientY - top;
    setXY([x, y]);
  };

  const handleMouseEnter = () => {
    const elem = magnifierRef.current;
    const { width, height } = elem.getBoundingClientRect();
    setImgSize([width, height]);
    setShowMagnifier(true);
  };

  const handleBuyNow = () => {
    if (size) {
      addToCart(productData._id, size);
      navigate('/cart');
    } else {
      alert('Please select a size before proceeding');
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  const isInWishlist = wishListItems.some(item => item.id === productData._id);
  const MAGNIFIER_SIZE = 150;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div 
            className="relative overflow-hidden rounded-lg"
            style={{ 
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowMagnifier(false)}
            onMouseMove={handleMouseMove}
            ref={magnifierRef}
          >
            <img 
              src={image} 
              className="max-h-full max-w-full object-contain"
              alt={productData.name}
            />
            {showMagnifier && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${x - MAGNIFIER_SIZE/2}px`,
                  top: `${y - MAGNIFIER_SIZE/2}px`,
                  width: `${MAGNIFIER_SIZE}px`,
                  height: `${MAGNIFIER_SIZE}px`,
                  backgroundImage: `url('${image}')`,
                  backgroundPosition: `${-x * 2 + MAGNIFIER_SIZE/2}px ${-y * 2 + MAGNIFIER_SIZE/2}px`,
                  backgroundSize: `${imgWidth * 2}px ${imgHeight * 2}px`,
                  border: '2px solid #ddd',
                }}
              />
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {productData.image.map((item, index) => (
              <button
                key={index}
                onClick={() => setImage(item)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
                  ${item === image ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={item} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="" className="w-4 h-4" />
                ))}
                <img src={assets.star_dull_icon} alt="" className="w-4 h-4" />
              </div>
              <span className="text-sm text-gray-500">(122 reviews)</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-4xl font-bold text-gray-900">
              {currency}{productData.price}
            </p>
            <p className="text-sm text-green-600">Inclusive of all taxes</p>
          </div>

          <p className="text-gray-600">{productData.description}</p>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${item === size 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => addToCart(productData._id, size)}
              className="flex-1 min-w-[200px] bg-black text-white px-8 py-3 rounded-md font-medium
                hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 min-w-[200px] bg-orange-500 text-white px-8 py-3 rounded-md font-medium
                hover:bg-orange-600 transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={() => addToWishList(productData._id, size)}
              className="p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Heart 
                fill={isInWishlist ? 'red' : 'none'}
                stroke={isInWishlist ? 'red' : 'currentColor'}
                className="w-6 h-6"
              />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share on WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-gray-500">On orders above {currency}499</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-gray-500">7 days return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium">Secure Payments</p>
                  <p className="text-sm text-gray-500">100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subcategory}
          currentProductId={productData._id}
        />
      </div>
    </div>
  );
};

export default Product;