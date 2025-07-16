
import { MapSection } from "@/app/components/sections/Contact/mapSection";
import { api } from "@/app/services/strapiApiFetch";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FiSend, FiMessageSquare, FiPlus, FiMinus } from "react-icons/fi";

export default async function Contact() {


    const siteConfig = await api.siteConfig();
    const igUrl = siteConfig?.social_media?.link_instagram || "/#";
    const fbUrl = siteConfig?.social_media?.link_facebook || "/#";



    return (
        <div className="w-full bg-blueBackground relative overflow-hidden">
            {/* Contact Section */}
            <div className="w-full flex justify-center items-center  relative">
                <section className="w-full max-w-7xl px-6 md:px-0 py-16 md:py-24 relative">
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-darkBlue mb-4">
                            We're Here for You
                        </h2>
                        <p className="text-gray-text text-lg">
                            Whether you're curious about Shabbat dinners, service times, or
                            anything else, send us a message below and we'll be in touch soon.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Image Section */}
                        <div className="hidden md:block lg:w-1/2 h-64 md:h-[600px]  ">
                            <div className="w-full h-full rounded-xl overflow-hidden relative">
                                {/* Replace with Next.js Image component */}
                                <Image src="/assets/pictures/about/pic_about (8).jpg" fill alt="contact Chabbat Panama" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        {/* Contact Form */}
                        <div className="lg:w-1/2">
                            <div className="bg-white rounded-xl border h-full border-gray-200  p-6 md:px-8 md:py-12">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                            />
                                        </div>
                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="example@email.com"
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                            />
                                        </div>
                                        {/* Phone Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="(123) 456 - 7890"
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                            />
                                        </div>
                                        {/* City Field */}
                                        <div>
                                            <label className="block text-darkBlue font-bold mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="ex. New York"
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                            />
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div>
                                        <label className="block text-darkBlue font-bold mb-2">
                                            Leave us a message
                                        </label>
                                        <textarea
                                            placeholder="Write your message here..."
                                            rows={4}
                                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-darkBlue"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                                        >
                                            <FiSend />
                                            Send Message
                                        </button>
                                        {/* <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="p-2 bg-red-50 rounded-lg text-primary hover:bg-red-100 transition-colors"
                                            >
                                                <FiMessageSquare />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 bg-red-50 rounded-lg text-primary hover:bg-red-100 transition-colors"
                                            >
                                                <FiMessageSquare />
                                            </button>
                                        </div> */}
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

                {/*   <div className="absolute left-0 top-0 opacity-10">
                    <div className="w-40 h-72 bg-red-300"></div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10">
                    <div className="w-60 h-72 bg-red-300"></div>
                </div> */}


                <div className="absolute left-0 top-0  w-40 h-72 ">
                    <Image src="/assets/global/circles/a.png" alt="circle-image" fill className="object-contain" />
                </div>
                <div className="absolute right-0 bottom-4 w-60 h-72 ">
                    <Image src="/assets/global/circles/b.png" alt="circle-image" fill className="object-contain" />
                </div>


            </div>

            {/* FAQ Section */}
            {/*    <section className="container mx-auto px-6 pt-16 pb-16">
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-darkBlue mb-4">
                        Frequently asked questions
                    </h2>
                    <p className="text-gray-text text-lg">
                        Find quick answers below about Shabbat dinners, timings, seating
                        and more—right here in one spot.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200  overflow-hidden transition-all"
                        >
                            <button
                                className="w-full flex justify-between items-center p-6 text-left hover:bg-blueBackground/10 transition-colors"
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={activeIndex === index}
                                aria-controls={`faq-content-${index}`}
                            >
                                <h3 className="text-xl font-bold text-darkBlue">{item.question}</h3>
                                <span className="ml-4 p-2 bg-blueBackground rounded-md text-darkBlue">
                                    {activeIndex === index ? <FiMinus /> : <FiPlus />}
                                </span>
                            </button>

                            <div
                                id={`faq-content-${index}`}
                                className={`px-6 pb-6 pt-0 text-gray-text transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}
                            >
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section> *
 */}
            {/*Map */}
            <MapSection siteConfig={siteConfig} />
        </div>
    );
};