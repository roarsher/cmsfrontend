// import React, { useEffect, useState, useContext } from "react";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";

// const fmt12 = (t) => {
//   if (!t) return "";
//   const [h, m] = t.split(":").map(Number);
//   const ampm = h >= 12 ? "PM" : "AM";
//   return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
// };

// const getSlotStatus = (startTime, endTime) => {
//   const now  = new Date();
//   const [sh, sm] = startTime.split(":").map(Number);
//   const [eh, em] = endTime.split(":").map(Number);
//   const start = new Date(); start.setHours(sh, sm, 0, 0);
//   const end   = new Date(); end.setHours(eh, em, 0, 0);
//   if (now >= start && now <= end) return "ongoing";
//   if (now > end)   return "done";
//   return "upcoming";
// };

// const BRANCH_COLORS = {
//   CSE: "from-blue-600 to-indigo-600",
//   ECE: "from-purple-600 to-violet-600",
//   ME:  "from-orange-500 to-amber-500",
//   CE:  "from-emerald-600 to-teal-600",
//   EE:  "from-yellow-500 to-orange-500",
// };

// const StudentRoutine = () => {
//   const { user } = useContext(AuthContext);
//   const [routine, setRoutine]   = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [now, setNow]           = useState(new Date());
//   const [selectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   // Live clock — updates every 30 seconds
//   useEffect(() => {
//     const t = setInterval(() => setNow(new Date()), 30000);
//     return () => clearInterval(t);
//   }, []);

//   useEffect(() => {
//     const fetchRoutine = async () => {
//       setLoading(true);
//       try {
//         const res = await API.get("/routines/my-branch");
//         setRoutine(res.data.routine || null);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoutine();
//   }, [selectedDate]);

//   const isToday = selectedDate === new Date().toISOString().split("T")[0];
//   const branch  = user?.department || "";
//   const gradBg  = BRANCH_COLORS[branch] || "from-slate-700 to-slate-900";

//   // Find next class
//   const nextClass = routine?.slots?.find((s) => getSlotStatus(s.startTime, s.endTime) === "upcoming");
//   const ongoingClass = routine?.slots?.find((s) => getSlotStatus(s.startTime, s.endTime) === "ongoing");

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 space-y-5">

//       {/* Header card with gradient */}
//       <div className={`bg-gradient-to-br ${gradBg} rounded-3xl p-6 text-white shadow-lg`}>
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-white/70 text-xs uppercase font-semibold tracking-wide">Class Routine</p>
//             <h1 className="text-2xl font-black mt-1">{branch} Department</h1>
//             <p className="text-white/80 text-sm mt-1">
//               {isToday
//                 ? new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })
//                 : new Date(selectedDate).toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-3xl font-black tabular-nums">
//               {now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true })}
//             </p>
//             <p className="text-white/60 text-xs mt-1">Current Time</p>
//           </div>
//         </div>

//         {/* Ongoing / Next class pill */}
//         {isToday && ongoingClass && (
//           <div className="mt-4 bg-white/20 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//             <div>
//               <p className="text-white font-bold text-sm">📍 Ongoing: {ongoingClass.subject}</p>
//               <p className="text-white/70 text-xs">{fmt12(ongoingClass.startTime)} – {fmt12(ongoingClass.endTime)} · {ongoingClass.teacher?.name}</p>
//             </div>
//           </div>
//         )}

//         {isToday && !ongoingClass && nextClass && (
//           <div className="mt-4 bg-white/20 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
//             <div className="text-lg">⏰</div>
//             <div>
//               <p className="text-white font-bold text-sm">Next: {nextClass.subject}</p>
//               <p className="text-white/70 text-xs">Starts at {fmt12(nextClass.startTime)} · {nextClass.teacher?.name}</p>
//             </div>
//           </div>
//         )}

//         {isToday && !ongoingClass && !nextClass && routine?.slots?.length > 0 && (
//           <div className="mt-4 bg-white/20 backdrop-blur rounded-2xl p-3 flex items-center gap-3">
//             <div className="text-lg">🎉</div>
//             <p className="text-white font-semibold text-sm">All classes for today are done!</p>
//           </div>
//         )}
//       </div>

