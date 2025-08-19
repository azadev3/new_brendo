import React, { useState, MouseEvent, useEffect } from 'react';
import { useShowMagnify } from '../../hooks/useShowMagnify';

interface ImageMagnifierProps {
  src: string;
  width: number | string;
  height: number | string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ src }) => {
  const [[], setSize] = useState([0, 0]);
  // const [[x, y], setXY] = useState([0, 0]);
  const { setShowMagnifier, setXY, setImg_url } = useShowMagnify();
  // const [showMagnifier, setShowMagnifier] = useState(false);
  useEffect(() => {
    setImg_url(src);
  }, [src]);

  return (
    <div className=" h-full" style={{ backgroundColor: "white" }}>
      {/* Original Image */}
      <div className=" w-full h-full" style={{ backgroundColor: "white" }}>
        <img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #ddd',
            cursor: 'zoom-in',
            objectFit: 'contain',
          }}
          onMouseEnter={(e: MouseEvent<HTMLImageElement>) => {
            // Update image size and show magnifier
            const elem = e.currentTarget;
            const { width, height } = elem.getBoundingClientRect();
            setSize([width, height]);
            setShowMagnifier(true);
          }}
          onMouseMove={(e: MouseEvent<HTMLImageElement>) => {
            // Update cursor position
            const elem = e.currentTarget;
            const { top, left } = elem.getBoundingClientRect();
            const x = e.pageX - left - window.pageXOffset;
            const y = e.pageY - top - window.pageYOffset;
            setXY([x, y]);
          }}
          onMouseLeave={() => {
            setShowMagnifier(false);
          }}
          alt="Product"
        />
      </div>
      <h1>sallam</h1>
      <div className="bg-white absolute z-50 top-0 left-[100%] w-[500px] h-[500px]"></div>
    </div>
  );
};

export default ImageMagnifier;
