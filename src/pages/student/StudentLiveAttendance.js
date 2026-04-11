import React, { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const StudentLiveAttendance = () => {
  const { user } = useContext(AuthContext);
  const [session, setSession]           = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [clicked, setClicked]           = useState([]); // numbers clicked so far
  const [timeLeft, setTimeLeft]         = useState(0);
  const [gps, setGps]                   = useState(null);
  const [gpsError, setGpsError]         = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [result, setResult]             = useState(null); // { success, message }
  const [polling, setPolling]           = useState(true);
  const socketRef = useRef(null);
  const timerRef  = useRef(null);

  // ── Get GPS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) { setGpsError("GPS not supported on this device"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGpsError("GPS denied. Please allow location to mark attendance.")
    );
  }, []);

  // ── Socket.io ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = io(SOCKET_URL, { auth: { token } });

    socketRef.current.on("connect", () => {
      if (user?.department) socketRef.current.emit("join_dept", user.department);
    });

    socketRef.current.on("session_started", (data) => {
      setSession(data);
      setClicked([]);
      setResult(null);
      setAlreadySubmitted(false);
    });

    socketRef.current.on("session_ended", () => {
      setSession(null);
      setClicked([]);
      clearInterval(timerRef.current);
    });

    return () => socketRef.current?.disconnect();
  }, [user]);

  // ── Poll for active session (fallback if socket missed) ────────────────────
  useEffect(() => {
    if (!polling) return;
    const check = async () => {
      try {
        const res = await API.get("/live-attendance/active");
        if (res.data.session) {
          setSession(res.data.session);
          setAlreadySubmitted(res.data.alreadySubmitted);
        } else {
          setSession(null);
        }
      } catch (e) { console.error(e); }
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [polling]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const tick = () => {
      const left = Math.max(0, Math.round((new Date(session.expiresAt) - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) { clearInterval(timerRef.current); setSession(null); }
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [session]);

  // ── Click number button ────────────────────────────────────────────────────
  const handleNumberClick = (n) => {
    if (clicked.length >= (session?.challenge?.length || 3)) return;
    setClicked((prev) => [...prev, n]);
  };

  const resetClicked = () => setClicked([]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const submit = async () => {
    if (!gps)    { setResult({ success: false, message: "❌ GPS not available. Allow location access." }); return; }
    if (!session) return;
    if (clicked.length !== session.challenge.length) {
      setResult({ success: false, message: `Please click all ${session.challenge.length} numbers in order.` });
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post("/live-attendance/submit", {
        sessionId: session._id,
        answer: clicked,
        lat: gps.lat,
        lng: gps.lng,
      });
      setResult({ success: true, message: res.data.message });
      setAlreadySubmitted(true);
      setPolling(false);
    } catch (e) {
      setResult({ success: false, message: e.response?.data?.message || "Submission failed" });
    } finally { setSubmitting(false); }
  };

  const timerColor = timeLeft > 30 ? "text-emerald-500" : timeLeft > 10 ? "text-amber-500" : "text-red-500";

  // ── No active session ──────────────────────────────────────────────────────
  if (!session) return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center max-w-sm w-full">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-2xl font-black text-slate-800">Live Attendance</h1>
        <p className="text-slate-400 text-sm mt-2">No active session right now.</p>
        <p className="text-slate-400 text-sm mt-1">Your teacher will start a session in class.</p>
        <div className="mt-6 animate-pulse flex justify-center gap-1">
          <div className="w-2 h-2 bg-slate-300 rounded-full" />
          <div className="w-2 h-2 bg-slate-400 rounded-full" />
          <div className="w-2 h-2 bg-slate-300 rounded-full" />
        </div>
        <p className="text-xs text-slate-300 mt-3">Checking every 5 seconds...</p>
      </div>

      {/* GPS status */}
      <div className={`px-4 py-2 rounded-xl text-xs font-semibold ${gps ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
        {gps ? `📍 GPS Ready` : `⚠️ ${gpsError || "Getting GPS..."}`}
      </div>
    </div>
  );

  // ── Already submitted ──────────────────────────────────────────────────────
  if (alreadySubmitted && !result) return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center max-w-sm w-full">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-emerald-600">Already Submitted!</h2>
        <p className="text-slate-400 text-sm mt-2">Your attendance has been recorded for</p>
        <p className="font-bold text-slate-700 mt-1">{session.course?.name}</p>
      </div>
    </div>
  );

  // ── Result screen ──────────────────────────────────────────────────────────
  if (result) return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-sm border p-10 text-center max-w-sm w-full">
        <div className="text-6xl mb-4">{result.success ? "🎉" : "❌"}</div>
        <h2 className={`text-2xl font-black ${result.success ? "text-emerald-600" : "text-red-500"}`}>
          {result.success ? "Attendance Marked!" : "Failed"}
        </h2>
        <p className="text-slate-600 text-sm mt-3">{result.message}</p>
        {!result.success && (
          <button onClick={() => { setResult(null); setClicked([]); }}
            className="mt-6 bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition">
            Try Again
          </button>
        )}
      </div>
    </div>
  );

  // ── Active session challenge ───────────────────────────────────────────────
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center space-y-5">

      {/* Session info */}
      <div className="w-full max-w-sm">
        <div className="bg-slate-800 text-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold">Active Session</p>
            <p className="font-bold mt-0.5">{session.course?.name || "Unknown Course"}</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-black tabular-nums ${timerColor}`}>{timeLeft}s</p>
            <p className="text-slate-400 text-xs">left</p>
          </div>
        </div>
      </div>

      {/* Challenge card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 w-full max-w-sm space-y-5">
        <div className="text-center">
          <p className="text-slate-500 text-sm font-semibold">👉 Click numbers in this order:</p>
          <div className="flex justify-center gap-3 mt-3">
            {session.challenge?.map((n, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center text-2xl font-black shadow">
                  {n}
                </div>
                {i < session.challenge.length - 1 && <span className="text-slate-400 font-bold">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Clicked so far */}
        <div className="bg-slate-50 rounded-2xl p-3 min-h-14 flex items-center justify-center gap-2">
          {clicked.length === 0 ? (
            <p className="text-slate-300 text-sm">Your clicks will appear here...</p>
          ) : clicked.map((n, i) => (
            <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${
              n === session.challenge[i] ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
            }`}>
              {n}
            </div>
          ))}
        </div>

        {/* Number buttons grid */}
        <div className="grid grid-cols-3 gap-2">
          {allNumbers.map((n) => (
            <button key={n} onClick={() => handleNumberClick(n)}
              disabled={clicked.length >= session.challenge.length}
              className="h-14 rounded-2xl text-xl font-black bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition active:scale-95">
              {n}
            </button>
          ))}
        </div>

        {/* GPS status */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${gps ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
          <span>{gps ? "📍" : "⚠️"}</span>
          {gps ? `GPS Ready — ${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : gpsError || "Getting GPS..."}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={resetClicked} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            Reset
          </button>
          <button onClick={submit}
            disabled={submitting || clicked.length !== session.challenge?.length || !gps}
            className="flex-1 bg-slate-800 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 transition">
            {submitting ? "Submitting..." : "✅ Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLiveAttendance;