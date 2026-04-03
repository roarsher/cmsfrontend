import React from "react";
// import bce from "../assets/bce.png";
import bce from '../../assets/bce.png'; // Use two sets of dots to go up twice


const Bg = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
          url(${bce})
        `,
      }}
    >
      {children}
    </div>
  );
};

export default Bg;