import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const { 
        currency, 
        delivery_fee, 
        cartItems,
        products,
        getTotalCartAmount,
    } = useContext(ShopContext);

    // Calculate original total (without discounts)
    const getOriginalTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = products.find(p => p._id === item.itemId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const originalTotal = getOriginalTotal();
    const discountedSubtotal = getTotalCartAmount();
    const totalSavings = originalTotal - discountedSubtotal;
    const finalTotal = discountedSubtotal + delivery_fee;
    
    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={' TOTAL'}/>
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Original Price</p>
                    <p>{currency}{originalTotal}</p>
                </div>
                {totalSavings > 0 && (
                    <div className='flex justify-between text-green-600'>
                        <p>Discount Savings</p>
                        <p>- {currency}{totalSavings}</p>
                    </div>
                )}
                <hr/>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency}{discountedSubtotal}</p>
                </div>
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency}{delivery_fee}</p>
                </div>
                <hr />
                <div className='flex justify-between font-semibold text-base'>
                    <p>Total</p>
                    <p>{currency}{finalTotal}</p>
                </div>
                {totalSavings > 0 && (
                    <p className='text-green-600 text-xs text-right'>
                        You save {currency}{totalSavings} on this order!
                    </p>
                )}
            </div>
        </div>
    )
}

export default CartTotal