 
// import React, { useEffect, useState, useContext, useCallback } from "react";

// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend,
// } from "recharts";

// // ── Icons ────────────────────────────────────────────────────────────────────
// const Icons = {
//   Students: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
//       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
//       <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
//     </svg>
//   ),
//   Attendance: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
//       <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
//       <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
//       <polyline points="9 16 11 18 15 14" />
//     </svg>
//   ),
//   Marks: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
//       <line x1="16" y1="17" x2="8" y2="17" />
//     </svg>
//   ),
//   Notice: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
//       <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//       <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//     </svg>
//   ),
//   Trophy: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
//       <polyline points="8 21 12 17 16 21" /><line x1="12" y1="17" x2="12" y2="11" />
//       <path d="M7 4H17a1 1 0 0 1 1 1v3a5 5 0 0 1-5 5H11A5 5 0 0 1 6 8V5a1 1 0 0 1 1-1z" />
//       <path d="M6 8H4a2 2 0 0 1-2-2V6" /><path d="M18 8h2a2 2 0 0 0 2-2V6" />
//     </svg>
//   ),
//   Alert: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
//       <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
//       <line x1="12" y1="16" x2="12.01" y2="16" />
//     </svg>
//   ),
//   Close: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
//       <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//     </svg>
//   ),
//   Search: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
//       <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//     </svg>
//   ),
//   Check: () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
//       <polyline points="20 6 9 17 4 12" />
//     </svg>
//   ),
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const getInitials = (name = "") =>
//   name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// const getAttendanceColor = (pct) => {
//   if (pct >= 85) return { bg: "bg-emerald-100", text: "text-emerald-700", bar: "#10b981" };
//   if (pct >= 75) return { bg: "bg-amber-100",   text: "text-amber-700",   bar: "#f59e0b" };
//   return              { bg: "bg-red-100",        text: "text-red-700",     bar: "#ef4444" };
// };

// const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

// // ── Toast ─────────────────────────────────────────────────────────────────────
// const Toast = ({ msg, type, onClose }) => {
//   useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
//   const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-blue-500" };
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium animate-bounce-in ${colors[type] || colors.info}`}>
//       {type === "success" && <Icons.Check />}
//       {type === "error"   && <Icons.Alert />}
//       <span>{msg}</span>
//       <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><Icons.Close /></button>
//     </div>
//   );
// };

// // ── Modal Shell ───────────────────────────────────────────────────────────────
// const Modal = ({ title, onClose, children }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//       <div className="flex items-center justify-between p-6 border-b border-gray-100">
//         <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//         <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
//           <Icons.Close />
//         </button>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   </div>
// );

// // ── Form Input ────────────────────────────────────────────────────────────────
// const FormInput = ({ label, ...props }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
//     <input
//       className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition"
//       {...props}
//     />
//   </div>
// );

// const FormSelect = ({ label, children, ...props }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
//     <select
//       className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition"
//       {...props}
//     >
//       {children}
//     </select>
//   </div>
// );

// const FormTextArea = ({ label, ...props }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
//     <textarea
//       rows={4}
//       className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition resize-none"
//       {...props}
//     />
//   </div>
// );

// const SubmitBtn = ({ loading, children, onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     disabled={loading}
//     className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
//   >
//     {loading ? (
//       <span className="flex items-center justify-center gap-2">
//         <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
//         </svg>
//         Processing…
//       </span>
//     ) : children}
//   </button>
// );

// // ── Stat Card ─────────────────────────────────────────────────────────────────
// const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
//   <div className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-100 bg-white">
//     <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-6 -mt-6 ${accent}`} />
//     <div className={`inline-flex p-2 rounded-xl mb-3 ${accent} bg-opacity-10`}>
//       <span className={accent.replace("bg-", "text-")}><Icon /></span>
//     </div>
//     <p className="text-2xl font-bold text-gray-800">{value}</p>
//     <p className="text-sm font-medium text-gray-500">{label}</p>
//     {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
//   </div>
// );

// // ── Quick Action Button ───────────────────────────────────────────────────────
// const QuickAction = ({ icon: Icon, label, color, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed transition-all hover:scale-105 hover:shadow-md cursor-pointer ${color}`}
//   >
//     <span className="text-2xl"><Icon /></span>
//     <span className="text-xs font-semibold text-center leading-tight">{label}</span>
//   </button>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // MARK ATTENDANCE MODAL
// // ─────────────────────────────────────────────────────────────────────────────
// const AttendanceModal = ({ students, courses, onClose, onToast, onRefresh }) => {
//   const [rows, setRows] = useState(
//     students.map((s) => ({ studentId: s._id, name: s.name, roll: s.rollNumber, status: "Present" }))
//   );
//   const [courseId, setCourseId] = useState(courses[0]?._id || "");
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");

//   const toggle = (id) =>
//     setRows((prev) =>
//       prev.map((r) => r.studentId === id ? { ...r, status: r.status === "Present" ? "Absent" : "Present" } : r)
//     );

//   const filtered = rows.filter(
//     (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.roll?.toLowerCase().includes(search.toLowerCase())
//   );

//   const submit = async () => {
//     if (!courseId) return onToast("Please select a course", "error");
//     setLoading(true);
//     try {
//       await Promise.all(
//         rows.map((r) =>
//           API.post("/attendance/mark", { studentId: r.studentId, courseId, status: r.status })
//         )
//       );
//       onToast("Attendance marked successfully!", "success");
//       onRefresh();
//       onClose();
//     } catch (err) {
//       onToast(err.response?.data?.message || "Failed to mark attendance", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal title="✅ Mark Attendance" onClose={onClose}>
//       <div className="space-y-4">
//         <FormSelect label="Select Course / Subject" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//           {courses.length === 0 && <option value="">No courses found</option>}
//           {courses.map((c) => <option key={c._id} value={c._id}>{c.name} {c.code ? `(${c.code})` : ""}</option>)}
//         </FormSelect>

//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
//           <input
//             placeholder="Search student…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
//           />
//         </div>

//         <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
//           {filtered.map((r) => (
//             <div key={r.studentId} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
//               <div>
//                 <p className="text-sm font-semibold text-gray-800">{r.name}</p>
//                 <p className="text-xs text-gray-400">{r.roll}</p>
//               </div>
//               <button
//                 onClick={() => toggle(r.studentId)}
//                 className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
//                   r.status === "Present"
//                     ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
//                     : "bg-red-100 text-red-600 hover:bg-red-200"
//                 }`}
//               >
//                 {r.status}
//               </button>
//             </div>
//           ))}
//           {filtered.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No students found</p>}
//         </div>

//         <div className="flex gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
//           <span className="font-semibold text-emerald-600">{rows.filter(r => r.status === "Present").length} Present</span>
//           <span>·</span>
//           <span className="font-semibold text-red-500">{rows.filter(r => r.status === "Absent").length} Absent</span>
//           <span>·</span>
//           <span>{rows.length} Total</span>
//         </div>

//         <SubmitBtn loading={loading} onClick={submit}>Mark Attendance for All</SubmitBtn>
//       </div>
//     </Modal>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // ADD MARKS MODAL
// // ─────────────────────────────────────────────────────────────────────────────
// const MarksModal = ({ students, courses, onClose, onToast, onRefresh }) => {
//   const [form, setForm] = useState({ search: "", studentId: "", courseId: courses[0]?._id || "", marks: "" });
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async (q) => {
//     setForm((f) => ({ ...f, search: q, studentId: "" }));
//     setSelectedStudent(null);
//     if (q.length < 2) { setSuggestions([]); return; }
//     try {
//       const res = await API.get(`/teacher/students/search?q=${q}`);
//       setSuggestions(res.data.students || []);
//     } catch {
//       // fallback to local filter
//       setSuggestions(students.filter(
//         (s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.rollNumber?.toLowerCase().includes(q.toLowerCase())
//       ));
//     }
//   };

//   const selectStudent = (s) => {
//     setSelectedStudent(s);
//     setForm((f) => ({ ...f, search: `${s.name} (${s.rollNumber})`, studentId: s._id }));
//     setSuggestions([]);
//   };

//   const submit = async () => {
//     if (!form.studentId) return onToast("Please select a student", "error");
//     if (!form.courseId)  return onToast("Please select a course",  "error");
//     if (form.marks === "" || isNaN(form.marks)) return onToast("Enter valid marks (0–100)", "error");
//     if (Number(form.marks) < 0 || Number(form.marks) > 100) return onToast("Marks must be between 0 and 100", "error");

//     setLoading(true);
//     try {
//       await API.post("/teacher/marks", {
//         studentId: form.studentId,
//         courseId: form.courseId,
//         marks: Number(form.marks),
//       });
//       onToast("Marks added successfully!", "success");
//       onRefresh();
//       onClose();
//     } catch (err) {
//       onToast(err.response?.data?.message || "Failed to add marks", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal title="📝 Add Marks" onClose={onClose}>
//       <div className="space-y-4">
//         {/* Student search */}
//         <div className="relative">
//           <div className="flex flex-col gap-1">
//             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search Student (Name / Roll No.)</label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
//               <input
//                 placeholder="Type name or roll number…"
//                 value={form.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
//               />
//             </div>
//           </div>
//           {suggestions.length > 0 && (
//             <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
//               {suggestions.map((s) => (
//                 <button
//                   key={s._id}
//                   type="button"
//                   onClick={() => selectStudent(s)}
//                   className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-gray-50 last:border-0"
//                 >
//                   <p className="text-sm font-semibold text-gray-800">{s.name}</p>
//                   <p className="text-xs text-gray-400">Roll: {s.rollNumber} · {s.department} · Year {s.year}</p>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Selected student info */}
//         {selectedStudent && (
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
//             <p className="font-semibold text-blue-800">{selectedStudent.name}</p>
//             <p className="text-blue-600 text-xs mt-0.5">
//               Roll: {selectedStudent.rollNumber} · {selectedStudent.department} · Year {selectedStudent.year} · {selectedStudent.email}
//             </p>
//           </div>
//         )}

//         <FormSelect
//           label="Course / Subject"
//           value={form.courseId}
//           onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
//         >
//           {courses.length === 0 && <option value="">No courses found</option>}
//           {courses.map((c) => <option key={c._id} value={c._id}>{c.name} {c.code ? `(${c.code})` : ""}</option>)}
//         </FormSelect>

//         <FormInput
//           label="Marks (0 – 100)"
//           type="number"
//           min="0"
//           max="100"
//           placeholder="Enter marks"
//           value={form.marks}
//           onChange={(e) => setForm((f) => ({ ...f, marks: e.target.value }))}
//         />

//         <SubmitBtn loading={loading} onClick={submit}>Add Marks</SubmitBtn>
//       </div>
//     </Modal>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // POST NOTICE MODAL
// // ─────────────────────────────────────────────────────────────────────────────
// const NoticeModal = ({ onClose, onToast, onRefresh }) => {
//   const [form, setForm] = useState({ title: "", message: "" });
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     if (!form.title.trim() || !form.message.trim()) return onToast("Title and message are required", "error");
//     setLoading(true);
//     try {
//       await API.post("/teacher/notices", form);
//       onToast("Notice posted successfully!", "success");
//       onRefresh();
//       onClose();
//     } catch (err) {
//       onToast(err.response?.data?.message || "Failed to post notice", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal title="🔔 Post Notice" onClose={onClose}>
//       <div className="space-y-4">
//         <FormInput
//           label="Notice Title"
//           placeholder="e.g. Mid-Semester Exam Schedule"
//           value={form.title}
//           onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
//         />
//         <FormTextArea
//           label="Message"
//           placeholder="Write your notice here…"
//           value={form.message}
//           onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
//         />
//         <SubmitBtn loading={loading} onClick={submit}>Post Notice</SubmitBtn>
//       </div>
//     </Modal>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // TOP PERFORMERS MODAL
// // ─────────────────────────────────────────────────────────────────────────────
// const TopPerformersModal = ({ students, onClose }) => {
//   const sorted = [...students].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0));
//   const medals = ["🥇", "🥈", "🥉"];
//   return (
//     <Modal title="🏆 Top Performers" onClose={onClose}>
//       <div className="space-y-3">
//         {sorted.length === 0 && <p className="text-center text-gray-400 py-8">No student data available</p>}
//         {sorted.map((s, i) => {
//           const col = getAttendanceColor(s.attendance || 0);
//           return (
//             <div key={s._id} className={`flex items-center gap-4 p-4 rounded-2xl border ${i < 3 ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50"}`}>
//               <span className="text-2xl w-8 text-center">{medals[i] || `#${i + 1}`}</span>
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow">
//                 {getInitials(s.name)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-bold text-gray-800 truncate">{s.name}</p>
//                 <p className="text-xs text-gray-400">Roll: {s.rollNumber} · {s.department}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-bold text-violet-700">{s.avgMarks ?? "—"}<span className="text-xs text-gray-400">/100</span></p>
//                 <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{s.attendance}% att.</span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </Modal>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // NOTICE ITEM
// // ─────────────────────────────────────────────────────────────────────────────
// const NoticeItem = ({ text, time, type }) => {
//   const styles = {
//     alert:   "bg-red-50 border-red-300 text-red-700",
//     info:    "bg-blue-50 border-blue-300 text-blue-700",
//     success: "bg-emerald-50 border-emerald-300 text-emerald-700",
//   };
//   return (
//     <div className={`flex items-start gap-3 p-3 rounded-xl border-l-4 ${styles[type] || styles.info}`}>
//       <Icons.Alert />
//       <div>
//         <p className="text-sm font-medium">{text}</p>
//         <p className="text-xs opacity-60 mt-0.5">{time}</p>
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN DASHBOARD
// // ─────────────────────────────────────────────────────────────────────────────
// const TeacherDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const [students, setStudents]   = useState([]);
//   const [courses, setCourses]     = useState([]);
//   const [notices, setNotices]     = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("all");
//   const [modal, setModal]         = useState(null); // "attendance" | "marks" | "notice" | "toppers"
//   const [toast, setToast]         = useState(null); // { msg, type }

//   const showToast = (msg, type = "info") => setToast({ msg, type });
//   const closeToast = useCallback(() => setToast(null), []);

//   const fetchData = useCallback(async () => {
//     try {
//       const [studRes, courseRes, noticeRes] = await Promise.allSettled([
//         API.get("/teacher/students"),
//         API.get("/teacher/courses"),
//         API.get("/teacher/notices"),
//       ]);

//       if (studRes.status === "fulfilled") {
//         setStudents(studRes.value.data.students || []);
//       } else {
//         // Demo fallback
//         setStudents([
//           { _id: "1", name: "Ritu Sharma",    email: "ritu@college.edu",    rollNumber: "CS001", department: "CSE", year: 2, attendance: 92, avgMarks: 87 },
//           { _id: "2", name: "Pawan Kumar",    email: "pawan@college.edu",   rollNumber: "CS002", department: "CSE", year: 2, attendance: 68, avgMarks: 54 },
//           { _id: "3", name: "Abhishek Singh", email: "abhi@college.edu",    rollNumber: "CS003", department: "CSE", year: 3, attendance: 80, avgMarks: 73 },
//           { _id: "4", name: "Niranjan Das",   email: "niranjan@college.edu",rollNumber: "CS004", department: "CSE", year: 1, attendance: 55, avgMarks: 45 },
//           { _id: "5", name: "Pooja Verma",    email: "pooja@college.edu",   rollNumber: "CS005", department: "CSE", year: 2, attendance: 88, avgMarks: 91 },
//           { _id: "6", name: "Rahul Mehta",    email: "rahul@college.edu",   rollNumber: "CS006", department: "CSE", year: 3, attendance: 76, avgMarks: 68 },
//         ]);
//       }

//       if (courseRes.status === "fulfilled") {
//         setCourses(courseRes.value.data.courses || []);
//       } else {
//         // Demo courses so modals are usable even before DB is seeded
//         setCourses([
//           { _id: "c1", name: "Data Structures", code: "CS301" },
//           { _id: "c2", name: "Operating Systems", code: "CS302" },
//           { _id: "c3", name: "DBMS", code: "CS303" },
//         ]);
//       }

//       if (noticeRes.status === "fulfilled") {
//         setNotices(noticeRes.value.data.notices || []);
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   // ── Derived stats ──────────────────────────────────────────────────────────
//   const totalStudents = students.length;
//   const avgAttendance = totalStudents
//     ? Math.round(students.reduce((s, st) => s + (st.attendance || 0), 0) / totalStudents) : 0;
//   const avgMarks = totalStudents
//     ? Math.round(students.reduce((s, st) => s + (st.avgMarks || 0), 0) / totalStudents) : 0;
//   const atRisk = students.filter((s) => (s.attendance || 0) < 75).length;

//   // ── Chart data ─────────────────────────────────────────────────────────────
//   const barData = students.map((s) => ({
//     name: s.name?.split(" ")[0],
//     Attendance: s.attendance || 0,
//     Marks: s.avgMarks || 0,
//   }));

//   const pieData = [
//     { name: "≥ 85%",  value: students.filter((s) => (s.attendance || 0) >= 85).length },
//     { name: "75–84%", value: students.filter((s) => (s.attendance || 0) >= 75 && (s.attendance || 0) < 85).length },
//     { name: "< 75%",  value: students.filter((s) => (s.attendance || 0) < 75).length },
//   ];

//   // ── Filtered students ──────────────────────────────────────────────────────
//   const filtered = students
//     .filter((s) => {
//       const q = searchQuery.toLowerCase();
//       return (
//         s.name?.toLowerCase().includes(q) ||
//         s.email?.toLowerCase().includes(q) ||
//         s.rollNumber?.toLowerCase().includes(q)
//       );
//     })
//     .filter((s) => {
//       if (activeTab === "atrisk")  return (s.attendance || 0) < 75;
//       if (activeTab === "toppers") return (s.avgMarks || 0) >= 80;
//       return true;
//     });

//   // ── Notices for sidebar ────────────────────────────────────────────────────
//   const sidebarNotices = notices.length > 0
//     ? notices.slice(0, 3).map((n) => ({
//         text: n.title,
//         time: new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
//         type: "info",
//       }))
//     : [
//         { text: `${atRisk} student(s) have attendance below 75%`, time: "Today", type: atRisk > 0 ? "alert" : "success" },
//         { text: "Mid-semester exams scheduled next week", time: "Yesterday", type: "info" },
//         { text: "Grade submission deadline: 15th of this month", time: "2 days ago", type: "alert" },
//       ];

//   const toppers = [...students].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0)).slice(0, 3);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-6 text-gray-800">

//       {/* Toast */}
//       {toast && <Toast msg={toast.msg} type={toast.type} onClose={closeToast} />}

//       {/* Modals */}
//       {modal === "attendance" && (
//         <AttendanceModal
//           students={students}
//           courses={courses}
//           onClose={() => setModal(null)}
//           onToast={showToast}
//           onRefresh={fetchData}
//         />
//       )}
//       {modal === "marks" && (
//         <MarksModal
//           students={students}
//           courses={courses}
//           onClose={() => setModal(null)}
//           onToast={showToast}
//           onRefresh={fetchData}
//         />
//       )}
//       {modal === "notice" && (
//         <NoticeModal
//           onClose={() => setModal(null)}
//           onToast={showToast}
//           onRefresh={fetchData}
//         />
//       )}
//       {modal === "toppers" && (
//         <TopPerformersModal
//           students={students}
//           onClose={() => setModal(null)}
//         />
//       )}

//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900">
//             👋 Welcome, <span className="text-blue-600">{user?.name || "Teacher"}</span>
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">
//             {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
//           </p>
//         </div>
//         <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
//           🎓 Teacher Portal
//         </span>
//       </div>

//       {/* ── Stat Cards ── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard icon={Icons.Students}   label="Total Students"  value={totalStudents}        sub="Enrolled in your class"  accent="bg-blue-500"    />
//         <StatCard icon={Icons.Attendance} label="Avg. Attendance" value={`${avgAttendance}%`}  sub="Class average"           accent="bg-emerald-500" />
//         <StatCard icon={Icons.Marks}      label="Avg. Marks"      value={`${avgMarks}/100`}    sub="Across all subjects"     accent="bg-violet-500"  />
//         <StatCard icon={Icons.Alert}      label="At Risk"         value={atRisk}               sub="Below 75% attendance"    accent="bg-red-500"     />
//       </div>

//       {/* ── Quick Actions ── */}
//       <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//         <h2 className="text-lg font-bold mb-4 text-gray-700">⚡ Quick Actions</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <QuickAction icon={Icons.Attendance} label="Mark Attendance" color="border-emerald-300 text-emerald-600 hover:bg-emerald-50" onClick={() => setModal("attendance")} />
//           <QuickAction icon={Icons.Marks}      label="Add Marks"       color="border-violet-300 text-violet-600 hover:bg-violet-50"   onClick={() => setModal("marks")}      />
//           <QuickAction icon={Icons.Notice}     label="Post Notice"     color="border-amber-300  text-amber-600  hover:bg-amber-50"    onClick={() => setModal("notice")}     />
//           <QuickAction icon={Icons.Trophy}     label="Top Performers"  color="border-blue-300   text-blue-600   hover:bg-blue-50"     onClick={() => setModal("toppers")}    />
//         </div>
//       </div>

//       {/* ── Charts Row ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-bold mb-4 text-gray-700">📊 Attendance & Marks by Student</h2>
//           <ResponsiveContainer width="100%" height={220}>
//             <BarChart data={barData} barGap={4}>
//               <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//               <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
//               <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 13 }} />
//               <Legend />
//               <Bar dataKey="Attendance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//               <Bar dataKey="Marks"      fill="#8b5cf6" radius={[6, 6, 0, 0]} />
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
//               <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 13 }} />
//               <Legend iconType="circle" />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* ── Bottom Row ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

//         {/* Student Table */}
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
//             <h2 className="text-lg font-bold text-gray-700 flex-1">👨‍🎓 Your Students</h2>
//             <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-sm">
//               {[["all","All"],["atrisk","At Risk"],["toppers","Toppers"]].map(([key, label]) => (
//                 <button
//                   key={key}
//                   onClick={() => setActiveTab(key)}
//                   className={`px-3 py-1 rounded-lg font-medium transition-all ${
//                     activeTab === key ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//             <input
//               type="text"
//               placeholder="Name / Roll / Email…"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-48"
//             />
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
//                 <tr>
//                   <th className="px-5 py-3 text-left">Student</th>
//                   <th className="px-5 py-3 text-left">Roll No.</th>
//                   <th className="px-5 py-3 text-center">Attendance</th>
//                   <th className="px-5 py-3 text-center">Avg. Marks</th>
//                   <th className="px-5 py-3 text-center">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {filtered.length === 0 ? (
//                   <tr><td colSpan={5} className="text-center py-8 text-gray-400">No students found.</td></tr>
//                 ) : filtered.map((s) => {
//                   const att = s.attendance || 0;
//                   const col = getAttendanceColor(att);
//                   return (
//                     <tr key={s._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-5 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow">
//                             {getInitials(s.name)}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-800">{s.name}</p>
//                             <p className="text-xs text-gray-400">{s.email}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-3">
//                         <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{s.rollNumber || "—"}</span>
//                       </td>
//                       <td className="px-5 py-3">
//                         <div className="flex flex-col items-center gap-1">
//                           <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{att}%</span>
//                           <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                             <div className="h-full rounded-full" style={{ width: `${att}%`, background: col.bar }} />
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-3 text-center font-semibold text-gray-700">{s.avgMarks ?? "—"}</td>
//                       <td className="px-5 py-3 text-center">
//                         {att < 75
//                           ? <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">⚠ At Risk</span>
//                           : att >= 85
//                           ? <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-medium">✓ Good</span>
//                           : <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium">~ Average</span>}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Right Sidebar */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//             <h2 className="text-lg font-bold text-gray-700 mb-3">🔔 Notifications</h2>
//             <div className="space-y-2">
//               {sidebarNotices.map((n, i) => <NoticeItem key={i} {...n} />)}
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//             <h2 className="text-lg font-bold text-gray-700 mb-3">🏆 Top Performers</h2>
//             <div className="space-y-3">
//               {toppers.map((s, i) => (
//                 <div key={s._id} className="flex items-center gap-3">
//                   <span className={`text-lg font-black ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-amber-600"}`}>#{i + 1}</span>
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
//                     {getInitials(s.name)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
//                     <p className="text-xs text-gray-400">{s.rollNumber} · {s.avgMarks ?? "—"} marks</p>
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

// ── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Students: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Attendance: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  ),
  Marks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Notice: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="8 21 12 17 16 21" /><line x1="12" y1="17" x2="12" y2="11" />
      <path d="M7 4H17a1 1 0 0 1 1 1v3a5 5 0 0 1-5 5H11A5 5 0 0 1 6 8V5a1 1 0 0 1 1-1z" />
      <path d="M6 8H4a2 2 0 0 1-2-2V6" /><path d="M18 8h2a2 2 0 0 0 2-2V6" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const getAttendanceColor = (pct) => {
  if (pct >= 85) return { bg: "bg-emerald-100", text: "text-emerald-700", bar: "#10b981" };
  if (pct >= 75) return { bg: "bg-amber-100",   text: "text-amber-700",   bar: "#f59e0b" };
  return              { bg: "bg-red-100",        text: "text-red-700",     bar: "#ef4444" };
};

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-blue-500" };
  return (
    <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium animate-bounce-in ${colors[type] || colors.info}`}>
      {type === "success" && <Icons.Check />}
      {type === "error"   && <Icons.Alert />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><Icons.Close /></button>
    </div>
  );
};

// ── Modal Shell ───────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Icons.Close />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ── Form Input ────────────────────────────────────────────────────────────────
const FormInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <input
      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <select
      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition"
      {...props}
    >
      {children}
    </select>
  </div>
);

const FormTextArea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <textarea
      rows={4}
      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition resize-none"
      {...props}
    />
  </div>
);

const SubmitBtn = ({ loading, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Processing…
      </span>
    ) : children}
  </button>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-100 bg-white">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-6 -mt-6 ${accent}`} />
    <div className={`inline-flex p-2 rounded-xl mb-3 ${accent} bg-opacity-10`}>
      <span className={accent.replace("bg-", "text-")}><Icon /></span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

// ── Quick Action Button ───────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed transition-all hover:scale-105 hover:shadow-md cursor-pointer ${color}`}
  >
    <span className="text-2xl"><Icon /></span>
    <span className="text-xs font-semibold text-center leading-tight">{label}</span>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MARK ATTENDANCE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const AttendanceModal = ({ students, courses, onClose, onToast, onRefresh }) => {
  const [rows, setRows] = useState(
    students.map((s) => ({ studentId: s._id, name: s.name, roll: s.rollNumber, status: "Present" }))
  );
  const [courseId, setCourseId] = useState(courses[0]?._id || "");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = (id) =>
    setRows((prev) =>
      prev.map((r) => r.studentId === id ? { ...r, status: r.status === "Present" ? "Absent" : "Present" } : r)
    );

  // ✅ Bulk actions
  const markAllPresent = () => setRows((prev) => prev.map((r) => ({ ...r, status: "Present" })));
  const markAllAbsent  = () => setRows((prev) => prev.map((r) => ({ ...r, status: "Absent" })));

  const filtered = rows.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.roll?.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = rows.filter(r => r.status === "Present").length;
  const absentCount  = rows.filter(r => r.status === "Absent").length;

  const submit = async () => {
    if (!courseId) return onToast("Please select a course", "error");
    setLoading(true);
    try {
      await Promise.all(
        rows.map((r) =>
          API.post("/attendance/mark", { studentId: r.studentId, courseId, status: r.status })
        )
      );
      onToast(`Attendance marked! ${presentCount} Present, ${absentCount} Absent`, "success");
      onRefresh();
      onClose();
    } catch (err) {
      onToast(err.response?.data?.message || "Failed to mark attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="✅ Mark Attendance" onClose={onClose}>
      <div className="space-y-4">
        <FormSelect label="Select Course / Subject" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.length === 0 && <option value="">No courses found</option>}
          {courses.map((c) => <option key={c._id} value={c._id}>{c.name} {c.code ? `(${c.code})` : ""}</option>)}
        </FormSelect>

        {/* ✅ Bulk Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={markAllPresent}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={markAllAbsent}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-xl transition"
          >
            ✗ Mark All Absent
          </button>
        </div>

        {/* Tip */}
        <p className="text-xs text-gray-400 bg-blue-50 rounded-xl px-3 py-2 text-center">
          💡 <strong>Tip:</strong> Click "Mark All Present" first, then toggle only absent students. Fast for large classes!
        </p>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
          <input
            placeholder="Search student by name or roll…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
          />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {filtered.map((r) => (
            <div key={r.studentId} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition ${
              r.status === "Present" ? "border-emerald-100 bg-emerald-50/40" : "border-red-100 bg-red-50/40"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${r.status === "Present" ? "bg-emerald-500" : "bg-red-500"}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.roll}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(r.studentId)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  r.status === "Present"
                    ? "bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600"
                    : "bg-red-100 text-red-600 hover:bg-emerald-100 hover:text-emerald-700"
                }`}
              >
                {r.status}
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No students found</p>}
        </div>

        {/* Summary bar */}
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-bold text-emerald-600">✓ {presentCount} Present</span>
            <span>{rows.length} Total</span>
            <span className="font-bold text-red-500">✗ {absentCount} Absent</span>
          </div>
          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${rows.length > 0 ? (presentCount / rows.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <SubmitBtn loading={loading} onClick={submit}>
          {loading ? "Saving..." : `Submit Attendance (${presentCount}P / ${absentCount}A)`}
        </SubmitBtn>
      </div>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ADD MARKS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const MarksModal = ({ students, courses, onClose, onToast, onRefresh }) => {
  const [form, setForm] = useState({ search: "", studentId: "", courseId: courses[0]?._id || "", marks: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q) => {
    setForm((f) => ({ ...f, search: q, studentId: "" }));
    setSelectedStudent(null);
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const res = await API.get(`/teacher/students/search?q=${q}`);
      setSuggestions(res.data.students || []);
    } catch {
      // fallback to local filter
      setSuggestions(students.filter(
        (s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.rollNumber?.toLowerCase().includes(q.toLowerCase())
      ));
    }
  };

  const selectStudent = (s) => {
    setSelectedStudent(s);
    setForm((f) => ({ ...f, search: `${s.name} (${s.rollNumber})`, studentId: s._id }));
    setSuggestions([]);
  };

  const submit = async () => {
    if (!form.studentId) return onToast("Please select a student", "error");
    if (!form.courseId)  return onToast("Please select a course",  "error");
    if (form.marks === "" || isNaN(form.marks)) return onToast("Enter valid marks (0–100)", "error");
    if (Number(form.marks) < 0 || Number(form.marks) > 100) return onToast("Marks must be between 0 and 100", "error");

    setLoading(true);
    try {
      await API.post("/teacher/marks", {
        studentId: form.studentId,
        courseId: form.courseId,
        marks: Number(form.marks),
      });
      onToast("Marks added successfully!", "success");
      onRefresh();
      onClose();
    } catch (err) {
      onToast(err.response?.data?.message || "Failed to add marks", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="📝 Add Marks" onClose={onClose}>
      <div className="space-y-4">
        {/* Student search */}
        <div className="relative">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search Student (Name / Roll No.)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
              <input
                placeholder="Type name or roll number…"
                value={form.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
              />
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => selectStudent(s)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-gray-50 last:border-0"
                >
                  <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">Roll: {s.rollNumber} · {s.department} · Year {s.year}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected student info */}
        {selectedStudent && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
            <p className="font-semibold text-blue-800">{selectedStudent.name}</p>
            <p className="text-blue-600 text-xs mt-0.5">
              Roll: {selectedStudent.rollNumber} · {selectedStudent.department} · Year {selectedStudent.year} · {selectedStudent.email}
            </p>
          </div>
        )}

        <FormSelect
          label="Course / Subject"
          value={form.courseId}
          onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
        >
          {courses.length === 0 && <option value="">No courses found</option>}
          {courses.map((c) => <option key={c._id} value={c._id}>{c.name} {c.code ? `(${c.code})` : ""}</option>)}
        </FormSelect>

        <FormInput
          label="Marks (0 – 100)"
          type="number"
          min="0"
          max="100"
          placeholder="Enter marks"
          value={form.marks}
          onChange={(e) => setForm((f) => ({ ...f, marks: e.target.value }))}
        />

        <SubmitBtn loading={loading} onClick={submit}>Add Marks</SubmitBtn>
      </div>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// POST NOTICE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const NoticeModal = ({ onClose, onToast, onRefresh }) => {
  const [form, setForm] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.title.trim() || !form.message.trim()) return onToast("Title and message are required", "error");
    setLoading(true);
    try {
      await API.post("/teacher/notices", form);
      onToast("Notice posted successfully!", "success");
      onRefresh();
      onClose();
    } catch (err) {
      onToast(err.response?.data?.message || "Failed to post notice", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="🔔 Post Notice" onClose={onClose}>
      <div className="space-y-4">
        <FormInput
          label="Notice Title"
          placeholder="e.g. Mid-Semester Exam Schedule"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <FormTextArea
          label="Message"
          placeholder="Write your notice here…"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
        <SubmitBtn loading={loading} onClick={submit}>Post Notice</SubmitBtn>
      </div>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOP PERFORMERS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const TopPerformersModal = ({ students, onClose }) => {
  const sorted = [...students].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0));
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <Modal title="🏆 Top Performers" onClose={onClose}>
      <div className="space-y-3">
        {sorted.length === 0 && <p className="text-center text-gray-400 py-8">No student data available</p>}
        {sorted.map((s, i) => {
          const col = getAttendanceColor(s.attendance || 0);
          return (
            <div key={s._id} className={`flex items-center gap-4 p-4 rounded-2xl border ${i < 3 ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50"}`}>
              <span className="text-2xl w-8 text-center">{medals[i] || `#${i + 1}`}</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow">
                {getInitials(s.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{s.name}</p>
                <p className="text-xs text-gray-400">Roll: {s.rollNumber} · {s.department}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-violet-700">{s.avgMarks ?? "—"}<span className="text-xs text-gray-400">/100</span></p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{s.attendance}% att.</span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTICE ITEM
// ─────────────────────────────────────────────────────────────────────────────
const NoticeItem = ({ text, time, type }) => {
  const styles = {
    alert:   "bg-red-50 border-red-300 text-red-700",
    info:    "bg-blue-50 border-blue-300 text-blue-700",
    success: "bg-emerald-50 border-emerald-300 text-emerald-700",
  };
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border-l-4 ${styles[type] || styles.info}`}>
      <Icons.Alert />
      <div>
        <p className="text-sm font-medium">{text}</p>
        <p className="text-xs opacity-60 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents]   = useState([]);
  const [courses, setCourses]     = useState([]);
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [modal, setModal]         = useState(null); // "attendance" | "marks" | "notice" | "toppers"
  const [toast, setToast]         = useState(null); // { msg, type }

  const showToast = (msg, type = "info") => setToast({ msg, type });
  const closeToast = useCallback(() => setToast(null), []);

  const fetchData = useCallback(async () => {
    try {
      const [studRes, courseRes, noticeRes] = await Promise.allSettled([
        API.get("/teacher/students"),
        API.get("/teacher/courses"),
        API.get("/teacher/notices"),
      ]);

      if (studRes.status === "fulfilled") {
        setStudents(studRes.value.data.students || []);
      } else {
        // Demo fallback
        setStudents([
          { _id: "1", name: "Ritu Sharma",    email: "ritu@college.edu",    rollNumber: "CS001", department: "CSE", year: 2, attendance: 92, avgMarks: 87 },
          { _id: "2", name: "Pawan Kumar",    email: "pawan@college.edu",   rollNumber: "CS002", department: "CSE", year: 2, attendance: 68, avgMarks: 54 },
          { _id: "3", name: "Abhishek Singh", email: "abhi@college.edu",    rollNumber: "CS003", department: "CSE", year: 3, attendance: 80, avgMarks: 73 },
          { _id: "4", name: "Niranjan Das",   email: "niranjan@college.edu",rollNumber: "CS004", department: "CSE", year: 1, attendance: 55, avgMarks: 45 },
          { _id: "5", name: "Pooja Verma",    email: "pooja@college.edu",   rollNumber: "CS005", department: "CSE", year: 2, attendance: 88, avgMarks: 91 },
          { _id: "6", name: "Rahul Mehta",    email: "rahul@college.edu",   rollNumber: "CS006", department: "CSE", year: 3, attendance: 76, avgMarks: 68 },
        ]);
      }

      if (courseRes.status === "fulfilled") {
        setCourses(courseRes.value.data.courses || []);
      } else {
        // Demo courses so modals are usable even before DB is seeded
        setCourses([
          { _id: "c1", name: "Data Structures", code: "CS301" },
          { _id: "c2", name: "Operating Systems", code: "CS302" },
          { _id: "c3", name: "DBMS", code: "CS303" },
        ]);
      }

      if (noticeRes.status === "fulfilled") {
        setNotices(noticeRes.value.data.notices || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalStudents = students.length;
  const avgAttendance = totalStudents
    ? Math.round(students.reduce((s, st) => s + (st.attendance || 0), 0) / totalStudents) : 0;
  const avgMarks = totalStudents
    ? Math.round(students.reduce((s, st) => s + (st.avgMarks || 0), 0) / totalStudents) : 0;
  const atRisk = students.filter((s) => (s.attendance || 0) < 75).length;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const barData = students.map((s) => ({
    name: s.name?.split(" ")[0],
    Attendance: s.attendance || 0,
    Marks: s.avgMarks || 0,
  }));

  const pieData = [
    { name: "≥ 85%",  value: students.filter((s) => (s.attendance || 0) >= 85).length },
    { name: "75–84%", value: students.filter((s) => (s.attendance || 0) >= 75 && (s.attendance || 0) < 85).length },
    { name: "< 75%",  value: students.filter((s) => (s.attendance || 0) < 75).length },
  ];

  // ── Filtered students ──────────────────────────────────────────────────────
  const filtered = students
    .filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.rollNumber?.toLowerCase().includes(q)
      );
    })
    .filter((s) => {
      if (activeTab === "atrisk")  return (s.attendance || 0) < 75;
      if (activeTab === "toppers") return (s.avgMarks || 0) >= 80;
      return true;
    });

  // ── Notices for sidebar ────────────────────────────────────────────────────
  const sidebarNotices = notices.length > 0
    ? notices.slice(0, 3).map((n) => ({
        text: n.title,
        time: new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        type: "info",
      }))
    : [
        { text: `${atRisk} student(s) have attendance below 75%`, time: "Today", type: atRisk > 0 ? "alert" : "success" },
        { text: "Mid-semester exams scheduled next week", time: "Yesterday", type: "info" },
        { text: "Grade submission deadline: 15th of this month", time: "2 days ago", type: "alert" },
      ];

  const toppers = [...students].sort((a, b) => (b.avgMarks || 0) - (a.avgMarks || 0)).slice(0, 3);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 text-gray-800">

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={closeToast} />}

      {/* Modals */}
      {modal === "attendance" && (
        <AttendanceModal
          students={students}
          courses={courses}
          onClose={() => setModal(null)}
          onToast={showToast}
          onRefresh={fetchData}
        />
      )}
      {modal === "marks" && (
        <MarksModal
          students={students}
          courses={courses}
          onClose={() => setModal(null)}
          onToast={showToast}
          onRefresh={fetchData}
        />
      )}
      {modal === "notice" && (
        <NoticeModal
          onClose={() => setModal(null)}
          onToast={showToast}
          onRefresh={fetchData}
        />
      )}
      {modal === "toppers" && (
        <TopPerformersModal
          students={students}
          onClose={() => setModal(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            👋 Welcome, <span className="text-blue-600">{user?.name || "Teacher"}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200">
          🎓 Teacher Portal
        </span>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Icons.Students}   label="Total Students"  value={totalStudents}        sub="Enrolled in your class"  accent="bg-blue-500"    />
        <StatCard icon={Icons.Attendance} label="Avg. Attendance" value={`${avgAttendance}%`}  sub="Class average"           accent="bg-emerald-500" />
        <StatCard icon={Icons.Marks}      label="Avg. Marks"      value={`${avgMarks}/100`}    sub="Across all subjects"     accent="bg-violet-500"  />
        <StatCard icon={Icons.Alert}      label="At Risk"         value={atRisk}               sub="Below 75% attendance"    accent="bg-red-500"     />
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-700">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon={Icons.Attendance} label="Mark Attendance" color="border-emerald-300 text-emerald-600 hover:bg-emerald-50" onClick={() => setModal("attendance")} />
          <QuickAction icon={Icons.Marks}      label="Add Marks"       color="border-violet-300 text-violet-600 hover:bg-violet-50"   onClick={() => setModal("marks")}      />
          <QuickAction icon={Icons.Notice}     label="Post Notice"     color="border-amber-300  text-amber-600  hover:bg-amber-50"    onClick={() => setModal("notice")}     />
          <QuickAction icon={Icons.Trophy}     label="Top Performers"  color="border-blue-300   text-blue-600   hover:bg-blue-50"     onClick={() => setModal("toppers")}    />
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-700">📊 Attendance & Marks by Student</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barGap={4}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 13 }} />
              <Legend />
              <Bar dataKey="Attendance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Marks"      fill="#8b5cf6" radius={[6, 6, 0, 0]} />
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
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 13 }} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Student Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-lg font-bold text-gray-700 flex-1">👨‍🎓 Your Students</h2>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-sm">
              {[["all","All"],["atrisk","At Risk"],["toppers","Toppers"]].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeTab === key ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Name / Roll / Email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-48"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Student</th>
                  <th className="px-5 py-3 text-left">Roll No.</th>
                  <th className="px-5 py-3 text-center">Attendance</th>
                  <th className="px-5 py-3 text-center">Avg. Marks</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">No students found.</td></tr>
                ) : filtered.map((s) => {
                  const att = s.attendance || 0;
                  const col = getAttendanceColor(att);
                  return (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow">
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{s.rollNumber || "—"}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{att}%</span>
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${att}%`, background: col.bar }} />
                          </div>
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
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-3">🔔 Notifications</h2>
            <div className="space-y-2">
              {sidebarNotices.map((n, i) => <NoticeItem key={i} {...n} />)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-3">🏆 Top Performers</h2>
            <div className="space-y-3">
              {toppers.map((s, i) => (
                <div key={s._id} className="flex items-center gap-3">
                  <span className={`text-lg font-black ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-amber-600"}`}>#{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(s.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.rollNumber} · {s.avgMarks ?? "—"} marks</p>
                  </div>
                </div>
              ))}
              {toppers.length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;