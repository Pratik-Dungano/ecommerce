import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        setError('');
        console.log('Form submitted with email:', email);
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
                                className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition whitespace-nowrap"
                            >
                                Subscribe Now
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-4">
                                {error}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default NewsletterBox;