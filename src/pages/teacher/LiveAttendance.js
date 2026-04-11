 import React, { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const LiveAttendance = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses]         = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [duration, setDuration]       = useState(60);
  const [radius, setRadius]           = useState(100);
  const [session, setSession]         = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [report, setReport]             = useState(null);
  const [timeLeft, setTimeLeft]       = useState(0);
  const [gps, setGps]                 = useState(null);
  const [gpsError, setGpsError]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState(null);
  const socketRef = useRef(null);
  const timerRef  = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch courses ──────────────────────────────────────────────────────────
  useEffect(() => {
    API.get("/teacher/courses").then((res) => {
      setCourses(res.data.courses || []);
      if (res.data.courses?.length > 0) setSelectedCourse(res.data.courses[0]._id);
    });
  }, []);

  // ── Get GPS on load ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) { setGpsError("GPS not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGpsError("GPS access denied. Please allow location access.")
    );
  }, []);

  // ── Socket.io setup ────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = io(SOCKET_URL, { auth: { token } });

    socketRef.current.on("connect", () => {
      if (user?.department) socketRef.current.emit("join_dept", user.department);
    });

    socketRef.current.on("student_submitted", (data) => {
      setSubmissions((prev) => {
        if (prev.find((s) => s.studentId === data.studentId)) return prev;
        return [data, ...prev];
      });
    });

    socketRef.current.on("report_ready", async ({ sessionId }) => {
      try {
        const res = await API.get(`/live-attendance/session/${sessionId}`);
        if (res.data.session?.report?.generated) {
          setReport(res.data.session.report);
          setSession((s) => s ? { ...s, active: false } : null);
        }
      } catch (e) { console.error(e); }
    });

    return () => { socketRef.current?.disconnect(); };
  }, [user]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const tick = () => {
      const left = Math.max(0, Math.round((new Date(session.expiresAt) - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) { clearInterval(timerRef.current); setSession((s) => s ? { ...s, active: false } : null); }
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [session]);

  // ── Join session room when session starts ──────────────────────────────────
  useEffect(() => {
    if (session?._id && socketRef.current) {
      socketRef.current.emit("join_session", session._id);
    }
  }, [session?._id]);

  const startSession = async () => {
    if (!gps) { showToast("GPS not available. Allow location access first.", "error"); return; }
    if (!selectedCourse) { showToast("Select a course", "error"); return; }
    setLoading(true);
    try {
      const res = await API.post("/live-attendance/start", {
        courseId: selectedCourse,
        duration: Number(duration),
        lat: gps.lat, lng: gps.lng,
        radius: Number(radius),
      });
      setSession(res.data.session);
      setSubmissions([]);
      setReport(null);
      showToast("Session started! Students can now mark attendance.");
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to start", "error");
    } finally { setLoading(false); }
  };

  const stopSession = async () => {
    if (!session) return;
    try {
      const res = await API.put(`/live-attendance/stop/${session._id}`);
      setSession((s) => ({ ...s, active: false }));
      clearInterval(timerRef.current);
      if (res.data.report) setReport(res.data.report);
      showToast("Session stopped. Report generated!");
    } catch (e) { showToast("Failed to stop", "error"); }
  };

  const refreshSession = async (sid) => {
    const id = sid || session?._id;
    if (!id) return;
    try {
      const res = await API.get(`/live-attendance/session/${id}`);
      const subs = res.data.session?.submissions || [];
      setSubmissions(subs);
    } catch (e) { console.error(e); }
  };

  // ✅ Auto-poll every 3 seconds when session is active
  useEffect(() => {
    if (!session?._id || !session?.active) return;
    const id = session._id;
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/live-attendance/session/${id}`);
        setSubmissions(res.data.session?.submissions || []);
      } catch (e) { console.error(e); }
    }, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?._id, session?.active]);

  // ✅ PDF Download — uses report if available, else submissions
  const downloadPDF = () => {
    const entries = report?.entries || [];
    const present = entries.length > 0
      ? entries.filter(e => e.status === "Present")
      : submissions.filter((s) => s.status === "Present");
    const date    = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });
    // Full sheet with ALL students if report available
    const allEntries = report?.entries || present.map(s => ({ ...s, status: "Present" }));
    const rows = allEntries.map((s, i) => {
      const color = s.status === "Present" ? "#10b981" : s.status === "Absent" ? "#ef4444" : "#f59e0b";
      return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
        <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${i+1}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600">${s.name}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-family:monospace">${s.rollNumber}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:${color};font-weight:700">${s.status === "Present" ? "✓ Present" : s.status === "Absent" ? "✗ Absent" : "⚠ Rejected"}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:12px">${s.gpsValid === true ? "✓ GPS" : s.gpsValid === false ? "✗ GPS" : "—"}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:12px">${s.distance != null ? s.distance+"m" : "—"}</td>
      </tr>`;
    }).join("");

    const html = `<html><head><title>Attendance Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px;color:#1e293b}
      h1{margin:0;font-size:20px} .sub{color:#64748b;font-size:13px;margin:4px 0}
      .badge{background:#10b981;color:white;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      thead{background:#1e293b;color:white}
      th{padding:12px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
      .footer{margin-top:24px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px}
      .stats{display:flex;gap:16px;margin:16px 0}
      .stat{background:#f8fafc;border-radius:8px;padding:12px 20px;text-align:center}
      .stat h2{margin:0;font-size:24px;color:#1e293b} .stat p{margin:4px 0 0;font-size:12px;color:#64748b}
    </style></head><body>
    <h1>BCE BHAGALPUR — Attendance Report</h1>
    <p class="sub">Course: <strong>${selectedCourseName}</strong> &nbsp;|&nbsp; Date: ${date}</p>
    <p class="sub">Department: <strong>${user?.department || ""}</strong> &nbsp;|&nbsp; Teacher: <strong>${user?.name || ""}</strong></p>
    <div class="stats">
      <div class="stat"><h2>${report?.totalStudents || submissions.length}</h2><p>Total Students</p></div>
      <div class="stat" style="border-left:3px solid #10b981"><h2 style="color:#10b981">${report?.presentCount ?? present.length}</h2><p>Present</p></div>
      <div class="stat" style="border-left:3px solid #ef4444"><h2 style="color:#ef4444">${report?.absentCount ?? 0}</h2><p>Absent</p></div>
      <div class="stat" style="border-left:3px solid #f59e0b"><h2 style="color:#f59e0b">${report?.rejectedCount ?? submissions.filter(s=>s.status==="Rejected").length}</h2><p>Rejected</p></div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Name</th><th>Roll No.</th><th>Status</th><th>GPS</th><th>Distance</th></tr></thead>
      <tbody>${rows || "<tr><td colspan='5' style='text-align:center;padding:20px;color:#94a3b8'>No students marked present</td></tr>"}</tbody>
    </table>
    <div class="footer">
      <p>Generated on ${new Date().toLocaleString("en-IN")} &nbsp;·&nbsp; BCE Bhagalpur ERP</p>
      <p>This is a computer-generated attendance report.</p>
    </div>
    </body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const presentCount  = submissions.filter((s) => s.status === "Present").length;
  const rejectedCount = submissions.filter((s) => s.status === "Rejected").length;
  const timerColor    = timeLeft > 30 ? "text-emerald-600" : timeLeft > 10 ? "text-amber-500" : "text-red-600";
  const selectedCourseName = courses.find((c) => c._id === selectedCourse)?.name || "";

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">📡 Live Attendance</h1>
        <p className="text-slate-400 text-sm mt-1">Start a session — students solve a number challenge + GPS verification</p>
      </div>

      {/* GPS Status */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold ${gps ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
        <span className="text-lg">{gps ? "📍" : "⚠️"}</span>
        {gps
          ? `GPS Ready — Lat: ${gps.lat.toFixed(5)}, Lng: ${gps.lng.toFixed(5)}`
          : gpsError || "Getting GPS location..."}
      </div>

      {/* ── FULL REPORT (shown after session ends) ── */}
      {!session?.active && report?.generated && (
        <div className="space-y-4">
          {/* Report header */}
          <div className="bg-slate-800 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-xs uppercase font-semibold">Session Report</p>
                <p className="font-bold text-lg mt-0.5">{selectedCourseName}</p>
                <p className="text-slate-400 text-xs mt-1">{new Date(report.generatedAt).toLocaleString("en-IN")}</p>
              </div>
              <button onClick={downloadPDF}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2">
                📄 Download PDF
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total",    value: report.totalStudents, color: "text-white",         bg: "bg-slate-700" },
                { label: "Present",  value: report.presentCount,  color: "text-emerald-400",   bg: "bg-emerald-900/40" },
                { label: "Absent",   value: report.absentCount,   color: "text-red-400",       bg: "bg-red-900/40" },
                { label: "Rejected", value: report.rejectedCount, color: "text-amber-400",     bg: "bg-amber-900/40" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Attendance % bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Attendance Rate</span>
                <span>{report.totalStudents > 0 ? Math.round((report.presentCount / report.totalStudents) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${report.totalStudents > 0 ? (report.presentCount / report.totalStudents) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Full student table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-700">📋 Full Attendance Sheet</h2>
              <div className="flex gap-2 text-xs">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">✓ {report.presentCount} Present</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">✗ {report.absentCount} Absent</span>
                <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-semibold">⚠ {report.rejectedCount} Rejected</span>
              </div>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs sticky top-0">
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
                  {(report.entries || []).map((e, i) => (
                    <tr key={i} className={`hover:bg-slate-50 transition ${e.status === "Present" ? "bg-emerald-50/20" : e.status === "Absent" ? "" : "bg-amber-50/20"}`}>
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
                        {e.gpsValid === true ? <span className="text-emerald-600 font-semibold">✓</span> :
                         e.gpsValid === false ? <span className="text-red-500 font-semibold">✗</span> : "—"}
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

          <button onClick={() => { setReport(null); setSession(null); setSubmissions([]); }}
            className="w-full border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            + Start New Session
          </button>
        </div>
      )}

      {!session?.active && !report?.generated && (
        /* ── START SESSION FORM ── */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-700">⚙️ Configure Session</h2>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Course / Subject</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400">
              {courses.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Duration (seconds)</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>2 minutes</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">GPS Radius (meters)</label>
              <select value={radius} onChange={(e) => setRadius(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
                <option value={50}>50m (strict)</option>
                <option value={100}>100m (normal)</option>
                <option value={200}>200m (relaxed)</option>
                <option value={500}>500m (building)</option>
              </select>
            </div>
          </div>

          <button onClick={startSession} disabled={loading || !gps}
            className="w-full bg-slate-800 text-white py-3 rounded-2xl font-bold text-base hover:bg-slate-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {loading ? "Starting..." : "🚀 Start Live Session"}
          </button>
        </div>
      )}

      {session?.active && (
        /* ── ACTIVE SESSION ── */
        <div className="space-y-4">

          {/* Session Info Card */}
          <div className="bg-slate-800 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-xs uppercase font-semibold">Active Session</p>
                <p className="font-bold text-lg mt-0.5">{selectedCourseName}</p>
              </div>
              <div className="text-right">
                <p className={`text-4xl font-black tabular-nums ${timerColor}`}>{timeLeft}s</p>
                <p className="text-slate-400 text-xs">remaining</p>
              </div>
            </div>

            {/* Challenge numbers */}
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold mb-3">Challenge — Students must click in this order:</p>
              <div className="flex gap-3">
                {session.challenge?.map((n, i) => (
                  <div key={i} className="w-14 h-14 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center text-2xl font-black shadow-lg">
                    {n}
                  </div>
                ))}
                <div className="flex items-center gap-1 ml-2">
                  {session.challenge?.map((n, i) => (
                    <span key={i} className="text-slate-300 font-bold text-lg">
                      {n}{i < session.challenge.length - 1 ? " →" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Timer bar */}
            <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-yellow-400"
                style={{ width: `${(timeLeft / duration) * 100}%` }}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={stopSession} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold text-sm transition">
                ⏹ Stop Session
              </button>
              <button onClick={() => refreshSession()} className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl font-semibold text-sm transition">
                🔄 Refresh
              </button>
              <button onClick={downloadPDF} className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-semibold text-sm transition">
                📄 PDF
              </button>
            </div>
          </div>

          {/* PDF Download when session ends */}
          {!session?.active && submissions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Session Ended</p>
                <p className="text-sm text-slate-500 mt-0.5">{submissions.filter(s=>s.status==="Present").length} students marked present</p>
              </div>
              <button onClick={downloadPDF}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition flex items-center gap-2">
                📄 Download Attendance PDF
              </button>
            </div>
          )}

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <p className="text-3xl font-black text-emerald-600">{presentCount}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Present</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <p className="text-3xl font-black text-red-500">{rejectedCount}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Rejected</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
              <p className="text-3xl font-black text-slate-700">{submissions.length}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Submitted</p>
            </div>
          </div>

          {/* Submissions list */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-700">📋 Live Submissions</h2>
            </div>
            <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
              {submissions.length === 0 && (
                <p className="text-center py-10 text-slate-400 text-sm">Waiting for students to submit...</p>
              )}
              {submissions.map((s, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3 ${s.status === "Present" ? "bg-emerald-50/40" : "bg-red-50/30"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0 ${s.status === "Present" ? "bg-emerald-500" : "bg-red-500"}`}>
                      {s.status === "Present" ? "✓" : "✗"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{s.name || s.student?.name || "—"}</p>
                      <p className="text-xs text-slate-400 font-mono">{s.rollNumber || s.student?.rollNumber || "—"}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex gap-1 justify-end">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${s.correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {s.correct ? "✓ Nums" : "✗ Nums"}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${s.gpsValid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {s.gpsValid ? "✓ GPS" : `✗ GPS ${s.distance ? `(${s.distance}m)` : ""}`}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.status === "Present" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAttendance;