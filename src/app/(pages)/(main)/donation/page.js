'use client'
import { loadStripe } from '@stripe/stripe-js';
import { ButtonTheme } from "@/app/components/ui/common/buttonTheme";
import { api } from "@/app/services/strapiApiFetch";
import Image from "next/image";
import React, { Fragment, useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { getAssetPath } from "@/app/utils/assetPath";

export default function Donation() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [copiesData, setCopiesData] = useState(null);
    const [formData, setFormData] = useState({
        amount: '',
        frequency: '',
        customMonths: '',
        email: ''
    });

    const frequencyOptions = [
        { value: 'one-time', label: 'One time' },
        { value: '12-months', label: '12 Months' },
        { value: '24-months', label: '24 Months' },
        { value: 'monthly', label: 'Monthly donation' },
        { value: 'other', label: 'Other' }
    ];

    const handleAmountChange = (e) => {
        setFormData({ ...formData, amount: e.target.value });
    };

    const handleFrequencyChange = (e) => {
        setFormData({ ...formData, frequency: e.target.value, customMonths: '' });
    };

    const handleCustomMonthsChange = (e) => {
        setFormData({ ...formData, customMonths: e.target.value });
    };

    const handleEmailChange = (e) => {
        setFormData({ ...formData, email: e.target.value });
    };

    const handleNext = () => {
        if (currentStep === 1 && formData.amount) {
            setCurrentStep(2);
        } else if (currentStep === 2 && formData.frequency && (formData.frequency !== 'other' || formData.customMonths)) {
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        } else if (currentStep === 3) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async () => {
        // Validar datos
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!formData.frequency) {
            alert('Please select donation frequency');
            return;
        }

        if (formData.frequency === 'other' && (!formData.customMonths || formData.customMonths <= 0)) {
            alert('Enter a valid number of months');
            return;
        }

        if (!formData.email || !formData.email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        
        try {
            // 1. Determinar el tipo de pago (suscripción o único)
            const isSubscription = ['monthly', '12-months', '24-months', 'other'].includes(formData.frequency);

            // 2. Preparar datos para Stripe
            const donationData = {
                amount: parseFloat(formData.amount),
                frequency: formData.frequency,
                customMonths: formData.frequency === 'other' ? parseInt(formData.customMonths) : null,
                customer: { email: formData.email },
                metadata: {
                    purpose: 'Donation',
                    project: 'Chabad Boquete',
                    donationType: isSubscription ? 'subscription' : 'one-time',
                    description: getDonationDescription(formData.frequency, formData.customMonths)
                }
            };

            // 3. Llamar al endpoint correcto
            let endpoint, payload;
            
            if (isSubscription) {
                endpoint = '/api/create-subscription';
                payload = donationData;
            } else {
                // Para pagos únicos, usar el formato del endpoint checkout
                endpoint = '/api/checkout';
                payload = {
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            unit_amount: Math.round(donationData.amount * 100),
                            product_data: {
                                name: `Donación única - ${donationData.metadata.project}`,
                            },
                        },
                        quantity: 1,
                    }],
                    customer: donationData.customer,
                    metadata: donationData.metadata
                };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Error al procesar la donación');
            }

            const { id } = responseData;

            // 4. Redirigir a Stripe Checkout
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
            await stripe.redirectToCheckout({ sessionId: id });

        } catch (error) {
            console.error('Error:', error);
            alert(`Error al procesar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Función auxiliar para generar la descripción
    useEffect(() => {
        const fetchCopiesData = async () => {
            try {
                const copies = await api.copiesPages();
                setCopiesData(copies);
            } catch (err) {
                console.error('Error fetching copies data:', err);
            }
        };
        fetchCopiesData();
    }, []);

    const getDonationDescription = (frequency, customMonths) => {
        const frequencyMap = {
            'one-time': 'Donación única',
            '12-months': 'Donación por 12 meses',
            '24-months': 'Donación por 24 meses',
            'monthly': 'Donación mensual recurrente',
            'other': `Donación por ${customMonths} meses`
        };
        return frequencyMap[frequency] || 'Donación a Chabad Boquete';
    };

    return (

        <Fragment>
            <div className="w-full bg-blueBackground flex justify-center relative ">
                {/* Hero Section */}
                <div className="w-full max-w-6xl px-4 pt-12 pb-24 md:pt-24  md:pb-32">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Left Content */}
                        <div className="lg:w-[57%]">
                            <h1 className="text-3xl md:text-5xl font-bold text-myBlack mb-6">
                                {copiesData?.donations?.title || "Donation to Chabad House Panama City"}
                            </h1>

                            <p className="text-gray-text text-base mb-8">
                                {copiesData?.donations?.description || "Your gift keeps Chabad House Panama City's doors open to everyone—whether they're here for a Shabbat meal, a Torah class, or simply a friendly face. With your support we can:"}
                            </p>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-myBlack mb-4">
                                    Why donating to our charity?
                                </h2>

                                <ul className="space-y-4">
                                    {[
                                        "Host uplifting holiday celebrations and weekly services",
                                        "Offer free educational programs and community events",
                                        "Provide spiritual guidance and material assistance to those in need"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <FaCheck className="text-primary mt-1 flex-shrink-0" />
                                            <span className="text-gray-text">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Donation Form */}
                        <div className="lg:w-[43%]">
                            <div className="bg-white rounded-xl border border-gray-200 p-8">
                                <h2 className="text-3xl font-bold text-darkBlue mb-4">
                                    {currentStep === 1 ? 'Choose your donation' : currentStep === 2 ? 'Select frequency' : 'Your information'}
                                </h2>

                                <p className="text-gray-text mb-8">
                                    {currentStep === 1
                                        ? 'Help us light Shabbat candles, fund Torah classes and support our community.'
                                        : currentStep === 2
                                        ? 'Choose how often you would like to contribute.'
                                        : 'Enter your email to receive donation confirmation.'}
                                </p>

                                <div className="text-3xl font-bold text-darkBlue mb-6">
                                    {formData.amount ? `$${formData.amount} USD` : '$0.00 USD'}
                                </div>


                                {/* Step 1: Donation Amount */}
                                {currentStep === 1 && (
                                    <div className="mb-6">
                                        <label className="block text-gray-text mb-2">Amount (USD)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                placeholder="00.00"
                                                value={formData.amount}
                                                onChange={handleAmountChange}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                                min="1"
                                                step="0.01"
                                            />
                                            <span className="absolute right-4 top-4 text-gray-text">$</span>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Donation Frequency */}
                                {currentStep === 2 && (
                                    <div className="mb-6">
                                        <label className="block text-gray-text mb-2">Select duration</label>
                                        <select
                                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                            value={formData.frequency}
                                            onChange={handleFrequencyChange}
                                        >
                                            <option value="">Choose an option</option>
                                            {frequencyOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Custom months input */}
                                        {formData.frequency === 'other' && (
                                            <div className="mt-4">
                                                <label className="block text-gray-text mb-2">Number of months</label>
                                                <input
                                                    type="number"
                                                    placeholder="Enter number of months"
                                                    value={formData.customMonths}
                                                    onChange={handleCustomMonthsChange}
                                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                                    min="1"
                                                    max="60"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Email */}
                                {currentStep === 3 && (
                                    <div className="mb-6">
                                        <label className="block text-gray-text mb-2">Email address</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={formData.email}
                                            onChange={handleEmailChange}
                                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="space-y-3">
                                    {currentStep === 1 ? (
                                        <button
                                            onClick={handleNext}
                                            disabled={!formData.amount || parseFloat(formData.amount) <= 0}
                                            className="cursor-pointer w-full py-4 border-1 border-darkBlue rounded-lg text-darkBlue font-medium hover:bg-darkBlue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    ) : currentStep === 2 ? (
                                        <>
                                            <button
                                                onClick={handleNext}
                                                disabled={!formData.frequency || (formData.frequency === 'other' && !formData.customMonths)}
                                                className="cursor-pointer w-full py-4 border-1 border-darkBlue rounded-lg text-darkBlue font-medium hover:bg-darkBlue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                            <button
                                                onClick={handleBack}
                                                className="cursor-pointer w-full py-4 border-1 border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Back
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!formData.email || !formData.email.includes('@') || isLoading}
                                                className="cursor-pointer w-full py-4 bg-darkBlue rounded-lg text-white font-medium hover:bg-darkBlue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Complete Donation'
                                                )}
                                            </button>
                                            <button
                                                onClick={handleBack}
                                                className="cursor-pointer w-full py-4 border-1 border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Back
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}

                <div className="hidden lg:block absolute left-0 top-0  w-40 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/a.png")} alt="circle-image" fill className="object-contain" />
                </div>
                <div className="hidden lg:block absolute right-0 bottom-4 w-60 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/b.png")} alt="circle-image" fill className="object-contain" />
                </div>

                {/* Gradient Bottom */}
                <div className="h-48 bg-gradient-to-t from-blueBackground to-white"></div>
            </div>





            {/* About Donations Section */}
            {/* <div className="w-full max-w-4xl mx-auto ounded-xl border bg-white rounded-2xl border-gray-200 p-6 md:p-12 -translate-y-10">
                <div className="flex flex-col gap-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-darkBlue">
                        About Donations for Shabbat at Chabad Panama
                    </h2>

                    <div className="space-y-6 text-gray-text">
                        <p>
                            Every gift helps keep our home alive—from lighting Shabbat candles
                            to Torah classes and supporting those in need. Your generosity
                            creates a warm, meaningful space for our entire community.
                        </p>

                        <div className="space-y-4">
                            <p className="font-semibold">One-time gift:</p>
                            <p>Fuels special projects like a festive Shabbat dinner or holiday celebration.</p>

                            <p className="font-semibold">Monthly support:</p>
                            <p>Ensures our weekly services and free classes run without interruption.</p>

                            <p className="font-semibold">Event sponsorship:</p>
                            <p>Underwrite a lecture series, spiritual retreat, or kids' camp.</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-myBlack">
                                Is this the right way to give?
                            </h3>

                            <ul className="space-y-3 pl-5 list-disc">
                                <li>You want to make an immediate impact with a one-off contribution</li>
                                <li>You prefer to sustain our programs through a steady monthly pledge</li>
                                <li>You'd like to put your name (or your business) behind a specific event</li>
                                <li>You value full transparency and want to see exactly how your donation is used</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> */}
        </Fragment>


    );
};