// // src/layouts/TeacherLayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbars from "../components/layout/Navbars";
// import Sidebar from "../components/layout/Sidebar";

// const TeacherLayout = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-200">
//       {/* Sidebar */}
//       <Sidebar role="teacher" />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Navbar */}
//         <Navbars />

//         {/* Page Content */}
//         <main className="p-6">
//           <Outlet /> {/* TeacherDashboard, AddMarks */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default TeacherLayout;
import React from "react";
import { Outlet } from "react-router-dom";
import Navbars from "../components/layout/Navbars";

const TeacherLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      {/* Top Navbar */}
      <Navbars />

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;