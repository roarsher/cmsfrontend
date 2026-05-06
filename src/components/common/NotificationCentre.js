// import React, { useEffect, useState, useContext, useCallback } from "react";
// import API from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import ReactMarkdown from "react-markdown";

// // ── PDF Generators ─────────────────────────────────────────────────────────────
// const printHTML = (html) => {
//   const win = window.open("", "_blank");
//   win.document.write(html);
//   win.document.close();
//   win.print();
// };

// const noticePDF = (notice) => printHTML(`
//   <html><head><title>Notice</title>
//   <style>
//     body{font-family:Arial,sans-serif;padding:40px;color:#1e293b;max-width:700px;margin:0 auto}
//     .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
//     h1{margin:0;font-size:22px;font-weight:900} .sub{color:#64748b;font-size:13px;margin:4px 0}
//     .badge{background:#f59e0b;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-top:8px}
//     .body{background:#f8fafc;border-radius:12px;padding:24px;font-size:15px;line-height:1.7;color:#334155;margin:20px 0}
//     .footer{text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px}
//   </style></head><body>
//   <div class="header"><h1>BCE BHAGALPUR</h1><p class="sub">Bihar College of Engineering · Official Notice</p><span class="badge">📢 NOTICE</span></div>
//   <h2 style="color:#1e293b;margin-bottom:8px">${notice.title}</h2>
//   <p style="color:#94a3b8;font-size:13px">Published: ${new Date(notice.createdAt).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
//   <div class="body">${notice.message}</div>
//   <div class="footer"><p>BCE Bhagalpur College ERP · Generated ${new Date().toLocaleString("en-IN")}</p></div>
//   </body></html>
// `);

// const routinePDF = (routine) => {
//   const fmt12 = (t) => { if(!t) return ""; const [h,m]=t.split(":").map(Number); return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`; };
//   const rows = routine.slots?.map((s,i) => `
//     <tr style="background:${i%2===0?"#f8fafc":"#fff"}">
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${fmt12(s.startTime)} – ${fmt12(s.endTime)}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:700">${s.subject}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${s.teacher?.name||"—"}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${s.room||"—"}</td>
//     </tr>`).join("") || "<tr><td colspan='4' style='text-align:center;padding:20px;color:#94a3b8'>No slots</td></tr>";
//   printHTML(`
//     <html><head><title>Class Routine</title>
//     <style>
//       body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
//       .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
//       h1{margin:0;font-size:22px;font-weight:900} .sub{color:#64748b;font-size:13px;margin:4px 0}
//       .badge{background:#3b82f6;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-top:8px}
//       table{width:100%;border-collapse:collapse;margin-top:20px}
//       thead{background:#1e293b;color:white} th{padding:12px 16px;text-align:left;font-size:12px;text-transform:uppercase}
//       .footer{text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px}
//     </style></head><body>
//     <div class="header"><h1>BCE BHAGALPUR</h1><p class="sub">Bihar College of Engineering · Class Routine</p><span class="badge">📅 TIMETABLE</span></div>
//     <p style="font-size:16px;font-weight:700">Branch: ${routine.branch} &nbsp;|&nbsp; Date: ${new Date(routine.date).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
//     <table><thead><tr><th>Time</th><th>Subject</th><th>Teacher</th><th>Room</th></tr></thead><tbody>${rows}</tbody></table>
//     <div class="footer">BCE Bhagalpur ERP · Generated ${new Date().toLocaleString("en-IN")}</div>
//     </body></html>
//   `);
// };

// const attendancePDF = (subjectData, studentName) => {
//   const rows = subjectData.map((s,i) => {
//     const pct = s.total>0 ? Math.round((s.present/s.total)*100) : 0;
//     const color = pct>=85?"#10b981":pct>=75?"#f59e0b":"#ef4444";
//     return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600">${s.name}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-family:monospace">${s.code||"—"}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${s.present}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${s.total-s.present}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${s.total}</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:${color};font-weight:900">${pct}%</td>
//       <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:${color};font-weight:700">${pct>=85?"Excellent":pct>=75?"Safe":"⚠ At Risk"}</td>
//     </tr>`;
//   }).join("");
//   const overall = subjectData.length ? Math.round(subjectData.reduce((s,d)=>s+(d.total>0?(d.present/d.total)*100:0),0)/subjectData.length) : 0;
//   printHTML(`
//     <html><head><title>Attendance Report</title>
//     <style>
//       body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
//       .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
//       h1{margin:0;font-size:22px;font-weight:900} .sub{color:#64748b;font-size:13px;margin:4px 0}
//       .stat{display:inline-block;background:#f8fafc;border-radius:8px;padding:12px 20px;margin:4px;text-align:center}
//       .stat h2{margin:0;font-size:24px;font-weight:900} .stat p{margin:4px 0 0;font-size:12px;color:#64748b}
//       table{width:100%;border-collapse:collapse;margin-top:20px}
//       thead{background:#1e293b;color:white} th{padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase}
//       .footer{text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px}
//     </style></head><body>
//     <div class="header"><h1>BCE BHAGALPUR</h1><p class="sub">Attendance Report · ${studentName}</p></div>
//     <div style="margin:16px 0">
//       <div class="stat"><h2 style="color:#10b981">${subjectData.reduce((s,d)=>s+d.present,0)}</h2><p>Total Present</p></div>
//       <div class="stat"><h2 style="color:#ef4444">${subjectData.reduce((s,d)=>s+(d.total-d.present),0)}</h2><p>Total Absent</p></div>
//       <div class="stat"><h2 style="color:#3b82f6">${subjectData.reduce((s,d)=>s+d.total,0)}</h2><p>Total Classes</p></div>
//       <div class="stat"><h2 style="color:${overall>=75?"#10b981":"#ef4444"}">${overall}%</h2><p>Overall</p></div>
//     </div>
//     <table><thead><tr><th>Subject</th><th>Code</th><th>Present</th><th>Absent</th><th>Total</th><th>%</th><th>Status</th></tr></thead>
//     <tbody>${rows}</tbody></table>
//     <div class="footer">BCE Bhagalpur ERP · Generated ${new Date().toLocaleString("en-IN")}</div>
//     </body></html>
//   `);
// };

