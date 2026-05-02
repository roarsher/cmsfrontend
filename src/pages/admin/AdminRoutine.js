//  import React, { useEffect, useState } from "react";
//  import { useCallback } from "react";
// import API from "../../api/axios";

// const BRANCHES   = ["CSE", "ECE", "ME", "CE", "EE"];
// const TIME_SLOTS = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

// const fmt12 = (t) => {
//   if (!t) return "";
//   const [h, m] = t.split(":").map(Number);
//   const ampm = h >= 12 ? "PM" : "AM";
//   return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${ampm}`;
// };

// const todayStr = () => new Date().toISOString().split("T")[0];

// const isBeforeDeadline = () => new Date().getHours() < 10;

// // ── Slot Row ──────────────────────────────────────────────────────────────────
// const SlotRow = ({ slot, index, teachers, courses, onChange, onRemove }) => (
//   <div className="grid grid-cols-12 gap-2 items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
//     <div className="col-span-1 text-xs font-black text-slate-400 text-center">{index + 1}</div>

//     <select value={slot.startTime} onChange={(e) => onChange(index, "startTime", e.target.value)}
//       className="col-span-2 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400">
//       {TIME_SLOTS.map((t) => <option key={t} value={t}>{fmt12(t)}</option>)}
//     </select>

//     <select value={slot.endTime} onChange={(e) => onChange(index, "endTime", e.target.value)}
//       className="col-span-2 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400">
//       {TIME_SLOTS.map((t) => <option key={t} value={t}>{fmt12(t)}</option>)}
//     </select>

//     {/* <input value={slot.subject} onChange={(e) => onChange(index, "subject", e.target.value)}
//       placeholder="Subject name"
//       className="col-span-3 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400" /> */}
// <select
//   value={slot.course}
//   onChange={(e) => {
//     const selectedCourse = courses.find(c => c._id === e.target.value);

//     onChange(index, "course", e.target.value);
//     onChange(index, "subject", selectedCourse?.name || "");
//   }}
//   className="col-span-3 border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
// >
//   <option value="">Select Course</option>
//   {courses.map((c) => (
//     <option key={c._id} value={c._id}>
//       {c.name} ({c.code})
//     </option>
//   ))}
// </select>



//     <select value={slot.teacher} onChange={(e) => onChange(index, "teacher", e.target.value)}
//       className="col-span-3 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400">
//       <option value="">Select Teacher</option>
//       {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
//     </select>

//     <button onClick={() => onRemove(index)}
//       className="col-span-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1 transition text-center">
//       ✕
//     </button>
//   </div>
// );

// // ── Routine Card ──────────────────────────────────────────────────────────────
// const RoutineCard = ({ routine, teachers, onEdit, onDelete, canEdit }) => {
//   const isToday = new Date(routine.date).toDateString() === new Date().toDateString();
//   const editable = !isToday || isBeforeDeadline();

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//       <div className={`px-5 py-3 flex items-center justify-between border-b border-slate-100 ${isToday ? "bg-blue-50" : ""}`}>
//         <div className="flex items-center gap-3">
//           <span className={`text-xs font-black px-3 py-1 rounded-full ${
//             routine.branch === "CSE" ? "bg-blue-100 text-blue-700" :
//             routine.branch === "ECE" ? "bg-purple-100 text-purple-700" :
//             routine.branch === "ME"  ? "bg-orange-100 text-orange-700" :
//             routine.branch === "CE"  ? "bg-emerald-100 text-emerald-700" :
//                                        "bg-amber-100 text-amber-700"
//           }`}>{routine.branch}</span>
//           <span className="font-bold text-slate-700 text-sm">
//             {new Date(routine.date).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
//           </span>
//           {isToday && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Today</span>}
//         </div>
//         <div className="flex gap-2">
//           {editable && (
//             <button onClick={() => onEdit(routine)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg font-semibold text-slate-600 transition">
//               ✏️ Edit
//             </button>
//           )}
//           {editable && (
//             <button onClick={() => onDelete(routine._id)} className="text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg font-semibold text-red-500 transition">
//               🗑
//             </button>
//           )}
//           {!editable && <span className="text-xs text-slate-400 font-semibold">🔒 Locked</span>}
//         </div>
//       </div>
//       <div className="divide-y divide-slate-50">
//         {routine.slots.map((s, i) => (
//           <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition">
//             <div className="text-xs font-bold text-slate-500 w-28 shrink-0">
//               {fmt12(s.startTime)} – {fmt12(s.endTime)}
//             </div>
//             <div className="flex-1">
//               <p className="font-semibold text-slate-800 text-sm">{s.subject}</p>
//               {s.course && <p className="text-xs text-slate-400">{s.course?.name} · {s.course?.code}</p>}
//             </div>
//             <div className="text-right">
//               <p className="text-xs font-semibold text-slate-600">{s.teacher?.name || "—"}</p>
//               {s.room && <p className="text-xs text-slate-400">Room {s.room}</p>}
//             </div>
//           </div>
//         ))}
//         {routine.slots.length === 0 && <p className="text-center py-6 text-slate-400 text-sm">No slots added</p>}
//       </div>
//     </div>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// const AdminRoutine = () => {
//   const [routines, setRoutines]   = useState([]);
//   const [teachers, setTeachers]   = useState([]);
//   const [courses, setCourses]     = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [showForm, setShowForm]   = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [filterDate, setFilterDate]   = useState(todayStr());
//   const [filterBranch, setFilterBranch] = useState("");
//   const [toast, setToast]         = useState(null);
//   const [saving, setSaving]       = useState(false);

//   // Form state
//   const [form, setForm] = useState({
//     date:   todayStr(),
//     branch: "CSE",
//     slots:  [],
//   });

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

 

// const fetchRoutines = useCallback(async () => {
//   try {
//     const params = new URLSearchParams();
//     if (filterDate) params.append("date", filterDate);
//     if (filterBranch) params.append("branch", filterBranch);

//     const res = await API.get(`/routines/all?${params}`);
//     setRoutines(res.data.routines || []);
//   } catch (e) {
//     console.error(e);
//   }
// }, [filterDate, filterBranch]);
//   useEffect(() => {
//     Promise.all([
//       API.get("/admin/teachers").then((r) => setTeachers(r.data || [])),
//       API.get("/admin/courses").then((r) => setCourses(r.data.courses || [])),
//     ]).finally(() => setLoading(false));
//   }, []);

// //   useEffect(() => { fetchRoutines(); }, [filterDate, filterBranch]);
// useEffect(() => {
//   fetchRoutines();
// }, [fetchRoutines]);

//   const addSlot = () => {
//     const lastSlot = form.slots[form.slots.length - 1];
//     const start = lastSlot?.endTime || "10:00";
//     const startIdx = TIME_SLOTS.indexOf(start);
//     const end = TIME_SLOTS[startIdx + 1] || "11:00";
//     setForm((f) => ({
//       ...f,
//       slots: [...f.slots, { startTime: start, endTime: end, subject: "", teacher: "", course: "", room: "" }],
//     }));
//   };

//   const removeSlot = (i) => setForm((f) => ({ ...f, slots: f.slots.filter((_, idx) => idx !== i) }));

//   const changeSlot = (i, field, val) => {
//     setForm((f) => {
//       const slots = [...f.slots];
//       slots[i] = { ...slots[i], [field]: val };
//       return { ...f, slots };
//     });
//   };

//   const openCreate = () => {
//     setEditingId(null);
//     setForm({ date: todayStr(), branch: "CSE", slots: [] });
//     setShowForm(true);
//   };

//   const openEdit = (routine) => {
//     setEditingId(routine._id);
//     setForm({
//       date:   new Date(routine.date).toISOString().split("T")[0],
//       branch: routine.branch,
//       slots:  routine.slots.map((s) => ({
//         startTime: s.startTime, endTime: s.endTime,
//         subject: s.subject, room: s.room || "",
//         teacher: s.teacher?._id || s.teacher || "",
//         course:  s.course?._id  || s.course  || "",
//       })),
//     });
//     setShowForm(true);
//   };

//   const save = async () => {
//     if (!form.date || !form.branch) return showToast("Date and branch are required", "error");
//     if (form.slots.length === 0)    return showToast("Add at least one time slot", "error");
//     const invalid = form.slots.find((s) => !s.subject || !s.teacher);
//     if (invalid) return showToast("Each slot needs a subject and teacher", "error");

