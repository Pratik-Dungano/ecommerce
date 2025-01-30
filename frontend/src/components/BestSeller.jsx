import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])
    useEffect(() => {
        const bestProducts=products.filter((item)=>item.bestSeller)
        setBestSeller(products.slice(0, 5))
    }, [products])
  return (
    <>
     <section className="bg-transparent py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">BestSeller</h1>
          <p className="text-lg text-gray-600 mt-4">
            Discover Best Seller Products
          </p>
        </div>
      </section>
    <div className='my-10 mx-10' >
    

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} sizes={item.sizes}/>
                ))
            }
        </div>
    </div>
    </>
  )
}

export default BestSeller