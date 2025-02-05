import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const Reviews = ({ productId }) => {
    const { backendUrl, token } = useContext(ShopContext);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/reviews/product/${productId}`);
            if (response.data.success) {
                setReviews(response.data.reviews);
                setAverageRating(response.data.averageRating);
                setTotalReviews(response.data.totalReviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId, backendUrl]);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${
                    index < rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                }`}
            />
        ));
    };

    if (loading) {
        return <div className="animate-pulse">Loading reviews...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Review Summary */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-lg font-medium">
                    {averageRating.toFixed(1)} out of 5
                </span>
                <span className="text-gray-500">
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
            </div>

            {/* Review List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="border-b pb-6">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="font-medium">
                                    {review.userId?.name || 'Anonymous'}
                                </span>
                                <span className="text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-700">{review.text}</p>
                            {review.images && review.images.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {review.images.map((image, idx) => (
                                        <img
                                            key={idx}
                                            src={image}
                                            alt={`Review image ${idx + 1}`}
                                            className="h-20 w-20 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;