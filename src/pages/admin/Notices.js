// // src/pages/admin/Notices.jsx
// import React, { useEffect, useState } from "react";
// import API from "../../api/axios";

// const Notices = () => {
//   const [notices, setNotices] = useState([]);
//   const [title, setTitle] = useState("");
//   const [message, setMessage] = useState("");

//   const fetchNotices = async () => {
//     try {
//       const res = await API.get("/admin/notices");
//       setNotices(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   const createNotice = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/admin/notices", { title, message });
//       setNotices([res.data, ...notices]);
//       setTitle("");
//       setMessage("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteNotice = async (id) => {
//     try {
//       await API.delete(`/admin/notices/${id}`);
//       setNotices((prev) => prev.filter((n) => n._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Manage Notices</h1>

//       {/* Create Notice */}
//       <form
//         onSubmit={createNotice}
//         className="bg-white p-4 rounded shadow mb-6 space-y-3"
//       >
//         <input
//           type="text"
//           placeholder="Notice Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <textarea
//           placeholder="Notice Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           Post Notice
//         </button>
//       </form>

//       {/* Notice List */}
//       <div className="bg-white rounded-lg shadow p-4">
//         {notices.length === 0 ? (
//           <p>No notices available</p>
//         ) : (
//           <ul className="space-y-4">
//             {notices.map((n) => (
//               <li
//                 key={n._id}
//                 className="border-b pb-2 flex justify-between items-start"
//               >
//                 <div>
//                   <h3 className="font-semibold">{n.title}</h3>
//                   <p className="text-sm text-gray-600">{n.message}</p>
//                 </div>
//                 <button
//                   onClick={() => deleteNotice(n._id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notices;
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

