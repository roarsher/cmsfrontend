const downloadNoticePDF = (notice) => {
  const createdAt  = notice.createdAt ? new Date(notice.createdAt) : new Date();
  const postedDate = createdAt.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
  const postedTime = createdAt.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
  const printedOn  = new Date().toLocaleString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:true });
  const refNo      = `NOC/${createdAt.getFullYear()}/${String(notice._id).slice(-6).toUpperCase()}`;

  const html = `<!DOCTYPE html><html><head><title>Notice — ${notice.title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:"Times New Roman",Times,serif;color:#111;padding:52px 60px;font-size:14px;line-height:1.7}
    .lh{text-align:center;padding-bottom:16px;margin-bottom:8px}
    .lh-name{font-size:24px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}
    .lh-sub{font-size:13px;color:#444;margin-top:3px}
    .lh-addr{font-size:12px;color:#666;margin-top:2px}
    .lh-line{margin:14px 0 0;border:none;border-top:4px double #111}
    .notice-box{text-align:center;margin:22px 0 20px}
    .notice-box span{display:inline-block;border:2px solid #111;padding:5px 36px;font-size:16px;font-weight:700;letter-spacing:4px;text-transform:uppercase}
    .meta-row{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:20px}
    .subject{background:#f5f5f5;border-left:4px solid #111;padding:10px 16px;margin-bottom:22px;border-radius:0 4px 4px 0}
    .subject-label{font-size:10px;font-weight:700;text-transform:uppercase;color:#666;letter-spacing:.5px;margin-bottom:4px}
    .subject-text{font-size:16px;font-weight:700}
    .body-label{font-size:10px;font-weight:700;text-transform:uppercase;color:#666;letter-spacing:.5px;margin-bottom:10px}
    .body-text{font-size:14px;line-height:2;white-space:pre-wrap;word-break:break-word;text-align:justify}
    .sig{margin-top:56px;display:flex;justify-content:space-between;align-items:flex-end}
    .sig-left{font-size:12.5px;color:#444;max-width:60%}
    .sig-right{text-align:center}
    .sig-line{border-top:1px solid #111;width:210px;margin-bottom:7px}
    .sig-name{font-size:13px;font-weight:700}
    .sig-title{font-size:11px;color:#666;margin-top:2px}
    .footer{margin-top:40px;border-top:1px solid #ccc;padding-top:10px;display:flex;justify-content:space-between;font-size:10px;color:#888}
  </style></head><body>
  <div class="lh">
    <div class="lh-name">Bihar College of Engineering, Bhagalpur</div>
    <div class="lh-sub">Estd. 1960 &nbsp;|&nbsp; Affiliated to BEU</div>
    <div class="lh-addr">Sabour, Bhagalpur, Bihar – 813210 &nbsp;|&nbsp; Tel: (0641) 2502345</div>
    <hr class="lh-line">
  </div>
  <div class="notice-box"><span>Notice</span></div>
  <div class="meta-row">
    <div>
      <div><strong>Ref. No.:</strong>&nbsp;${refNo}</div>
      <div><strong>Date:</strong>&nbsp;${postedDate}</div>
      <div><strong>Time:</strong>&nbsp;${postedTime}</div>
    </div>
    <div style="text-align:right"><div>Office of the Registrar</div><div>BCE Bhagalpur</div></div>
  </div>
  <div class="subject">
    <div class="subject-label">Subject</div>
    <div class="subject-text">${notice.title}</div>
  </div>
  <div class="body-label">Notice</div>
  <div class="body-text">${notice.message}</div>
  <div class="sig">
    <div class="sig-left">All students, faculty, and staff are informed accordingly.<br>Strict compliance is expected.</div>
    <div class="sig-right">
      <div class="sig-line"></div>
      <div class="sig-name">Registrar / Principal</div>
      <div class="sig-title">Bihar College of Engineering, Bhagalpur</div>
    </div>
  </div>
  <div class="footer">
    <span>Ref: ${refNo}</span>
    <span>Printed on: ${printedOn}</span>
    <span>BCE ERP System — computer generated</span>
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  if (!win) { alert("Please allow pop-ups to download the PDF."); return; }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
};

export default downloadNoticePDF;