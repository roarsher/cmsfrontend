


// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import {
//   RadialBarChart, RadialBar, ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, Tooltip, Cell
// } from "recharts";

// // ── Icons ─────────────────────────────────────────────────────────────────────
// const Icons = {
//   User: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
//       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
//     </svg>
//   ),
//   Book: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
//       <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
//     </svg>
//   ),
//   Calendar: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
//       <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
//       <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
//     </svg>
//   ),
//   Award: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
//       <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
//     </svg>
//   ),
//   TrendUp: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
//       <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
//     </svg>
//   ),
//   Alert: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
//       <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
//       <line x1="12" y1="16" x2="12.01" y2="16"/>
//     </svg>
//   ),
//   Star: () => (
//     <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//     </svg>
//   ),
//   Check: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
//       <polyline points="20 6 9 17 4 12"/>
//     </svg>
//   ),
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const getInitials = (name = "") =>
//   name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// const getGrade = (marks) => {
//   if (marks >= 90) return { grade: "A+", color: "text-emerald-500" };
//   if (marks >= 80) return { grade: "A",  color: "text-emerald-400" };
//   if (marks >= 70) return { grade: "B+", color: "text-blue-500"    };
//   if (marks >= 60) return { grade: "B",  color: "text-blue-400"    };
//   if (marks >= 50) return { grade: "C",  color: "text-amber-500"   };
//   return                   { grade: "F",  color: "text-red-500"     };
// };

// const getAttBg = (pct) => {
//   if (pct >= 85) return "#10b981";
//   if (pct >= 75) return "#f59e0b";
//   return "#ef4444";
// };

// // ── Stat Card ─────────────────────────────────────────────────────────────────
// const StatCard = ({ icon: Icon, label, value, sub, gradient, delay = 0 }) => (
//   <div
//     className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
//     style={{ background: gradient, animationDelay: `${delay}ms` }}
//   >
//     <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white opacity-5 -mr-8 -mt-8" />
//     <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white opacity-5 -ml-4 -mb-4" />
//     <div className="relative z-10">
//       <div className="bg-white/20 inline-flex p-2 rounded-xl mb-3"><Icon /></div>
//       <p className="text-2xl font-bold">{value}</p>
//       <p className="text-sm font-medium opacity-80">{label}</p>
//       {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
//     </div>
//   </div>
// );

// // ── Attendance Ring ───────────────────────────────────────────────────────────
// const AttendanceRing = ({ pct }) => {
//   const color = getAttBg(pct);
//   return (
//     <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
//       <ResponsiveContainer width="100%" height="100%">
//         <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: pct, fill: color }]} startAngle={90} endAngle={-270}>
//           <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f1f5f9" }} />
//         </RadialBarChart>
//       </ResponsiveContainer>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-black" style={{ color }}>{pct}%</span>
//         <span className="text-xs text-gray-400 font-medium">Attendance</span>
//       </div>
//     </div>
//   );
// };

// // ── Quick Action ──────────────────────────────────────────────────────────────
// const QuickAction = ({ icon: Icon, label, desc, color, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] hover:shadow-md text-left ${color}`}
//   >
//     <div className="p-2.5 rounded-xl bg-current bg-opacity-10 shrink-0">
//       <Icon />
//     </div>
//     <div>
//       <p className="text-sm font-bold">{label}</p>
//       <p className="text-xs opacity-60">{desc}</p>
//     </div>
//   </button>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// const StudentDashboard = () => {
//   const { user, loading: authLoading } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [profile, setProfile]     = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [marks, setMarks]         = useState([]);
//   const [loading, setLoading]     = useState(true);

//   useEffect(() => {
//     if (!user) return;
//     const fetchAll = async () => {
//       try {
//         const [profRes, attRes, marksRes] = await Promise.allSettled([
//           API.get("/student/profile"),
//           API.get("/attendance/my"),
//           API.get("/marks/my-marks"),
//         ]);

