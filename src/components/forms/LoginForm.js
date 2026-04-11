  import React, { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function changeHandler(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function submitHandler(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      const { token, user } = res.data;

      login(token, user);   // ✅ Use AuthContext

      toast.success("Login Successful");

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "teacher") navigate("/teacher");
      else navigate("/student");

    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-y-4 mt-6">

      <input
        type="email"
        name="email"
        required
        placeholder="Enter email"
        value={formData.email}
        onChange={changeHandler}
        className="bg-richblack-800 p-3 rounded-lg"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          required
          placeholder="Enter password"
          value={formData.password}
          onChange={changeHandler}
          className="bg-richblack-800 p-3 rounded-lg w-full"
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 cursor-pointer"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>

      <button
        disabled={loading}
        className="bg-yellow-500 py-2 rounded-lg font-semibold"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;