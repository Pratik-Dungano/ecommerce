import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (products.length > 0) {
            // Filter by category and subcategory, and exclude the current product
            let filteredProducts = products.filter((item) => 
                item.category === category && 
                item.subcategory === subCategory &&
                item._id !== currentProductId
            );

            // Shuffle the filtered products array
            const shuffledProducts = filteredProducts.sort(() => Math.random() - 0.5);

            // Get up to 5 random related products
            setRelated(shuffledProducts.slice(0, 5));
        }
    }, [products, category, subCategory, currentProductId]);

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1={'Similar'} text2={' Products'} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {related.map((item) => (
                    <div key={item._id} onClick={() => handleProductClick(item._id)}>
                        <ProductItem
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            sizes={item.sizes}
                            discountPercentage={item.discountPercentage}
                            ecoFriendly={item.ecoFriendly}
                            video={item.video}
                            isNew={item.isNew}
                            quantity={item.quantity}
                            isOutOfStock={item.isOutOfStock}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;