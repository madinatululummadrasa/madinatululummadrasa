import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Container from '../../../Shared/Container';


const slides = [
  {
    image: '../../../../../public/1.jpg',
    caption: 'স্বাগতম এক্সওয়াইজেড স্কুল এবং কলেজ এর পক্ষ থেকে!',
  },
  {
    image: '../../../../../public/2.jpg',
    caption: 'গুণগত মানসম্পন্ন শিক্ষা নিশ্চিত করি আমরা।',
  },
  {
    image: '../../../../../public/3.jpg',
    caption: 'নতুন প্রজন্মের জন্য আধুনিক ও কার্যকর শিক্ষা।',
  },
];

const HeroCarousel = () => {
  return (
    <Container>

   
    <div className=" w-full max-h-[480px] relative mt-6 rounded-lg overflow-hidden">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={true}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        navigation={{
          nextEl: '.next-btn',
          prevEl: '.prev-btn',
        }}
        className="h-[480px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h2 className="text-white text-3xl md:text-4xl font-bold font-bengali text-center px-6 leading-relaxed">
                  {slide.caption}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Bottom right navigation */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-50">
          <button className="prev-btn w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center hover:bg-green-700 transition">
            ‹
          </button>
          <button className="next-btn w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center hover:bg-green-700 transition">
            ›
          </button>
        </div>

        {/* Bottom left indicators */}
        <div className="custom-pagination absolute bottom-4 left-4 z-50 flex space-x-2"></div>
      </Swiper>
    </div>
    </Container>
  );
};

export default HeroCarousel;
