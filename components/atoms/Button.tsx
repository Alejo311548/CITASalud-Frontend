import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;  // <-- agregamos onClick opcional
}

export const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${className ?? ''}`}
      type="button"
      onClick={onClick}  // <-- aquí lo usamos
    >
      {text}
    </button>
  );
};
