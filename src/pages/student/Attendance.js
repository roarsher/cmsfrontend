 import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [view, setView]             = useState("subject"); // "subject" | "records"

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      try {
        const res = await API.get("/attendance/my");
        setAttendance(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [user]);

  const total   = attendance.length;
  const present = attendance.filter((a) => a.status === "Present").length;
  const absent  = total - present;
  const pct     = total > 0 ? Math.round((present / total) * 100) : 0;
  const attColor = pct >= 85 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444";
  const attLabel = pct >= 85 ? "Excellent" : pct >= 75 ? "Satisfactory" : "At Risk";
  const attBg    = pct >= 85 ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                 : pct >= 75 ? "bg-amber-50 border-amber-200 text-amber-700"
                 :             "bg-red-50 border-red-200 text-red-700";

  // Group by subject
  const subjectMap = {};
  attendance.forEach((a) => {
    const id   = a.course?._id || "unknown";
    const name = a.course?.name || "Unknown Subject";
    const code = a.course?.code || "";
    if (!subjectMap[id]) subjectMap[id] = { id, name, code, total: 0, present: 0 };
    subjectMap[id].total++;
    if (a.status === "Present") subjectMap[id].present++;
  });

  // ✅ Sort by attendance % ASCENDING — lowest (at risk) first
  const subjectList = Object.values(subjectMap)
    .map((s) => ({ ...s, pct: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0 }))
    .sort((a, b) => a.pct - b.pct);

  const filteredSubjects = subjectList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecords = attendance
    .filter((a) => {
      if (filter === "present") return a.status === "Present";
      if (filter === "absent")  return a.status === "Absent";
      return true;
    })
    .filter((a) => {
      const q = search.toLowerCase();
      return (a.course?.name || "").toLowerCase().includes(q) ||
             new Date(a.date).toLocaleDateString("en-IN").includes(q);
    })
    .reverse();

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">🗓 My Attendance</h1>
        <p className="text-sm text-slate-400 mt-1">Subjects sorted by attendance % — lowest (at risk) first</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Classes", value: total,    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
          { label: "Present",       value: present,  gradient: "linear-gradient(135deg,#10b981,#0ea5e9)" },
          { label: "Absent",        value: absent,   gradient: "linear-gradient(135deg,#f59e0b,#ef4444)" },
          { label: "Attendance %",  value: `${pct}%`, gradient: `linear-gradient(135deg,${attColor},${attColor}99)` },
        ].map(({ label, value, gradient }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg" style={{ background: gradient }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white opacity-10 -mr-6 -mt-6" />
            <p className="text-2xl font-black">{value}</p>
            <p className="text-sm opacity-80 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Status Banner */}
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border font-medium text-sm ${attBg}`}>
        <span className="text-lg">{pct >= 85 ? "🎉" : pct >= 75 ? "⚠️" : "🚨"}</span>
        <div>
          <span className="font-bold">{attLabel}</span>
          {pct < 75 && <span className="ml-2">You need {Math.ceil((0.75 * total - present) / 0.25)} more classes to reach 75%.</span>}
          {pct >= 75 && pct < 85 && <span className="ml-2">You're meeting the minimum. Aim for 85%+ for excellence.</span>}
          {pct >= 85 && <span className="ml-2">Great job! You're well above the required attendance.</span>}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
          <span>Overall Attendance</span>
          <span style={{ color: attColor }}>{pct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: attColor }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>0%</span><span className="text-amber-500 font-semibold">75% (min)</span><span>100%</span>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => setView("subject")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${view === "subject" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
          📚 Subject-wise
        </button>
        <button onClick={() => setView("records")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${view === "records" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
          📋 All Records
        </button>
      </div>

      {/* Search */}
      <input placeholder="Search subject or date…" value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white shadow-sm" />

      {/* ── SUBJECT-WISE VIEW ── */}
      {view === "subject" && (
        <div className="space-y-3">
          {filteredSubjects.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
              <p className="text-slate-400">No attendance records found.</p>
            </div>
          ) : filteredSubjects.map((s, i) => {
            const subColor = s.pct >= 85 ? "#10b981" : s.pct >= 75 ? "#f59e0b" : "#ef4444";
            const subBorder = s.pct >= 85 ? "border-emerald-100" : s.pct >= 75 ? "border-amber-100" : "border-red-200";
            const badge     = s.pct >= 85 ? "bg-emerald-100 text-emerald-700" : s.pct >= 75 ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600";
            const needed    = s.pct < 75 ? Math.ceil((0.75 * s.total - s.present) / 0.25) : 0;
            return (
              <div key={s.id} className={`bg-white rounded-2xl shadow-sm border-2 p-5 transition hover:shadow-md ${subBorder}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${s.pct < 75 ? "bg-red-500" : s.pct < 85 ? "bg-amber-500" : "bg-emerald-500"}`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{s.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black" style={{ color: subColor }}>{s.pct}%</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
                      {s.pct >= 85 ? "Excellent" : s.pct >= 75 ? "Safe" : "⚠ At Risk"}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: subColor }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>✓ {s.present} Present · ✗ {s.total - s.present} Absent · {s.total} Total</span>
                  {needed > 0 && <span className="text-red-500 font-semibold">Need {needed} more classes for 75%</span>}
                  {s.pct >= 75 && s.pct < 85 && <span className="text-amber-500 font-semibold">{Math.ceil((0.85 * s.total - s.present) / 0.15)} more for 85%</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── RECORDS VIEW ── */}
      {view === "records" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-lg font-bold text-slate-700 flex-1">All Records</h2>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-sm">
              {[["all","All"],["present","Present"],["absent","Absent"]].map(([key,label]) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${filter === key ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecords.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-400">
                    {attendance.length === 0 ? "No attendance records found." : "No records match your filter."}
                  </td></tr>
                ) : filteredRecords.map((a, i) => (
                  <tr key={a._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-700">{a.course?.name || "—"}</p>
                      <p className="text-xs text-slate-400">{a.course?.code || ""}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {new Date(a.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${a.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {a.status === "Present" ? "✓ Present" : "✗ Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecords.length > 0 && (
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
              Showing {filteredRecords.length} of {total} records
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;