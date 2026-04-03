 


import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE"];

const DEPARTMENT_COURSES = {
  CSE: ["Data Structures & Algorithms", "Operating Systems", "Database Management System", "Computer Networks", "Object Oriented Programming", "Web Development", "Machine Learning", "Software Engineering"],
  ECE: ["Digital Electronics", "Signals & Systems", "Microprocessors", "Communication Systems", "VLSI Design", "Embedded Systems"],
  ME:  ["Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "Manufacturing Processes", "Machine Design"],
  CE:  ["Structural Analysis", "Soil Mechanics", "Fluid Mechanics & Hydraulics", "Construction Technology", "Surveying"],
  EE:  ["Circuit Theory", "Electrical Machines", "Power Systems", "Control Systems", "Power Electronics", "Signals & Systems"],
};

const SignupForm = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("student");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    year: "",
    designation: "",
    TeacherIdNumber: "",
    department: "",
    adminKey: "",
  });

  function changeHandler(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function switchRole(role) {
    setAccountType(role);
    setFormData((prev) => ({
      ...prev,
      rollNumber: "", year: "", designation: "",
      TeacherIdNumber: "", department: "", adminKey: "",
    }));
  }

  async function submitHandler(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: accountType,
      };

      if (accountType === "student") {
        payload.rollNumber  = formData.rollNumber;
        payload.department  = formData.department;
        payload.year        = Number(formData.year);
      } else if (accountType === "teacher") {
        payload.department     = formData.department;
        payload.designation    = formData.designation;
        payload.TeacherIdNumber = formData.TeacherIdNumber;
      } else if (accountType === "admin") {
        payload.adminKey = formData.adminKey;
      }

      await API.post("/api/auth/register", payload);

      toast.success(`${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account Created Successfully!`);
      navigate("/login");

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "bg-richblack-800 text-white p-3 rounded-lg w-full outline-none border border-yellow-500/30 focus:border-yellow-500 transition";
  const selectClass = "bg-richblack-800 text-white p-3 rounded-lg w-full outline-none border border-yellow-500/30 focus:border-yellow-500 transition appearance-none cursor-pointer";

  return (
    <div className="w-full space-y-6">

      {/* Role Selector */}
      <div className="flex gap-2 bg-richblack-800 p-1 rounded-full w-max">
        {["student", "teacher", "admin"].map((role) => (
          <button
            type="button"
            key={role}
            onClick={() => switchRole(role)}
            className={`px-5 py-2 rounded-full transition-all duration-200 ${
              accountType === role
                ? "bg-yellow-500 text-black font-semibold"
                : "bg-transparent text-gray-400 hover:text-white"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={submitHandler} className="space-y-4">

        {/* Core Fields */}
        <input type="text"     name="name"     required placeholder="Enter Full Name"       value={formData.name}     onChange={changeHandler} className={inputClass} />
        <input type="email"    name="email"    required placeholder="Enter Email Address"   value={formData.email}    onChange={changeHandler} className={inputClass} />
        <input type="password" name="password" required placeholder="Create Password"       value={formData.password} onChange={changeHandler} className={inputClass} />

        {/* ── STUDENT FIELDS ── */}
        {accountType === "student" && (
          <>
            <input
              type="text"
              name="rollNumber"
              required
              placeholder="Enter Roll Number"
              value={formData.rollNumber}
              onChange={changeHandler}
              className={inputClass}
            />

            {/* Department Dropdown */}
            <div className="relative">
              <select
                name="department"
                required
                value={formData.department}
                onChange={changeHandler}
                className={selectClass}
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
            </div>

            {/* Show courses assigned to selected department */}
            {formData.department && (
              <div className="bg-richblack-800 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-500 text-xs font-semibold mb-2 uppercase tracking-wide">
                  📚 Courses assigned to {formData.department}
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENT_COURSES[formData.department]?.map((course) => (
                    <span
                      key={course}
                      className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/30"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Year Dropdown */}
            <div className="relative">
              <select
                name="year"
                required
                value={formData.year}
                onChange={changeHandler}
                className={selectClass}
              >
                <option value="" disabled>Select Year</option>
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
            </div>
          </>
        )}

        {/* ── TEACHER FIELDS ── */}
        {accountType === "teacher" && (
          <>
            <input
              type="text"
              name="TeacherIdNumber"
              required
              placeholder="Teacher ID Number"
              value={formData.TeacherIdNumber}
              onChange={changeHandler}
              className={inputClass}
            />

            <div className="relative">
              <select
                name="department"
                required
                value={formData.department}
                onChange={changeHandler}
                className={selectClass}
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
            </div>

            <input
              type="text"
              name="designation"
              required
              placeholder="Designation (e.g., Assistant Professor)"
              value={formData.designation}
              onChange={changeHandler}
              className={inputClass}
            />
          </>
        )}

        {/* ── ADMIN FIELDS ── */}
        {accountType === "admin" && (
          <input
            type="password"
            name="adminKey"
            required
            placeholder="Admin Registration Secret Key"
            value={formData.adminKey}
            onChange={changeHandler}
            className="bg-richblack-800 text-white p-3 rounded-lg w-full outline-none border border-red-500/50 focus:border-red-500 transition"
          />
        )}

        <button
          disabled={loading}
          className="bg-yellow-500 text-black py-3 rounded-lg w-full font-bold mt-2 hover:bg-yellow-400 transition-colors disabled:opacity-60"
        >
          {loading ? "Processing..." : `Register as ${accountType.charAt(0).toUpperCase() + accountType.slice(1)}`}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;