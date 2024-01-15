import React from "react";

export default function AddCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill="color(display-p3 0.1041 0.1041 0.1041)"
        d="M8.5 6a.5.5 0 00-1 0v1.5H6a.5.5 0 000 1h1.5V10a.5.5 0 001 0V8.5H10a.5.5 0 000-1H8.5V6z"
      ></path>
      <path
        fill="color(display-p3 0.1041 0.1041 0.1041)"
        fillRule="evenodd"
        d="M8 .833a7.167 7.167 0 100 14.334A7.167 7.167 0 008 .833zM1.835 8a6.167 6.167 0 1112.333 0A6.167 6.167 0 011.834 8z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}