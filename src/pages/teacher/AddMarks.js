 import React, { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
//import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

//const { user } = { user: null }; // will be from context below

// ── Grade helper ──────────────────────────────────────────────────────────────
const getGrade = (m) => {
  const n = Number(m);
  if (isNaN(n) || m === "") return { grade: "—", color: "#94a3b8" };
  if (n >= 90) return { grade: "O",  color: "#7c3aed" };
  if (n >= 80) return { grade: "A+", color: "#10b981" };
  if (n >= 70) return { grade: "A",  color: "#3b82f6" };
  if (n >= 60) return { grade: "B+", color: "#06b6d4" };
  if (n >= 50) return { grade: "B",  color: "#f59e0b" };
  if (n >= 40) return { grade: "C",  color: "#f97316" };
  return              { grade: "F",  color: "#ef4444" };
};

// ── Print PDF of marks sheet ──────────────────────────────────────────────────
const printMarksSheet = (course, students, marksMap, teacherName) => {
  const rows = students.map((s, i) => {
    const m = marksMap[s._id] ?? "";
    const { grade, color } = getGrade(m);
    return `<tr style="background:${i%2===0?"#f8fafc":"#fff"}">
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0">${i+1}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-weight:600">${s.name}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;font-family:monospace">${s.rollNumber}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:700">${m !== "" ? m : "—"}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:900;color:${color}">${grade}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;text-align:center;color:${Number(m)>=40?"#10b981":"#ef4444"};font-weight:700">${m!==""?(Number(m)>=40?"Pass":"Fail"):"—"}</td>
    </tr>`;
  }).join("");

  const filled   = students.filter(s => marksMap[s._id] !== undefined && marksMap[s._id] !== "").length;
  const passing  = students.filter(s => Number(marksMap[s._id]) >= 40).length;
  const avgMarks = filled > 0 ? Math.round(students.reduce((sum,s) => sum + (Number(marksMap[s._id])||0), 0) / filled) : 0;

  const html = `<html><head><title>Marks Sheet</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
    .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:20px;margin-bottom:28px}
    h1{font-size:22px;font-weight:900;letter-spacing:.5px}
    .sub{color:#64748b;font-size:13px;margin-top:6px}
    .badge{display:inline-block;background:#6366f1;color:white;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-top:10px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}
    .meta-item{background:#f8fafc;border-radius:8px;padding:12px}
    .meta-item label{font-size:11px;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:4px;font-weight:600}
    .meta-item span{font-size:14px;font-weight:700}
    .stats{display:flex;gap:12px;margin:16px 0}
    .stat{background:#f8fafc;border-radius:10px;padding:14px;text-align:center;flex:1}
    .stat h2{font-size:24px;font-weight:900;margin-bottom:4px}
    .stat p{font-size:12px;color:#64748b;font-weight:600}
    table{width:100%;border-collapse:collapse;margin-top:20px}
    thead{background:#1e293b;color:white}
    th{padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
    .footer{margin-top:28px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:16px}
    .sign{margin-top:40px;display:flex;justify-content:space-between}
    .sign-box{text-align:center;width:200px}
    .sign-line{border-top:1px solid #1e293b;padding-top:8px;font-size:12px;color:#64748b}
  </style></head><body>
  <div class="header">
    <h1>BCE BHAGALPUR</h1>
    <p class="sub">Bihar College of Engineering · Marks Sheet</p>
    <span class="badge">📝 MARKS RECORD</span>
  </div>
  <div class="meta">
    <div class="meta-item"><label>Course</label><span>${course.name}</span></div>
    <div class="meta-item"><label>Course Code</label><span>${course.code}</span></div>
    <div class="meta-item"><label>Department</label><span>${course.department}</span></div>
    <div class="meta-item"><label>Semester</label><span>Semester ${course.semester}</span></div>
    <div class="meta-item"><label>Teacher</label><span>${teacherName}</span></div>
    <div class="meta-item"><label>Date</label><span>${new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>
  </div>
  <div class="stats">
    <div class="stat"><h2 style="color:#1e293b">${students.length}</h2><p>Total Students</p></div>
    <div class="stat"><h2 style="color:#6366f1">${filled}</h2><p>Marks Entered</p></div>
    <div class="stat"><h2 style="color:#10b981">${passing}</h2><p>Passing</p></div>
    <div class="stat"><h2 style="color:#ef4444">${filled - passing}</h2><p>Failing</p></div>
    <div class="stat"><h2 style="color:#f59e0b">${avgMarks}</h2><p>Class Avg</p></div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Student Name</th><th>Roll No.</th><th>Marks (/100)</th><th>Grade</th><th>Result</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="sign">
    <div class="sign-box"><div class="sign-line">Examiner Signature</div></div>
    <div class="sign-box"><div class="sign-line">HOD Signature</div></div>
    <div class="sign-box"><div class="sign-line">Principal Signature</div></div>
  </div>
  <div class="footer">
    <p>Generated on ${new Date().toLocaleString("en-IN")} · BCE Bhagalpur College ERP</p>
    <p>This is a computer-generated marks sheet.</p>
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

// ─────────────────────────────────────────────────────────────────────────────
const AddMarks = () => {
  const { user } = useContext(require("../../context/AuthContext").AuthContext);

  const [courses, setCourses]     = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents]   = useState([]);
  const [marksMap, setMarksMap]   = useState({}); // { studentId: marksValue }
  const [existingMarks, setExistingMarks] = useState({}); // already saved marks
  const [loading, setLoading]     = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]       = useState("");
  const inputRefs = useRef({});

  // Load assigned courses on mount
  useEffect(() => {
    setLoading(true);
    API.get("/teacher/courses")
      .then(res => { setCourses(res.data.courses || []); })
      .catch(e => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  // Load students + existing marks when course selected
  useEffect(() => {
    if (!selectedCourse) return;
    setLoadingStudents(true);
    setMarksMap({});
    setExistingMarks({});
    setStudents([]);

    Promise.all([
      API.get("/teacher/students"),
      API.get(`/marks/course/${selectedCourse._id}`).catch(() => ({ data: [] })),
    ]).then(([studRes, marksRes]) => {
      const allStudents = studRes.data.students || [];
      // Filter to only students enrolled in this specific course
      const enrolled = allStudents.filter(s =>
        s.department === selectedCourse.department &&
        s.semester   === selectedCourse.semester   &&
        (s.courses || []).some(c => (c._id || c).toString() === selectedCourse._id.toString())
      );
      setStudents(enrolled);

      // Pre-fill existing marks
      const existing = {};
      const marks = Array.isArray(marksRes.data) ? marksRes.data : (marksRes.data?.marks || []);
      marks.forEach(m => {
        const sId = m.student?._id || m.student;
        if (sId) existing[sId.toString()] = m.marks;
      });
      setExistingMarks(existing);
      setMarksMap({ ...existing });
    }).catch(e => {
      toast.error("Failed to load students");
    }).finally(() => setLoadingStudents(false));
  }, [selectedCourse]);

  const handleMarkChange = (studentId, value) => {
    if (value !== "" && (Number(value) < 0 || Number(value) > 100)) return;
    setMarksMap(prev => ({ ...prev, [studentId]: value }));
  };

  // Tab to next input
  const handleKeyDown = (e, studentId, index) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextId = students[index + 1]?._id;
      if (nextId && inputRefs.current[nextId]) {
        inputRefs.current[nextId].focus();
      }
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const filledCount  = Object.entries(marksMap).filter(([,v]) => v !== "" && v !== undefined).length;
  const passingCount = Object.entries(marksMap).filter(([,v]) => Number(v) >= 40).length;
  const avgMarks     = filledCount > 0
    ? Math.round(Object.values(marksMap).filter(v => v !== "").reduce((s, v) => s + Number(v), 0) / filledCount)
    : 0;

  const submitAll = async () => {
    const toSubmit = Object.entries(marksMap).filter(([, v]) => v !== "" && v !== undefined);
    if (toSubmit.length === 0) { toast.error("Enter at least one student's marks"); return; }

    setSubmitting(true);
    try {
      await Promise.all(
        toSubmit.map(([studentId, marks]) =>
          API.post("/teacher/marks", {
            studentId,
            courseId: selectedCourse._id,
            marks:    Number(marks),
          })
        )
      );
      toast.success(`✅ Marks saved for ${toSubmit.length} student(s)!`);
      setExistingMarks({ ...marksMap });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save marks");
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-500 border-t-transparent"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">📝 Add Marks</h1>
        <p className="text-slate-400 text-sm mt-1">Select a course → enter marks → save & download PDF</p>
      </div>

      {/* Course Selection Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4">
          📚 Select Course — click to enter marks
        </h2>
        {courses.length === 0 ? (
          <p className="text-slate-400 text-sm italic">No courses assigned. Ask admin to assign courses.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.map(c => (
              <button key={c._id} onClick={() => { setSelectedCourse(c); setSearch(""); }}
                className={`text-left p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                  selectedCourse?._id === c._id
                    ? "border-violet-500 bg-violet-50 shadow"
                    : "border-slate-100 bg-white hover:border-violet-200"
                }`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-slate-800 text-sm leading-tight">{c.name}</p>
                  <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{c.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{c.department}</span>
                  <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-full">Sem {c.semester}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Marks Entry Section */}
      {selectedCourse && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Course Info Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-violet-200 text-xs uppercase font-semibold">Selected Course</p>
                <h2 className="text-xl font-black mt-0.5">{selectedCourse.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{selectedCourse.code}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{selectedCourse.department}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">Semester {selectedCourse.semester}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => printMarksSheet(selectedCourse, students, marksMap, user?.name)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                  📄 Download PDF
                </button>
                <button onClick={submitAll} disabled={submitting}
                  className="bg-white text-violet-700 hover:bg-violet-50 px-4 py-2 rounded-xl text-sm font-bold transition disabled:opacity-60 flex items-center gap-2">
                  {submitting ? "Saving..." : "💾 Save All"}
                </button>
              </div>
            </div>

            {/* Live Stats */}
            {students.length > 0 && (
              <div className="flex gap-4 mt-4">
                {[
                  { label: "Total", value: students.length, color: "text-white" },
                  { label: "Filled", value: filledCount, color: "text-emerald-300" },
                  { label: "Passing", value: passingCount, color: "text-yellow-300" },
                  { label: "Avg Marks", value: filledCount > 0 ? avgMarks : "—", color: "text-blue-200" },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl px-3 py-2 text-center min-w-[60px]">
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-white/60 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search student by name or roll..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 transition" />
            </div>
            <p className="text-xs text-slate-400 shrink-0 font-semibold">
              {filteredStudents.length} of {students.length} students
            </p>
          </div>

          {/* Marks Table */}
          {loadingStudents ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"/>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-semibold">No students enrolled in this course</p>
              <p className="text-sm mt-1">Students must be in {selectedCourse.department} · Semester {selectedCourse.semester}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left w-8">#</th>
                    <th className="px-5 py-3 text-left">Student</th>
                    <th className="px-5 py-3 text-center">Roll No.</th>
                    <th className="px-5 py-3 text-center">Dept · Sem</th>
                    <th className="px-5 py-3 text-center w-32">Marks (/100)</th>
                    <th className="px-5 py-3 text-center w-16">Grade</th>
                    <th className="px-5 py-3 text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map((s, i) => {
                    const val = marksMap[s._id];
                    const saved = existingMarks[s._id] !== undefined;
                    const changed = val !== existingMarks[s._id];
                    const { grade, color } = getGrade(val);
                    return (
                      <tr key={s._id} className={`hover:bg-slate-50 transition ${changed && val !== "" ? "bg-violet-50/30" : ""}`}>
                        <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {s.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">{s.rollNumber}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">{s.department}</span>
                            <span className="text-xs bg-violet-100 text-violet-700 font-bold px-1.5 py-0.5 rounded-full">S{s.semester}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <input
                              ref={el => inputRefs.current[s._id] = el}
                              type="number" min="0" max="100"
                              value={val ?? ""}
                              onChange={e => handleMarkChange(s._id, e.target.value)}
                              onKeyDown={e => handleKeyDown(e, s._id, i)}
                              placeholder="—"
                              className={`w-20 text-center border-2 rounded-xl py-1.5 text-sm font-bold outline-none transition ${
                                val !== "" && val !== undefined
                                  ? Number(val) >= 40
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 focus:border-emerald-500"
                                    : "border-red-300 bg-red-50 text-red-600 focus:border-red-500"
                                  : "border-slate-200 bg-white focus:border-violet-400"
                              }`}
                            />
                            {saved && !changed && (
                              <span className="text-emerald-500 text-xs" title="Saved">✓</span>
                            )}
                            {changed && val !== "" && (
                              <span className="text-amber-500 text-xs" title="Unsaved change">●</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-lg font-black" style={{ color }}>{grade}</span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          {val !== "" && val !== undefined ? (
                            Number(val) >= 40
                              ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">✓ Pass</span>
                              : <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">✗ Fail</span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Actions */}
          {students.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                <span className="text-amber-500 font-bold">●</span> = unsaved &nbsp;
                <span className="text-emerald-500 font-bold">✓</span> = saved &nbsp;·&nbsp;
                Press <kbd className="bg-slate-200 px-1 py-0.5 rounded text-slate-600">Enter</kbd> to move to next student
              </p>
              <div className="flex gap-2">
                <button onClick={() => printMarksSheet(selectedCourse, students, marksMap, user?.name)}
                  className="border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2">
                  📄 Download PDF
                </button>
                <button onClick={submitAll} disabled={submitting}
                  className="bg-violet-600 text-white hover:bg-violet-700 px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-60 flex items-center gap-2">
                  {submitting
                    ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</>
                    : `💾 Save All (${Object.values(marksMap).filter(v=>v!=="").length} marks)`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grade Legend */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Grade Scale</p>
        <div className="flex flex-wrap gap-2">
          {[
            { g:"O",  r:"90-100", c:"#7c3aed", bg:"bg-purple-100" },
            { g:"A+", r:"80-89",  c:"#10b981", bg:"bg-emerald-100" },
            { g:"A",  r:"70-79",  c:"#3b82f6", bg:"bg-blue-100" },
            { g:"B+", r:"60-69",  c:"#06b6d4", bg:"bg-cyan-100" },
            { g:"B",  r:"50-59",  c:"#f59e0b", bg:"bg-amber-100" },
            { g:"C",  r:"40-49",  c:"#f97316", bg:"bg-orange-100" },
            { g:"F",  r:"<40",    c:"#ef4444", bg:"bg-red-100" },
          ].map(item => (
            <div key={item.g} className={`${item.bg} px-3 py-1.5 rounded-xl flex items-center gap-2`}>
              <span className="font-black text-sm" style={{color:item.c}}>{item.g}</span>
              <span className="text-xs text-slate-500">{item.r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMarks;