'use client'
import Image from "next/image";
import { useCart } from "../../../context/CartContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from '@stripe/stripe-js';
import { getAssetPath } from "@/app/utils/assetPath";
import { getFullUrl } from "@/app/utils/urlHelper";
import { api } from "@/app/services/strapiApiFetch";

export default function Checkout() {
    const { cartItems, total } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [checkoutSettings, setCheckoutSettings] = useState(null);
    const [platformSettings, setPlatformSettings] = useState(null);

    // Detect if all cart items are free (PWYW with $0)
    const isFreeRegistration = mounted && total === 0 && cartItems?.length > 0 && cartItems.some(item => item.isPWYW);

    // Fetch checkout and platform settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [checkoutData, platformData] = await Promise.all([
                    api.checkoutSetting(),
                    api.platformSettings()
                ]);
                setCheckoutSettings(checkoutData);
                setPlatformSettings(platformData);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (judaismDropdownRef.current && !judaismDropdownRef.current.contains(e.target)) {
                setJudaismDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if korea_inputs is enabled
    const koreaInputsEnabled = checkoutSettings?.korea_inputs === true;
    const nationalityEnabled = checkoutSettings?.nacionality === true;
    const hasDeliveryItem = mounted && cartItems?.some(item => item.deliveryType === 'delivery');

    // Get country name from platform settings for dynamic labels
    const countryName = platformSettings?.pais || 'the country';

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nationality: '',
        phone: '',
        email: '',
        donation: '',
        coverFees: true,
        agreeTerms: false,
        agreeUpdates: false,
        // Korea fields
        koreaConnection: '',
        koreaConnectionOther: '',
        judaismConnection: [],
        sponsorship: '',
        sponsorshipOther: '',
        localPhone: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const [judaismDropdownOpen, setJudaismDropdownOpen] = useState(false);
    const judaismDropdownRef = useRef(null);

    // Toggle item expansion for showing order details
    const toggleItemExpand = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Sponsorship options with amounts
    const sponsorshipOptions = [
        { value: '26', label: 'Sponsor My Meal for a Student/Backpacker', amount: 26 },
        { value: '54', label: 'Sponsor My Shabbat Meal', amount: 54 },
        { value: '72', label: 'Sponsor My Shabbat Dinner and Lunch Meals', amount: 72 },
        { value: '108', label: 'Sponsor a Student', amount: 108 },
        { value: '180', label: 'Sponsor 2 Students', amount: 180 },
        { value: '360', label: 'Co-Sponsor Shabbat Lunch', amount: 360 },
        { value: '540', label: 'Co-Sponsor Shabbat Dinner', amount: 540 },
        { value: '720', label: 'Co-Sponsor Shabbat @ Chabad', amount: 720 },
        { value: '1800', label: 'Sponsor Shabbat @ Chabad', amount: 1800 },
        { value: 'other', label: 'Other', amount: 0 }
    ];

    // Get sponsorship amount
    const getSponsorshipAmount = () => {
        if (!formData.sponsorship) return 0;
        if (formData.sponsorship === 'other') {
            return parseFloat(formData.sponsorshipOther || 0);
        }
        const option = sponsorshipOptions.find(opt => opt.value === formData.sponsorship);
        return option ? option.amount : 0;
    };

    // Calculate transaction fee (5%)
    const calculateTransactionFee = (subtotal) => {
        return subtotal * 0.05;
    };

    // Calculate total with fees, donations and sponsorship
    const calculateGrandTotal = () => {
        const sponsorshipAmount = getSponsorshipAmount();
        const subtotal = total + parseFloat(formData.donation || 0) + sponsorshipAmount;
        const transactionFee = formData.coverFees ? calculateTransactionFee(subtotal) : 0;
        return subtotal + transactionFee;
    };

    // Judaism connection options for multiselect
    const judaismOptions = [
        { value: 'father_jewish', label: 'My father is Jewish' },
        { value: 'mother_jewish', label: 'My mother is Jewish' },
        { value: 'mother_converted_reform', label: 'My mother converted Reform' },
        { value: 'mother_converted_conservative', label: 'My mother converted Conservative' },
        { value: 'mother_converted_orthodox', label: 'My mother converted Orthodox' },
        { value: 'i_converted', label: 'I converted (specify details in note)' },
        { value: 'not_jewish', label: 'I am not Jewish' },
    ];

    // Handle judaism connection checkbox toggle
    const handleJudaismToggle = (value) => {
        setFormData(prev => {
            const current = prev.judaismConnection;
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, judaismConnection: updated };
        });
        if (errors.judaismConnection) {
            setErrors(prev => ({ ...prev, judaismConnection: '' }));
        }
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
        if (nationalityEnabled && !koreaInputsEnabled && !formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
        if (!koreaInputsEnabled && !formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
        if (!formData.agreeUpdates) newErrors.agreeUpdates = 'You must agree to receive updates';

        // Korea fields validation (only when korea_inputs is enabled)
        if (koreaInputsEnabled) {
            if (!formData.koreaConnection) {
                newErrors.koreaConnection = 'Please select your connection to Korea';
            } else if (formData.koreaConnection === 'other' && !formData.koreaConnectionOther.trim()) {
                newErrors.koreaConnectionOther = 'Please specify your connection to Korea';
            }
            if (!formData.judaismConnection || formData.judaismConnection.length === 0) {
                newErrors.judaismConnection = 'Please select your connection to Judaism';
            }
            if (hasDeliveryItem && !formData.localPhone.trim()) {
                newErrors.localPhone = `Local phone number in ${countryName} is required`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Detectar tipo de orden para metadata - SÚPER SIMPLE
            const firstItem = cartItems[0] || {};
            const orderType = firstItem.productType || 'mealReservation';
            
            // TRES TIPOS ÚNICOS - Verificar también el flag isCustomEvent
            const isCustomEvent = orderType === 'customEvent' || firstItem.isCustomEvent === true;  // Custom Events (verificar flag también)
            const isShabbatBox = orderType === 'shabbatBox';         // Shabbat Box  
            const isTraditionalShabbat = orderType === 'mealReservation' && !firstItem.isCustomEvent; // Shabbat/Holiday tradicional (solo si NO es custom event)
            
            // Logs para debugging de detección de tipo de orden
            console.log('🛒 Checkout order detection (SIMPLIFIED):', {
                firstItem_productType: firstItem.productType,
                firstItem_isCustomEvent: firstItem.isCustomEvent,
                firstItem_shabbatName: firstItem.shabbatName,
                firstItem_eventName: firstItem.shabbatName, // DEBUG: Verificar nombre del evento
                DETECTION_RESULTS: {
                    isCustomEvent: isCustomEvent,        // → orders
                    isShabbatBox: isShabbatBox,          // → orders  
                    isTraditionalShabbat: isTraditionalShabbat  // → shabbat-orders
                },
                cartItemsCount: cartItems.length,
                eventNameToSend: isCustomEvent ? firstItem.shabbatName : 'N/A' // DEBUG: Ver qué se enviará
            });

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
                line_items: (cartItems || []).map(item => {
                    // Calcular precio unitario de forma segura
                    let unitAmount = 0;
                    if (item.quantity && item.quantity > 0) {
                        unitAmount = Math.round((item.totalPrice / item.quantity) * 100);
                    } else if (item.unitPrice) {
                        unitAmount = Math.round(item.unitPrice * 100);
                    }
                    
                    // Log para debug
                    console.log('Line item:', {
                        name: item.meal,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                        unitPrice: item.unitPrice,
                        calculatedUnitAmount: unitAmount
                    });
                    
                    // Validar que tenemos valores válidos (allow $0 for PWYW items)
                    if ((!unitAmount && unitAmount !== 0) || unitAmount < 0 || !item.quantity || item.quantity <= 0) {
                        console.error('Invalid item values:', item);
                        alert(`Error: Invalid price or quantity for ${item.meal}`);
                        throw new Error(`Invalid values for ${item.meal}`);
                    }
                    if (unitAmount === 0 && !item.isPWYW) {
                        console.error('Zero amount for non-PWYW item:', item);
                        alert(`Error: Invalid price for ${item.meal}`);
                        throw new Error(`Invalid values for ${item.meal}`);
                    }
                    
                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                // Incluir el tipo de precio en el nombre para no perderlo
                                name: `${item.meal || 'Item'} - ${item.priceType || ''}`.trim(),
                                description: `${item.shabbatName || ''} - ${item.productType || ''}`
                            },
                            unit_amount: unitAmount
                        },
                        quantity: parseInt(item.quantity)
                    };
                }),
                donation: parseFloat(formData.donation || 0),
                metadata: {
                    orderType: isCustomEvent ? 'customEvent' : orderType,  // Asegurar que sea 'customEvent' si es un custom event
                    isCustomEvent: isCustomEvent,  // Siempre incluir el flag explícitamente
                    agreeTerms: formData.agreeTerms,
                    agreeUpdates: formData.agreeUpdates,
                    // Si es Shabbat/Holiday tradicional, preparar datos resumidos
                    ...(isTraditionalShabbat && {
                        // Crear un resumen compacto para no exceder 500 chars
                        shabbat_name: cartItems[0].shabbatName?.substring(0, 50),
                        friday_dinner_count: cartItems.filter(item => 
                            item.meal.toLowerCase().includes('friday') || 
                            item.meal.toLowerCase().includes('dinner')
                        ).reduce((sum, item) => sum + item.quantity, 0).toString(),
                        shabbat_lunch_count: cartItems.filter(item => 
                            item.meal.toLowerCase().includes('lunch')
                        ).reduce((sum, item) => sum + item.quantity, 0).toString(),
                        total_guests: cartItems.reduce((sum, item) => sum + item.quantity, 0).toString()
                    }),
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
                    }),
                    // Agregar datos específicos de Shabbat Box
                    ...(isShabbatBox && cartItems && cartItems.length > 0 && {
                        deliveryType: cartItems[0].deliveryType,
                        deliveryAddress: cartItems[0].deliveryAddress?.substring(0, 200), // Limitar a 200 chars
                        shabbatHolidayStart: cartItems[0].shabbatHolidayStart,
                        shabbatHolidayEnd: cartItems[0].shabbatHolidayEnd,
                        shabbat_name: cartItems[0].shabbatName?.substring(0, 50)
                    }),
                    // Agregar datos para Custom Events (delivery o reservation)
                    ...(isCustomEvent && cartItems && cartItems.length > 0 && {
                        isCustomEvent: true, // Marcador específico para Custom Events
                        deliveryType: cartItems[0].deliveryType || 'pickup',
                        deliveryAddress: cartItems[0].deliveryAddress?.substring(0, 200), // Limitar a 200 chars
                        deliveryFee: cartItems[0].deliveryFee?.toString() || '0', // Delivery fee como string
                        deliveryZone: cartItems[0].deliveryZone ? JSON.stringify({
                            id: cartItems[0].deliveryZone.id,
                            zone_name: cartItems[0].deliveryZone.zone_name
                        }) : null, // Delivery zone info
                        customEventType: cartItems[0].eventType || 'reservation',
                        eventName: cartItems[0].shabbatName?.substring(0, 50),
                        eventDate: cartItems[0].shabbatDate,
                        // Nuevos campos para delivery
                        eventTime: cartItems[0].eventTime || null,  // Hora solicitada: "HH:MM" o "ASAP"
                        reservationName: cartItems[0].reservationName?.substring(0, 100) || null  // Nombre para la reservación
                    }),
                    // Korea fields (only if korea_inputs is enabled)
                    ...(koreaInputsEnabled && {
                        koreaConnection: formData.koreaConnection,
                        koreaConnectionOther: formData.koreaConnectionOther || '',
                        judaismConnection: Array.isArray(formData.judaismConnection) ? formData.judaismConnection.join(', ') : formData.judaismConnection,
                        sponsorship: formData.sponsorship || '',
                        sponsorshipAmount: getSponsorshipAmount().toString(),
                        localPhone: formData.localPhone || ''
                    })
                }
            };
            
            // Logs para debugging de metadata que se envía a Stripe
            console.log('🛒 Checkout metadata being sent to Stripe (SIMPLIFIED):', {
                orderType: paymentData.metadata.orderType,
                isCustomEvent_inMetadata: paymentData.metadata.isCustomEvent,
                eventName: firstItem.shabbatName,
                FINAL_ROUTING: {
                    willGoTo_orders_customEvent: isCustomEvent,
                    willGoTo_orders_shabbatBox: isShabbatBox,
                    willGoTo_shabbatOrders_traditional: isTraditionalShabbat
                },
                customEventFields: isCustomEvent ? {
                    deliveryType: paymentData.metadata.deliveryType,
                    deliveryAddress: paymentData.metadata.deliveryAddress,
                    customEventType: paymentData.metadata.customEventType,
                    eventName: paymentData.metadata.eventName,
                    eventDate: paymentData.metadata.eventDate
                } : 'N/A - Not custom event',
                shabbatBoxFields: isShabbatBox ? {
                    deliveryType: paymentData.metadata.deliveryType,
                    shabbat_name: paymentData.metadata.shabbat_name
                } : 'N/A - Not shabbat box'
            });

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

            // 3.5. Si hay sponsorship, agregarlo como ítem adicional
            const sponsorshipAmount = getSponsorshipAmount();
            if (sponsorshipAmount > 0) {
                const sponsorshipOption = sponsorshipOptions.find(opt => opt.value === formData.sponsorship);
                const sponsorshipLabel = formData.sponsorship === 'other'
                    ? 'Custom Sponsorship'
                    : sponsorshipOption?.label || 'Sponsorship';
                paymentData.line_items.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Sponsorship',
                            description: sponsorshipLabel
                        },
                        unit_amount: Math.round(sponsorshipAmount * 100),
                    },
                    quantity: 1,
                });
            }

            // 4. Si el usuario eligió cubrir los fees, agregarlos como ítem adicional
            if (formData.coverFees) {
                const subtotal = total + parseFloat(formData.donation || 0) + sponsorshipAmount;
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

            // 4. Check if this is a free registration ($0 total)
            const grandTotal = calculateGrandTotal();
            if (grandTotal === 0 && isFreeRegistration) {
                // Free registration - skip Stripe
                console.log('🆓 Free registration detected, skipping Stripe');
                const freeApiUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/free-registration/`;
                const response = await fetch(freeApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paymentData)
                });

                if (!response.ok) {
                    let errorMessage = 'Registration failed';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorMessage;
                    } catch (parseError) {
                        errorMessage = `Server error: ${response.status} ${response.statusText}`;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log('✅ Free registration successful:', result.orderId);

                // Redirect to success page
                window.location.href = getFullUrl('/success?free=true');
                return;
            }

            // 5. Crear sesión de pago (paid flow only)
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
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
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

            // 6. Redirect based on payment provider
            if (responseData.provider === 'payarc' && responseData.redirectUrl) {
                // PayArc: redirect to hosted checkout
                window.location.href = responseData.redirectUrl;
            } else {
                // Stripe: load Stripe.js and redirect to checkout
                const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
                const { error } = await stripe.redirectToCheckout({ sessionId: responseData.id });
                if (error) {
                    throw error;
                }
            }

        } catch (error) {
            console.error('Payment Error:', error);
            alert(`${isFreeRegistration ? 'Registration' : 'Payment'} failed: ${error.message}`);
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
                    <h2 className="text-3xl xs:text-3xl sm:text-3xl md:text-4xl font-bold">{isFreeRegistration ? 'Registration' : 'Checkout'}</h2>
                    <p className="text-gray-text text-xs xs:text-sm sm:text-base w-full max-w-xs xs:max-w-sm sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] leading-relaxed" >{isFreeRegistration ? 'Complete the form below to confirm your free registration.' : 'Enter your payment method below to reserve your spot. We accept major credit cards.'}</p>
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
                                    <div className="space-y-0">
                                        {!mounted ? (
                                            <div className="text-center text-gray-500 py-4 xs:py-6 sm:py-8 text-sm">
                                                Loading...
                                            </div>
                                        ) : (cartItems || []).length > 0 ? (
                                            <>
                                                {/* Event Header - shown once */}
                                                {cartItems[0]?.shabbatName && (
                                                    <div className="bg-gray-50 -mx-3 xs:-mx-4 sm:-mx-6 px-3 xs:px-4 sm:px-6 py-3 mb-3">
                                                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Order for</p>
                                                        <p className="text-gray-900 font-medium text-sm">
                                                            {cartItems[0].shabbatName}
                                                            {cartItems[0].shabbatDate && (
                                                                <span className="text-gray-500 font-normal"> · {cartItems[0].shabbatDate}</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Items List */}
                                                {(cartItems || []).map((item, index) => (
                                                    <div key={index} className="py-3 border-b border-gray-200 last:border-b-0">
                                                        {/* Row: Name + Price */}
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-gray-900 font-medium text-sm">{item.meal}</span>
                                                            <span className="text-gray-900 font-medium text-sm">${item.totalPrice.toFixed(2)}</span>
                                                        </div>

                                                        {/* Quantity */}
                                                        <p className="text-gray-500 text-xs">
                                                            {item.quantity} × ${(item.unitPrice || item.totalPrice / item.quantity).toFixed(2)} each
                                                        </p>

                                                        {/* Dropdown for selections (only if guidedMenuSelections exists) */}
                                                        {item.guidedMenuSelections && Object.keys(item.guidedMenuSelections).length > 0 && (
                                                            <div className="mt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleItemExpand(index)}
                                                                    className="text-primary text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
                                                                >
                                                                    <span className="text-[10px]">{expandedItems[index] ? '▾' : '▸'}</span>
                                                                    {expandedItems[index] ? 'Hide selections' : 'View selections'}
                                                                </button>
                                                                {expandedItems[index] && (
                                                                    <ul className="mt-2 pl-3 space-y-1 text-xs border-l-2 border-gray-200">
                                                                        {Object.entries(item.guidedMenuSelections).map(([step, option]) => (
                                                                            <li key={step}>
                                                                                <span className="text-gray-500">{step}:</span>{' '}
                                                                                <span className="text-gray-700">{option}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Delivery Fee */}
                                                {(() => {
                                                    const deliveryFeeItem = cartItems?.find(item => item.deliveryFee > 0);
                                                    if (deliveryFeeItem) {
                                                        return (
                                                            <div className="py-3">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="text-gray-900 font-medium text-sm">Delivery</span>
                                                                    <span className="text-gray-900 font-medium text-sm">${deliveryFeeItem.deliveryFee.toFixed(2)}</span>
                                                                </div>
                                                                {deliveryFeeItem.deliveryZone?.zone_name && (
                                                                    <p className="text-gray-500 text-xs">Zone: {deliveryFeeItem.deliveryZone.zone_name}</p>
                                                                )}
                                                                {deliveryFeeItem.deliveryAddress && (
                                                                    <p className="text-gray-500 text-xs">Address: {deliveryFeeItem.deliveryAddress}</p>
                                                                )}
                                                                {deliveryFeeItem.reservationName && (
                                                                    <p className="text-gray-500 text-xs">Reservation: {deliveryFeeItem.reservationName}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </>
                                        ) : (
                                            <div className="text-center text-gray-500 py-4 xs:py-6 sm:py-8 text-sm">
                                                No items in cart
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider and Total */}
                                    <div>
                                        <div className="border-t border-gray-200 mt-4 pt-4"></div>
                                        
                                        {/* Subtotal */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 text-sm xs:text-base">Subtotal:</span>
                                            <span className="text-gray-600 text-sm xs:text-base">${mounted ? total.toFixed(2) : '0.00'}</span>
                                        </div>

                                        {/* Donation if present */}
                                        {parseFloat(formData.donation || 0) > 0 && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 text-sm xs:text-base">Donation:</span>
                                                <span className="text-gray-600 text-sm xs:text-base">${parseFloat(formData.donation).toFixed(2)}</span>
                                            </div>
                                        )}

                                        {/* Sponsorship if present */}
                                        {getSponsorshipAmount() > 0 && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 text-sm xs:text-base">Sponsorship:</span>
                                                <span className="text-gray-600 text-sm xs:text-base">${getSponsorshipAmount().toFixed(2)}</span>
                                            </div>
                                        )}

                                        {/* Transaction Fee if selected */}
                                        {formData.coverFees && (
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 text-sm xs:text-base">Transaction Fee (5%):</span>
                                                <span className="text-gray-600 text-sm xs:text-base">${calculateTransactionFee(total + parseFloat(formData.donation || 0) + getSponsorshipAmount()).toFixed(2)}</span>
                                            </div>
                                        )}

                                        {/* Final Total */}
                                        <div className="bg-gray-50 -mx-3 xs:-mx-4 sm:-mx-6 px-3 xs:px-4 sm:px-6 py-3 mt-4 rounded-b-lg xs:rounded-b-xl">
                                            <div className="flex justify-between items-center">
                                                <span className="text-darkBlue font-bold text-base xs:text-lg sm:text-xl">Total:</span>
                                                <span className="text-darkBlue font-bold text-base xs:text-lg sm:text-xl">${mounted ? calculateGrandTotal().toFixed(2) : '0.00'}</span>
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
                                    {nationalityEnabled && (
                                    <div>
                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Nationality{!koreaInputsEnabled && ' *'}</label>
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
                                    )}

                                    {/* Phone Number */}
                                    <div className={!nationalityEnabled ? 'sm:col-span-2' : ''}>
                                        <label className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Phone Number{!koreaInputsEnabled && ' *'}</label>
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

                            {/* Korea Fields - Conditional */}
                            {koreaInputsEnabled && (
                                <>
                                    {/* My Connection to Country Section */}
                                    <fieldset>
                                        <legend className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">{`My Connection to ${countryName} *`}</legend>
                                        <div className="space-y-3">
                                            <select
                                                name="koreaConnection"
                                                value={formData.koreaConnection}
                                                onChange={handleInputChange}
                                                className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.koreaConnection ? 'border-red-500' : 'border-gray-200'}`}
                                            >
                                                <option value="">{`Select your connection to ${countryName}...`}</option>
                                                <option value="live">{`I live in ${countryName}`}</option>
                                                <option value="visiting">I am visiting</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {formData.koreaConnection === 'other' && (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        name="koreaConnectionOther"
                                                        value={formData.koreaConnectionOther}
                                                        onChange={handleInputChange}
                                                        placeholder="Please specify..."
                                                        className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.koreaConnectionOther ? 'border-red-500' : 'border-gray-200'}`}
                                                    />
                                                    {errors.koreaConnectionOther && <p className="text-red-500 text-xs mt-1">{errors.koreaConnectionOther}</p>}
                                                </div>
                                            )}
                                        </div>
                                        {errors.koreaConnection && <p className="text-red-500 text-xs mt-2">{errors.koreaConnection}</p>}
                                    </fieldset>

                                    {/* Local Phone Number in Country - only shown for delivery items */}
                                    {hasDeliveryItem && (
                                    <fieldset>
                                        <legend className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">{`Local Phone Number in ${countryName} *`}</legend>
                                        <p className="text-gray-500 text-xs xs:text-sm mb-2">{`For deliveries, we must have a local phone number in ${countryName}. You may use your hotel's number.`}</p>
                                        <input
                                            type="tel"
                                            name="localPhone"
                                            value={formData.localPhone}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 010-1234-5678"
                                            className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.localPhone ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {errors.localPhone && <p className="text-red-500 text-xs mt-1">{errors.localPhone}</p>}
                                    </fieldset>
                                    )}

                                    {/* My Connection to Judaism Section - Multiselect Dropdown */}
                                    <fieldset ref={judaismDropdownRef} className="relative">
                                        <legend className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">My Connection to Judaism *</legend>
                                        <p className="text-gray-500 text-xs xs:text-sm mb-2">Select all that apply</p>

                                        {/* Trigger button */}
                                        <button
                                            type="button"
                                            onClick={() => setJudaismDropdownOpen(!judaismDropdownOpen)}
                                            className={`w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 min-h-[2.5rem] xs:min-h-[3rem] sm:min-h-[3.5rem] text-left flex items-center justify-between transition-colors cursor-pointer ${errors.judaismConnection ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                        >
                                            <div className="flex flex-wrap gap-1.5 flex-1">
                                                {formData.judaismConnection.length === 0 ? (
                                                    <span className="text-gray-400 text-sm">Select your connection...</span>
                                                ) : (
                                                    formData.judaismConnection.map(val => {
                                                        const opt = judaismOptions.find(o => o.value === val);
                                                        return (
                                                            <span key={val} className="bg-primary/15 text-primary text-xs px-3 py-1 rounded-full font-medium">
                                                                {opt?.label}
                                                            </span>
                                                        );
                                                    })
                                                )}
                                            </div>
                                            <svg className={`w-4 h-4 xs:w-5 xs:h-5 text-gray-400 shrink-0 ml-2 transition-transform ${judaismDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown panel */}
                                        {judaismDropdownOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                                                {judaismOptions.map((option) => (
                                                    <label key={option.value} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.judaismConnection.includes(option.value)}
                                                            onChange={() => handleJudaismToggle(option.value)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-4 h-4 xs:w-5 xs:h-5 rounded border-2 border-gray-300 shrink-0 flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-colors">
                                                            {formData.judaismConnection.includes(option.value) && (
                                                                <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-sm xs:text-base text-gray-text">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                        {errors.judaismConnection && <p className="text-red-500 text-xs mt-2">{errors.judaismConnection}</p>}
                                    </fieldset>

                                    {/* Sponsorship Options Section */}
                                    <fieldset>
                                        <legend className="block text-xs xs:text-sm font-bold text-darkBlue mb-1.5 xs:mb-2">Sponsorship Options</legend>
                                        <p className="text-gray-500 text-xs xs:text-sm mb-4">Support our community by sponsoring a meal or event (optional)</p>
                                        <div className="space-y-3">
                                            <select
                                                name="sponsorship"
                                                value={formData.sponsorship}
                                                onChange={handleInputChange}
                                                className="w-full bg-white border rounded-lg p-2.5 xs:p-3 sm:p-4 h-10 xs:h-12 sm:h-14 text-gray-text font-medium text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent border-gray-200"
                                            >
                                                <option value="">No sponsorship (optional)</option>
                                                <option value="26">$26 - Sponsor My Meal for a Student/Backpacker</option>
                                                <option value="54">$54 - Sponsor My Shabbat Meal</option>
                                                <option value="72">$72 - Sponsor My Shabbat Dinner and Lunch Meals</option>
                                                <option value="108">$108 - Sponsor a Student</option>
                                                <option value="180">$180 - Sponsor 2 Students</option>
                                                <option value="360">$360 - Co-Sponsor Shabbat Lunch</option>
                                                <option value="540">$540 - Co-Sponsor Shabbat Dinner</option>
                                                <option value="720">$720 - Co-Sponsor Shabbat @ Chabad</option>
                                                <option value="1800">$1,800 - Sponsor Shabbat @ Chabad</option>
                                                <option value="other">Other amount...</option>
                                            </select>
                                            {formData.sponsorship === 'other' && (
                                                <div className="mt-2">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                        <input
                                                            type="number"
                                                            name="sponsorshipOther"
                                                            value={formData.sponsorshipOther}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter amount"
                                                            min="1"
                                                            className="w-full bg-white border border-gray-200 
                                                            rounded-lg p-2.5 xs:p-3 sm:p-4  h-10 xs:h-12 sm:h-14 
                                                            text-gray-text font-medium text-sm xs:text-base !pl-8
                                                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </fieldset>
                                </>
                            )}

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
                                                        {(total + parseFloat(formData.donation || 0) + getSponsorshipAmount()) > 0 && (
                                                            <span className="text-primary font-semibold">
                                                                {" "}(+${calculateTransactionFee(total + parseFloat(formData.donation || 0) + getSponsorshipAmount()).toFixed(2)})
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
                                    disabled={isSubmitting}
                                    className={`w-full font-bold py-3 xs:py-3.5 sm:py-4 rounded-lg transition touch-manipulation text-sm xs:text-base ${isSubmitting
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
                                        isFreeRegistration ? 'Register now' : 'Pay now'
                                    )}
                                </button>
                                <p className="text-gray-text text-xs text-center leading-relaxed px-2">
                                    {isFreeRegistration
                                        ? '*Please complete the form to confirm your registration'
                                        : '*The registration will not be completed without completing the payment'
                                    }
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>

    );
}