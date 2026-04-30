import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE"];
const DEPT_COURSES = {
  CSE: ["Data Structures","Operating Systems","DBMS","Computer Networks","OOP","Web Dev","ML","Software Engg"],
  ECE: ["Digital Electronics","Signals & Systems","Microprocessors","Communication Systems","VLSI","Embedded Systems"],
  ME:  ["Engineering Mechanics","Thermodynamics","Fluid Mechanics","Manufacturing","Machine Design"],
  CE:  ["Structural Analysis","Soil Mechanics","Fluid Mechanics","Construction Technology","Surveying"],
  EE:  ["Circuit Theory","Electrical Machines","Power Systems","Control Systems","Power Electronics","Signals & Systems"],
};

// ── Roll number utils ────────────────────────────────────────────────────────
const DEPT_CODES = { CE:"1", ME:"2", EE:"3", ECE:"4", CSE:"5" };

const parseRoll = (roll) => {
  // Format: YY + DEPT_CODE(1) + SERIAL(2) = 5 digits e.g. 22536
  if (!/^\d{5}$/.test(roll)) return null;
  const yy   = roll.slice(0, 2);
  const dc   = roll.slice(2, 3);
  const ser  = roll.slice(3, 5);
  const dept = Object.keys(DEPT_CODES).find(k => DEPT_CODES[k] === dc);
  if (!dept) return null;
  return { year: parseInt("20" + yy), dept, serial: parseInt(ser) };
};

const validateRoll = (roll, department) => {
  const parsed = parseRoll(roll);
  if (!parsed) return "Roll number must be 5 digits (e.g. 22536)";
  if (DEPT_CODES[department] && parsed.dept !== department)
    return `Roll number dept code should be ${DEPT_CODES[department]} for ${department}`;
  return null;
};

const SEM_TO_YEAR = { 1:1, 2:1, 3:2, 4:2, 5:3, 6:3, 7:4, 8:4 };
const YEAR_TO_SEMS = { 1:[1,2], 2:[3,4], 3:[5,6], 4:[7,8] };

// ── Roll number helpers ───────────────────────────────────────────────────────
//const DEPT_CODES = { CE:"01", ME:"02", EE:"03", ECE:"04", CSE:"05" };

const semesterToYear = (sem) => Math.ceil(Number(sem) / 2);

const validateRollNumber = (roll, dept, enrollYear) => {
  if (roll.length !== 6) return "Roll number must be exactly 6 digits";
  if (!/^\d{6}$/.test(roll)) return "Roll number must be numeric";
  const yy   = roll.slice(0,2);
  const dd   = roll.slice(2,4);
  const ss   = roll.slice(4,6);
  const expectedCode = DEPT_CODES[dept];
  if (expectedCode && dd !== expectedCode) return `Department code should be ${expectedCode} for ${dept}`;
  if (parseInt(ss) === 0) return "Serial number cannot be 00";
  return null; // valid
};

const generateRollHint = (dept, year) => {
  if (!dept || !year) return "";
  const yy   = String(new Date().getFullYear() - (Number(year)-1)).slice(2);
  const dd   = DEPT_CODES[dept] || "XX";
  return `Pattern: ${yy}${dd}XX (e.g. ${yy}${dd}01)`;
};

