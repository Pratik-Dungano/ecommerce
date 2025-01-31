import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (products.length > 0) {
            let productCopy = products.slice();

            productCopy = productCopy.filter((item) => category === item.category);
            productCopy = productCopy.filter((item) => subCategory === item.subCategory);

            setRelated(productCopy.slice(0, 5));
        }
    }, [products, category, subCategory]);

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="my-24">
            <div className="text-center text-3xl py-2">
                <Title text1={'Related'} text2={' Products'} />
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
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;