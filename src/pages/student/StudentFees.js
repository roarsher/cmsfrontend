 import React, { useEffect, useState, useRef } from "react";
import API from "../../api/axios";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const statusColor = (s) => ({
  "Paid":                 "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Unpaid":               "bg-red-100 text-red-600 border-red-200",
  "Partial":              "bg-amber-100 text-amber-600 border-amber-200",
  "Pending Verification": "bg-blue-100 text-blue-600 border-blue-200",
}[s] || "bg-gray-100 text-gray-600");

// ── PDF Receipt ───────────────────────────────────────────────────────────────
const downloadReceipt = (fee) => {
  const html = `<html><head><title>Fee Receipt</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}
    .header{text-align:center;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:24px}
    h1{margin:0;font-size:22px}.sub{margin:4px 0;color:#64748b;font-size:13px}
    .badge{background:#10b981;color:white;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:bold;display:inline-block;margin-top:8px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}
    .field{background:#f8fafc;padding:12px;border-radius:8px}
    .field label{font-size:11px;color:#94a3b8;text-transform:uppercase;display:block;margin-bottom:4px}
    .field span{font-size:15px;font-weight:600}
    .amount-box{background:#1e293b;color:white;padding:20px;border-radius:12px;text-align:center;margin:20px 0}
    .amount-box p{margin:0;font-size:13px;color:#94a3b8}.amount-box h2{margin:8px 0 0;font-size:28px}
    .footer{text-align:center;color:#94a3b8;font-size:12px;margin-top:32px;border-top:1px solid #e2e8f0;padding-top:16px}
  </style></head><body>
  <div class="header"><h1>BCE BHAGALPUR</h1>
  <p class="sub">Bihar College of Engineering, Bhagalpur</p>
  <p class="sub">Fee Payment Receipt</p><span class="badge">✓ PAID</span></div>
  <div class="grid">
    <div class="field"><label>Receipt No.</label><span>${fee.receiptNo||"N/A"}</span></div>
    <div class="field"><label>Payment Date</label><span>${fee.paidDate?new Date(fee.paidDate).toLocaleDateString("en-IN"):"—"}</span></div>
    <div class="field"><label>Semester</label><span>Semester ${fee.semester}</span></div>
    <div class="field"><label>Fee Type</label><span>${fee.feeType}</span></div>
    <div class="field"><label>Due Date</label><span>${new Date(fee.dueDate).toLocaleDateString("en-IN")}</span></div>
    <div class="field"><label>Status</label><span style="color:#10b981">Paid ✓</span></div>
  </div>
  <div class="amount-box"><p>Amount Paid</p><h2>₹${Number(fee.paidAmount).toLocaleString("en-IN")}</h2></div>
  ${fee.description?`<p style="color:#64748b;font-size:13px"><strong>Note:</strong> ${fee.description}</p>`:""}
  <div class="footer"><p>Computer-generated receipt. No signature required.</p>
  <p>Generated on ${new Date().toLocaleDateString("en-IN")} · BCE Bhagalpur ERP</p></div>
  </body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
};

// ── Upload Proof Modal ────────────────────────────────────────────────────────
const UploadModal = ({ fee, onClose, onSuccess }) => {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError("File too large. Max 5MB."); return; }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    if (!file) { setError("Please select a file"); return; }
    setLoading(true);
    try {
      await API.put(`/fees/proof/${fee._id}`, {
        paymentProof:     preview,
        paymentProofName: file.name,
        paymentNote:      note,
      });
      onSuccess();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">📤 Upload Payment Proof</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>

        {/* Fee Info */}
        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1">
          <p><span className="text-slate-400">Fee Type:</span> <strong>{fee.feeType} — Sem {fee.semester}</strong></p>
          <p><span className="text-slate-400">Amount Due:</span> <strong className="text-red-600">{fmt(fee.amount - fee.paidAmount)}</strong></p>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition"
        >
          {preview ? (
            preview.startsWith("data:image") ? (
              <img src={preview} alt="receipt" className="max-h-40 mx-auto rounded-lg object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">📄</span>
                <p className="text-sm font-semibold text-slate-700">{file?.name}</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <span className="text-4xl">📸</span>
              <p className="text-sm font-semibold">Click to upload screenshot or PDF</p>
              <p className="text-xs">JPG, PNG, PDF · Max 5MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" />
        </div>

        {/* UTR / Note */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Transaction ID / UTR Number (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. UTR123456789 or Transaction Ref"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={submit} disabled={loading} className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Uploading..." : "Submit Proof"}
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center">
          After submission, admin will verify and mark your fee as paid within 24 hours.
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const StudentFees = () => {
  const [fees, setFees]       = useState([]);
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSem, setActiveSem] = useState("all");
  const [uploadModal, setUploadModal] = useState(null); // fee object
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFees = () => {
    API.get("/fees/my")
      .then((res) => { setFees(res.data.fees || []); setStats(res.data.stats || {}); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFees(); }, []);

  const semesters = [...new Set(fees.map((f) => f.semester))].sort();
  const filtered  = activeSem === "all" ? fees : fees.filter((f) => f.semester === Number(activeSem));
  const overdue   = fees.filter((f) => f.status !== "Paid" && f.status !== "Pending Verification" && new Date(f.dueDate) < new Date());
  const pending   = fees.filter((f) => f.status === "Pending Verification");

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
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

      {/* Upload Modal */}
      {uploadModal && (
        <UploadModal
          fee={uploadModal}
          onClose={() => setUploadModal(null)}
          onSuccess={() => { fetchFees(); showToast("Payment proof submitted! Awaiting admin verification."); }}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">💰 My Fees</h1>
        <p className="text-slate-400 text-sm mt-1">View your fee status, upload payment proof and download receipts</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border-l-4 border-red-500 shadow-sm">
          <p className="text-2xl font-black text-red-600">{fmt(stats.totalDue || 0)}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1">Total Due</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-l-4 border-emerald-500 shadow-sm">
          <p className="text-2xl font-black text-emerald-600">{fmt(stats.totalPaid || 0)}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1">Total Paid</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-l-4 border-orange-500 shadow-sm">
          <p className="text-2xl font-black text-orange-600">{stats.overdueCount || 0}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1">Overdue</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-l-4 border-blue-500 shadow-sm">
          <p className="text-2xl font-black text-blue-600">{pending.length}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1">Pending Verification</p>
        </div>
      </div>

      {/* Pending verification banner */}
      {pending.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-bold text-blue-700">{pending.length} payment{pending.length > 1 ? "s" : ""} awaiting admin verification</p>
            <p className="text-sm text-blue-500 mt-0.5">Your receipt has been submitted. Admin will verify within 24 hours.</p>
          </div>
        </div>
      )}

      {/* Overdue Warning */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-red-700">You have {overdue.length} overdue payment{overdue.length > 1 ? "s" : ""}!</p>
            <p className="text-sm text-red-500 mt-0.5">Please upload your bank payment receipt immediately.</p>
          </div>
        </div>
      )}

      {/* Semester Tabs */}
      {semesters.length > 0 && (
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <button onClick={() => setActiveSem("all")}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${activeSem === "all" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
            All
          </button>
          {semesters.map((s) => (
            <button key={s} onClick={() => setActiveSem(s)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${activeSem === s ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
              Sem {s}
            </button>
          ))}
        </div>
      )}

      {/* Fee Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-slate-600 font-semibold">No fee records found</p>
          <p className="text-slate-400 text-sm mt-1">Contact admin if you think this is a mistake</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((f) => {
            const isOverdue = f.status !== "Paid" && f.status !== "Pending Verification" && new Date(f.dueDate) < new Date();
            const pct = f.amount > 0 ? Math.round((f.paidAmount / f.amount) * 100) : 0;
            const canUpload = f.status === "Unpaid" || f.status === "Partial";
            const isPending = f.status === "Pending Verification";

            return (
              <div key={f._id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition hover:shadow-md ${
                isOverdue ? "border-red-200" : isPending ? "border-blue-200" : "border-slate-100"
              }`}>
                <div className={`h-1.5 w-full ${
                  f.status === "Paid" ? "bg-emerald-400" :
                  isPending ? "bg-blue-400" :
                  isOverdue ? "bg-red-400" : "bg-amber-400"
                }`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-800">{f.feeType} Fee</p>
                      <p className="text-xs text-slate-400 mt-0.5">Semester {f.semester} {f.description ? `· ${f.description}` : ""}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${statusColor(f.status)}`}>{f.status}</span>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="font-black text-slate-800 text-sm">{fmt(f.amount)}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                      <p className="text-xs text-slate-400">Paid</p>
                      <p className="font-black text-emerald-700 text-sm">{fmt(f.paidAmount)}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-2.5 text-center">
                      <p className="text-xs text-slate-400">Due</p>
                      <p className="font-black text-red-600 text-sm">{fmt(f.amount - f.paidAmount)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Payment Progress</span><span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Pending proof info */}
                  {isPending && f.paymentNote && (
                    <div className="bg-blue-50 rounded-xl p-2.5 mb-3 text-xs text-blue-700">
                      <span className="font-semibold">Submitted:</span> {f.paymentNote} · {f.submittedAt ? new Date(f.submittedAt).toLocaleDateString("en-IN") : ""}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      <span className={isOverdue ? "text-red-500 font-semibold" : ""}>
                        Due: {new Date(f.dueDate).toLocaleDateString("en-IN")} {isOverdue ? "⚠️" : ""}
                      </span>
                      {f.paidDate && <span className="block">Paid: {new Date(f.paidDate).toLocaleDateString("en-IN")}</span>}
                    </div>
                    <div className="flex gap-2">
                      {canUpload && (
                        <button
                          onClick={() => setUploadModal(f)}
                          className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                        >
                          📤 Pay / Upload
                        </button>
                      )}
                      {isPending && (
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-semibold">
                          ⏳ Under Review
                        </span>
                      )}
                      {f.status === "Paid" && (
                        <button
                          onClick={() => downloadReceipt(f)}
                          className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                        >
                          📄 Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentFees;