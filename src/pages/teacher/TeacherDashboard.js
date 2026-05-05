 


// import React, { useEffect, useState, useContext, useCallback } from "react";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend,
// } from "recharts";
// import { useNavigate } from "react-router-dom";
// import downloadNoticePDF from "../../utils/downloadNoticePDF";

// const Icons = {
//   Students:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
//   Attendance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>,
//   Marks:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
//   Notice:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
//   Trophy:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H17a1 1 0 0 1 1 1v3a5 5 0 0 1-5 5H11A5 5 0 0 1 6 8V5a1 1 0 0 1 1-1z"/><path d="M6 8H4a2 2 0 0 1-2-2V6"/><path d="M18 8h2a2 2 0 0 0 2-2V6"/></svg>,
//   Alert:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
//   Close:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
//   Search:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
//   Check:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
//   Book:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
//   PDF:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
// };

// const getInitials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
// const getAttColor = (pct) => {
//   if (pct >= 85) return { bg: "bg-emerald-100", text: "text-emerald-700", bar: "#10b981" };
//   if (pct >= 75) return { bg: "bg-amber-100",   text: "text-amber-700",   bar: "#f59e0b" };
//   return              { bg: "bg-red-100",        text: "text-red-700",     bar: "#ef4444" };
// };
// const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

// const getEnrolledStudents = (allStudents, course) => {
//   if (!course) return [];
//   return allStudents.filter(
//     (s) =>
//       s.department === course.department &&
//       s.semester   === course.semester   &&
//       (s.courses || []).some((c) => (c._id || c).toString() === course._id.toString())
//   );
// };

// const Toast = ({ msg, type, onClose }) => {
//   useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium ${type === "error" ? "bg-red-500" : type === "success" ? "bg-emerald-500" : "bg-blue-500"}`}>
//       {type === "success" && <Icons.Check />}{type === "error" && <Icons.Alert />}
//       <span>{msg}</span>
//       <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><Icons.Close /></button>
//     </div>
//   );
// };

// const Modal = ({ title, onClose, children }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//       <div className="flex items-center justify-between p-6 border-b border-gray-100">
//         <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//         <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><Icons.Close /></button>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   </div>
// );

// const FormSelect = ({ label, children, ...props }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
//     <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50" {...props}>{children}</select>
//   </div>
// );
// const FormInput = ({ label, ...props }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
//     <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50" {...props} />
//   </div>
// );
// const FormTextArea = ({ label, ...props }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
//     <textarea rows={4} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 resize-none" {...props} />
//   </div>
// );
// const SubmitBtn = ({ loading, children, onClick }) => (
//   <button type="button" onClick={onClick} disabled={loading}
//     className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all">
//     {loading
//       ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing…</span>
//       : children}
//   </button>
// );

// const CourseCard = ({ course, studentCount, isSelected, onClick }) => (
//   <button onClick={onClick}
//     className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${isSelected ? "border-blue-500 bg-blue-50 shadow" : "border-slate-100 bg-white hover:border-blue-200"}`}>
//     <div className="flex items-start justify-between gap-2">
//       <div className="flex-1 min-w-0">
//         <p className="font-bold text-slate-800 text-sm truncate">{course.name}</p>
//         <p className="text-xs text-slate-400 font-mono mt-0.5">{course.code}</p>
//       </div>
//       <div className="flex flex-col items-end gap-1 shrink-0">
//         <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">{course.department}</span>
//         <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">Sem {course.semester}</span>
//       </div>
//     </div>
//     <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
//       <Icons.Students /> {studentCount} student{studentCount !== 1 ? "s" : ""} enrolled
//     </div>
//   </button>
// );

// // ── ATTENDANCE MODAL ──────────────────────────────────────────────────────────
// const AttendanceModal = ({ allStudents, courses, onClose, onToast, onRefresh }) => {
//   const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?._id || "");
//   const [search, setSearch]   = useState("");
//   const [loading, setLoading] = useState(false);
//   const [rows, setRows]       = useState([]);

//   const selectedCourse = courses.find((c) => c._id === selectedCourseId);

//   useEffect(() => {
//     const enrolled = getEnrolledStudents(allStudents, selectedCourse);
//     setRows(enrolled.map((s) => ({ studentId: s._id, name: s.name, roll: s.rollNumber, status: "Present" })));
//   }, [selectedCourseId, allStudents, selectedCourse]);

//   const toggle       = (id)     => setRows((p) => p.map((r) => r.studentId === id ? { ...r, status: r.status === "Present" ? "Absent" : "Present" } : r));
//   const markAll      = (status) => setRows((p) => p.map((r) => ({ ...r, status })));
//   const filtered     = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.roll?.toLowerCase().includes(search.toLowerCase()));
//   const presentCount = rows.filter((r) => r.status === "Present").length;
//   const absentCount  = rows.filter((r) => r.status === "Absent").length;

//   const submit = async () => {
//     if (!selectedCourseId) return onToast("Select a course", "error");
//     if (rows.length === 0) return onToast("No students enrolled in this course", "error");
//     setLoading(true);
//     try {
//       await Promise.all(rows.map((r) =>
//         API.post("/teacher/attendance", { studentId: r.studentId, courseId: selectedCourseId, status: r.status })
//       ));
//       onToast(`Attendance marked for ${selectedCourse?.name}`, "success");
//       onRefresh(); onClose();
//     } catch (err) {
//       onToast(err.response?.data?.message || "Failed", "error");
//     } finally { setLoading(false); }
//   };

//   return (
//     <Modal title="✅ Mark Attendance" onClose={onClose}>
//       <div className="space-y-4">
//         <FormSelect label="Select Course" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
//           {courses.length === 0
//             ? <option value="">No courses assigned</option>
//             : courses.map((c) => <option key={c._id} value={c._id}>{c.name} — {c.department} Sem {c.semester}</option>)}
//         </FormSelect>
//         {selectedCourse && (
//           <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-semibold text-blue-700">
//             <Icons.Book />
//             <span>{selectedCourse.department} · Semester {selectedCourse.semester} · {rows.length} student{rows.length !== 1 ? "s" : ""} enrolled</span>
//           </div>
//         )}
//         <div className="flex gap-2">
//           <button onClick={() => markAll("Present")} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl">✓ All Present</button>
//           <button onClick={() => markAll("Absent")}  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-xl">✗ All Absent</button>
//         </div>
//         <p className="text-xs text-gray-400 bg-blue-50 rounded-xl px-3 py-2 text-center">💡 Mark all present first, then toggle absent students.</p>
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
//           <input placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)}
//             className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50" />
//         </div>
//         <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
//           {rows.length === 0 && <p className="text-center text-gray-400 text-sm py-6">{selectedCourse ? `No students in ${selectedCourse.name}` : "Select a course"}</p>}
//           {filtered.map((r) => (
//             <div key={r.studentId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${r.status === "Present" ? "border-emerald-100 bg-emerald-50/40" : "border-red-100 bg-red-50/40"}`}>
//               <div className="flex items-center gap-3">
//                 <div className={`w-2 h-2 rounded-full ${r.status === "Present" ? "bg-emerald-500" : "bg-red-500"}`} />
//                 <div><p className="text-sm font-semibold text-gray-800">{r.name}</p><p className="text-xs text-gray-400">{r.roll}</p></div>
//               </div>
//               <button onClick={() => toggle(r.studentId)}
//                 className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${r.status === "Present" ? "bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600" : "bg-red-100 text-red-600 hover:bg-emerald-100 hover:text-emerald-700"}`}>
//                 {r.status}
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="bg-slate-50 rounded-xl p-3">
//           <div className="flex justify-between text-xs text-gray-500 mb-2">
//             <span className="font-bold text-emerald-600">✓ {presentCount} Present</span>
//             <span>{rows.length} Total</span>
//             <span className="font-bold text-red-500">✗ {absentCount} Absent</span>
//           </div>
//           <div className="h-2 bg-red-100 rounded-full overflow-hidden">
//             <div className="h-full bg-emerald-500 rounded-full transition-all duration-300"
//               style={{ width: `${rows.length > 0 ? (presentCount / rows.length) * 100 : 0}%` }} />
//           </div>
//         </div>
//         <SubmitBtn loading={loading} onClick={submit}>Submit — {selectedCourse?.name} ({presentCount}P / {absentCount}A)</SubmitBtn>
//       </div>
//     </Modal>
//   );
// };

