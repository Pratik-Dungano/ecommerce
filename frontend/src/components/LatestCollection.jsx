import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import { ShoppingCart } from "react-feather"
import Title from "./Title"

const LatestCollection = () => {
  const { products, addToCart, isLoggedIn } = useContext(ShopContext)
  const navigate = useNavigate()
  const [latestProducts, setLatestProducts] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [showSizeOptions, setShowSizeOptions] = useState(false)

  useEffect(() => {
    setLatestProducts(products.slice(0, 5))
  }, [products])

  const handleSelectSize = (size) => {
    setSelectedSize(size)
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please sign in to add items to your cart.")
      return
    }
    if (!selectedSize) {
      alert("Please select a size before adding to the cart.")
      return
    }
    addToCart(selectedItem._id, selectedSize)
    alert(`${selectedItem.name} (Size: ${selectedSize}) has been added to your cart!`)
    setShowSizeOptions(false)
    setSelectedItem(null)
    setSelectedSize("")
  }

  return (
    <div id="collection" className="my-10 px-8 max-w-6xl mx-auto">
      <div className="text-center text-3xl py-8">
        <Title text1="Latest" text2=" Collections" />
        <p className="w-3/4 m-auto text-base sm:text-lg md:text-xl text-gray-600">Check out our latest collections</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {latestProducts.map((item, index) => (
          <div
            key={index}
            className="relative group transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate(`/product/${item._id}`)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-md transition-shadow duration-300 ease-in-out group-hover:shadow-xl w-full h-full flex flex-col">
              {/* Image container */}
              <div className="relative overflow-hidden" style={{ paddingTop: "120%" }}>
                <img
                  src={item.image[0] || "/placeholder.svg"}
                  alt={`Product image of ${item.name}`}
                  className="absolute top-0 left-0 w-full h-full object-cover object-top"
                />
              </div>

              {/* Overlay effect */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

              

              {/* Cart Icon (Only Visible on Hover) */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem(item)
                  setShowSizeOptions(true)
                }}
                className="absolute top-3 right-3 bg-gray-800 text-white p-2 rounded-full opacity-0 
                           group-hover:opacity-100 transition-all duration-300 hover:bg-gray-600 hover:scale-110"
                aria-label="Add to Cart"
              >
                <ShoppingCart size={18} />
              </button>

              {/* Product Info */}
              <div className="p-4 bg-white flex-grow">
                <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500">${item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Size Selection Modal */}
      {showSizeOptions && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Select a Size</h2>
            <div className="flex gap-4">
              {selectedItem.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded ${selectedSize === size ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                  onClick={() => handleSelectSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowSizeOptions(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LatestCollection

