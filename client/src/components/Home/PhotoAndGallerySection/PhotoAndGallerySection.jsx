import CustomSlider from "./CustomSlider";



const PhotoAndGallerySection = () => {
   const images = [
  "https://source.unsplash.com/random/800x600?1",
  "https://source.unsplash.com/random/800x600?2",
  "https://source.unsplash.com/random/800x600?3",
  "https://source.unsplash.com/random/800x600?4",
  "https://source.unsplash.com/random/800x600?5",
];
    return (
        <div className="min-h-screen bg-gray-100">
      <CustomSlider images={images} />
    </div>
    );
};

export default PhotoAndGallerySection;