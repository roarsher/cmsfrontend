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
      showToast("Session started! Students can now mark attendance.");
    } catch (e) {
      showToast(e.response?.data?.message || "Failed to start", "error");
    } finally { setLoading(false); }
  };

  const stopSession = async () => {
    if (!session) return;
    try {
      await API.put(`/live-attendance/stop/${session._id}`);
      setSession((s) => ({ ...s, active: false }));
      clearInterval(timerRef.current);
      showToast("Session stopped.");
    } catch (e) { showToast("Failed to stop", "error"); }
  };

  const refreshSession = async () => {
    if (!session) return;
    try {
      const res = await API.get(`/live-attendance/session/${session._id}`);
      setSubmissions(res.data.session.submissions || []);
    } catch (e) { console.error(e); }
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

      {!session || !session.active ? (
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
      ) : (
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
              <button onClick={refreshSession} className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl font-semibold text-sm transition">
                🔄 Refresh
              </button>
            </div>
          </div>

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
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.status === "Present" ? "bg-emerald-500" : "bg-red-500"}`}>
                      {s.status === "Present" ? "✓" : "✗"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.rollNumber}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400 space-y-0.5">
                    <p>{s.correct ? "✓ Numbers" : "✗ Numbers"} · {s.gpsValid ? "✓ GPS" : `✗ GPS (${s.distance}m)`}</p>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${s.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
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