// ── PDF generator ─────────────────────────────────────────────────────────────
const downloadNoticePDF = (notice) => {
  const postedDate = new Date(notice.createdAt).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const postedTime = new Date(notice.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const printDate = new Date().toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  // Ref number: NOC-YYYYMMDD-XXXX
  const refNo = `NOC-${new Date(notice.createdAt).toISOString().slice(0,10).replace(/-/g,"")}-${notice._id.slice(-4).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html><head>
  <title>Notice — ${notice.title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:"Times New Roman",Times,serif;color:#1a1a1a;padding:48px 56px;font-size:14px;line-height:1.6}

    /* ── College header ── */
    .letterhead{text-align:center;border-bottom:3px double #1a1a1a;padding-bottom:18px;margin-bottom:28px}
    .college-name{font-size:26px;font-weight:900;letter-spacing:1px;text-transform:uppercase}
    .college-sub{font-size:13px;color:#444;margin-top:4px}
    .college-addr{font-size:12px;color:#666;margin-top:2px}
    .college-bar{height:4px;background:#1a1a1a;margin:10px auto 0;width:80px;border-radius:2px}

    /* ── Notice label ── */
    .notice-label{
      text-align:center;margin:20px 0 24px;
    }
    .notice-label span{
      display:inline-block;border:2px solid #1a1a1a;
      padding:4px 32px;font-size:17px;font-weight:700;
      letter-spacing:3px;text-transform:uppercase;
    }

    /* ── Meta row ── */
    .meta{display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;color:#444}
    .meta-left{text-align:left}
    .meta-right{text-align:right}

    /* ── Subject line ── */
    .subject-row{margin:20px 0 18px;padding:10px 16px;background:#f5f5f5;border-left:4px solid #1a1a1a;border-radius:0 4px 4px 0}
    .subject-label{font-size:11px;font-weight:700;text-transform:uppercase;color:#666;margin-bottom:3px}
    .subject-text{font-size:16px;font-weight:700;color:#1a1a1a}

    /* ── Body ── */
    .body-section{margin:18px 0 28px}
    .body-label{font-size:11px;font-weight:700;text-transform:uppercase;color:#666;margin-bottom:8px;letter-spacing:.5px}
    .body-text{
      font-size:14px;line-height:1.9;color:#222;
      white-space:pre-wrap;word-break:break-word;
    }

    /* ── Signature block ── */
    .signature{margin-top:48px;display:flex;justify-content:space-between;align-items:flex-end}
    .sig-left{font-size:12px;color:#666}
    .sig-right{text-align:center}
    .sig-line{border-top:1px solid #1a1a1a;width:200px;margin-bottom:6px}
    .sig-name{font-size:13px;font-weight:700}
    .sig-title{font-size:11px;color:#666}

    /* ── Footer ── */
    .footer{margin-top:36px;border-top:1px solid #ccc;padding-top:10px;display:flex;justify-content:space-between;font-size:10px;color:#888}

    @media print{body{padding:28px 36px}}
  </style>
</head><body>

  <!-- Letterhead -->
  <div class="letterhead">
    <div class="college-name">Bihar College of Engineering</div>
    <div class="college-sub">BCE Bhagalpur — Estd. 1960 | Affiliated to TNAU</div>
    <div class="college-addr">Sabour, Bhagalpur, Bihar — 813210 | Phone: (0641) 2502345</div>
    <div class="college-bar"></div>
  </div>

  <!-- NOTICE label -->
  <div class="notice-label"><span>Notice</span></div>

  <!-- Meta -->
  <div class="meta">
    <div class="meta-left">
      <div><strong>Ref No.:</strong> ${refNo}</div>
      <div><strong>Date:</strong> ${postedDate}</div>
      <div><strong>Time:</strong> ${postedTime}</div>
    </div>
    <div class="meta-right">
      <div>BCE Bhagalpur</div>
      <div>College ERP System</div>
    </div>
  </div>

  <!-- Subject -->
  <div class="subject-row">
    <div class="subject-label">Subject</div>
    <div class="subject-text">${notice.title}</div>
  </div>

  <!-- Body -->
  <div class="body-section">
    <div class="body-label">Notice Content</div>
    <div class="body-text">${notice.message}</div>
  </div>

  <!-- Signature -->
  <div class="signature">
    <div class="sig-left">
      <p>All concerned are hereby informed accordingly.</p>
      <p style="margin-top:6px">Issued from the Office of the Registrar,<br>Bihar College of Engineering, Bhagalpur.</p>
    </div>
    <div class="sig-right">
      <div class="sig-line"></div>
      <div class="sig-name">Registrar / Principal</div>
      <div class="sig-title">Bihar College of Engineering, Bhagalpur</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Ref: ${refNo}</span>
    <span>Printed on: ${printDate}</span>
    <span>BCE Bhagalpur College ERP — computer-generated notice</span>
  </div>

</body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const PDFIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
const Notices = () => {
  const [notices,  setNotices]  = useState([]);
  const [title,    setTitle]    = useState("");
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(true);
  const [posting,  setPosting]  = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotices = async () => {
    try {
      const res = await API.get("/admin/notices");
      setNotices(Array.isArray(res.data) ? res.data : res.data?.notices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const createNotice = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return showToast("Fill all fields", "error");
    setPosting(true);
    try {
      const res = await API.post("/admin/notices", { title, message });
      // Backend may return the notice directly or wrapped
      const newNotice = res.data?.notice || res.data;
      setNotices((p) => [newNotice, ...p]);
      setTitle(""); setMessage("");
      showToast("Notice posted!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to post", "error");
    } finally {
      setPosting(false);
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await API.delete(`/admin/notices/${id}`);
      setNotices((p) => p.filter((n) => n._id !== id));
      showToast("Notice deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${
          toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">📢 Notices</h1>
        <p className="text-slate-400 text-sm mt-1">Post official notices — each can be downloaded as a formatted PDF</p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-700 mb-4">Post New Notice</h2>
        <form onSubmit={createNotice} className="space-y-3">
          <input
            type="text"
            placeholder="Notice Title / Subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition"
            required
          />
          <textarea
            placeholder="Notice body — write the full content here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition resize-none"
            required
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={posting}
              className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60"
            >
              {posting ? "Posting…" : "📢 Post Notice"}
            </button>
            <p className="text-xs text-slate-400">
              Each posted notice can be downloaded as a print-ready PDF with college letterhead.
            </p>
          </div>
        </form>
      </div>

      {/* Notice list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-700">All Notices ({notices.length})</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-800 border-t-transparent" />
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold">No notices yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notices.map((n) => (
              <div key={n._id} className="flex items-start gap-4 p-5 hover:bg-slate-50 transition">

                {/* Dot */}
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800">{n.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-xs text-slate-300">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString("en-IN", {
                            day:"numeric", month:"short", year:"numeric",
                            hour:"2-digit", minute:"2-digit", hour12:true,
                          })
                        : ""}
                    </p>
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                      NOC-{n._id?.slice(-4).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => downloadNoticePDF(n)}
                    title="Download PDF"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
                  >
                    <PDFIcon /> PDF
                  </button>
                  <button
                    onClick={() => deleteNotice(n._id)}
                    title="Delete"
                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;