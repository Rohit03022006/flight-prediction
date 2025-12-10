import { Link } from "react-router-dom";
import { FaPlane, FaChartLine, FaHistory, FaClock, FaArrowRight, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans selection:bg-black selection:text-white">
            <header className="top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="bg-black p-2.5 rounded-full shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300">
                            <FaPlane className="text-white text-lg transform -rotate-90 group-hover:rotate-[-45deg] transition-transform duration-500" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-black">FlightPredictor</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        {["Features", "How It Works", "FAQ"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-gray-500 hover:text-black transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-black after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    <Link
                        to="/predictor"
                        className="hidden md:inline-flex bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-md hover:shadow-lg items-center gap-2"
                    >
                        Get Started <FaArrowRight className="text-xs" />
                    </Link>
                </div>
            </header>

            <section className="relative pt-5 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-gray-200/50 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>

                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        <div className="space-y-8 max-w-2xl relative z-10">
                            <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm mb-2">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Live Prediction Model v2.0</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black leading-[1.1]">
                                Predict flight prices <br className="hidden lg:block" /> with
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-black"> AI Precision</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                                Stop overpaying. Use our advanced historical data analysis and 7-day forecast engine to book at the perfect moment.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    to="/predictor"
                                    className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-xl shadow-gray-400/20 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                                >
                                    Start Predicting
                                    <FaArrowRight className="ml-3" />
                                </Link>
                                <a
                                    href="#features"
                                    className="inline-flex items-center justify-center bg-white border border-gray-200 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                                >
                                    Learn More
                                </a>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200/60 mt-8">
                                <div>
                                    <div className="text-3xl font-black text-black">95%</div>
                                    <div className="text-sm font-medium text-gray-500 mt-1">Accuracy</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-black">50K+</div>
                                    <div className="text-sm font-medium text-gray-500 mt-1">Predictions</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-black">Instant</div>
                                    <div className="text-sm font-medium text-gray-500 mt-1">Results</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 via-gray-50 to-white rounded-[2.5rem] transform rotate-3 scale-95 opacity-60 border border-gray-200/50 backdrop-blur-sm"></div>

                            <div className="relative w-full aspect-[4/3] bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col transform transition-all duration-700 hover:rotate-1 hover:scale-[1.02]">

                                <div className="h-14 bg-white border-b border-gray-50 flex items-center px-6 justify-between">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                                    </div>
                                    <div className="h-6 w-32 bg-gray-50 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
                                        <div className="w-16 h-1.5 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <div className="w-4"></div>
                                </div>

                                <div className="flex-1 p-6 sm:p-10 bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-center relative overflow-hidden">

                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>

                                    <div className="absolute top-1/4 -left-4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
                                    <div className="absolute bottom-1/4 -right-4 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>

                                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 relative z-10 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500">

                                        <div className="flex justify-between items-center mb-8 relative">
                                            <div className="text-center relative z-10">
                                                <div className="text-3xl font-black text-gray-900 tracking-tighter">DEL</div>
                                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">New Delhi</div>
                                            </div>

                                            <div className="flex-1 px-6 flex flex-col items-center relative">
                                                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-100 -translate-y-1/2"></div>

                                                <div className="absolute -top-5 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">2h 15m</div>
                                            </div>

                                            <div className="text-center relative z-10">
                                                <div className="text-3xl font-black text-gray-900 tracking-tighter">BOM</div>
                                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">Mumbai</div>
                                            </div>
                                        </div>

                                        <div className="text-center mb-8 relative">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg shadow-green-500/30 flex items-center gap-1 animate-bounce duration-[2000ms]">
                                                <FaArrowRight className="transform rotate-90" /> 14% Drop
                                            </div>

                                            <div className="text-6xl font-black text-black tracking-tighter mb-1 mt-2">
                                                <span className="text-3xl align-top text-gray-400 font-medium mr-1">₹</span>
                                                4,249
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Indigo • Non-stop
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between h-16 mb-6 px-1 gap-2">
                                            {[30, 45, 60, 25, 55, 75, 90].map((height, i) => (
                                                <div key={i} className="w-full relative group cursor-pointer h-full flex items-end">
                                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold px-1.5 py-1 rounded transition-opacity pointer-events-none whitespace-nowrap z-20">
                                                        ₹{4000 + (height * 10)}
                                                    </div>
                                                    <div
                                                        className={`w-full rounded-t-md transition-all duration-300 ${i === 3 ? 'bg-black shadow-lg shadow-black/20' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                        style={{ height: i === 3 ? '40%' : `${height}%` }}
                                                    ></div>
                                                    {i === 3 && (
                                                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-black uppercase tracking-wide">Now</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="group relative w-full bg-black text-white py-3.5 rounded-xl font-bold text-center text-sm shadow-xl shadow-black/10 flex items-center justify-center gap-2 cursor-pointer overflow-hidden mt-2">
                                            <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <span className="relative z-10 flex items-center gap-2">
                                                Book This Flight <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto max-w-7xl px-6 relative z-10">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <div className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Why Choose Us</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tighter leading-tight">
                            Intelligence for your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black">next adventure.</span>
                        </h2>
                        <p className="text-xl text-gray-500 leading-relaxed">
                            We process millions of data points every second to give you the clarity needed to book with absolute confidence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaChartLine className="text-2xl text-blue-600" />,
                                title: "7-Day Price Horizon",
                                desc: "Don't just book—time it perfectly. Our algorithm reveals the price trajectory for the entire week, highlighting the absolute lowest fare instant.",
                                gradient: "from-blue-50 to-transparent",
                                border: "group-hover:border-blue-200"
                            },
                            {
                                icon: <FaHistory className="text-2xl text-purple-600" />,
                                title: "Intelligent Recall",
                                desc: "Never lose a good deal again. We automatically track your route history, allowing you to compare fluctuations against your previous finds instantly.",
                                gradient: "from-purple-50 to-transparent",
                                border: "group-hover:border-purple-200"
                            },
                            {
                                icon: <FaClock className="text-2xl text-orange-600" />,
                                title: "Circadian Analysis",
                                desc: "Morning or Red-eye? We analyze hour-by-hour price shifts to tell you exactly how much you save by simply shifting your departure time.",
                                gradient: "from-orange-50 to-transparent",
                                border: "group-hover:border-orange-200"
                            }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className={`group relative p-8 rounded-[2rem] bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden ${feature.border}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-xl font-bold text-black mb-3 tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>

                                    <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        Explore <FaArrowRight className="ml-2 text-[10px]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-32 bg-gray-50 relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-6 relative z-10">

                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
                            From query to savings <br />
                            <span className="text-gray-400">in three seconds.</span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Complex data science, simplified into a seamless user experience.
                        </p>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">


                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-gray-300 z-0"></div>

                        {[
                            {
                                step: "01",
                                title: "Input Route",
                                desc: "Select your origin, destination, and preferred airline parameters.",
                                icon: <FaPlane className="transform -rotate-45" />
                            },
                            {
                                step: "02",
                                title: "AI Processing",
                                desc: "Our engine cross-references historical data with real-time trends.",
                                icon: <FaChartLine />
                            },
                            {
                                step: "03",
                                title: "Smart Forecast",
                                desc: "Receive an instant price prediction and 7-day volatility outlook.",
                                icon: <FaArrowRight />
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-50 flex items-center justify-center mb-8 shadow-xl shadow-gray-200/50 group-hover:scale-110 group-hover:border-black transition-all duration-300 relative">
                                    <div className="text-2xl text-black group-hover:text-black transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-gray-50">
                                        {item.step}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed max-w-[250px]">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 bg-black relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto max-w-4xl px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                        Ready to fly smarter?
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Join thousands of travelers who are saving money on every trip using our predictive technology.
                    </p>
                    <Link
                        to="/predictor"
                        className="group inline-flex items-center justify-center bg-white text-black px-12 py-6 rounded-full font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                    >
                        Start Predicting
                        <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            <section id="faq" className="py-32 bg-white border-t border-gray-100">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                <FaQuestionCircle /> <span>Support Center</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-gray-500 mb-8">
                                Everything you need to know about our predictive technology and how it helps you save.
                            </p>

                        </div>

                        <div className="lg:col-span-8 grid gap-8">
                            {[
                                {
                                    q: "How reliable is the AI prediction model?",
                                    a: "We utilize a Random Forest algorithm trained on over 10 years of historical flight data. While market conditions fluctuate, our model currently achieves a ~95% accuracy rate in forecasting price trends for the upcoming week."
                                },
                                {
                                    q: "Does this cover all major Indian airlines?",
                                    a: "Yes. We support real-time predictions for all major carriers including Indigo, Air India, Vistara, SpiceJet, AirAsia, and GO FIRST across top metropolitan routes like Delhi, Mumbai, and Bangalore."
                                },
                                {
                                    q: "Is this service truly free?",
                                    a: "Absolutely. Our mission is price transparency. You get unlimited searches, 7-day price forecasts, and historical insights completely free of charge. No hidden fees, no credit card required."
                                },
                                {
                                    q: "What is the '7-Day Forecast' exactly?",
                                    a: "Instead of just showing you today's price, we generate a graph for the next 7 days. This helps you identify if waiting just 24 or 48 hours could drop the ticket price significantly."
                                },
                                {
                                    q: "How far in advance should I book?",
                                    a: "General data suggests 6-8 weeks is the 'Goldilocks' window for domestic flights. However, our tool is designed to pinpoint the exact micro-dip within that window for your specific route."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="group">
                                    <h3 className="text-xl font-bold text-black mb-3 flex items-start group-hover:text-blue-600 transition-colors">
                                        <span className="text-gray-200 mr-4 text-2xl font-light -mt-1 select-none">0{idx + 1}</span>
                                        {item.q}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed pl-12 text-lg">
                                        {item.a}
                                    </p>
                                    <div className="mt-8 border-b border-gray-100 w-full group-last:hidden"></div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}