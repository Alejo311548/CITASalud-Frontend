import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ text, className }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${className ?? ''}`}
      type="button"
    >
      {text}
    </button>
  );
};
