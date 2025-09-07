import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({ selectedItems = null }) => {
    const { 
        currency, 
        delivery_fee, 
        cartItems,
        products,
        getTotalCartAmount,
    } = useContext(ShopContext);

    // Use selected items if provided, otherwise use all cart items
    const itemsToCalculate = selectedItems || cartItems;

    // Calculate original total (without discounts) for selected items
    const getOriginalTotal = () => {
        return itemsToCalculate.reduce((total, item) => {
            const product = products.find(p => p._id === item._id || p._id === item.itemId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    // Calculate discounted total for selected items
    const getDiscountedTotal = () => {
        let total = 0;
        itemsToCalculate.forEach((item) => {
            const product = products.find(p => p._id === item._id || p._id === item.itemId);
            if (product) {
                const itemPrice = product.discountPercentage > 0 
                    ? Math.round(product.price - (product.price * product.discountPercentage / 100))
                    : product.price;
                total += itemPrice * item.quantity;
            }
        });
        return total;
    };

    const originalTotal = getOriginalTotal();
    const discountedSubtotal = getDiscountedTotal();
    const totalSavings = originalTotal - discountedSubtotal;
    const finalTotal = discountedSubtotal + delivery_fee;
    
    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={selectedItems ? 'SELECTED ' : 'CART '} text2={'TOTAL'}/>
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