//     setSaving(true);
//     try {
//       if (editingId) {
//         await API.put(`/routines/${editingId}`, { slots: form.slots });
//         showToast("Routine updated!");
//       } else {
//         await API.post("/routines", form);
//         showToast("Routine created!");
//       }
//       setShowForm(false);
//       fetchRoutines();
//     } catch (e) {
//       showToast(e.response?.data?.message || "Failed to save", "error");
//     } finally { setSaving(false); }
//   };

//   const deleteRoutine = async (id) => {
//     if (!window.confirm("Delete this routine?")) return;
//     try {
//       await API.delete(`/routines/${id}`);
//       showToast("Routine deleted");
//       fetchRoutines();
//     } catch (e) { showToast(e.response?.data?.message || "Failed", "error"); }
//   };

//   const deadline = isBeforeDeadline();

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-transparent" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 space-y-6">

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
//           {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800">📅 Class Routines</h1>
//           <p className="text-slate-400 text-sm mt-1">
//             {deadline
//               ? "✅ Editing allowed — deadline is 10:00 AM"
//               : "🔒 Today's routines are locked (past 10:00 AM)"}
//           </p>
//         </div>
//         <button onClick={openCreate}
//           className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition">
//           + Create Routine
//         </button>
//       </div>

//       {/* Deadline banner for today */}
//       {!deadline && (
//         <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-sm">
//           <span className="text-2xl">🔒</span>
//           <div>
//             <p className="font-bold text-amber-700">Today's routines are locked</p>
//             <p className="text-amber-600">Routines can only be created/edited before 10:00 AM. You can still create routines for future dates.</p>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
//         <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
//           className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400" />
//         <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}
//           className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400">
//           <option value="">All Branches</option>
//           {BRANCHES.map((b) => <option key={b}>{b}</option>)}
//         </select>
//         <button onClick={() => { setFilterDate(todayStr()); setFilterBranch(""); }}
//           className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition">
//           Today
//         </button>
//       </div>

//       {/* Routines list */}
//       <div className="space-y-4">
//         {routines.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
//             <p className="text-4xl mb-3">📋</p>
//             <p className="text-slate-600 font-semibold">No routines found</p>
//             <p className="text-slate-400 text-sm mt-1">Create a routine for today before 10:00 AM</p>
//           </div>
//         ) : routines.map((r) => (
//           <RoutineCard key={r._id} routine={r} teachers={teachers}
//             onEdit={openEdit} onDelete={deleteRoutine} />
//         ))}
//       </div>

//       {/* ── CREATE / EDIT FORM MODAL ── */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-slate-100">
//               <h2 className="text-xl font-black text-slate-800">{editingId ? "✏️ Edit Routine" : "📅 Create Routine"}</h2>
//               <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
//             </div>

//             <div className="p-6 space-y-5">
//               {/* Date + Branch */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
//                   <input type="date" value={form.date}
//                     min={!editingId ? todayStr() : undefined}
//                     onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
//                     disabled={!!editingId}
//                     className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-semibold text-slate-500 uppercase">Branch</label>
//                   <select value={form.branch}
//                     onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
//                     disabled={!!editingId}
//                     className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50">
//                     {BRANCHES.map((b) => <option key={b}>{b}</option>)}
//                   </select>
//                 </div>
//               </div>

//               {/* Slots */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="text-sm font-bold text-slate-700">Time Slots ({form.slots.length})</label>
//                   <button onClick={addSlot}
//                     className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-700 transition">
//                     + Add Slot
//                   </button>
//                 </div>

//                 {form.slots.length === 0 && (
//                   <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
//                     <p className="text-sm">No slots yet. Click "+ Add Slot" to start building the timetable.</p>
//                   </div>
//                 )}

