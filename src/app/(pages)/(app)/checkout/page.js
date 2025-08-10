'use client'
import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../../../context/CartContext";
import { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { getAssetPath } from "@/app/utils/assetPath";

export default function Checkout() {
    const { cartItems, total } = useCart();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nationality: '',
        phone: '',
        email: '',
        donation: '',
        coverFees: false,
        agreeTerms: false,
        agreeUpdates: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate transaction fee (5%)
    const calculateTransactionFee = (subtotal) => {
        return subtotal * 0.05;
    };

    // Calculate total with fees and donations
    const calculateGrandTotal = () => {
        const subtotal = total + parseFloat(formData.donation || 0);
        const transactionFee = formData.coverFees ? calculateTransactionFee(subtotal) : 0;
        return subtotal + transactionFee;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Campos requeridos para notificaciones completas
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
        if (!formData.agreeUpdates) newErrors.agreeUpdates = 'You must agree to receive updates';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // 1. Cargar Stripe.js
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

            // 2. Preparar datos para el pago
            const paymentData = {
                customer: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    metadata: {
                        nationality: formData.nationality
                    }
                },
                line_items: (cartItems || []).map(item => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.meal,
                            description: `${item.shabbatName} - ${item.productType}`
                        },
                        unit_amount: Math.round(item.totalPrice * 100 / item.quantity), // Precio unitario en centavos
                    },
                    quantity: item.quantity,
                })),
                donation: parseFloat(formData.donation || 0),
                metadata: {
                    orderType: cartItems.every(item => item.productType === 'shabbatBox') ? 'shabbatBox' : 'reservation',
                    agreeTerms: formData.agreeTerms,
                    agreeUpdates: formData.agreeUpdates,
                    // Agregar datos del primer item del carrito para información del evento
                    ...(cartItems && cartItems.length > 0 && {
                        eventName: cartItems[0].shabbatName,
                        eventDate: cartItems[0].shabbatDate,
                        productType: cartItems[0].productType,
                        // Determinar tipo de evento basado en productType
                        eventType: cartItems[0].productType === 'shabbatBox' 
                            ? 'Shabbat Box Delivery' 
                            : cartItems[0].productType === 'mealReservation'
                                ? (cartItems[0].shabbatName ? `${cartItems[0].shabbatName}` : 'Meal Reservation')
                                : 'Event'
                    })
                }
            };

            // 3. Si hay donación, agregarla como ítem adicional
            if (paymentData.donation > 0) {
                paymentData.line_items.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Donación',
                            description: 'Contribución a Chabad Boquete'
                        },
                        unit_amount: Math.round(paymentData.donation * 100),
                    },
                    quantity: 1,
                });
            }

            // 4. Si el usuario eligió cubrir los fees, agregarlos como ítem adicional
            if (formData.coverFees) {
                const subtotal = total + parseFloat(formData.donation || 0);
                const transactionFee = calculateTransactionFee(subtotal);
                paymentData.line_items.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Transaction Fee',
                            description: 'Processing fee to help cover payment costs (5%)'
                        },
                        unit_amount: Math.round(transactionFee * 100),
                    },
                    quantity: 1,
                });
            }

            // 4. Crear sesión de pago con Stripe
            console.log('BASE_PATH:', process.env.NEXT_PUBLIC_BASE_PATH);
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/checkout/`;
            console.log('API URL:', apiUrl);
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                let errorMessage = 'Network error occurred';
                try {
                    // Intentar obtener el mensaje de error del JSON
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                    // Si no es JSON válido, usar el status de la respuesta
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            let responseData;
            try {
                responseData = await response.json();
            } catch (parseError) {
                throw new Error('Invalid response format from server');
            }

            if (!responseData.id) {
                throw new Error('No session ID received from payment processor');
            }

            const { id } = responseData;

            // 5. Redirigir a Stripe Checkout
            const { error } = await stripe.redirectToCheckout({ sessionId: id });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('Payment Error:', error);
            alert(`Payment failed: ${error.message}`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex justify-center bg-white relative">

            <div className="w-full h-[250px] xs:h-[300px] sm:h-[400px] md:h-[700px] lg:h-[700px] bg-blueBackground absolute top-0 left-0" >


                {/* Decorative background elements */}

                <div className="hidden lg:block absolute left-0 top-0  w-40 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/a.png")} alt="circle-image" fill className="object-contain" />
                </div>
                <div className="hidden lg:block absolute right-0 bottom-16 w-60 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/b.png")} alt="circle-image" fill className="object-contain" />
                </div>

            </div>



            <div className="z-10 w-full">

                <div className="text-center pt-6 xs:pt-8 sm:pt-12 md:pt-16 lg:pt-20 flex flex-col items-center gap-2 xs:gap-3 sm:gap-4 px-6 xs:px-6">
                    <h2 className="text-3xl xs:text-3xl sm:text-3xl md:text-4xl font-bold">Checkout</h2>
                    <p className="text-gray-text text-xs xs:text-sm sm:text-base w-full max-w-xs xs:max-w-sm sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] leading-relaxed" >Enter your payment method below to reserve your spot. We accept major credit cards.</p>
                </div>
                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 xs:gap-6 sm:gap-8 md:gap-10 pt-6 xs:pt-8 sm:pt-10 md:pt-12 lg:pt-14 px-6 xs:px-6 pb-6 xs:pb-8 sm:pb-16 md:pb-20 lg:pb-28">

                    {/* Order Summary Section */}
                    <div className="w-full lg:w-[40%] order-2 lg:order-1">
                        <div className="bg-white rounded-lg xs:rounded-xl border border-gray-200 overflow-hidden p-3 xs:p-4 sm:p-6">
                            <div className="flex flex-col">
                                {/* Header */}
                                <div className="flex items-center gap-2 xs:gap-4 mb-4 xs:mb-6 sm:mb-8">
                                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-darkBlue">
                                        Final order review
                                    </h3>
                                </div>

                                {/* Order Details */}
                                <div className="flex flex-col justify-between">
                                    <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                                        {(cartItems || []).length > 0 ? (
                                            (cartItems || []).map((item, index) => (
                                                <div key={index} className="flex justify-between items-start p-2 xs:p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                                                        <span className="text-gray-text font-medium truncate text-xs xs:text-sm sm:text-base">{item.meal}</span>
                                                        <span className="text-gray-400 text-xs truncate">{item.priceType} × {item.quantity}</span>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            <div className="truncate">
                                                                <span className="font-medium">{item.shabbatName}</span>
                                                                {item.shabbatDate && <span className="hidden xs:inline"> - {item.shabbatDate}</span>}
                                                            </div>
                                                            {item.productType && (
                                                                <div className="mt-1">
                                                                    <span className="inline-block px-1.5 xs:px-2 py-0.5 xs:py-1 bg-primary/10 text-primary rounded text-xs">
                                                                        {item.productType === 'shabbatBox' ? 'Shabbat Box' : 'Meal'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-text font-medium flex-shrink-0 text-xs xs:text-sm sm:text-base">${item.totalPrice.toFixed(2)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-4 xs:py-6 sm:py-8 text-sm">
                                                No items in cart
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider and Total */}
                                    <div>
                                        <div className="border-t border-gray-200 my-3 xs:my-4"></div>
                                        
                                        {/* Subtotal */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 text-sm xs:text-base">Subtotal:</span>
                                            <span className="text-gray-600 text-sm xs:text-base">${total.toFixed(2)}</span>
                                        </div>

                                        {/* Donation if present */}
                                        {parseFloat(formData.donation || 0) > 0 && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 text-sm xs:text-base">Donation:</span>
                                                <span className="text-gray-600 text-sm xs:text-base">${parseFloat(formData.donation).toFixed(2)}</span>
                                            </div>
                                        )}

                                        {/* Transaction Fee if selected */}
                                        {formData.coverFees && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 text-sm xs:text-base">Transaction Fee (5%):</span>
                                                <span className="text-gray-600 text-sm xs:text-base">${calculateTransactionFee(total + parseFloat(formData.donation || 0)).toFixed(2)}</span>
                                            </div>
                                        )}

                                        {/* Final Total */}
                                        <div className="border-t border-gray-200 pt-2 mt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-darkBlue font-medium text-sm xs:text-base sm:text-lg">Total:</span>
                                                <span className="text-darkBlue font-medium text-sm xs:text-base sm:text-lg">${calculateGrandTotal().toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form Section */}
                    <div className="w-full lg:w-[60%] bg-white rounded-lg xs:rounded-xl border border-gray-200 p-3 xs:p-4 sm:p-6 md:p-8 order-1 lg:order-2">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 xs:space-y-6 sm:space-y-8"
                            aria-label="Checkout form"
                            noValidate
                        >
                            {/* Personal Information Section */}
                            <fieldset>
                                <legend className="text-base xs:text-lg sm:text-xl font-bold text-darkBlue mb-3 xs:mb-4 sm:mb-6">Personal Information</legend>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 md:gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Matt"
                                            className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Cannon"
                                            className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                    </div>

                                    {/* Nationality */}
                                    <div>
                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Nationality *</label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Israeli"
                                            className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.nationality ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="(123) 456-7890"
                                            className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </fieldset>

                            {/* Contact Information Section */}
                            <fieldset>
                                <legend className="text-base xs:text-lg sm:text-xl font-bold text-darkBlue mb-3 xs:mb-4 sm:mb-6">Contact Information</legend>

                                <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="example@email.com"
                                            className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Donation Information */}
                                    <div className="pt-3 xs:pt-4 sm:pt-6 border-t border-gray-200">
                                        <div className="mb-3 xs:mb-4">
                                            <p className="text-xs leading-relaxed text-gray-500">
                                                Please be advised that Chabad of Panama is not funded by Chabad
                                                headquarters in New York. We are responsible for all funds. We are
                                                supported exclusively by the generous contributions of individuals
                                                and foundations that care about our action. All funds go directly
                                                into programs and services for the center and visitors.
                                            </p>
                                        </div>

                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Your Donation (Optional)</label>
                                        <input
                                            type="number"
                                            name="donation"
                                            value={formData.donation}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />

                                        {/* Transaction Fee Checkbox */}
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="coverFees"
                                                    checked={formData.coverFees}
                                                    onChange={handleInputChange}
                                                    className="w-4 xs:w-5 h-4 xs:h-5 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer flex-shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-gray-text text-xs xs:text-sm font-medium">
                                                        Help us avoid credit card fees? 
                                                        {(total + parseFloat(formData.donation || 0)) > 0 && (
                                                            <span className="text-primary font-semibold">
                                                                {" "}(+${calculateTransactionFee(total + parseFloat(formData.donation || 0)).toFixed(2)})
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        Add 5% to cover processing fees so 100% of your payment goes to Chabad
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            {/* Terms and Conditions */}
                            <fieldset>
                                <legend className="sr-only">Terms and Conditions</legend>
                                <div className="space-y-2.5 xs:space-y-3 sm:space-y-4">
                                    {/* Terms Checkbox */}
                                    <div className="flex items-start gap-2.5 xs:gap-3">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleInputChange}
                                            className="w-4 xs:w-5 h-4 xs:h-5 mt-0.5 xs:mt-1 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <p className="text-gray-text text-xs leading-relaxed">
                                                I have read and agreed to the terms of the regulations
                                                <span className="text-primary"> *</span>
                                                <a href="#" className="text-primary underline ml-1">Terms and Conditions</a>
                                            </p>
                                            {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
                                        </div>
                                    </div>

                                    {/* Newsletter Checkbox */}
                                    <div className="flex items-start gap-2.5 xs:gap-3">
                                        <input
                                            type="checkbox"
                                            name="agreeUpdates"
                                            checked={formData.agreeUpdates}
                                            onChange={handleInputChange}
                                            className="w-4 xs:w-5 h-4 xs:h-5 mt-0.5 xs:mt-1 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <p className="text-gray-text text-xs leading-relaxed">
                                                I consent to receive future updates regarding my order *
                                            </p>
                                            {errors.agreeUpdates && <p className="text-red-500 text-xs mt-1">{errors.agreeUpdates}</p>}
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            {/* Payment Button */}
                            <div className="space-y-2.5 xs:space-y-3 sm:space-y-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || (cartItems || []).length === 0}
                                    className={`w-full font-bold py-3 xs:py-3.5 sm:py-4 rounded-lg transition touch-manipulation text-sm xs:text-base ${isSubmitting || (cartItems || []).length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-opacity-90 cursor-pointer active:bg-opacity-80'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 xs:h-5 w-4 xs:w-5 border-2 xs:border-4 border-gray-300 border-t-current mr-2"></div>
                                            <span className="text-sm xs:text-base">Processing...</span>
                                        </div>
                                    ) : (
                                        `Pay now - $${calculateGrandTotal().toFixed(2)}`
                                    )}
                                </button>
                                <p className="text-gray-text text-xs text-center leading-relaxed px-2">
                                    *The registration will not be completed without completing the payment
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>

    );
}