import React, { useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';

const CardPaymentForm = ({ onSubmit, loading }) => {
  const { savedPaymentMethods } = usePayment();
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    method: 'card'
  });
  const [showSavedCards, setShowSavedCards] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cardDetails);
  };

  const handleSavedCardSelect = (card) => {
    setCardDetails({
      cardName: card.billing_details.name,
      cardNumber: `**** **** **** ${card.card.last4}`,
      cardExpiry: `${card.card.exp_month}/${card.card.exp_year.toString().slice(-2)}`,
      cardCvc: '***',
      savedCardId: card.id,
      method: 'card'
    });
    setShowSavedCards(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Saved Cards Section */}
      {savedPaymentMethods.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs uppercase font-medium text-gray-700">
              Saved Cards
            </label>
            <button
              type="button"
              onClick={() => setShowSavedCards(!showSavedCards)}
              className="text-sm text-green-600 hover:text-green-700"
            >
              {showSavedCards ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showSavedCards && (
            <div className="border border-gray-200 rounded-md mb-4">
              {savedPaymentMethods.map((card, index) => (
                <div 
                  key={index}
                  className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSavedCardSelect(card)}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {card.card.brand === 'visa' && (
                        <span className="text-blue-600 font-bold">VISA</span>
                      )}
                      {card.card.brand === 'mastercard' && (
                        <span className="text-red-600 font-bold">MC</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">•••• •••• •••• {card.card.last4}</div>
                      <div className="text-xs text-gray-500">
                        {card.billing_details.name} • Expires {card.card.exp_month}/{card.card.exp_year}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Card Details Form */}
      <div className="mb-4">
        <label className="block text-xs uppercase font-medium text-gray-700 mb-1">
          Card Holder Name
        </label>
        <input
          type="text"
          name="cardName"
          value={cardDetails.cardName}
          onChange={handleChange}
          placeholder="Jane Doe"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs uppercase font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <input
          type="text"
          name="cardNumber"
          value={cardDetails.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          required
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs uppercase font-medium text-gray-700 mb-1">
            Expiration Date
          </label>
          <input
            type="text"
            name="cardExpiry"
            value={cardDetails.cardExpiry}
            onChange={handleChange}
            placeholder="MM/YY"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs uppercase font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="password"
            name="cardCvc"
            value={cardDetails.cardCvc}
            onChange={handleChange}
            placeholder="•••"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Pay'
        )}
      </button>
    </form>
  );
};

export default CardPaymentForm;