// // ── Section Components ─────────────────────────────────────────────────────────
// const NoticeSection = ({ notices, loading }) => (
//   <div className="space-y-4">
//     <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">📢 Notices</h2>
//     {loading ? <Spinner /> : notices.length === 0 ? <Empty text="No notices yet" /> : (
//       <div className="space-y-3">
//         {notices.map(n => (
//           <div key={n._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition">
//             <div className="h-1 bg-amber-400" />
//             <div className="p-5">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex-1">
//                   <p className="font-bold text-slate-800">{n.title}</p>
//                   <p className="text-sm text-slate-500 mt-1 leading-relaxed">{n.message}</p>
//                   <p className="text-xs text-slate-300 mt-2">{new Date(n.createdAt).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</p>
//                 </div>
//                 <button onClick={() => noticePDF(n)}
//                   className="shrink-0 flex items-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition">
//                   📄 PDF
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// const RoutineSection = ({ routines, loading }) => (
//   <div className="space-y-4">
//     <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">📅 Class Routine</h2>
//     {loading ? <Spinner /> : routines.length === 0 ? <Empty text="No routine published today" /> : (
//       <div className="space-y-4">
//         {routines.map(r => (
//           <div key={r._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-5 py-3 bg-blue-50 border-b border-slate-100 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-700">{r.branch}</span>
//                 <span className="font-semibold text-slate-700 text-sm">{new Date(r.date).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</span>
//               </div>
//               <button onClick={() => routinePDF(r)}
//                 className="flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-blue-200">
//                 📄 Download PDF
//               </button>
//             </div>
//             <div className="divide-y divide-slate-50">
//               {r.slots?.map((s,i) => (
//                 <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition">
//                   <div className="w-28 shrink-0">
//                     <p className="text-xs font-bold text-slate-600">{s.startTime} – {s.endTime}</p>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-slate-800 text-sm">{s.subject}</p>
//                     {s.course && <p className="text-xs text-slate-400">{s.course?.name}</p>}
//                   </div>
//                   <p className="text-xs text-slate-500">{s.teacher?.name}</p>
//                   {s.room && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-lg text-slate-500">Room {s.room}</span>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// const AttendanceSection = ({ attendance, user, loading }) => {
//   // Group by subject
//   const subMap = {};
//   attendance.forEach(a => {
//     const k = a.course?._id || "unknown";
//     if (!subMap[k]) subMap[k] = { name: a.course?.name||"Unknown", code: a.course?.code||"", total:0, present:0 };
//     subMap[k].total++;
//     if (a.status === "Present") subMap[k].present++;
//   });
//   const subjectData = Object.values(subMap).sort((a,b) => {
//     const pa = a.total>0?a.present/a.total:0, pb = b.total>0?b.present/b.total:0;
//     return pa - pb; // lowest first
//   });
//   const overall = subjectData.length ? Math.round(subjectData.reduce((s,d)=>s+(d.total>0?(d.present/d.total)*100:0),0)/subjectData.length) : 0;

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">✅ Attendance</h2>
//         {subjectData.length > 0 && (
//           <button onClick={() => attendancePDF(subjectData, user?.name)}
//             className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-semibold transition border border-emerald-200">
//             📄 Download Full Report
//           </button>
//         )}
//       </div>