//                 {/* Column headers */}
//                 {form.slots.length > 0 && (
//                   <div className="grid grid-cols-12 gap-2 px-3 mb-1">
//                     <div className="col-span-1" />
//                     <div className="col-span-2 text-xs text-slate-400 font-semibold">Start</div>
//                     <div className="col-span-2 text-xs text-slate-400 font-semibold">End</div>
//                     <div className="col-span-3 text-xs text-slate-400 font-semibold">Subject</div>
//                     <div className="col-span-3 text-xs text-slate-400 font-semibold">Teacher</div>
//                     <div className="col-span-1" />
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   {form.slots.map((slot, i) => (
//                     <SlotRow key={i} slot={slot} index={i} teachers={teachers} courses={courses}
//                       onChange={changeSlot} onRemove={removeSlot} />
//                   ))}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-3 pt-2">
//                 <button onClick={() => setShowForm(false)}
//                   className="flex-1 border border-slate-200 rounded-xl py-3 font-semibold text-slate-600 hover:bg-slate-50 transition">
//                   Cancel
//                 </button>
//                 <button onClick={save} disabled={saving}
//                   className="flex-1 bg-slate-800 text-white rounded-xl py-3 font-semibold hover:bg-slate-700 disabled:opacity-60 transition">
//                   {saving ? "Saving..." : editingId ? "Update Routine" : "Create Routine"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminRoutine;








import React, { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";

const BRANCHES   = ["CSE", "ECE", "ME", "CE", "EE"];
const SEMESTERS  = [1, 2, 3, 4, 5, 6, 7, 8];
const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

const fmt12 = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const todayStr       = () => new Date().toISOString().split("T")[0];
const isBeforeDeadline = () => new Date().getHours() < 10;

// ── PDF generator ─────────────────────────────────────────────────────────────
const downloadRoutinePDF = (routine) => {
  const date = new Date(routine.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const rows = routine.slots.map((s, i) => `
    <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#fff"}">
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:700;color:#475569">
        ${fmt12(s.startTime)} – ${fmt12(s.endTime)}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:14px">${s.subject}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px">${s.course?.name || "—"} (${s.course?.code || ""})</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px">${s.teacher?.name || "—"}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b">${s.room || "—"}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html><html><head><title>Class Routine</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
    .header{border-bottom:3px solid #1e293b;padding-bottom:18px;margin-bottom:24px}
    .college{font-size:22px;font-weight:900}
    .sub{color:#64748b;font-size:13px;margin-top:4px}
    .badge{display:inline-block;background:#1e293b;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-top:10px}
    .meta{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:20px 0}
    .meta-item{background:#f8fafc;border-radius:8px;padding:12px}
    .meta-item label{font-size:11px;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:4px;font-weight:600}
    .meta-item span{font-size:15px;font-weight:700}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    thead{background:#1e293b;color:white}
    th{padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:700}
    .footer{margin-top:28px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px}
  </style></head><body>
  <div class="header">
    <div class="college">BCE BHAGALPUR</div>
    <div class="sub">Bihar College of Engineering · Class Routine</div>
    <span class="badge">📅 TIMETABLE</span>
  </div>
  <div class="meta">
    <div class="meta-item"><label>Date</label><span>${date}</span></div>
    <div class="meta-item"><label>Branch</label><span>${routine.branch}</span></div>
    <div class="meta-item"><label>Semester</label><span>Semester ${routine.semester}</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Time</th><th>Subject</th><th>Course</th><th>Teacher</th><th>Room</th>
      </tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="5" style="text-align:center;padding:20px;color:#94a3b8">No slots</td></tr>`}
    </tbody>
  </table>
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString("en-IN")} · BCE Bhagalpur College ERP</p>
    <p style="margin-top:4px">This is a computer-generated timetable. No signature required.</p>
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

// ── Slot Row ──────────────────────────────────────────────────────────────────
// Auto-fills teacher when a course is selected (uses the course's assigned teacher)
const SlotRow = ({ slot, index, teachers, courses, onChange, onRemove }) => {
  // When course changes, auto-fill teacher if course has an assigned teacher
  const handleCourseChange = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    onChange(index, "course",  courseId);
    onChange(index, "subject", course?.name || "");
    // Auto-fill teacher: find teacher assigned to this course
    if (course?.teacher?._id || course?.teacher) {
      const teacherId = course.teacher?._id || course.teacher;
      onChange(index, "teacher", teacherId);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
      <div className="col-span-1 text-xs font-black text-slate-400 text-center">{index + 1}</div>

      {/* Start time */}
      <select
        value={slot.startTime}
        onChange={(e) => onChange(index, "startTime", e.target.value)}
        className="col-span-2 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400"
      >
        {TIME_SLOTS.map((t) => <option key={t} value={t}>{fmt12(t)}</option>)}
      </select>

      {/* End time */}
      <select
        value={slot.endTime}
        onChange={(e) => onChange(index, "endTime", e.target.value)}
        className="col-span-2 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400"
      >
        {TIME_SLOTS.map((t) => <option key={t} value={t}>{fmt12(t)}</option>)}
      </select>

      {/* Course — auto-fills teacher on change */}
      <select
        value={slot.course}
        onChange={(e) => handleCourseChange(e.target.value)}
        className="col-span-3 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400"
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} ({c.code}) — Sem {c.semester}
          </option>
        ))}
      </select>

      {/* Teacher — pre-filled from course, but editable */}
      <select
        value={slot.teacher}
        onChange={(e) => onChange(index, "teacher", e.target.value)}
        className="col-span-3 border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-slate-400"
      >
        <option value="">Select Teacher</option>
        {/* {teachers.map((t) => (
          <option key={t._id} value={t._id}>{t.name} — {(t.departments||[]).join(", ")}</option>
        ))} */}
         
      {teachers.map((t) => (
      <option key={t._id} value={t._id}>
      {t.name} — {t.department || ""}   {/* ← was t.departments||[] */}
      </option>
       ))}
      </select>

      <button
        onClick={() => onRemove(index)}
        className="col-span-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1 transition text-center"
      >
        ✕
      </button>
    </div>
  );
};

// ── Routine Card ──────────────────────────────────────────────────────────────
const RoutineCard = ({ routine, onEdit, onDelete }) => {
  const isToday  = new Date(routine.date).toDateString() === new Date().toDateString();
  const editable = !isToday || isBeforeDeadline();

  const branchColor = {
    CSE: "bg-blue-100 text-blue-700",
    ECE: "bg-purple-100 text-purple-700",
    ME:  "bg-orange-100 text-orange-700",
    CE:  "bg-emerald-100 text-emerald-700",
    EE:  "bg-amber-100 text-amber-700",
  }[routine.branch] || "bg-slate-100 text-slate-700";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={`px-5 py-3 flex items-center justify-between border-b border-slate-100 ${isToday ? "bg-blue-50" : ""}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs font-black px-3 py-1 rounded-full ${branchColor}`}>{routine.branch}</span>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">Sem {routine.semester}</span>
          <span className="font-bold text-slate-700 text-sm">
            {new Date(routine.date).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
          </span>
          {isToday && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Today</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadRoutinePDF(routine)}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg font-semibold transition"
          >
            📄 PDF
          </button>
          {editable && (
            <button onClick={() => onEdit(routine)}
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg font-semibold text-slate-600 transition">
              ✏️ Edit
            </button>
          )}
          {editable && (
            <button onClick={() => onDelete(routine._id)}
              className="text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg font-semibold text-red-500 transition">
              🗑
            </button>
          )}
          {!editable && <span className="text-xs text-slate-400 font-semibold">🔒 Locked</span>}
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {routine.slots.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition">
            <div className="text-xs font-bold text-slate-500 w-32 shrink-0">
              {fmt12(s.startTime)} – {fmt12(s.endTime)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm">{s.subject}</p>
              {s.course && (
                <p className="text-xs text-slate-400">{s.course?.name} · {s.course?.code}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600">{s.teacher?.name || "—"}</p>
              {s.room && <p className="text-xs text-slate-400">Room {s.room}</p>}
            </div>
          </div>
        ))}
        {routine.slots.length === 0 && (
          <p className="text-center py-6 text-slate-400 text-sm">No slots added</p>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const AdminRoutine = () => {
  const [routines,     setRoutines]     = useState([]);
  const [teachers,     setTeachers]     = useState([]);
  const [courses,      setCourses]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [filterDate,   setFilterDate]   = useState(todayStr());
  const [filterBranch, setFilterBranch] = useState("");
  const [filterSem,    setFilterSem]    = useState("");
  const [toast,        setToast]        = useState(null);
  const [saving,       setSaving]       = useState(false);

  const [form, setForm] = useState({
    date:     todayStr(),
    branch:   "CSE",
    semester: 1,
    slots:    [],
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Courses filtered by the form's branch + semester (for slot rows)
  const formCourses = courses.filter(
    (c) => c.department === form.branch && c.semester === Number(form.semester)
  );

  const fetchRoutines = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterDate)   params.append("date",     filterDate);
      if (filterBranch) params.append("branch",   filterBranch);
      if (filterSem)    params.append("semester", filterSem);
      const res = await API.get(`/routines/all?${params}`);
      setRoutines(res.data.routines || []);
    } catch (e) { console.error(e); }
  }, [filterDate, filterBranch, filterSem]);

  useEffect(() => {
    Promise.all([
       // To this — handles both array and {teachers:[]} response shapes:
      API.get("/admin/teachers").then((r) => setTeachers(r.data?.teachers || r.data || [])),
      API.get("/admin/courses").then((r)  => setCourses(r.data.courses || [])),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchRoutines(); }, [fetchRoutines]);

  const addSlot = () => {
    const last     = form.slots[form.slots.length - 1];
    const startIdx = TIME_SLOTS.indexOf(last?.endTime || "10:00");
    const start    = last?.endTime || "10:00";
    const end      = TIME_SLOTS[startIdx + 1] || "11:00";
    setForm((f) => ({
      ...f,
      slots: [...f.slots, { startTime: start, endTime: end, subject: "", teacher: "", course: "", room: "" }],
    }));
  };

  const removeSlot = (i) => setForm((f) => ({ ...f, slots: f.slots.filter((_, idx) => idx !== i) }));

  const changeSlot = (i, field, val) => {
    setForm((f) => {
      const slots = [...f.slots];
      slots[i] = { ...slots[i], [field]: val };
      return { ...f, slots };
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ date: todayStr(), branch: "CSE", semester: 1, slots: [] });
    setShowForm(true);
  };

  const openEdit = (routine) => {
    setEditingId(routine._id);
    setForm({
      date:     new Date(routine.date).toISOString().split("T")[0],
      branch:   routine.branch,
      semester: routine.semester,
      slots:    routine.slots.map((s) => ({
        startTime: s.startTime,
        endTime:   s.endTime,
        subject:   s.subject,
        room:      s.room || "",
        teacher:   s.teacher?._id || s.teacher || "",
        course:    s.course?._id  || s.course  || "",
      })),
    });
    setShowForm(true);
  };

  // const save = async () => {
  //   if (!form.date || !form.branch || !form.semester)
  //     return showToast("Date, branch and semester are required", "error");
  //   if (form.slots.length === 0)
  //     return showToast("Add at least one time slot", "error");
  //   const invalid = form.slots.find((s) => !s.subject || !s.teacher);
  //   if (invalid)
  //     return showToast("Each slot needs a subject and teacher", "error");

  //   setSaving(true);
  //   try {
  //     if (editingId) {
  //       await API.put(`/routines/${editingId}`, { slots: form.slots });
  //       showToast("Routine updated!");
  //     } else {
  //       await API.post("/routines", {
  //         date:     form.date,
  //         branch:   form.branch,
  //         semester: Number(form.semester),
  //         slots:    form.slots,
  //       });
  //       showToast("Routine created!");
  //     }
  //     setShowForm(false);
  //     fetchRoutines();
  //   } catch (e) {
  //     showToast(e.response?.data?.message || "Failed to save", "error");
  //   } finally { setSaving(false); }
  // };
const save = async () => {
  if (!form.date || !form.branch || !form.semester)
    return showToast("Date, branch and semester are required", "error");
  if (form.slots.length === 0)
    return showToast("Add at least one time slot", "error");
  const invalid = form.slots.find((s) => !s.subject || !s.teacher);
  if (invalid)
    return showToast("Each slot needs a subject and teacher", "error");

  // ── DEBUG: log exactly what we're sending ──────────────────────────
  const payload = {
    date:     form.date,
    branch:   form.branch,
    semester: Number(form.semester),
    slots:    form.slots,
  };
  console.log("📤 SENDING PAYLOAD:", JSON.stringify(payload, null, 2));

  setSaving(true);
  try {
    if (editingId) {
      await API.put(`/routines/${editingId}`, { slots: form.slots });
      showToast("Routine updated!");
    } else {
      const res = await API.post("/routines", payload);
      console.log("✅ SUCCESS:", res.data);
      showToast("Routine created!");
    }
    setShowForm(false);
    fetchRoutines();
  } catch (e) {
    // ── DEBUG: log the full error response ────────────────────────────
    console.error("❌ ERROR STATUS:", e.response?.status);
    console.error("❌ ERROR DATA:", JSON.stringify(e.response?.data, null, 2));
    showToast(e.response?.data?.message || "Failed to save", "error");
  } finally { setSaving(false); }
};
  const deleteRoutine = async (id) => {
    if (!window.confirm("Delete this routine?")) return;
    try {
      await API.delete(`/routines/${id}`);
      showToast("Routine deleted");
      fetchRoutines();
    } catch (e) { showToast(e.response?.data?.message || "Failed", "error"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${
          toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-800">📅 Class Routines</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isBeforeDeadline()
              ? "✅ Editing allowed — deadline is 10:00 AM"
              : "🔒 Today's routines are locked (past 10:00 AM)"}
          </p>
        </div>
        <button onClick={openCreate}
          className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition">
          + Create Routine
        </button>
      </div>

      {!isBeforeDeadline() && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-sm">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-bold text-amber-700">Today's routines are locked</p>
            <p className="text-amber-600">You can still create routines for future dates.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400"
        >
          <option value="">All Branches</option>
          {BRANCHES.map((b) => <option key={b}>{b}</option>)}
        </select>
        <select
          value={filterSem}
          onChange={(e) => setFilterSem(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400"
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
        </select>
        <button
          onClick={() => { setFilterDate(todayStr()); setFilterBranch(""); setFilterSem(""); }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
        >
          Today
        </button>
      </div>

      {/* Routine list */}
      <div className="space-y-4">
        {routines.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-600 font-semibold">No routines found</p>
            <p className="text-slate-400 text-sm mt-1">Try a different filter or create a new routine</p>
          </div>
        ) : routines.map((r) => (
          <RoutineCard key={r._id} routine={r} onEdit={openEdit} onDelete={deleteRoutine} />
        ))}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingId ? "✏️ Edit Routine" : "📅 Create Routine"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Date / Branch / Semester */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    min={!editingId ? todayStr() : undefined}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    disabled={!!editingId}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Branch</label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value, slots: [] }))}
                    disabled={!!editingId}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50"
                  >
                    {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Semester</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm((f) => ({ ...f, semester: Number(e.target.value), slots: [] }))}
                    disabled={!!editingId}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50"
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              {/* Info banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 font-semibold">
                ℹ️ Courses shown below are filtered for <strong>{form.branch}</strong> Semester <strong>{form.semester}</strong>.
                Selecting a course auto-fills the assigned teacher — you can still change it.
                {formCourses.length === 0 && (
                  <span className="text-amber-600 ml-2">⚠️ No courses found for this branch &amp; semester. Create courses first.</span>
                )}
              </div>

              {/* Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-700">
                    Time Slots ({form.slots.length})
                  </label>
                  <button
                    onClick={addSlot}
                    className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-700 transition"
                  >
                    + Add Slot
                  </button>
                </div>

                {form.slots.length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                    <p className="text-sm">No slots yet. Click "+ Add Slot" to build the timetable.</p>
                  </div>
                )}

                {form.slots.length > 0 && (
                  <div className="grid grid-cols-12 gap-2 px-3 mb-1">
                    <div className="col-span-1" />
                    <div className="col-span-2 text-xs text-slate-400 font-semibold">Start</div>
                    <div className="col-span-2 text-xs text-slate-400 font-semibold">End</div>
                    <div className="col-span-3 text-xs text-slate-400 font-semibold">Course → Subject</div>
                    <div className="col-span-3 text-xs text-slate-400 font-semibold">Teacher (auto-filled)</div>
                    <div className="col-span-1" />
                  </div>
                )}

                <div className="space-y-2">
                  {form.slots.map((slot, i) => (
                    <SlotRow
                      key={i}
                      slot={slot}
                      index={i}
                      teachers={teachers}
                      courses={formCourses}       // only courses for this branch+sem
                      onChange={changeSlot}
                      onRemove={removeSlot}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-slate-200 rounded-xl py-3 font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 bg-slate-800 text-white rounded-xl py-3 font-semibold hover:bg-slate-700 disabled:opacity-60 transition"
                >
                  {saving ? "Saving..." : editingId ? "Update Routine" : "Create Routine"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoutine;