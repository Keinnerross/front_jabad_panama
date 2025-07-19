'use client'
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useState } from "react";
import { getAssetPath } from "@/app/utils/assetPath";

export const ContactSection = ({ siteConfig, copiesData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear messages when user starts typing
        if (message) setMessage('');
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }
        
        if (!formData.email.trim()) {
            setError('Please enter your email address');
            return;
        }
        
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        
        if (!formData.message.trim()) {
            setError('Please enter your message');
            return;
        }
        
        if (formData.message.trim().length < 10) {
            setError('Message must be at least 10 characters long');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('✅ Message sent successfully! We will get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    message: ''
                });
            } else {
                setError(data.error || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            setError('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const igUrl = siteConfig?.social_media?.link_instagram || "/#";
    const fbUrl = siteConfig?.social_media?.link_facebook || "/#";

    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    const bgUrl = copiesData?.contact_page?.picture?.url 
        ? `${url}${copiesData.contact_page.picture.url}` 
        : getAssetPath("/assets/pictures/about/pic_about (8).jpg");

    return (
        <div className="w-full bg-blueBackground relative overflow-hidden">
            {/* Contact Section */}
            <div className="w-full flex justify-center items-center  relative">
                <section className="w-full max-w-7xl px-6 md:px-0 py-16 md:py-24 relative">
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-darkBlue mb-4">
                            {copiesData?.contact_page?.title || "We're Here for You"}
                        </h2>
                        <p className="text-gray-text text-lg">
                            {copiesData?.contact_page?.description || "Whether you're curious about Shabbat dinners, service times, or anything else, send us a message below and we'll be in touch soon."}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Image Section */}
                        <div className="hidden md:block lg:w-1/2 h-64 md:h-[600px]  ">
                            <div className="w-full h-full rounded-xl overflow-hidden relative">
                                <Image src={bgUrl} fill alt="contact Chabbat Panama" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        {/* Contact Form */}
                        <div className="lg:w-1/2">
                            <div className="bg-white rounded-xl border h-full border-gray-200  p-6 md:px-8 md:py-12">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Full name"
                                                disabled={isSubmitting}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue disabled:opacity-50"
                                            />
                                        </div>
                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="example@email.com"
                                                disabled={isSubmitting}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue disabled:opacity-50"
                                            />
                                        </div>
                                        {/* Phone Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                Phone (Optional)
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="(123) 456 - 7890"
                                                disabled={isSubmitting}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue disabled:opacity-50"
                                            />
                                        </div>
                                        {/* City Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                City (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="ex. New York"
                                                disabled={isSubmitting}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div>
                                        <label className="block text-darkBlue font-bold mb-2">
                                            Leave us a message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Write your message here... (minimum 10 characters)"
                                            rows={4}
                                            disabled={isSubmitting}
                                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Messages */}
                                    {(message || error) && (
                                        <div className="mb-4">
                                            {message && (
                                                <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{message}</p>
                                            )}
                                            {error && (
                                                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSend />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                        <div className="flex gap-4 items-center">
                                            <a href={fbUrl} target="_blank" className="bg-primary p-2 rounded-xl cursor-pointer">
                                                <FaFacebookF fill="white" size={18} />
                                            </a>
                                            <a href={igUrl} target="_blank" className="bg-primary p-2 rounded-xl cursor-pointer">
                                                <FaInstagram fill="white" size={19} />
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="hidden lg:block absolute left-0 top-0  w-40 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/a.png")} alt="circle-image" fill className="object-contain" />
                </div>
                <div className="hidden lg:block absolute right-0 bottom-4 w-60 h-72 ">
                    <Image src={getAssetPath("/assets/global/circles/b.png")} alt="circle-image" fill className="object-contain" />
                </div>
            </div>
        </div>
    );
};