//         if (profRes.status === "fulfilled")  setProfile(profRes.value.data);
//         if (attRes.status === "fulfilled")   setAttendance(attRes.value.data || []);
//         if (marksRes.status === "fulfilled") setMarks(marksRes.value.data || []);
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, [user]);

//   if (authLoading || loading)
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
//       </div>
//     );

//   // ── Derived stats ────────────────────────────────────────────────────────
//   const studentData = profile || user;
//   const totalClasses   = attendance.length;
//   const presentCount   = attendance.filter((a) => a.status === "Present").length;
//   const attendancePct  = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
//   const avgMarks       = marks.length > 0
//     ? Math.round(marks.reduce((s, m) => s + (m.marks || 0), 0) / marks.length) : 0;
//   const topSubject     = marks.length > 0
//     ? [...marks].sort((a, b) => b.marks - a.marks)[0] : null;

//   // Bar chart data
//   const barData = marks.map((m) => ({
//     name: m.course?.name?.split(" ")[0] || "Subject",
//     Marks: m.marks || 0,
//   }));

//   // Recent attendance (last 5)
//   const recentAtt = [...attendance].reverse().slice(0, 5);

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 space-y-6">

//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-3xl font-extrabold text-slate-800">
//             👋 Hello, <span className="text-indigo-600">{studentData?.name || "Student"}</span>
//           </h1>
//           <p className="text-sm text-slate-400 mt-1">
//             {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
//             {getInitials(studentData?.name)}
//           </div>
//           <div>
//             <p className="text-sm font-bold text-slate-700">{studentData?.rollNumber}</p>
//             <p className="text-xs text-slate-400">{studentData?.department} · Year {studentData?.year}</p>
//           </div>
//         </div>
//       </div>

//       {/* ── Stat Cards ── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard icon={Icons.Calendar} label="Attendance"    value={`${attendancePct}%`}  sub={`${presentCount}/${totalClasses} classes`}  gradient="linear-gradient(135deg,#6366f1,#8b5cf6)" delay={0}   />
//         <StatCard icon={Icons.Award}    label="Avg. Marks"    value={`${avgMarks}/100`}     sub="All subjects"                               gradient="linear-gradient(135deg,#0ea5e9,#6366f1)" delay={100} />
//         <StatCard icon={Icons.Book}     label="Subjects"      value={marks.length}          sub="Enrolled courses"                           gradient="linear-gradient(135deg,#10b981,#0ea5e9)" delay={200} />
//         <StatCard icon={Icons.Star}     label="Top Subject"   value={topSubject?.marks ?? "—"} sub={topSubject?.course?.name?.split(" ")[0] || "N/A"} gradient="linear-gradient(135deg,#f59e0b,#ef4444)" delay={300} />
//       </div>

