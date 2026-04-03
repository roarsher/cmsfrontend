  // src/pages/public/Signup.jsx
import React from "react";
import Template from "../../components/layout/Template";
import signupImg from "../../assets/signup.png";

function Signup({ setIsLoggedIn }) {
  return (
    <Template
      title="Join the digital transformation of our college with a smart and unified ERP platform."
      desc1= "Empowering Bihar through technical excellence and innovation since 1960."
      desc2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}

export default Signup;