// // ── NOTICE MODAL ──────────────────────────────────────────────────────────────
// const NoticeModal = ({ onClose, onToast, onRefresh }) => {
//   const [form, setForm]       = useState({ title: "", message: "" });
//   const [loading, setLoading] = useState(false);
//   const submit = async () => {
//     if (!form.title.trim() || !form.message.trim()) return onToast("Title and message required", "error");
//     setLoading(true);
//     try { await API.post("/teacher/notices", form); onToast("Notice posted!", "success"); onRefresh(); onClose(); }
//     catch (err) { onToast(err.response?.data?.message || "Failed", "error"); }
//     finally { setLoading(false); }
//   };
//   return (
//     <Modal title="🔔 Post Notice" onClose={onClose}>
//       <div className="space-y-4">
//         <FormInput label="Notice Title" placeholder="e.g. Mid-Semester Exam Schedule"
//           value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
//         <FormTextArea label="Message" placeholder="Write your notice here…"
//           value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
//         <SubmitBtn loading={loading} onClick={submit}>Post Notice</SubmitBtn>
//       </div>
//     </Modal>
//   );
// };

// // ── TOP PERFORMERS MODAL ──────────────────────────────────────────────────────
// const TopPerformersModal = ({ allStudents, courses, onClose }) => {
//   const [selectedCourseId, setSelectedCourseId] = useState("all");
//   const course = courses.find((c) => c._id === selectedCourseId);
//   const pool   = selectedCourseId === "all" ? allStudents : getEnrolledStudents(allStudents, course);
//   const sorted = [...pool].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0));
//   const medals = ["🥇", "🥈", "🥉"];
//   return (
//     <Modal title="🏆 Top Performers" onClose={onClose}>
//       <div className="space-y-4">
//         <FormSelect label="Filter by Course" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
//           <option value="all">All Courses</option>
//           {courses.map((c) => <option key={c._id} value={c._id}>{c.name} — {c.department} Sem {c.semester}</option>)}
//         </FormSelect>
//         <div className="space-y-3">
//           {sorted.length === 0 && <p className="text-center text-gray-400 py-8">No data</p>}
//           {sorted.map((s, i) => {
//             const col = getAttColor(s.attendance || 0);
//             return (
//               <div key={s._id} className={`flex items-center gap-4 p-4 rounded-2xl border ${i < 3 ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50"}`}>
//                 <span className="text-2xl w-8 text-center">{medals[i] || `#${i + 1}`}</span>
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow">{getInitials(s.name)}</div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-bold text-gray-800 truncate">{s.name}</p>
//                   <p className="text-xs text-gray-400">{s.rollNumber} · {s.department} Sem {s.semester}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-bold text-violet-700">{s.avgMarks ?? "—"}<span className="text-xs text-gray-400">/100</span></p>
//                   <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{s.attendance}% att.</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </Modal>
//   );
// };

// const StatCard = ({ icon: Ic, label, value, sub, accent }) => (
//   <div className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-100 bg-white">
//     <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-6 -mt-6 ${accent}`} />
//     <div className={`inline-flex p-2 rounded-xl mb-3 ${accent} bg-opacity-10`}><span className={accent.replace("bg-", "text-")}><Ic /></span></div>
//     <p className="text-2xl font-bold text-gray-800">{value}</p>
//     <p className="text-sm font-medium text-gray-500">{label}</p>
//     {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
//   </div>
// );

// const QuickAction = ({ icon: Ic, label, color, onClick }) => (
//   <button onClick={onClick} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed transition-all hover:scale-105 hover:shadow-md cursor-pointer ${color}`}>
//     <span className="text-2xl"><Ic /></span>
//     <span className="text-xs font-semibold text-center leading-tight">{label}</span>
//   </button>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN DASHBOARD
// // ─────────────────────────────────────────────────────────────────────────────
// const TeacherDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [allStudents,   setAllStudents]   = useState([]);
//   const [courses,       setCourses]       = useState([]);
//   const [notices,       setNotices]       = useState([]);
//   const [todayClasses,  setTodayClasses]  = useState([]);
//   const [loading,       setLoading]       = useState(true);

//   const [activeCourseId, setActiveCourseId] = useState("all");
//   const [activeTab,      setActiveTab]      = useState("all");
//   const [searchQuery,    setSearchQuery]    = useState("");
//   const [modal,          setModal]          = useState(null);
//   const [toast,          setToast]          = useState(null);

//   const showToast  = (msg, type = "info") => setToast({ msg, type });
//   const closeToast = useCallback(() => setToast(null), []);

//   const fetchData = useCallback(async () => {
//     try {
//       const [studRes, courseRes, noticeRes, classRes] = await Promise.allSettled([
//         API.get("/teacher/students"),
//         API.get("/teacher/courses"),
//         API.get("/teacher/notices"),
//         API.get("/routines/my-today"),
//       ]);
//       if (studRes.status   === "fulfilled") setAllStudents(studRes.value.data.students || []);
//       if (courseRes.status === "fulfilled") setCourses(courseRes.value.data.courses || []);
//       if (noticeRes.status === "fulfilled") {
//         const d = noticeRes.value.data;
//         setNotices(Array.isArray(d) ? d : (d?.notices || []));
//       }
//       if (classRes?.status === "fulfilled") setTodayClasses(classRes.value.data.classes || []);
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const activeCourse = courses.find((c) => c._id === activeCourseId);

//   const courseFiltered = activeCourseId === "all"
//     ? allStudents
//     : getEnrolledStudents(allStudents, activeCourse);

//   const displayed = courseFiltered
//     .filter((s) => {
//       const q = searchQuery.toLowerCase();
//       return s.name?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
//     })
//     .filter((s) => {
//       if (activeTab === "atrisk")  return (s.attendance || 0) < 75;
//       if (activeTab === "toppers") return (s.avgMarks || 0) >= 80;
//       return true;
//     })
//     .sort((a, b) => (a.attendance || 0) - (b.attendance || 0));

//   const base          = courseFiltered;
//   const totalStudents = base.length;
//   const avgAttendance = totalStudents ? Math.round(base.reduce((s, st) => s + (st.attendance || 0), 0) / totalStudents) : 0;
//   const avgMarks      = totalStudents ? Math.round(base.reduce((s, st) => s + (st.avgMarks || 0), 0) / totalStudents) : 0;
//   const atRisk        = base.filter((s) => (s.attendance || 0) < 75).length;
//   const barData       = base.slice(0, 15).map((s) => ({ name: s.name?.split(" ")[0], Attendance: s.attendance || 0, Marks: s.avgMarks || 0 }));
//   const pieData       = [
//     { name: "≥ 85%",  value: base.filter((s) => (s.attendance || 0) >= 85).length },
//     { name: "75–84%", value: base.filter((s) => (s.attendance || 0) >= 75 && (s.attendance || 0) < 85).length },
//     { name: "< 75%",  value: base.filter((s) => (s.attendance || 0) < 75).length },
//   ];
//   const toppers = [...base].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0)).slice(0, 3);

//   if (loading)
//     return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" /></div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-6 text-gray-800">

//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={closeToast} />}
//       {modal === "attendance" && <AttendanceModal allStudents={allStudents} courses={courses} onClose={() => setModal(null)} onToast={showToast} onRefresh={fetchData} />}
//       {modal === "notice"     && <NoticeModal     onClose={() => setModal(null)} onToast={showToast} onRefresh={fetchData} />}
//       {modal === "toppers"    && <TopPerformersModal allStudents={allStudents} courses={courses} onClose={() => setModal(null)} />}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900">👋 Welcome, <span className="text-blue-600">{user?.name || "Teacher"}</span></h1>
//           <p className="text-sm text-gray-400 mt-1">
//             {(user?.departments || []).join(", ") || user?.department || "—"} &nbsp;·&nbsp;
//             {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
//           </p>
//         </div>
//         <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">🎓 Teacher Portal</span>
//       </div>

//       {/* Assigned Courses */}
//       <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-sm font-bold text-gray-600">📚 Assigned Courses — click to filter students</h2>
//           <button onClick={() => setActiveCourseId("all")}
//             className={`px-3 py-1 rounded-full text-xs font-bold border transition ${activeCourseId === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
//             All Courses
//           </button>
//         </div>
//         {courses.length === 0
//           ? <p className="text-sm text-slate-400 italic">No courses assigned. Ask admin to assign courses to you.</p>
//           : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//               {courses.map((c) => (
//                 <CourseCard key={c._id} course={c}
//                   studentCount={getEnrolledStudents(allStudents, c).length}
//                   isSelected={activeCourseId === c._id}
//                   onClick={() => setActiveCourseId(activeCourseId === c._id ? "all" : c._id)} />
//               ))}
//             </div>
//         }
//         {activeCourseId !== "all" && activeCourse && (
//           <p className="text-xs text-blue-600 mt-3 font-medium bg-blue-50 rounded-xl px-3 py-2">
//             📊 Filtered to <strong>{activeCourse.name}</strong> — {activeCourse.department} Semester {activeCourse.semester} — {totalStudents} student{totalStudents !== 1 ? "s" : ""}
//           </p>
//         )}
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard icon={Icons.Students}   label="Students"      value={totalStudents}       sub={activeCourseId === "all" ? "All courses" : activeCourse?.name} accent="bg-blue-500" />
//         <StatCard icon={Icons.Attendance} label="Avg Attendance" value={`${avgAttendance}%`} sub="Class average"  accent="bg-emerald-500" />
//         <StatCard icon={Icons.Marks}      label="Avg Marks"      value={`${avgMarks}/100`}   sub="All subjects"   accent="bg-violet-500"  />
//         <StatCard icon={Icons.Alert}      label="At Risk"        value={atRisk}              sub="Below 75%"      accent="bg-red-500"     />
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//         <h2 className="text-lg font-bold mb-4 text-gray-700">⚡ Quick Actions</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <QuickAction icon={Icons.Attendance} label="Mark Attendance" color="border-emerald-300 text-emerald-600 hover:bg-emerald-50" onClick={() => setModal("attendance")} />
//           <QuickAction icon={Icons.Marks}      label="Add Marks"       color="border-violet-300 text-violet-600 hover:bg-violet-50"   onClick={() => navigate("/teacher/add-marks")} />
//           <QuickAction icon={Icons.Notice}     label="Post Notice"     color="border-amber-300 text-amber-600 hover:bg-amber-50"      onClick={() => setModal("notice")} />
//           <QuickAction icon={Icons.Trophy}     label="Top Performers"  color="border-blue-300 text-blue-600 hover:bg-blue-50"         onClick={() => setModal("toppers")} />
//         </div>
//       </div>

