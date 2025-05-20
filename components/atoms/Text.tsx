import React from "react";

type TextProps = {
  children: React.ReactNode;
  variant?: "title" | "body" | "caption"; // agrega los que necesites
  className?: string;
};

export const Text: React.FC<TextProps> = ({ children, variant = "body", className }) => {
  const baseClass = {
    title: "text-2xl font-bold",
    body: "text-base",
    caption: "text-sm text-gray-500",
  }[variant];

  return <p className={`${baseClass} ${className ?? ""}`}>{children}</p>;

};
