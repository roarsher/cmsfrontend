 import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const getGrade = (marks) => {
  if (marks >= 90) return { grade: "A+", color: "text-emerald-600", bg: "bg-emerald-100" };
  if (marks >= 80) return { grade: "A",  color: "text-emerald-500", bg: "bg-emerald-50"  };
  if (marks >= 70) return { grade: "B+", color: "text-blue-600",    bg: "bg-blue-100"    };
  if (marks >= 60) return { grade: "B",  color: "text-blue-500",    bg: "bg-blue-50"     };
  if (marks >= 50) return { grade: "C",  color: "text-amber-600",   bg: "bg-amber-100"   };
  return                   { grade: "F",  color: "text-red-600",     bg: "bg-red-100"     };
};

const getBarColor = (marks) => {
  if (marks >= 75) return "#6366f1";
  if (marks >= 50) return "#f59e0b";
  return "#ef4444";
};

const Marks = () => {
  const { user } = useContext(AuthContext);
  const [marks, setMarks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [sort, setSort]       = useState("default"); // default | high | low

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      try {
        const res = await API.get("/marks/my-marks");
        setMarks(res.data || []);
      } catch (err) {
        console.error("Marks fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [user]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const avgMarks  = marks.length > 0
    ? Math.round(marks.reduce((s, m) => s + (m.marks || 0), 0) / marks.length) : 0;
  const highest   = marks.length > 0 ? Math.max(...marks.map(m => m.marks || 0)) : 0;
  const lowest    = marks.length > 0 ? Math.min(...marks.map(m => m.marks || 0)) : 0;
  const passed    = marks.filter(m => (m.marks || 0) >= 50).length;

  const radarData = marks.map((m) => ({
    subject: m.course?.name?.split(" ")[0] || "Sub",
    Marks: m.marks || 0,
  }));

  const filtered = marks
    .filter((m) => (m.course?.name || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "high") return b.marks - a.marks;
      if (sort === "low")  return a.marks - b.marks;
      return 0;
    });

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">📝 My Marks</h1>
        <p className="text-sm text-slate-400 mt-1">Subject-wise performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Average Marks", value: `${avgMarks}/100`, gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
          { label: "Highest Score", value: `${highest}/100`, gradient: "linear-gradient(135deg,#10b981,#0ea5e9)" },
          { label: "Lowest Score",  value: `${lowest}/100`,  gradient: "linear-gradient(135deg,#f59e0b,#ef4444)" },
          { label: "Subjects Passed", value: `${passed}/${marks.length}`, gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
        ].map(({ label, value, gradient }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg" style={{ background: gradient }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white opacity-10 -mr-6 -mt-6" />
            <p className="text-2xl font-black">{value}</p>
            <p className="text-sm opacity-80 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Radar + Grade distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-4">🕸 Performance Radar</h2>
          {marks.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No marks yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Radar name="Marks" dataKey="Marks" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Grade Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-4">🏅 Grade Summary</h2>
          <div className="space-y-3">
            {marks.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No marks yet</p>
            ) : marks.map((m) => {
              const { grade, color, bg } = getGrade(m.marks || 0);
              return (
                <div key={m._id} className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${bg} ${color}`}>
                    {grade}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{m.course?.name || "—"}</p>
                    <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.marks}%`, background: getBarColor(m.marks) }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-600 shrink-0">{m.marks}/100</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-lg font-bold text-slate-700 flex-1">📋 Detailed Marks</h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="default">Default Order</option>
            <option value="high">Highest First</option>
            <option value="low">Lowest First</option>
          </select>
          <input
            placeholder="Search subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:w-44"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Subject</th>
                <th className="px-5 py-3 text-center">Marks</th>
                <th className="px-5 py-3 text-center">Grade</th>
                <th className="px-5 py-3 text-center">Progress</th>
                <th className="px-5 py-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    {marks.length === 0 ? "No marks recorded yet." : "No subjects match your search."}
                  </td>
                </tr>
              ) : filtered.map((m, i) => {
                const { grade, color, bg } = getGrade(m.marks || 0);
                return (
                  <tr key={m._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{m.course?.name || "—"}</p>
                      <p className="text-xs text-slate-400">{m.course?.code || ""} · {m.course?.department || ""}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-lg font-black text-slate-700">{m.marks}</span>
                      <span className="text-slate-400 text-xs">/100</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-black ${bg} ${color}`}>
                        {grade}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${m.marks}%`, background: getBarColor(m.marks) }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">{m.marks}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {(m.marks || 0) >= 50
                        ? <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold">✓ Pass</span>
                        : <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-bold">✗ Fail</span>}
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

export default Marks;