//       {/* Today's Classes */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         <div className="p-5 border-b border-slate-100 flex items-center justify-between">
//           <h2 className="text-lg font-bold text-gray-700">🗓 Today's Classes</h2>
//           <span className="text-xs text-slate-400">{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"})}</span>
//         </div>
//         {todayClasses.length === 0
//           ? <div className="p-8 text-center text-slate-400"><p className="text-3xl mb-2">📭</p><p className="text-sm">No classes today</p></div>
//           : <div className="divide-y divide-slate-50">
//               {todayClasses.map((cls, i) => {
//                 const now = new Date();
//                 const [sh,sm] = cls.startTime.split(":").map(Number);
//                 const [eh,em] = cls.endTime.split(":").map(Number);
//                 const start = new Date(); start.setHours(sh,sm,0);
//                 const end   = new Date(); end.setHours(eh,em,0);
//                 const isNow = now >= start && now <= end;
//                 const isDone= now > end;
//                 return (
//                   <div key={i} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${isNow ? "bg-blue-50" : ""}`}>
//                     <div className={`w-1.5 h-12 rounded-full shrink-0 ${isNow ? "bg-blue-500" : isDone ? "bg-slate-200" : "bg-emerald-400"}`} />
//                     <div className="w-24 shrink-0">
//                       <p className={`text-sm font-bold ${isNow ? "text-blue-600" : "text-slate-600"}`}>{cls.startTime} – {cls.endTime}</p>
//                       {isNow && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-semibold">● Live</span>}
//                       {isDone && <span className="text-xs text-slate-400">Done</span>}
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-bold text-slate-800">{cls.subject}</p>
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">{cls.branch}</span>
//                         {cls.course && <span className="ml-2">{cls.course.name} · {cls.course.code}</span>}
//                         {cls.room  && <span className="ml-2">Room {cls.room}</span>}
//                       </p>
//                     </div>
//                     {isNow && <button onClick={() => setModal("attendance")} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-700 shrink-0">Mark Attendance</button>}
//                   </div>
//                 );
//               })}
//             </div>
//         }
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-bold mb-1 text-gray-700">📊 Attendance &amp; Marks</h2>
//           <p className="text-xs text-gray-400 mb-4">{activeCourseId === "all" ? "All courses" : `${activeCourse?.name} (${activeCourse?.department} Sem ${activeCourse?.semester})`}</p>
//           <ResponsiveContainer width="100%" height={220}>
//             <BarChart data={barData} barGap={4}>
//               <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//               <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
//               <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e5e7eb", fontSize:13 }} />
//               <Legend />
//               <Bar dataKey="Attendance" fill="#3b82f6" radius={[6,6,0,0]} />
//               <Bar dataKey="Marks"      fill="#8b5cf6" radius={[6,6,0,0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-bold mb-4 text-gray-700">🎯 Attendance Spread</h2>
//           <ResponsiveContainer width="100%" height={220}>
//             <PieChart>
//               <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
//                 {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
//               </Pie>
//               <Tooltip contentStyle={{ borderRadius:"12px", fontSize:13 }} />
//               <Legend iconType="circle" />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Student Table + Sidebar */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-5 border-b border-gray-100 space-y-3">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//               <h2 className="text-lg font-bold text-gray-700 flex-1">
//                 👨‍🎓 Students
//                 {activeCourseId !== "all" && activeCourse && (
//                   <span className="ml-2 text-sm text-blue-500 font-semibold">— {activeCourse.department} Sem {activeCourse.semester}</span>
//                 )}
//               </h2>
//               <input type="text" placeholder="Name / Roll / Email…" value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-48" />
//             </div>
//             <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-sm w-max">
//               {[["all","All"],["atrisk","At Risk"],["toppers","Toppers"]].map(([key,label]) => (
//                 <button key={key} onClick={() => setActiveTab(key)}
//                   className={`px-3 py-1 rounded-lg font-medium transition-all ${activeTab === key ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
//                 <tr>
//                   <th className="px-5 py-3 text-left">Student</th>
//                   <th className="px-5 py-3 text-left">Roll No.</th>
//                   <th className="px-5 py-3 text-center">Dept</th>
//                   <th className="px-5 py-3 text-center">Sem</th>
//                   <th className="px-5 py-3 text-center">Attendance</th>
//                   <th className="px-5 py-3 text-center">Avg Marks</th>
//                   <th className="px-5 py-3 text-center">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {displayed.length === 0
//                   ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">No students found.</td></tr>
//                   : displayed.map((s) => {
//                       const att = s.attendance || 0;
//                       const col = getAttColor(att);
//                       return (
//                         <tr key={s._id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-5 py-3">
//                             <div className="flex items-center gap-3">
//                               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow">{getInitials(s.name)}</div>
//                               <div><p className="font-semibold text-gray-800">{s.name}</p><p className="text-xs text-gray-400">{s.email}</p></div>
//                             </div>
//                           </td>
//                           <td className="px-5 py-3"><span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{s.rollNumber || "—"}</span></td>
//                           <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{s.department}</span></td>
//                           <td className="px-5 py-3 text-center"><span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">S{s.semester}</span></td>
//                           <td className="px-5 py-3">
//                             <div className="flex flex-col items-center gap-1">
//                               <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{att}%</span>
//                               <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:`${att}%`, background:col.bar }} /></div>
//                             </div>
//                           </td>
//                           <td className="px-5 py-3 text-center font-semibold text-gray-700">{s.avgMarks ?? "—"}</td>
//                           <td className="px-5 py-3 text-center">
//                             {att < 75
//                               ? <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">⚠ At Risk</span>
//                               : att >= 85
//                               ? <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-medium">✓ Good</span>
//                               : <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium">~ Average</span>}
//                           </td>
//                         </tr>
//                       );
//                     })
//                 }
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* ── SIDEBAR ── */}
//         <div className="space-y-4">

//           {/* Notices with PDF download */}
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//             <h2 className="text-lg font-bold text-gray-700 mb-3">🔔 Latest Notices</h2>
//             {notices.length === 0 ? (
//               <p className="text-sm text-gray-400">No notices yet</p>
//             ) : (
//               <div className="space-y-2">
//                 {notices.slice(0, 4).map((n) => (
//                   <div key={n._id} className="group p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition">
//                     <p className="text-sm font-semibold text-blue-800 leading-tight line-clamp-1">{n.title}</p>
//                     <p className="text-xs text-blue-600 mt-0.5 line-clamp-1">{n.message}</p>
//                     <div className="flex items-center justify-between mt-2">
//                       <p className="text-xs text-blue-400">
//                         {new Date(n.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
//                       </p>
//                       <button
//                         onClick={() => downloadNoticePDF(n)}
//                         className="flex items-center gap-1 text-xs bg-white text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg font-semibold border border-blue-200 transition"
//                         title="Download PDF"
//                       >
//                         <Icons.PDF /> PDF
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Top Performers */}
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//             <h2 className="text-lg font-bold text-gray-700 mb-3">🏆 Top Performers</h2>
//             <div className="space-y-3">
//               {toppers.map((s, i) => (
//                 <div key={s._id} className="flex items-center gap-3">
//                   <span className={`text-lg font-black ${i===0?"text-yellow-500":i===1?"text-gray-400":"text-amber-600"}`}>#{i+1}</span>
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{getInitials(s.name)}</div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
//                     <p className="text-xs text-gray-400">{s.department} S{s.semester} · {s.avgMarks ?? "—"} marks</p>
//                   </div>
//                 </div>
//               ))}
//               {toppers.length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;






import React, { useEffect, useState, useContext, useCallback } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import downloadNoticePDF from "../../utils/downloadNoticePDF";

// ── All your existing Icons, helpers, modals stay exactly the same ────────────
// (keeping them identical — only adding session history at the bottom)

const Icons = {
  Students:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Attendance: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>,
  Marks:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Notice:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Trophy:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H17a1 1 0 0 1 1 1v3a5 5 0 0 1-5 5H11A5 5 0 0 1 6 8V5a1 1 0 0 1 1-1z"/><path d="M6 8H4a2 2 0 0 1-2-2V6"/><path d="M18 8h2a2 2 0 0 0 2-2V6"/></svg>,
  Alert:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Close:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Check:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Book:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  PDF:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
};

const getInitials  = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
const getAttColor  = (pct) => {
  if (pct >= 85) return { bg: "bg-emerald-100", text: "text-emerald-700", bar: "#10b981" };
  if (pct >= 75) return { bg: "bg-amber-100",   text: "text-amber-700",   bar: "#f59e0b" };
  return              { bg: "bg-red-100",        text: "text-red-700",     bar: "#ef4444" };
};
const PIE_COLORS   = ["#10b981", "#f59e0b", "#ef4444"];

const getEnrolledStudents = (allStudents, course) => {
  if (!course) return [];
  return allStudents.filter(
    (s) =>
      s.department === course.department &&
      s.semester   === course.semester   &&
      (s.courses || []).some((c) => (c._id || c).toString() === course._id.toString())
  );
};

const fmt12 = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

