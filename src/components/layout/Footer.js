 


import React, { useEffect, useState } from "react";

 import riteshImg from "../../assets/rituatts.jpeg";
import abhishekImg from "../../assets/abhishek.jpeg";
import niranjanImg from "../../assets/niranjan.png";
import pawanImg from "../../assets/pawan.jpeg";


import DeveloperCard from "../cards/DeveloperCard";

const developers = [
  {
    name: "Ritesh Kumar",
    role: "Frontend & Backend Developer",
    image: riteshImg,
    email: "ritesh@example.com",
    linkedin: "https://linkedin.com/in/ritesh",
    twitter: "https://twitter.com/ritesh",
  },
  {
    name: "Abhishek Kumar",
    role: "Frontend Developer",
    image: abhishekImg,
    email: "abhishek@example.com",
    linkedin: "https://linkedin.com/in/abhishek",
    twitter: "https://twitter.com/abhishek",
  },
  {
    name: "Niranjan Kumar",
    role: "Frontend Developer",
    image: niranjanImg,
    email: "niranjan@example.com",
    linkedin: "https://linkedin.com/in/niranjan",
    twitter: "https://twitter.com/niranjan",
  },
  {
    name: "Pawan Kumar",
    role: "Frontend Developer",
    image: pawanImg,
    email: "pawan@example.com",
    linkedin: "https://linkedin.com/in/pawan",
    twitter: "https://twitter.com/pawan",
  },
];

const Footer = () => {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % developers.length);
        setAnimate(true);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const dev = developers[index];

  return (
    // <footer className="border-t bg-richblack-900/80 py-8">
     <footer class="border-t bg-gray-200 dark:bg-gray-900/50 py-6">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-0">

        <h3 className="text-sm text-black tracking-wide">
          Designed & Developed By
        </h3>

        <div
          className={`transition-all duration-500
          ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <DeveloperCard {...dev} />
        </div>

        <p className="text-xs text-richblack-400 mt-3">
          © 2026 BCE, Bhagalpur
        </p>
      </div>
    </footer>
  );
};

export default Footer;
