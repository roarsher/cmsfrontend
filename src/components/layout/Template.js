 

import React from "react";
import frame from '../../assets/frame.png';
import SignupForm from "../forms/SignUpForm.js";
import LoginForm from "../forms/LoginForm.js";

const Template = ({ title, desc1, desc2, image, formType }) => {
  return (
    <div className="flex min-h-screen w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 justify-between items-start">

      {/* Left - Form */}
      <div className="w-11/12 max-w-[450px] mx-0 text-white pb-12">
        <h1 className="text-richblack-5 font-semibold text-[1.79rem] leading-[2.375rem]">
          {title}
        </h1>

        <p className="text-[1.125rem] mt-4 leading-[1.625rem]">
          <span className="text-richblack-70">{desc1}</span>
          <span className="text-blue-100 italic">{desc2}</span>
        </p>

        {formType === "signup" ? <SignupForm /> : <LoginForm />}
      </div>

      {/* Right - Image (sticky so it stays visible while form scrolls) */}
      <div className="w-11/12 max-w-[450px] sticky top-12 hidden lg:block">
        <div className="relative">
        <img src={frame} alt="frame" width={558} height={504} loading="lazy" />
        <img
          src={image}
          alt="illustration"
          width={558}
          height={504}
          loading="lazy"
          className="absolute -top-4 right-4"
        />
        </div>
      </div>

    </div>
  );
};

export default Template;