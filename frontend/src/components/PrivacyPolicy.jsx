import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Main Title */}
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      
      <p className="mb-8 text-gray-600 leading-relaxed">
        This Privacy Policy outlines how <strong className="text-gray-800">Adaa Jaipur</strong> ("we," "us," or "our") collects, uses, and protects your personal information when you visit or make a purchase from our website (the "Site").
      </p>

      {/* Section 1 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">1. Contact Information</h2>
        <p className="text-gray-600 leading-relaxed">
          If you have any questions, require further information about our privacy practices, or wish to submit a complaint, please contact us via email at{' '}
          <a href="mailto:adaajaipur4@gmail.com" className="text-gray-700 underline hover:text-gray-900">
            adaajaipur4@gmail.com
          </a>.
        </p>
      </div>

      {/* Section 2 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">2. Collection of Personal Information</h2>
        
        <div className="mb-6">
          <p className="mb-3 font-semibold text-gray-700">A. Device Information</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-600">
            <li>Purpose: To ensure optimal website functionality and analyze site usage for improvements.</li>
            <li>Source: Automatically collected via cookies, log files, web beacons, tags, and pixels.</li>
            <li>Disclosure: Shared with our website processor, Shopify.</li>
            <li>Data Collected: Browser version, IP address, time zone, cookie data, site interactions, and search terms.</li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="mb-3 font-semibold text-gray-700">B. Order Information</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-600">
            <li>Purpose: To process and fulfill your orders and facilitate payments.</li>
            <li>Source: Directly collected from you during checkout.</li>
            <li>Disclosure: Shared with Shopify and relevant payment processors.</li>
            <li>Data Collected: Name, billing and shipping addresses, payment details (credit/debit card number, UPI address).</li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="mb-3 font-semibold text-gray-700">C. Customer Support Information</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-600">
            <li>Purpose: To assist you with inquiries and resolve issues.</li>
            <li>Source: Directly collected from you via our website.</li>
          </ul>
        </div>
      </div>

      {/* Section 3 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">3. Sharing of Personal Information</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-600">
          <li>With Shopify: To power our store. <a href="https://www.shopify.com/legal/privacy" className="text-gray-700 underline hover:text-gray-900">Shopify Privacy Policy</a>.</li>
          <li>For Legal Compliance: When required by law, regulation, or legal process.</li>
          <li>With Courier Partners: To facilitate product delivery (name, email, phone number, and shipping address).</li>
        </ul>
      </div>

      {/* Section 4 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">4. Behavioral Advertising</h2>
        <p className="mb-4 text-gray-600 leading-relaxed">
          We use your personal information to provide targeted advertising and marketing communications that may be of interest to you.
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-600">
          <li>Google Analytics: <a href="https://policies.google.com/privacy" className="text-gray-700 underline hover:text-gray-900">Google Privacy Policy</a> | <a href="https://tools.google.com/dlpage/gaoptout" className="text-gray-700 underline hover:text-gray-900">Opt-out</a></li>
          <li>Shopify Audiences: For advertising on third-party sites.</li>
          <li>General Opt-Out: <a href="https://optout.networkadvertising.org/" className="text-gray-700 underline hover:text-gray-900">Network Advertising Initiative (NAI)</a></li>
          <li>Facebook: <a href="https://www.facebook.com/adpreferences/" className="text-gray-700 underline hover:text-gray-900">Ad Preferences</a></li>
          <li>Google: <a href="https://adssettings.google.com/" className="text-gray-700 underline hover:text-gray-900">Ad Settings</a></li>
          <li>DAA: <a href="https://optout.aboutads.info/" className="text-gray-700 underline hover:text-gray-900">Digital Advertising Alliance</a></li>
        </ul>
      </div>

      {/* Section 5 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">5. Use of Personal Information</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-600">
          <li>Offer and manage our products and services.</li>
          <li>Process transactions and deliver orders.</li>
          <li>Communicate updates regarding products, promotions, and order status.</li>
        </ul>
      </div>

      {/* Section 6 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">6. Cookies & Tracking Technologies</h2>
        
        <div className="mb-4">
          <p className="mb-3 font-semibold text-gray-700">A. Types of Cookies We Use:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-600">
            <li>Essential Cookies</li>
            <li>Performance Cookies</li>
            <li>Advertising Cookies</li>
            <li>Social Media Cookies</li>
          </ul>
          <p className="mt-3 text-gray-600">
            For more details, visit <a href="https://www.allaboutcookies.org/" className="text-gray-700 underline hover:text-gray-900">All About Cookies</a>.
          </p>
        </div>

        <div className="mb-4">
          <p className="mb-3 font-semibold text-gray-700">B. Managing Cookies:</p>
          <p className="text-gray-600 leading-relaxed">
            You can modify your browser settings to block or remove cookies. Learn more:{' '}
            <a href="https://www.allaboutcookies.org/manage-cookies" className="text-gray-700 underline hover:text-gray-900">
              How to Control Cookies
            </a>.
          </p>
        </div>
      </div>

      {/* Section 7 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">7. Do Not Track (DNT) Policy</h2>
        <p className="text-gray-600 leading-relaxed">
          We do not alter our data collection or usage practices in response to "Do Not Track" signals.
        </p>
      </div>

      {/* Section 8 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">8. Policy Updates</h2>
        <p className="text-gray-600 leading-relaxed">
          We reserve the right to update this Privacy Policy periodically. Updates will be posted on this page.
        </p>
      </div>

      {/* Section 9 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">9. Complaints & Contact Information</h2>
        <p className="text-gray-600 leading-relaxed">
          If you wish to file a complaint or require further clarification, please contact us at:<br />
          📧 <a href="mailto:adaajaipur4@gmail.com" className="text-gray-700 underline hover:text-gray-900">adaajaipur4@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;