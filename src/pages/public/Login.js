 // src/pages/public/Login.jsx
import React from "react";
import Template from "../../components/layout/Template";
import loginImg from "../../assets/login.png";

function Login({ setIsLoggedIn }) {
  return (
    <Template
      title="Welcome Back"
      desc1= "Empowering Bihar through technical excellence and innovation since 1960."
      desc2="Education to future-proof your career."
      image={loginImg}
      formType="login"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}

export default Login;
