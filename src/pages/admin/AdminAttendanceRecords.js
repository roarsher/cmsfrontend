import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE"];

const statusColor = (s) => ({
  Present:  "bg-emerald-100 text-emerald-700",
  Absent:   "bg-red-100 text-red-600",
  Rejected: "bg-amber-100 text-amber-600",
}[s] || "bg-slate-100 text-slate-500");

const fmt12 = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

// ── PDF Generator ─────────────────────────────────────────────────────────────
const downloadSessionPDF = (session) => {
  const r      = session.report || {};
  const entries = r.entries || [];
  const date   = new Date(session.startTime).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const rows = entries.map((e, i) => {
    const color = e.status === "Present" ? "#10b981" : e.status === "Absent" ? "#ef4444" : "#f59e0b";
    return `<tr style="background:${i % 2 === 0 ? "#f8fafc" : "#fff"}">
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:13px">${i + 1}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:13px">${e.name}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:13px">${e.rollNumber}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;color:${color};font-weight:700;font-size:13px">
        ${e.status === "Present" ? "✓ Present" : e.status === "Absent" ? "✗ Absent" : "⚠ Rejected"}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b">
        ${e.gpsValid === true ? "✓ GPS" : e.gpsValid === false ? "✗ GPS" : "—"}
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b">
        ${e.distance != null ? e.distance + "m" : "—"}
      </td>
    </tr>`;
  }).join("");

  const pct = r.totalStudents > 0 ? Math.round((r.presentCount / r.totalStudents) * 100) : 0;

  const html = `<html><head><title>Attendance Report</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:40px;color:#1e293b;font-size:14px}
    .header{border-bottom:3px solid #1e293b;padding-bottom:20px;margin-bottom:24px}
    .college{font-size:22px;font-weight:900;letter-spacing:.5px}
    .sub{color:#64748b;font-size:13px;margin-top:4px}
    .badge{display:inline-block;background:#1e293b;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-top:8px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}
    .meta-item{background:#f8fafc;border-radius:8px;padding:12px}
    .meta-item label{font-size:11px;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:4px;font-weight:600}
    .meta-item span{font-size:14px;font-weight:700}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
    .stat{border-radius:10px;padding:14px;text-align:center}
    .stat h2{font-size:28px;font-weight:900;margin-bottom:4px}
    .stat p{font-size:12px;color:#64748b;font-weight:600}
    .pct-bar{margin:20px 0}
    .pct-bar-bg{background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden}
    .pct-bar-fill{background:#10b981;height:100%;border-radius:999px}
    .pct-label{display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:6px}
    table{width:100%;border-collapse:collapse;margin-top:20px}
    thead{background:#1e293b;color:white}
    th{padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:700}
    .footer{margin-top:28px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px}
  </style></head><body>
  <div class="header">
    <div class="college">BCE BHAGALPUR</div>
    <div class="sub">Bihar College of Engineering · Smart College ERP</div>
    <div class="sub" style="margin-top:6px">Live Attendance Report</div>
    <span class="badge">AUTO-GENERATED</span>
  </div>
  <div class="meta">
    <div class="meta-item"><label>Course</label><span>${session.course?.name || "—"} (${session.course?.code || ""})</span></div>
    <div class="meta-item"><label>Department</label><span>${session.department}</span></div>
    <div class="meta-item"><label>Date & Time</label><span>${date}</span></div>
    <div class="meta-item"><label>Teacher</label><span>${session.teacher?.name || "—"}</span></div>
    <div class="meta-item"><label>Duration</label><span>${session.duration} seconds</span></div>
    <div class="meta-item"><label>GPS Radius</label><span>${session.classroom?.radius || 100}m</span></div>
  </div>
  <div class="stats">
    <div class="stat" style="background:#f1f5f9"><h2 style="color:#1e293b">${r.totalStudents || 0}</h2><p>Total</p></div>
    <div class="stat" style="background:#ecfdf5"><h2 style="color:#10b981">${r.presentCount || 0}</h2><p>Present</p></div>
    <div class="stat" style="background:#fef2f2"><h2 style="color:#ef4444">${r.absentCount || 0}</h2><p>Absent</p></div>
    <div class="stat" style="background:#fffbeb"><h2 style="color:#f59e0b">${r.rejectedCount || 0}</h2><p>Rejected</p></div>
  </div>
  <div class="pct-bar">
    <div class="pct-label"><span>Attendance Rate</span><span>${pct}%</span></div>
    <div class="pct-bar-bg"><div class="pct-bar-fill" style="width:${pct}%"></div></div>
  </div>
  <table>
    <thead>
      <tr><th>#</th><th>Student Name</th><th>Roll No.</th><th>Status</th><th>GPS</th><th>Distance</th></tr>
    </thead>
    <tbody>${rows || `<tr><td colspan="6" style="text-align:center;padding:24px;color:#94a3b8">No records</td></tr>`}</tbody>
  </table>
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString("en-IN")} &nbsp;·&nbsp; BCE Bhagalpur College ERP</p>
    <p style="margin-top:4px">This is a computer-generated attendance report. No signature required.</p>
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

// ── Session Detail Modal ──────────────────────────────────────────────────────
const SessionModal = ({ session, onClose }) => {
  const r       = session.report || {};
  const entries = r.entries || [];
  const pct     = r.totalStudents > 0 ? Math.round((r.presentCount / r.totalStudents) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-800">{session.course?.name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{session.department} · {fmt12(session.startTime)}</p>
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
              { label: "Total",    value: r.totalStudents || 0, bg: "bg-slate-50",    text: "text-slate-800" },
              { label: "Present",  value: r.presentCount  || 0, bg: "bg-emerald-50",  text: "text-emerald-700" },
              { label: "Absent",   value: r.absentCount   || 0, bg: "bg-red-50",      text: "text-red-600" },
              { label: "Rejected", value: r.rejectedCount || 0, bg: "bg-amber-50",    text: "text-amber-600" },
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
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Student table */}
          <div className="rounded-2xl border border-slate-100 overflow-hidden">
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
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColor(e.status)}`}>
                        {e.status === "Present" ? "✓ Present" : e.status === "Absent" ? "✗ Absent" : "⚠ Rejected"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs">
                      {e.gpsValid === true ? <span className="text-emerald-600 font-bold">✓</span>
                       : e.gpsValid === false ? <span className="text-red-500 font-bold">✗</span>
                       : <span className="text-slate-300">—</span>}
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const AdminAttendanceRecords = () => {
  const [sessions, setSessions]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [filterDept, setFilterDept]   = useState("");
  const [filterDate, setFilterDate]   = useState("");
  const [search, setSearch]           = useState("");
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    API.get("/live-attendance/all-sessions")
      .then((res) => setSessions(res.data.sessions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sessions.filter((s) => {
    const matchDept = !filterDept || s.department === filterDept;
    const matchDate = !filterDate || new Date(s.startTime).toISOString().split("T")[0] === filterDate;
    const matchSearch = !search || s.course?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchDate && matchSearch;
  });

  // Overall stats
  const totalSessions = sessions.length;
  const withReport    = sessions.filter(s => s.report?.generated).length;
  const totalPresent  = sessions.reduce((sum, s) => sum + (s.report?.presentCount || 0), 0);
  const totalStudents = sessions.reduce((sum, s) => sum + (s.report?.totalStudents || 0), 0);
  const overallPct    = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {selected && <SessionModal session={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">📊 Attendance Records</h1>
        <p className="text-slate-400 text-sm mt-1">All live attendance sessions with downloadable PDF reports</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sessions",  value: totalSessions, border: "border-blue-500",    bg: "bg-blue-50",    text: "text-blue-700" },
          { label: "With Report",     value: withReport,    border: "border-purple-500",  bg: "bg-purple-50",  text: "text-purple-700" },
          { label: "Total Present",   value: totalPresent,  border: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
          { label: "Overall Rate",    value: `${overallPct}%`, border: "border-amber-500", bg: "bg-amber-50",  text: "text-amber-700" },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-5 border-l-4 ${c.border}`}>
            <p className={`text-3xl font-black ${c.text}`}>{c.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-3">
        <input
          placeholder="Search course or department..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
        {(filterDept || filterDate || search) && (
          <button onClick={() => { setFilterDept(""); setFilterDate(""); setSearch(""); }}
            className="text-xs text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 font-semibold transition">
            Clear
          </button>
        )}
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-700">Sessions ({filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Course</th>
                <th className="px-5 py-3 text-center">Dept</th>
                <th className="px-5 py-3 text-left">Date & Time</th>
                <th className="px-5 py-3 text-center">Total</th>
                <th className="px-5 py-3 text-center">Present</th>
                <th className="px-5 py-3 text-center">Rate</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No sessions found</td></tr>
              )}
              {filtered.map((s, i) => {
                const pct = s.report?.totalStudents > 0
                  ? Math.round((s.report.presentCount / s.report.totalStudents) * 100) : 0;
                const hasReport = s.report?.generated;
                return (
                  <tr key={s._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{s.course?.name || "—"}</p>
                      <p className="text-xs text-slate-400">{s.course?.code}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">{s.department}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{fmt12(s.startTime)}</td>
                    <td className="px-5 py-3 text-center font-semibold text-slate-700">
                      {hasReport ? s.report.totalStudents : "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {hasReport
                        ? <span className="text-emerald-600 font-bold">{s.report.presentCount}</span>
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {hasReport ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`text-xs font-bold w-8 ${pct >= 75 ? "text-emerald-600" : "text-red-500"}`}>{pct}%</span>
                        </div>
                      ) : <span className="text-slate-300 text-xs">No report</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelected(s)}
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
      </div>
    </div>
  );
};

export default AdminAttendanceRecords;