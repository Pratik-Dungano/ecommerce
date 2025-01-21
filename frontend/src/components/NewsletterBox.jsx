import React, { useState } from 'react';

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Validation: Check if the email field is empty
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        // If valid, clear the error and proceed
        setError('');
        console.log('Form submitted with email:', email);
        // Add your API call or further logic here
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Subscribe now & get 20% off
            </h2>
            <p className="text-gray-500 mb-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <form className="flex flex-col w-full max-w-md" onSubmit={onSubmitHandler}>
                <div className="flex w-full">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`flex-1 px-4 py-2 border ${
                            error ? 'border-red-500' : 'border-gray-300'
                        } rounded-l focus:outline-none focus:ring-2 ${
                            error ? 'focus:ring-red-500' : 'focus:ring-gray-600'
                        }`}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-black text-white font-medium rounded-r hover:bg-gray-800"
                    >
                        SUBSCRIBE
                    </button>
                </div>
                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};

export default NewsletterBox;
