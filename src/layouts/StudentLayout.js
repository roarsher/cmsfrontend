 import React from "react";
import { Outlet } from "react-router-dom";
import Navbars from "../components/layout/Navbars";

const StudentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbars />

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;