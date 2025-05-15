import CustomSlider from "./CustomSlider";



const PhotoAndGallerySection = () => {
   const images = [
  "https://swiperjs.com/demos/images/nature-1.jpg",
  "https://swiperjs.com/demos/images/nature-2.jpg",
  "https://swiperjs.com/demos/images/nature-3.jpg",
  "https://swiperjs.com/demos/images/nature-4.jpg",
  "https://swiperjs.com/demos/images/nature-5.jpg",
  "https://swiperjs.com/demos/images/nature-6.jpg",
  "https://swiperjs.com/demos/images/nature-7.jpg",
];
    return (
        <div className="min-h-screen bg-gray-100">
      <CustomSlider images={images} />
    </div>
    );
};

export default PhotoAndGallerySection;