// ── Reusable Input ─────────────────────────────────────────────────────────────
const Input = ({ label, icon, type = "text", ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{icon}</span>}
        <input
          type={isPassword && show ? "text" : type}
          className={`bg-richblack-800 text-white rounded-xl w-full outline-none border border-white/10 focus:border-yellow-500/60 transition py-3 ${icon ? "pl-9 pr-4" : "px-4"} ${isPassword ? "pr-10" : ""}`}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-sm">
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Google Button ──────────────────────────────────────────────────────────────
const GoogleBtn = ({ onClick, loading, label }) => (
  <button type="button" onClick={onClick} disabled={loading}
    className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 font-semibold py-3 rounded-xl hover:bg-gray-50 border border-gray-200 transition disabled:opacity-60 shadow-sm">
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    {loading ? "Connecting..." : label}
  </button>
);

// ── Divider ────────────────────────────────────────────────────────────────────
const Divider = ({ text = "or" }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-white/10" />
    <span className="text-xs text-gray-500 font-semibold">{text}</span>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const UnifiedAuth = () => {
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();
  const [mode, setMode]     = useState("login");    // "login" | "signup"
  const [step, setStep]     = useState("form");     // "form" | "verify" | "role" (Google new user)
  const [role, setRole]     = useState("student");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [fbUser, setFbUser] = useState(null);
  const [googleUserData, setGoogleUserData] = useState(null);
  const pollRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    rollNumber: "", year: "", semester: "", department: "",
    TeacherIdNumber: "", designation: "", adminKey: "",
  });
  const [rollError, setRollError] = useState("");
  const ch = (e) => {
    const { name, value } = e.target;
    setForm(p => {
      const updated = { ...p, [name]: value };
      // Auto-fill year from semester
      if (name === "semester" && value) {
        updated.year = SEM_TO_YEAR[Number(value)] || p.year;
      }
      // Auto-fill semester options when year changes
      if (name === "year" && value && !p.semester) {
        updated.semester = YEAR_TO_SEMS[Number(value)]?.[0] || "";
      }
      return updated;
    });
    // Validate roll number
    if (name === "rollNumber") {
      const err = validateRoll(value, form.department);
      setRollError(value.length === 5 ? (err || "") : "");
    }
    if (name === "department" && form.rollNumber.length === 5) {
      setRollError(validateRoll(form.rollNumber, value) || "");
    }
  };

  // Cleanup polling on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ── Backend auto-login helper ──────────────────────────────────────────────
  const autoLogin = async (idToken, roleOverride, extraData) => {
    const res = await API.post("/firebase-auth", {
      idToken,
      role:      roleOverride,
      extraData,
    });
    if (res.data.token) {
      login(res.data.token, res.data.user);
      toast.success(`🎉 Welcome, ${res.data.user.name}!`);
      navigate(`/${res.data.user.role}`);
    }
    return res.data;
  };

  // ── EMAIL SIGNUP ───────────────────────────────────────────────────────────
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    let fbU = null;
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      fbU = cred.user;
      await sendEmailVerification(fbU, { url: window.location.origin + "/login" });
      setFbUser(fbU);
      setStep("verify");
      toast.success("📧 Verification email sent! Check your inbox.");
      startVerificationPolling(fbU);
    } catch (err) {
      if (fbU) await deleteUser(fbU).catch(() => {});
      toast.error({
        "auth/email-already-in-use": "Email already registered. Try logging in.",
        "auth/weak-password":        "Password too weak (min 6 chars).",
        "auth/invalid-email":        "Invalid email address.",
      }[err.code] || err.message);
    } finally { setLoading(false); }
  };

  // ── AUTO-POLL for verification (every 3 seconds) ───────────────────────────
  const startVerificationPolling = (fbU) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        await fbU.reload();
        if (fbU.emailVerified) {
          clearInterval(pollRef.current);
          toast.success("✅ Email verified! Logging you in...");
          await completeSignup(fbU);
        }
      } catch (e) { console.error(e); }
    }, 3000);
  };

  // ── Complete signup → save to MongoDB → auto-login ─────────────────────────
  const completeSignup = async (fbU) => {
    setVerifying(true);
    try {
      const idToken = await fbU.getIdToken(true);
      const extraData = {
        name:            form.name,
        rollNumber:      form.rollNumber,
        department:      form.department,
        year:            Number(form.year),
        semester:        Number(form.semester),
        TeacherIdNumber: form.TeacherIdNumber,
        designation:     form.designation,
        adminKey:        form.adminKey,
      };
      // First register in MongoDB via our auth route
      await API.post("/auth/register", {
        name:            form.name,
        email:           form.email,
        password:        form.password,
        role,
        semester:        form.semester,
        ...extraData,
      });
      // Then auto-login via Firebase token
      await autoLogin(idToken, role, extraData);
      await deleteUser(fbU).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || "Auto-login failed. Please login manually.");
      navigate("/login");
    } finally { setVerifying(false); }
  };

  // ── Manual verify button (fallback) ───────────────────────────────────────
  const manualVerify = async () => {
    if (!fbUser) return;
    setVerifying(true);
    try {
      await fbUser.reload();
      if (!fbUser.emailVerified) {
        toast.error("Not verified yet. Check your email.");
        setVerifying(false);
        return;
      }
      clearInterval(pollRef.current);
      await completeSignup(fbUser);
    } catch (e) {
      toast.error("Something went wrong. Try again.");
      setVerifying(false);
    }
  };

  // ── EMAIL LOGIN ────────────────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  // ── GOOGLE AUTH ────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbU    = result.user;
      const idToken = await fbU.getIdToken();

      const res = await API.post("/firebase-auth", { idToken });

      if (!res.data.isNew) {
        // Existing user — auto login
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}! 👋`);
        navigate(`/${res.data.user.role}`);
      } else {
        // New Google user — need role + extra info
        setGoogleUserData({ fbU, idToken, email: res.data.email, name: res.data.name });
        setForm(p => ({ ...p, name: res.data.name, email: res.data.email }));
        setStep("role");
        toast.success("Google account linked! Complete your profile.");
      }
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error(err.message || "Google sign-in failed");
      }
    } finally { setGLoading(false); }
  };

  // ── Complete Google signup after role selection ─────────────────────────────
  const completeGoogleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const extraData = {
        name:            googleUserData.name,
        rollNumber:      form.rollNumber,
        department:      form.department,
        year:            form.year,
        TeacherIdNumber: form.TeacherIdNumber,
        designation:     form.designation,
        adminKey:        form.adminKey,
      };
      await API.post("/auth/register", {
        name:     googleUserData.name,
        email:    googleUserData.email,
        password: googleUserData.fbU.uid,
        role,
        ...extraData,
      });
      const res = await API.post("/firebase-auth", {
        idToken:   googleUserData.idToken,
        role,
        extraData,
      });
      login(res.data.token, res.data.user);
      toast.success(`🎉 Welcome, ${res.data.user.name}!`);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete signup");
    } finally { setLoading(false); }
  };

  const switchRole = (r) => {
    setRole(r);
    setForm(p => ({ ...p, rollNumber:"", year:"", semester:"", department:"", TeacherIdNumber:"", designation:"", adminKey:"" }));
  };

  // ── VERIFY SCREEN ──────────────────────────────────────────────────────────
  if (step === "verify") return (
    <div className="w-full space-y-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center text-4xl">📧</div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">✓</div>
        </div>
        <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
        <p className="text-gray-400 text-sm">We sent a link to</p>
        <p className="text-yellow-500 font-bold">{form.email}</p>
      </div>

      {/* Auto-detect badge */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <p className="text-blue-400 text-xs font-semibold">
          Auto-detecting verification... you'll be logged in automatically once verified.
        </p>
      </div>

      {/* Steps */}
      <div className="bg-richblack-800 rounded-xl p-4 text-left space-y-3 border border-white/10">
        {["Open your email inbox","Find email from Firebase","Click the verification link","Return here — you'll auto-login!"].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-500 text-black text-xs font-black flex items-center justify-center shrink-0">{i+1}</div>
            <p className="text-gray-300 text-sm">{s}</p>
          </div>
        ))}
      </div>

      {verifying && (
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Logging you in...
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => sendEmailVerification(fbUser).then(() => toast.success("Resent!"))}
          className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition">
          📨 Resend
        </button>
        <button onClick={manualVerify} disabled={verifying}
          className="flex-1 bg-yellow-500 text-black py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 transition disabled:opacity-60">
          {verifying ? "Checking..." : "✅ I've Verified"}
        </button>
      </div>

      <button onClick={async () => { clearInterval(pollRef.current); if(fbUser) await deleteUser(fbUser).catch(()=>{}); setStep("form"); }}
        className="text-xs text-gray-500 hover:text-red-400 transition">✕ Cancel signup</button>
    </div>
  );

  // ── GOOGLE ROLE SELECTION ──────────────────────────────────────────────────
  if (step === "role") return (
    <form onSubmit={completeGoogleSignup} className="w-full space-y-5">
      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-emerald-400 font-semibold text-sm">Google account connected!</p>
          <p className="text-gray-400 text-xs">{googleUserData?.email}</p>
        </div>
      </div>

      <p className="text-white font-bold text-center">Complete Your Profile</p>

      {/* Role tabs */}
      <div className="flex bg-richblack-800 p-1 rounded-full">
        {["student","teacher","admin"].map(r => (
          <button key={r} type="button" onClick={() => switchRole(r)}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${role===r ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}>
            {r.charAt(0).toUpperCase()+r.slice(1)}
          </button>
        ))}
      </div>

      {role === "student" && <>
        <div className="relative">
          <select name="department" value={form.department}
            onChange={(e) => setForm(p=>({...p,department:e.target.value,rollNumber:""}))}
            required className="bg-richblack-800 text-white px-4 py-3 rounded-xl w-full outline-none border border-white/10 appearance-none">
            <option value="">Select Department</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
        </div>
        <div className="relative">
          <select name="semester" value={form.semester||""}
            onChange={(e) => { const s=e.target.value; setForm(p=>({...p,semester:s,year:String(Math.ceil(Number(s)/2))})); }}
            required className="bg-richblack-800 text-white px-4 py-3 rounded-xl w-full outline-none border border-white/10 appearance-none">
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map(s=>(
              <option key={s} value={s}>Semester {s} (Year {Math.ceil(s/2)})</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
        </div>
        {form.year && <div className="bg-richblack-800 border border-yellow-500/20 rounded-xl px-4 py-3 text-sm text-gray-300">📅 Year <strong className="text-yellow-400">{form.year}</strong> auto-filled</div>}
        <div className="space-y-1">
          <Input name="rollNumber" placeholder="6-digit Roll Number" value={form.rollNumber}
            onChange={(e) => setForm(p=>({...p,rollNumber:e.target.value.replace(/\D/g,"").slice(0,6)}))}
            required icon="🎫" />
          {form.department && <p className="text-xs text-gray-500 pl-1">{generateRollHint(form.department, form.year)}</p>}
        </div>
        {form.department && (
          <div className="bg-richblack-800 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-yellow-500 text-xs font-semibold mb-2">📚 {form.department} Courses</p>
            <div className="flex flex-wrap gap-1.5">
              {DEPT_COURSES[form.department]?.map(c=><span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">{c}</span>)}
            </div>
          </div>
        )}
      </>}

      {role === "teacher" && <>
        <Input name="TeacherIdNumber" placeholder="Teacher ID" value={form.TeacherIdNumber} onChange={ch} required icon="🪪" />
        <div className="relative">
          <select name="department" value={form.department} onChange={ch} required
            className="bg-richblack-800 text-white px-4 py-3 rounded-xl w-full outline-none border border-white/10 appearance-none">
            <option value="">Select Department</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
        </div>
        <Input name="designation" placeholder="Designation" value={form.designation} onChange={ch} required icon="👨‍🏫" />
      </>}

      {role === "admin" && <Input name="adminKey" type="password" placeholder="Admin Secret Key" value={form.adminKey} onChange={ch} required icon="🔑" />}

      <button type="submit" disabled={loading}
        className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition disabled:opacity-60">
        {loading ? "Setting up account..." : "🚀 Complete & Login"}
      </button>
    </form>
  );

  // ── MAIN FORM ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-5">

      {/* Mode tabs */}
      <div className="flex bg-richblack-800 p-1 rounded-full">
        {[["login","Sign In"],["signup","Register"]].map(([m, label]) => (
          <button key={m} type="button" onClick={() => { setMode(m); setStep("form"); }}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition ${mode===m ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Google Button */}
      <GoogleBtn onClick={handleGoogle} loading={gLoading}
        label={mode === "login" ? "Continue with Google" : "Sign up with Google"} />

      <Divider text="or continue with email" />

      {/* Role tabs (signup only) */}
      {mode === "signup" && (
        <div className="flex bg-richblack-800 p-1 rounded-full">
          {["student","teacher","admin"].map(r => (
            <button key={r} type="button" onClick={() => switchRole(r)}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition ${role===r ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}>
              {r.charAt(0).toUpperCase()+r.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={mode === "login" ? handleEmailLogin : handleEmailSignup} className="space-y-3">
        {mode === "signup" && (
          <Input name="name" label="Full Name" placeholder="Your full name" value={form.name} onChange={ch} required icon="👤" />
        )}
        <Input name="email" type="email" label="Email" placeholder="college@bce.ac.in" value={form.email} onChange={ch} required icon="✉️" />
        <Input name="password" type="password" label="Password" placeholder={mode==="login" ? "Your password" : "Min 6 characters"} value={form.password} onChange={ch} required icon="🔒" />

        {mode === "signup" && (
          <Input name="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter password" value={form.confirmPassword} onChange={ch} required icon="🔒" />
        )}

        {/* Signup extra fields */}
        {mode === "signup" && role === "student" && <>
          {/* Department */}
          <div className="relative">
            <select name="department" value={form.department} onChange={ch} required
              className="bg-richblack-800 text-white px-4 py-3 rounded-xl w-full outline-none border border-white/10 focus:border-yellow-500/60 appearance-none text-sm">
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
          </div>

          {/* Semester → auto-fills year */}
          <div className="relative">
            <select name="semester" value={form.semester} onChange={(e) => {
              const sem = e.target.value;
              const yr  = sem ? String(semesterToYear(sem)) : "";
              setForm(p => ({ ...p, semester: sem, year: yr }));
            }} required
              className="bg-richblack-800 text-white px-4 py-3 rounded-xl w-full outline-none border border-white/10 focus:border-yellow-500/60 appearance-none text-sm">
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s} (Year {semesterToYear(s)})</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
          </div>

          {/* Auto-filled year display */}
          {form.year && (
            <div className="bg-richblack-800 border border-yellow-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-yellow-500">📅</span>
              <span className="text-gray-300 text-sm">Year <strong className="text-yellow-500">{form.year}</strong> (auto-filled from Semester {form.semester})</span>
            </div>
          )}

          {/* Roll Number with validation */}
          <div className="space-y-1">
            <Input name="rollNumber" placeholder="6-digit Roll Number" value={form.rollNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g,"").slice(0,6);
                setForm(p => ({ ...p, rollNumber: val }));
              }}
              required icon="🎫" />
            {form.department && form.year && (
              <p className="text-xs text-gray-500 pl-1">
                {generateRollHint(form.department, form.year)}
              </p>
            )}
            {form.rollNumber.length === 6 && form.department && (() => {
              const err = validateRollNumber(form.rollNumber, form.department);
              return err
                ? <p className="text-xs text-red-400 pl-1">⚠ {err}</p>
                : <p className="text-xs text-emerald-400 pl-1">✓ Valid roll number</p>;
            })()}
          </div>

          {/* Courses preview */}
          {form.department && (
            <div className="bg-richblack-800 border border-yellow-500/20 rounded-xl p-3">
              <p className="text-yellow-500 text-xs font-semibold mb-2">📚 Courses for {form.department}</p>
              <div className="flex flex-wrap gap-1.5">
                {DEPT_COURSES[form.department]?.map(c => <span key={c} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">{c}</span>)}
              </div>
            </div>
          )}
        </>}

        {mode === "signup" && role === "teacher" && <>
          <Input name="TeacherIdNumber" placeholder="Teacher ID" value={form.TeacherIdNumber} onChange={ch} required icon="🪪" />
          <div className="relative">
            <select name="department" value={form.department} onChange={ch} required
              className="bg-richblack-800 text-white px-4 py-3 rounded-xl w-full outline-none border border-white/10 appearance-none text-sm">
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">▼</span>
          </div>
          <Input name="designation" placeholder="Designation (e.g. Asst. Professor)" value={form.designation} onChange={ch} required icon="👨‍🏫" />
        </>}

        {mode === "signup" && role === "admin" && (
          <Input name="adminKey" type="password" placeholder="Admin Secret Key" value={form.adminKey} onChange={ch} required icon="🔑" />
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition disabled:opacity-60 mt-1">
          {loading
            ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>{mode==="login" ? "Signing in..." : "Sending verification..."}</span>
            : mode === "login" ? "Sign In →" : `Register as ${role.charAt(0).toUpperCase()+role.slice(1)} →`}
        </button>
      </form>

      {mode === "login" && (
        <p className="text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <button onClick={() => setMode("signup")} className="text-yellow-500 font-semibold hover:text-yellow-400 transition">Register here</button>
        </p>
      )}
      {mode === "signup" && (
        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <button onClick={() => setMode("login")} className="text-yellow-500 font-semibold hover:text-yellow-400 transition">Sign in</button>
        </p>
      )}
    </div>
  );
};

export default UnifiedAuth;