//       {loading ? <Spinner /> : subjectData.length === 0 ? <Empty text="No attendance records yet" /> : (
//         <>
//           {/* Overall card */}
//           <div className={`rounded-2xl p-5 text-white ${overall>=75?"bg-gradient-to-br from-emerald-500 to-teal-600":"bg-gradient-to-br from-red-500 to-rose-600"}`}>
//             <p className="text-white/70 text-xs uppercase font-semibold">Overall Attendance</p>
//             <p className="text-5xl font-black mt-1">{overall}%</p>
//             <p className="text-white/80 text-sm mt-1">{overall>=85?"Excellent 🎉":overall>=75?"Safe ✅":"At Risk ⚠️ — Below 75%"}</p>
//           </div>

//           {/* Subject cards */}
//           <div className="space-y-3">
//             {subjectData.map((s,i) => {
//               const pct = s.total>0 ? Math.round((s.present/s.total)*100) : 0;
//               const color = pct>=85?"border-emerald-200":pct>=75?"border-amber-200":"border-red-300";
//               const barColor = pct>=85?"#10b981":pct>=75?"#f59e0b":"#ef4444";
//               const badge = pct>=85?"bg-emerald-100 text-emerald-700":pct>=75?"bg-amber-100 text-amber-600":"bg-red-100 text-red-600";
//               const needed = pct<75 ? Math.ceil((0.75*s.total-s.present)/0.25) : 0;
//               return (
//                 <div key={i} className={`bg-white rounded-2xl border-2 ${color} p-5 shadow-sm hover:shadow-md transition`}>
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${pct<75?"bg-red-500":pct<85?"bg-amber-500":"bg-emerald-500"}`}>{i+1}</div>
//                       <div>
//                         <p className="font-bold text-slate-800">{s.name}</p>
//                         <p className="text-xs text-slate-400 font-mono">{s.code}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-2xl font-black" style={{color:barColor}}>{pct}%</p>
//                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>{pct>=85?"Excellent":pct>=75?"Safe":"⚠ At Risk"}</span>
//                     </div>
//                   </div>
//                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
//                     <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:barColor}} />
//                   </div>
//                   <div className="flex justify-between text-xs text-slate-500">
//                     <span>✓ {s.present} Present · ✗ {s.total-s.present} Absent · {s.total} Total</span>
//                     {needed>0 && <span className="text-red-500 font-semibold">Need {needed} more for 75%</span>}
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

// const TestLinkSection = ({ testLinks, loading }) => {
//   const [activeUrl, setActiveUrl] = useState(null);
//   const [iframeError, setIframeError] = useState(false);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">📝 Online Tests</h2>

//       {loading ? <Spinner /> : testLinks.length === 0 ? <Empty text="No tests available yet" /> : (
//         <div className="space-y-3">
//           {testLinks.map((t,i) => (
//             <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">📝 Test</span>
//                     <span className="text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString("en-IN")}</span>
//                   </div>
//                   <p className="font-bold text-slate-800">{t.title}</p>
//                   <p className="text-sm text-slate-500 mt-1">{t.message}</p>
//                 </div>
//                 <button
//                   onClick={() => { setActiveUrl(t.extraData?.googleFormUrl||t.link); setIframeError(false); }}
//                   className="shrink-0 bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 transition">
//                   Open Test
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Embedded Google Form */}
//       {activeUrl && (
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//           <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
//             <div className="flex gap-1.5">
//               <div className="w-3 h-3 rounded-full bg-red-500" />
//               <div className="w-3 h-3 rounded-full bg-amber-400" />
//               <div className="w-3 h-3 rounded-full bg-emerald-400" />
//             </div>
//             <span className="text-xs text-slate-400 font-mono truncate flex-1 mx-3">{activeUrl}</span>
//             <div className="flex gap-2">
//               <a href={activeUrl} target="_blank" rel="noreferrer"
//                 className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition font-semibold">🔗 New Tab</a>
//               <button onClick={() => setActiveUrl(null)} className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition font-semibold">✕ Close</button>
//             </div>
//           </div>
//           {iframeError ? (
//             <div className="flex flex-col items-center py-16 text-center">
//               <p className="text-4xl mb-3">🔒</p>
//               <p className="font-bold text-slate-700">Cannot embed this form</p>
//               <p className="text-sm text-slate-500 mt-2">Open in a new tab to complete the test</p>
//               <a href={activeUrl} target="_blank" rel="noreferrer"
//                 className="mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-purple-700 transition">
//                 Open Test →
//               </a>
//             </div>
//           ) : (
//             <iframe src={activeUrl} title="Online Test" className="w-full border-0" style={{height:"600px"}}
//               onError={() => setIframeError(true)}
//               sandbox="allow-forms allow-scripts allow-same-origin allow-popups" />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const Spinner = () => (
//   <div className="flex justify-center py-10">
//     <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-800 border-t-transparent" />
//   </div>
// );

// const Empty = ({ text }) => (
//   <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
//     <p className="text-3xl mb-2">📭</p>
//     <p className="text-slate-500 text-sm">{text}</p>
//   </div>
// );

// // ── Tab Button ─────────────────────────────────────────────────────────────────
// const Tab = ({ id, label, active, onClick, count }) => (
//   <button onClick={() => onClick(id)}
//     className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${active ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}>
//     {label}
//     {count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>{count}</span>}
//   </button>
// );

// // ── MAIN ───────────────────────────────────────────────────────────────────────
// const NotificationCenter = () => {
//   const { user } = useContext(AuthContext);
//   const [tab, setTab]           = useState("notifications");
//   const [notifications, setNotifications] = useState([]);
//   const [notices, setNotices]   = useState([]);
//   const [routines, setRoutines] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [testLinks, setTestLinks] = useState([]);
//   const [loading, setLoading]   = useState({});
//   const [unread, setUnread]     = useState(0);

//   const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }));

//   const fetchAll = useCallback(async () => {
//     if (!user) return;
//     setLoad("notif", true);
//     try {
//       const res = await API.get("/notifications");
//       const notifs = res.data.notifications || [];
//       setNotifications(notifs);
//       setUnread(res.data.unread || 0);
//       // Split test links from regular notifications
//       setTestLinks(notifs.filter(n => n.type === "test_link"));
//     } catch(e) { console.error(e); }
//     finally { setLoad("notif", false); }
//   }, [user]);

//   const fetchNotices = useCallback(async () => {
//     setLoad("notices", true);
//     try {
//       const res = await API.get("/admin/public/notices");
//       setNotices(res.data || []);
//     } catch(e) { console.error(e); }
//     finally { setLoad("notices", false); }
//   }, []);

//   const fetchRoutines = useCallback(async () => {
//     setLoad("routines", true);
//     try {
//       if (user?.role === "student") {
//         const res = await API.get("/routines/my-branch");
//         setRoutines(res.data.routine ? [res.data.routine] : []);
//       } else if (user?.role === "teacher") {
//         const res = await API.get("/routines/my-today");
//         setRoutines(res.data.classes || []);
//       }
//     } catch(e) { console.error(e); }
//     finally { setLoad("routines", false); }
//   }, [user]);

//   const fetchAttendance = useCallback(async () => {
//     if (user?.role !== "student") return;
//     setLoad("att", true);
//     try {
//       const res = await API.get("/attendance/my");
//       setAttendance(res.data || []);
//     } catch(e) { console.error(e); }
//     finally { setLoad("att", false); }
//   }, [user]);

//   useEffect(() => {
//     fetchAll();
//     fetchNotices();
//     fetchRoutines();
//     fetchAttendance();
//   }, [fetchAll, fetchNotices, fetchRoutines, fetchAttendance]);

//   const markRead = async (id) => {
//     try {
//       await API.put(`/notifications/${id}/read`);
//       setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
//       setUnread(u => Math.max(0, u-1));
//     } catch(e) { console.error(e); }
//   };

//   const markAllRead = async () => {
//     try {
//       await API.put("/notifications/read-all");
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnread(0);
//     } catch(e) { console.error(e); }
//   };

//   const TYPE_ICON = { notice:"📢", attendance:"✅", result:"🏆", class:"📅", fee:"💰", live_session:"📡", test_link:"📝", routine:"📅", general:"🔔" };
//   const TYPE_BG   = { notice:"bg-amber-50 border-amber-200", attendance:"bg-emerald-50 border-emerald-200", test_link:"bg-purple-50 border-purple-200", routine:"bg-blue-50 border-blue-200", general:"bg-slate-50 border-slate-200" };

//   const tabs = [
//     { id:"notifications", label:"🔔 All",          count: unread },
//     { id:"notices",       label:"📢 Notices",       count: notices.length },
//     { id:"routine",       label:"📅 Routine",       count: routines.length },
//     ...(user?.role === "student" ? [{ id:"attendance", label:"✅ Attendance", count:0 }] : []),
//     { id:"tests",         label:"📝 Online Tests",  count: testLinks.length },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 space-y-5">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800">🔔 Notification Center</h1>
//           <p className="text-slate-400 text-sm mt-1">All updates, notices, routines and tests in one place</p>
//         </div>
//         {unread > 0 && (
//           <button onClick={markAllRead} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl font-semibold transition border border-blue-200">
//             Mark all read
//           </button>
//         )}
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
//         {tabs.map(t => <Tab key={t.id} {...t} active={tab===t.id} onClick={setTab} />)}
//       </div>

//       {/* ── ALL NOTIFICATIONS ── */}
//       {tab === "notifications" && (
//         <div className="space-y-3">
//           {loading.notif ? <Spinner /> : notifications.length === 0 ? <Empty text="No notifications yet" /> :
//             notifications.map(n => (
//               <button key={n._id} onClick={() => {
//                 if (!n.read) markRead(n._id);
//                 // Navigate to relevant tab
//                 if (n.type === "notice")    setTab("notices");
//                 if (n.type === "routine")   setTab("routine");
//                 if (n.type === "attendance")setTab("attendance");
//                 if (n.type === "test_link") setTab("tests");
//               }}
//               className={`w-full text-left flex gap-3 p-4 rounded-2xl border-2 transition hover:shadow-md ${!n.read ? (TYPE_BG[n.type]||"bg-blue-50 border-blue-200") : "bg-white border-slate-100"}`}>
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${!n.read?"bg-white shadow-sm":""}`}>
//                   {n.icon || TYPE_ICON[n.type] || "🔔"}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className={`font-bold text-sm ${!n.read?"text-slate-900":"text-slate-600"}`}>{n.title}</p>
//                   <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
//                   <p className="text-xs text-slate-300 mt-1">{new Date(n.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hour12:true})}</p>
//                 </div>
//                 {!n.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
//               </button>
//             ))
//           }
//         </div>
//       )}

