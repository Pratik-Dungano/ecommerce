import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const BestSeller = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const bestSellerProducts = [
        { _id: '679b716fa4c0c9ab62b0a6df', image: assets.imageb1 },
        { _id: '679b77c7a4c0c9ab62b0a701', image: assets.imageb2 },
        { _id: '679b6587a4c0c9ab62b0a682', image: assets.imageb3 },
        { _id: '679b6ff5a4c0c9ab62b0a6cd', image: assets.imageb4 }
    ];

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        window.scrollTo(0, 0);
    };

    return (
        <section className="bg-transparent py-10">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Best Seller</h1>
                <p className="text-lg text-gray-600 mt-2">Discover Best Seller Products</p>
            </div>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {bestSellerProducts.map((item) => (
                        <div 
                            key={item._id} 
                            onClick={() => handleProductClick(item._id)} 
                            className="cursor-pointer bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <img 
                                src={item.image} 
                                alt="Product" 
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSeller;