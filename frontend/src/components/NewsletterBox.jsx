import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError('');
    
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            setIsSubmitting(false);
            return;
        }
    
        try {
            const response = await axios.post(
                `/mailchimp/3.0/lists/${import.meta.env.VITE_MAILCHIMP_AUDIENCE_ID}/members`,
                {
                    email_address: email,
                    status: "subscribed"
                },
                {
                    headers: {
                        Authorization: `apikey ${import.meta.env.VITE_MAILCHIMP_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if ([200, 201].includes(response.status)) {
                setSuccess(true);
                setEmail('');
                setTimeout(() => setSuccess(false), 5000);
            }
        } catch (err) {
            console.error('Mailchimp Error:', err);
            const errorMessage = err.response?.data?.title || 'Subscription failed';
            setError(
                errorMessage.includes("already subscribed") ? "Already subscribed" :
                errorMessage.includes("forgotten email") ? "Email was previously unsubscribed" :
                'Network error - please try again later'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 px-6 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-12 rounded-3xl">
                    <Mail className="w-16 h-16 mx-auto mb-6 text-purple-600" />
                    <h2 className="text-3xl font-bold mb-4">
                        Get 20% Off Your First Purchase
                    </h2>
                    <p className="text-gray-700 mb-8">
                        Subscribe to stay updated on new collections, traditional fashion tips, and exclusive offers.
                    </p>
                    <form onSubmit={onSubmitHandler} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`flex-1 px-6 py-4 rounded-full border focus:ring-2 focus:ring-purple-500 outline-none ${
                                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                }`}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-black text-white px-8 py-4 rounded-full transition whitespace-nowrap ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Subscribe Now'}
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-4">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p className="text-green-500 text-sm mt-4">
                                Thank you for subscribing! 🎉
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default NewsletterBox;