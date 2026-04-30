//  import React, { useEffect, useState } from "react";
// import API from "../../api/axios";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE"];

// // ── Icons ─────────────────────────────────────────────────────────────────────
// const Icon = {
//   Students: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
//   Teachers: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
//   Courses:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
//   Notice:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
//   Risk:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
//   Trash:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
//   Search:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
//   AI:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>,
//   Chart:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
// };

// // ── Stat Card ─────────────────────────────────────────────────────────────────
// const StatCard = ({ icon: Ic, label, value, sub, color }) => (
//   <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} hover:shadow-md transition-all`}>
//     <div className="flex items-center justify-between mb-3">
//       <div className={`p-2 rounded-xl ${color.replace("border-", "bg-").replace("-500","-100")} text-${color.split("-")[1]}-600`}>
//         <Ic />
//       </div>
//     </div>
//     <p className="text-3xl font-black text-slate-800">{value}</p>
//     <p className="text-sm font-semibold text-slate-600 mt-1">{label}</p>
//     {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
//   </div>
// );

// // ── Tab Button ────────────────────────────────────────────────────────────────
// const Tab = ({ label, active, onClick, count }) => (
//   <button
//     onClick={onClick}
//     className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
//       active ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-100"
//     }`}
//   >
//     {label}
//     {count !== undefined && (
//       <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
//         {count}
//       </span>
//     )}
//   </button>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// const AdminDashboard = () => {
//   const [tab, setTab]             = useState("overview");
//   const [students, setStudents]   = useState([]);
//   const [teachers, setTeachers]   = useState([]);
//   const [notices, setNotices]     = useState([]);
//   const [courses, setCourses]     = useState([]);
//   const [loading, setLoading]     = useState(true);

//   // filters
//   const [studentSearch, setStudentSearch] = useState("");
//   const [studentDept, setStudentDept]     = useState("");
//   const [teacherSearch, setTeacherSearch] = useState("");
//   const [teacherDept, setTeacherDept]     = useState("");

//   // notice form
//   const [noticeTitle, setNoticeTitle]     = useState("");
//   const [noticeMsg, setNoticeMsg]         = useState("");
//   const [noticeLoading, setNoticeLoading] = useState(false);

//   // AI report
//   const [aiReport, setAiReport]           = useState("");
//   const [reportLoading, setReportLoading] = useState(false);

//   // toast
//   const [toast, setToast] = useState(null);
//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const [sRes, tRes, nRes, cRes] = await Promise.allSettled([
//         API.get("/admin/students"),
//         API.get("/admin/teachers"),
//         API.get("/admin/notices"),
//         API.get("/teacher/courses"),
//       ]);
//       if (sRes.status === "fulfilled") setStudents(sRes.value.data || []);
//       if (tRes.status === "fulfilled") setTeachers(tRes.value.data || []);
//       if (nRes.status === "fulfilled") setNotices(nRes.value.data || []);
//       if (cRes.status === "fulfilled") setCourses(cRes.value.data?.courses || []);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteStudent = async (id) => {
//     if (!window.confirm("Delete this student?")) return;
//     try {
//       await API.delete(`/admin/students/${id}`);
//       setStudents((p) => p.filter((s) => s._id !== id));
//       showToast("Student deleted");
//     } catch { showToast("Failed to delete", "error"); }
//   };

//   const deleteTeacher = async (id) => {
//     if (!window.confirm("Delete this teacher?")) return;
//     try {
//       await API.delete(`/admin/teachers/${id}`);
//       setTeachers((p) => p.filter((t) => t._id !== id));
//       showToast("Teacher deleted");
//     } catch { showToast("Failed to delete", "error"); }
//   };

//   const postNotice = async () => {
//     if (!noticeTitle.trim() || !noticeMsg.trim()) return showToast("Fill all fields", "error");
//     setNoticeLoading(true);
//     try {
//       const res = await API.post("/admin/notices", { title: noticeTitle, message: noticeMsg });
//       setNotices((p) => [res.data, ...p]);
//       setNoticeTitle(""); setNoticeMsg("");
//       showToast("Notice posted!");
//     } catch { showToast("Failed to post notice", "error"); }
//     finally { setNoticeLoading(false); }
//   };

//   const deleteNotice = async (id) => {
//     try {
//       await API.delete(`/admin/notices/${id}`);
//       setNotices((p) => p.filter((n) => n._id !== id));
//       showToast("Notice deleted");
//     } catch { showToast("Failed", "error"); }
//   };

