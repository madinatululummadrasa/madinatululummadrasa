import { useEffect, useState } from 'react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import modules
import { EffectCards } from 'swiper/modules';
import './style.css'; // Make sure this file styles the Swiper properly

const SpeechCard = () => {
    const [speech, setSpeech] = useState([]);

    useEffect(() => {
        fetch('/speech.json')
            .then(res => res.json())
            .then(data => {
                setSpeech(data);
            });
    }, []);

    return (
        <div className="mt-12">
            <section className="w-full flex justify-center items-center">
                <div className="w-full max-w-4xl px-4 sm:px-6">
                    <Swiper
                        effect={'cards'}
                        grabCursor={true}
                        modules={[EffectCards]}
                        className="mySwiper"
                    >
                        {speech.map((item, index) => (
                            <SwiperSlide key={index} className="pb-4">
                                <div className="w-full bg-white shadow-lg rounded-lg p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-green-500"
                                        />
                                        <div className="text-center sm:text-left">
                                            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-green-500 pb-1">
                                                {item.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 mt-1">{item.name}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-gray-700 text-sm leading-relaxed text-justify">
                                        {item.message}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </div>
    );
};

export default SpeechCard;
