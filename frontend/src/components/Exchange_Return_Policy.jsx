import React from 'react';

const ExchangeReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Main Title */}
      <h1 className="text-4xl font-bold mb-12 text-gray-900 text-center">Exchange & Return Policy</h1>
      
      {/* Exchange Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-gray-700 uppercase tracking-wide">EXCHANGE</h2>
        
        <p className="mb-4 text-gray-600 leading-relaxed">
          We send all our products with love and precision, yet if you happen to receive the wrong size then you can send us an exchange request at{' '}
          <a href="mailto:adaajaipur4india@gmail.com" className="text-gray-700 underline hover:text-gray-900">
            adaajaipur4india@gmail.com
          </a>
          . An executive will respond to your request within working hours.
        </p>
        
        <p className="mb-4 text-gray-600 leading-relaxed">
          Customers need to self-ship the product to us. Exchange pieces in the correct size will be made as soon as possible. You will receive the shipping information on your registered mail id once it is dispatched.
        </p>
        
        <p className="mb-4 text-gray-600 font-medium">Please make sure that when the product is being exchanged:</p>
        
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>Exchange will only be done for sizing issues or defective items.</li>
          <li>Exchange request shall be raised within 24 hours of delivery. After that, we will not be able to entertain any requests.</li>
          <li>Customers need to self-ship the product to us within 3 days after the delivery.</li>
          <li>Exchange will be done only once for one piece.</li>
          <li>All product tags should be intact and in their original packing with an invoice.</li>
          <li>Product must be in an unused, unwashed, and undamaged condition.</li>
          <li>A confirmation email will be sent to you once the shipment is received at our warehouse and checked for quality.</li>
          <li>In case, the product fails our quality inspection, the product will be shipped back to you.</li>
          <li>We do not have a reverse pickup facility for now. Please do not forget to take an acknowledgment receipt from the courier person about the number of products you are dispatching with his signature and cell phone number. We will not be responsible for any lost shipment.</li>
        </ul>
        
        <p className="mb-6 text-gray-600 leading-relaxed">
          You have to send the package back to:<br />
          <strong className="text-gray-800 font-semibold">ADAA JAIPUR: H-5, RIICO MANSAROVAR INDUSTRIAL AREA, JAIPUR – 302020.</strong>
        </p>
      </div>

      {/* Return Section */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-700 uppercase tracking-wide">RETURN</h2>
        
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>Do not return any product(s) before receiving a confirmation email from us for the same.</li>
          <li>
            In case you wish to return a product, write us at{' '}
            <a href="mailto:adaajaipur4india@gmail.com" className="text-gray-700 underline hover:text-gray-900">
              adaajaipur4india@gmail.com
            </a>
            {' '}within 24 hours of receiving the product.
          </li>
          <li>All shipping costs of returning the product to be paid by customers.</li>
          <li>No refund will be given by us if the order has been delivered with the color and size as selected by the customer while placing the order.</li>
        </ul>
      </div>
    </div>
  );
};

export default ExchangeReturnPolicy;