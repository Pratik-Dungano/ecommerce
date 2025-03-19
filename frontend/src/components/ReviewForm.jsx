import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';


const ReviewForm = ({ productId, orderId, onReviewSubmitted }) => {
    const { token, backendUrl } = useContext(ShopContext);
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        const checkExistingReview = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/reviews/product/${productId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (response.data.success) {
                    const reviews = response.data.reviews;
                    const userReview = reviews.find(review => review.userId === token.userId);
                    if (userReview) {
                        setHasReviewed(true);
                        toast.error('You have already reviewed this product');
                    }
                }
            } catch (error) {
                console.error('Error checking existing review:', error);
                toast.error('Error checking review status');
            }
        };

        if (productId && token) {
            checkExistingReview();
        }
    }, [productId, token, backendUrl]);

    if (hasReviewed) {
        return (
            <div className="p-4 bg-green-50 rounded-md text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 font-medium">
                    Thank you for your review!
                </p>
                <p className="text-green-600 text-sm mt-1">
                    Your feedback helps other shoppers make better decisions.
                </p>
            </div>
        );
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = [];

        toast.loading('Uploading images...', {
            id: 'imageUpload'
        });

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);

                const response = await axios.post(`${backendUrl}/api/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    imageUrls.push(response.data.imageUrl);
                }
            }
            setImages([...images, ...imageUrls]);
            toast.success('Images uploaded successfully!', {
                id: 'imageUpload'
            });
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload images', {
                id: 'imageUpload'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        if (!text) {
            toast.error('Please write a review');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${backendUrl}/api/reviews/add`,
                {
                    productId,
                    orderId,
                    rating,
                    text,
                    images
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setText('');
                setRating(0);
                setImages([]);
                setHasReviewed(true); // Set this to true to hide the form
                if (onReviewSubmitted) {
                    onReviewSubmitted(response.data.review);
                }
                toast.success('Review submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Error submitting review');
        }
        setLoading(false);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return !hasReviewed ? (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`w-8 h-8 ${
                                    (hoverRating || rating) >= star
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 
                        focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Write your review here..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (optional)
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0 file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 
                                    flex items-center justify-center text-xs hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    ) : null;
};

export default ReviewForm;