//       {/* No routine */}
//       {!routine ? (
//         <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
//           <p className="text-5xl mb-4">📭</p>
//           <p className="font-bold text-slate-700 text-lg">No routine published</p>
//           <p className="text-slate-400 text-sm mt-2">
//             {isToday
//               ? "Admin has not published today's routine yet. Check back after 10:00 AM."
//               : "No routine found for this date."}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Quick stats */}
//           <div className="grid grid-cols-3 gap-3">
//             <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
//               <p className="text-2xl font-black text-slate-800">{routine.slots?.length || 0}</p>
//               <p className="text-xs text-slate-400 font-semibold mt-1">Total Classes</p>
//             </div>
//             <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
//               <p className="text-2xl font-black text-emerald-600">
//                 {isToday ? routine.slots?.filter(s => getSlotStatus(s.startTime, s.endTime) === "done").length : 0}
//               </p>
//               <p className="text-xs text-slate-400 font-semibold mt-1">Done</p>
//             </div>
//             <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
//               <p className="text-2xl font-black text-blue-600">
//                 {isToday ? routine.slots?.filter(s => getSlotStatus(s.startTime, s.endTime) === "upcoming").length : routine.slots?.length || 0}
//               </p>
//               <p className="text-xs text-slate-400 font-semibold mt-1">Remaining</p>
//             </div>
//           </div>

//           {/* Time slots */}
//           <div className="space-y-3">
//             {routine.slots?.map((slot, i) => {
//               const status = isToday ? getSlotStatus(slot.startTime, slot.endTime) : "upcoming";
//               return (
//                 <div
//                   key={i}
//                   className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition hover:shadow-md ${
//                     status === "ongoing"  ? "border-blue-400 shadow-blue-100" :
//                     status === "done"     ? "border-slate-100 opacity-60" :
//                                            "border-slate-100"
//                   }`}
//                 >
//                   <div className="flex items-stretch">
//                     {/* Time column */}
//                     <div className={`flex flex-col items-center justify-center px-4 py-4 min-w-[80px] ${
//                       status === "ongoing" ? "bg-blue-600 text-white" :
//                       status === "done"    ? "bg-slate-100 text-slate-400" :
//                                             "bg-slate-800 text-white"
//                     }`}>
//                       <p className="text-xs font-bold">{fmt12(slot.startTime)}</p>
//                       <div className="w-px h-4 bg-current opacity-40 my-1" />
//                       <p className="text-xs font-bold">{fmt12(slot.endTime)}</p>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 px-5 py-4">
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <p className="font-bold text-slate-800">{slot.subject}</p>
//                             {status === "ongoing" && (
//                               <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold animate-pulse">● Live Now</span>
//                             )}
//                             {status === "done" && (
//                               <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">✓ Done</span>
//                             )}
//                           </div>
//                           {slot.course && (
//                             <p className="text-xs text-slate-400 mt-0.5">{slot.course?.name} · {slot.course?.code}</p>
//                           )}
//                         </div>
//                         {slot.room && (
//                           <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-semibold shrink-0">
//                             🏫 {slot.room}
//                           </span>
//                         )}
//                       </div>

//                       {/* Teacher */}
//                       <div className="flex items-center gap-2 mt-2">
//                         <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
//                           {slot.teacher?.name?.charAt(0) || "T"}
//                         </div>
//                         <p className="text-xs text-slate-500 font-semibold">{slot.teacher?.name || "—"}</p>
//                         {slot.teacher?.designation && (
//                           <span className="text-xs text-slate-300">· {slot.teacher.designation}</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default StudentRoutine;








import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const fmt12 = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

