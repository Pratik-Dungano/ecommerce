import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      <p className="mb-4">
        We ensure reliable and efficient shipping services through our registered and trusted courier partners for all orders within India.
      </p>

      <p className="mb-4 font-semibold">Please note:</p>
      <p className="mb-4">
        Saturdays, Sundays, and public holidays are not considered working days for standard deliveries.
      </p>

      <h2 className="text-xl font-semibold mb-2">Domestic Shipping</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>We offer free shipping for all domestic orders.</li>
        <li>Estimated delivery time is 3–10 days from dispatch.</li>
        <li>Orders are processed and shipped from our warehouse in Jaipur.</li>
        <li>Deliveries are made to the shipping address provided at checkout.</li>
      </ul>

      <p className="mb-6">
        For any shipping-related inquiries, feel free to contact our support team at <a href="mailto:adaajaipur4@gmail.com" className="text-blue-600 underline">adaajaipur4@gmail.com</a>.
      </p>
    </div>
  );
};

export default ShippingPolicy;
