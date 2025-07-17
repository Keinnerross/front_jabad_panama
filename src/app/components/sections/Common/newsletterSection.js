import { FaEnvelope } from "react-icons/fa"
import { Puerto } from "../../ui/illustrations/puerto"
import { ButtonTheme } from "../../ui/common/buttonTheme";
import { useState } from "react";

export const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const hightSection = "500px"; //add if is px em rem etc...

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Clear messages when user starts typing
        if (message) setMessage('');
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('🎉 Successfully subscribed! Welcome to our newsletter.');
                setEmail(''); // Clear the input
            } else {
                setError(data.error || 'Failed to subscribe. Please try again.');
            }
        } catch (err) {
            console.error('Newsletter subscription error:', err);
            setError('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className=" w-full flex justify-center items-center">
            
            <section className="w-full max-w-7xl bg-darkBlue text-white rounded-xl overflow-hidden mb-12 mx-4">
                <div className="w-full flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 ">
                        <div className="w-full h-full  overflow-hidden">
                            <div className={`h-[${hightSection}] w-full object-cover relative`}>
                                <div className="md:absolute right-0 top-0 transform scale-[0.9]">
                                    <Puerto />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 p-16">
                        <h2 className="text-3xl font-bold mb-6">
                            Get our exclusive packages straight to your inbox
                        </h2>

                        <p className="text-blue-100 mb-8 text-sm">
                            Stay updated with hand-picked experiences, Shabbat-friendly tours,
                            and Jewish travel tips made for your time in Panama. Don't miss
                            out—our most popular packages fill up fast!
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                            {/* Input */}
                            <div className="relative flex-grow bg-white rounded-lg">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    disabled={isSubmitting}
                                    className="w-full h-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-600 disabled:opacity-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !email.trim()}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Subscribing...
                                    </>
                                ) : (
                                    'Count me in'
                                )}
                            </button>
                        </form>

                        {/* Messages */}
                        {(message || error) && (
                            <div className="mt-4">
                                {message && (
                                    <p className="text-green-200 text-sm">{message}</p>
                                )}
                                {error && (
                                    <p className="text-red-200 text-sm">{error}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </section>

    )
}