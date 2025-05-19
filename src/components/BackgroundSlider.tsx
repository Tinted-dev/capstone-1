import { useState, useEffect } from 'react';

const images = [
  'https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg',
  'https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg',
  'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg'
];

function BackgroundSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Background ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
      ))}
    </div>
  );
}

export default BackgroundSlider;