//       {tab === "notices"    && <NoticeSection     notices={notices}        loading={loading.notices} />}
//       {tab === "routine"    && <RoutineSection     routines={routines}      loading={loading.routines} />}
//       {tab === "attendance" && <AttendanceSection  attendance={attendance}  user={user} loading={loading.att} />}
//       {tab === "tests"      && <TestLinkSection    testLinks={testLinks}    loading={loading.notif} />}
//     </div>
//   );
// };

// export default NotificationCenter;
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

// ── PDF Generators ─────────────────────────────────────────────────────────────
const printHTML = (html) => {
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

const noticePDF = (notice) =>
  printHTML(`
  <html><head><title>Notice</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;color:#1e293b;max-width:700px;margin:0 auto}
    .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
    h1{margin:0;font-size:22px;font-weight:900} .sub{color:#64748b;font-size:13px;margin:4px 0}
    .badge{background:#f59e0b;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-top:8px}
    .body{background:#f8fafc;border-radius:12px;padding:24px;font-size:15px;line-height:1.7;color:#334155;margin:20px 0}
    .footer{text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px}
  </style></head><body>
  <div class="header"><h1>BCE BHAGALPUR</h1><p class="sub">Bihar College of Engineering · Official Notice</p><span class="badge">📢 NOTICE</span></div>
  <h2 style="color:#1e293b;margin-bottom:8px">${notice.title}</h2>
  <p style="color:#94a3b8;font-size:13px">Published: ${new Date(notice.createdAt).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
  <div class="body">${notice.message}</div>
  <div class="footer"><p>BCE Bhagalpur College ERP · Generated ${new Date().toLocaleString("en-IN")}</p></div>
  </body></html>
`);

const routinePDF = (routine) => {
  const fmt12 = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };
  const rows =
    routine.slots
      ?.map(
        (s, i) => `
    <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#fff"}">
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${fmt12(s.startTime)} – ${fmt12(s.endTime)}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:700">${s.subject}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${s.teacher?.name || "—"}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${s.room || "—"}</td>
    </tr>`
      )
      .join("") ||
    "<tr><td colspan='4' style='text-align:center;padding:20px;color:#94a3b8'>No slots</td></tr>";
  printHTML(`
    <html><head><title>Class Routine</title>
    <style>
      body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
      .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
      h1{margin:0;font-size:22px;font-weight:900} .sub{color:#64748b;font-size:13px;margin:4px 0}
      .badge{background:#3b82f6;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-top:8px}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      thead{background:#1e293b;color:white} th{padding:12px 16px;text-align:left;font-size:12px;text-transform:uppercase}
      .footer{text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px}
    </style></head><body>
    <div class="header"><h1>BCE BHAGALPUR</h1><p class="sub">Bihar College of Engineering · Class Routine</p><span class="badge">📅 TIMETABLE</span></div>
    <p style="font-size:16px;font-weight:700">Branch: ${routine.branch} &nbsp;|&nbsp; Date: ${new Date(routine.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
    <table><thead><tr><th>Time</th><th>Subject</th><th>Teacher</th><th>Room</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="footer">BCE Bhagalpur ERP · Generated ${new Date().toLocaleString("en-IN")}</div>
    </body></html>
  `);
};

