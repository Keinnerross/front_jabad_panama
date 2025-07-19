'use client'
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';
import { getAssetPath } from '@/app/utils/assetPath';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [countdown, setCountdown] = useState(5);
    
    // Get session_id from URL parameters to confirm successful payment
    const sessionId = searchParams.get('session_id');

    // Clear cart on successful payment
    useEffect(() => {
        // Only clear cart if we have a session_id (indicates successful payment from Stripe)
        if (sessionId) {
            clearCart(true); // Pass true for silent clearing (no notification)
        }
    }, [sessionId]); // Remove clearCart from dependencies to avoid infinite loop

    // Countdown timer and redirect
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Use window.location for redirect to avoid router issues
                    window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-[70vh] bg-blueBackground relative">
            {/* Decorative Elements */}
            <div className="hidden lg:block absolute left-0 top-0 w-40 h-72">
                <Image src={getAssetPath("/assets/global/circles/a.png")} alt="circle-image" fill className="object-contain" />
            </div>
            <div className="hidden lg:block absolute right-0 bottom-4 w-60 h-72">
                <Image src={getAssetPath("/assets/global/circles/b.png")} alt="circle-image" fill className="object-contain" />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-[70vh] px-4 py-12">
                <div className="max-w-lg mx-auto">
                    {/* Success Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheck className="text-green-600 text-3xl" />
                        </div>

                        {/* Success Message */}
                        <h1 className="text-3xl md:text-4xl font-bold text-darkBlue mb-4">
                            Thank you!
                        </h1>
                        
                        <p className="text-lg text-gray-600 mb-8">
                            Please check your email for confirmation details.
                        </p>

                        {/* Countdown */}
                        <div className="text-center mb-8">
                            <p className="text-gray-600 mb-4">
                                Redirecting to home in <span className="font-bold text-darkBlue">{countdown}</span> seconds...
                            </p>
                            
                            <Link 
                                href="/" 
                                className="bg-darkBlue text-white px-8 py-3 rounded-lg font-medium hover:bg-darkBlue/90 transition-colors inline-block"
                            >
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[70vh] bg-blueBackground flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheck className="text-green-600 text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-darkBlue">Loading...</h1>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}