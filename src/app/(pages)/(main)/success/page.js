'use client'
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';
import { getAssetPath } from '@/app/utils/assetPath';
import { getInternalUrl, getApiUrl, getFullUrl } from '@/app/utils/urlHelper';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [countdown, setCountdown] = useState(5);
    const [processed, setProcessed] = useState(false);
    
    // Get session_id or order_id from URL parameters to confirm successful payment
    // Stripe uses session_id, PayArc uses order_id
    const sessionId = searchParams.get('session_id') || searchParams.get('order_id');
    const isFreeRegistration = searchParams.get('free') === 'true';

    // Clear cart and conditionally process payment based on environment
    useEffect(() => {
        // Free registration - just clear cart, no need to process via Stripe
        if (isFreeRegistration && !processed) {
            clearCart(true);
            setProcessed(true);
            console.log('✅ Cart cleared for free registration');
            return;
        }

        // Only clear cart if we have a session_id (indicates successful payment from Stripe)
        if (sessionId && !processed) {
            clearCart(true); // Pass true for silent clearing (no notification)
            setProcessed(true);
            console.log('✅ Cart cleared for session:', sessionId);

            // Always call process-success, it will decide based on USE_WEBHOOK_PROCESSING
            console.log('🔄 Processing payment in success page');
            processSuccessfulPayment(sessionId);
        }
    }, [sessionId, isFreeRegistration, processed]);
    
    // Function to handle post-payment actions when webhooks are disabled (development)
    const processSuccessfulPayment = async (sessionId) => {
        try {
            console.log('🔄 Calling process-success API for session:', sessionId);
            const response = await fetch(getApiUrl('/api/process-success'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error processing successful payment:', errorText || response.statusText);
            } else {
                const result = await response.json();
                console.log('✅ Payment processed successfully:', result.message);
                if (result.alreadyProcessed) {
                    console.log('ℹ️ Session was already processed');
                }
            }
        } catch (error) {
            console.error('❌ Network error processing payment success:', error);
        }
    };

    // Countdown timer and redirect
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Use window.location with full URL for redirect
                    window.location.href = getFullUrl('/');
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
                                href={getInternalUrl('/')}
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