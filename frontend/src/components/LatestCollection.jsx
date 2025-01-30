// LatestCollection.jsx
import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 5));
    }, [products]);

    return (
        <>
            <section className="bg-transparent py-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Latest Collection</h1>
                    <p className="text-lg text-gray-600 mt-4">
                        Discover the Latest Collection with a variety of styles.
                    </p>
                </div>
            </section>
            <div className="my-10 mx-10">
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                    {latestProducts.map((item, index) => (
                        <ProductItem 
                            key={index} 
                            id={item._id} 
                            image={item.image} 
                            name={item.name} 
                            price={item.price} 
                            sizes={item.sizes} 
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default LatestCollection;