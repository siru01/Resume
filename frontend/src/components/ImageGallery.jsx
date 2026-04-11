import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
  const [index, setIndex] = useState(0);

  const nextStep = () => setIndex((prev) => (prev + 1) % images.length);
  const prevStep = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  const onDragEnd = (event, info) => {
    if (info.offset.x < -50) nextStep();
    if (info.offset.x > 50) prevStep();
  };

  return (
    <div className="gallery-container">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          
          // Interaction Logic
          onDoubleClick={nextStep}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={onDragEnd}
          
          // Visual Feedback instead of text
          whileTap={{ scale: 0.98 }} 
          
          className="gallery-image"
        />
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;