 import React, { useEffect, useState, useCallback } from "react";
import API from "../../api/axios";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EE"];
const FEE_TYPES   = ["Tuition", "Hostel", "Exam", "Library", "Other"];
const SEMESTERS   = [1, 2, 3, 4, 5, 6, 7, 8];

const statusColor = (s) => ({
  Paid:    "bg-emerald-100 text-emerald-700",
  Unpaid:  "bg-red-100 text-red-600",
  Partial: "bg-amber-100 text-amber-600",
}[s] || "bg-gray-100 text-gray-600");

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Trash:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>,
  Check:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  PDF:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

// ── PDF Receipt Generator (browser-side) ────────────────────────────────────
const downloadReceipt = (fee) => {
  const student = fee.student;
  const html = `
    <html><head><title>Fee Receipt</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
      .header { text-align: center; border-bottom: 3px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px; }
      .header h1 { margin: 0; font-size: 22px; }
      .header p  { margin: 4px 0; color: #64748b; font-size: 13px; }
      .badge { background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
      .field { background: #f8fafc; padding: 12px; border-radius: 8px; }
      .field label { font-size: 11px; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 4px; }
      .field span  { font-size: 15px; font-weight: 600; }
      .amount-box { background: #1e293b; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
      .amount-box p { margin: 0; font-size: 13px; color: #94a3b8; }
      .amount-box h2 { margin: 8px 0 0; font-size: 28px; }
      .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    </style></head><body>
    <div class="header">
      <h1>BCE BHAGALPUR</h1>
      <p>Bihar College of Engineering, Bhagalpur</p>
      <p>Fee Payment Receipt &nbsp; <span class="badge">✓ PAID</span></p>
    </div>
    <div class="grid">
      <div class="field"><label>Receipt No.</label><span>${fee.receiptNo || "N/A"}</span></div>
      <div class="field"><label>Payment Date</label><span>${fee.paidDate ? new Date(fee.paidDate).toLocaleDateString("en-IN") : "—"}</span></div>
      <div class="field"><label>Student Name</label><span>${student?.name || "—"}</span></div>
      <div class="field"><label>Roll Number</label><span>${student?.rollNumber || "—"}</span></div>
      <div class="field"><label>Department</label><span>${student?.department || "—"}</span></div>
      <div class="field"><label>Semester</label><span>Semester ${fee.semester}</span></div>
      <div class="field"><label>Fee Type</label><span>${fee.feeType}</span></div>
      <div class="field"><label>Due Date</label><span>${new Date(fee.dueDate).toLocaleDateString("en-IN")}</span></div>
    </div>
    <div class="amount-box">
      <p>Amount Paid</p>
      <h2>₹${Number(fee.paidAmount).toLocaleString("en-IN")}</h2>
    </div>
    ${fee.description ? `<p style="color:#64748b;font-size:13px"><strong>Note:</strong> ${fee.description}</p>` : ""}
    <div class="footer">
      <p>This is a computer-generated receipt. No signature required.</p>
      <p>Generated on ${new Date().toLocaleDateString("en-IN")} · BCE Bhagalpur College ERP</p>
    </div>
    </body></html>
  `;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

// ── Pay Modal ────────────────────────────────────────────────────────────────
const PayModal = ({ fee, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(fee.amount - fee.paidAmount);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await API.put(`/fees/pay/${fee._id}`, { paidAmount: Number(amount) + fee.paidAmount });
      onSuccess(res.data.fee);
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">💳 Mark as Paid</h2>
        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1">
          <p><span className="text-slate-400">Student:</span> <strong>{fee.student?.name}</strong></p>
          <p><span className="text-slate-400">Total Fee:</span> <strong>{fmt(fee.amount)}</strong></p>
          <p><span className="text-slate-400">Already Paid:</span> <strong>{fmt(fee.paidAmount)}</strong></p>
          <p><span className="text-slate-400">Remaining:</span> <strong className="text-red-600">{fmt(fee.amount - fee.paidAmount)}</strong></p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase">Amount Being Paid Now</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2 mt-1 text-sm outline-none focus:border-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-slate-200 rounded-xl py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={submit} disabled={loading} className="flex-1 bg-emerald-600 text-white rounded-xl py-2 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};


// ── Proof Modal ───────────────────────────────────────────────────────────────
const ProofModal = ({ fee, onClose, onVerify, onReject }) => {
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    try {
      await API.put(`/fees/pay/${fee._id}`, { paidAmount: fee.amount });
      onVerify();
      onClose();
    } catch { alert("Failed to verify"); }
    finally { setLoading(false); }
  };

  const reject = async () => {
    if (!window.confirm("Reject this payment proof?")) return;
    try {
      await API.put(`/fees/reject/${fee._id}`);
      onReject();
      onClose();
    } catch { alert("Failed to reject"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">🔍 Verify Payment Proof</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1">
          <p><span className="text-slate-400">Student:</span> <strong>{fee.student?.name}</strong> ({fee.student?.rollNumber})</p>
          <p><span className="text-slate-400">Fee:</span> <strong>{fee.feeType} — Sem {fee.semester}</strong></p>
          <p><span className="text-slate-400">Amount:</span> <strong className="text-slate-800">₹{Number(fee.amount).toLocaleString("en-IN")}</strong></p>
          {fee.paymentNote && <p><span className="text-slate-400">UTR/Ref:</span> <strong className="text-blue-700">{fee.paymentNote}</strong></p>}
          {fee.submittedAt && <p><span className="text-slate-400">Submitted:</span> {new Date(fee.submittedAt).toLocaleString("en-IN")}</p>}
        </div>
        {fee.paymentProof && (
          fee.paymentProof.startsWith("data:image") ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Payment Screenshot</p>
              <img src={fee.paymentProof} alt="Payment proof" className="w-full rounded-xl border border-slate-200 max-h-72 object-contain" />
            </div>
          ) : (
            <a href={fee.paymentProof} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-100 transition">
              📄 View Uploaded Document — {fee.paymentProofName}
            </a>
          )
        )}
        <div className="flex gap-2 pt-2">
          <button onClick={reject} className="flex-1 border-2 border-red-200 text-red-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-red-50 transition">
            ✗ Reject
          </button>
          <button onClick={verify} disabled={loading} className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition">
            {loading ? "Verifying..." : "✓ Verify & Mark Paid"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Assign Fee Modal ──────────────────────────────────────────────────────────
const AssignModal = ({ students, onClose, onSuccess }) => {
  const [mode, setMode]       = useState("bulk"); // "bulk" | "single"
  const [form, setForm]       = useState({ studentId: "", department: "CSE", semester: 1, amount: "", dueDate: "", feeType: "Tuition", description: "" });
  const [loading, setLoading] = useState(false);

  const ch = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    try {
      if (mode === "bulk") {
        const res = await API.post("/fees/assign-bulk", { ...form, semester: Number(form.semester), amount: Number(form.amount) });
        onSuccess(res.data.message);
      } else {
        await API.post("/fees/assign", { ...form, semester: Number(form.semester), amount: Number(form.amount) });
        onSuccess("Fee assigned successfully!");
      }
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-800">💰 Assign Fee</h2>

        {/* Mode toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1">
          {["bulk", "single"].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition ${mode === m ? "bg-white shadow text-slate-800" : "text-slate-500"}`}>
              {m === "bulk" ? "🏫 Bulk (Department)" : "👤 Single Student"}
            </button>
          ))}
        </div>

        {mode === "bulk" ? (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Department</label>
            <select name="department" value={form.department} onChange={ch} className={inputCls}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Student</label>
            <select name="studentId" value={form.studentId} onChange={ch} className={inputCls}>
              <option value="">Select student</option>
              {students.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Semester</label>
            <select name="semester" value={form.semester} onChange={ch} className={inputCls}>
              {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Fee Type</label>
            <select name="feeType" value={form.feeType} onChange={ch} className={inputCls}>
              {FEE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Amount (₹)</label>
            <input name="amount" type="number" placeholder="e.g. 45000" value={form.amount} onChange={ch} className={inputCls} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Due Date</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={ch} className={inputCls} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Description (optional)</label>
          <input name="description" placeholder="e.g. Even semester 2026" value={form.description} onChange={ch} className={inputCls} />
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 border border-slate-200 rounded-xl py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={submit} disabled={loading} className="flex-1 bg-slate-800 text-white rounded-xl py-2 text-sm font-semibold hover:bg-slate-700 disabled:opacity-60">
            {loading ? "Assigning..." : "Assign Fee"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const FeeManagement = () => {
  const [fees, setFees]         = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterStatus, setFilterStatus]   = useState("");
  const [filterDept, setFilterDept]       = useState("");
  const [filterSem, setFilterSem]         = useState("");
  const [modal, setModal]       = useState(null); // "assign" | {type:"pay", fee}
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFees = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterDept)   params.append("department", filterDept);
      if (filterSem)    params.append("semester", filterSem);
      const res = await API.get(`/fees/all?${params}`);
      setFees(res.data.fees || []);
      setStats(res.data.stats || {});
    } catch (e) { console.error(e); }
  }, [filterStatus, filterDept, filterSem]);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/admin/students");
      setStudents(res.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    Promise.all([fetchFees(), fetchStudents()]).finally(() => setLoading(false));
  }, [fetchFees]);

  const handlePaySuccess = (updatedFee) => {
    setFees((prev) => prev.map((f) => f._id === updatedFee._id ? { ...f, ...updatedFee } : f));
    showToast("Payment recorded successfully!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fee record?")) return;
    try {
      await API.delete(`/fees/${id}`);
      setFees((p) => p.filter((f) => f._id !== id));
      showToast("Fee record deleted");
    } catch { showToast("Failed to delete", "error"); }
  };

  const filtered = fees.filter((f) => {
    const q = search.toLowerCase();
    return !q || f.student?.name?.toLowerCase().includes(q) || f.student?.rollNumber?.toLowerCase().includes(q);
  });

  const defaulters = fees.filter((f) => f.status !== "Paid" && new Date(f.dueDate) < new Date());

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

      {/* Modals */}
      {modal === "assign" && (
        <AssignModal students={students} onClose={() => setModal(null)} onSuccess={(msg) => { showToast(msg); fetchFees(); }} />
      )}
      {modal?.type === "pay" && (
        <PayModal fee={modal.fee} onClose={() => setModal(null)} onSuccess={handlePaySuccess} />
      )}
      {modal?.type === "proof" && (
        <ProofModal fee={modal.fee} onClose={() => setModal(null)} onVerify={() => { fetchFees(); showToast("Payment verified!"); }} onReject={() => { fetchFees(); showToast("Payment rejected", "error"); }} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-800">💰 Fee & Finance</h1>
          <p className="text-slate-400 text-sm mt-1">Manage student fees and payment records</p>
        </div>
        <button onClick={() => setModal("assign")} className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition">
          + Assign Fee
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Billed",    value: fmt(stats.totalAmount || 0),     color: "border-blue-500",    bg: "bg-blue-50",    text: "text-blue-700" },
          { label: "Collected",       value: fmt(stats.collectedAmount || 0), color: "border-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
          { label: "Paid",            value: stats.paidCount || 0,            color: "border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700" },
          { label: "Unpaid",          value: stats.unpaidCount || 0,          color: "border-red-500",     bg: "bg-red-50",     text: "text-red-700" },
          { label: "Pending",         value: stats.pendingCount || 0,          color: "border-blue-500",    bg: "bg-blue-50",    text: "text-blue-700" },
          { label: "Defaulters",      value: defaulters.length,               color: "border-orange-500",  bg: "bg-orange-50",  text: "text-orange-700" },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 border-l-4 ${c.color}`}>
            <p className={`text-2xl font-black ${c.text}`}>{c.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Defaulters Banner */}
      {defaulters.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-red-700">{defaulters.length} Fee Defaulter{defaulters.length > 1 ? "s" : ""}</p>
            <p className="text-sm text-red-500">
              {defaulters.slice(0, 3).map((d) => d.student?.name).join(", ")}
              {defaulters.length > 3 ? ` and ${defaulters.length - 3} more` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.Search /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="">All Status</option>
          <option>Paid</option><option>Unpaid</option><option>Partial</option>
        </select>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="">All Depts</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="">All Sems</option>
          {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-700">Fee Records ({filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Student</th>
                <th className="px-5 py-3 text-center">Sem</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right">Paid</th>
                <th className="px-5 py-3 text-center">Due Date</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No fee records found</td></tr>
              )}
              {filtered.map((f) => {
                const isOverdue = f.status !== "Paid" && new Date(f.dueDate) < new Date();
                return (
                  <tr key={f._id} className={`hover:bg-slate-50 transition ${isOverdue ? "bg-red-50/30" : ""}`}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{f.student?.name}</p>
                      <p className="text-xs text-slate-400">{f.student?.rollNumber} · {f.student?.department}</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">Sem {f.semester}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{f.feeType}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-700">{fmt(f.amount)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">{fmt(f.paidAmount)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs ${isOverdue ? "text-red-600 font-bold" : "text-slate-500"}`}>
                        {new Date(f.dueDate).toLocaleDateString("en-IN")}
                        {isOverdue && " ⚠️"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor(f.status)}`}>{f.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {f.status === "Pending Verification" && (
                          <button onClick={() => setModal({ type: "proof", fee: f })} title="View Proof" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition text-xs font-bold">👁</button>
                        )}
                        {f.status !== "Paid" && (
                          <button onClick={() => setModal({ type: "pay", fee: f })} title="Mark Paid" className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition"><Icon.Check /></button>
                        )}
                        {f.status === "Paid" && (
                          <button onClick={() => downloadReceipt(f)} title="Download Receipt" className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Icon.PDF /></button>
                        )}
                        <button onClick={() => handleDelete(f._id)} title="Delete" className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"><Icon.Trash /></button>
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

export default FeeManagement;