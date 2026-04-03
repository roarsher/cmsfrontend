//  // src/pages/public/Home.jsx
// import React from "react";
// import Bg from "../../components/layout/Bg";
// import { motion } from "framer-motion";

// import {
//   FaUserGraduate,
//   FaChalkboardTeacher,
//   FaClipboardCheck,
//   FaFileAlt,
//   FaMoneyBillWave,
//   FaBullhorn,
// } from "react-icons/fa";

// const features = [
//   {
//     title: "Student Management",
//     desc: "Manage student profiles, admissions, enrollment, and academic records.",
//     icon: <FaUserGraduate />,
//   },
//   {
//     title: "Faculty Management",
//     desc: "Handle faculty details, subject allocation, and teaching schedules.",
//     icon: <FaChalkboardTeacher />,
//   },
//   {
//     title: "Attendance System",
//     desc: "Track daily attendance with subject-wise and student-wise reports.",
//     icon: <FaClipboardCheck />,
//   },
//   {
//     title: "Examination & Results",
//     desc: "Manage exams, marks entry, grade calculation, and result publication.",
//     icon: <FaFileAlt />,
//   },
//   {
//     title: "Fees & Finance",
//     desc: "Handle fee structure, payments, receipts, and financial reports.",
//     icon: <FaMoneyBillWave />,
//   },
//   {
//     title: "Notices & Communication",
//     desc: "Publish notices, announcements, and academic updates.",
//     icon: <FaBullhorn />,
//   },
// ];

// function Home() {
//   return (
//     <Bg>
//       {/* HERO SECTION */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="flex flex-col items-center text-center px-4 mt-12"
//       >
//         <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-50 mb-4 drop-shadow-xl">
//           Smart College Management System (ERP)
//         </h1>
//         <p className="text-white max-w-3xl text-base md:text-lg">
//           A centralized platform to manage students, faculty, academics,
//           attendance, examinations, and administrative operations efficiently.
//         </p>
//       </motion.div>

//       {/* FEATURES GRID */}
//       <div className="mt-16 max-w-7xl mx-auto px-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((item, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.15, duration: 0.6 }}
//               viewport={{ once: true }}
//               className="bg-richblack-900/90 backdrop-blur-md border border-richblack-700
//                          p-6 rounded-2xl shadow-lg
//                          hover:shadow-yellow-200/30 hover:-translate-y-2
//                          transition-all duration-300"
//             >
//               <div className="text-yellow-50 text-3xl mb-4">{item.icon}</div>
//               <h2 className="text-xl font-semibold text-yellow-50 mb-2">{item.title}</h2>
//               <p className="text-white text-sm leading-relaxed">{item.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* FOOTER NOTE */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1.2 }}
//         className="mt-16 mb-6 text-center"
//       >
//         <p className="text-white text-sm tracking-wide">
//           © 2026 College ERP System • Final Year Project
//         </p>
//       </motion.div>
//     </Bg>
//   );
// }

// export default Home;
import React, { useEffect, useState } from "react";
import Bg from "../../components/layout/Bg";
import { motion } from "framer-motion";
import API from "../../api/axios";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaFileAlt,
  FaMoneyBillWave,
  FaBullhorn,
} from "react-icons/fa";

const features = [
  {
    title: "Student Management",
    desc: "Manage student profiles, admissions, enrollment, and academic records.",
    icon: <FaUserGraduate />,
  },
  {
    title: "Faculty Management",
    desc: "Handle faculty details, subject allocation, and teaching schedules.",
    icon: <FaChalkboardTeacher />,
  },
  {
    title: "Attendance System",
    desc: "Track daily attendance with subject-wise and student-wise reports.",
    icon: <FaClipboardCheck />,
  },
  {
    title: "Examination & Results",
    desc: "Manage exams, marks entry, grade calculation, and result publication.",
    icon: <FaFileAlt />,
  },
  {
    title: "Fees & Finance",
    desc: "Handle fee structure, payments, receipts, and financial reports.",
    icon: <FaMoneyBillWave />,
  },
  {
    title: "Notices & Communication",
    desc: "Publish notices, announcements, and academic updates.",
    icon: <FaBullhorn />,
  },
];

function Home() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await API.get("/admin/notices");
        setNotices(res.data);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      }
    };

    fetchNotices();
  }, []);

  return (
    <Bg>
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center px-4 mt-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-50 mb-4 drop-shadow-xl">
          Smart College Management System (ERP)
        </h1>
        <p className="text-white max-w-3xl text-base md:text-lg">
          A centralized platform to manage students, faculty, academics,
          attendance, examinations, and administrative operations efficiently.
        </p>
      </motion.div>

      {/* FEATURES GRID */}
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-richblack-900/90 backdrop-blur-md border border-richblack-700
                         p-6 rounded-2xl shadow-lg
                         hover:shadow-yellow-200/30 hover:-translate-y-2
                         transition-all duration-300"
            >
              <div className="text-yellow-50 text-3xl mb-4">{item.icon}</div>
              <h2 className="text-xl font-semibold text-yellow-50 mb-2">
                {item.title}
              </h2>
              <p className="text-white text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS SECTION */}
      <div className="mt-20 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-yellow-50 mb-8 text-center">
          📢 Latest Notifications
        </h2>

        <div className="space-y-6">
          {notices.length === 0 ? (
            <p className="text-white text-center">
              No notices available.
            </p>
          ) : (
            notices.slice(0, 5).map((notice, index) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-richblack-900/90 backdrop-blur-md
                           border border-richblack-700
                           p-6 rounded-xl shadow-lg
                           hover:shadow-yellow-200/30 transition-all"
              >
                <h3 className="text-lg font-semibold text-yellow-50">
                  {notice.title}
                </h3>

                <p className="text-white text-sm mt-3 leading-relaxed">
                  {notice.message}
                </p>

                <p className="text-gray-400 text-xs mt-3">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 mb-6 text-center"
      >
        <p className="text-white text-sm tracking-wide">
          © 2026 College ERP System • Final Year Project
        </p>
      </motion.div>
    </Bg>
  );
}

export default Home;