//   const generateReport = async () => {
//     setReportLoading(true); setAiReport("");
//     try {
//       const res = await API.get("/ai/report");
//       setAiReport(res.data.report);
//     } catch { setAiReport("⚠️ Failed to generate AI report."); }
//     finally { setReportLoading(false); }
//   };

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const atRisk = students.filter((s) => (s.attendancePct ?? 0) < 75);
//   const deptCount = DEPARTMENTS.map((d) => ({
//     dept: d,
//     students: students.filter((s) => s.department === d).length,
//     teachers: teachers.filter((t) => t.department === d).length,
//   }));

//   const filteredStudents = students.filter((s) => {
//     const q = studentSearch.toLowerCase();
//     const matchQ = !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q);
//     const matchD = !studentDept || s.department === studentDept;
//     return matchQ && matchD;
//   });

//   const filteredTeachers = teachers.filter((t) => {
//     const q = teacherSearch.toLowerCase();
//     const matchQ = !q || t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q);
//     const matchD = !teacherDept || t.department === teacherDept;
//     return matchQ && matchD;
//   });

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-transparent" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 space-y-6 relative">

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm transition-all ${
//           toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
//         }`}>
//           {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800">⚙️ Admin Dashboard</h1>
//           <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
//         </div>
//         <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm text-slate-600 font-medium">
//           BCE Bhagalpur · College ERP
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
//         {[
//           { id: "overview",  label: "Overview" },
//           { id: "students",  label: "Students",  count: students.length },
//           { id: "teachers",  label: "Teachers",  count: teachers.length },
//           { id: "notices",   label: "Notices",   count: notices.length },
//           { id: "reports",   label: "Reports" },
//           { id: "atrisk",    label: "⚠️ At Risk", count: atRisk.length },
//         ].map((t) => (
//           <Tab key={t.id} label={t.label} count={t.count} active={tab === t.id} onClick={() => setTab(t.id)} />
//         ))}
//       </div>

//       {/* ── OVERVIEW TAB ── */}
//       {tab === "overview" && (
//         <div className="space-y-6">
//           {/* Stat Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             <StatCard icon={Icon.Students} label="Total Students" value={students.length} sub={`Across ${DEPARTMENTS.length} departments`} color="border-blue-500" />
//             <StatCard icon={Icon.Teachers} label="Total Teachers" value={teachers.length} sub="Active faculty" color="border-emerald-500" />
//             <StatCard icon={Icon.Courses}  label="Total Courses"  value={courses.length}  sub="All departments" color="border-purple-500" />
//             <StatCard icon={Icon.Notice}   label="Notices"        value={notices.length}  sub="Posted notices" color="border-amber-500" />
//           </div>

//           {/* Department wise table */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//             <div className="p-5 border-b border-slate-100">
//               <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Icon.Chart /> Department Overview</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
//                   <tr>
//                     <th className="px-5 py-3 text-left">Department</th>
//                     <th className="px-5 py-3 text-center">Students</th>
//                     <th className="px-5 py-3 text-center">Teachers</th>
//                     <th className="px-5 py-3 text-center">Ratio</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {deptCount.map((d) => (
//                     <tr key={d.dept} className="hover:bg-slate-50">
//                       <td className="px-5 py-3 font-bold text-slate-800">{d.dept}</td>
//                       <td className="px-5 py-3 text-center">
//                         <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{d.students}</span>
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{d.teachers}</span>
//                       </td>
//                       <td className="px-5 py-3 text-center text-slate-500">
//                         {d.teachers > 0 ? `${Math.round(d.students / d.teachers)}:1` : "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Recent Notices preview */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
//             <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Icon.Notice /> Recent Notices</h2>
//             {notices.slice(0, 3).map((n) => (
//               <div key={n._id} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
//                 <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
//                 <div>
//                   <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
//                   <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{n.message}</p>
//                 </div>
//               </div>
//             ))}
//             {notices.length === 0 && <p className="text-slate-400 text-sm">No notices yet.</p>}
//           </div>
//         </div>
//       )}

//       {/* ── STUDENTS TAB ── */}
//       {tab === "students" && (
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
//             <h2 className="text-lg font-bold text-slate-700 flex-1">All Students</h2>
//             <div className="flex gap-2">
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.Search /></span>
//                 <input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 w-48" />
//               </div>
//               <select value={studentDept} onChange={(e) => setStudentDept(e.target.value)} className="border border-slate-200 rounded-xl text-sm px-3 py-2 outline-none focus:border-slate-400">
//                 <option value="">All Depts</option>
//                 {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
//               </select>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
//                 <tr>
//                   <th className="px-5 py-3 text-left">#</th>
//                   <th className="px-5 py-3 text-left">Name</th>
//                   <th className="px-5 py-3 text-left">Email</th>
//                   <th className="px-5 py-3 text-center">Roll No</th>
//                   <th className="px-5 py-3 text-center">Dept</th>
//                   <th className="px-5 py-3 text-center">Year</th>
//                   <th className="px-5 py-3 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {filteredStudents.map((s, i) => (
//                   <tr key={s._id} className="hover:bg-slate-50">
//                     <td className="px-5 py-3 text-slate-400">{i + 1}</td>
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
//                           {s.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <span className="font-semibold text-slate-800">{s.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-5 py-3 text-slate-500">{s.email}</td>
//                     <td className="px-5 py-3 text-center font-mono text-slate-600">{s.rollNumber}</td>
//                     <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.department}</span></td>
//                     <td className="px-5 py-3 text-center text-slate-600">Year {s.year}</td>
//                     <td className="px-5 py-3 text-center">
//                       <button onClick={() => deleteStudent(s._id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"><Icon.Trash /></button>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredStudents.length === 0 && (
//                   <tr><td colSpan={7} className="text-center py-10 text-slate-400">No students found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ── TEACHERS TAB ── */}
//       {tab === "teachers" && (
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
//             <h2 className="text-lg font-bold text-slate-700 flex-1">All Teachers</h2>
//             <div className="flex gap-2">
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.Search /></span>
//                 <input value={teacherSearch} onChange={(e) => setTeacherSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 w-48" />
//               </div>
//               <select value={teacherDept} onChange={(e) => setTeacherDept(e.target.value)} className="border border-slate-200 rounded-xl text-sm px-3 py-2 outline-none focus:border-slate-400">
//                 <option value="">All Depts</option>
//                 {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
//               </select>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
//                 <tr>
//                   <th className="px-5 py-3 text-left">#</th>
//                   <th className="px-5 py-3 text-left">Name</th>
//                   <th className="px-5 py-3 text-left">Email</th>
//                   <th className="px-5 py-3 text-center">Teacher ID</th>
//                   <th className="px-5 py-3 text-center">Dept</th>
//                   <th className="px-5 py-3 text-left">Designation</th>
//                   <th className="px-5 py-3 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {filteredTeachers.map((t, i) => (
//                   <tr key={t._id} className="hover:bg-slate-50">
//                     <td className="px-5 py-3 text-slate-400">{i + 1}</td>
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
//                           {t.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <span className="font-semibold text-slate-800">{t.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-5 py-3 text-slate-500">{t.email}</td>
//                     <td className="px-5 py-3 text-center font-mono text-slate-600">{t.TeacherIdNumber}</td>
//                     <td className="px-5 py-3 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">{t.department}</span></td>
//                     <td className="px-5 py-3 text-slate-600">{t.designation}</td>
//                     <td className="px-5 py-3 text-center">
//                       <button onClick={() => deleteTeacher(t._id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"><Icon.Trash /></button>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredTeachers.length === 0 && (
//                   <tr><td colSpan={7} className="text-center py-10 text-slate-400">No teachers found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* ── NOTICES TAB ── */}
//       {tab === "notices" && (
//         <div className="space-y-6">
//           {/* Post Notice */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
//             <h2 className="text-lg font-bold text-slate-700 mb-4">📢 Post New Notice</h2>
//             <div className="space-y-3">
//               <input
//                 value={noticeTitle}
//                 onChange={(e) => setNoticeTitle(e.target.value)}
//                 placeholder="Notice Title"
//                 className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition"
//               />
//               <textarea
//                 value={noticeMsg}
//                 onChange={(e) => setNoticeMsg(e.target.value)}
//                 placeholder="Notice message..."
//                 rows={3}
//                 className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition resize-none"
//               />
//               <button
//                 onClick={postNotice}
//                 disabled={noticeLoading}
//                 className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60"
//               >
//                 {noticeLoading ? "Posting..." : "Post Notice"}
//               </button>
//             </div>
//           </div>

//           {/* Notices List */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//             <div className="p-5 border-b border-slate-100">
//               <h2 className="text-lg font-bold text-slate-700">All Notices ({notices.length})</h2>
//             </div>
//             <div className="divide-y divide-slate-50">
//               {notices.length === 0 && <p className="text-center py-10 text-slate-400">No notices yet</p>}
//               {notices.map((n) => (
//                 <div key={n._id} className="flex items-start justify-between gap-4 p-5 hover:bg-slate-50 transition">
//                   <div className="flex gap-3">
//                     <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
//                     <div>
//                       <p className="font-bold text-slate-800">{n.title}</p>
//                       <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
//                       <p className="text-xs text-slate-300 mt-1">{new Date(n.createdAt).toLocaleDateString("en-IN")}</p>
//                     </div>
//                   </div>
//                   <button onClick={() => deleteNotice(n._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition shrink-0"><Icon.Trash /></button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── REPORTS TAB ── */}
//       {tab === "reports" && (
//         <div className="space-y-6">
//           {/* Dept bars */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
//             <h2 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2"><Icon.Chart /> Department-wise Student Distribution</h2>
//             <div className="space-y-4">
//               {deptCount.map((d) => {
//                 const pct = students.length > 0 ? Math.round((d.students / students.length) * 100) : 0;
//                 return (
//                   <div key={d.dept}>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span className="font-semibold text-slate-700">{d.dept}</span>
//                       <span className="text-slate-400">{d.students} students ({pct}%)</span>
//                     </div>
//                     <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
//                       <div className="h-full rounded-full bg-gradient-to-r from-slate-700 to-slate-500 transition-all" style={{ width: `${pct}%` }} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* AI Report */}
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Icon.AI /> AI Academic Performance Report</h2>
//               <button
//                 onClick={generateReport}
//                 disabled={reportLoading}
//                 className="bg-slate-800 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60 flex items-center gap-2"
//               >
//                 {reportLoading ? (
//                   <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Generating...</>
//                 ) : "🤖 Generate Report"}
//               </button>
//             </div>
//             {reportLoading && <p className="text-slate-400 animate-pulse text-sm">🤖 AI is analyzing student performance data...</p>}
//             {aiReport && (
//               <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-auto max-h-[500px] prose prose-sm max-w-none">
//                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiReport}</ReactMarkdown>
//               </div>
//             )}
//             {!aiReport && !reportLoading && (
//               <p className="text-slate-400 text-sm text-center py-8">Click "Generate Report" to analyze student performance with AI</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── AT RISK TAB ── */}
//       {tab === "atrisk" && (
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="p-5 border-b border-slate-100">
//             <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
//               <Icon.Risk /> At-Risk Students
//               <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold ml-2">Attendance &lt; 75%</span>
//             </h2>
//           </div>
//           {atRisk.length === 0 ? (
//             <div className="text-center py-16">
//               <p className="text-4xl mb-2">🎉</p>
//               <p className="text-slate-600 font-semibold">All students have attendance above 75%!</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-red-50 text-red-400 uppercase text-xs">
//                   <tr>
//                     <th className="px-5 py-3 text-left">Name</th>
//                     <th className="px-5 py-3 text-center">Roll No</th>
//                     <th className="px-5 py-3 text-center">Dept</th>
//                     <th className="px-5 py-3 text-center">Attendance %</th>
//                     <th className="px-5 py-3 text-center">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {atRisk.map((s) => (
//                     <tr key={s._id} className="hover:bg-red-50/30">
//                       <td className="px-5 py-3 font-semibold text-slate-800">{s.name}</td>
//                       <td className="px-5 py-3 text-center font-mono text-slate-600">{s.rollNumber}</td>
//                       <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.department}</span></td>
//                       <td className="px-5 py-3 text-center">
//                         <span className={`font-black text-lg ${(s.attendancePct ?? 0) < 50 ? "text-red-600" : "text-amber-500"}`}>
//                           {s.attendancePct ?? 0}%
//                         </span>
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
//                           (s.attendancePct ?? 0) < 50 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
//                         }`}>
//                           {(s.attendancePct ?? 0) < 50 ? "Critical" : "Warning"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE"];
const SEMESTERS   = [1, 2, 3, 4, 5, 6, 7, 8];

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  Students: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Teachers: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Courses:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Notice:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Risk:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Trash:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>,
  Search:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  AI:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>,
  Chart:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Assign:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  Close:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
const attColor    = (pct) => pct >= 75 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50";

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
  <div className={`fixed top-5 right-5 z-[999] px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm flex items-center gap-2 ${type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
    {type === "error" ? <Icon.Risk /> : <Icon.Check />}
    {msg}
  </div>
);

// ── Tab Button ────────────────────────────────────────────────────────────────
const Tab = ({ label, active, onClick, count }) => (
  <button onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${active ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}>
    {label}
    {count !== undefined && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>{count}</span>
    )}
  </button>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Ic, label, value, sub, color }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} hover:shadow-md transition-all`}>
    <div className={`inline-flex p-2 rounded-xl mb-3 ${color.replace("border-","bg-").replace("-500","-100")}`}>
      <span className={color.replace("border-","text-")}><Ic /></span>
    </div>
    <p className="text-3xl font-black text-slate-800">{value}</p>
    <p className="text-sm font-semibold text-slate-600 mt-1">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

// ── Filter Bar ────────────────────────────────────────────────────────────────
const FilterBar = ({ search, onSearch, dept, onDept, sem, onSem, showSem = true }) => (
  <div className="flex flex-wrap gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
    <div className="relative flex-1 min-w-[160px]">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.Search /></span>
      <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search..."
        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400" />
    </div>
    <select value={dept} onChange={(e) => onDept(e.target.value)}
      className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
      <option value="">All Departments</option>
      {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
    </select>
    {showSem && (
      <select value={sem} onChange={(e) => onSem(e.target.value)}
        className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
        <option value="">All Semesters</option>
        {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
      </select>
    )}
  </div>
);

// ── Assign Courses Modal ──────────────────────────────────────────────────────
const AssignCoursesModal = ({ teacher, allCourses, onClose, onSave, showToast }) => {
  const [filterDept, setFilterDept] = useState(teacher.departments?.[0] || "");
  const [filterSem,  setFilterSem]  = useState("");
  const [selected,   setSelected]   = useState(
    new Set((teacher.assignedCourses || []).map((c) => c._id || c))
  );
  const [loading, setLoading] = useState(false);

  const visibleCourses = allCourses.filter((c) => {
    const matchD = !filterDept || c.department === filterDept;
    const matchS = !filterSem  || c.semester === Number(filterSem);
    return matchD && matchS;
  });

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const save = async () => {
    setLoading(true);
    try {
      await API.put(`/admin/teachers/${teacher._id}/assign-courses`, {
        courseIds: [...selected],
        mode: "replace",
      });
      showToast(`Courses updated for ${teacher.name}`);
      onSave();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to assign", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800">Assign Courses</h2>
            <p className="text-slate-400 text-sm mt-0.5">{teacher.name} · {teacher.TeacherIdNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition"><Icon.Close /></button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex gap-3 shrink-0">
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none flex-1">
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none flex-1">
            <option value="">All Semesters</option>
            {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
          </select>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold px-2">
            {selected.size} selected
          </div>
        </div>

        {/* Course list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleCourses.length === 0 && (
            <p className="text-center text-slate-400 py-10 text-sm">No courses match the filter</p>
          )}
          {visibleCourses.map((c) => {
            const isSelected = selected.has(c._id);
            return (
              <div key={c._id}
                onClick={() => toggle(c._id)}
                className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-slate-200 bg-slate-50"}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                  {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.code}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">{c.department}</span>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">Sem {c.semester}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex gap-3 shrink-0">
          <button onClick={onClose}
            className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={save} disabled={loading}
            className="flex-1 bg-slate-800 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 transition">
            {loading ? "Saving..." : `Save ${selected.size} Courses`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab]           = useState("overview");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notices,  setNotices]  = useState([]);
  const [courses,  setCourses]  = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);

  // Student filters
  const [stuSearch, setStuSearch] = useState("");
  const [stuDept,   setStuDept]   = useState("");
  const [stuSem,    setStuSem]    = useState("");

  // Teacher filters
  const [tchSearch, setTchSearch] = useState("");
  const [tchDept,   setTchDept]   = useState("");

  // Course filters
  const [crsSearch, setCrsSearch] = useState("");
  const [crsDept,   setCrsDept]   = useState("");
  const [crsSem,    setCrsSem]    = useState("");

  // Notice form
  const [noticeTitle,   setNoticeTitle]   = useState("");
  const [noticeMsg,     setNoticeMsg]     = useState("");
  const [noticeLoading, setNoticeLoading] = useState(false);

  // AI report
  const [aiReport,      setAiReport]      = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // Assign modal
  const [assignModal, setAssignModal] = useState(null); // teacher object

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, tRes, nRes, cRes, stRes] = await Promise.allSettled([
        API.get("/admin/students"),
        API.get("/admin/teachers"),
        API.get("/admin/notices"),
        API.get("/admin/courses"),
        API.get("/admin/stats"),
      ]);
      if (sRes.status  === "fulfilled") setStudents(sRes.value.data || []);
      if (tRes.status  === "fulfilled") setTeachers(tRes.value.data || []);
      if (nRes.status  === "fulfilled") setNotices(nRes.value.data  || []);
      if (cRes.status  === "fulfilled") setCourses(cRes.value.data?.courses || []);
      if (stRes.status === "fulfilled") setStats(stRes.value.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student and all their data?")) return;
    try {
      await API.delete(`/admin/students/${id}`);
      setStudents((p) => p.filter((s) => s._id !== id));
      showToast("Student deleted");
    } catch { showToast("Failed", "error"); }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await API.delete(`/admin/teachers/${id}`);
      setTeachers((p) => p.filter((t) => t._id !== id));
      showToast("Teacher deleted");
    } catch { showToast("Failed", "error"); }
  };

  const postNotice = async () => {
    if (!noticeTitle.trim() || !noticeMsg.trim()) return showToast("Fill all fields", "error");
    setNoticeLoading(true);
    try {
      const res = await API.post("/admin/notices", { title: noticeTitle, message: noticeMsg });
      setNotices((p) => [res.data, ...p]);
      setNoticeTitle(""); setNoticeMsg("");
      showToast("Notice posted!");
    } catch { showToast("Failed", "error"); }
    finally { setNoticeLoading(false); }
  };

  const deleteNotice = async (id) => {
    try {
      await API.delete(`/admin/notices/${id}`);
      setNotices((p) => p.filter((n) => n._id !== id));
      showToast("Notice deleted");
    } catch { showToast("Failed", "error"); }
  };

  const generateReport = async () => {
    setReportLoading(true); setAiReport("");
    try {
      const res = await API.get("/ai/report");
      setAiReport(res.data.report);
    } catch { setAiReport("⚠️ Failed to generate AI report."); }
    finally { setReportLoading(false); }
  };

  // ── Filtered lists ──────────────────────────────────────────────────────────
  const filteredStudents = students.filter((s) => {
    const q = stuSearch.toLowerCase();
    return (
      (!q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q)) &&
      (!stuDept || s.department === stuDept) &&
      (!stuSem  || s.semester === Number(stuSem))
    );
  });

  const filteredTeachers = teachers.filter((t) => {
    const q = tchSearch.toLowerCase();
    return (
      (!q || t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q) || t.TeacherIdNumber?.toLowerCase().includes(q)) &&
      (!tchDept || t.departments?.includes(tchDept))
    );
  });

  const filteredCourses = courses.filter((c) => {
    const q = crsSearch.toLowerCase();
    return (
      (!q || c.name?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q)) &&
      (!crsDept || c.department === crsDept) &&
      (!crsSem  || c.semester === Number(crsSem))
    );
  });

  const atRisk = students.filter((s) => (s.attendancePct ?? 0) < 75);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Assign Courses Modal */}
      {assignModal && (
        <AssignCoursesModal
          teacher={assignModal}
          allCourses={courses}
          onClose={() => setAssignModal(null)}
          onSave={fetchAll}
          showToast={showToast}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-800">⚙️ Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm text-slate-600 font-medium">
          BCE Bhagalpur · College ERP
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        {[
          { id:"overview",  label:"📊 Overview" },
          { id:"students",  label:"👨‍🎓 Students",  count: students.length },
          { id:"teachers",  label:"👨‍🏫 Teachers",  count: teachers.length },
          { id:"courses",   label:"📚 Courses",    count: courses.length },
          { id:"notices",   label:"📢 Notices",    count: notices.length },
          { id:"reports",   label:"🤖 AI Reports" },
          { id:"atrisk",    label:"⚠️ At Risk",    count: atRisk.length },
        ].map((t) => (
          <Tab key={t.id} label={t.label} count={t.count} active={tab === t.id} onClick={() => setTab(t.id)} />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* OVERVIEW TAB                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Icon.Students} label="Total Students" value={students.length} sub="Across all departments" color="border-blue-500" />
            <StatCard icon={Icon.Teachers} label="Total Teachers" value={teachers.length} sub="Active faculty"         color="border-emerald-500" />
            <StatCard icon={Icon.Courses}  label="Total Courses"  value={courses.length}  sub="All departments"        color="border-purple-500" />
            <StatCard icon={Icon.Risk}     label="At Risk"        value={atRisk.length}   sub="Below 75% attendance"   color="border-red-500" />
          </div>

          {/* Department + Semester breakdown */}
          {stats?.deptStats && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Icon.Chart /> Department — Semester Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="px-5 py-3 text-left">Dept</th>
                      <th className="px-5 py-3 text-center">Teachers</th>
                      <th className="px-5 py-3 text-center">Total</th>
                      {SEMESTERS.map((s) => (
                        <th key={s} className="px-3 py-3 text-center">S{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.deptStats.map((d) => (
                      <tr key={d.dept} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-bold text-slate-800">{d.dept}</td>
                        <td className="px-5 py-3 text-center">
                          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-semibold">{d.teachers}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">{d.students}</span>
                        </td>
                        {d.semCounts.map((sc) => (
                          <td key={sc.semester} className="px-3 py-3 text-center text-xs text-slate-500">
                            {sc.count > 0 ? <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold">{sc.count}</span> : <span className="text-slate-300">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent notices */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-4">📢 Recent Notices</h2>
            {notices.slice(0, 3).map((n) => (
              <div key={n._id} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{n.message}</p>
                </div>
              </div>
            ))}
            {notices.length === 0 && <p className="text-slate-400 text-sm">No notices yet.</p>}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STUDENTS TAB                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {tab === "students" && (
        <div className="space-y-4">
          <FilterBar search={stuSearch} onSearch={setStuSearch} dept={stuDept} onDept={setStuDept} sem={stuSem} onSem={setStuSem} />

          {/* Semester pill summary */}
          <div className="flex flex-wrap gap-2">
            {SEMESTERS.map((s) => {
              const cnt = students.filter((st) => st.semester === s && (!stuDept || st.department === stuDept)).length;
              return (
                <button key={s} onClick={() => setStuSem(stuSem === String(s) ? "" : String(s))}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${stuSem === String(s) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}>
                  Sem {s} <span className="ml-1 opacity-70">({cnt})</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-700">
                Students
                {stuDept && <span className="ml-2 text-blue-500">— {stuDept}</span>}
                {stuSem  && <span className="ml-1 text-blue-400 text-sm">Sem {stuSem}</span>}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{filteredStudents.length} shown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">#</th>
                    <th className="px-5 py-3 text-left">Student</th>
                    <th className="px-5 py-3 text-center">Roll No</th>
                    <th className="px-5 py-3 text-center">Dept</th>
                    <th className="px-5 py-3 text-center">Sem</th>
                    <th className="px-5 py-3 text-center">Year</th>
                    <th className="px-5 py-3 text-center">Attendance</th>
                    <th className="px-5 py-3 text-center">Avg Marks</th>
                    <th className="px-5 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length === 0
                    ? <tr><td colSpan={9} className="text-center py-10 text-slate-400">No students found</td></tr>
                    : filteredStudents.map((s, i) => (
                      <tr key={s._id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {getInitials(s.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center font-mono text-xs text-slate-600">{s.rollNumber}</td>
                        <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">{s.department}</span></td>
                        <td className="px-5 py-3 text-center"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">S{s.semester}</span></td>
                        <td className="px-5 py-3 text-center text-slate-600 text-xs">Y{s.year}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${attColor(s.attendancePct ?? 0)}`}>{s.attendancePct ?? 0}%</span>
                        </td>
                        <td className="px-5 py-3 text-center font-semibold text-slate-700 text-sm">{s.avgMarks ?? "—"}</td>
                        <td className="px-5 py-3 text-center">
                          <button onClick={() => deleteStudent(s._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"><Icon.Trash /></button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TEACHERS TAB                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {tab === "teachers" && (
        <div className="space-y-4">
          <FilterBar search={tchSearch} onSearch={setTchSearch} dept={tchDept} onDept={setTchDept} showSem={false} />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-700">Teachers</h2>
              <span className="text-xs text-slate-400 font-semibold">{filteredTeachers.length} shown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">#</th>
                    <th className="px-5 py-3 text-left">Teacher</th>
                    <th className="px-5 py-3 text-center">ID</th>
                    <th className="px-5 py-3 text-center">Departments</th>
                    <th className="px-5 py-3 text-left">Designation</th>
                    <th className="px-5 py-3 text-left">Assigned Courses</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTeachers.length === 0
                    ? <tr><td colSpan={7} className="text-center py-10 text-slate-400">No teachers found</td></tr>
                    : filteredTeachers.map((t, i) => (
                      <tr key={t._id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {getInitials(t.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{t.name}</p>
                              <p className="text-xs text-slate-400">{t.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center font-mono text-xs text-slate-600">{t.TeacherIdNumber}</td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {(t.departments || []).map((d) => (
                              <span key={d} className="bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">{d}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-600 text-xs">{t.designation}</td>
                        <td className="px-5 py-3">
                          {(t.assignedCourses || []).length === 0
                            ? <span className="text-xs text-slate-300 italic">None assigned</span>
                            : (
                              <div className="flex flex-wrap gap-1">
                                {(t.assignedCourses || []).slice(0, 3).map((c) => (
                                  <span key={c._id} className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded font-semibold border border-blue-100">{c.code}</span>
                                ))}
                                {(t.assignedCourses || []).length > 3 && (
                                  <span className="text-xs text-slate-400">+{t.assignedCourses.length - 3}</span>
                                )}
                              </div>
                            )
                          }
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setAssignModal(t)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition">
                              <Icon.Assign /> Assign
                            </button>
                            <button onClick={() => deleteTeacher(t._id)}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition">
                              <Icon.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* COURSES TAB                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {tab === "courses" && (
        <div className="space-y-4">
          <FilterBar search={crsSearch} onSearch={setCrsSearch} dept={crsDept} onDept={setCrsDept} sem={crsSem} onSem={setCrsSem} />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-700">Courses ({filteredCourses.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">#</th>
                    <th className="px-5 py-3 text-left">Course Name</th>
                    <th className="px-5 py-3 text-center">Code</th>
                    <th className="px-5 py-3 text-center">Dept</th>
                    <th className="px-5 py-3 text-center">Semester</th>
                    <th className="px-5 py-3 text-left">Assigned Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCourses.length === 0
                    ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">No courses found</td></tr>
                    : filteredCourses.map((c, i) => (
                      <tr key={c._id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{c.name}</td>
                        <td className="px-5 py-3 text-center font-mono text-xs text-slate-600">{c.code}</td>
                        <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">{c.department}</span></td>
                        <td className="px-5 py-3 text-center"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">Sem {c.semester}</span></td>
                        <td className="px-5 py-3">
                          {(() => {
                            const assigned = teachers.find((t) =>
                              (t.assignedCourses || []).some((ac) => (ac._id || ac) === c._id)
                            );
                            return assigned
                              ? <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{getInitials(assigned.name)}</div>
                                  <span className="text-sm font-semibold text-slate-700">{assigned.name}</span>
                                </div>
                              : <span className="text-xs text-slate-300 italic">Unassigned</span>;
                          })()}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* NOTICES TAB                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {tab === "notices" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-4">📢 Post New Notice</h2>
            <div className="space-y-3">
              <input value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="Notice Title"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition" />
              <textarea value={noticeMsg} onChange={(e) => setNoticeMsg(e.target.value)}
                placeholder="Notice message..." rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition resize-none" />
              <button onClick={postNotice} disabled={noticeLoading}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60">
                {noticeLoading ? "Posting..." : "Post Notice"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-700">All Notices ({notices.length})</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {notices.length === 0 && <p className="text-center py-10 text-slate-400">No notices yet</p>}
              {notices.map((n) => (
                <div key={n._id} className="flex items-start justify-between gap-4 p-5 hover:bg-slate-50 transition">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{n.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-300 mt-1">{new Date(n.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteNotice(n._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition shrink-0"><Icon.Trash /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* AI REPORTS TAB                                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {tab === "reports" && (
        <div className="space-y-6">
          {/* Dept bars */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2"><Icon.Chart /> Student Distribution</h2>
            <div className="space-y-4">
              {(stats?.deptStats || []).map((d) => {
                const pct = stats.totalStudents > 0 ? Math.round((d.students / stats.totalStudents) * 100) : 0;
                return (
                  <div key={d.dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-700">{d.dept}</span>
                      <span className="text-slate-400">{d.students} students ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-slate-700 to-slate-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Icon.AI /> AI Academic Performance Report</h2>
              <button onClick={generateReport} disabled={reportLoading}
                className="bg-slate-800 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60 flex items-center gap-2">
                {reportLoading ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Generating...</> : "🤖 Generate"}
              </button>
            </div>
            {reportLoading && <p className="text-slate-400 animate-pulse text-sm">Analyzing data...</p>}
            {aiReport && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-auto max-h-[500px] prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiReport}</ReactMarkdown>
              </div>
            )}
            {!aiReport && !reportLoading && (
              <p className="text-slate-400 text-sm text-center py-8">Click "Generate" to analyze performance with AI</p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* AT RISK TAB                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {tab === "atrisk" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Icon.Risk /> At-Risk Students
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold ml-2">Attendance &lt; 75%</span>
            </h2>
          </div>
          {atRisk.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-slate-600 font-semibold">All students above 75%!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-red-50 text-red-400 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-center">Roll No</th>
                    <th className="px-5 py-3 text-center">Dept</th>
                    <th className="px-5 py-3 text-center">Sem</th>
                    <th className="px-5 py-3 text-center">Attendance</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {atRisk.map((s) => (
                    <tr key={s._id} className="hover:bg-red-50/30">
                      <td className="px-5 py-3 font-semibold text-slate-800">{s.name}</td>
                      <td className="px-5 py-3 text-center font-mono text-xs text-slate-600">{s.rollNumber}</td>
                      <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">{s.department}</span></td>
                      <td className="px-5 py-3 text-center"><span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">S{s.semester}</span></td>
                      <td className="px-5 py-3 text-center">
                        <span className={`font-black text-lg ${(s.attendancePct ?? 0) < 50 ? "text-red-600" : "text-amber-500"}`}>{s.attendancePct ?? 0}%</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${(s.attendancePct ?? 0) < 50 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                          {(s.attendancePct ?? 0) < 50 ? "Critical" : "Warning"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;