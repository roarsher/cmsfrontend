 // src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ role }) => {
  const activeLink = "text-yellow-500 font-semibold";

  return (
    <div className="h-screen w-64 bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">College ERP</h1>

      <nav className="flex flex-col gap-4">
        <NavLink to={`/${role}`} className={({ isActive }) => (isActive ? activeLink : "")}>
          Dashboard
        </NavLink>

        {role === "student" && (
          <>
            <NavLink to="/student/attendance" className={({ isActive }) => (isActive ? activeLink : "")}>
              My Attendance
            </NavLink>
            <NavLink to="/student/marks" className={({ isActive }) => (isActive ? activeLink : "")}>
              My Marks
            </NavLink>
          </>
        )}

        {role === "teacher" && (
          <>
            <NavLink to="/teacher/add-marks" className={({ isActive }) => (isActive ? activeLink : "")}>
              Upload Marks
            </NavLink>
          </>
        )}

        {role === "admin" && (
          <>
            <NavLink to="/admin/managestudents" className={({ isActive }) => (isActive ? activeLink : "")}>
              Manage Students
            </NavLink>
            <NavLink to="/admin/manageteachers" className={({ isActive }) => (isActive ? activeLink : "")}>
              Manage Faculty
            </NavLink>
            <NavLink to="/admin/notices" className={({ isActive }) => (isActive ? activeLink : "")}>
              Notices
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
