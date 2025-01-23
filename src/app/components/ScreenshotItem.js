import React from 'react';
import Image from 'next/image';
import close from '@/assets/close.svg';

const ScreenshotItem = ({ image, index, deleteScreenshot }) => {
  return (
    <div key={index} className="group aspect-[1.60] h-[120px] relative">
      <img src={image} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
      <a onClick={() => deleteScreenshot(index)}>
        <Image
          src={close}
          alt="Delete Screenshot"
          className="absolute opacity-0 group-hover:opacity-100 hover:cursor-pointer top-0 right-0 w-auto h-[25px] translate-x-1/2 -translate-y-1/2"
        />
      </a>
    </div>
  );
};

export default ScreenshotItem;