const attendancePDF = (subjectData, studentName) => {
  const rows = subjectData
    .map((s, i) => {
      const pct = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
      const color = pct >= 85 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444";
      return `<tr style="background:${i % 2 === 0 ? "#f8fafc" : "#fff"}">
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600">${s.name}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-family:monospace">${s.code || "—"}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${s.present}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${s.total - s.present}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center">${s.total}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:${color};font-weight:900">${pct}%</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:${color};font-weight:700">${pct >= 85 ? "Excellent" : pct >= 75 ? "Safe" : "⚠ At Risk"}</td>
    </tr>`;
    })
    .join("");
  const overall = subjectData.length
    ? Math.round(
        subjectData.reduce(
          (s, d) => s + (d.total > 0 ? (d.present / d.total) * 100 : 0),
          0
        ) / subjectData.length
      )
    : 0;
  printHTML(`
    <html><head><title>Attendance Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
      .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
      h1{margin:0;font-size:22px;font-weight:900} .sub{color:#64748b;font-size:13px;margin:4px 0}
      .stat{display:inline-block;background:#f8fafc;border-radius:8px;padding:12px 20px;margin:4px;text-align:center}
      .stat h2{margin:0;font-size:24px;font-weight:900} .stat p{margin:4px 0 0;font-size:12px;color:#64748b}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      thead{background:#1e293b;color:white} th{padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase}
      .footer{text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px}
    </style></head><body>
    <div class="header"><h1>BCE BHAGALPUR</h1><p class="sub">Attendance Report · ${studentName}</p></div>
    <div style="margin:16px 0">
      <div class="stat"><h2 style="color:#10b981">${subjectData.reduce((s, d) => s + d.present, 0)}</h2><p>Total Present</p></div>
      <div class="stat"><h2 style="color:#ef4444">${subjectData.reduce((s, d) => s + (d.total - d.present), 0)}</h2><p>Total Absent</p></div>
      <div class="stat"><h2 style="color:#3b82f6">${subjectData.reduce((s, d) => s + d.total, 0)}</h2><p>Total Classes</p></div>
      <div class="stat"><h2 style="color:${overall >= 75 ? "#10b981" : "#ef4444"}">${overall}%</h2><p>Overall</p></div>
    </div>
    <table><thead><tr><th>Subject</th><th>Code</th><th>Present</th><th>Absent</th><th>Total</th><th>%</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="footer">BCE Bhagalpur ERP · Generated ${new Date().toLocaleString("en-IN")}</div>
    </body></html>
  `);
};

