import Image from "next/image";
import React from "react";

interface AtomImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const AtomImage: React.FC<AtomImageProps> = ({ src, alt, className = "", width, height }) => (
  <Image src={src} alt={alt} className={className} width={width} height={height} />
);
