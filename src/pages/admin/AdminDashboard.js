 import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE"];

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  Students: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Teachers: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Courses:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Notice:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Risk:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Trash:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Search:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  AI:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>,
  Chart:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Ic, label, value, sub, color }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} hover:shadow-md transition-all`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-xl ${color.replace("border-", "bg-").replace("-500","-100")} text-${color.split("-")[1]}-600`}>
        <Ic />
      </div>
    </div>
    <p className="text-3xl font-black text-slate-800">{value}</p>
    <p className="text-sm font-semibold text-slate-600 mt-1">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

// ── Tab Button ────────────────────────────────────────────────────────────────
const Tab = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
      active ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-100"
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
        {count}
      </span>
    )}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab]             = useState("overview");
  const [students, setStudents]   = useState([]);
  const [teachers, setTeachers]   = useState([]);
  const [notices, setNotices]     = useState([]);
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);

  // filters
  const [studentSearch, setStudentSearch] = useState("");
  const [studentDept, setStudentDept]     = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherDept, setTeacherDept]     = useState("");

  // notice form
  const [noticeTitle, setNoticeTitle]     = useState("");
  const [noticeMsg, setNoticeMsg]         = useState("");
  const [noticeLoading, setNoticeLoading] = useState(false);

  // AI report
  const [aiReport, setAiReport]           = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, tRes, nRes, cRes] = await Promise.allSettled([
        API.get("/admin/students"),
        API.get("/admin/teachers"),
        API.get("/admin/notices"),
        API.get("/teacher/courses"),
      ]);
      if (sRes.status === "fulfilled") setStudents(sRes.value.data || []);
      if (tRes.status === "fulfilled") setTeachers(tRes.value.data || []);
      if (nRes.status === "fulfilled") setNotices(nRes.value.data || []);
      if (cRes.status === "fulfilled") setCourses(cRes.value.data?.courses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await API.delete(`/admin/students/${id}`);
      setStudents((p) => p.filter((s) => s._id !== id));
      showToast("Student deleted");
    } catch { showToast("Failed to delete", "error"); }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await API.delete(`/admin/teachers/${id}`);
      setTeachers((p) => p.filter((t) => t._id !== id));
      showToast("Teacher deleted");
    } catch { showToast("Failed to delete", "error"); }
  };

  const postNotice = async () => {
    if (!noticeTitle.trim() || !noticeMsg.trim()) return showToast("Fill all fields", "error");
    setNoticeLoading(true);
    try {
      const res = await API.post("/admin/notices", { title: noticeTitle, message: noticeMsg });
      setNotices((p) => [res.data, ...p]);
      setNoticeTitle(""); setNoticeMsg("");
      showToast("Notice posted!");
    } catch { showToast("Failed to post notice", "error"); }
    finally { setNoticeLoading(false); }
  };

  const deleteNotice = async (id) => {
    try {
      await API.delete(`/admin/notices/${id}`);
      setNotices((p) => p.filter((n) => n._id !== id));
      showToast("Notice deleted");
    } catch { showToast("Failed", "error"); }
  };

  const generateReport = async () => {
    setReportLoading(true); setAiReport("");
    try {
      const res = await API.get("/ai/report");
      setAiReport(res.data.report);
    } catch { setAiReport("⚠️ Failed to generate AI report."); }
    finally { setReportLoading(false); }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const atRisk = students.filter((s) => (s.attendancePct ?? 0) < 75);
  const deptCount = DEPARTMENTS.map((d) => ({
    dept: d,
    students: students.filter((s) => s.department === d).length,
    teachers: teachers.filter((t) => t.department === d).length,
  }));

  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    const matchQ = !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q);
    const matchD = !studentDept || s.department === studentDept;
    return matchQ && matchD;
  });

  const filteredTeachers = teachers.filter((t) => {
    const q = teacherSearch.toLowerCase();
    const matchQ = !q || t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q);
    const matchD = !teacherDept || t.department === teacherDept;
    return matchQ && matchD;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm transition-all ${
          toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-800">⚙️ Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm text-slate-600 font-medium">
          BCE Bhagalpur · College ERP
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        {[
          { id: "overview",  label: "Overview" },
          { id: "students",  label: "Students",  count: students.length },
          { id: "teachers",  label: "Teachers",  count: teachers.length },
          { id: "notices",   label: "Notices",   count: notices.length },
          { id: "reports",   label: "Reports" },
          { id: "atrisk",    label: "⚠️ At Risk", count: atRisk.length },
        ].map((t) => (
          <Tab key={t.id} label={t.label} count={t.count} active={tab === t.id} onClick={() => setTab(t.id)} />
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Icon.Students} label="Total Students" value={students.length} sub={`Across ${DEPARTMENTS.length} departments`} color="border-blue-500" />
            <StatCard icon={Icon.Teachers} label="Total Teachers" value={teachers.length} sub="Active faculty" color="border-emerald-500" />
            <StatCard icon={Icon.Courses}  label="Total Courses"  value={courses.length}  sub="All departments" color="border-purple-500" />
            <StatCard icon={Icon.Notice}   label="Notices"        value={notices.length}  sub="Posted notices" color="border-amber-500" />
          </div>

          {/* Department wise table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Icon.Chart /> Department Overview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Department</th>
                    <th className="px-5 py-3 text-center">Students</th>
                    <th className="px-5 py-3 text-center">Teachers</th>
                    <th className="px-5 py-3 text-center">Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {deptCount.map((d) => (
                    <tr key={d.dept} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-bold text-slate-800">{d.dept}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{d.students}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{d.teachers}</span>
                      </td>
                      <td className="px-5 py-3 text-center text-slate-500">
                        {d.teachers > 0 ? `${Math.round(d.students / d.teachers)}:1` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Notices preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Icon.Notice /> Recent Notices</h2>
            {notices.slice(0, 3).map((n) => (
              <div key={n._id} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{n.message}</p>
                </div>
              </div>
            ))}
            {notices.length === 0 && <p className="text-slate-400 text-sm">No notices yet.</p>}
          </div>
        </div>
      )}

      {/* ── STUDENTS TAB ── */}
      {tab === "students" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <h2 className="text-lg font-bold text-slate-700 flex-1">All Students</h2>
            <div className="flex gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.Search /></span>
                <input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 w-48" />
              </div>
              <select value={studentDept} onChange={(e) => setStudentDept(e.target.value)} className="border border-slate-200 rounded-xl text-sm px-3 py-2 outline-none focus:border-slate-400">
                <option value="">All Depts</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-center">Roll No</th>
                  <th className="px-5 py-3 text-center">Dept</th>
                  <th className="px-5 py-3 text-center">Year</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((s, i) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{s.email}</td>
                    <td className="px-5 py-3 text-center font-mono text-slate-600">{s.rollNumber}</td>
                    <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.department}</span></td>
                    <td className="px-5 py-3 text-center text-slate-600">Year {s.year}</td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => deleteStudent(s._id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"><Icon.Trash /></button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">No students found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TEACHERS TAB ── */}
      {tab === "teachers" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <h2 className="text-lg font-bold text-slate-700 flex-1">All Teachers</h2>
            <div className="flex gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.Search /></span>
                <input value={teacherSearch} onChange={(e) => setTeacherSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 w-48" />
              </div>
              <select value={teacherDept} onChange={(e) => setTeacherDept(e.target.value)} className="border border-slate-200 rounded-xl text-sm px-3 py-2 outline-none focus:border-slate-400">
                <option value="">All Depts</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-center">Teacher ID</th>
                  <th className="px-5 py-3 text-center">Dept</th>
                  <th className="px-5 py-3 text-left">Designation</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTeachers.map((t, i) => (
                  <tr key={t._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {t.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{t.email}</td>
                    <td className="px-5 py-3 text-center font-mono text-slate-600">{t.TeacherIdNumber}</td>
                    <td className="px-5 py-3 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">{t.department}</span></td>
                    <td className="px-5 py-3 text-slate-600">{t.designation}</td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => deleteTeacher(t._id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"><Icon.Trash /></button>
                    </td>
                  </tr>
                ))}
                {filteredTeachers.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">No teachers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── NOTICES TAB ── */}
      {tab === "notices" && (
        <div className="space-y-6">
          {/* Post Notice */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-4">📢 Post New Notice</h2>
            <div className="space-y-3">
              <input
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="Notice Title"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition"
              />
              <textarea
                value={noticeMsg}
                onChange={(e) => setNoticeMsg(e.target.value)}
                placeholder="Notice message..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition resize-none"
              />
              <button
                onClick={postNotice}
                disabled={noticeLoading}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60"
              >
                {noticeLoading ? "Posting..." : "Post Notice"}
              </button>
            </div>
          </div>

          {/* Notices List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-700">All Notices ({notices.length})</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {notices.length === 0 && <p className="text-center py-10 text-slate-400">No notices yet</p>}
              {notices.map((n) => (
                <div key={n._id} className="flex items-start justify-between gap-4 p-5 hover:bg-slate-50 transition">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{n.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-300 mt-1">{new Date(n.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteNotice(n._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition shrink-0"><Icon.Trash /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REPORTS TAB ── */}
      {tab === "reports" && (
        <div className="space-y-6">
          {/* Dept bars */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2"><Icon.Chart /> Department-wise Student Distribution</h2>
            <div className="space-y-4">
              {deptCount.map((d) => {
                const pct = students.length > 0 ? Math.round((d.students / students.length) * 100) : 0;
                return (
                  <div key={d.dept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-700">{d.dept}</span>
                      <span className="text-slate-400">{d.students} students ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-slate-700 to-slate-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Report */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Icon.AI /> AI Academic Performance Report</h2>
              <button
                onClick={generateReport}
                disabled={reportLoading}
                className="bg-slate-800 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60 flex items-center gap-2"
              >
                {reportLoading ? (
                  <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Generating...</>
                ) : "🤖 Generate Report"}
              </button>
            </div>
            {reportLoading && <p className="text-slate-400 animate-pulse text-sm">🤖 AI is analyzing student performance data...</p>}
            {aiReport && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-auto max-h-[500px] prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiReport}</ReactMarkdown>
              </div>
            )}
            {!aiReport && !reportLoading && (
              <p className="text-slate-400 text-sm text-center py-8">Click "Generate Report" to analyze student performance with AI</p>
            )}
          </div>
        </div>
      )}

      {/* ── AT RISK TAB ── */}
      {tab === "atrisk" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Icon.Risk /> At-Risk Students
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold ml-2">Attendance &lt; 75%</span>
            </h2>
          </div>
          {atRisk.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-slate-600 font-semibold">All students have attendance above 75%!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-red-50 text-red-400 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-center">Roll No</th>
                    <th className="px-5 py-3 text-center">Dept</th>
                    <th className="px-5 py-3 text-center">Attendance %</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {atRisk.map((s) => (
                    <tr key={s._id} className="hover:bg-red-50/30">
                      <td className="px-5 py-3 font-semibold text-slate-800">{s.name}</td>
                      <td className="px-5 py-3 text-center font-mono text-slate-600">{s.rollNumber}</td>
                      <td className="px-5 py-3 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.department}</span></td>
                      <td className="px-5 py-3 text-center">
                        <span className={`font-black text-lg ${(s.attendancePct ?? 0) < 50 ? "text-red-600" : "text-amber-500"}`}>
                          {s.attendancePct ?? 0}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          (s.attendancePct ?? 0) < 50 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {(s.attendancePct ?? 0) < 50 ? "Critical" : "Warning"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;