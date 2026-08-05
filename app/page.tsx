export default function Page() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>משק בית · מעקב בטיחות</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.js"></script>
<style>
  :root{
    --charcoal:#1C1F22;
    --charcoal-2:#24282C;
    --charcoal-3:#2E3338;
    --paper:#EDEDE9;
    --paper-2:#E2E1DB;
    --yellow:#F5B700;
    --yellow-dark:#C99200;
    --blue:#3A6EA5;
    --green:#4C9A66;
    --green-bg:#E7F2EA;
    --red:#D64545;
    --red-bg:#FBEAEA;
    --gray:#8B9096;
    --line:#3A4046;
    --line-light:#D8D6CE;
    --page-bg:var(--paper);
    --surface:#fff;
    --surface-alt:var(--paper-2);
    --text:var(--charcoal);
    --border:var(--line-light);
  }
  [data-theme="dark"]{
    --page-bg:#15171A;
    --surface:#20242A;
    --surface-alt:#262B32;
    --text:#EAE8E1;
    --gray:#9AA0A8;
    --border:#343A42;
    --paper-2:#262B32;
    --line-light:#343A42;
    --green-bg:#1E3226;
    --red-bg:#3A2222;
  }
  [data-theme="dark"] .scan-instruction,
  [data-theme="dark"] .asset-meta div,
  [data-theme="dark"] .camera-status,
  [data-theme="dark"] .pf-btn,
  [data-theme="dark"] td.mono-cell,
  [data-theme="dark"] .modal-meta,
  [data-theme="dark"] .drill-row-loc{ color:var(--gray); }
  [data-theme="dark"] td{ color:var(--text); }
  [data-theme="dark"] .qr-code, [data-theme="dark"] .qr-label-qr{ background:#fff; }
  [data-theme="dark"] .scan-instruction b,
  [data-theme="dark"] .alert-title-wrap h3,
  [data-theme="dark"] .btn.ghost,
  [data-theme="dark"] .modal-close{ color:var(--text); }
  [data-theme="dark"] .btn.ghost:hover{ background:var(--charcoal); color:var(--paper); }
  [data-theme="dark"] .landing-btn.admin{ border-color:var(--border); }

  *{box-sizing:border-box;margin:0;padding:0;}
  html{ direction:rtl; }
  body{ font-family:'Heebo',sans-serif; background:var(--page-bg); color:var(--text); -webkit-font-smoothing:antialiased; direction:rtl; transition:background .2s, color .2s; }
  .mono{ font-family:'IBM Plex Mono',monospace; }
  .ltr{ direction:ltr; unicode-bidi:isolate; }
  .disp{ font-family:'Heebo',sans-serif; font-weight:800; }

  .hazard{
    height:6px;
    background:repeating-linear-gradient(45deg,var(--yellow) 0 10px,var(--charcoal) 10px 20px);
  }
  .hazard.thin{ height:4px; }

  #app{ min-height:100vh; display:flex; flex-direction:column; }

  .topbar{
    background:var(--charcoal); color:var(--paper);
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 24px;
  }
  .brand{ display:flex; flex-direction:column; gap:2px; }
  .brand .eyebrow{ font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.06em; color:var(--yellow); }
  .brand h1{ font-family:'Heebo',sans-serif; font-size:20px; font-weight:800; }

  .topbar-right{ display:flex; align-items:center; gap:10px; }
  .lang-select{
    background:var(--charcoal-2); color:var(--paper); border:1px solid var(--line); border-radius:6px;
    padding:8px 10px; font-family:'Heebo',sans-serif; font-size:12.5px; cursor:pointer;
  }
  .lang-select:focus{ outline:none; border-color:var(--yellow-dark); }
  .theme-toggle-btn{
    background:var(--charcoal-2); border:1px solid var(--line); color:var(--paper);
    width:34px; height:34px; border-radius:6px; font-size:15px; cursor:pointer;
    display:flex; align-items:center; justify-content:center; line-height:1;
  }
  .theme-toggle-btn:hover{ background:var(--charcoal-3); }

  .mode-toggle{ display:flex; background:var(--charcoal-2); border:1px solid var(--line); border-radius:3px; overflow:hidden; }
  .mode-toggle button{
    font-family:'Heebo',sans-serif; font-size:13px;
    padding:9px 18px; background:transparent; color:var(--gray); border:none; cursor:pointer; font-weight:700;
    transition:background .15s, color .15s;
  }
  .mode-toggle button.active{ background:var(--yellow); color:var(--charcoal); }
  .mode-toggle button:not(.active):hover{ color:var(--paper); }
  .topbar-home-btn{
    background:transparent; border:1px solid var(--line); color:var(--gray);
    font-family:'Heebo',sans-serif; font-size:11.5px; font-weight:600;
    padding:8px 12px; border-radius:6px; cursor:pointer; white-space:nowrap;
  }
  .topbar-home-btn:hover{ background:var(--charcoal-2); color:var(--paper); border-color:var(--charcoal-2); }

  main{ flex:1; }
  .field-wrap{ display:flex; justify-content:center; padding:36px 16px 60px; }
  .landing-wrap{ display:flex; justify-content:center; align-items:center; min-height:70vh; padding:36px 16px; }
  .landing-card{
    background:var(--surface); border:1px solid var(--line-light); border-radius:16px; padding:32px 28px;
    max-width:400px; width:100%; text-align:center; box-shadow:0 20px 50px -20px rgba(0,0,0,0.15);
  }
  .landing-eyebrow{
    display:inline-block; font-family:'Heebo',sans-serif; font-weight:700; font-size:14px;
    color:var(--charcoal); letter-spacing:0.02em; margin-bottom:22px;
    background:var(--yellow); padding:8px 18px; border-radius:20px;
  }
  .landing-buttons{ display:flex; flex-direction:column; gap:14px; }
  .landing-btn{
    display:flex; flex-direction:column; align-items:center; gap:4px;
    padding:22px 16px; border-radius:12px; border:2px solid var(--line-light); background:var(--surface); cursor:pointer;
    transition:transform .12s, box-shadow .12s, border-color .12s;
  }
  .landing-btn:hover{ transform:translateY(-2px); box-shadow:0 10px 24px -12px rgba(0,0,0,0.25); }
  .landing-btn.field{ border-color:var(--yellow-dark); }
  .landing-btn.field:hover{ background:#FFFBF0; }
  .landing-btn.admin{ border-color:var(--charcoal); }
  .landing-btn.admin:hover{ background:var(--surface-alt); }
  .landing-btn.supervisor{ border-color:var(--blue); }
  .landing-btn.supervisor:hover{ background:var(--surface-alt); }
  .landing-icon{ font-size:30px; }
  .landing-title{ font-family:'Heebo',sans-serif; font-weight:800; font-size:16px; }
  .landing-sub{ font-size:11.5px; color:var(--gray); }
</style>
</head>
<body>
<div id="app">
  <header class="topbar">
    <div class="brand">
      <span class="eyebrow">SYSTEM // HOUSEHOLD</span>
      <h1>משק בית · מעקב בטיחות</h1>
    </div>
  </header>
  <main>
    <div class="landing-wrap">
      <div class="landing-card">
        <span class="landing-eyebrow">מערכת בטיחות וניהול</span>
        <div class="landing-buttons">
          <div class="landing-btn field">
            <span class="landing-icon">🛡️</span>
            <span class="landing-title">כניסת צוות שטח</span>
            <span class="landing-sub">סריקת פריטים ובדיקות תקופתיות</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
</body>
</html>
        `,
      }}
    />
  );
}
