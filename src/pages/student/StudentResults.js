import React, { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const EXTERNAL_RESULT_URL = "https://beu-bih.ac.in/result-one";

const getGrade = (marks) => {
  if (marks >= 90) return { grade: "O",  label: "Outstanding", color: "text-purple-700",  bg: "bg-purple-100" };
  if (marks >= 80) return { grade: "A+", label: "Excellent",   color: "text-emerald-700", bg: "bg-emerald-100" };
  if (marks >= 70) return { grade: "A",  label: "Very Good",   color: "text-blue-700",    bg: "bg-blue-100" };
  if (marks >= 60) return { grade: "B+", label: "Good",        color: "text-cyan-700",    bg: "bg-cyan-100" };
  if (marks >= 50) return { grade: "B",  label: "Average",     color: "text-amber-700",   bg: "bg-amber-100" };
  if (marks >= 40) return { grade: "C",  label: "Pass",        color: "text-orange-700",  bg: "bg-orange-100" };
  return                   { grade: "F",  label: "Fail",        color: "text-red-700",     bg: "bg-red-100" };
};

const calcCGPA = (marks) => {
  if (!marks.length) return 0;
  const avg = marks.reduce((s, m) => s + (m.marks || 0), 0) / marks.length;
  return (avg / 10).toFixed(2);
};

// ── External Result Iframe ────────────────────────────────────────────────────
const ExternalResult = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError]   = useState(false);
  const [fullscreen, setFullscreen]     = useState(false);
  const iframeRef = useRef(null);

  const handleLoad = () => setIframeLoaded(true);
  const handleError = () => { setIframeError(true); setIframeLoaded(true); };

  // Detect if iframe was blocked (X-Frame-Options)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded) setIframeError(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [iframeLoaded]);

  if (fullscreen) return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
        <div className="flex items-center gap-3">
          <img src="https://beu-bih.ac.in/favicon.ico" alt="" className="w-5 h-5" onError={(e) => e.target.style.display="none"} />
          <span className="font-semibold text-sm">BEU Bihar — Official Results Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={EXTERNAL_RESULT_URL} target="_blank" rel="noreferrer"
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition font-semibold">
            🔗 Open in New Tab
          </a>
          <button onClick={() => setFullscreen(false)}
            className="text-xs bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition font-semibold">
            ✕ Exit Fullscreen
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src={EXTERNAL_RESULT_URL}
        title="BEU Result Portal"
        className="flex-1 w-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Browser-like header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 bg-slate-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-slate-400 text-xs">🔒</span>
          <span className="text-slate-300 text-xs font-mono truncate">{EXTERNAL_RESULT_URL}</span>
        </div>
        <div className="flex gap-2">
          <a href={EXTERNAL_RESULT_URL} target="_blank" rel="noreferrer"
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition font-semibold">
            🔗 New Tab
          </a>
          <button onClick={() => setFullscreen(true)}
            className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition font-semibold">
            ⛶ Fullscreen
          </button>
        </div>
      </div>

      {/* Loading bar */}
      {!iframeLoaded && (
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: "60%" }} />
        </div>
      )}

      {/* Iframe or fallback */}
      {iframeError ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-50">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="font-bold text-slate-700 text-lg">Site blocked embedding</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-md">
            BEU Bihar's result portal has restricted embedding for security reasons.
            You can still access it directly using the button below.
          </p>
          <a
            href={EXTERNAL_RESULT_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
          >
            🌐 Open BEU Result Portal
          </a>
          <p className="text-xs text-slate-400 mt-4">Opens in a new tab securely</p>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={EXTERNAL_RESULT_URL}
          title="BEU Result Portal"
          className="w-full border-0"
          style={{ height: "600px" }}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const StudentResults = () => {
  const { user } = useContext(AuthContext);
  const [marks, setMarks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("internal"); // "internal" | "external"
  const [sortBy, setSortBy]   = useState("subject");  // "subject" | "marks" | "grade"

  useEffect(() => {
    API.get("/marks/my-marks")
      .then((res) => setMarks(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...marks].sort((a, b) => {
    if (sortBy === "marks")   return (b.marks || 0) - (a.marks || 0);
    if (sortBy === "grade")   return (b.marks || 0) - (a.marks || 0);
    return (a.course?.name || "").localeCompare(b.course?.name || "");
  });

  const cgpa      = calcCGPA(marks);
  const avgMarks  = marks.length ? Math.round(marks.reduce((s, m) => s + (m.marks || 0), 0) / marks.length) : 0;
  const passed    = marks.filter(m => (m.marks || 0) >= 40).length;
  const failed    = marks.length - passed;
  const topSubject = [...marks].sort((a, b) => (b.marks || 0) - (a.marks || 0))[0];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">🏆 My Results</h1>
        <p className="text-slate-400 text-sm mt-1">Internal marks from teachers · External results from BEU Bihar</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => setTab("internal")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
            tab === "internal" ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-100"
          }`}>
          📝 Internal Marks
        </button>
        <button onClick={() => setTab("external")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
            tab === "external" ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:bg-slate-100"
          }`}>
          🌐 External Result (BEU)
        </button>
      </div>

      {/* ── INTERNAL MARKS ── */}
      {tab === "internal" && (
        <div className="space-y-5">
          {/* CGPA + Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white col-span-2 lg:col-span-1 shadow-lg">
              <p className="text-white/70 text-xs uppercase font-semibold">CGPA</p>
              <p className="text-5xl font-black mt-1">{cgpa}</p>
              <p className="text-white/70 text-xs mt-1">out of 10.00</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <p className="text-2xl font-black text-slate-800">{avgMarks}<span className="text-sm font-normal text-slate-400">/100</span></p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Average Marks</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
              <p className="text-2xl font-black text-emerald-700">{passed}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Subjects Passed</p>
            </div>
            <div className={`${failed > 0 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"} rounded-2xl p-5 border shadow-sm`}>
              <p className={`text-2xl font-black ${failed > 0 ? "text-red-600" : "text-slate-400"}`}>{failed}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Subjects Failed</p>
            </div>
          </div>

          {/* Top subject */}
          {topSubject && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
              <span className="text-3xl">🥇</span>
              <div className="flex-1">
                <p className="font-bold text-slate-800">Best Subject: {topSubject.course?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{topSubject.course?.code} · {topSubject.marks}/100</p>
              </div>
              <div className={`text-2xl font-black px-4 py-2 rounded-xl ${getGrade(topSubject.marks).bg} ${getGrade(topSubject.marks).color}`}>
                {getGrade(topSubject.marks).grade}
              </div>
            </div>
          )}

          {/* Sort control */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-700">Subject-wise Marks ({marks.length})</h2>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-slate-400">
              <option value="subject">Sort by Subject</option>
              <option value="marks">Sort by Marks ↓</option>
            </select>
          </div>

          {/* Marks cards */}
          {marks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-600 font-semibold">No marks added yet</p>
              <p className="text-slate-400 text-sm mt-1">Your teacher will add marks soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sorted.map((m, i) => {
                const { grade, label, color, bg } = getGrade(m.marks || 0);
                const pct = m.marks || 0;
                return (
                  <div key={m._id || i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{m.course?.name || "—"}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{m.course?.code || ""} · {m.course?.department || ""}</p>
                      </div>
                      <div className="text-right ml-3">
                        <span className={`text-2xl font-black px-3 py-1 rounded-xl ${bg} ${color}`}>{grade}</span>
                        <p className={`text-xs font-semibold mt-1 ${color}`}>{label}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Score</span>
                        <span className="font-bold text-slate-700">{pct}/100</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: pct >= 80 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct >= 40 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Min to pass: 40</span>
                      <span>{pct >= 40 ? "✓ Passed" : "✗ Failed"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Grade legend */}
          {marks.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Grade Scale</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { g:"O",  r:"90-100", color:"text-purple-700",  bg:"bg-purple-100"  },
                  { g:"A+", r:"80-89",  color:"text-emerald-700", bg:"bg-emerald-100" },
                  { g:"A",  r:"70-79",  color:"text-blue-700",    bg:"bg-blue-100"    },
                  { g:"B+", r:"60-69",  color:"text-cyan-700",    bg:"bg-cyan-100"    },
                  { g:"B",  r:"50-59",  color:"text-amber-700",   bg:"bg-amber-100"   },
                  { g:"C",  r:"40-49",  color:"text-orange-700",  bg:"bg-orange-100"  },
                  { g:"F",  r:"<40",    color:"text-red-700",     bg:"bg-red-100"     },
                ].map((item) => (
                  <div key={item.g} className={`${item.bg} px-3 py-1.5 rounded-xl flex items-center gap-2`}>
                    <span className={`font-black text-sm ${item.color}`}>{item.g}</span>
                    <span className="text-xs text-slate-500">{item.r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EXTERNAL RESULT ── */}
      {tab === "external" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="font-bold text-blue-800">BEU Bihar — Official University Result</p>
              <p className="text-sm text-blue-600 mt-0.5">
                Enter your Exam Roll Number on the portal below to check your official semester result.
                If the site doesn't load, use the "Open in New Tab" button.
              </p>
            </div>
          </div>
          <ExternalResult />
        </div>
      )}
    </div>
  );
};

export default StudentResults;