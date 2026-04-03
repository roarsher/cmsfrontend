 

import React from "react";
// import { FcGoogle } from "react-icons/fc";  

// import { toast } from "react-hot-toast";

import { FaEnvelope, FaLinkedin, FaTwitter } from "react-icons/fa";

const DeveloperCard = ({ name, role, image, email, linkedin, twitter }) => {
  return (
    // <div className="bg-white border border-white  rounded-xl p-4 flex gap-4 items-center">
    <div class="border-t bg-gray-200 dark:bg-gray-900/50 py-6 flex gap-4 items centre" >
      
      <img
        src={image}
        alt={name}
        className="w-14 h-14 rounded-full object-cover border border-black"
      />

      <div className="flex-1">
        <h4 className="text-black font-semibold">{name}</h4>
        <p className="text-richblack-300 text-xs">{role}</p>

        <div className="flex gap-3 mt-2 text-lg">
          <a href={`mailto:${email}`} className="hover:text-yellow-50">
            <FaEnvelope />
          </a>
          <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-yellow-50">
            <FaLinkedin />
          </a>
          <a href={twitter} target="_blank" rel="noreferrer" className="hover:text-yellow-50">
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
