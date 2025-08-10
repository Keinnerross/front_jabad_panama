'use client';

import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';

export const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Thank you! You\'ve been subscribed to our newsletter.');
        setIsSuccess(true);
        setEmail(''); // Limpiar el campo
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage('Connection error. Please try again later.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-darkBlue rounded-xl p-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-4 max-w-md">
          <div className="bg-primary p-3 rounded-lg">
            <FiMail className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-2">
              Stay Connected with
            </h3>
            <p className="text-blue-100">
              Get updates about Shabbat meals, upcoming holidays, and
              community events while you're visiting.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <FiMail className="absolute right-3 top-3.5 text-gray-400" />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing...' : 'Keep Me Posted'}
          </button>
        </form>
      </div>
      
      {/* Mensaje de estado */}
      {message && (
        <div className={`mt-4 text-center p-3 rounded-lg ${
          isSuccess 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};