// ── Notification Action Handler ────────────────────────────────────────────────
// Decides what happens when a notification card is clicked
const handleNotificationAction = ({ notification: n, setTab, setActiveTestUrl }) => {
  switch (n.type) {
    case "notice": {
      // Build notice object from extraData stored at creation time
      const notice = {
        _id: n.extraData?.noticeId,
        title: n.extraData?.noticeTitle || n.title,
        message: n.extraData?.noticeMessage || n.message,
        createdAt: n.createdAt,
      };
      noticePDF(notice);
      return;
    }
    case "routine": {
      // Build routine from extraData and trigger PDF
      const routine = {
        _id: n.extraData?.routineId,
        branch: n.extraData?.branch,
        date: n.extraData?.date,
        slots: n.extraData?.slots || [],
      };
      routinePDF(routine);
      return;
    }
    case "test_link": {
      // Switch to tests tab and pre-open the URL
      setTab("tests");
      if (n.extraData?.googleFormUrl) {
        setActiveTestUrl(n.extraData.googleFormUrl);
      }
      return;
    }
    case "attendance":
      setTab("attendance");
      return;
    default:
      setTab("notifications");
  }
};

// ── Section Components ─────────────────────────────────────────────────────────
const NoticeSection = ({ notices, loading }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
      📢 Notices
    </h2>
    {loading ? (
      <Spinner />
    ) : notices.length === 0 ? (
      <Empty text="No notices yet" />
    ) : (
      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n._id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="h-1 bg-amber-400" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{n.title}</p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => noticePDF(n)}
                  className="shrink-0 flex items-center gap-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                >
                  📄 PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const RoutineSection = ({ routines, loading }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
      📅 Class Routine
    </h2>
    {loading ? (
      <Spinner />
    ) : routines.length === 0 ? (
      <Empty text="No routine published today" />
    ) : (
      <div className="space-y-4">
        {routines.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-3 bg-blue-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {r.branch}
                </span>
                <span className="font-semibold text-slate-700 text-sm">
                  {new Date(r.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <button
                onClick={() => routinePDF(r)}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-blue-200"
              >
                📄 Download PDF
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {r.slots?.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition"
                >
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-bold text-slate-600">
                      {s.startTime} – {s.endTime}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {s.subject}
                    </p>
                    {s.course && (
                      <p className="text-xs text-slate-400">{s.course?.name}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{s.teacher?.name}</p>
                  {s.room && (
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-lg text-slate-500">
                      Room {s.room}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AttendanceSection = ({ attendance, user, loading }) => {
  const subMap = {};
  attendance.forEach((a) => {
    const k = a.course?._id || "unknown";
    if (!subMap[k])
      subMap[k] = {
        name: a.course?.name || "Unknown",
        code: a.course?.code || "",
        total: 0,
        present: 0,
      };
    subMap[k].total++;
    if (a.status === "Present") subMap[k].present++;
  });
  const subjectData = Object.values(subMap).sort((a, b) => {
    const pa = a.total > 0 ? a.present / a.total : 0;
    const pb = b.total > 0 ? b.present / b.total : 0;
    return pa - pb;
  });
  const overall = subjectData.length
    ? Math.round(
        subjectData.reduce(
          (s, d) => s + (d.total > 0 ? (d.present / d.total) * 100 : 0),
          0
        ) / subjectData.length
      )
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
          ✅ Attendance
        </h2>
        {subjectData.length > 0 && (
          <button
            onClick={() => attendancePDF(subjectData, user?.name)}
            className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-semibold transition border border-emerald-200"
          >
            📄 Download Full Report
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : subjectData.length === 0 ? (
        <Empty text="No attendance records yet" />
      ) : (
        <>
          <div
            className={`rounded-2xl p-5 text-white ${overall >= 75 ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}
          >
            <p className="text-white/70 text-xs uppercase font-semibold">
              Overall Attendance
            </p>
            <p className="text-5xl font-black mt-1">{overall}%</p>
            <p className="text-white/80 text-sm mt-1">
              {overall >= 85
                ? "Excellent 🎉"
                : overall >= 75
                  ? "Safe ✅"
                  : "At Risk ⚠️ — Below 75%"}
            </p>
          </div>

          <div className="space-y-3">
            {subjectData.map((s, i) => {
              const pct =
                s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
              const color =
                pct >= 85
                  ? "border-emerald-200"
                  : pct >= 75
                    ? "border-amber-200"
                    : "border-red-300";
              const barColor =
                pct >= 85 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444";
              const badge =
                pct >= 85
                  ? "bg-emerald-100 text-emerald-700"
                  : pct >= 75
                    ? "bg-amber-100 text-amber-600"
                    : "bg-red-100 text-red-600";
              const needed = pct < 75 ? Math.ceil((0.75 * s.total - s.present) / 0.25) : 0;
              return (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border-2 ${color} p-5 shadow-sm hover:shadow-md transition`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${pct < 75 ? "bg-red-500" : pct < 85 ? "bg-amber-500" : "bg-emerald-500"}`}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400 font-mono">
                          {s.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-2xl font-black"
                        style={{ color: barColor }}
                      >
                        {pct}%
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}
                      >
                        {pct >= 85 ? "Excellent" : pct >= 75 ? "Safe" : "⚠ At Risk"}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      ✓ {s.present} Present · ✗ {s.total - s.present} Absent · {s.total} Total
                    </span>
                    {needed > 0 && (
                      <span className="text-red-500 font-semibold">
                        Need {needed} more for 75%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const TestLinkSection = ({ testLinks, loading, activeUrl, setActiveUrl }) => {
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    setIframeError(false);
  }, [activeUrl]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
        📝 Online Tests
      </h2>

      {loading ? (
        <Spinner />
      ) : testLinks.length === 0 ? (
        <Empty text="No tests available yet" />
      ) : (
        <div className="space-y-3">
          {testLinks.map((t, i) => {
            const url = t.extraData?.googleFormUrl || t.link;
            const isActive = activeUrl === url;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition ${isActive ? "border-purple-300" : "border-slate-100"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                        📝 Test
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(t.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800">{t.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{t.message}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {isActive ? (
                      <button
                        onClick={() => setActiveUrl(null)}
                        className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-300 transition"
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveUrl(url);
                          setIframeError(false);
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 transition"
                      >
                        Open Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded test viewer */}
      {activeUrl && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs text-slate-400 font-mono truncate flex-1 mx-3">
              {activeUrl}
            </span>
            <div className="flex gap-2">
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition font-semibold"
              >
                🔗 New Tab
              </a>
              <button
                onClick={() => setActiveUrl(null)}
                className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition font-semibold"
              >
                ✕ Close
              </button>
            </div>
          </div>
          {iframeError ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-4xl mb-3">🔒</p>
              <p className="font-bold text-slate-700">Cannot embed this form</p>
              <p className="text-sm text-slate-500 mt-2">
                Open in a new tab to complete the test
              </p>
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-purple-700 transition"
              >
                Open Test →
              </a>
            </div>
          ) : (
            <iframe
              src={activeUrl}
              title="Online Test"
              className="w-full border-0"
              style={{ height: "600px" }}
              onError={() => setIframeError(true)}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            />
          )}
        </div>
      )}
    </div>
  );
};

const Spinner = () => (
  <div className="flex justify-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-800 border-t-transparent" />
  </div>
);

const Empty = ({ text }) => (
  <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
    <p className="text-3xl mb-2">📭</p>
    <p className="text-slate-500 text-sm">{text}</p>
  </div>
);

// ── Tab Button ─────────────────────────────────────────────────────────────────
const Tab = ({ id, label, active, onClick, count }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
      active ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-100"
    }`}
  >
    {label}
    {count > 0 && (
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// ── Action badge shown on notification cards ───────────────────────────────────
const ActionBadge = ({ type }) => {
  if (type === "notice")
    return (
      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-semibold shrink-0">
        📄 PDF
      </span>
    );
  if (type === "test_link")
    return (
      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-semibold shrink-0">
        📝 Open
      </span>
    );
  if (type === "routine")
    return (
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-semibold shrink-0">
        📅 PDF
      </span>
    );
  return null;
};

// ── MAIN ───────────────────────────────────────────────────────────────────────
const NotificationCenter = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [tab, setTab] = useState("notifications");
  const [notifications, setNotifications] = useState([]);
  const [notices, setNotices] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [testLinks, setTestLinks] = useState([]);
  const [loading, setLoading] = useState({});
  const [unread, setUnread] = useState(0);
  // Shared activeTestUrl so clicking a test_link notification auto-opens the form
  const [activeTestUrl, setActiveTestUrl] = useState(null);

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  // ── Read ?section= from URL and switch tab automatically ──────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section) setTab(section);
  }, [location.search]);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoad("notif", true);
    try {
      const res = await API.get("/notifications");
      const notifs = res.data.notifications || [];
      setNotifications(notifs);
      setUnread(res.data.unread || 0);
      setTestLinks(notifs.filter((n) => n.type === "test_link"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoad("notif", false);
    }
  }, [user]);

  const fetchNotices = useCallback(async () => {
    setLoad("notices", true);
    try {
      const res = await API.get("/admin/public/notices");
      setNotices(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoad("notices", false);
    }
  }, []);

  const fetchRoutines = useCallback(async () => {
    setLoad("routines", true);
    try {
      if (user?.role === "student") {
        const res = await API.get("/routines/my-branch");
        setRoutines(res.data.routine ? [res.data.routine] : []);
      } else if (user?.role === "teacher") {
        const res = await API.get("/routines/my-today");
        setRoutines(res.data.classes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoad("routines", false);
    }
  }, [user]);

  const fetchAttendance = useCallback(async () => {
    if (user?.role !== "student") return;
    setLoad("att", true);
    try {
      const res = await API.get("/attendance/my");
      setAttendance(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoad("att", false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
    fetchNotices();
    fetchRoutines();
    fetchAttendance();
  }, [fetchAll, fetchNotices, fetchRoutines, fetchAttendance]);

  const markRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnread((u) => Math.max(0, u - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch (e) {
      console.error(e);
    }
  };

  const TYPE_ICON = {
    notice: "📢",
    attendance: "✅",
    result: "🏆",
    class: "📅",
    fee: "💰",
    live_session: "📡",
    test_link: "📝",
    routine: "📅",
    general: "🔔",
  };

  const TYPE_BG = {
    notice: "bg-amber-50 border-amber-200",
    attendance: "bg-emerald-50 border-emerald-200",
    test_link: "bg-purple-50 border-purple-200",
    routine: "bg-blue-50 border-blue-200",
    general: "bg-slate-50 border-slate-200",
  };

  const tabs = [
    { id: "notifications", label: "🔔 All", count: unread },
    { id: "notices", label: "📢 Notices", count: notices.length },
    { id: "routine", label: "📅 Routine", count: routines.length },
    ...(user?.role === "student"
      ? [{ id: "attendance", label: "✅ Attendance", count: 0 }]
      : []),
    { id: "tests", label: "📝 Online Tests", count: testLinks.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            🔔 Notification Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            All updates, notices, routines and tests in one place
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl font-semibold transition border border-blue-200"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        {tabs.map((t) => (
          <Tab key={t.id} {...t} active={tab === t.id} onClick={setTab} />
        ))}
      </div>

      {/* ── ALL NOTIFICATIONS ── */}
      {tab === "notifications" && (
        <div className="space-y-3">
          {loading.notif ? (
            <Spinner />
          ) : notifications.length === 0 ? (
            <Empty text="No notifications yet" />
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => {
                  if (!n.read) markRead(n._id);
                  handleNotificationAction({ notification: n, setTab, setActiveTestUrl });
                }}
                className={`w-full text-left flex gap-3 p-4 rounded-2xl border-2 transition hover:shadow-md cursor-pointer select-none
                  ${!n.read ? (TYPE_BG[n.type] || "bg-blue-50 border-blue-200") : "bg-white border-slate-100"}`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${!n.read ? "bg-white shadow-sm" : ""}`}
                >
                  {n.icon || TYPE_ICON[n.type] || "🔔"}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm ${!n.read ? "text-slate-900" : "text-slate-600"}`}
                  >
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                {/* Action badge + unread dot */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <ActionBadge type={n.type} />
                  {!n.read && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "notices" && (
        <NoticeSection notices={notices} loading={loading.notices} />
      )}
      {tab === "routine" && (
        <RoutineSection routines={routines} loading={loading.routines} />
      )}
      {tab === "attendance" && (
        <AttendanceSection
          attendance={attendance}
          user={user}
          loading={loading.att}
        />
      )}
      {tab === "tests" && (
        <TestLinkSection
          testLinks={testLinks}
          loading={loading.notif}
          activeUrl={activeTestUrl}
          setActiveUrl={setActiveTestUrl}
        />
      )}
    </div>
  );
};

export default NotificationCenter;