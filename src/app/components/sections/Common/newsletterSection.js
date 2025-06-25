import { FaEnvelope } from "react-icons/fa"
import { Puerto } from "../../ui/illustrations/puerto"
import { ButtonTheme } from "../../ui/common/buttonTheme";

export const NewsletterSection = () => {


    const hightSection = "500px"; //add if is px em rem etc...

    return (
        <section className="w-full flex justify-center items-center px-4 md:px-0">
            <section className="w-full max-w-7xl bg-darkBlue text-white rounded-xl overflow-hidden mb-12">
                <div className="w-full flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 ">
                        <div className="w-full h-full  overflow-hidden">
                            <div className={`h-[${hightSection}] w-full object-cover relative`}>
                                <div className="absolute right-0 top-0 transform scale-[0.9]">
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

                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* Input */}
                            <div className="relative flex-grow bg-white rounded-lg ">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-400"
                                />
                            </div>

                            <ButtonTheme title="Count me in" variation={3} />
                        </div>
                    </div>
                </div>
            </section>
        </section>

    )
}