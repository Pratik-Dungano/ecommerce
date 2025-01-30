import React, { useState } from 'react';

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
        <div className="flex flex-col mx-4 sm:mx-10 items-center justify-center py-12 bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center px-4">
                Subscribe now & get 20% off
            </h2>
            <p className="text-gray-500 mb-4 text-center px-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <form className="flex flex-col w-full px-4 sm:px-6 md:px-10 max-w-md mx-auto" onSubmit={onSubmitHandler}>
                <div className="flex flex-col sm:flex-row w-full gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full sm:flex-1 px-4 py-2 border ${
                            error ? 'border-red-500' : 'border-gray-300'
                        } rounded-t-md sm:rounded-l-md sm:rounded-tr-none focus:outline-none focus:ring-2 ${
                            error ? 'focus:ring-red-500' : 'focus:ring-gray-600'
                        } text-sm sm:text-base`}
                    />
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-black text-white font-medium rounded-b-md sm:rounded-r-md sm:rounded-bl-none hover:bg-gray-800 text-sm sm:text-base"
                    >
                        SUBSCRIBE
                    </button>
                </div>
                {error && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 text-center">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};

export default NewsletterBox;