// ── PDF generator ─────────────────────────────────────────────────────────────
const downloadRoutinePDF = (routine, studentName) => {
  const date = new Date(routine.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const rows = routine.slots.map((s, i) => {
    const now   = new Date();
    const [sh, sm] = s.startTime.split(":").map(Number);
    const [eh, em] = s.endTime.split(":").map(Number);
    const start = new Date(); start.setHours(sh, sm, 0);
    const end   = new Date(); end.setHours(eh, em, 0);
    const isNow = now >= start && now <= end;
    const isDone = now > end;

    const rowBg = isNow ? "#eff6ff" : i % 2 === 0 ? "#f8fafc" : "#fff";
    const timeBg = isNow ? "#dbeafe" : "transparent";

    return `<tr style="background:${rowBg}">
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:700;background:${timeBg};color:${isNow ? "#1d4ed8" : "#475569"}">
        ${fmt12(s.startTime)} – ${fmt12(s.endTime)}
        ${isNow ? ' <span style="background:#1d4ed8;color:white;padding:2px 8px;border-radius:20px;font-size:10px;margin-left:6px">● LIVE</span>' : ""}
        ${isDone ? ' <span style="color:#94a3b8;font-size:11px;font-weight:400;margin-left:6px">Done</span>' : ""}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:14px">${s.subject}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b">${s.course?.name || "—"} ${s.course?.code ? `(${s.course.code})` : ""}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px">${s.teacher?.name || "—"}${s.teacher?.designation ? `<br><span style="font-size:11px;color:#94a3b8">${s.teacher.designation}</span>` : ""}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;text-align:center">${s.room || "—"}</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html><html><head><title>Class Routine</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
    .header{border-bottom:3px solid #1e293b;padding-bottom:18px;margin-bottom:24px}
    .college{font-size:22px;font-weight:900}
    .sub{color:#64748b;font-size:13px;margin-top:4px}
    .badge{display:inline-block;background:#1e293b;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-top:10px}
    .meta{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin:20px 0}
    .meta-item{background:#f8fafc;border-radius:8px;padding:12px}
    .meta-item label{font-size:11px;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:4px;font-weight:600}
    .meta-item span{font-size:14px;font-weight:700}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    thead{background:#1e293b;color:white}
    th{padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:700}
    .footer{margin-top:28px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px}
    .note{background:#eff6ff;border-left:4px solid #3b82f6;border-radius:8px;padding:10px 14px;margin:16px 0;font-size:12px;color:#1e40af}
  </style></head><body>
  <div class="header">
    <div class="college">BCE BHAGALPUR</div>
    <div class="sub">Bihar College of Engineering · Student Timetable</div>
    <span class="badge">📅 CLASS ROUTINE</span>
  </div>
  <div class="meta">
    <div class="meta-item"><label>Student</label><span>${studentName || "—"}</span></div>
    <div class="meta-item"><label>Branch</label><span>${routine.branch}</span></div>
    <div class="meta-item"><label>Semester</label><span>Semester ${routine.semester}</span></div>
    <div class="meta-item"><label>Date</label><span>${date}</span></div>
  </div>
  <div class="note">ℹ️ This timetable is for ${routine.branch} — Semester ${routine.semester} on ${date}. Total classes: ${routine.slots.length}</div>
  <table>
    <thead>
      <tr><th>Time</th><th>Subject</th><th>Course</th><th>Teacher</th><th>Room</th></tr>
    </thead>
    <tbody>
      ${rows || `<tr><td colspan="5" style="text-align:center;padding:20px;color:#94a3b8">No classes scheduled</td></tr>`}
    </tbody>
  </table>
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString("en-IN")} · BCE Bhagalpur College ERP</p>
    <p style="margin-top:4px">This is a computer-generated timetable. Subject to change.</p>
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const StudentRoutine = () => {
  const { user } = useContext(AuthContext);
  const [routine,  setRoutine]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [now,      setNow]      = useState(new Date());

  useEffect(() => {
    API.get("/routines/my-branch")
      .then((res) => setRoutine(res.data.routine || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Live clock — updates every minute to keep current-class highlight fresh
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const getSlotStatus = (slot) => {
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    const start = new Date(now); start.setHours(sh, sm, 0);
    const end   = new Date(now); end.setHours(eh, em, 0);
    if (now >= start && now <= end) return "live";
    if (now > end)                  return "done";
    return "upcoming";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-800">📅 Today's Timetable</h1>
          <p className="text-slate-400 text-sm mt-1">
            {now.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
        {routine && (
          <button
            onClick={() => downloadRoutinePDF(routine, user?.name)}
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition flex items-center gap-2"
          >
            📄 Download PDF
          </button>
        )}
      </div>

      {/* Student info banner */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-black text-sm shrink-0">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.rollNumber} · {user?.email}</p>
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase">Branch</p>
            <span className="bg-blue-100 text-blue-700 text-sm font-black px-3 py-0.5 rounded-full">{user?.department}</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase">Semester</p>
            <span className="bg-slate-100 text-slate-700 text-sm font-black px-3 py-0.5 rounded-full">Sem {user?.semester}</span>
          </div>
        </div>
      </div>

      {/* No routine */}
      {!routine && (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-slate-600 font-bold text-lg">No timetable for today</p>
          <p className="text-slate-400 text-sm mt-2">
            No routine has been created for <strong>{user?.department}</strong> Semester <strong>{user?.semester}</strong> today.
          </p>
          <p className="text-slate-400 text-sm mt-1">Check back later or contact admin.</p>
        </div>
      )}

      {/* Routine */}
      {routine && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Total Classes",
                value: routine.slots.length,
                color: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                label: "Completed",
                value: routine.slots.filter((s) => getSlotStatus(s) === "done").length,
                color: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                label: "Upcoming",
                value: routine.slots.filter((s) => getSlotStatus(s) === "upcoming").length,
                color: "bg-amber-50 text-amber-700 border-amber-100",
              },
            ].map((c) => (
              <div key={c.label} className={`rounded-2xl p-4 text-center border ${c.color}`}>
                <p className="text-3xl font-black">{c.value}</p>
                <p className="text-xs font-semibold mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Slots */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-700">
                {routine.branch} — Semester {routine.semester}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                {routine.slots.length} class{routine.slots.length !== 1 ? "es" : ""}
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {routine.slots.length === 0 && (
                <p className="text-center py-10 text-slate-400">No classes scheduled.</p>
              )}
              {routine.slots.map((s, i) => {
                const status = getSlotStatus(s);
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 px-5 py-4 transition ${
                      status === "live"     ? "bg-blue-50" :
                      status === "done"     ? "opacity-60" :
                                             "hover:bg-slate-50"
                    }`}
                  >
                    {/* Status bar */}
                    <div className={`w-1.5 h-14 rounded-full shrink-0 ${
                      status === "live"     ? "bg-blue-500" :
                      status === "done"     ? "bg-slate-200" :
                                             "bg-emerald-400"
                    }`} />

                    {/* Time */}
                    <div className="w-28 shrink-0">
                      <p className={`text-sm font-bold ${status === "live" ? "text-blue-600" : "text-slate-600"}`}>
                        {fmt12(s.startTime)}
                      </p>
                      <p className={`text-xs ${status === "live" ? "text-blue-400" : "text-slate-400"}`}>
                        – {fmt12(s.endTime)}
                      </p>
                      {status === "live" && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">● Live</span>
                      )}
                      {status === "done" && (
                        <span className="text-xs text-slate-300 font-semibold">Done</span>
                      )}
                    </div>

                    {/* Subject / course */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800">{s.subject}</p>
                      {s.course && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {s.course.name} · {s.course.code}
                        </p>
                      )}
                    </div>

                    {/* Teacher / room */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-slate-700">{s.teacher?.name || "—"}</p>
                      {s.teacher?.designation && (
                        <p className="text-xs text-slate-400">{s.teacher.designation}</p>
                      )}
                      {s.room && (
                        <p className="text-xs text-slate-400 mt-0.5">Room {s.room}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Download footer */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Download your timetable as a printable PDF
            </p>
            <button
              onClick={() => downloadRoutinePDF(routine, user?.name)}
              className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-700 transition"
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRoutine;