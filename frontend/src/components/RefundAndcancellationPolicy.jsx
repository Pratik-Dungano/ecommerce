import React from 'react';

const RefundAndCancellation = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <p className="mb-4">
        By placing an order with us, you acknowledge and agree to our terms and conditions. Once an order has been confirmed, cancellations, exchanges, or returns are not permitted.
      </p>

      <p className="mb-4">
        However, if alterations are required for a purchased product, our team will be happy to assist you.
      </p>

      <p className="mb-4">
        We take great care in packaging our products to ensure they reach you in perfect condition. Each item undergoes rigorous quality checks before dispatch.
      </p>

      <p className="mb-4">
        In the rare event that a product sustains genuine damage or defects during transit, we offer a replacement under the following conditions:
      </p>

      <ul className="list-disc pl-6 mb-4">
        <li>A clear, uncut unpacking video must be provided within <strong>24 hours</strong> of receiving the package. The video must show the sealed packet with a visible printed shipment label.</li>
        <li>The product must be returned in its original condition, including all tags and packaging, and must be unworn and unused.</li>
      </ul>

      <p className="mb-4">
        Upon receiving the returned product, our team will conduct a quality inspection. If the claim is validated, we will proceed with either a replacement or a refund. Please note that the store reserves the right to decline a return if the product is found to be used or worn upon arrival.
      </p>

      <p className="mb-4">
        The entire process of replacement or refund may take <strong>12-15 days</strong>. We appreciate your patience and cooperation during this period.
      </p>
    </div>
  );
};

export default RefundAndCancellation;
