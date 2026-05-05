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

 // src/pages/admin/Notices.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

// ─────────────────────────────────────────────────────────────────────────────
// PDF generator — called when admin clicks "Download PDF" on any notice
// ─────────────────────────────────────────────────────────────────────────────
const downloadNoticePDF = (notice) => {
  const createdAt   = notice.createdAt ? new Date(notice.createdAt) : new Date();
  const postedDate  = createdAt.toLocaleDateString("en-IN", {
    weekday:"long", day:"numeric", month:"long", year:"numeric",
  });
  const postedTime  = createdAt.toLocaleTimeString("en-IN", {
    hour:"2-digit", minute:"2-digit", hour12:true,
  });
  const printedOn   = new Date().toLocaleString("en-IN", {
    day:"numeric", month:"short", year:"numeric",
    hour:"2-digit", minute:"2-digit", hour12:true,
  });
  const refNo = `NOC/${createdAt.getFullYear()}/${String(notice._id).slice(-6).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Notice — ${notice.title}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: "Times New Roman", Times, serif;
      color: #111;
      padding: 52px 60px;
      font-size: 14px;
      line-height: 1.7;
    }

    /* ── College letterhead ── */
    .lh { text-align:center; padding-bottom:16px; margin-bottom:8px; }
    .lh-name {
      font-size: 24px; font-weight: 900; letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .lh-sub  { font-size: 13px; color: #444; margin-top: 3px; }
    .lh-addr { font-size: 12px; color: #666; margin-top: 2px; }
    .lh-line {
      margin: 14px 0 0;
      border: none;
      border-top: 4px double #111;
    }

    /* ── NOTICE title box ── */
    .notice-box {
      text-align: center; margin: 22px 0 20px;
    }
    .notice-box span {
      display: inline-block;
      border: 2px solid #111;
      padding: 5px 36px;
      font-size: 16px; font-weight: 700; letter-spacing: 4px;
      text-transform: uppercase;
    }

    /* ── Ref / date row ── */
    .meta-row {
      display: flex; justify-content: space-between;
      font-size: 12.5px; margin-bottom: 20px;
    }

    /* ── Subject block ── */
    .subject {
      background: #f5f5f5;
      border-left: 4px solid #111;
      padding: 10px 16px;
      margin-bottom: 22px;
      border-radius: 0 4px 4px 0;
    }
    .subject-label {
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; color: #666;
      letter-spacing: .5px; margin-bottom: 4px;
    }
    .subject-text { font-size: 16px; font-weight: 700; }

    /* ── Body ── */
    .body-label {
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; color: #666;
      letter-spacing: .5px; margin-bottom: 10px;
    }
    .body-text {
      font-size: 14px; line-height: 2;
      white-space: pre-wrap; word-break: break-word;
      text-align: justify;
    }

    /* ── Signature ── */
    .sig {
      margin-top: 56px;
      display: flex; justify-content: space-between; align-items: flex-end;
    }
    .sig-left { font-size: 12.5px; color: #444; max-width: 60%; }
    .sig-right { text-align: center; }
    .sig-line {
      border-top: 1px solid #111; width: 210px; margin-bottom: 7px;
    }
    .sig-name  { font-size: 13px; font-weight: 700; }
    .sig-title { font-size: 11px; color: #666; margin-top: 2px; }

    /* ── Footer ── */
    .footer {
      margin-top: 40px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
      display: flex; justify-content: space-between;
      font-size: 10px; color: #888;
    }

    @media print { body { padding: 30px 40px; } }
  </style>
</head>
<body>

  <!-- Letterhead -->
  <div class="lh">
    <div class="lh-name">Bihar College of Engineering, Bhagalpur</div>
    <div class="lh-sub">Estd. 1960 &nbsp;|&nbsp; Affiliated to TNAU &nbsp;|&nbsp; NAAC Accredited</div>
    <div class="lh-addr">Sabour, Bhagalpur, Bihar – 813210 &nbsp;|&nbsp; Tel: (0641) 2502345</div>
    <hr class="lh-line">
  </div>

  <!-- NOTICE label -->
  <div class="notice-box"><span>Notice</span></div>

  <!-- Ref + date -->
  <div class="meta-row">
    <div>
      <div><strong>Ref. No.:</strong>&nbsp; ${refNo}</div>
      <div><strong>Date:</strong>&nbsp; ${postedDate}</div>
      <div><strong>Time:</strong>&nbsp; ${postedTime}</div>
    </div>
    <div style="text-align:right">
      <div>Office of the Registrar</div>
      <div>BCE Bhagalpur</div>
    </div>
  </div>

  <!-- Subject -->
  <div class="subject">
    <div class="subject-label">Subject</div>
    <div class="subject-text">${notice.title}</div>
  </div>

  <!-- Body -->
  <div class="body-label">Notice</div>
  <div class="body-text">${notice.message}</div>

  <!-- Signature -->
  <div class="sig">
    <div class="sig-left">
      All students, faculty, and staff are informed accordingly.<br>
      Strict compliance is expected.
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
    <span>Printed on: ${printedOn}</span>
    <span>BCE ERP System — computer generated</span>
  </div>

</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) { alert("Please allow pop-ups to download the PDF."); return; }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
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
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch — handles array OR { notices:[...] } response shapes ────────────
  useEffect(() => {
    API.get("/admin/notices")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data))          setNotices(data);
        else if (Array.isArray(data?.notices)) setNotices(data.notices);
        else                               setNotices([]);
      })
      .catch((err) => console.error("Notices fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── Post notice ───────────────────────────────────────────────────────────
  const handlePost = async () => {
    if (!title.trim() || !message.trim())
      return showToast("Fill both title and message.", "error");
    setPosting(true);
    try {
      const res = await API.post("/admin/notices", { title: title.trim(), message: message.trim() });
      // Backend may return the notice directly or in { notice: {} }
      const saved = res.data?.notice || res.data;
      // Ensure createdAt exists for PDF (backend may omit it)
      const withDate = { createdAt: new Date().toISOString(), ...saved };
      setNotices((prev) => [withDate, ...prev]);
      setTitle("");
      setMessage("");
      showToast("Notice posted successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to post notice.", "error");
    } finally {
      setPosting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice permanently?")) return;
    try {
      await API.delete(`/admin/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
      showToast("Notice deleted.");
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  // ── Format date ───────────────────────────────────────────────────────────
  const fmtDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-IN", {
      day:"numeric", month:"short", year:"numeric",
      hour:"2-digit", minute:"2-digit", hour12:true,
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm transition-all ${
          toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">📢 Notices</h1>
        <p className="text-slate-400 text-sm mt-1">
          Post official college notices. Each notice can be downloaded as a print-ready PDF with college letterhead.
        </p>
      </div>

      {/* ── Post form ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-700">Post New Notice</h2>

        <input
          type="text"
          placeholder="Notice Title / Subject"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition"
        />

        <textarea
          placeholder="Write the full notice content here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition resize-none"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handlePost}
            disabled={posting}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60 flex items-center gap-2"
          >
            {posting
              ? <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> Posting…</>
              : "📢 Post Notice"
            }
          </button>
          <p className="text-xs text-slate-400">
            A reference number is auto-generated. Each notice can be downloaded as a formatted PDF.
          </p>
        </div>
      </div>

      {/* ── Notice list ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-700">
            All Notices
            <span className="ml-2 text-sm font-normal text-slate-400">({notices.length})</span>
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-800 border-t-transparent" />
          </div>
        )}

        {/* Empty */}
        {!loading && notices.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-slate-600">No notices yet</p>
            <p className="text-sm mt-1">Post your first notice using the form above.</p>
          </div>
        )}

        {/* List */}
        {!loading && notices.length > 0 && (
          <div className="divide-y divide-slate-50">
            {notices.map((n) => (
              <div key={n._id} className="flex items-start gap-4 p-5 hover:bg-slate-50 transition group">

                {/* amber dot */}
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />

                {/* content */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm">{n.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 whitespace-pre-wrap">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs text-slate-300">{fmtDate(n.createdAt)}</span>
                    {n._id && (
                      <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        NOC/{new Date(n.createdAt || Date.now()).getFullYear()}/{String(n._id).slice(-6).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* action buttons */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* PDF download */}
                  <button
                    onClick={() => downloadNoticePDF(n)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
                    title="Download as PDF"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                    PDF
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
                    </svg>
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