//       {/* ── Middle Row: Attendance Ring + Quick Actions + Profile ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//         {/* Attendance Visual */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4">
//           <h2 className="text-lg font-bold text-slate-700 self-start">🎯 Attendance Overview</h2>
//           <AttendanceRing pct={attendancePct} />
//           <div className="w-full space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-slate-500">Present</span>
//               <span className="font-bold text-emerald-600">{presentCount} classes</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-slate-500">Absent</span>
//               <span className="font-bold text-red-500">{totalClasses - presentCount} classes</span>
//             </div>
//             <div className="flex justify-between text-sm border-t pt-2">
//               <span className="text-slate-500">Total</span>
//               <span className="font-bold text-slate-700">{totalClasses} classes</span>
//             </div>
//           </div>
//           {attendancePct < 75 && (
//             <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600 text-xs font-medium">
//               <Icons.Alert />
//               Attendance below 75%! You need {Math.ceil((0.75 * totalClasses - presentCount) / 0.25)} more classes.
//             </div>
//           )}
//           {attendancePct >= 75 && (
//             <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-600 text-xs font-medium">
//               <Icons.Check />
//               Good standing! Keep it up.
//             </div>
//           )}
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
//           <h2 className="text-lg font-bold text-slate-700 mb-4">⚡ Quick Access</h2>
//           <div className="space-y-3">
//             <QuickAction
//               icon={Icons.Calendar}
//               label="My Attendance"
//               desc="View full attendance record"
//               color="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
//               onClick={() => navigate("/student/attendance")}
//             />
//             <QuickAction
//               icon={Icons.Book}
//               label="My Marks"
//               desc="View all subject scores"
//               color="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
//               onClick={() => navigate("/student/marks")}
//             />
//             <QuickAction
//               icon={Icons.Award}
//               label="My Performance"
//               desc={`Avg: ${avgMarks}/100 · ${attendancePct}% attendance`}
//               color="border-amber-200 text-amber-600 hover:bg-amber-50"
//               onClick={() => navigate("/student/marks")}
//             />
//           </div>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
//           <h2 className="text-lg font-bold text-slate-700 mb-4">🪪 My Profile</h2>
//           <div className="flex flex-col items-center gap-3 mb-4">
//             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
//               {getInitials(studentData?.name)}
//             </div>
//             <div className="text-center">
//               <p className="font-bold text-slate-800">{studentData?.name}</p>
//               <p className="text-xs text-slate-400">{studentData?.email}</p>
//             </div>
//           </div>
//           <div className="space-y-2.5">
//             {[
//               ["Roll Number",  studentData?.rollNumber],
//               ["Department",   studentData?.department],
//               ["Year",         studentData?.year ? `Year ${studentData.year}` : "—"],
//               ["Role",         "Student"],
//             ].map(([label, val]) => (
//               <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
//                 <span className="text-xs text-slate-400 font-medium">{label}</span>
//                 <span className="text-xs font-bold text-slate-700">{val || "—"}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Bottom Row: Marks Chart + Recent Attendance ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//         {/* Marks Bar Chart */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
//           <h2 className="text-lg font-bold text-slate-700 mb-4">📊 Marks by Subject</h2>
//           {marks.length === 0 ? (
//             <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No marks available yet</div>
//           ) : (
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={barData} barSize={32}>
//                 <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} />
//                 <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} />
//                 <Tooltip
//                   contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
//                   cursor={{ fill: "#f1f5f9" }}
//                 />
//                 <Bar dataKey="Marks" radius={[8, 8, 0, 0]}>
//                   {barData.map((entry, i) => (
//                     <Cell key={i} fill={entry.Marks >= 75 ? "#6366f1" : entry.Marks >= 50 ? "#f59e0b" : "#ef4444"} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Recent Attendance */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
//           <h2 className="text-lg font-bold text-slate-700 mb-4">🗓 Recent Attendance</h2>
//           {recentAtt.length === 0 ? (
//             <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No attendance records yet</div>
//           ) : (
//             <div className="space-y-2">
//               {recentAtt.map((a) => (
//                 <div key={a._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
//                   <div>
//                     <p className="text-sm font-semibold text-slate-700">{a.course?.name || "Subject"}</p>
//                     <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
//                   </div>
//                   <span className={`text-xs font-bold px-3 py-1 rounded-full ${
//                     a.status === "Present"
//                       ? "bg-emerald-100 text-emerald-700"
//                       : "bg-red-100 text-red-600"
//                   }`}>
//                     {a.status === "Present" ? "✓ Present" : "✗ Absent"}
//                   </span>
//                 </div>
//               ))}
//               <button
//                 onClick={() => navigate("/student/attendance")}
//                 className="w-full text-center text-xs text-indigo-500 hover:text-indigo-700 font-semibold mt-2 py-2"
//               >
//                 View all attendance →
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Marks Summary Table ── */}
//       {marks.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="p-5 border-b border-slate-100">
//             <h2 className="text-lg font-bold text-slate-700">📋 Subject-wise Performance</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
//                 <tr>
//                   <th className="px-5 py-3 text-left">Subject</th>
//                   <th className="px-5 py-3 text-center">Marks</th>
//                   <th className="px-5 py-3 text-center">Grade</th>
//                   <th className="px-5 py-3 text-center">Progress</th>
//                   <th className="px-5 py-3 text-center">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {marks.map((m) => {
//                   const { grade, color } = getGrade(m.marks || 0);
//                   return (
//                     <tr key={m._id} className="hover:bg-slate-50 transition">
//                       <td className="px-5 py-3">
//                         <p className="font-semibold text-slate-800">{m.course?.name || "—"}</p>
//                         <p className="text-xs text-slate-400">{m.course?.code || ""}</p>
//                       </td>
//                       <td className="px-5 py-3 text-center font-bold text-slate-700">{m.marks}<span className="text-slate-400 font-normal">/100</span></td>
//                       <td className={`px-5 py-3 text-center font-black text-lg ${color}`}>{grade}</td>
//                       <td className="px-5 py-3">
//                         <div className="flex items-center gap-2">
//                           <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
//                             <div
//                               className="h-full rounded-full transition-all"
//                               style={{ width: `${m.marks}%`, background: m.marks >= 75 ? "#6366f1" : m.marks >= 50 ? "#f59e0b" : "#ef4444" }}
//                             />
//                           </div>
//                           <span className="text-xs text-slate-400 w-8">{m.marks}%</span>
//                         </div>
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         {m.marks >= 75
//                           ? <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">✓ Pass</span>
//                           : m.marks >= 50
//                           ? <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium">~ Average</span>
//                           : <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">✗ Fail</span>}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;

import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Book: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const getGrade = (marks) => {
  if (marks >= 90) return { grade: "A+", color: "text-emerald-500" };
  if (marks >= 80) return { grade: "A",  color: "text-emerald-400" };
  if (marks >= 70) return { grade: "B+", color: "text-blue-500"    };
  if (marks >= 60) return { grade: "B",  color: "text-blue-400"    };
  if (marks >= 50) return { grade: "C",  color: "text-amber-500"   };
  return                   { grade: "F",  color: "text-red-500"     };
};

const getAttBg = (pct) => {
  if (pct >= 85) return "#10b981";
  if (pct >= 75) return "#f59e0b";
  return "#ef4444";
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, gradient, delay = 0 }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
    style={{ background: gradient, animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white opacity-5 -mr-8 -mt-8" />
    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white opacity-5 -ml-4 -mb-4" />
    <div className="relative z-10">
      <div className="bg-white/20 inline-flex p-2 rounded-xl mb-3"><Icon /></div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium opacity-80">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  </div>
);

// ── Attendance Ring ───────────────────────────────────────────────────────────
const AttendanceRing = ({ pct }) => {
  const color = getAttBg(pct);
  return (
    <div className="relative flex items-center justify-center" style={{ width: 130, height: 130 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: pct, fill: color }]} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f1f5f9" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{pct}%</span>
        <span className="text-xs text-gray-400 font-medium">Attendance</span>
      </div>
    </div>
  );
};

// ── Quick Action ──────────────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, desc, color, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] hover:shadow-md text-left ${color}`}
  >
    <div className="p-2.5 rounded-xl bg-current bg-opacity-10 shrink-0">
      <Icon />
    </div>
    <div>
      <p className="text-sm font-bold">{label}</p>
      <p className="text-xs opacity-60">{desc}</p>
    </div>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile]     = useState(null);
  const [courses, setCourses]     = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks]         = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      try {
        const [profRes, attRes, marksRes] = await Promise.allSettled([
          API.get("/student/profile"),
          API.get("/attendance/my"),
          API.get("/marks/my-marks"),
        ]);

        if (profRes.status === "fulfilled") {
          const d = profRes.value.data;
          setProfile(d);
          setCourses(d.courses || []);
        }
        if (attRes.status === "fulfilled")   setAttendance(attRes.value.data || []);
        if (marksRes.status === "fulfilled") setMarks(marksRes.value.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  if (authLoading || loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );

  // ── Derived stats ────────────────────────────────────────────────────────
  const studentData = profile || user;
  const totalClasses   = attendance.length;
  const presentCount   = attendance.filter((a) => a.status === "Present").length;
  const attendancePct  = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
  const avgMarks       = marks.length > 0
    ? Math.round(marks.reduce((s, m) => s + (m.marks || 0), 0) / marks.length) : 0;
  const topSubject     = marks.length > 0
    ? [...marks].sort((a, b) => b.marks - a.marks)[0] : null;

  // Bar chart data
  const barData = marks.map((m) => ({
    name: m.course?.name?.split(" ")[0] || "Subject",
    Marks: m.marks || 0,
  }));

  // Recent attendance (last 5)
  const recentAtt = [...attendance].reverse().slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            👋 Hello, <span className="text-indigo-600">{studentData?.name || "Student"}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
            {getInitials(studentData?.name)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">{studentData?.rollNumber}</p>
            <p className="text-xs text-slate-400">{studentData?.department} · Year {studentData?.year}</p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Icons.Calendar} label="Attendance"    value={`${attendancePct}%`}  sub={`${presentCount}/${totalClasses} classes`}  gradient="linear-gradient(135deg,#6366f1,#8b5cf6)" delay={0}   />
        <StatCard icon={Icons.Award}    label="Avg. Marks"    value={`${avgMarks}/100`}     sub="All subjects"                               gradient="linear-gradient(135deg,#0ea5e9,#6366f1)" delay={100} />
        <StatCard icon={Icons.Book}     label="Subjects"      value={courses.length}        sub="Enrolled courses"                           gradient="linear-gradient(135deg,#10b981,#0ea5e9)" delay={200} />
        <StatCard icon={Icons.Star}     label="Top Subject"   value={topSubject?.marks ?? "—"} sub={topSubject?.course?.name?.split(" ")[0] || "N/A"} gradient="linear-gradient(135deg,#f59e0b,#ef4444)" delay={300} />
      </div>

      {/* ── Middle Row: Attendance Ring + Quick Actions + Profile ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Attendance Visual */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4">
          <h2 className="text-lg font-bold text-slate-700 self-start">🎯 Attendance Overview</h2>
          <AttendanceRing pct={attendancePct} />
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Present</span>
              <span className="font-bold text-emerald-600">{presentCount} classes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Absent</span>
              <span className="font-bold text-red-500">{totalClasses - presentCount} classes</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-slate-500">Total</span>
              <span className="font-bold text-slate-700">{totalClasses} classes</span>
            </div>
          </div>
          {attendancePct < 75 && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600 text-xs font-medium">
              <Icons.Alert />
              Attendance below 75%! You need {Math.ceil((0.75 * totalClasses - presentCount) / 0.25)} more classes.
            </div>
          )}
          {attendancePct >= 75 && (
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-600 text-xs font-medium">
              <Icons.Check />
              Good standing! Keep it up.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-4">⚡ Quick Access</h2>
          <div className="space-y-3">
            <QuickAction
              icon={Icons.Calendar}
              label="My Attendance"
              desc="View full attendance record"
              color="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={() => navigate("/student/attendance")}
            />
            <QuickAction
              icon={Icons.Book}
              label="My Marks"
              desc="View all subject scores"
              color="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={() => navigate("/student/marks")}
            />
            <QuickAction
              icon={Icons.Award}
              label="My Performance"
              desc={`Avg: ${avgMarks}/100 · ${attendancePct}% attendance`}
              color="border-amber-200 text-amber-600 hover:bg-amber-50"
              onClick={() => navigate("/student/marks")}
            />
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-4">🪪 My Profile</h2>
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              {getInitials(studentData?.name)}
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800">{studentData?.name}</p>
              <p className="text-xs text-slate-400">{studentData?.email}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              ["Roll Number",  studentData?.rollNumber],
              ["Department",   studentData?.department],
              ["Year",         studentData?.year ? `Year ${studentData.year}` : "—"],
              ["Role",         "Student"],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-400 font-medium">{label}</span>
                <span className="text-xs font-bold text-slate-700">{val || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Marks Chart + Recent Attendance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Marks Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-4">📊 Marks by Subject</h2>
          {marks.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No marks available yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="Marks" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.Marks >= 75 ? "#6366f1" : entry.Marks >= 50 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-4">🗓 Recent Attendance</h2>
          {recentAtt.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No attendance records yet</div>
          ) : (
            <div className="space-y-2">
              {recentAtt.map((a) => (
                <div key={a._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{a.course?.name || "Subject"}</p>
                    <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    a.status === "Present"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {a.status === "Present" ? "✓ Present" : "✗ Absent"}
                  </span>
                </div>
              ))}
              <button
                onClick={() => navigate("/student/attendance")}
                className="w-full text-center text-xs text-indigo-500 hover:text-indigo-700 font-semibold mt-2 py-2"
              >
                View all attendance →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Marks Summary Table ── */}
      {marks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-700">📋 Subject-wise Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-center">Marks</th>
                  <th className="px-5 py-3 text-center">Grade</th>
                  <th className="px-5 py-3 text-center">Progress</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {marks.map((m) => {
                  const { grade, color } = getGrade(m.marks || 0);
                  return (
                    <tr key={m._id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-800">{m.course?.name || "—"}</p>
                        <p className="text-xs text-slate-400">{m.course?.code || ""}</p>
                      </td>
                      <td className="px-5 py-3 text-center font-bold text-slate-700">{m.marks}<span className="text-slate-400 font-normal">/100</span></td>
                      <td className={`px-5 py-3 text-center font-black text-lg ${color}`}>{grade}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${m.marks}%`, background: m.marks >= 75 ? "#6366f1" : m.marks >= 50 ? "#f59e0b" : "#ef4444" }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8">{m.marks}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        {m.marks >= 75
                          ? <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">✓ Pass</span>
                          : m.marks >= 50
                          ? <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium">~ Average</span>
                          : <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">✗ Fail</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Enrolled Courses ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-700">📚 My Enrolled Courses</h2>
          <p className="text-xs text-slate-400 mt-1">{courses.length} courses assigned to {profile?.department || user?.department} department</p>
        </div>
        <div className="p-5">
          {courses.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No courses assigned yet. Please contact admin.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map((c, i) => {
                // find marks for this course
                const courseMarks = marks.find((m) => m.course?._id === c._id || m.course === c._id);
                const colors = [
                  "from-indigo-500 to-purple-500",
                  "from-emerald-500 to-teal-500",
                  "from-orange-500 to-amber-500",
                  "from-blue-500 to-cyan-500",
                  "from-pink-500 to-rose-500",
                  "from-violet-500 to-indigo-500",
                ];
                const grad = colors[i % colors.length];
                return (
                  <div key={c._id} className="relative overflow-hidden rounded-2xl border border-slate-100 hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className={`h-2 w-full bg-gradient-to-r ${grad}`} />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 leading-tight">{c.name}</p>
                          <p className="text-xs text-slate-400 mt-1 font-mono">{c.code}</p>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">{c.department}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {courseMarks ? (
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            courseMarks.marks >= 75 ? "bg-emerald-100 text-emerald-700"
                            : courseMarks.marks >= 50 ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-600"
                          }`}>
                            {courseMarks.marks}/100
                          </span>
                        ) : (
                          <span className="text-xs bg-slate-100 text-slate-400 px-2 py-1 rounded-full">No marks yet</span>
                        )}
                        <span className="text-xs text-slate-400">Year {profile?.year || user?.year}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;