// ── Session PDF generator (same as admin) ─────────────────────────────────────
const downloadSessionPDF = (session) => {
  const r       = session.report || {};
  const entries = r.entries || [];
  const date    = new Date(session.startTime).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const rows = entries.map((e, i) => {
    const color = e.status === "Present" ? "#10b981" : e.status === "Absent" ? "#ef4444" : "#f59e0b";
    return `<tr style="background:${i % 2 === 0 ? "#f8fafc" : "#fff"}">
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${i + 1}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600">${e.name}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-family:monospace">${e.rollNumber}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:${color};font-weight:700">
        ${e.status === "Present" ? "✓ Present" : e.status === "Absent" ? "✗ Absent" : "⚠ Rejected"}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:12px">
        ${e.gpsValid === true ? "✓ GPS" : e.gpsValid === false ? "✗ GPS" : "—"}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:12px">
        ${e.distance != null ? `${e.distance}m` : "—"}
      </td>
    </tr>`;
  }).join("");

  const pct      = r.totalStudents > 0 ? Math.round((r.presentCount / r.totalStudents) * 100) : 0;
  const barColor = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  const html = `<!DOCTYPE html><html><head><title>Attendance Report</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
    .header{border-bottom:3px solid #1e293b;padding-bottom:20px;margin-bottom:24px}
    .college{font-size:22px;font-weight:900}
    .sub{color:#64748b;font-size:13px;margin-top:4px}
    .badge{display:inline-block;background:#1e293b;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-top:10px}
    .banner{background:#f1f5f9;border-left:4px solid #3b82f6;border-radius:8px;padding:14px 18px;margin:20px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .banner .label{font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:600}
    .banner .value{font-size:14px;font-weight:700;color:#1e293b;margin-top:2px}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
    .stat{border-radius:10px;padding:14px;text-align:center}
    .stat h2{font-size:28px;font-weight:900;margin-bottom:4px}
    .stat p{font-size:12px;color:#64748b;font-weight:600}
    .pct-bar-bg{background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden;margin-top:6px}
    .pct-bar-fill{height:100%;border-radius:999px}
    table{width:100%;border-collapse:collapse;margin-top:20px}
    thead{background:#1e293b;color:white}
    th{padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:700}
    .footer{margin-top:28px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px}
  </style></head><body>
  <div class="header">
    <div class="college">BCE BHAGALPUR</div>
    <div class="sub">Bihar College of Engineering · Smart College ERP</div>
    <div class="sub" style="margin-top:6px">Live Attendance Report</div>
    <span class="badge">AUTO-GENERATED · COURSE ENROLLED STUDENTS ONLY</span>
  </div>
  <div class="banner">
    <div><div class="label">Course</div><div class="value">${session.course?.name || "—"} (${session.course?.code || ""})</div></div>
    <div><div class="label">Department &amp; Semester</div><div class="value">${session.department} · Semester ${session.semester}</div></div>
    <div><div class="label">Date &amp; Time</div><div class="value">${date}</div></div>
    <div><div class="label">Enrolled Students</div><div class="value">${r.totalStudents || 0}</div></div>
  </div>
  <div class="stats">
    <div class="stat" style="background:#f1f5f9"><h2 style="color:#1e293b">${r.totalStudents || 0}</h2><p>Enrolled</p></div>
    <div class="stat" style="background:#ecfdf5"><h2 style="color:#10b981">${r.presentCount  || 0}</h2><p>Present</p></div>
    <div class="stat" style="background:#fef2f2"><h2 style="color:#ef4444">${r.absentCount   || 0}</h2><p>Absent</p></div>
    <div class="stat" style="background:#fffbeb"><h2 style="color:#f59e0b">${r.rejectedCount || 0}</h2><p>Rejected</p></div>
  </div>
  <div style="margin:16px 0">
    <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:6px">
      <span>Attendance Rate — ${session.course?.name} (${session.department} Sem ${session.semester})</span>
      <span style="color:${barColor}">${pct}%</span>
    </div>
    <div class="pct-bar-bg"><div class="pct-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Student Name</th><th>Roll No.</th><th>Status</th><th>GPS</th><th>Distance</th></tr></thead>
    <tbody>${rows || `<tr><td colspan="6" style="text-align:center;padding:24px;color:#94a3b8">No records</td></tr>`}</tbody>
  </table>
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString("en-IN")} · BCE Bhagalpur College ERP</p>
    <p style="margin-top:4px">Only students enrolled in ${session.course?.name || "this course"} (${session.department} Sem ${session.semester}) are listed.</p>
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

// ── Session Detail Modal (same design as admin's) ─────────────────────────────
const SessionModal = ({ session, onClose }) => {
  const r       = session.report || {};
  const entries = r.entries || [];
  const pct     = r.totalStudents > 0 ? Math.round((r.presentCount / r.totalStudents) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-800">{session.course?.name || "—"}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">{session.department}</span>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">Sem {session.semester}</span>
              <span className="text-slate-400 text-xs">{fmt12(session.startTime)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => downloadSessionPDF(session)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-2">
              📄 Download PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl px-2">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label:"Enrolled",  value: r.totalStudents||0, bg:"bg-slate-50",   text:"text-slate-800"   },
              { label:"Present",   value: r.presentCount ||0, bg:"bg-emerald-50", text:"text-emerald-700" },
              { label:"Absent",    value: r.absentCount  ||0, bg:"bg-red-50",     text:"text-red-600"     },
              { label:"Rejected",  value: r.rejectedCount||0, bg:"bg-amber-50",   text:"text-amber-600"   },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
              <span>Attendance Rate</span>
              <span className={pct >= 75 ? "text-emerald-600" : "text-red-500"}>{pct}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background: pct>=75?"#10b981":pct>=50?"#f59e0b":"#ef4444" }} />
            </div>
          </div>
          {/* Table */}
          <div className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500">
                Students enrolled in {session.course?.name} — {session.department} Sem {session.semester}
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Roll No.</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">GPS</th>
                  <th className="px-4 py-3 text-center">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400">No records</td></tr>
                )}
                {entries.map((e, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{e.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{e.rollNumber}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        e.status === "Present"  ? "bg-emerald-100 text-emerald-700" :
                        e.status === "Absent"   ? "bg-red-100 text-red-600" :
                                                  "bg-amber-100 text-amber-600"
                      }`}>
                        {e.status === "Present" ? "✓ Present" : e.status === "Absent" ? "✗ Absent" : "⚠ Rejected"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs">
                      {e.gpsValid === true  ? <span className="text-emerald-600 font-bold">✓</span> :
                       e.gpsValid === false ? <span className="text-red-500 font-bold">✗</span>    :
                                             <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">
                      {e.distance != null ? `${e.distance}m` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── All existing sub-components (unchanged) ───────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium ${type === "error" ? "bg-red-500" : type === "success" ? "bg-emerald-500" : "bg-blue-500"}`}>
      {type === "success" && <Icons.Check />}{type === "error" && <Icons.Alert />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><Icons.Close /></button>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><Icons.Close /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const FormSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50" {...props}>{children}</select>
  </div>
);
const FormInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50" {...props} />
  </div>
);
const FormTextArea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <textarea rows={4} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 resize-none" {...props} />
  </div>
);
const SubmitBtn = ({ loading, children, onClick }) => (
  <button type="button" onClick={onClick} disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all">
    {loading
      ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing…</span>
      : children}
  </button>
);

const CourseCard = ({ course, studentCount, isSelected, onClick }) => (
  <button onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${isSelected ? "border-blue-500 bg-blue-50 shadow" : "border-slate-100 bg-white hover:border-blue-200"}`}>
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 text-sm truncate">{course.name}</p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{course.code}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">{course.department}</span>
        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">Sem {course.semester}</span>
      </div>
    </div>
    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
      <Icons.Students /> {studentCount} student{studentCount !== 1 ? "s" : ""} enrolled
    </div>
  </button>
);

const AttendanceModal = ({ allStudents, courses, onClose, onToast, onRefresh }) => {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?._id || "");
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows]       = useState([]);
  const selectedCourse = courses.find((c) => c._id === selectedCourseId);
  useEffect(() => {
    const enrolled = getEnrolledStudents(allStudents, selectedCourse);
    setRows(enrolled.map((s) => ({ studentId: s._id, name: s.name, roll: s.rollNumber, status: "Present" })));
  }, [selectedCourseId, allStudents, selectedCourse]);
  const toggle       = (id)     => setRows((p) => p.map((r) => r.studentId === id ? { ...r, status: r.status === "Present" ? "Absent" : "Present" } : r));
  const markAll      = (status) => setRows((p) => p.map((r) => ({ ...r, status })));
  const filtered     = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.roll?.toLowerCase().includes(search.toLowerCase()));
  const presentCount = rows.filter((r) => r.status === "Present").length;
  const absentCount  = rows.filter((r) => r.status === "Absent").length;
  const submit = async () => {
    if (!selectedCourseId) return onToast("Select a course", "error");
    if (rows.length === 0) return onToast("No students enrolled in this course", "error");
    setLoading(true);
    try {
      await Promise.all(rows.map((r) => API.post("/teacher/attendance", { studentId: r.studentId, courseId: selectedCourseId, status: r.status })));
      onToast(`Attendance marked for ${selectedCourse?.name}`, "success");
      onRefresh(); onClose();
    } catch (err) { onToast(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };
  return (
    <Modal title="✅ Mark Attendance" onClose={onClose}>
      <div className="space-y-4">
        <FormSelect label="Select Course" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
          {courses.length === 0 ? <option value="">No courses assigned</option>
            : courses.map((c) => <option key={c._id} value={c._id}>{c.name} — {c.department} Sem {c.semester}</option>)}
        </FormSelect>
        {selectedCourse && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-semibold text-blue-700">
            <Icons.Book />
            <span>{selectedCourse.department} · Semester {selectedCourse.semester} · {rows.length} student{rows.length !== 1 ? "s" : ""} enrolled</span>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={() => markAll("Present")} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl">✓ All Present</button>
          <button onClick={() => markAll("Absent")}  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-xl">✗ All Absent</button>
        </div>
        <p className="text-xs text-gray-400 bg-blue-50 rounded-xl px-3 py-2 text-center">💡 Mark all present first, then toggle absent students.</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
          <input placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50" />
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {rows.length === 0 && <p className="text-center text-gray-400 text-sm py-6">{selectedCourse ? `No students in ${selectedCourse.name}` : "Select a course"}</p>}
          {filtered.map((r) => (
            <div key={r.studentId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${r.status === "Present" ? "border-emerald-100 bg-emerald-50/40" : "border-red-100 bg-red-50/40"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${r.status === "Present" ? "bg-emerald-500" : "bg-red-500"}`} />
                <div><p className="text-sm font-semibold text-gray-800">{r.name}</p><p className="text-xs text-gray-400">{r.roll}</p></div>
              </div>
              <button onClick={() => toggle(r.studentId)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${r.status === "Present" ? "bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600" : "bg-red-100 text-red-600 hover:bg-emerald-100 hover:text-emerald-700"}`}>
                {r.status}
              </button>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-bold text-emerald-600">✓ {presentCount} Present</span>
            <span>{rows.length} Total</span>
            <span className="font-bold text-red-500">✗ {absentCount} Absent</span>
          </div>
          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width:`${rows.length > 0 ? (presentCount / rows.length) * 100 : 0}%` }} />
          </div>
        </div>
        <SubmitBtn loading={loading} onClick={submit}>Submit — {selectedCourse?.name} ({presentCount}P / {absentCount}A)</SubmitBtn>
      </div>
    </Modal>
  );
};

const NoticeModal = ({ onClose, onToast, onRefresh }) => {
  const [form, setForm]       = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!form.title.trim() || !form.message.trim()) return onToast("Title and message required", "error");
    setLoading(true);
    try { await API.post("/teacher/notices", form); onToast("Notice posted!", "success"); onRefresh(); onClose(); }
    catch (err) { onToast(err.response?.data?.message || "Failed", "error"); }
    finally { setLoading(false); }
  };
  return (
    <Modal title="🔔 Post Notice" onClose={onClose}>
      <div className="space-y-4">
        <FormInput label="Notice Title" placeholder="e.g. Mid-Semester Exam Schedule" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        <FormTextArea label="Message" placeholder="Write your notice here…" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
        <SubmitBtn loading={loading} onClick={submit}>Post Notice</SubmitBtn>
      </div>
    </Modal>
  );
};

const TopPerformersModal = ({ allStudents, courses, onClose }) => {
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const course = courses.find((c) => c._id === selectedCourseId);
  const pool   = selectedCourseId === "all" ? allStudents : getEnrolledStudents(allStudents, course);
  const sorted = [...pool].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0));
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <Modal title="🏆 Top Performers" onClose={onClose}>
      <div className="space-y-4">
        <FormSelect label="Filter by Course" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
          <option value="all">All Courses</option>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.name} — {c.department} Sem {c.semester}</option>)}
        </FormSelect>
        <div className="space-y-3">
          {sorted.length === 0 && <p className="text-center text-gray-400 py-8">No data</p>}
          {sorted.map((s, i) => {
            const col = getAttColor(s.attendance || 0);
            return (
              <div key={s._id} className={`flex items-center gap-4 p-4 rounded-2xl border ${i < 3 ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50"}`}>
                <span className="text-2xl w-8 text-center">{medals[i] || `#${i + 1}`}</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow">{getInitials(s.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.rollNumber} · {s.department} Sem {s.semester}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-violet-700">{s.avgMarks ?? "—"}<span className="text-xs text-gray-400">/100</span></p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{s.attendance}% att.</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

const StatCard = ({ icon: Ic, label, value, sub, accent }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-100 bg-white">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-6 -mt-6 ${accent}`} />
    <div className={`inline-flex p-2 rounded-xl mb-3 ${accent} bg-opacity-10`}><span className={accent.replace("bg-", "text-")}><Ic /></span></div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const QuickAction = ({ icon: Ic, label, color, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed transition-all hover:scale-105 hover:shadow-md cursor-pointer ${color}`}>
    <span className="text-2xl"><Ic /></span>
    <span className="text-xs font-semibold text-center leading-tight">{label}</span>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [allStudents,   setAllStudents]   = useState([]);
  const [courses,       setCourses]       = useState([]);
  const [notices,       setNotices]       = useState([]);
  const [todayClasses,  setTodayClasses]  = useState([]);
  const [sessions,      setSessions]      = useState([]); // ← NEW: attendance history
  const [loading,       setLoading]       = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true); // ← NEW

  const [activeCourseId, setActiveCourseId] = useState("all");
  const [activeTab,      setActiveTab]      = useState("all");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [modal,          setModal]          = useState(null);
  const [selectedSession, setSelectedSession] = useState(null); // ← NEW: for session modal
  const [toast,          setToast]          = useState(null);

  const showToast  = (msg, type = "info") => setToast({ msg, type });
  const closeToast = useCallback(() => setToast(null), []);

  const fetchData = useCallback(async () => {
    try {
      const [studRes, courseRes, noticeRes, classRes] = await Promise.allSettled([
        API.get("/teacher/students"),
        API.get("/teacher/courses"),
        API.get("/teacher/notices"),
        API.get("/routines/my-today"),
      ]);
      if (studRes.status   === "fulfilled") setAllStudents(studRes.value.data.students || []);
      if (courseRes.status === "fulfilled") setCourses(courseRes.value.data.courses || []);
      if (noticeRes.status === "fulfilled") {
        const d = noticeRes.value.data;
        setNotices(Array.isArray(d) ? d : (d?.notices || []));
      }
      if (classRes?.status === "fulfilled") setTodayClasses(classRes.value.data.classes || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  // ── NEW: Fetch teacher's own session history ───────────────────────────────
  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await API.get("/live-attendance/sessions");
      setSessions(res.data.sessions || []);
    } catch (err) { console.error(err); }
    finally { setSessionsLoading(false); }
  }, []);

  // ── NEW: Load full session data (with entries) when modal opens ────────────
  const openSessionModal = async (session) => {
    try {
      const res = await API.get(`/live-attendance/session/${session._id}`);
      setSelectedSession(res.data.session);
    } catch (err) {
      showToast("Failed to load session details", "error");
    }
  };

  useEffect(() => { fetchData();    }, [fetchData]);
  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const activeCourse = courses.find((c) => c._id === activeCourseId);
  const courseFiltered = activeCourseId === "all" ? allStudents : getEnrolledStudents(allStudents, activeCourse);
  const displayed = courseFiltered
    .filter((s) => {
      const q = searchQuery.toLowerCase();
      return s.name?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
    })
    .filter((s) => {
      if (activeTab === "atrisk")  return (s.attendance || 0) < 75;
      if (activeTab === "toppers") return (s.avgMarks || 0) >= 80;
      return true;
    })
    .sort((a, b) => (a.attendance || 0) - (b.attendance || 0));

  const base          = courseFiltered;
  const totalStudents = base.length;
  const avgAttendance = totalStudents ? Math.round(base.reduce((s, st) => s + (st.attendance || 0), 0) / totalStudents) : 0;
  const avgMarks      = totalStudents ? Math.round(base.reduce((s, st) => s + (st.avgMarks || 0), 0) / totalStudents) : 0;
  const atRisk        = base.filter((s) => (s.attendance || 0) < 75).length;
  const barData       = base.slice(0, 15).map((s) => ({ name: s.name?.split(" ")[0], Attendance: s.attendance || 0, Marks: s.avgMarks || 0 }));
  const pieData       = [
    { name: "≥ 85%",  value: base.filter((s) => (s.attendance || 0) >= 85).length },
    { name: "75–84%", value: base.filter((s) => (s.attendance || 0) >= 75 && (s.attendance || 0) < 85).length },
    { name: "< 75%",  value: base.filter((s) => (s.attendance || 0) < 75).length },
  ];
  const toppers = [...base].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0)).slice(0, 3);

  if (loading)
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 text-gray-800">

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={closeToast} />}

      {/* Session detail modal */}
      {selectedSession && (
        <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}

      {modal === "attendance" && <AttendanceModal allStudents={allStudents} courses={courses} onClose={() => setModal(null)} onToast={showToast} onRefresh={fetchData} />}
      {modal === "notice"     && <NoticeModal     onClose={() => setModal(null)} onToast={showToast} onRefresh={fetchData} />}
      {modal === "toppers"    && <TopPerformersModal allStudents={allStudents} courses={courses} onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">👋 Welcome, <span className="text-blue-600">{user?.name || "Teacher"}</span></h1>
          <p className="text-sm text-gray-400 mt-1">
            {(user?.departments || []).join(", ") || user?.department || "—"} &nbsp;·&nbsp;
            {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">🎓 Teacher Portal</span>
      </div>

      {/* Assigned Courses */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-600">📚 Assigned Courses — click to filter students</h2>
          <button onClick={() => setActiveCourseId("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition ${activeCourseId === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
            All Courses
          </button>
        </div>
        {courses.length === 0
          ? <p className="text-sm text-slate-400 italic">No courses assigned. Ask admin to assign courses to you.</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map((c) => (
                <CourseCard key={c._id} course={c}
                  studentCount={getEnrolledStudents(allStudents, c).length}
                  isSelected={activeCourseId === c._id}
                  onClick={() => setActiveCourseId(activeCourseId === c._id ? "all" : c._id)} />
              ))}
            </div>
        }
        {activeCourseId !== "all" && activeCourse && (
          <p className="text-xs text-blue-600 mt-3 font-medium bg-blue-50 rounded-xl px-3 py-2">
            📊 Filtered to <strong>{activeCourse.name}</strong> — {activeCourse.department} Semester {activeCourse.semester} — {totalStudents} student{totalStudents !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Icons.Students}   label="Students"       value={totalStudents}       sub={activeCourseId === "all" ? "All courses" : activeCourse?.name} accent="bg-blue-500" />
        <StatCard icon={Icons.Attendance} label="Avg Attendance" value={`${avgAttendance}%`} sub="Class average"  accent="bg-emerald-500" />
        <StatCard icon={Icons.Marks}      label="Avg Marks"      value={`${avgMarks}/100`}   sub="All subjects"   accent="bg-violet-500"  />
        <StatCard icon={Icons.Alert}      label="At Risk"        value={atRisk}              sub="Below 75%"      accent="bg-red-500"     />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-700">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon={Icons.Attendance} label="Mark Attendance" color="border-emerald-300 text-emerald-600 hover:bg-emerald-50" onClick={() => setModal("attendance")} />
          <QuickAction icon={Icons.Marks}      label="Add Marks"       color="border-violet-300 text-violet-600 hover:bg-violet-50"   onClick={() => navigate("/teacher/add-marks")} />
          <QuickAction icon={Icons.Notice}     label="Post Notice"     color="border-amber-300 text-amber-600 hover:bg-amber-50"      onClick={() => setModal("notice")} />
          <QuickAction icon={Icons.Trophy}     label="Top Performers"  color="border-blue-300 text-blue-600 hover:bg-blue-50"         onClick={() => setModal("toppers")} />
        </div>
      </div>

      {/* Today's Classes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">🗓 Today's Classes</h2>
          <span className="text-xs text-slate-400">{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"})}</span>
        </div>
        {todayClasses.length === 0
          ? <div className="p-8 text-center text-slate-400"><p className="text-3xl mb-2">📭</p><p className="text-sm">No classes today</p></div>
          : <div className="divide-y divide-slate-50">
              {todayClasses.map((cls, i) => {
                const now = new Date();
                const [sh,sm] = cls.startTime.split(":").map(Number);
                const [eh,em] = cls.endTime.split(":").map(Number);
                const start = new Date(); start.setHours(sh,sm,0);
                const end   = new Date(); end.setHours(eh,em,0);
                const isNow = now >= start && now <= end;
                const isDone= now > end;
                return (
                  <div key={i} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 ${isNow ? "bg-blue-50" : ""}`}>
                    <div className={`w-1.5 h-12 rounded-full shrink-0 ${isNow ? "bg-blue-500" : isDone ? "bg-slate-200" : "bg-emerald-400"}`} />
                    <div className="w-24 shrink-0">
                      <p className={`text-sm font-bold ${isNow ? "text-blue-600" : "text-slate-600"}`}>{cls.startTime} – {cls.endTime}</p>
                      {isNow && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-semibold">● Live</span>}
                      {isDone && <span className="text-xs text-slate-400">Done</span>}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{cls.subject}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">{cls.branch}</span>
                        {cls.course && <span className="ml-2">{cls.course.name} · {cls.course.code}</span>}
                        {cls.room  && <span className="ml-2">Room {cls.room}</span>}
                      </p>
                    </div>
                    {isNow && <button onClick={() => setModal("attendance")} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-700 shrink-0">Mark Attendance</button>}
                  </div>
                );
              })}
            </div>
        }
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-1 text-gray-700">📊 Attendance &amp; Marks</h2>
          <p className="text-xs text-gray-400 mb-4">{activeCourseId === "all" ? "All courses" : `${activeCourse?.name} (${activeCourse?.department} Sem ${activeCourse?.semester})`}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e5e7eb", fontSize:13 }} />
              <Legend />
              <Bar dataKey="Attendance" fill="#3b82f6" radius={[6,6,0,0]} />
              <Bar dataKey="Marks"      fill="#8b5cf6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-700">🎯 Attendance Spread</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius:"12px", fontSize:13 }} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-lg font-bold text-gray-700 flex-1">
                👨‍🎓 Students
                {activeCourseId !== "all" && activeCourse && (
                  <span className="ml-2 text-sm text-blue-500 font-semibold">— {activeCourse.department} Sem {activeCourse.semester}</span>
                )}
              </h2>
              <input type="text" placeholder="Name / Roll / Email…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-48" />
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-sm w-max">
              {[["all","All"],["atrisk","At Risk"],["toppers","Toppers"]].map(([key,label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${activeTab === key ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Roll No.</th>
                  <th className="px-5 py-3 text-center">Dept</th>
                  <th className="px-5 py-3 text-center">Sem</th>
                  <th className="px-5 py-3 text-center">Attendance</th>
                  <th className="px-5 py-3 text-center">Avg Marks</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.length === 0
                  ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">No students found.</td></tr>
                  : displayed.map((s) => {
                      const att = s.attendance || 0;
                      const col = getAttColor(att);
                      return (
                        <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow">{getInitials(s.name)}</div>
                              <div><p className="font-semibold text-gray-800">{s.name}</p><p className="text-xs text-gray-400">{s.email}</p></div>
                            </div>
                          </td>
                          <td className="px-5 py-3"><span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{s.rollNumber || "—"}</span></td>
                          <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{s.department}</span></td>
                          <td className="px-5 py-3 text-center"><span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">S{s.semester}</span></td>
                          <td className="px-5 py-3">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{att}%</span>
                              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:`${att}%`, background:col.bar }} /></div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center font-semibold text-gray-700">{s.avgMarks ?? "—"}</td>
                          <td className="px-5 py-3 text-center">
                            {att < 75
                              ? <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">⚠ At Risk</span>
                              : att >= 85
                              ? <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-medium">✓ Good</span>
                              : <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium">~ Average</span>}
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-3">🔔 Latest Notices</h2>
            {notices.length === 0 ? (
              <p className="text-sm text-gray-400">No notices yet</p>
            ) : (
              <div className="space-y-2">
                {notices.slice(0, 4).map((n) => (
                  <div key={n._id} className="group p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition">
                    <p className="text-sm font-semibold text-blue-800 leading-tight line-clamp-1">{n.title}</p>
                    <p className="text-xs text-blue-600 mt-0.5 line-clamp-1">{n.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-blue-400">{new Date(n.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
                      <button onClick={() => downloadNoticePDF(n)}
                        className="flex items-center gap-1 text-xs bg-white text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg font-semibold border border-blue-200 transition">
                        <Icons.PDF /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-3">🏆 Top Performers</h2>
            <div className="space-y-3">
              {toppers.map((s, i) => (
                <div key={s._id} className="flex items-center gap-3">
                  <span className={`text-lg font-black ${i===0?"text-yellow-500":i===1?"text-gray-400":"text-amber-600"}`}>#{i+1}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{getInitials(s.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.department} S{s.semester} · {s.avgMarks ?? "—"} marks</p>
                  </div>
                </div>
              ))}
              {toppers.length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW: Attendance Session History ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-700">📡 My Attendance Sessions</h2>
            <p className="text-xs text-slate-400 mt-0.5">All live attendance sessions you conducted — click View to see full report with PDF</p>
          </div>
          <button onClick={fetchSessions}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl font-semibold transition">
            🔄 Refresh
          </button>
        </div>

        {sessionsLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-800 border-t-transparent" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold">No sessions conducted yet</p>
            <p className="text-sm mt-1">Start a live attendance session from the Live Attendance page</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Course</th>
                  <th className="px-5 py-3 text-center">Dept</th>
                  <th className="px-5 py-3 text-center">Sem</th>
                  <th className="px-5 py-3 text-left">Date &amp; Time</th>
                  <th className="px-5 py-3 text-center">Enrolled</th>
                  <th className="px-5 py-3 text-center">Present</th>
                  <th className="px-5 py-3 text-center">Rate</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sessions.map((s, i) => {
                  const pct       = s.report?.totalStudents > 0 ? Math.round((s.report.presentCount / s.report.totalStudents) * 100) : 0;
                  const hasReport = s.report?.generated;
                  const pctColor  = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
                  return (
                    <tr key={s._id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-800">{s.course?.name || "—"}</p>
                        <p className="text-xs text-slate-400 font-mono">{s.course?.code}</p>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">{s.department}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">Sem {s.semester}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{fmt12(s.startTime)}</td>
                      <td className="px-5 py-3 text-center font-semibold text-slate-700">
                        {hasReport ? s.report.totalStudents : "—"}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {hasReport ? <span className="text-emerald-600 font-bold">{s.report.presentCount}</span> : "—"}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {hasReport ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width:`${pct}%`, background:pctColor }} />
                            </div>
                            <span className="text-xs font-bold w-8" style={{ color:pctColor }}>{pct}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">No report</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openSessionModal(s)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition text-xs font-bold">
                            👁 View
                          </button>
                          {hasReport && (
                            <button onClick={() => downloadSessionPDF(s)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition text-xs font-bold">
                              📄 PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default TeacherDashboard;