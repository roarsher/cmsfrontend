 

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const STUDENT_LINKS = [
  { label: "Dashboard",  path: "/student" },
  { label: "Attendance", path: "/student/attendance" },
  { label: "Marks",      path: "/student/marks" },
  { label: "Fees",       path: "/student/fees" },
];

const TEACHER_LINKS = [
  { label: "Dashboard",  path: "/teacher" },
];

const ADMIN_LINKS = [
  { label: "Dashboard",  path: "/admin" },
  { label: "Students",   path: "/admin/managestudents" },
  { label: "Teachers",   path: "/admin/manageteachers" },
  { label: "Fees",       path: "/admin/fees" },
  { label: "Notices",    path: "/admin/notices" },
];

const Navbars = ({ title }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning 🌅";
    if (h < 17) return "Good Afternoon ☀️";
    if (h < 20) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

  const links =
    user?.role === "student" ? STUDENT_LINKS :
    user?.role === "teacher" ? TEACHER_LINKS :
    user?.role === "admin"   ? ADMIN_LINKS   : [];

  const isActive = (path) =>
    path === `/${user?.role}`
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <div className="bg-white shadow-sm border-b border-slate-100">
      <div className="flex items-center justify-between px-6 py-3">

        {/* Left — greeting */}
        <span className="font-medium text-slate-600 flex items-center gap-1 text-sm">
          {getGreeting()} &nbsp;
          <span className="font-bold text-slate-800">{user?.name}</span>
        </span>

        {/* Center — nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                isActive(l.path)
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right — role badge + logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full capitalize border border-yellow-200">
            {user?.role}
          </span>
          <button
            onClick={() => { logout?.(); navigate("/login"); }}
            className="text-xs font-semibold text-slate-500 hover:text-red-500 transition"
          >
            Logout
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => { navigate(l.path); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition ${
                isActive(l.path)
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbars;