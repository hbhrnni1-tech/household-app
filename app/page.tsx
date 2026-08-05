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
    /* theme-aware surfaces (light mode = default) */
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

  /* ---- App shell ---- */
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

  /* ================= FIELD VIEW ================= */
  .field-wrap{ display:flex; justify-content:center; padding:36px 16px 60px; }

  /* ---- Landing & admin lock ---- */
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

  .lock-card{ padding:36px 28px; }
  .lock-title{ font-family:'Heebo',sans-serif; font-weight:800; font-size:19px; margin-bottom:18px; }
  .lock-input-wrap{ position:relative; }
  .lock-input{
    width:100%; text-align:center; font-size:22px; letter-spacing:0.3em; padding:14px 44px;
    border:2px solid var(--line-light); border-radius:10px; font-family:'IBM Plex Mono',monospace;
  }
  .lock-input:focus{ outline:none; border-color:var(--yellow-dark); }
  .lock-eye-btn{
    position:absolute; top:50%; left:8px; transform:translateY(-50%);
    background:none; border:none; font-size:18px; cursor:pointer; padding:6px; line-height:1;
    opacity:0.7;
  }
  .lock-eye-btn:hover{ opacity:1; }
  .lock-error{ color:var(--red); font-size:12.5px; font-weight:600; margin-top:10px; }
  .lock-card .back-link{ display:inline-flex; }

  .worker-form{ display:flex; flex-direction:column; gap:12px; text-align:right; }
  .worker-input{
    width:100%; padding:11px 12px; border:1.5px solid var(--line-light); border-radius:8px;
    font-size:14px; font-family:'Heebo',sans-serif;
  }
  .worker-input:focus{ outline:none; border-color:var(--yellow-dark); }
  .phone{
    width:390px; max-width:100%;
    background:var(--charcoal-2); border-radius:26px; padding:10px;
    box-shadow:0 30px 60px -20px rgba(0,0,0,0.45);
  }
  .phone-screen{
    background:var(--surface-alt); border-radius:18px; min-height:640px;
    display:flex; flex-direction:column; overflow:hidden;
  }
  .field-header{
    background:var(--charcoal); color:var(--paper); padding:16px 18px 14px;
  }
  .field-header-top{ display:flex; justify-content:flex-end; margin-bottom:10px; }
  .entry-back-btn{
    background:rgba(255,255,255,0.08); border:1px solid var(--line); color:#b8bcc1;
    font-size:10.5px; font-family:'Heebo',sans-serif; padding:5px 12px; border-radius:14px; cursor:pointer;
  }
  .entry-back-btn:hover{ background:rgba(255,255,255,0.15); color:#fff; }
  .field-header .eyebrow{ font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:0.08em; color:var(--yellow); }
  .field-header h2{ font-family:'Heebo',sans-serif; font-weight:700; font-size:17px; margin-top:2px;}
  .inspector-row{ margin-top:10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .inspector-badge{
    background:var(--charcoal-2); border:1px solid var(--line); color:var(--paper);
    padding:5px 10px; border-radius:20px; font-size:11px; font-family:'Heebo',sans-serif;
  }

  .field-body{ flex:1; padding:18px; display:flex; flex-direction:column; gap:14px; }

  .scan-instruction{ font-size:12px; color:#5c6167; text-align:center; padding:4px 8px 0; line-height:1.6;}
  .scan-instruction b{ color:var(--charcoal); }

  .qr-grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  .folder-grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .folder-tile{
    background:var(--surface); border:1px solid var(--line-light); border-radius:10px;
    padding:20px 12px; text-align:center; cursor:pointer; transition:transform .1s, box-shadow .1s;
  }
  .folder-tile:hover{ transform:translateY(-2px); box-shadow:0 8px 18px -8px rgba(0,0,0,0.25); border-color:var(--yellow-dark); }
  .folder-icon{ font-size:32px; margin-bottom:8px; }
  .folder-name{ font-size:12.5px; font-weight:700; line-height:1.3; }
  .folder-count{ font-size:10.5px; color:var(--gray); margin-top:4px; }
  .folder-tile.obs-folder{ border-color:var(--blue); grid-column:1/-1; }
  .folder-tile.obs-folder:hover{ background:#EEF3F8; }
  .folder-count.obs-open{ color:var(--yellow-dark); font-weight:700; }
  .folder-count.obs-met{ color:var(--green); font-weight:700; }

  .obs-progress-banner{
    background:#FFF9E9; border:1px solid #EAD9A0; border-radius:8px; padding:12px 14px;
    font-size:12.5px; text-align:center; color:#5c4a10;
  }
  .obs-progress-banner.met{ background:var(--green-bg); border-color:var(--green); color:var(--green); }
  [data-theme="dark"] .obs-progress-banner{ background:#332B12; color:#E8D9A8; }

  .obs-recent-section{ border-top:1px solid var(--line-light); padding-top:12px; }
  .obs-recent-row{
    display:flex; align-items:center; justify-content:space-between; gap:8px;
    background:var(--surface-alt); border-radius:6px; padding:8px 10px; font-size:12px; margin-bottom:6px;
  }
  .obs-recent-name{ font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .qr-tile{
    background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:10px 10px 12px;
    cursor:pointer; text-align:center; transition:transform .1s, box-shadow .1s;
  }
  .qr-tile:hover{ transform:translateY(-2px); box-shadow:0 8px 18px -8px rgba(0,0,0,0.25); border-color:var(--yellow-dark); }
  .qr-code{ width:76px; height:76px; margin:0 auto 8px; display:flex; align-items:center; justify-content:center; background:var(--surface); border:2px solid var(--charcoal); overflow:hidden; }
  .qr-code img, .qr-code canvas{ width:100%; height:100%; }
  .qr-tile .a-name{ font-size:12px; font-weight:600; line-height:1.3; }
  .qr-tile .a-id{ font-family:'IBM Plex Mono',monospace; font-size:9.5px; color:var(--gray); margin-top:2px; direction:ltr; }
  .qr-tile .a-status{ display:inline-block; margin-top:6px; font-size:10px; font-family:'Heebo',sans-serif; font-weight:600; padding:2px 9px; border-radius:20px; }
  .st-pending{ background:#EFE9DA; color:#8a6d1f; }
  .st-pass{ background:var(--green-bg); color:var(--green); }
  .st-fail{ background:var(--red-bg); color:var(--red); }
  .st-resolved{ background:#E8F0F8; color:var(--blue); }

  .scan-btn{
    margin-top:6px; background:var(--yellow); color:var(--charcoal); border:none; border-radius:8px;
    padding:14px; font-family:'Heebo',sans-serif;
    font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .scan-btn:hover{ background:var(--yellow-dark); }
  .scan-btn .dot{ width:8px; height:8px; border-radius:50%; background:var(--charcoal); animation:pulse 1.4s infinite; }
  @keyframes pulse{ 0%,100%{opacity:1;} 50%{opacity:.25;} }

  /* inspection form */
  .asset-card{ background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:14px 16px; }
  .asset-card .a-type{ font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:0.06em; color:var(--yellow-dark); }
  .asset-card h3{ font-family:'Heebo',sans-serif; font-weight:700; font-size:18px; margin-top:3px; }
  .asset-meta{ margin-top:8px; display:flex; flex-direction:column; gap:4px; }
  .asset-meta div{ font-size:12px; color:#565b61; display:flex; justify-content:space-between; }
  .asset-meta span.k{ color:var(--gray); font-family:'Heebo',sans-serif; font-size:11px; font-weight:600; }

  .scan-btn.camera{ background:var(--charcoal); color:var(--paper); border-top:none; margin-bottom:0; }
  .scan-btn.camera:hover{ background:#000; }

  .camera-wrap{ position:relative; border-radius:12px; overflow:hidden; background:#000; aspect-ratio:3/4; }
  .camera-wrap video{ width:100%; height:100%; object-fit:cover; display:block; }
  .camera-frame{ position:absolute; inset:15%; border:3px solid var(--yellow); border-radius:16px; pointer-events:none; box-shadow:0 0 0 2000px rgba(0,0,0,0.35); }
  .camera-status{ text-align:center; font-size:12.5px; color:#565b61; padding:4px 8px; min-height:34px; }

  .result-summary{ border-radius:8px; padding:12px 14px; font-size:13px; font-weight:600; text-align:center; }
  .result-summary.ok{ background:var(--green-bg); color:var(--green); }
  .result-summary.bad{ background:var(--red-bg); color:var(--red); }
  .result-summary.wait{ background:var(--paper-2); color:var(--gray); font-weight:500; }

  .chk-row-v2{ padding:10px 0; border-top:1px solid #F0E4C0; display:flex; flex-direction:column; gap:8px; }
  .chk-row-v2:first-of-type{ border-top:none; }
  .chk-row-text{ font-size:12.5px; line-height:1.4; color:#4a4530; }
  .chk-row-actions{ display:flex; gap:8px; }
  .chk-mini{
    flex:1; padding:8px 0; border-radius:6px; border:1.5px solid #D9CB98; background:var(--surface);
    font-family:'Heebo',sans-serif; font-size:12px; font-weight:700; color:#7a7250; cursor:pointer;
  }
  .chk-mini.pass.sel{ background:var(--green-bg); border-color:var(--green); color:var(--green); }
  .chk-mini.fail.sel{ background:var(--red-bg); border-color:var(--red); color:var(--red); }
  .chk-photo-btn{
    align-self:flex-start; background:var(--surface); border:1px dashed var(--red); color:var(--red); border-radius:6px;
    padding:6px 10px; font-family:'Heebo',sans-serif; font-size:11.5px; font-weight:600; cursor:pointer;
  }
  .chk-photo-btn.on{ border-style:solid; background:var(--red-bg); }
  .chk-photo-row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .chk-photo-thumb{ width:40px; height:40px; border-radius:6px; object-fit:cover; border:1.5px solid var(--red); }
  .chk-photo-remove{
    background:var(--surface); border:1px solid var(--line-light); color:var(--gray); border-radius:50%;
    width:22px; height:22px; font-size:11px; cursor:pointer; line-height:1;
  }
  .chk-photo-remove:hover{ color:var(--red); border-color:var(--red); }

  .field-label{ font-family:'Heebo',sans-serif; font-size:11px; font-weight:700; color:var(--gray); margin-bottom:8px; display:block; }
  .lock-note{ color:var(--red); font-weight:600; font-size:10.5px; }

  .checklist-box{ background:#FFF9E9; border:1px solid #EAD9A0; border-radius:8px; padding:12px 14px 6px; }
  .checklist-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .checklist-count{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--yellow-dark); font-weight:600; }
  .check-row{ display:flex; align-items:flex-start; gap:9px; padding:7px 0; cursor:pointer; border-top:1px solid #F0E4C0; }
  .check-row:first-of-type{ border-top:none; }
  .check-row input[type="checkbox"]{ position:absolute; opacity:0; width:0; height:0; }
  .check-box{
    width:18px; height:18px; border:1.5px solid #C9B063; border-radius:4px; flex-shrink:0; margin-top:1px;
    display:flex; align-items:center; justify-content:center; font-size:12px; color:#fff; background:var(--surface);
  }
  .check-row input:checked + .check-box{ background:var(--green); border-color:var(--green); }
  .check-text{ font-size:12.5px; line-height:1.4; color:#4a4530; }

  .pf-row{ display:flex; gap:10px; }
  .pf-btn{
    flex:1; padding:16px 0; border-radius:8px; border:2px solid var(--line-light); background:var(--surface);
    font-family:'Heebo',sans-serif; font-size:14px; font-weight:700;
    cursor:pointer; color:#565b61; transition:all .12s;
  }
  .pf-btn.pass.sel{ background:var(--green-bg); border-color:var(--green); color:var(--green); }
  .pf-btn.fail.sel{ background:var(--red-bg); border-color:var(--red); color:var(--red); }

  textarea.comment{
    width:100%; resize:vertical; min-height:64px; border:1px solid var(--line-light); border-radius:6px;
    padding:10px; font-family:'Heebo',sans-serif; font-size:13px;
  }

  .photo-toggle{
    display:flex; align-items:center; gap:10px; border:1px dashed var(--line-light); border-radius:6px; padding:10px 12px;
    cursor:pointer; font-size:12.5px; color:#565b61;
  }
  .photo-toggle.on{ border-color:var(--blue); background:#EEF3F8; color:var(--blue); border-style:solid; }
  .photo-toggle .box{ width:16px; height:16px; border:1.5px solid currentColor; border-radius:3px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px;}

  .submit-btn{
    background:var(--charcoal); color:var(--paper); border:none; border-radius:8px; padding:15px;
    font-family:'Heebo',sans-serif; font-size:14px; font-weight:700; cursor:pointer;
    border-top:4px solid var(--yellow);
  }
  .submit-btn:disabled{ opacity:0.4; cursor:not-allowed; }
  .submit-btn:not(:disabled):hover{ background:#000; }

  .back-link{
    font-size:12.5px; font-weight:700; color:var(--charcoal); cursor:pointer;
    display:inline-flex; align-items:center; gap:6px;
    background:var(--yellow); padding:8px 14px; border-radius:20px;
    border:1px solid var(--yellow-dark);
  }
  .back-link:hover{ background:var(--yellow-dark); }

  .toast{
    position:fixed; bottom:26px; left:50%; transform:translateX(-50%) translateY(12px); opacity:0;
    background:var(--charcoal); color:var(--paper); padding:12px 20px; border-radius:8px; font-size:13.5px;
    display:flex; align-items:center; gap:10px; box-shadow:0 12px 30px -10px rgba(0,0,0,0.5); pointer-events:none;
    transition:opacity .2s, transform .2s; z-index:50; border-right:4px solid var(--green);
  }
  .toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }
  .toast.fail-toast{ border-right-color:var(--red); }

  /* ================= ADMIN VIEW ================= */
  .admin-wrap{ display:flex; min-height:calc(100vh - 58px); }
  .sidebar{ width:200px; background:var(--charcoal); color:var(--paper); flex-shrink:0; padding:18px 0; }
  .sidebar .s-item{
    padding:11px 20px; font-family:'Heebo',sans-serif; font-size:13.5px;
    cursor:pointer; color:#a7abaf; border-right:3px solid transparent; font-weight:700;
  }
  .sidebar .s-item:hover{ color:var(--paper); }
  .sidebar .s-item.active{ color:var(--paper); border-right-color:var(--yellow); background:var(--charcoal-2); }

  .admin-content{ flex:1; padding:28px 32px 60px; max-width:1180px; }
  .readonly-banner{
    background:#E8F0F8; border:1px solid var(--blue); color:var(--blue); border-radius:8px;
    padding:10px 16px; font-size:12.5px; font-weight:600; margin-bottom:18px;
  }
  .admin-content h2.page-title{ font-family:'Heebo',sans-serif; font-weight:800; font-size:22px; margin-bottom:4px; }
  .page-sub{ font-size:13px; color:var(--gray); margin-bottom:22px; }

  .cards-row{ display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:16px; margin-bottom:30px; }
  .prog-card{ background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:16px 18px; position:relative; overflow:hidden;}
  .prog-card .cat-name{ font-family:'Heebo',sans-serif; font-weight:700; font-size:14.5px; }
  .prog-card .cat-freq{ font-family:'Heebo',sans-serif; font-size:11px; color:var(--gray); margin-top:2px; }
  .prog-card .cat-num{ font-family:'Heebo',sans-serif; font-weight:800; font-size:30px; margin-top:12px; }
  .prog-card .cat-num span{ font-size:14px; color:var(--gray); font-weight:500; }
  .prog-bar-bg{ height:7px; background:var(--paper-2); border-radius:20px; margin-top:10px; overflow:hidden; }
  .prog-bar-fill{ height:100%; background:var(--yellow); border-radius:20px; transition:width .3s; }
  .prog-bar-fill.complete{ background:var(--green); }

  .compliance-strip{ display:flex; gap:2px; margin-top:12px; }
  .compliance-col{ flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; min-width:0; }
  .compliance-cell{ width:100%; height:8px; border-radius:2px; cursor:default; }
  .compliance-cell.compliance-gray{ background:var(--paper-2); }
  .compliance-cell.compliance-green{ background:var(--green); }
  .compliance-cell.compliance-yellow{ background:var(--yellow); }
  .compliance-cell.compliance-red{ background:var(--red); }
  [data-theme="dark"] .compliance-cell.compliance-gray{ background:var(--charcoal-3); }
  .compliance-label{
    font-size:6.5px; color:var(--gray); font-family:'Heebo',sans-serif; font-weight:600;
    line-height:1; white-space:nowrap; overflow:hidden; text-overflow:clip;
  }

  .alert-panel{
    background:var(--surface); border:1px solid var(--red); border-right:6px solid var(--red); border-radius:8px;
    padding:16px 18px 18px; margin-bottom:28px; box-shadow:0 6px 18px -12px rgba(214,69,69,0.35);
  }
  .alert-head{ margin-bottom:12px; }
  .alert-title-wrap{ display:flex; align-items:center; gap:10px; }
  .alert-title-wrap h3{ font-family:'Heebo',sans-serif; font-weight:700; font-size:15.5px; color:var(--charcoal); }
  .alert-badge{
    background:var(--red); color:#fff; font-family:'Heebo',sans-serif; font-weight:800; font-size:13px;
    min-width:24px; height:24px; border-radius:20px; display:flex; align-items:center; justify-content:center; padding:0 7px;
  }
  .alert-badge.cycle{ background:var(--yellow-dark); font-size:14px; }
  .alert-panel.cycle-alert{ border-color:var(--yellow-dark); box-shadow:0 6px 18px -12px rgba(201,146,0,0.35); }
  .cycle-alert-list{ display:flex; flex-direction:column; gap:8px; }
  .cycle-alert-row{
    display:flex; align-items:center; justify-content:space-between; gap:10px;
    background:#FFF9E9; border-radius:7px; padding:11px 14px; font-size:12.5px; color:#5c4a10;
  }
  [data-theme="dark"] .cycle-alert-row{ background:#332B12; color:#E8D9A8; }
  .cycle-alert-row.clickable-row:hover{ background:#FDF0CC; }
  [data-theme="dark"] .cycle-alert-row.clickable-row:hover{ background:#3D341A; }
  .cycle-alert-arrow{ flex-shrink:0; opacity:0.6; }

  .section-head{ display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:12px; }

  .asset-search-wrap{ position:relative; flex:1; min-width:220px; max-width:360px; }
  .asset-search-icon{ position:absolute; top:50%; right:12px; transform:translateY(-50%); font-size:13px; opacity:0.5; pointer-events:none; }
  .asset-search-input{
    width:100%; padding:8px 36px 8px 30px; border:1px solid var(--line-light); border-radius:20px;
    font-family:'Heebo',sans-serif; font-size:12.5px; background:var(--surface); color:var(--text);
  }
  .asset-search-input:focus{ outline:none; border-color:var(--yellow-dark); }
  .asset-search-clear{
    position:absolute; top:50%; left:8px; transform:translateY(-50%);
    background:var(--paper-2); border:none; width:18px; height:18px; border-radius:50%;
    font-size:10px; cursor:pointer; color:var(--gray); line-height:1;
  }
  .asset-search-clear:hover{ color:var(--red); }
  .section-head h3{ font-family:'Heebo',sans-serif; font-weight:700; font-size:15.5px; }

  .btn{
    font-family:'Heebo',sans-serif; font-size:12.5px; font-weight:700;
    padding:9px 16px; border-radius:6px; border:1px solid var(--charcoal); background:var(--charcoal); color:var(--paper); cursor:pointer;
  }
  .btn:hover{ background:#000; }
  .btn.ghost{ background:transparent; color:var(--charcoal); }
  .btn.ghost:hover{ background:var(--charcoal); color:var(--paper); }
  .btn.yellow{ background:var(--yellow); color:var(--charcoal); border-color:var(--yellow); }
  .btn.yellow:hover{ background:var(--yellow-dark); border-color:var(--yellow-dark); }
  .btn.small{ padding:5px 10px; font-size:11px; }
  .btn.danger-o{ background:transparent; color:var(--red); border-color:var(--red); }
  .btn.danger-o:hover{ background:var(--red); color:#fff; }

  table{ width:100%; border-collapse:collapse; background:var(--surface); border:1px solid var(--line-light); border-radius:6px; overflow:hidden;}
  th{ text-align:right; font-family:'Heebo',sans-serif; font-size:11px; font-weight:700; color:var(--gray); padding:10px 12px; border-bottom:1px solid var(--line-light); background:var(--paper-2); }
  td{ padding:10px 12px; font-size:13px; border-bottom:1px solid #EEEDE7; vertical-align:middle; }
  tr:last-child td{ border-bottom:none; }
  td.mono-cell{ font-family:'IBM Plex Mono',monospace; font-size:12px; color:#555; direction:ltr; text-align:right; }
  .badge{ display:inline-block; font-family:'Heebo',sans-serif; font-size:11px; font-weight:600; padding:3px 9px; border-radius:20px; }

  .table-wrap{ margin-bottom:30px; overflow-x:auto; }

  .form-grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; background:var(--surface); border:1px solid var(--line-light); padding:16px; border-radius:8px; margin-bottom:20px;}
  .form-grid .full{ grid-column:1/-1; }
  .form-grid label{ font-family:'Heebo',sans-serif; font-size:11px; font-weight:700; color:var(--gray); display:block; margin-bottom:5px; }
  .form-grid input, .form-grid select{
    width:100%; padding:8px 10px; border:1px solid var(--line-light); border-radius:5px; font-size:13px; font-family:'Heebo',sans-serif;
  }
  .form-grid .actions{ grid-column:1/-1; display:flex; gap:10px; margin-top:4px; }

  .empty-state{ text-align:center; padding:40px 20px; color:var(--gray); font-size:13px; }

  .clickable-row{ cursor:pointer; transition:background .1s; }
  .clickable-row:hover{ background:var(--surface-alt); }

  .modal-backdrop{
    position:fixed; inset:0; background:rgba(28,31,34,0.55); z-index:100;
    display:flex; align-items:center; justify-content:center; padding:20px;
  }
  .modal-box{
    background:var(--surface); border-radius:12px; max-width:520px; width:100%; max-height:85vh; overflow-y:auto;
    padding:22px 24px; box-shadow:0 30px 60px -20px rgba(0,0,0,0.4);
  }
  .modal-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px; }
  .modal-eyebrow{ font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--yellow-dark); letter-spacing:0.04em; }
  .modal-head h3{ font-family:'Heebo',sans-serif; font-weight:700; font-size:17px; margin-top:2px; }
  .modal-close{ background:var(--paper-2); border:none; width:30px; height:30px; border-radius:50%; font-size:13px; cursor:pointer; color:var(--charcoal); flex-shrink:0; }
  .modal-close:hover{ background:var(--red-bg); color:var(--red); }
  .modal-meta{ display:flex; gap:14px; flex-wrap:wrap; font-size:12px; color:#565b61; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--line-light); }
  .modal-checklist{ display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
  .modal-chk-row{ display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:7px; background:var(--surface-alt); font-size:12.5px; }
  .modal-chk-row.ok{ background:var(--green-bg); }
  .modal-chk-row.bad{ background:var(--red-bg); }
  .modal-chk-icon{ font-weight:800; font-size:14px; flex-shrink:0; width:18px; text-align:center; }
  .modal-chk-row.ok .modal-chk-icon{ color:var(--green); }
  .modal-chk-row.bad .modal-chk-icon{ color:var(--red); }
  .modal-chk-text{ flex:1; }
  .modal-chk-thumb{ width:40px; height:40px; border-radius:6px; object-fit:cover; flex-shrink:0; }
  .modal-comment{ font-size:12.5px; background:var(--surface-alt); border-radius:7px; padding:10px 12px; line-height:1.6; }

  .drill-section{ margin-bottom:16px; }
  .drill-section:last-child{ margin-bottom:0; }
  .drill-section-title{ font-family:'Heebo',sans-serif; font-weight:700; font-size:12.5px; margin-bottom:8px; }
  .drill-section-title.ok{ color:var(--green); }
  .drill-section-title.wait{ color:var(--yellow-dark); }
  .drill-row{
    display:flex; align-items:center; justify-content:space-between; gap:10px;
    padding:9px 12px; border-radius:7px; background:var(--surface-alt); margin-bottom:6px; font-size:12.5px;
  }
  .drill-row:last-child{ margin-bottom:0; }
  .drill-row-main{ display:flex; flex-direction:column; gap:2px; min-width:0; }
  .drill-row-name{ font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .drill-row-id{ font-size:10.5px; color:var(--gray); }
  .drill-row-side{ display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .drill-row-date{ font-size:10.5px; color:var(--gray); }
  .drill-row-loc{ font-size:11.5px; color:#565b61; }

  .export-row{ display:flex; gap:12px; flex-wrap:wrap; margin-bottom:26px; }
  .export-card{ flex:1; min-width:180px; background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:16px; }
  .export-btn-row{ display:flex; gap:8px; flex-wrap:wrap; }

  .cat-export-list{ display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
  .cat-export-row{
    display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
    background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:12px 16px;
  }
  .cat-export-info{ display:flex; align-items:center; gap:10px; }
  .cat-export-icon{ font-size:20px; }
  .cat-export-actions{ display:flex; gap:6px; flex-wrap:wrap; }
  .cat-export-progress{ display:flex; flex-direction:column; align-items:center; flex-shrink:0; width:64px; }
  .cat-progress-badge{
    font-family:'IBM Plex Mono',monospace; font-weight:700; font-size:14px; color:var(--blue);
    background:#E8F0F8; padding:3px 10px; border-radius:20px;
  }
  [data-theme="dark"] .cat-progress-badge{ background:#1E2A38; }
  .cat-progress-label{ font-size:9.5px; color:var(--gray); margin-top:2px; }
  .export-card .ex-title{ font-family:'Heebo',sans-serif; font-weight:700; font-size:14px; margin-bottom:6px; }
  .export-card p{ font-size:12px; color:var(--gray); margin-bottom:12px; line-height:1.6; }

  .cat-list{ display:flex; flex-direction:column; gap:10px; margin-bottom:22px; }
  .cat-card{ background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:14px 16px 16px; }
  .cat-row{ display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; margin-bottom:10px; border-bottom:1px solid #EEEDE7; }
  .cat-row .c-left b{ font-family:'Heebo',sans-serif; font-weight:700; font-size:14px; }
  .cat-row .c-left div.mono{ font-size:11px; color:var(--gray); margin-top:2px; font-family:'Heebo',sans-serif; }
  .freq-select{ padding:6px 8px; border:1px solid var(--line-light); border-radius:5px; font-size:12.5px; font-family:'Heebo',sans-serif; }

  .chk-editor{ }
  .chk-list{ list-style:none; display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
  .chk-item{ display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--surface-alt); border-radius:5px; padding:7px 10px; font-size:12.5px; }
  .chk-item.empty{ color:var(--gray); justify-content:center; }
  .chk-del{ background:none; border:none; color:var(--gray); cursor:pointer; font-size:12px; padding:2px 6px; border-radius:4px; flex-shrink:0; }
  .chk-del:hover{ color:var(--red); background:var(--red-bg); }
  .chk-add-row{ display:flex; gap:8px; }
  .chk-add-input{ flex:1; padding:7px 10px; border:1px solid var(--line-light); border-radius:5px; font-size:12.5px; font-family:'Heebo',sans-serif; }

  .row-actions{ display:flex; gap:6px; flex-wrap:wrap; }

  .expiry-cell{ display:flex; flex-direction:column; align-items:flex-start; gap:4px; }
  .badge.exp-valid{ background:var(--green-bg); color:var(--green); }
  .badge.exp-soon{ background:#FFF3D6; color:#9A6B00; }
  .badge.exp-expired{ background:var(--red-bg); color:var(--red); }
  .badge.exp-none{ background:var(--paper-2); color:var(--gray); }
  .expiry-input{
    font-family:'IBM Plex Mono',monospace; font-size:11px; padding:4px 6px;
    border:1px solid var(--line-light); border-radius:5px; background:var(--surface); color:var(--text);
    direction:ltr; width:130px;
  }
  .expiry-input:disabled{ opacity:0.5; cursor:not-allowed; }

  /* ---- QR label printing ---- */
  #print-area{ display:none; }
  .print-sheet{ padding:8mm; }
  .print-sheet.grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:6mm; }
  .qr-label{ border:2px dashed #999; border-radius:4px; padding:6mm 5mm 5mm; text-align:center; break-inside:avoid; page-break-inside:avoid; }
  .qr-label-strip{ height:4mm; background:repeating-linear-gradient(45deg,#111 0 4mm,#F5B700 4mm 8mm); margin:-6mm -5mm 4mm; border-radius:2px 2px 0 0; }
  .qr-label-qr{ width:30mm; height:30mm; margin:0 auto 3mm; display:flex; align-items:center; justify-content:center; border:1.2mm solid #000; background:var(--surface); overflow:hidden; }
  .qr-label-qr img, .qr-label-qr canvas{ width:100%; height:100%; }
  .qr-label-name{ font-family:'Heebo',sans-serif; font-weight:700; font-size:11pt; }
  .qr-label-id{ font-family:'IBM Plex Mono',monospace; font-size:9pt; direction:ltr; margin-top:1mm; }
  .qr-label-cat{ font-size:8pt; color:#444; margin-top:1mm; }
  .qr-label-foot{ font-size:7pt; color:#777; margin-top:2mm; letter-spacing:0.02em; }

  .print-report{ padding:10mm; direction:rtl; }
  .print-report h1{ font-family:'Heebo',sans-serif; font-size:16pt; margin-bottom:3mm; }
  .print-report p{ font-size:9pt; color:#555; margin-bottom:6mm; }
  .print-report table{ width:100%; border-collapse:collapse; font-size:8.5pt; }
  .print-report th, .print-report td{ border:0.3mm solid #999; padding:2mm 2.5mm; text-align:right; }
  .print-report th{ background:#eee; font-family:'Heebo',sans-serif; }

  @media print{
    * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
    body > *:not(#print-area){ display:none !important; }
    #print-area{ display:block !important; }
  }

  ::selection{ background:var(--yellow); color:var(--charcoal); }
  @media(max-width:820px){
    .admin-wrap{ flex-direction:column; }
    .sidebar{ width:100%; display:flex; padding:6px; overflow-x:auto; }
    .sidebar .s-item{ border-right:none; border-bottom:3px solid transparent; white-space:nowrap; }
    .sidebar .s-item.active{ border-bottom-color:var(--yellow); background:transparent; }
    .form-grid{ grid-template-columns:1fr; }
    .topbar{ flex-wrap:wrap; gap:10px; }
    .topbar-right{ flex-wrap:wrap; }
  }
</style>
</head>
<body>

<div id="app">
  <div class="topbar">
    <div class="brand">
      <div class="eyebrow" id="app-eyebrow">דיגיטציה של תחזוקת בטיחות במפעל</div>
      <h1 id="app-title">משק בית &middot; מעקב בטיחות</h1>
    </div>
    <div class="topbar-right">
      <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle dark mode">🌙</button>
      <select id="lang-select" class="lang-select">
        <option value="he">🇮🇱 עברית</option>
        <option value="en">🇬🇧 English</option>
        <option value="ru">🇷🇺 Русский</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
      <div class="mode-toggle">
        <button id="tab-field" class="active">בודק שטח</button>
        <button id="tab-admin">לוח ניהול</button>
      </div>
      <button id="topbar-home" class="topbar-home-btn">🏠 מסך כניסה</button>
    </div>
  </div>
  <div class="hazard"></div>
  <main id="main"></main>
</div>
<div id="print-area"></div>
<div class="toast" id="toast"></div>

<script>
(function(){

/* ---------------- DATA (in-memory) ---------------- */
const FREQ_DAYS = {'שבועי':7,'חודשי':30,'רבעוני':90,'שנתי':365};

let categories = [
  { id:'ext', name:'מטפי כיבוי אש', frequency:'חודשי', checklist:[
      'האם המטף בתוקף (תעודת הבדיקה לא פגה)?',
      'המטף נמצא במקומו המיועד',
      'הניצרה (הפין) תקינה ואינה חסרה או פגומה',
      'יש לחץ תקין במטף (מד הלחץ באזור הירוק)',
      'המטף יושב כראוי על התושבת ואין בו נזק חיצוני',
      'התווית ותאריך הבדיקה האחרונה קריאים וברורים',
  ]},
  { id:'shower', name:'מקלחות חירום', frequency:'רבעוני', checklist:[
      'האם המקלחת בתוקף (תעודת הבדיקה לא פגה)?',
      'המקלחת נגישה ואינה חסומה',
      'זרימת המים תקינה בעת הפעלה',
      'הניקוז פנוי ותקין ואין נזילה',
      'הידית/שרשרת ההפעלה תקינה ונגישה',
      'השילוט ברור ותקין',
  ]},
  { id:'cabinet', name:'ארונות חשמל', frequency:'חודשי', checklist:[
      'האם הארון בתוקף (תעודת הבדיקה לא פגה)?',
      'הארון נעול/סגור כראוי',
      'אין סימני חימום יתר, עשן או ריח שרוף',
      'שילוט האזהרה קריא ותקין',
      'הגישה לארון פנויה ואינה חסומה',
      'אין נזק פיזי לארון (קורוזיה, סדק, שבר)',
  ]},
  { id:'shelter', name:'מקלטים', frequency:'חודשי', checklist:[
      'האם המקלט בתוקף (תעודת הבדיקה לא פגה)?',
      'קיים ארון בטיחות (ציוד חירום) תקין במקלט',
      'קיימים ברקודי נוכחות בכל מקלט לצורך ספירת שוהים',
      'דלת/תריס המקלט האטום נפתח, נסגר ואוטם כראוי',
      'מערכת האוורור והסינון תקינה',
      'תאורת החירום תקינה (כולל מצב סוללות)',
      'קיים מטף כיבוי אש תקין ובתוקף במקלט',
      'ערכת עזרה ראשונה קיימת ובתוקף',
      'המקלט פנוי מציוד זר ואחסון חוסם, והגישה אליו חופשית ומשולטת',
  ]},
  { id:'aed', name:'דפיברילטורים', frequency:'חודשי', checklist:[
      'האם הדפיברילטור בתוקף (תעודת הבדיקה לא פגה)?',
      'הדפיברילטור נמצא במקומו המיועד ואינו חסר',
      'נורית/מחוון הסוללה מציג מצב תקין (מוכן לשימוש)',
      'האלקטרודות (הפדים) בתוך תאריך התוקף ואריזתן אטומה',
      'המכשיר עבר בהצלחה בדיקה עצמית (צפצוף/נורית תקינות)',
      'ארון/תיק האחסון אינו נעול ונגיש ללא מכשולים',
      'השילוט המסמן את מיקום הדפיברילטור ברור וגלוי',
  ]},
];

let assets = [
  { id:'EXT-014', name:'מטף — רציף טעינה', catId:'ext', location:'מחסן 2 / מפרץ 3', status:'pass', lastBy:'ד. רגב', lastAt:'2026-07-02 08:14', expiryDate:'2026-08-15' },
  { id:'EXT-015', name:'מטף — מסדרון ראשי', catId:'ext', location:'בניין א׳ / קומה 1', status:'pass', lastBy:'ד. רגב', lastAt:'2026-07-02 08:20', expiryDate:'2027-03-01' },
  { id:'EXT-016', name:'מטף — חדר שרתים', catId:'ext', location:'בניין א׳ / קומה 2', status:'fail', lastBy:'מ. כהן', lastAt:'2026-07-03 11:02', expiryDate:'2026-06-01' },
  { id:'EXT-017', name:'מטף — קפיטריה', catId:'ext', location:'בניין ב׳ / קומה 1', status:'pending', lastBy:null, lastAt:null, expiryDate:'2027-01-10' },
  { id:'EXT-018', name:'מטף — סדנה', catId:'ext', location:'מחסן 1 / מפרץ 1', status:'pending', lastBy:null, lastAt:null, expiryDate:null },
  { id:'SHW-002', name:'מקלחת חירום — מעבדה כימית', catId:'shower', location:'בניין ג׳ / קומה 1', status:'pass', lastBy:'ש. לוי', lastAt:'2026-06-18 09:40', expiryDate:'2026-12-01' },
  { id:'SHW-003', name:'מקלחת חירום — מחלקת צביעה', catId:'shower', location:'מחסן 2 / מפרץ 5', status:'pending', lastBy:null, lastAt:null, expiryDate:'2026-07-28' },
  { id:'CAB-041', name:'ארון חשמל — לוח א׳', catId:'cabinet', location:'בניין א׳ / מרתף', status:'pass', lastBy:'ד. רגב', lastAt:'2026-07-01 14:05', expiryDate:'2027-05-01' },
  { id:'CAB-042', name:'ארון חשמל — לוח ב׳', catId:'cabinet', location:'בניין ב׳ / מרתף', status:'pending', lastBy:null, lastAt:null, expiryDate:null },
  { id:'CAB-043', name:'ארון חשמל — חדר גנרטור', catId:'cabinet', location:'מחסן 1 / אחורי', status:'pending', lastBy:null, lastAt:null, expiryDate:'2026-05-01' },
  { id:'SHL-001', name:'מקלט קומתי — בניין A', catId:'shelter', location:'בניין א׳ / קומת קרקע', status:'pending', lastBy:null, lastAt:null, expiryDate:'2027-01-01' },
  { id:'SHL-002', name:'מקלט קומתי — בניין B', catId:'shelter', location:'בניין ב׳ / קומת קרקע', status:'pending', lastBy:null, lastAt:null, expiryDate:'2026-08-05' },
  { id:'SHL-003', name:'מקלט מרכזי — חצר המפעל', catId:'shelter', location:'חצר המפעל / מבנה נפרד', status:'pending', lastBy:null, lastAt:null, expiryDate:null },
  { id:'SHL-004', name:'מקלט — מחסן 2', catId:'shelter', location:'מחסן 2 / קומת מרתף', status:'pending', lastBy:null, lastAt:null, expiryDate:'2026-06-15' },
  { id:'AED-001', name:'דפיברילטור — שער כניסה למפעל', catId:'aed', location:'שער כניסה למפעל', status:'pending', lastBy:null, lastAt:null, expiryDate:'2027-02-01' },
  { id:'AED-002', name:'דפיברילטור — ייצור, ליד משרד מנהל הייצור', catId:'aed', location:'אזור ייצור / ליד משרד מנהל הייצור', status:'pending', lastBy:null, lastAt:null, expiryDate:'2026-08-20' },
];

let logs = [
  { asset:'EXT-014', name:'מטף — רציף טעינה', worker:'ד. רגב', at:'2026-07-02 08:14', result:'pass', comment:'מד הלחץ באזור הירוק. הנצרה תקינה.' },
  { asset:'EXT-015', name:'מטף — מסדרון ראשי', worker:'ד. רגב', at:'2026-07-02 08:20', result:'pass', comment:'' },
  { asset:'EXT-016', name:'מטף — חדר שרתים', worker:'מ. כהן', at:'2026-07-03 11:02', result:'fail', comment:'קריאת מד לחץ נמוכה. תג הוסר, סומן להחלפה.' },
  { asset:'SHW-002', name:'מקלחת חירום — מעבדה כימית', worker:'ש. לוי', at:'2026-06-18 09:40', result:'pass', comment:'בדיקת זרימה תקינה, ניקוז פנוי.' },
  { asset:'CAB-041', name:'ארון חשמל — לוח א׳', worker:'ד. רגב', at:'2026-07-01 14:05', result:'pass', comment:'' },
];

// ---------- Employee safety observations ----------
// A separate, lighter-weight flow: no QR/asset, just "who did the observer
// watch, and were they working safely?" Kept apart from the asset-based
// categories/assets/logs above since a person isn't a fixed physical item.
const OBS_CHECKLIST = [
  'העובד משתמש בציוד מגן אישי הנדרש (קסדה, משקפי מגן, כפפות)',
  'העובד לובש ביגוד נראות גבוהה (אפוד זוהר) באזורים הנדרשים',
  'העובד מפעיל ציוד/מכונות בהתאם לנהלי הבטיחות',
  'העובד ערני לסביבתו ואינו משתמש בטלפון תוך כדי עבודה עם ציוד מסוכן',
  'העובד מרים משאות בטכניקה נכונה (כפיפת ברכיים, לא גב)',
  'אזור העבודה של העובד מסודר ונקי, ללא מכשולים',
  'העובד מודע למיקום יציאות החירום וציוד הבטיחות הקרוב אליו',
  'העובד פועל לפי נהלי הבטיחות גם ללא משגיח לידו',
];
const OBS_MONTHLY_GOAL = 5;

let observationLogs = [
  { id:'obs-1', employeeName:'רון אביטן', worker:'ד. רגב', workerId:'4821', at:'2026-07-05 09:10', result:'pass', comment:'', answers: OBS_CHECKLIST.map(q=>({text:q,status:'pass',photo:null})) },
  { id:'obs-2', employeeName:'מאיה שרון', worker:'מ. כהן', workerId:'1092', at:'2026-07-08 13:40', result:'fail', comment:'סעיפים לא תקינים: לא ענדה משקפי מגן באזור הליטוש', answers: OBS_CHECKLIST.map((q,i)=>({text:q,status:i===0?'fail':'pass',photo:null})) },
];

/* ================= I18N ================= */
const translations = {
  he: { dir:'rtl', name:'עברית',
    appEyebrow:'דיגיטציה של תחזוקת בטיחות במפעל', appTitle:'משק בית · מעקב בטיחות',
    tabField:'בודק שטח', tabAdmin:'לוח ניהול', topbarHome:'🏠 מסך כניסה',
    landingChoose:'בחר את סוג הכניסה למערכת',
    landingFieldTitle:'בודק שטח', landingFieldSub:'סריקת QR ומילוי בדיקות',
    landingAdminTitle:'לוח ניהול', landingAdminSub:'דורש סיסמה',
    landingSupervisorTitle:'מפקח', landingSupervisorSub:'תצוגה בלבד, ללא עריכה',
    supervisorLoginEyebrow:'כניסת מפקח', supervisorLoginTitle:'הזן את שמך',
    supervisorLoginError:'יש להזין שם', supervisorLoginSubmit:'כניסה לתצוגה',
    readOnlyBadge:(name)=>`🕵️ מצב מפקח (תצוגה בלבד) — ${name}`,
    workerLoginEyebrow:'כניסת בודק שטח', workerLoginTitle:'הזן את פרטיך',
    fieldFullName:'שם מלא', fieldEmployeeId:'מספר עובד', fieldRole:'תפקיד',
    placeholderName:'לדוגמה: דני רגב', placeholderId:'לדוגמה: 4821', placeholderRole:'לדוגמה: טכנאי אחזקה',
    workerLoginError:'יש למלא את כל השדות', workerLoginSubmit:'כניסה למסך בדיקות',
    lettersOnlyError:(field)=>`השדה "${field}" יכול להכיל אותיות בלבד (ללא מספרים)`,
    digitsOnlyError:(field)=>`השדה "${field}" יכול להכיל ספרות בלבד (ללא אותיות)`,
    adminLockEyebrow:'כניסה ללוח ניהול', adminLockTitle:'הזן סיסמה', adminLockError:'סיסמה שגויה, נסה שוב',
    adminLockSubmit:'כניסה', showPassword:'הצג סיסמה', hidePassword:'הסתר סיסמה',
    backLink:'חזרה', backToEntry:'⟵ חזרה למסך כניסה',
    scanEyebrow:'סריקה ובדיקה', scanTitleHello:(n)=>`שלום ${n} בחר פריט לסריקה`, scanTitleGeneric:'בחר פריט לסריקה',
    cameraEyebrow:'סריקת מצלמה', cameraTitle:'כוון את המצלמה לקוד ה-QR',
    photoEyebrow:'צילום תיעוד', photoTitle:'צלם את הליקוי',
    formEyebrow:'טופס בדיקה', formTitle:'בדיקת פריט',
    scanInstruction:'לחץ <b>סרוק עם מצלמה</b> לסריקה אמיתית, או הקש על אריח כדי לדמות סריקה ישירות.',
    scanCameraBtn:'📷 סרוק עם מצלמה',
    cameraRequesting:'מבקש הרשאת מצלמה...', cameraSearching:'מחפש קוד QR...',
    cameraNotSupported:'הדפדפן הזה לא תומך בגישה למצלמה מהעמוד הזה. ודא שאתה נכנס דרך כתובת http/https אמיתית ולא כקובץ מקומי.',
    cameraDenied:'לא ניתן לגשת למצלמה. ודא שאישרת הרשאת מצלמה בדפדפן, ושהעמוד נטען דרך כתובת אינטרנט אמיתית (לא נפתח כקובץ מקומי).',
    cameraNotRecognized:(d)=>`קוד נסרק אך לא זוהה במערכת: ${d}`,
    cancelCamera:'ביטול — חזרה לרשימה',
    photoDocFor:'תיעוד עבור:', capturePhotoBtn:'📸 צלם תמונה', cancelPhotoBtn:'ביטול — חזרה לטופס',
    photoReady:'כוון את המצלמה לליקוי ולחץ על "צלם תמונה"', photoCapturedToast:'התמונה צולמה וצורפה לסעיף',
    backToScan:'⟵ חזרה למסך בדיקות',
    fieldId:'מזהה', fieldLocation:'מיקום', fieldFrequency:'תדירות',
    checklistHeader:'צ\'ק ליסט — סמן כל שורה בנפרד',
    resultPass:'✓ תקין', resultFail:'✕ לא תקין', resultLabel:'תוצאה',
    attachPhoto:'📷 צרף תמונה לסעיף זה', replacePhoto:'🔄 החלף תמונה',
    resultSummaryOk:'✓ כל הסעיפים תקינים — תוצאת הבדיקה: תקין',
    resultSummaryBad:'✕ נמצא/ו סעיף/ים לא תקינים — תוצאת הבדיקה: לא תקין',
    resultSummaryWait:(n)=>`יש לענות על כל ${n} סעיפי הצ׳ק ליסט כדי לקבוע תוצאה`,
    commentsLabel:'הערות (אופציונלי)', commentsPlaceholder:'רשום כל בעיה, לדוגמה: מד לחץ נמוך, אטם שבור...',
    submitInspection:'שלח בדיקה',
    toastLogged:(id,res)=>`${id} נרשם כ${res}`,
    tabDashboard:'לוח מחוונים', tabAssets:'פריטים', tabCategories:'קטגוריות', tabWorkers:'בודקים', tabHistory:'היסטוריה', tabExport:'ייצוא',
    dashboardTitle:'לוח מחוונים', dashboardSub:'התקדמות מחזורי הבדיקה בזמן אמת עבור כל הקטגוריות.',
    cycleLabel:'מחזור', checkedLabel:'נבדקו', recentActivity:'פעילות אחרונה', simulateReset:'הדמה איפוס חודשי',
    colTimestamp:'חותמת זמן', colAsset:'פריט', colId:'מזהה', colWorker:'בודק', colResult:'תוצאה',
    colCategory:'קטגוריה', colLocation:'מיקום', colLastChecked:'נבדק לאחרונה', colComment:'הערה', colStatus:'סטטוס',
    colDateChecked:'נבדק בתאריך', colName:'שם', colEmployeeNum:'מס׳ עובד', colTotal:'סה״כ בדיקות',
    colPassRate:'אחוז תקינות', colLastActivity:'פעילות אחרונה',
    alertPanelTitle:'בדיקות לא תקינות הדורשות טיפול', alertPanelHint:'לחץ על שורה לצפייה בפירוט הצ׳ק ליסט',
    markResolved:'סמן כטופל', noFailedInspections:'אין כרגע בדיקות לא תקינות פתוחות. 🎉',
    noInspectionsYet:'טרם נרשמו בדיקות.',
    assetsTitle:'פריטים', assetsSub:'הוסף, ערוך או הסר פריטים במעקב. כל פריט מקבל קוד QR ייחודי באופן אוטומטי — ניתן להדפיס תווית ולהדביק על הציוד עצמו.',
    fieldAssetName:'שם הפריט', fieldAssetId:'מזהה פריט', fieldCategory:'קטגוריה', fieldLocationLabel:'מיקום',
    addAssetBtn:'+ הוסף פריט', allItemsTitle:'כל הפריטים', printAllBtn:'🖨️ הדפס את כל תוויות ה-QR',
    printQrBtn:'🖨️ הדפס QR', deleteBtn:'מחק', noAssetsYet:'אין פריטים עדיין.',
    categoriesTitle:'קטגוריות בדיקה', categoriesSub:'צור סוגי בדיקה חדשים, שלוט בתדירות האיפוס וקבע את הצ׳ק ליסט שמוצג לבודק השטח לפני קביעת תקין/לא תקין.',
    itemsCountLabel:(t,d,total)=>`${t} פריטים · ${d}/${total} נבדקו במחזור זה`,
    newCategoryName:'שם קטגוריה חדשה', frequencyLabel:'תדירות', createCategoryBtn:'+ צור קטגוריה',
    checklistEditorLabel:'צ׳ק ליסט לבודק השטח', addChecklistItemPlaceholder:'הוסף שאלה לצ׳ק ליסט...', addBtn:'+ הוסף',
    noChecklistItems:'אין פריטי צ׳ק ליסט — הוסף למטה',
    freqWeekly:'שבועי', freqMonthly:'חודשי', freqQuarterly:'רבעוני', freqAnnually:'שנתי',
    workersTitle:'בודקים', workersSub:'מעקב אחר פעילות בודקי השטח — לחץ על שורה לצפייה בהיסטוריה המלאה של אותו בודק.',
    activeWorkers:'בודקים פעילים', totalInspections:'סה״כ בדיקות שבוצעו', avgPerWorker:'ממוצע בדיקות לעובד', topWorker:'הבודק הפעיל ביותר',
    noInspectionsRecorded:'עדיין אין בדיקות רשומות במערכת.',
    historyTitle:'היסטוריית בדיקות', historySub:'יומן ביקורת מלא של כל בדיקה שהוגשה.',
    exportTitle:'ייצוא נתוני תאימות', exportSub:'הורד את היסטוריית הבדיקות המלאה בפורמט הנדרש לביקורת שלך, או הצץ בנתונים לפני ההורדה.',
    csvTitle:'CSV / אקסל', csvDesc:'היומן המלא כקובץ CSV מוכן לגיליון אלקטרוני — נפתח ישירות באקסל.', csvBtn:'הורד קובץ ‎.csv',
    wordTitle:'מסמך Word', wordDesc:'דוח תאימות מעוצב כקובץ ‎.doc, מוכן לשמירה או לשליחה.', wordBtn:'הורד קובץ ‎.doc',
    pdfTitle:'PDF', pdfDesc:'דוח מוכן להדפסה. פותח את חלון ההדפסה של הדפדפן — בחר "שמור כ-PDF".', pdfBtn:'צור PDF',
    previewBtn:'👁 תצוגה מקדימה', reportTitle:'משק בית — דוח תאימות בדיקות בטיחות',
    inspectionDetailNoChecklist:'אין פירוט צ׳ק ליסט זמין לבדיקה זו (בדיקה ישנה מלפני התוספת).',
    inspectionDetailResolvedNote:'זהו רישום טיפול ידני של מנהל — אין צ׳ק ליסט לבדיקה חוזרת מלאה.',
    commentsHeading:'הערות:',
    categoryModalChecked:'נבדקו', categoryModalPending:'ממתינים לבדיקה',
    categoryModalNoneChecked:'אף פריט לא נבדק עדיין במחזור זה', categoryModalAllDone:'כל הפריטים נבדקו במחזור זה 🎉',
    noInspectionHistoryForWorker:'אין בדיקות רשומות לעובד זה.',
    statusPending:'ממתין', statusPass:'תקין', statusFail:'לא תקין', statusResolved:'טופל',
  },
  en: { dir:'ltr', name:'English',
    appEyebrow:'Plant Safety Digitization', appTitle:'Mishek Bayit · Safety Tracking',
    tabField:'Field Inspector', tabAdmin:'Admin Dashboard', topbarHome:'🏠 Entry Screen',
    landingChoose:'Choose how you want to sign in',
    landingFieldTitle:'Field Inspector', landingFieldSub:'Scan QR codes and fill in inspections',
    landingAdminTitle:'Admin Dashboard', landingAdminSub:'Password required',
    landingSupervisorTitle:'Supervisor', landingSupervisorSub:'View only, no editing',
    supervisorLoginEyebrow:'Supervisor Login', supervisorLoginTitle:'Enter your name',
    supervisorLoginError:'Please enter a name', supervisorLoginSubmit:'Continue to view',
    readOnlyBadge:(name)=>`🕵️ Supervisor mode (view only) — ${name}`,
    workerLoginEyebrow:'Field Inspector Login', workerLoginTitle:'Enter your details',
    fieldFullName:'Full name', fieldEmployeeId:'Employee number', fieldRole:'Role',
    placeholderName:'e.g. Danny Regev', placeholderId:'e.g. 4821', placeholderRole:'e.g. Maintenance technician',
    workerLoginError:'Please fill in all fields', workerLoginSubmit:'Continue to inspections',
    lettersOnlyError:(field)=>`"${field}" can only contain letters (no numbers)`,
    digitsOnlyError:(field)=>`"${field}" can only contain digits (no letters)`,
    adminLockEyebrow:'Admin Dashboard Login', adminLockTitle:'Enter password', adminLockError:'Wrong password, try again',
    adminLockSubmit:'Log in', showPassword:'Show password', hidePassword:'Hide password',
    backLink:'Back', backToEntry:'⟵ Back to entry screen',
    scanEyebrow:'Scan & Inspect', scanTitleHello:(n)=>`Hi ${n}, select an item to scan`, scanTitleGeneric:'Select an item to scan',
    cameraEyebrow:'Camera Scan', cameraTitle:'Point the camera at the QR code',
    photoEyebrow:'Photo Documentation', photoTitle:'Photograph the fault',
    formEyebrow:'Inspection Form', formTitle:'Item Inspection',
    scanInstruction:'Tap <b>Scan with camera</b> for a real scan, or tap a tile to simulate scanning directly.',
    scanCameraBtn:'📷 Scan with camera',
    cameraRequesting:'Requesting camera permission...', cameraSearching:'Looking for a QR code...',
    cameraNotSupported:'This browser does not support camera access from this page. Make sure you are on a real http/https address, not a local file.',
    cameraDenied:'Could not access the camera. Make sure you granted camera permission, and the page loaded from a real web address (not a local file).',
    cameraNotRecognized:(d)=>`Code scanned but not recognized in the system: ${d}`,
    cancelCamera:'Cancel — back to list',
    photoDocFor:'Documenting:', capturePhotoBtn:'📸 Take photo', cancelPhotoBtn:'Cancel — back to form',
    photoReady:'Point the camera at the fault and tap "Take photo"', photoCapturedToast:'Photo captured and attached to the item',
    backToScan:'⟵ Back to inspections',
    fieldId:'ID', fieldLocation:'Location', fieldFrequency:'Frequency',
    checklistHeader:'Checklist — mark each line separately',
    resultPass:'✓ Pass', resultFail:'✕ Fail', resultLabel:'Result',
    attachPhoto:'📷 Attach photo for this item', replacePhoto:'🔄 Replace photo',
    resultSummaryOk:'✓ All items passed — overall result: Pass',
    resultSummaryBad:'✕ One or more items failed — overall result: Fail',
    resultSummaryWait:(n)=>`Answer all ${n} checklist items to determine a result`,
    commentsLabel:'Comments (optional)', commentsPlaceholder:'Note any issues, e.g. low pressure gauge, broken seal...',
    submitInspection:'Submit Inspection',
    toastLogged:(id,res)=>`${id} logged as ${res}`,
    tabDashboard:'Dashboard', tabAssets:'Assets', tabCategories:'Categories', tabWorkers:'Inspectors', tabHistory:'History', tabExport:'Export',
    dashboardTitle:'Dashboard', dashboardSub:'Live inspection cycle progress across all categories.',
    cycleLabel:'cycle', checkedLabel:'checked', recentActivity:'Recent Activity', simulateReset:'Simulate Monthly Reset',
    colTimestamp:'Timestamp', colAsset:'Item', colId:'ID', colWorker:'Inspector', colResult:'Result',
    colCategory:'Category', colLocation:'Location', colLastChecked:'Last Checked', colComment:'Comment', colStatus:'Status',
    colDateChecked:'Date Checked', colName:'Name', colEmployeeNum:'Emp. #', colTotal:'Total Inspections',
    colPassRate:'Pass Rate', colLastActivity:'Last Activity',
    alertPanelTitle:'Failed Inspections Requiring Attention', alertPanelHint:'Click a row to see the full checklist detail',
    markResolved:'Mark resolved', noFailedInspections:'No open failed inspections right now. 🎉',
    noInspectionsYet:'No inspections logged yet.',
    assetsTitle:'Assets', assetsSub:'Add, edit, or remove tracked assets. Each one automatically gets a unique QR code — you can print a label and stick it on the equipment.',
    fieldAssetName:'Asset name', fieldAssetId:'Asset ID', fieldCategory:'Category', fieldLocationLabel:'Location',
    addAssetBtn:'+ Add asset', allItemsTitle:'All Assets', printAllBtn:'🖨️ Print all QR labels',
    printQrBtn:'🖨️ Print QR', deleteBtn:'Delete', noAssetsYet:'No assets yet.',
    categoriesTitle:'Inspection Categories', categoriesSub:'Create new inspection types, control the reset frequency, and set the checklist shown to field inspectors before marking pass/fail.',
    itemsCountLabel:(t,d,total)=>`${t} assets · ${d}/${total} checked this cycle`,
    newCategoryName:'New category name', frequencyLabel:'Frequency', createCategoryBtn:'+ Create category',
    checklistEditorLabel:'Checklist for field inspectors', addChecklistItemPlaceholder:'Add a checklist question...', addBtn:'+ Add',
    noChecklistItems:'No checklist items yet — add one below',
    freqWeekly:'Weekly', freqMonthly:'Monthly', freqQuarterly:'Quarterly', freqAnnually:'Annually',
    workersTitle:'Inspectors', workersSub:'Track field inspector activity — click a row to see that inspector\'s full history.',
    activeWorkers:'Active Inspectors', totalInspections:'Total Inspections', avgPerWorker:'Avg. per Inspector', topWorker:'Most Active Inspector',
    noInspectionsRecorded:'No inspections recorded in the system yet.',
    historyTitle:'Inspection History', historySub:'Full audit log of every submitted inspection.',
    exportTitle:'Export Compliance Data', exportSub:'Download the full inspection history in the format your audit needs, or preview the data first.',
    csvTitle:'CSV / Excel', csvDesc:'The full log as a spreadsheet-ready CSV file — opens directly in Excel.', csvBtn:'Download .csv',
    wordTitle:'Word Document', wordDesc:'A formatted compliance report as a .doc file, ready to save or send.', wordBtn:'Download .doc',
    pdfTitle:'PDF', pdfDesc:'A print-ready report. Opens your browser\'s print dialog — choose "Save as PDF".', pdfBtn:'Generate PDF',
    previewBtn:'👁 Preview', reportTitle:'Mishek Bayit — Safety Inspection Compliance Report',
    inspectionDetailNoChecklist:'No checklist detail available for this inspection (an older entry from before this feature).',
    inspectionDetailResolvedNote:'This is a manual admin resolution entry — there is no full re-inspection checklist.',
    commentsHeading:'Comments:',
    categoryModalChecked:'Checked', categoryModalPending:'Pending inspection',
    categoryModalNoneChecked:'No items checked yet this cycle', categoryModalAllDone:'All items checked this cycle 🎉',
    noInspectionHistoryForWorker:'No inspections recorded for this inspector.',
    statusPending:'Pending', statusPass:'Pass', statusFail:'Fail', statusResolved:'Resolved',
  },
  ru: { dir:'ltr', name:'Русский',
    appEyebrow:'Цифровизация безопасности предприятия', appTitle:'Мишек Байт · Учёт безопасности',
    tabField:'Полевой инспектор', tabAdmin:'Панель управления', topbarHome:'🏠 Экран входа',
    landingChoose:'Выберите способ входа в систему',
    landingFieldTitle:'Полевой инспектор', landingFieldSub:'Сканирование QR и заполнение проверок',
    landingAdminTitle:'Панель управления', landingAdminSub:'Требуется пароль',
    landingSupervisorTitle:'Наблюдатель', landingSupervisorSub:'Только просмотр, без редактирования',
    supervisorLoginEyebrow:'Вход наблюдателя', supervisorLoginTitle:'Введите ваше имя',
    supervisorLoginError:'Введите имя', supervisorLoginSubmit:'Перейти к просмотру',
    readOnlyBadge:(name)=>`🕵️ Режим наблюдателя (только просмотр) — ${name}`,
    workerLoginEyebrow:'Вход инспектора', workerLoginTitle:'Введите свои данные',
    fieldFullName:'Полное имя', fieldEmployeeId:'Табельный номер', fieldRole:'Должность',
    placeholderName:'например: Дани Регев', placeholderId:'например: 4821', placeholderRole:'например: техник по обслуживанию',
    workerLoginError:'Заполните все поля', workerLoginSubmit:'Перейти к проверкам',
    lettersOnlyError:(field)=>`Поле «${field}» может содержать только буквы (без цифр)`,
    digitsOnlyError:(field)=>`Поле «${field}» может содержать только цифры (без букв)`,
    adminLockEyebrow:'Вход в панель управления', adminLockTitle:'Введите пароль', adminLockError:'Неверный пароль, попробуйте снова',
    adminLockSubmit:'Войти', showPassword:'Показать пароль', hidePassword:'Скрыть пароль',
    backLink:'Назад', backToEntry:'⟵ Назад к экрану входа',
    scanEyebrow:'Сканирование и проверка', scanTitleHello:(n)=>`Здравствуйте, ${n}, выберите объект для сканирования`, scanTitleGeneric:'Выберите объект для сканирования',
    cameraEyebrow:'Сканирование камерой', cameraTitle:'Наведите камеру на QR-код',
    photoEyebrow:'Фотодокументация', photoTitle:'Сфотографируйте неисправность',
    formEyebrow:'Форма проверки', formTitle:'Проверка объекта',
    scanInstruction:'Нажмите <b>Сканировать камерой</b> для реального сканирования, или коснитесь плитки для имитации.',
    scanCameraBtn:'📷 Сканировать камерой',
    cameraRequesting:'Запрос доступа к камере...', cameraSearching:'Поиск QR-кода...',
    cameraNotSupported:'Этот браузер не поддерживает доступ к камере с этой страницы. Убедитесь, что вы используете настоящий адрес http/https, а не локальный файл.',
    cameraDenied:'Не удалось получить доступ к камере. Убедитесь, что вы разрешили доступ к камере, и страница загружена с настоящего веб-адреса (не локальный файл).',
    cameraNotRecognized:(d)=>`Код отсканирован, но не распознан в системе: ${d}`,
    cancelCamera:'Отмена — назад к списку',
    photoDocFor:'Документируется:', capturePhotoBtn:'📸 Сделать фото', cancelPhotoBtn:'Отмена — назад к форме',
    photoReady:'Наведите камеру на неисправность и нажмите "Сделать фото"', photoCapturedToast:'Фото сделано и прикреплено к пункту',
    backToScan:'⟵ Назад к проверкам',
    fieldId:'ID', fieldLocation:'Местоположение', fieldFrequency:'Периодичность',
    checklistHeader:'Чек-лист — отметьте каждый пункт отдельно',
    resultPass:'✓ Исправно', resultFail:'✕ Неисправно', resultLabel:'Результат',
    attachPhoto:'📷 Прикрепить фото к пункту', replacePhoto:'🔄 Заменить фото',
    resultSummaryOk:'✓ Все пункты исправны — итоговый результат: Исправно',
    resultSummaryBad:'✕ Обнаружены неисправные пункты — итоговый результат: Неисправно',
    resultSummaryWait:(n)=>`Ответьте на все ${n} пунктов чек-листа, чтобы определить результат`,
    commentsLabel:'Комментарии (необязательно)', commentsPlaceholder:'Опишите проблему, например: низкое давление, повреждена пломба...',
    submitInspection:'Отправить проверку',
    toastLogged:(id,res)=>`${id} записан как ${res}`,
    tabDashboard:'Панель', tabAssets:'Объекты', tabCategories:'Категории', tabWorkers:'Инспекторы', tabHistory:'История', tabExport:'Экспорт',
    dashboardTitle:'Панель управления', dashboardSub:'Прогресс циклов проверки в реальном времени по всем категориям.',
    cycleLabel:'цикл', checkedLabel:'проверено', recentActivity:'Последняя активность', simulateReset:'Симуляция ежемесячного сброса',
    colTimestamp:'Время', colAsset:'Объект', colId:'ID', colWorker:'Инспектор', colResult:'Результат',
    colCategory:'Категория', colLocation:'Местоположение', colLastChecked:'Последняя проверка', colComment:'Комментарий', colStatus:'Статус',
    colDateChecked:'Дата проверки', colName:'Имя', colEmployeeNum:'Таб. №', colTotal:'Всего проверок',
    colPassRate:'Процент исправности', colLastActivity:'Последняя активность',
    alertPanelTitle:'Неисправности, требующие внимания', alertPanelHint:'Нажмите на строку, чтобы увидеть полный чек-лист',
    markResolved:'Отметить как устранено', noFailedInspections:'Сейчас нет открытых неисправностей. 🎉',
    noInspectionsYet:'Проверки ещё не зарегистрированы.',
    assetsTitle:'Объекты', assetsSub:'Добавляйте, редактируйте или удаляйте отслеживаемые объекты. Каждый автоматически получает уникальный QR-код — можно распечатать наклейку.',
    fieldAssetName:'Название объекта', fieldAssetId:'ID объекта', fieldCategory:'Категория', fieldLocationLabel:'Местоположение',
    addAssetBtn:'+ Добавить объект', allItemsTitle:'Все объекты', printAllBtn:'🖨️ Распечатать все QR-наклейки',
    printQrBtn:'🖨️ Печать QR', deleteBtn:'Удалить', noAssetsYet:'Объектов пока нет.',
    categoriesTitle:'Категории проверок', categoriesSub:'Создавайте новые типы проверок, управляйте периодичностью сброса и настраивайте чек-лист для инспекторов.',
    itemsCountLabel:(t,d,total)=>`${t} объектов · ${d}/${total} проверено в этом цикле`,
    newCategoryName:'Название новой категории', frequencyLabel:'Периодичность', createCategoryBtn:'+ Создать категорию',
    checklistEditorLabel:'Чек-лист для полевого инспектора', addChecklistItemPlaceholder:'Добавить вопрос в чек-лист...', addBtn:'+ Добавить',
    noChecklistItems:'Пунктов чек-листа пока нет — добавьте ниже',
    freqWeekly:'Еженедельно', freqMonthly:'Ежемесячно', freqQuarterly:'Ежеквартально', freqAnnually:'Ежегодно',
    workersTitle:'Инспекторы', workersSub:'Отслеживайте активность полевых инспекторов — нажмите на строку, чтобы увидеть полную историю.',
    activeWorkers:'Активных инспекторов', totalInspections:'Всего проверок', avgPerWorker:'В среднем на инспектора', topWorker:'Самый активный инспектор',
    noInspectionsRecorded:'В системе ещё нет зарегистрированных проверок.',
    historyTitle:'История проверок', historySub:'Полный журнал аудита всех отправленных проверок.',
    exportTitle:'Экспорт данных соответствия', exportSub:'Скачайте полную историю проверок в нужном для аудита формате, или сначала просмотрите данные.',
    csvTitle:'CSV / Excel', csvDesc:'Полный журнал в виде CSV-файла, готового для таблиц — открывается прямо в Excel.', csvBtn:'Скачать .csv',
    wordTitle:'Документ Word', wordDesc:'Оформленный отчёт о соответствии в виде файла .doc, готов к сохранению или отправке.', wordBtn:'Скачать .doc',
    pdfTitle:'PDF', pdfDesc:'Отчёт, готовый к печати. Откроется диалог печати браузера — выберите "Сохранить как PDF".', pdfBtn:'Создать PDF',
    previewBtn:'👁 Предпросмотр', reportTitle:'Мишек Байт — Отчёт о соответствии проверок безопасности',
    inspectionDetailNoChecklist:'Для этой проверки нет подробного чек-листа (старая запись до добавления этой функции).',
    inspectionDetailResolvedNote:'Это запись ручного устранения администратором — полного чек-листа повторной проверки нет.',
    commentsHeading:'Комментарии:',
    categoryModalChecked:'Проверено', categoryModalPending:'Ожидает проверки',
    categoryModalNoneChecked:'В этом цикле пока ничего не проверено', categoryModalAllDone:'Все объекты проверены в этом цикле 🎉',
    noInspectionHistoryForWorker:'Для этого инспектора проверки не зарегистрированы.',
    statusPending:'Ожидает', statusPass:'Исправно', statusFail:'Неисправно', statusResolved:'Устранено',
  },
  ar: { dir:'rtl', name:'العربية',
    appEyebrow:'رقمنة صيانة السلامة في المصنع', appTitle:'مِشك بايت · تتبع السلامة',
    tabField:'مفتش ميداني', tabAdmin:'لوحة الإدارة', topbarHome:'🏠 شاشة الدخول',
    landingChoose:'اختر طريقة الدخول إلى النظام',
    landingFieldTitle:'مفتش ميداني', landingFieldSub:'مسح رمز QR وتعبئة الفحوصات',
    landingAdminTitle:'لوحة الإدارة', landingAdminSub:'يتطلب كلمة مرور',
    landingSupervisorTitle:'مشرف', landingSupervisorSub:'عرض فقط، بدون تعديل',
    supervisorLoginEyebrow:'دخول المشرف', supervisorLoginTitle:'أدخل اسمك',
    supervisorLoginError:'يرجى إدخال الاسم', supervisorLoginSubmit:'الدخول للعرض',
    readOnlyBadge:(name)=>`🕵️ وضع المشرف (عرض فقط) — ${name}`,
    workerLoginEyebrow:'دخول المفتش الميداني', workerLoginTitle:'أدخل بياناتك',
    fieldFullName:'الاسم الكامل', fieldEmployeeId:'رقم الموظف', fieldRole:'الوظيفة',
    placeholderName:'مثال: داني ريغيف', placeholderId:'مثال: 4821', placeholderRole:'مثال: فني صيانة',
    workerLoginError:'يجب تعبئة جميع الحقول', workerLoginSubmit:'الدخول إلى شاشة الفحوصات',
    lettersOnlyError:(field)=>`الحقل "${field}" يجب أن يحتوي على أحرف فقط (بدون أرقام)`,
    digitsOnlyError:(field)=>`الحقل "${field}" يجب أن يحتوي على أرقام فقط (بدون أحرف)`,
    adminLockEyebrow:'الدخول إلى لوحة الإدارة', adminLockTitle:'أدخل كلمة المرور', adminLockError:'كلمة مرور خاطئة، حاول مرة أخرى',
    adminLockSubmit:'دخول', showPassword:'إظهار كلمة المرور', hidePassword:'إخفاء كلمة المرور',
    backLink:'رجوع', backToEntry:'⟵ الرجوع إلى شاشة الدخول',
    scanEyebrow:'مسح وفحص', scanTitleHello:(n)=>`مرحباً ${n}، اختر عنصراً للمسح`, scanTitleGeneric:'اختر عنصراً للمسح',
    cameraEyebrow:'مسح بالكاميرا', cameraTitle:'وجّه الكاميرا نحو رمز QR',
    photoEyebrow:'توثيق بالصور', photoTitle:'صوّر العطل',
    formEyebrow:'نموذج الفحص', formTitle:'فحص العنصر',
    scanInstruction:'اضغط على <b>مسح بالكاميرا</b> لمسح حقيقي، أو اضغط على بلاطة لمحاكاة المسح مباشرة.',
    scanCameraBtn:'📷 مسح بالكاميرا',
    cameraRequesting:'طلب إذن الكاميرا...', cameraSearching:'جارٍ البحث عن رمز QR...',
    cameraNotSupported:'هذا المتصفح لا يدعم الوصول إلى الكاميرا من هذه الصفحة. تأكد من أنك تدخل عبر عنوان http/https حقيقي وليس ملفاً محلياً.',
    cameraDenied:'تعذّر الوصول إلى الكاميرا. تأكد من أنك وافقت على إذن الكاميرا في المتصفح، وأن الصفحة حُمّلت من عنوان إنترنت حقيقي (وليس كملف محلي).',
    cameraNotRecognized:(d)=>`تم مسح الرمز لكنه غير معروف في النظام: ${d}`,
    cancelCamera:'إلغاء — الرجوع إلى القائمة',
    photoDocFor:'التوثيق من أجل:', capturePhotoBtn:'📸 التقاط صورة', cancelPhotoBtn:'إلغاء — الرجوع إلى النموذج',
    photoReady:'وجّه الكاميرا نحو العطل واضغط على "التقاط صورة"', photoCapturedToast:'تم التقاط الصورة وإرفاقها بالبند',
    backToScan:'⟵ الرجوع إلى شاشة الفحوصات',
    fieldId:'المعرّف', fieldLocation:'الموقع', fieldFrequency:'التكرار',
    checklistHeader:'قائمة الفحص — حدد كل بند على حدة',
    resultPass:'✓ سليم', resultFail:'✕ غير سليم', resultLabel:'النتيجة',
    attachPhoto:'📷 إرفاق صورة لهذا البند', replacePhoto:'🔄 استبدال الصورة',
    resultSummaryOk:'✓ جميع البنود سليمة — نتيجة الفحص: سليم',
    resultSummaryBad:'✕ تم العثور على بند/بنود غير سليمة — نتيجة الفحص: غير سليم',
    resultSummaryWait:(n)=>`يجب الإجابة على جميع بنود قائمة الفحص (${n}) لتحديد النتيجة`,
    commentsLabel:'ملاحظات (اختياري)', commentsPlaceholder:'اذكر أي مشكلة، مثال: مقياس ضغط منخفض، ختم مكسور...',
    submitInspection:'إرسال الفحص',
    toastLogged:(id,res)=>`تم تسجيل ${id} كـ ${res}`,
    tabDashboard:'لوحة المؤشرات', tabAssets:'العناصر', tabCategories:'الفئات', tabWorkers:'المفتشون', tabHistory:'السجل', tabExport:'تصدير',
    dashboardTitle:'لوحة المؤشرات', dashboardSub:'تقدّم دورات الفحص في الوقت الفعلي لجميع الفئات.',
    cycleLabel:'دورة', checkedLabel:'تم فحصها', recentActivity:'النشاط الأخير', simulateReset:'محاكاة إعادة التعيين الشهرية',
    colTimestamp:'الطابع الزمني', colAsset:'العنصر', colId:'المعرّف', colWorker:'المفتش', colResult:'النتيجة',
    colCategory:'الفئة', colLocation:'الموقع', colLastChecked:'آخر فحص', colComment:'ملاحظة', colStatus:'الحالة',
    colDateChecked:'تاريخ الفحص', colName:'الاسم', colEmployeeNum:'رقم الموظف', colTotal:'إجمالي الفحوصات',
    colPassRate:'نسبة السلامة', colLastActivity:'آخر نشاط',
    alertPanelTitle:'فحوصات غير سليمة تتطلب معالجة', alertPanelHint:'اضغط على صف لعرض تفاصيل قائمة الفحص الكاملة',
    markResolved:'وضع علامة كمُعالَج', noFailedInspections:'لا توجد حالياً فحوصات غير سليمة مفتوحة. 🎉',
    noInspectionsYet:'لم تُسجَّل أي فحوصات بعد.',
    assetsTitle:'العناصر', assetsSub:'أضف أو عدّل أو احذف عناصر المتابعة. يحصل كل عنصر تلقائياً على رمز QR فريد — يمكن طباعة ملصق ولصقه على المعدات.',
    fieldAssetName:'اسم العنصر', fieldAssetId:'معرّف العنصر', fieldCategory:'الفئة', fieldLocationLabel:'الموقع',
    addAssetBtn:'+ إضافة عنصر', allItemsTitle:'جميع العناصر', printAllBtn:'🖨️ طباعة جميع ملصقات QR',
    printQrBtn:'🖨️ طباعة QR', deleteBtn:'حذف', noAssetsYet:'لا توجد عناصر بعد.',
    categoriesTitle:'فئات الفحص', categoriesSub:'أنشئ أنواع فحص جديدة، وتحكم بتكرار إعادة التعيين، وحدد قائمة الفحص المعروضة للمفتش الميداني قبل تحديد سليم/غير سليم.',
    itemsCountLabel:(t,d,total)=>`${t} عناصر · ${d}/${total} تم فحصها في هذه الدورة`,
    newCategoryName:'اسم الفئة الجديدة', frequencyLabel:'التكرار', createCategoryBtn:'+ إنشاء فئة',
    checklistEditorLabel:'قائمة الفحص للمفتش الميداني', addChecklistItemPlaceholder:'أضف سؤالاً إلى قائمة الفحص...', addBtn:'+ إضافة',
    noChecklistItems:'لا توجد بنود في قائمة الفحص — أضف واحداً أدناه',
    freqWeekly:'أسبوعي', freqMonthly:'شهري', freqQuarterly:'ربع سنوي', freqAnnually:'سنوي',
    workersTitle:'المفتشون', workersSub:'تتبّع نشاط المفتشين الميدانيين — اضغط على صف لعرض السجل الكامل لذلك المفتش.',
    activeWorkers:'المفتشون النشطون', totalInspections:'إجمالي الفحوصات', avgPerWorker:'متوسط الفحوصات لكل مفتش', topWorker:'المفتش الأكثر نشاطاً',
    noInspectionsRecorded:'لا توجد فحوصات مسجلة في النظام بعد.',
    historyTitle:'سجل الفحوصات', historySub:'سجل تدقيق كامل لكل فحص تم إرساله.',
    exportTitle:'تصدير بيانات الامتثال', exportSub:'حمّل سجل الفحوصات الكامل بالصيغة التي يتطلبها التدقيق لديك، أو عاين البيانات أولاً.',
    csvTitle:'CSV / إكسل', csvDesc:'السجل الكامل كملف CSV جاهز لجدول بيانات — يُفتح مباشرة في إكسل.', csvBtn:'تنزيل ملف ‎.csv',
    wordTitle:'مستند Word', wordDesc:'تقرير امتثال منسّق كملف ‎.doc، جاهز للحفظ أو الإرسال.', wordBtn:'تنزيل ملف ‎.doc',
    pdfTitle:'PDF', pdfDesc:'تقرير جاهز للطباعة. يفتح نافذة الطباعة في المتصفح — اختر "حفظ كـ PDF".', pdfBtn:'إنشاء PDF',
    previewBtn:'👁 معاينة', reportTitle:'مِشك بايت — تقرير امتثال فحوصات السلامة',
    inspectionDetailNoChecklist:'لا تتوفر تفاصيل قائمة فحص لهذا الفحص (سجل قديم من قبل إضافة هذه الميزة).',
    inspectionDetailResolvedNote:'هذا سجل معالجة يدوية من قبل المدير — لا توجد قائمة فحص لإعادة فحص كاملة.',
    commentsHeading:'ملاحظات:',
    categoryModalChecked:'تم فحصها', categoryModalPending:'بانتظار الفحص',
    categoryModalNoneChecked:'لم يتم فحص أي عنصر بعد في هذه الدورة', categoryModalAllDone:'تم فحص جميع العناصر في هذه الدورة 🎉',
    noInspectionHistoryForWorker:'لا توجد فحوصات مسجلة لهذا المفتش.',
    statusPending:'بانتظار', statusPass:'سليم', statusFail:'غير سليم', statusResolved:'مُعالَج',
  },
};

let currentLang = 'he';
let currentTheme = 'light'; // 'light' | 'dark'
function setTheme(theme){
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if(btn) btn.textContent = theme==='dark' ? '☀️' : '🌙';
}
function toggleTheme(){ setTheme(currentTheme==='dark' ? 'light' : 'dark'); }
function t(key, ...args){
  const dict = translations[currentLang] || translations.he;
  const val = dict[key] !== undefined ? dict[key] : translations.he[key];
  return typeof val === 'function' ? val(...args) : val;
}
function setLanguage(lang){
  if(!translations[lang]) return;
  currentLang = lang;
  const dir = translations[lang].dir;
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  document.body.dir = dir;
  render();
}
function backArrow(){ return (translations[currentLang]||translations.he).dir==='rtl' ? '→' : '←'; }
function isLettersOnly(str){ return /^[A-Za-zא-תء-ي\u0600-\u06FF\u0400-\u04FF\s'\-]+$/.test(str); }
function isDigitsOnly(str){ return /^[0-9]+$/.test(str); }

let mode = null; // null (landing) | 'field-login' | 'field' | 'lock' | 'admin'
let adminUnlocked = false;
let passwordDraft = '';
let passwordError = ''; // '' or an error message
let adminName = '';
let adminNameDraft = '';
let adminAuditLog = [];
function logAdminAction(action, details){
  adminAuditLog.unshift({ at: nowStamp(), admin: adminName || 'מנהל המערכת', action, details });
}
let fieldScreen = 'scan'; // 'scan' | 'form'
let scanSelectedCategory = null; // null = show category folders, else = category id whose QR grid is shown
let observationEmployeeName = '';
let observationNameError = '';
let selectedAsset = null;
let photoCaptureIndex = null;
let formResult = null;
let photoAttached = false;
let checklistStatus = {};
let checklistPhoto = {};
let inspectorName = '';
let workerEmployeeNumber = '';
let workerDepartment = '';
let workerLoginError = ''; // '' or an error message
let adminTab = 'dashboard';
let openInspectionLog = null;
let openCategoryDrilldown = null;
let openWorkerDrilldown = null;
let previewFormat = null; // null | 'csv' | 'word' | 'pdf'
let previewCategoryId = null; // null = all categories, else a category id
let previewIsObs = false;
let openObsDrilldown = false;
let openObservationLog = null;
let assetSearchQuery = '';
let isReadOnly = false;
let supervisorName = '';
let supervisorLoginError = ''; // '' or an error message

/* ---------------- helpers ---------------- */
function catOf(id){ return categories.find(c=>c.id===id); }
function assetsIn(catId){ return assets.filter(a=>a.catId===catId); }
function progressOf(catId){
  const list = assetsIn(catId);
  const done = list.filter(a=>a.status==='pass'||a.status==='fail').length;
  return { done, total:list.length };
}
function statusLabel(s){ return s==='pass'?'תקין':s==='fail'?'לא תקין':s==='resolved'?'טופל':'ממתין'; }
function expiryStatus(dateStr){
  if(!dateStr) return 'none';
  const today = new Date(); today.setHours(0,0,0,0);
  const expiry = new Date(dateStr + 'T00:00:00');
  const daysLeft = Math.round((expiry - today) / 86400000);
  if(daysLeft < 0) return 'expired';
  if(daysLeft <= 30) return 'soon';
  return 'valid';
}
function expiryLabel(dateStr){
  const st = expiryStatus(dateStr);
  if(st==='none') return 'לא הוגדר';
  if(st==='expired') return `פג תוקף (${dateStr})`;
  if(st==='soon') return `פג בקרוב (${dateStr})`;
  return dateStr;
}
// Days remaining until this category's inspection cycle resets to Pending —
// mirrors the same reset logic used by the monthly-reset simulation.
function daysUntilCycleEnd(frequency){
  const today = new Date(); today.setHours(0,0,0,0);
  let target;
  if(frequency==='שבועי'){
    const day = today.getDay();
    const daysToAdd = day===0 ? 7 : (7-day);
    target = new Date(today); target.setDate(today.getDate()+daysToAdd);
  } else if(frequency==='חודשי'){
    target = new Date(today.getFullYear(), today.getMonth()+1, 1);
  } else if(frequency==='רבעוני'){
    const q = Math.floor(today.getMonth()/3);
    target = new Date(today.getFullYear(), (q+1)*3, 1);
  } else if(frequency==='שנתי'){
    target = new Date(today.getFullYear()+1, 0, 1);
  } else {
    return null;
  }
  return Math.round((target - today) / 86400000);
}
function statusClass(s){ return s==='pass'?'st-pass':s==='fail'?'st-fail':s==='resolved'?'st-resolved':'st-pending'; }
function logBadgeClass(result){ return result==='pass'?'st-pass':result==='fail'?'st-fail':'st-resolved'; }

const MONTH_NAMES_HE = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const MONTH_ABBR_HE = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];

// Returns the [startMonth,endMonth] periods a frequency divides the year into.
// Quarterly = 4 periods of 3 months; annual = 1 period of 12; monthly/weekly = each month its own period.
function getPeriodsForFrequency(freq){
  if(freq==='רבעוני') return [[0,2],[3,5],[6,8],[9,11]];
  if(freq==='שנתי') return [[0,11]];
  return Array.from({length:12}, (_,m)=>[m,m]);
}

// Builds a 12-month color strip for a category:
//   gray   = period hasn't started yet (fully future)
//   yellow = we're inside this period right now and it isn't fully checked yet
//   green  = period is fully checked (every asset has a real pass/fail result —
//            a failed-but-checked asset still counts, only "pending" blocks green)
//   red    = a period that already ended without being fully checked in time
//
// Note: this demo has no stored per-month history, so past periods are judged
// by the SAME live done/total snapshot as the current period — the most honest
// approximation available without a real database of monthly snapshots.
function buildComplianceStrip(cat){
  const curM = new Date().getMonth();
  const periods = getPeriodsForFrequency(cat.frequency);
  const {done,total} = progressOf(cat.id);
  const compliant = total>0 && done===total;
  const monthColors = new Array(12).fill('gray');

  periods.forEach((period)=>{
    const [start,end] = period;
    let color;
    if(start > curM){
      color = 'gray';
    } else if(compliant){
      color = 'green';
    } else if(end < curM){
      color = 'red';
    } else {
      color = 'yellow';
    }
    for(let m=start; m<=end; m++){
      monthColors[m] = (color==='yellow' && m>curM) ? 'gray' : color;
    }
  });
  return monthColors;
}

function renderComplianceStrip(cat){
  const colors = buildComplianceStrip(cat);
  return `
    <div class="compliance-strip">
      ${colors.map((c,i)=>`
        <div class="compliance-col">
          <span class="compliance-cell compliance-${c}" title="${MONTH_NAMES_HE[i]}"></span>
          <span class="compliance-label">${MONTH_ABBR_HE[i]}</span>
        </div>
      `).join('')}
    </div>`;
}
function nowStamp(){
  const d = new Date();
  const p = n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function hashStr(s){ let h=0; for(let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) >>> 0; } return h; }

// Real, camera-scannable QR codes (not decorative). Each QR encodes a full
// URL back to this page with ?asset=<id> — so ANY camera app (not just the
// in-app scanner) opens the site and lands directly on the right item.
// Requires the qrcodejs library (loaded via <script> tag).
function assetScanUrl(id){
  const base = window.location.origin + window.location.pathname;
  return `${base}?asset=${encodeURIComponent(id)}`;
}
function extractAssetIdFromScan(data){
  try{
    const url = new URL(data);
    const id = url.searchParams.get('asset');
    if(id) return id;
  } catch(e){ /* not a URL — fall through to treating it as a raw id */ }
  return data.trim();
}
function renderRealQr(containerId, text, size){
  const el = document.getElementById(containerId);
  if(!el || typeof QRCode === 'undefined') return;
  el.innerHTML = '';
  new QRCode(el, { text, width: size, height: size, correctLevel: QRCode.CorrectLevel.M });
}
function generateAllTileQrs(){
  assets.forEach(a=>renderRealQr('qr-' + a.id, assetScanUrl(a.id), 76));
}

function showToast(msg, isFail){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isFail?' fail-toast':'');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>{ t.className='toast'; }, 2600);
}
function esc(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function buildQrLabel(a){
  const cat = catOf(a.catId);
  return `
  <div class="qr-label">
    <div class="qr-label-strip"></div>
    <div class="qr-label-qr" id="label-qr-${a.id}"></div>
    <div class="qr-label-name">${esc(a.name)}</div>
    <div class="qr-label-id">${a.id}</div>
    <div class="qr-label-cat">${esc(cat?cat.name:'')} &middot; ${esc(a.location)}</div>
    <div class="qr-label-foot">סרוק לפני כל בדיקת בטיחות</div>
  </div>`;
}
function printSingleQr(assetId){
  const a = assets.find(x=>x.id===assetId);
  if(!a) return;
  document.getElementById('print-area').innerHTML = `<div class="print-sheet">${buildQrLabel(a)}</div>`;
  renderRealQr('label-qr-' + a.id, assetScanUrl(a.id), 130);
  window.print();
}
function printAllQr(){
  document.getElementById('print-area').innerHTML = `<div class="print-sheet grid">${assets.map(buildQrLabel).join('')}</div>`;
  assets.forEach(a=>renderRealQr('label-qr-' + a.id, assetScanUrl(a.id), 130));
  window.print();
}

/* ---------------- render root ---------------- */
function render(){
  document.getElementById('app-eyebrow').textContent = t('appEyebrow');
  document.getElementById('app-title').textContent = t('appTitle');
  document.getElementById('tab-field').textContent = t('tabField');
  document.getElementById('tab-admin').textContent = t('tabAdmin');
  document.getElementById('topbar-home').textContent = t('topbarHome');
  document.getElementById('lang-select').value = currentLang;
  document.getElementById('tab-field').className = mode==='field'?'active':'';
  document.getElementById('tab-admin').className = mode==='admin'?'active':'';
  const main = document.getElementById('main');
  if(mode===null) main.innerHTML = renderLanding();
  else if(mode==='field-login') main.innerHTML = renderFieldLogin();
  else if(mode==='lock') main.innerHTML = renderAdminLock();
  else if(mode==='supervisor-login') main.innerHTML = renderSupervisorLogin();
  else main.innerHTML = mode==='field' ? renderField() : renderAdmin();
  bindEvents();
}

/* ================= LANDING, WORKER LOGIN & ADMIN LOCK ================= */
function enterField(){
  mode = inspectorName ? 'field' : 'field-login';
  render();
}
function tryEnterAdmin(){ mode = adminUnlocked ? 'admin' : 'lock'; render(); }
function submitPassword(){
  const nameEl = document.getElementById('admin-name-input');
  const name = nameEl ? nameEl.value.trim() : '';
  adminNameDraft = name;

  if(!name){
    passwordError = t('workerLoginError');
    render();
    return;
  }
  if(!isLettersOnly(name)){
    passwordError = t('lettersOnlyError', t('fieldFullName'));
    render();
    return;
  }
  if(passwordDraft === '2424'){
    adminUnlocked = true;
    adminName = name;
    adminNameDraft = '';
    passwordError = '';
    passwordDraft = '';
    isReadOnly = false;
    adminTab = 'dashboard';
    mode = 'admin';
  } else {
    passwordError = t('adminLockError');
    passwordDraft = '';
  }
  render();
}
function submitSupervisorLogin(){
  const nameEl = document.getElementById('supervisor-name-input');
  const pwEl = document.getElementById('supervisor-password-input');
  const name = nameEl ? nameEl.value.trim() : '';
  const pw = pwEl ? pwEl.value : '';
  if(!name || !pw){
    supervisorLoginError = t('supervisorLoginError');
    render();
    return;
  }
  if(!isLettersOnly(name)){
    supervisorLoginError = t('lettersOnlyError', t('fieldFullName'));
    render();
    return;
  }
  if(pw !== '2424'){
    supervisorLoginError = t('adminLockError');
    render();
    return;
  }
  supervisorName = name;
  supervisorLoginError = '';
  isReadOnly = true;
  adminTab = 'dashboard';
  mode = 'admin';
  render();
}
function submitWorkerLogin(){
  const nameEl = document.getElementById('worker-name-input');
  const idEl = document.getElementById('worker-id-input');
  const deptEl = document.getElementById('worker-dept-input');
  const name = nameEl ? nameEl.value.trim() : '';
  const empId = idEl ? idEl.value.trim() : '';
  const dept = deptEl ? deptEl.value.trim() : '';

  if(!name || !empId || !dept){
    workerLoginError = t('workerLoginError');
    render();
    return;
  }
  if(!isLettersOnly(name)){
    workerLoginError = t('lettersOnlyError', t('fieldFullName'));
    render();
    return;
  }
  if(!isDigitsOnly(empId)){
    workerLoginError = t('digitsOnlyError', t('fieldEmployeeId'));
    render();
    return;
  }
  if(!isLettersOnly(dept)){
    workerLoginError = t('lettersOnlyError', t('fieldRole'));
    render();
    return;
  }
  inspectorName = name;
  workerEmployeeNumber = empId;
  workerDepartment = dept;
  workerLoginError = '';

  if(pendingScanAssetId){
    const asset = assets.find(a=>a.id === pendingScanAssetId);
    pendingScanAssetId = null;
    if(asset){ goToInspection(asset); return; }
  }
  mode = 'field';
  fieldScreen = 'scan';
  scanSelectedCategory = null;
  render();
}

function renderLanding(){
  return `
    <div class="landing-wrap">
      <div class="landing-card">
        <div class="landing-eyebrow">${t('landingChoose')}</div>
        <div class="landing-buttons">
          <button class="landing-btn field" id="landing-field">
            <span class="landing-icon">📱</span>
            <span class="landing-title">${t('landingFieldTitle')}</span>
            <span class="landing-sub">${t('landingFieldSub')}</span>
          </button>
          <button class="landing-btn admin" id="landing-admin">
            <span class="landing-icon">🔒</span>
            <span class="landing-title">${t('landingAdminTitle')}</span>
            <span class="landing-sub">${t('landingAdminSub')}</span>
          </button>
          <button class="landing-btn supervisor" id="landing-supervisor">
            <span class="landing-icon">🕵️</span>
            <span class="landing-title">${t('landingSupervisorTitle')}</span>
            <span class="landing-sub">${t('landingSupervisorSub')}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderFieldLogin(){
  return `
    <div class="landing-wrap">
      <div class="landing-card lock-card">
        <div class="landing-eyebrow">${t('workerLoginEyebrow')}</div>
        <h2 class="lock-title">${t('workerLoginTitle')}</h2>
        <div class="worker-form">
          <div>
            <label class="field-label" style="text-align:right;">${t('fieldFullName')}</label>
            <input type="text" id="worker-name-input" class="worker-input" placeholder="${t('placeholderName')}" value="${esc(inspectorName)}" />
          </div>
          <div>
            <label class="field-label" style="text-align:right;">${t('fieldEmployeeId')}</label>
            <input type="text" id="worker-id-input" class="worker-input ltr" placeholder="${t('placeholderId')}" value="${esc(workerEmployeeNumber)}" />
          </div>
          <div>
            <label class="field-label" style="text-align:right;">${t('fieldRole')}</label>
            <input type="text" id="worker-dept-input" class="worker-input" placeholder="${t('placeholderRole')}" value="${esc(workerDepartment)}" />
          </div>
        </div>
        ${workerLoginError ? `<div class="lock-error">${workerLoginError}</div>` : ''}
        <button class="submit-btn" id="worker-login-submit" style="margin-top:16px;">${t('workerLoginSubmit')}</button>
        <div class="back-link" id="worker-login-back" style="margin-top:16px;">${backArrow()} ${t('backLink')}</div>
      </div>
    </div>
  `;
}

function renderAdminLock(){
  return `
    <div class="landing-wrap">
      <div class="landing-card lock-card">
        <div class="landing-eyebrow">${t('adminLockEyebrow')}</div>
        <h2 class="lock-title">${t('adminLockTitle')}</h2>
        <div class="worker-form" style="margin-bottom:14px;">
          <div>
            <label class="field-label" style="text-align:right;">${t('fieldFullName')}</label>
            <input type="text" id="admin-name-input" class="worker-input" placeholder="${t('placeholderName')}" value="${esc(adminNameDraft)}" />
          </div>
        </div>
        <div class="lock-input-wrap">
          <input type="password" id="admin-password-input" class="lock-input" placeholder="••••" inputmode="numeric" autocomplete="off" />
          <button type="button" class="lock-eye-btn" id="toggle-password-visibility" aria-label="${t('showPassword')}">👁️</button>
        </div>
        ${passwordError ? `<div class="lock-error">${passwordError}</div>` : ''}
        <button class="submit-btn" id="admin-password-submit" style="margin-top:14px;">${t('adminLockSubmit')}</button>
        <div class="back-link" id="lock-back" style="margin-top:16px;">${backArrow()} ${t('backLink')}</div>
      </div>
    </div>
  `;
}

function renderSupervisorLogin(){
  return `
    <div class="landing-wrap">
      <div class="landing-card lock-card">
        <div class="landing-eyebrow">${t('supervisorLoginEyebrow')}</div>
        <h2 class="lock-title">${t('supervisorLoginTitle')}</h2>
        <div class="worker-form" style="margin-bottom:14px;">
          <div>
            <label class="field-label" style="text-align:right;">${t('fieldFullName')}</label>
            <input type="text" id="supervisor-name-input" class="worker-input" placeholder="${t('placeholderName')}" value="${esc(supervisorName)}" />
          </div>
        </div>
        <div class="lock-input-wrap">
          <input type="password" id="supervisor-password-input" class="lock-input" placeholder="••••" inputmode="numeric" autocomplete="off" />
          <button type="button" class="lock-eye-btn" id="toggle-supervisor-password-visibility" aria-label="${t('showPassword')}">👁️</button>
        </div>
        ${supervisorLoginError ? `<div class="lock-error">${supervisorLoginError}</div>` : ''}
        <button class="submit-btn" id="supervisor-login-submit" style="margin-top:16px;">${t('supervisorLoginSubmit')}</button>
        <div class="back-link" id="supervisor-login-back" style="margin-top:16px;">${backArrow()} ${t('backLink')}</div>
      </div>
    </div>
  `;
}

function bindLandingEvents(){
  const fieldBtn = document.getElementById('landing-field');
  if(fieldBtn) fieldBtn.addEventListener('click', ()=>{ mode='field-login'; workerLoginError=''; render(); });
  const adminBtn = document.getElementById('landing-admin');
  if(adminBtn) adminBtn.addEventListener('click', tryEnterAdmin);
  const supervisorBtn = document.getElementById('landing-supervisor');
  if(supervisorBtn) supervisorBtn.addEventListener('click', ()=>{ mode='supervisor-login'; supervisorLoginError=''; render(); });
}

function bindSupervisorLoginEvents(){
  const submitBtn = document.getElementById('supervisor-login-submit');
  if(submitBtn) submitBtn.addEventListener('click', submitSupervisorLogin);
  const input = document.getElementById('supervisor-name-input');
  if(input) input.addEventListener('keydown', e=>{ if(e.key==='Enter') submitSupervisorLogin(); });
  const pwInput = document.getElementById('supervisor-password-input');
  if(pwInput) pwInput.addEventListener('keydown', e=>{ if(e.key==='Enter') submitSupervisorLogin(); });
  const toggleBtn = document.getElementById('toggle-supervisor-password-visibility');
  if(toggleBtn && pwInput){
    toggleBtn.addEventListener('click', ()=>{
      const showing = pwInput.type === 'text';
      pwInput.type = showing ? 'password' : 'text';
      toggleBtn.textContent = showing ? '👁️' : '🙈';
      toggleBtn.setAttribute('aria-label', showing ? t('showPassword') : t('hidePassword'));
      pwInput.focus();
    });
  }
  const backBtn = document.getElementById('supervisor-login-back');
  if(backBtn) backBtn.addEventListener('click', ()=>{ mode=null; supervisorLoginError=''; render(); });
}

function bindLockEvents(){
  const nameInput = document.getElementById('admin-name-input');
  if(nameInput) nameInput.addEventListener('input', e=>{ adminNameDraft = e.target.value; });
  const input = document.getElementById('admin-password-input');
  if(input){
    input.focus();
    input.addEventListener('input', e=>{ passwordDraft = e.target.value; });
    input.addEventListener('keydown', e=>{ if(e.key==='Enter') submitPassword(); });
  }
  const toggleBtn = document.getElementById('toggle-password-visibility');
  if(toggleBtn && input){
    toggleBtn.addEventListener('click', ()=>{
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      toggleBtn.textContent = showing ? '👁️' : '🙈';
      toggleBtn.setAttribute('aria-label', showing ? t('showPassword') : t('hidePassword'));
      input.focus();
    });
  }
  const submitBtn = document.getElementById('admin-password-submit');
  if(submitBtn) submitBtn.addEventListener('click', submitPassword);
  const backBtn = document.getElementById('lock-back');
  if(backBtn) backBtn.addEventListener('click', ()=>{ mode=null; passwordError=''; passwordDraft=''; adminNameDraft=''; render(); });
}

function bindFieldLoginEvents(){
  const submitBtn = document.getElementById('worker-login-submit');
  if(submitBtn) submitBtn.addEventListener('click', submitWorkerLogin);
  ['worker-name-input','worker-id-input','worker-dept-input'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('keydown', e=>{ if(e.key==='Enter') submitWorkerLogin(); });
  });
  const backBtn = document.getElementById('worker-login-back');
  if(backBtn) backBtn.addEventListener('click', ()=>{ mode=null; workerLoginError=''; render(); });
}

/* ================= FIELD RENDER ================= */
function renderField(){
  const firstName = (inspectorName || '').trim().split(' ')[0] || '';
  const titles = {
    scan: { eyebrow:t('scanEyebrow'), h2: firstName ? t('scanTitleHello', firstName) : t('scanTitleGeneric') },
    camera: { eyebrow:t('cameraEyebrow'), h2:t('cameraTitle') },
    photo: { eyebrow:t('photoEyebrow'), h2:t('photoTitle') },
    form: { eyebrow:t('formEyebrow'), h2:t('formTitle') },
    'obs-entry': { eyebrow:'תצפיות על עובדים', h2:'על מי מתבצעת התצפית?' },
    'obs-form': { eyebrow:'תצפית בטיחות', h2:'צ׳ק ליסט תצפית' },
  };
  const screenText = titles[fieldScreen];
  return `
  <div class="field-wrap">
    <div class="phone">
      <div class="phone-screen">
        <div class="field-header">
          <div class="field-header-top">
            <button class="entry-back-btn" id="back-to-entry">${backArrow()} ${t('backToEntry').replace(/^[⟵→←]\s*/, '')}</button>
          </div>
          <div class="eyebrow">${screenText.eyebrow}</div>
          <h2>${screenText.h2}</h2>
          ${fieldScreen!=='camera' && fieldScreen!=='photo' ? `
          <div class="inspector-row">
            <span class="inspector-badge">👤 ${esc(inspectorName)}</span>
            <span class="inspector-badge ltr">#${esc(workerEmployeeNumber)}</span>
            <span class="inspector-badge">${esc(workerDepartment)}</span>
          </div>` : ''}
        </div>
        <div class="field-body">
          ${fieldScreen==='scan' ? renderScanScreen()
            : fieldScreen==='camera' ? renderCameraScreen()
            : fieldScreen==='photo' ? renderPhotoScreen()
            : fieldScreen==='obs-entry' ? renderObsEntryScreen()
            : fieldScreen==='obs-form' ? renderObsFormScreen()
            : renderFormScreen()}
        </div>
      </div>
    </div>
  </div>`;
}

function categoryIcon(catId){
  const map = { ext:'🧯', shower:'🚿', cabinet:'⚡', shelter:'🛡️', aed:'🫀' };
  return map[catId] || '📁';
}

function observationsThisMonthCount(){
  const now = new Date();
  return observationLogs.filter(o=>{
    const d = new Date(o.at.replace(' ','T'));
    return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth();
  }).length;
}

function renderScanScreen(){
  if(!scanSelectedCategory){
    const folders = categories.map(c=>{
      const catAssets = assetsIn(c.id);
      const pending = catAssets.filter(a=>a.status==='pending').length;
      return `
      <div class="folder-tile" data-catfolder="${c.id}">
        <div class="folder-icon">${categoryIcon(c.id)}</div>
        <div class="folder-name">בדיקת ${esc(c.name)}</div>
        <div class="folder-count">${catAssets.length} פריטים${pending?` &middot; ${pending} ממתינים`:''}</div>
      </div>`;
    }).join('');
    const obsCount = observationsThisMonthCount();
    const obsFolder = `
      <div class="folder-tile obs-folder" data-obsfolder="1">
        <div class="folder-icon">👁️</div>
        <div class="folder-name">תצפיות על עובדים</div>
        <div class="folder-count ${obsCount>=OBS_MONTHLY_GOAL?'obs-met':'obs-open'}">${obsCount}/${OBS_MONTHLY_GOAL} החודש</div>
      </div>`;
    return `
      <p class="scan-instruction">לחץ <b>סרוק עם מצלמה</b> לסריקה אמיתית, או בחר תיקייה כדי לראות את הפריטים שבה.</p>
      <button class="scan-btn camera" id="open-camera">📷 סרוק עם מצלמה</button>
      <div class="folder-grid">${folders}${obsFolder}</div>
    `;
  }

  const cat = catOf(scanSelectedCategory);
  const catAssets = assetsIn(scanSelectedCategory);
  const tiles = catAssets.map(a=>`
    <div class="qr-tile" data-asset="${a.id}">
      <div class="qr-code" id="qr-${a.id}"></div>
      <div class="a-name">${esc(a.name)}</div>
      <div class="a-id ltr">${a.id}</div>
      <span class="a-status ${statusClass(a.status)}">${statusLabel(a.status)}</span>
    </div>`).join('') || `<div class="empty-state" style="grid-column:1/-1;">אין פריטים בקטגוריה זו.</div>`;
  return `
    <div class="back-link" id="back-to-folders">${backArrow()} חזרה לתיקיות</div>
    <p class="scan-instruction"><b>${categoryIcon(cat.id)} ${esc(cat.name)}</b> — הקש על אריח לדימוי סריקה, או השתמש במצלמה.</p>
    <button class="scan-btn camera" id="open-camera">📷 סרוק עם מצלמה</button>
    <div class="qr-grid">${tiles}</div>
  `;
}

function renderCameraScreen(){
  return `
    <div class="camera-wrap">
      <video id="qr-video" playsinline muted></video>
      <div class="camera-frame"></div>
      <canvas id="qr-canvas" style="display:none;"></canvas>
    </div>
    <div class="camera-status" id="camera-status">מבקש הרשאת מצלמה...</div>
    <button class="submit-btn" id="cancel-camera" style="border-top-color:var(--red);">ביטול — חזרה לרשימה</button>
  `;
}

function renderPhotoScreen(){
  const cat = catOf(selectedAsset.catId);
  const itemText = (cat.checklist || [])[photoCaptureIndex] || '';
  return `
    <p class="scan-instruction"><b>תיעוד עבור:</b> ${esc(itemText)}</p>
    <div class="camera-wrap">
      <video id="photo-video" playsinline muted></video>
      <canvas id="photo-canvas" style="display:none;"></canvas>
    </div>
    <div class="camera-status" id="photo-status">מבקש הרשאת מצלמה...</div>
    <button class="scan-btn camera" id="capture-photo">📸 צלם תמונה</button>
    <button class="submit-btn" id="cancel-photo" style="border-top-color:var(--red);">ביטול — חזרה לטופס</button>
  `;
}

function renderObsEntryScreen(){
  const count = observationsThisMonthCount();
  const recent = observationLogs.slice(0,5).map(o=>`
    <div class="obs-recent-row">
      <span class="obs-recent-name">${esc(o.employeeName)}</span>
      <span class="badge ${logBadgeClass(o.result)}">${statusLabel(o.result)}</span>
      <span class="mono ltr" style="font-size:10px; color:var(--gray);">${o.at.split(' ')[0]}</span>
    </div>`).join('') || `<div class="empty-state" style="padding:10px;">אין עדיין תצפיות החודש.</div>`;

  return `
    <div class="obs-progress-banner ${count>=OBS_MONTHLY_GOAL?'met':''}">
      <b>${count}/${OBS_MONTHLY_GOAL}</b> תצפיות בוצעו החודש ${count>=OBS_MONTHLY_GOAL?'— היעד הושג! 🎉':'— היעד החודשי'}
    </div>
    <div>
      <span class="field-label">שם העובד לתצפית</span>
      <input type="text" id="obs-name-input" class="worker-input" placeholder="לדוגמה: רון אביטן" value="${esc(observationEmployeeName)}" />
      ${observationNameError ? `<div class="lock-error" style="margin-top:8px;">${observationNameError}</div>` : ''}
    </div>
    <button class="submit-btn" id="obs-start-btn" style="margin-top:4px;">התחל תצפית ${backArrow()==='→'?'⟵':'⟶'}</button>

    <div class="obs-recent-section">
      <span class="field-label" style="margin-bottom:6px;">תצפיות אחרונות</span>
      ${recent}
    </div>
  `;
}

function renderObsFormScreen(){
  const answeredCount = OBS_CHECKLIST.filter((_,i)=>checklistStatus[i]).length;
  const allAnswered = answeredCount===OBS_CHECKLIST.length;
  const hasFail = OBS_CHECKLIST.some((_,i)=>checklistStatus[i]==='fail');
  formResult = allAnswered ? (hasFail?'fail':'pass') : null;

  const checklistHtml = `
    <div class="checklist-box">
      <div class="checklist-head">
        <span class="field-label" style="margin-bottom:0;">צ׳ק ליסט תצפית</span>
        <span class="checklist-count">${answeredCount}/${OBS_CHECKLIST.length}</span>
      </div>
      ${OBS_CHECKLIST.map((item,i)=>{
        const st = checklistStatus[i];
        return `
        <div class="chk-row-v2">
          <div class="chk-row-text">${esc(item)}</div>
          <div class="chk-row-actions">
            <button class="chk-mini pass ${st==='pass'?'sel':''}" data-item="${i}" data-val="pass">✓ תקין</button>
            <button class="chk-mini fail ${st==='fail'?'sel':''}" data-item="${i}" data-val="fail">✕ לא תקין</button>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  const resultSummary = `
    <div class="result-summary ${formResult==='pass'?'ok':formResult==='fail'?'bad':'wait'}">
      ${formResult==='pass' ? '✓ כל הסעיפים תקינים — התצפית תירשם כתקינה' :
        formResult==='fail' ? '✕ נמצא/ו סעיף/ים לא תקינים — התצפית תירשם כלא תקינה' :
        `יש לענות על כל ${OBS_CHECKLIST.length} סעיפי הצ׳ק ליסט`}
    </div>
  `;

  return `
    <div class="back-link" id="back-to-obs-entry">${backArrow()} חזרה</div>
    <div class="asset-card">
      <div class="a-type">תצפית בטיחות</div>
      <h3>👁️ ${esc(observationEmployeeName)}</h3>
    </div>

    ${checklistHtml}
    ${resultSummary}

    <div>
      <span class="field-label">הערות (אופציונלי)</span>
      <textarea class="comment" id="obs-comment-input" placeholder="פרט כל תצפית חריגה...">${esc(window.__obsDraftComment||'')}</textarea>
    </div>

    <button class="submit-btn" id="submit-observation" ${formResult?'':'disabled'}>שלח תצפית</button>
  `;
}

function renderFormScreen(){
  const a = selectedAsset;
  const cat = catOf(a.catId);
  const checklist = cat.checklist || [];
  const answeredCount = checklist.filter((_,i)=>checklistStatus[i]).length;
  const allAnswered = checklist.length===0 || answeredCount===checklist.length;
  const isExpired = expiryStatus(a.expiryDate) === 'expired';
  const checklistHasFail = checklist.some((_,i)=>checklistStatus[i]==='fail');
  const hasFail = checklistHasFail || isExpired;

  // With a checklist, the overall result is derived automatically — a
  // single "not okay" line makes the whole inspection "not okay". An
  // expired equipment date always forces a fail, even if every checklist
  // row was (mistakenly or not) marked okay — the system doesn't just
  // trust the worker's answer when it already knows the real date.
  if(checklist.length>0){
    formResult = allAnswered ? (hasFail ? 'fail' : 'pass') : null;
  }

  const checklistHtml = checklist.length ? `
    <div class="checklist-box">
      <div class="checklist-head">
        <span class="field-label" style="margin-bottom:0;">צ'ק ליסט — סמן כל שורה בנפרד</span>
        <span class="checklist-count">${answeredCount}/${checklist.length}</span>
      </div>
      ${checklist.map((item,i)=>{
        const st = checklistStatus[i];
        const photo = checklistPhoto[i];
        return `
        <div class="chk-row-v2">
          <div class="chk-row-text">${esc(item)}</div>
          <div class="chk-row-actions">
            <button class="chk-mini pass ${st==='pass'?'sel':''}" data-item="${i}" data-val="pass">✓ תקין</button>
            <button class="chk-mini fail ${st==='fail'?'sel':''}" data-item="${i}" data-val="fail">✕ לא תקין</button>
          </div>
          ${st==='fail' ? `
            <div class="chk-photo-row">
              <button class="chk-photo-btn ${photo?'on':''}" data-photoitem="${i}">
                ${photo ? '🔄 החלף תמונה' : '📷 צרף תמונה לסעיף זה'}
              </button>
              ${photo ? `
                <img class="chk-photo-thumb" src="${photo}" alt="תמונה שצורפה לסעיף"/>
                <button class="chk-photo-remove" data-photoremove="${i}" title="הסר תמונה">✕</button>
              ` : ''}
            </div>
          ` : ''}
        </div>`;
      }).join('')}
    </div>
  ` : '';

  const resultSummary = checklist.length>0 ? `
    <div class="result-summary ${formResult==='pass'?'ok':formResult==='fail'?'bad':'wait'}">
      ${formResult==='pass' ? '✓ כל הסעיפים תקינים — תוצאת הבדיקה: תקין' :
        formResult==='fail' ? (
          isExpired && !checklistHasFail
            ? `⚠ הציוד פג תוקף (${esc(a.expiryDate)}) — תוצאת הבדיקה: לא תקין, גם אם כל הסעיפים סומנו כתקינים`
            : '✕ נמצא/ו סעיף/ים לא תקינים — תוצאת הבדיקה: לא תקין'
        ) :
        `יש לענות על כל ${checklist.length} סעיפי הצ׳ק ליסט כדי לקבוע תוצאה`}
    </div>
  ` : `
    <div>
      <span class="field-label">תוצאה</span>
      <div class="pf-row">
        <button class="pf-btn pass ${formResult==='pass'?'sel':''}" data-r="pass">✓ תקין</button>
        <button class="pf-btn fail ${formResult==='fail'?'sel':''}" data-r="fail">✕ לא תקין</button>
      </div>
    </div>
  `;

  const expSt = expiryStatus(a.expiryDate);
  const expDisplay = a.expiryDate
    ? `<span class="mono ltr">${a.expiryDate}</span> <span class="badge exp-${expSt}" style="margin-right:4px;">${expSt==='expired'?'⚠ פג תוקף':expSt==='soon'?'⏳ פג בקרוב':'✓ בתוקף'}</span>`
    : `<span style="color:var(--gray)">לא הוגדר</span>`;

  return `
    <div class="back-link" id="back-to-scan">&rarr; חזרה למסך בדיקות</div>
    <div class="asset-card">
      <div class="a-type">${esc(cat.name)}</div>
      <h3>${esc(a.name)}</h3>
      <div class="asset-meta">
        <div><span class="k">מזהה</span><span class="mono ltr">${a.id}</span></div>
        <div><span class="k">מיקום</span><span>${esc(a.location)}</span></div>
        <div><span class="k">תדירות</span><span>${cat.frequency}</span></div>
        <div><span class="k">תוקף</span><span>${expDisplay}</span></div>
      </div>
    </div>

    ${checklistHtml}
    ${resultSummary}

    <div>
      <span class="field-label">הערות (אופציונלי)</span>
      <textarea class="comment" id="comment-input" placeholder="רשום כל בעיה, לדוגמה: מד לחץ נמוך, אטם שבור...">${esc(window.__draftComment||'')}</textarea>
    </div>

    <button class="submit-btn" id="submit-inspection" ${formResult?'':'disabled'}>שלח בדיקה</button>
  `;
}

function renderFieldEvents(){
  if(fieldScreen==='scan') generateAllTileQrs();

  const backToEntry = document.getElementById('back-to-entry');
  if(backToEntry) backToEntry.addEventListener('click', ()=>{
    stopCameraStream();
    mode = null;
    fieldScreen = 'scan';
    scanSelectedCategory = null;
    render();
  });

  document.querySelectorAll('[data-catfolder]').forEach(el=>{
    el.addEventListener('click', ()=>{
      scanSelectedCategory = el.getAttribute('data-catfolder');
      render();
    });
  });
  const backToFolders = document.getElementById('back-to-folders');
  if(backToFolders) backToFolders.addEventListener('click', ()=>{
    scanSelectedCategory = null;
    render();
  });

  const obsFolder = document.querySelector('[data-obsfolder]');
  if(obsFolder) obsFolder.addEventListener('click', ()=>{
    observationEmployeeName = '';
    observationNameError = '';
    fieldScreen = 'obs-entry';
    render();
  });

  const obsNameInput = document.getElementById('obs-name-input');
  if(obsNameInput) obsNameInput.addEventListener('input', e=>{ observationEmployeeName = e.target.value; });

  const obsStartBtn = document.getElementById('obs-start-btn');
  if(obsStartBtn) obsStartBtn.addEventListener('click', ()=>{
    const nameEl = document.getElementById('obs-name-input');
    const name = nameEl ? nameEl.value.trim() : '';
    if(!name){ observationNameError = 'יש להזין שם עובד'; render(); return; }
    if(!isLettersOnly(name)){ observationNameError = t('lettersOnlyError', 'שם העובד'); render(); return; }
    observationEmployeeName = name;
    observationNameError = '';
    checklistStatus = {};
    checklistPhoto = {};
    window.__obsDraftComment = '';
    fieldScreen = 'obs-form';
    render();
  });

  const backToObsEntry = document.getElementById('back-to-obs-entry');
  if(backToObsEntry) backToObsEntry.addEventListener('click', ()=>{ fieldScreen = 'obs-entry'; render(); });

  const obsCommentInput = document.getElementById('obs-comment-input');
  if(obsCommentInput) obsCommentInput.addEventListener('input', e=>{ window.__obsDraftComment = e.target.value; });

  const submitObsBtn = document.getElementById('submit-observation');
  if(submitObsBtn) submitObsBtn.addEventListener('click', ()=>{
    if(!formResult) return;
    const stamp = nowStamp();
    const failedItems = OBS_CHECKLIST.filter((_,i)=>checklistStatus[i]==='fail');
    let comment = window.__obsDraftComment || '';
    if(failedItems.length){
      comment += (comment?' | ':'') + 'סעיפים לא תקינים: ' + failedItems.join('; ');
    }
    const answers = OBS_CHECKLIST.map((q,i)=>({ text:q, status:checklistStatus[i]||null, photo:null }));
    observationLogs.unshift({
      id: 'obs-' + Date.now(),
      employeeName: observationEmployeeName,
      worker: inspectorName || 'בודק שטח',
      workerId: workerEmployeeNumber,
      at: stamp,
      result: formResult,
      comment,
      answers,
    });
    showToast(`תצפית על ${observationEmployeeName} נרשמה כ${statusLabel(formResult)}`, formResult==='fail');
    observationEmployeeName = '';
    checklistStatus = {};
    checklistPhoto = {};
    fieldScreen = 'obs-entry';
    render();
  });

  document.querySelectorAll('.qr-tile').forEach(el=>{
    el.addEventListener('click', ()=>{
      const id = el.getAttribute('data-asset');
      goToInspection(assets.find(a=>a.id===id));
    });
  });
  const openCamera = document.getElementById('open-camera');
  if(openCamera) openCamera.addEventListener('click', ()=>{
    fieldScreen = 'camera';
    render();
  });
  const cancelCamera = document.getElementById('cancel-camera');
  if(cancelCamera) cancelCamera.addEventListener('click', ()=>{
    stopCameraStream();
    fieldScreen = 'scan';
    render();
  });
  if(fieldScreen==='camera') startCameraScan();

  const capturePhotoBtn = document.getElementById('capture-photo');
  if(capturePhotoBtn) capturePhotoBtn.addEventListener('click', capturePhoto);
  const cancelPhoto = document.getElementById('cancel-photo');
  if(cancelPhoto) cancelPhoto.addEventListener('click', ()=>{
    stopCameraStream();
    fieldScreen = 'form';
    render();
  });
  if(fieldScreen==='photo') startPhotoCamera();

  const back = document.getElementById('back-to-scan');
  if(back) back.addEventListener('click', ()=>{ fieldScreen='scan'; render(); });

  document.querySelectorAll('.chk-mini').forEach(el=>{
    el.addEventListener('click', ()=>{
      const i = el.getAttribute('data-item');
      const val = el.getAttribute('data-val');
      checklistStatus[i] = checklistStatus[i]===val ? undefined : val;
      if(checklistStatus[i]!=='fail') delete checklistPhoto[i];
      render();
    });
  });

  document.querySelectorAll('[data-photoitem]').forEach(el=>{
    el.addEventListener('click', ()=>{
      photoCaptureIndex = parseInt(el.getAttribute('data-photoitem'), 10);
      fieldScreen = 'photo';
      render();
    });
  });

  document.querySelectorAll('[data-photoremove]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.stopPropagation();
      const i = el.getAttribute('data-photoremove');
      delete checklistPhoto[i];
      render();
    });
  });

  document.querySelectorAll('.pf-btn').forEach(el=>{
    el.addEventListener('click', ()=>{ formResult = el.getAttribute('data-r'); render(); });
  });

  const commentInput = document.getElementById('comment-input');
  if(commentInput) commentInput.addEventListener('input', e=>{ window.__draftComment = e.target.value; });

  const submitBtn = document.getElementById('submit-inspection');
  if(submitBtn) submitBtn.addEventListener('click', ()=>{
    if(!formResult) return;
    const a = selectedAsset;
    const cat = catOf(a.catId);
    const stamp = nowStamp();
    a.status = formResult;
    a.lastBy = inspectorName || 'בודק שטח';
    a.lastAt = stamp;

    const checklist = cat.checklist || [];
    const failedItems = checklist.filter((_,i)=>checklistStatus[i]==='fail');
    const photoCount = Object.values(checklistPhoto).filter(Boolean).length;
    const expiredOverride = formResult==='fail' && expiryStatus(a.expiryDate)==='expired' && failedItems.length===0;
    let comment = window.__draftComment || '';
    if(failedItems.length){
      comment += (comment?' | ':'') + 'סעיפים לא תקינים: ' + failedItems.join('; ');
    }
    if(expiredOverride){
      comment += (comment?' | ':'') + `הבדיקה סומנה לא תקינה אוטומטית עקב פג תוקף (${a.expiryDate})`;
    }
    if(photoCount){
      comment += ` [${photoCount} תמונות מצורפות]`;
    }

    const answers = checklist.map((item,i)=>({
      text: item,
      status: checklistStatus[i] || null,
      photo: checklistPhoto[i] || null,
    }));

    logs.unshift({ asset:a.id, name:a.name, catName:cat.name, worker:a.lastBy, workerId:workerEmployeeNumber, at:stamp, result:formResult, comment, answers });
    fieldScreen = 'scan';
    render();
    showToast(`${a.id} נרשם כ${statusLabel(formResult)}`, formResult==='fail');
  });
}

function goToInspection(asset){
  selectedAsset = asset;
  formResult = null;
  checklistStatus = {};
  checklistPhoto = {};
  window.__draftComment = '';
  fieldScreen = 'form';
  render();
}

/* ---------------- camera QR scanning ---------------- */
function stopCameraStream(){
  if(window.__cameraStream){
    window.__cameraStream.getTracks().forEach(t=>t.stop());
    window.__cameraStream = null;
  }
  window.__cameraScanning = false;
}

async function startPhotoCamera(){
  const video = document.getElementById('photo-video');
  const statusEl = document.getElementById('photo-status');
  if(!video || !statusEl) return;

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    statusEl.textContent = 'הדפדפן הזה לא תומך בגישה למצלמה מהעמוד הזה. ודא שאתה נכנס דרך כתובת http/https אמיתית ולא כקובץ מקומי.';
    return;
  }
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    window.__cameraStream = stream;
    video.srcObject = stream;
    await video.play();
    statusEl.textContent = 'כוון את המצלמה לליקוי ולחץ על "צלם תמונה"';
  } catch(err){
    statusEl.textContent = 'לא ניתן לגשת למצלמה. ודא שאישרת הרשאת מצלמה בדפדפן, ושהעמוד נטען דרך כתובת אינטרנט אמיתית (לא נפתח כקובץ מקומי).';
  }
}

function capturePhoto(){
  const video = document.getElementById('photo-video');
  const canvas = document.getElementById('photo-canvas');
  if(!video || !canvas || !video.videoWidth) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  checklistPhoto[photoCaptureIndex] = canvas.toDataURL('image/jpeg', 0.85);
  stopCameraStream();
  fieldScreen = 'form';
  render();
  showToast('התמונה צולמה וצורפה לסעיף', false);
}

async function startCameraScan(){
  const video = document.getElementById('qr-video');
  const canvas = document.getElementById('qr-canvas');
  const statusEl = document.getElementById('camera-status');
  if(!video || !canvas || !statusEl) return;
  const ctx = canvas.getContext('2d');

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    statusEl.textContent = 'הדפדפן הזה לא תומך בגישה למצלמה מהעמוד הזה. ודא שאתה נכנס דרך כתובת http/https אמיתית ולא כקובץ מקומי.';
    return;
  }
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    window.__cameraStream = stream;
    video.srcObject = stream;
    await video.play();
    statusEl.textContent = 'מחפש קוד QR...';
    window.__cameraScanning = true;
    requestAnimationFrame(scanFrame);
  } catch(err){
    statusEl.textContent = 'לא ניתן לגשת למצלמה. ודא שאישרת הרשאת מצלמה בדפדפן, ושהעמוד נטען דרך כתובת אינטרנט אמיתית (לא נפתח כקובץ מקומי).';
  }

  function scanFrame(){
    if(!window.__cameraScanning) return;
    if(video.readyState === video.HAVE_ENOUGH_DATA && typeof jsQR !== 'undefined'){
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if(code && code.data){
        const asset = assets.find(a=>a.id === extractAssetIdFromScan(code.data));
        if(asset){
          window.__cameraScanning = false;
          stopCameraStream();
          goToInspection(asset);
          return;
        } else {
          statusEl.textContent = `קוד נסרק אך לא זוהה במערכת: ${code.data}`;
        }
      }
    }
    requestAnimationFrame(scanFrame);
  }
}

/* ================= ADMIN RENDER ================= */
function renderAdmin(){
  const tabLabels = { dashboard:t('tabDashboard'), assets:t('tabAssets'), categories:t('tabCategories'), workers:t('tabWorkers'), audit:'מעקב ושינויים', history:t('tabHistory'), export:t('tabExport') };
  return `
  <div class="admin-wrap">
    <div class="sidebar">
      ${Object.keys(tabLabels).map(key=>`
        <div class="s-item ${adminTab===key?'active':''}" data-tab="${key}">${tabLabels[key]}</div>
      `).join('')}
    </div>
    <div class="admin-content">
      ${isReadOnly ? `<div class="readonly-banner">${t('readOnlyBadge', esc(supervisorName))}</div>` : ''}
      ${adminTab==='dashboard' ? renderDashboardTab() : ''}
      ${adminTab==='assets' ? renderAssetsTab() : ''}
      ${adminTab==='categories' ? renderCategoriesTab() : ''}
      ${adminTab==='workers' ? renderWorkersTab() : ''}
      ${adminTab==='audit' ? renderAuditTab() : ''}
      ${adminTab==='history' ? renderHistoryTab() : ''}
      ${adminTab==='export' ? renderExportTab() : ''}
    </div>
  </div>
  ${renderInspectionModal(openInspectionLog)}
  ${renderCategoryModal(openCategoryDrilldown)}
  ${renderWorkerModal(openWorkerDrilldown)}
  ${renderObsListModal()}
  ${renderObservationDetailModal()}`;
}

function renderInspectionModal(log){
  if(!log) return '';
  const answers = log.answers || [];
  return `
  <div class="modal-backdrop" id="modal-backdrop">
    <div class="modal-box" id="modal-box">
      <div class="modal-head">
        <div>
          <div class="modal-eyebrow">${esc(log.catName||'')} &middot; <span class="ltr">${log.asset}</span></div>
          <h3>${esc(log.name)}</h3>
        </div>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <div class="modal-meta">
        <span class="mono ltr">🕒 ${log.at}</span>
        <span>👤 ${esc(log.worker)}${log.workerId ? ` <span class="mono ltr">(#${esc(log.workerId)})</span>` : ''}</span>
        <span class="badge ${logBadgeClass(log.result)}">${statusLabel(log.result)}</span>
      </div>
      ${answers.length ? `
        <div class="modal-checklist">
          ${answers.map(a=>`
            <div class="modal-chk-row ${a.status==='fail'?'bad':a.status==='pass'?'ok':''}">
              <span class="modal-chk-icon">${a.status==='fail'?'✕':a.status==='pass'?'✓':'—'}</span>
              <span class="modal-chk-text">${esc(a.text)}</span>
              ${a.photo ? `<img class="modal-chk-thumb" src="${a.photo}" alt="תמונה שצורפה"/>` : ''}
            </div>
          `).join('')}
        </div>
      ` : log.result==='resolved'
          ? `<div class="empty-state">זהו רישום טיפול ידני של מנהל — אין צ׳ק ליסט לבדיקה חוזרת מלאה.</div>`
          : `<div class="empty-state">אין פירוט צ׳ק ליסט זמין לבדיקה זו (בדיקה ישנה מלפני התוספת).</div>`}
      ${log.comment ? `<div class="modal-comment"><b>הערות:</b> ${esc(log.comment)}</div>` : ''}
    </div>
  </div>`;
}

function renderCategoryModal(catId){
  if(!catId) return '';
  const cat = catOf(catId);
  if(!cat) return '';
  const catAssets = assetsIn(catId);
  const done = catAssets.filter(a=>a.status!=='pending');
  const pending = catAssets.filter(a=>a.status==='pending');

  const rowHtml = (a, showDate) => {
    const log = logs.find(l=>l.asset===a.id);
    const logIndex = log ? logs.indexOf(log) : -1;
    return `
    <div class="drill-row ${logIndex>=0 ? 'clickable-row' : ''}" ${logIndex>=0 ? `data-openlog="${logIndex}"` : ''}>
      <div class="drill-row-main">
        <span class="drill-row-name">${esc(a.name)}</span>
        <span class="drill-row-id mono ltr">${a.id}</span>
      </div>
      <div class="drill-row-side">
        ${showDate
          ? `<span class="badge ${statusClass(a.status)}">${statusLabel(a.status)}</span><span class="drill-row-date mono ltr">${a.lastAt||''}</span>`
          : `<span class="drill-row-loc">${esc(a.location)}</span>`}
      </div>
    </div>`;
  };

  return `
  <div class="modal-backdrop" id="cat-modal-backdrop">
    <div class="modal-box" id="cat-modal-box">
      <div class="modal-head">
        <div>
          <div class="modal-eyebrow">מחזור ${cat.frequency}</div>
          <h3>${esc(cat.name)}</h3>
        </div>
        <button class="modal-close" id="cat-modal-close">✕</button>
      </div>
      <div class="modal-meta">
        <span>${done.length}/${catAssets.length} נבדקו במחזור הנוכחי</span>
      </div>

      <div class="drill-section">
        <div class="drill-section-title ok">✓ נבדקו (${done.length})</div>
        ${done.length ? done.map(a=>rowHtml(a, true)).join('') : `<div class="empty-state" style="padding:14px;">אף פריט לא נבדק עדיין במחזור זה</div>`}
      </div>

      <div class="drill-section">
        <div class="drill-section-title wait">⏳ ממתינים לבדיקה (${pending.length})</div>
        ${pending.length ? pending.map(a=>rowHtml(a, false)).join('') : `<div class="empty-state" style="padding:14px;">כל הפריטים נבדקו במחזור זה 🎉</div>`}
      </div>
    </div>
  </div>`;
}

function workerStats(){
  const statsMap = {};
  logs.forEach(l=>{
    if(l.result!=='pass' && l.result!=='fail') return; // real inspections only, not admin "resolved" actions
    const key = l.worker || 'לא ידוע';
    if(!statsMap[key]){
      statsMap[key] = { name:l.worker, workerId:l.workerId||null, total:0, pass:0, fail:0, lastAt:null, categories:new Set() };
    }
    const s = statsMap[key];
    s.total++;
    if(l.result==='pass') s.pass++; else s.fail++;
    if(!s.lastAt || l.at > s.lastAt) s.lastAt = l.at;
    if(l.workerId && !s.workerId) s.workerId = l.workerId;
    if(l.catName) s.categories.add(l.catName);
  });
  return Object.values(statsMap).sort((a,b)=>b.total-a.total);
}

function renderWorkersTab(){
  const workers = workerStats();
  const totalWorkers = workers.length;
  const totalInspections = workers.reduce((sum,w)=>sum+w.total,0);
  const avgPerWorker = totalWorkers ? Math.round((totalInspections/totalWorkers)*10)/10 : 0;
  const topWorker = workers[0];

  const summaryCards = `
    <div class="cards-row">
      <div class="prog-card">
        <div class="cat-name">בודקים פעילים</div>
        <div class="cat-num">${totalWorkers}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">סה״כ בדיקות שבוצעו</div>
        <div class="cat-num">${totalInspections}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">ממוצע בדיקות לעובד</div>
        <div class="cat-num">${avgPerWorker}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">הבודק הפעיל ביותר</div>
        <div class="cat-num" style="font-size:16px;">${topWorker ? esc(topWorker.name) : '—'}</div>
      </div>
    </div>
  `;

  const rows = workers.map((w,idx)=>{
    const passRate = w.total ? Math.round((w.pass/w.total)*100) : 0;
    const barColor = passRate < 70 ? 'var(--red)' : passRate < 100 ? 'var(--yellow)' : 'var(--green)';
    return `
    <tr class="clickable-row" data-workerdrill="${esc(w.name)}">
      <td>${idx===0 ? '🏆 ' : ''}${esc(w.name)}</td>
      <td class="mono-cell ltr">${w.workerId ? '#'+esc(w.workerId) : '—'}</td>
      <td class="mono-cell">${w.total}</td>
      <td><span class="badge st-pass">${w.pass}</span></td>
      <td><span class="badge st-fail">${w.fail}</span></td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="prog-bar-bg" style="width:70px;"><div class="prog-bar-fill" style="width:${passRate}%; background:${barColor};"></div></div>
          <span class="mono" style="font-size:10.5px; color:var(--gray);">${passRate}%</span>
        </div>
      </td>
      <td class="mono-cell ltr">${w.lastAt || '—'}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="7" class="empty-state">עדיין אין בדיקות רשומות במערכת.</td></tr>`;

  return `
    <h2 class="page-title">בודקים</h2>
    <div class="page-sub">מעקב אחר פעילות בודקי השטח — לחץ על שורה לצפייה בהיסטוריה המלאה של אותו בודק.</div>
    ${summaryCards}
    <div class="table-wrap">
      <table>
        <thead><tr><th>שם הבודק</th><th>מס׳ עובד</th><th>סה״כ בדיקות</th><th>תקין</th><th>לא תקין</th><th>אחוז תקינות</th><th>פעילות אחרונה</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderWorkerModal(workerName){
  if(!workerName) return '';
  const workerLogs = logs.filter(l=>l.worker===workerName);
  const rows = workerLogs.map(l=>{
    const idx = logs.indexOf(l);
    return `
    <div class="drill-row clickable-row" data-openlog="${idx}">
      <div class="drill-row-main">
        <span class="drill-row-name">${esc(l.name)}</span>
        <span class="drill-row-id mono ltr">${l.asset}</span>
      </div>
      <div class="drill-row-side">
        <span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span>
        <span class="drill-row-date mono ltr">${l.at}</span>
      </div>
    </div>`;
  }).join('') || `<div class="empty-state" style="padding:14px;">אין בדיקות רשומות לעובד זה.</div>`;

  return `
  <div class="modal-backdrop" id="worker-modal-backdrop">
    <div class="modal-box" id="worker-modal-box">
      <div class="modal-head">
        <div>
          <div class="modal-eyebrow">היסטוריית בדיקות</div>
          <h3>${esc(workerName)}</h3>
        </div>
        <button class="modal-close" id="worker-modal-close">✕</button>
      </div>
      <div class="drill-section">${rows}</div>
    </div>
  </div>`;
}

function renderObsListModal(){
  if(!openObsDrilldown) return '';
  const rows = observationLogs.map((o,idx)=>`
    <div class="drill-row clickable-row" data-openobs="${idx}">
      <div class="drill-row-main">
        <span class="drill-row-name">${esc(o.employeeName)}</span>
        <span class="drill-row-id mono ltr">${o.at}</span>
      </div>
      <div class="drill-row-side">
        <span class="badge ${logBadgeClass(o.result)}">${statusLabel(o.result)}</span>
      </div>
    </div>`).join('') || `<div class="empty-state" style="padding:14px;">אין עדיין תצפיות רשומות.</div>`;

  return `
  <div class="modal-backdrop" id="obs-modal-backdrop">
    <div class="modal-box" id="obs-modal-box">
      <div class="modal-head">
        <div>
          <div class="modal-eyebrow">תצפיות על עובדים</div>
          <h3>${observationsThisMonthCount()}/${OBS_MONTHLY_GOAL} החודש</h3>
        </div>
        <button class="modal-close" id="obs-modal-close">✕</button>
      </div>
      <div class="drill-section">${rows}</div>
    </div>
  </div>`;
}

function renderObservationDetailModal(){
  if(!openObservationLog) return '';
  const log = openObservationLog;
  const answers = log.answers || [];
  return `
  <div class="modal-backdrop" id="obsdetail-modal-backdrop">
    <div class="modal-box" id="obsdetail-modal-box">
      <div class="modal-head">
        <div>
          <div class="modal-eyebrow">תצפית בטיחות</div>
          <h3>👁️ ${esc(log.employeeName)}</h3>
        </div>
        <button class="modal-close" id="obsdetail-modal-close">✕</button>
      </div>
      <div class="modal-meta">
        <span class="mono ltr">🕒 ${log.at}</span>
        <span>👤 ${esc(log.worker)}${log.workerId?` <span class="mono ltr">(#${esc(log.workerId)})</span>`:''}</span>
        <span class="badge ${logBadgeClass(log.result)}">${statusLabel(log.result)}</span>
      </div>
      <div class="modal-checklist">
        ${answers.map(a=>`
          <div class="modal-chk-row ${a.status==='fail'?'bad':a.status==='pass'?'ok':''}">
            <span class="modal-chk-icon">${a.status==='fail'?'✕':a.status==='pass'?'✓':'—'}</span>
            <span class="modal-chk-text">${esc(a.text)}</span>
          </div>
        `).join('')}
      </div>
      ${log.comment ? `<div class="modal-comment"><b>הערות:</b> ${esc(log.comment)}</div>` : ''}
    </div>
  </div>`;
}

function renderAuditTab(){
  const uniqueAdmins = [...new Set(adminAuditLog.map(e=>e.admin))];
  const summaryCards = `
    <div class="cards-row">
      <div class="prog-card">
        <div class="cat-name">סה״כ שינויים</div>
        <div class="cat-num">${adminAuditLog.length}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">מנהלים שביצעו שינויים</div>
        <div class="cat-num">${uniqueAdmins.length}</div>
      </div>
    </div>
  `;

  const rows = adminAuditLog.map(e=>`
    <tr>
      <td class="mono-cell">${e.at}</td>
      <td>${esc(e.admin)}</td>
      <td>${esc(e.action)}</td>
      <td>${esc(e.details)}</td>
    </tr>`).join('') || `<tr><td colspan="4" class="empty-state">עדיין לא בוצעו שינויים על ידי מנהלים במערכת.</td></tr>`;

  return `
    <h2 class="page-title">מעקב ושינויים</h2>
    <div class="page-sub">יומן ביקורת מלא של פעולות ניהול — כל הוספה, מחיקה או עדכון של נתונים במערכת, לשקיפות מלאה.</div>
    ${summaryCards}
    <div class="table-wrap">
      <table>
        <thead><tr><th>חותמת זמן</th><th>מנהל</th><th>פעולה</th><th>פרטים</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderDashboardTab(){
  const cards = categories.map(c=>{
    const {done,total} = progressOf(c.id);
    const pct = total? Math.round(done/total*100):0;
    return `
    <div class="prog-card clickable-row" data-catdrill="${c.id}">
      <div class="cat-name">${esc(c.name)}</div>
      <div class="cat-freq">מחזור ${c.frequency}</div>
      <div class="cat-num">${done}<span>/${total} נבדקו</span></div>
      <div class="prog-bar-bg"><div class="prog-bar-fill ${pct===100?'complete':''}" style="width:${pct}%"></div></div>
      ${renderComplianceStrip(c)}
    </div>`;
  }).join('');

  const obsCount = observationsThisMonthCount();
  const obsPct = Math.min(100, Math.round((obsCount/OBS_MONTHLY_GOAL)*100));
  const obsCard = `
    <div class="prog-card clickable-row" data-obsdrill="1">
      <div class="cat-name">👁️ תצפיות על עובדים</div>
      <div class="cat-freq">יעד חודשי</div>
      <div class="cat-num">${obsCount}<span>/${OBS_MONTHLY_GOAL} תצפיות</span></div>
      <div class="prog-bar-bg"><div class="prog-bar-fill ${obsPct>=100?'complete':''}" style="width:${obsPct}%"></div></div>
    </div>`;

  const combinedActivity = [
    ...logs,
    ...observationLogs.map(o=>({
      asset: '👁️ תצפית', name: o.employeeName, worker: o.worker, at: o.at, result: o.result,
    })),
  ].sort((a,b)=> b.at.localeCompare(a.at));

  const recent = combinedActivity.slice(0,6).map(l=>`
    <tr>
      <td class="mono-cell">${l.at}</td>
      <td>${esc(l.name)}</td>
      <td class="mono-cell">${l.asset}</td>
      <td>${esc(l.worker)}</td>
      <td><span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span></td>
    </tr>`).join('') || `<tr><td colspan="5" class="empty-state">טרם נרשמו בדיקות.</td></tr>`;

  const failedAssets = assets.filter(a=>a.status==='fail');
  const failRows = failedAssets.map(a=>{
    const cat = catOf(a.catId);
    const log = logs.find(l=>l.asset===a.id && l.result==='fail');
    const logIndex = log ? logs.indexOf(log) : -1;
    return `
    <tr class="clickable-row" ${logIndex>=0 ? `data-openlog="${logIndex}"` : ''}>
      <td class="mono-cell">${a.id}</td>
      <td>${esc(a.name)}</td>
      <td>${esc(cat?cat.name:'—')}</td>
      <td>${esc(a.location)}</td>
      <td class="mono-cell">${a.lastAt||'—'}</td>
      <td>${esc(a.lastBy)||'—'}</td>
      <td>${log && log.comment ? esc(log.comment) : '<span style="color:var(--gray)">—</span>'}</td>
      <td>${isReadOnly ? '' : `<button class="btn ghost small" data-resolve="${a.id}">סמן כטופל</button>`}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="8" class="empty-state">אין כרגע בדיקות לא תקינות פתוחות. 🎉</td></tr>`;

  const failPanel = `
    <div class="alert-panel">
      <div class="alert-head">
        <div class="alert-title-wrap">
          <span class="alert-badge">${failedAssets.length}</span>
          <h3>בדיקות לא תקינות הדורשות טיפול</h3>
        </div>
        <div class="ts" style="color:var(--gray); font-size:11px;">לחץ על שורה לצפייה בפירוט הצ׳ק ליסט</div>
      </div>
      <div class="table-wrap" style="margin-bottom:0;">
        <table>
          <thead><tr><th>מזהה</th><th>פריט</th><th>קטגוריה</th><th>מיקום</th><th>נבדק בתאריך</th><th>בודק</th><th>הערה</th><th></th></tr></thead>
          <tbody>${failRows}</tbody>
        </table>
      </div>
    </div>
  `;

  // Categories whose cycle ends within a week AND still have unchecked items.
  const cycleAlerts = categories.map(c=>{
    const daysLeft = daysUntilCycleEnd(c.frequency);
    const pending = assetsIn(c.id).filter(a=>a.status==='pending');
    return { cat:c, daysLeft, pendingCount:pending.length };
  }).filter(x=>x.daysLeft!==null && x.daysLeft<=7 && x.pendingCount>0)
    .sort((a,b)=>a.daysLeft-b.daysLeft);

  const cyclePanel = cycleAlerts.length ? `
    <div class="alert-panel cycle-alert">
      <div class="alert-head">
        <div class="alert-title-wrap">
          <span class="alert-badge cycle">⏰</span>
          <h3>מחזורי בדיקה שעומדים להסתיים</h3>
        </div>
        <div class="ts" style="color:var(--gray); font-size:11px;">לחץ על קטגוריה לצפייה בפריטים שטרם נבדקו</div>
      </div>
      <div class="cycle-alert-list">
        ${cycleAlerts.map(x=>`
          <div class="cycle-alert-row clickable-row" data-catdrill="${x.cat.id}">
            <span class="cycle-alert-text">
              <b>${esc(x.cat.name)}</b> — המחזור מסתיים ${x.daysLeft===0?'היום':x.daysLeft===1?'מחר':`בעוד ${x.daysLeft} ימים`},
              ויש <b>${x.pendingCount}</b> ${x.pendingCount===1?'פריט שעדיין לא נבדק':'פריטים שעדיין לא נבדקו'}
            </span>
            <span class="cycle-alert-arrow">${backArrow()==='→'?'←':'→'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
    <h2 class="page-title">לוח מחוונים</h2>
    <div class="page-sub">התקדמות מחזורי הבדיקה בזמן אמת עבור כל הקטגוריות.</div>
    <div class="cards-row">${cards}${obsCard}</div>

    ${cyclePanel}
    ${failPanel}

    <div class="section-head">
      <h3>פעילות אחרונה</h3>
      ${isReadOnly ? '' : `<button class="btn ghost small" id="simulate-reset">הדמה איפוס חודשי</button>`}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>חותמת זמן</th><th>פריט</th><th>מזהה</th><th>בודק</th><th>תוצאה</th></tr></thead>
        <tbody>${recent}</tbody>
      </table>
    </div>
  `;
}

function renderAssetsTab(){
  const q = assetSearchQuery.trim().toLowerCase();
  const filteredAssets = q ? assets.filter(a=>{
    const cat = catOf(a.catId);
    return a.name.toLowerCase().includes(q) ||
           a.id.toLowerCase().includes(q) ||
           a.location.toLowerCase().includes(q) ||
           (cat && cat.name.toLowerCase().includes(q));
  }) : assets;

  const rows = filteredAssets.map(a=>{
    const cat = catOf(a.catId);
    const expSt = expiryStatus(a.expiryDate);
    return `
    <tr>
      <td class="mono-cell">${a.id}</td>
      <td>${esc(a.name)}</td>
      <td>${esc(cat?cat.name:'—')}</td>
      <td>${esc(a.location)}</td>
      <td><span class="badge ${statusClass(a.status)}">${statusLabel(a.status)}</span></td>
      <td class="mono-cell">${a.lastAt || '—'}</td>
      <td>
        <div class="expiry-cell">
          <span class="badge exp-${expSt}">${expSt==='expired'?'⚠ פג תוקף':expSt==='soon'?'⏳ פג בקרוב':expSt==='valid'?'✓ בתוקף':'—'}</span>
          <input type="date" class="expiry-input" data-expiry="${a.id}" value="${a.expiryDate||''}" ${isReadOnly?'disabled':''} />
        </div>
      </td>
      <td class="row-actions">
        <button class="btn ghost small" data-printqr="${a.id}">🖨️ הדפס QR</button>
        ${isReadOnly ? '' : `<button class="btn danger-o small" data-del="${a.id}">מחק</button>`}
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="8" class="empty-state">${q ? 'לא נמצאו פריטים התואמים לחיפוש.' : 'אין פריטים עדיין.'}</td></tr>`;

  const catOptions = categories.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');

  return `
    <h2 class="page-title">פריטים</h2>
    <div class="page-sub">הוסף, ערוך או הסר פריטים במעקב. כל פריט מקבל קוד QR ייחודי באופן אוטומטי — ניתן להדפיס תווית ולהדביק על הציוד עצמו.</div>

    ${isReadOnly ? '' : `
    <div class="form-grid">
      <div><label>שם הפריט</label><input id="na-name" placeholder="לדוגמה: מטף — מפרץ טעינה 4"/></div>
      <div><label>מזהה פריט</label><input id="na-id" placeholder="לדוגמה: EXT-019" class="ltr"/></div>
      <div><label>קטגוריה</label><select id="na-cat">${catOptions}</select></div>
      <div><label>מיקום</label><input id="na-loc" placeholder="לדוגמה: מחסן 2 / מפרץ 4"/></div>
      <div><label>תוקף (אופציונלי)</label><input type="date" id="na-expiry" class="ltr"/></div>
      <div class="actions"><button class="btn yellow" id="add-asset">+ הוסף פריט</button></div>
    </div>
    `}

    <div class="section-head">
      <h3>כל הפריטים</h3>
      <div class="asset-search-wrap">
        <span class="asset-search-icon">🔍</span>
        <input type="text" id="asset-search" class="asset-search-input" placeholder="חיפוש לפי שם, מזהה, מיקום או קטגוריה..." value="${esc(assetSearchQuery)}" />
        ${assetSearchQuery ? `<button class="asset-search-clear" id="asset-search-clear" title="נקה חיפוש">✕</button>` : ''}
      </div>
      <button class="btn ghost small" id="print-all-qr">🖨️ הדפס את כל תוויות ה-QR</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>מזהה</th><th>שם</th><th>קטגוריה</th><th>מיקום</th><th>סטטוס</th><th>נבדק לאחרונה</th><th>תוקף</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}


function renderCategoriesTab(){
  const rows = categories.map(c=>{
    const {done,total} = progressOf(c.id);
    const items = (c.checklist||[]).map((item,i)=>`
      <li class="chk-item">
        <span>${esc(item)}</span>
        ${isReadOnly ? '' : `<button class="chk-del" data-chkdel="${c.id}" data-idx="${i}" title="הסר">✕</button>`}
      </li>
    `).join('') || `<li class="chk-item empty">אין פריטי צ׳ק ליסט — הוסף למטה</li>`;
    return `
    <div class="cat-card">
      <div class="cat-row">
        <div class="c-left">
          <b>${esc(c.name)}</b>
          <div class="mono">${total} פריטים &middot; ${done}/${total} נבדקו במחזור זה</div>
        </div>
        <select class="freq-select" data-catfreq="${c.id}" ${isReadOnly ? 'disabled' : ''}>
          <option value="שבועי" ${c.frequency==='שבועי'?'selected':''}>שבועי</option>
          <option value="חודשי" ${c.frequency==='חודשי'?'selected':''}>חודשי</option>
          <option value="רבעוני" ${c.frequency==='רבעוני'?'selected':''}>רבעוני</option>
          <option value="שנתי" ${c.frequency==='שנתי'?'selected':''}>שנתי</option>
        </select>
      </div>
      ${renderComplianceStrip(c)}
      <div class="chk-editor">
        <span class="field-label" style="margin-bottom:6px;">צ׳ק ליסט לבודק השטח</span>
        <ul class="chk-list">${items}</ul>
        ${isReadOnly ? '' : `
        <div class="chk-add-row">
          <input type="text" class="chk-add-input" data-chkadd="${c.id}" placeholder="הוסף שאלה לצ׳ק ליסט..."/>
          <button class="btn ghost small" data-chkaddbtn="${c.id}">+ הוסף</button>
        </div>
        `}
      </div>
    </div>`;
  }).join('');

  return `
    <h2 class="page-title">קטגוריות בדיקה</h2>
    <div class="page-sub">צור סוגי בדיקה חדשים, שלוט בתדירות האיפוס וקבע את הצ׳ק ליסט שמוצג לבודק השטח לפני קביעת תקין/לא תקין.</div>
    <div class="cat-list">${rows}</div>

    ${isReadOnly ? '' : `
    <div class="form-grid">
      <div class="full"><label>שם קטגוריה חדשה</label><input id="nc-name" placeholder="לדוגמה: בדיקת שערים"/></div>
      <div><label>תדירות</label>
        <select id="nc-freq">
          <option value="שבועי">שבועי</option>
          <option value="חודשי" selected>חודשי</option>
          <option value="רבעוני">רבעוני</option>
          <option value="שנתי">שנתי</option>
        </select>
      </div>
      <div class="actions"><button class="btn yellow" id="add-cat">+ צור קטגוריה</button></div>
    </div>
    `}
  `;
}

function renderHistoryTab(){
  const combinedHistory = [
    ...logs,
    ...observationLogs.map(o=>({
      asset: '👁️ תצפית', name: o.employeeName, worker: o.worker, at: o.at, result: o.result, comment: o.comment,
    })),
  ].sort((a,b)=> b.at.localeCompare(a.at));

  const rows = combinedHistory.map(l=>`
    <tr>
      <td class="mono-cell">${l.at}</td>
      <td class="mono-cell">${l.asset}</td>
      <td>${esc(l.name)}</td>
      <td>${esc(l.worker)}</td>
      <td><span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span></td>
      <td>${esc(l.comment)||'<span style="color:var(--gray)">—</span>'}</td>
    </tr>`).join('') || `<tr><td colspan="6" class="empty-state">אין עדיין היסטוריית בדיקות.</td></tr>`;

  return `
    <h2 class="page-title">היסטוריית בדיקות</h2>
    <div class="page-sub">יומן ביקורת מלא של כל בדיקה שהוגשה.</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>חותמת זמן</th><th>מזהה פריט</th><th>פריט</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderExportTab(){
  const catRows = categories.map(c=>{
    const count = logs.filter(l=>l.catName===c.name).length;
    const {done,total} = progressOf(c.id);
    return `
    <div class="cat-export-row">
      <div class="cat-export-actions">
        <button class="btn ghost small" data-catexport-pdf="${c.id}">PDF</button>
        <button class="btn ghost small" data-catexport-word="${c.id}">Word</button>
        <button class="btn ghost small" data-catexport-csv="${c.id}">CSV</button>
        <button class="btn ghost small" data-catpreview="${c.id}">👁 תצוגה מקדימה</button>
      </div>
      <div class="cat-export-progress">
        <span class="cat-progress-badge">${done}/${total}</span>
        <span class="cat-progress-label">נבדקו</span>
      </div>
      <div class="cat-export-info">
        <span class="cat-export-icon">${categoryIcon(c.id)}</span>
        <div>
          <b>${esc(c.name)}</b>
          <div class="mono" style="color:var(--gray); font-size:10.5px;">${count} ${count===1?'רשומה':'רשומות'}</div>
        </div>
      </div>
    </div>`;
  }).join('') || `<div class="empty-state">אין קטגוריות עדיין.</div>`;

  return `
    <h2 class="page-title">ייצוא נתוני תאימות</h2>
    <div class="page-sub">הורד את היסטוריית הבדיקות המלאה בפורמט הנדרש לביקורת שלך, או הצץ בנתונים לפני ההורדה.</div>
    <div class="section-head"><h3>ייצוא כל הנתונים</h3></div>
    <div class="export-row">
      <div class="export-card">
        <div class="ex-title">CSV / אקסל</div>
        <p>היומן המלא כקובץ CSV מוכן לגיליון אלקטרוני — נפתח ישירות באקסל.</p>
        <div class="export-btn-row">
          <button class="btn yellow" id="export-csv">הורד קובץ ‎.csv</button>
          <button class="btn ghost small" data-preview="csv">👁 תצוגה מקדימה</button>
        </div>
      </div>
      <div class="export-card">
        <div class="ex-title">מסמך Word</div>
        <p>דוח תאימות מעוצב כקובץ ‎.doc, מוכן לשמירה או לשליחה.</p>
        <div class="export-btn-row">
          <button class="btn yellow" id="export-word">הורד קובץ ‎.doc</button>
          <button class="btn ghost small" data-preview="word">👁 תצוגה מקדימה</button>
        </div>
      </div>
      <div class="export-card">
        <div class="ex-title">PDF</div>
        <p>דוח מוכן להדפסה. פותח את חלון ההדפסה של הדפדפן — בחר "שמור כ-PDF".</p>
        <div class="export-btn-row">
          <button class="btn yellow" id="export-pdf">צור PDF</button>
          <button class="btn ghost small" data-preview="pdf">👁 תצוגה מקדימה</button>
        </div>
      </div>
    </div>

    <div class="section-head"><h3>ייצוא לפי קטגוריה</h3></div>
    <div class="page-sub" style="margin-bottom:14px;">רוצה רק את המטפים, או רק את המקלטים? הורד כל קטגוריה בנפרד.</div>
    <div class="cat-export-list">${catRows}</div>

    <div class="section-head"><h3>תצפיות על עובדים</h3></div>
    <div class="cat-export-list">
      <div class="cat-export-row">
        <div class="cat-export-actions">
          <button class="btn ghost small" id="obs-export-pdf">PDF</button>
          <button class="btn ghost small" id="obs-export-word">Word</button>
          <button class="btn ghost small" id="obs-export-csv">CSV</button>
          <button class="btn ghost small" id="obs-preview">👁 תצוגה מקדימה</button>
        </div>
        <div class="cat-export-progress">
          <span class="cat-progress-badge">${observationsThisMonthCount()}/${OBS_MONTHLY_GOAL}</span>
          <span class="cat-progress-label">החודש</span>
        </div>
        <div class="cat-export-info">
          <span class="cat-export-icon">👁️</span>
          <div>
            <b>תצפיות על עובדים</b>
            <div class="mono" style="color:var(--gray); font-size:10.5px;">${observationLogs.length} ${observationLogs.length===1?'רשומה':'רשומות'} סה״כ</div>
          </div>
        </div>
      </div>
    </div>

    ${renderExportPreviewModal()}
  `;
}

function renderExportPreviewModal(){
  if(!previewFormat) return '';

  if(previewIsObs){
    const data = observationLogs;
    const rows = data.map(o=>`
      <tr>
        <td class="mono-cell">${o.at}</td>
        <td>${esc(o.employeeName)}</td>
        <td>${esc(o.worker)}${o.workerId ? ` <span class="mono ltr">(#${esc(o.workerId)})</span>` : ''}</td>
        <td><span class="badge ${logBadgeClass(o.result)}">${statusLabel(o.result)}</span></td>
        <td>${esc(o.comment) || '<span style="color:var(--gray)">—</span>'}</td>
      </tr>`).join('') || `<tr><td colspan="5" class="empty-state">אין עדיין נתונים להצגה.</td></tr>`;

    const headers = `<tr><th>חותמת זמן</th><th>עובד</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr>`;
    const meta = {
      csv:  { eyebrow:'תצוגה מקדימה · קובץ CSV — תצפיות על עובדים', title:'כך ייראה הקובץ שיורד', note:'ערכים מופרדים בפסיקים — הטבלה למטה מייצגת כיצד זה ייפתח באקסל.' },
      word: { eyebrow:'תצוגה מקדימה · מסמך Word — תצפיות על עובדים', title:'משק בית — דוח תצפיות בטיחות על עובדים', note:`הופק בתאריך ${nowStamp()} &middot; ${data.length} רשומות` },
      pdf:  { eyebrow:'תצוגה מקדימה · PDF — תצפיות על עובדים', title:'משק בית — דוח תצפיות בטיחות על עובדים', note:`הופק בתאריך ${nowStamp()} &middot; ${data.length} רשומות` },
    }[previewFormat];
    const docStyle = previewFormat!=='csv' ? 'background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:16px;' : '';

    return `
    <div class="modal-backdrop" id="preview-modal-backdrop">
      <div class="modal-box" id="preview-modal-box" style="max-width:760px;">
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow">${meta.eyebrow}</div>
            <h3>${meta.title}</h3>
          </div>
          <button class="modal-close" id="preview-modal-close">✕</button>
        </div>
        <div class="modal-meta"><span>${meta.note}</span></div>
        <div style="${docStyle}">
          <div class="table-wrap" style="margin-bottom:0; max-height:50vh; overflow-y:auto;">
            <table>
              <thead>${headers}</thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  }

  const cat = previewCategoryId ? catOf(previewCategoryId) : null;
  const data = cat ? logs.filter(l=>l.catName===cat.name) : logs;

  const rows = data.map(l=>`
    <tr>
      <td class="mono-cell">${l.at}</td>
      <td class="mono-cell">${l.asset}</td>
      <td>${esc(l.name)}</td>
      <td>${esc(l.worker)}${l.workerId ? ` <span class="mono ltr">(#${esc(l.workerId)})</span>` : ''}</td>
      <td><span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span></td>
      <td>${esc(l.comment) || '<span style="color:var(--gray)">—</span>'}</td>
    </tr>`).join('') || `<tr><td colspan="6" class="empty-state">אין עדיין נתונים להצגה.</td></tr>`;

  const headers = `<tr><th>חותמת זמן</th><th>מזהה</th><th>פריט</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr>`;

  const catSuffix = cat ? ` — ${esc(cat.name)}` : '';
  const meta = {
    csv:  { eyebrow:`תצוגה מקדימה · קובץ CSV${catSuffix}`, title:'כך ייראה הקובץ שיורד', note: cat ? `${data.length} רשומות בקטגוריית "${esc(cat.name)}" — ערכים מופרדים בפסיקים.` : 'ערכים מופרדים בפסיקים — הטבלה למטה מייצגת כיצד זה ייפתח באקסל.' },
    word: { eyebrow:`תצוגה מקדימה · מסמך Word${catSuffix}`, title:`משק בית — דוח תאימות בדיקות בטיחות${catSuffix}`, note:`הופק בתאריך ${nowStamp()} &middot; ${data.length} רשומות` },
    pdf:  { eyebrow:`תצוגה מקדימה · PDF${catSuffix}`, title:`משק בית — דוח תאימות בדיקות בטיחות${catSuffix}`, note:`הופק בתאריך ${nowStamp()} &middot; ${data.length} רשומות` },
  }[previewFormat];

  const docStyle = previewFormat!=='csv' ? 'background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:16px;' : '';

  return `
  <div class="modal-backdrop" id="preview-modal-backdrop">
    <div class="modal-box" id="preview-modal-box" style="max-width:760px;">
      <div class="modal-head">
        <div>
          <div class="modal-eyebrow">${meta.eyebrow}</div>
          <h3>${meta.title}</h3>
        </div>
        <button class="modal-close" id="preview-modal-close">✕</button>
      </div>
      <div class="modal-meta"><span>${meta.note}</span></div>
      <div style="${docStyle}">
        <div class="table-wrap" style="margin-bottom:0; max-height:50vh; overflow-y:auto;">
          <table>
            <thead>${headers}</thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------- admin events ---------------- */
function renderAdminEvents(){
  document.querySelectorAll('.s-item').forEach(el=>{
    el.addEventListener('click', ()=>{ adminTab = el.getAttribute('data-tab'); render(); });
  });

  document.querySelectorAll('[data-resolve]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.stopPropagation();
      const id = el.getAttribute('data-resolve');
      const a = assets.find(x=>x.id===id);
      if(a){
        const cat = catOf(a.catId);
        const stamp = nowStamp();
        a.status = 'pass';
        a.lastAt = stamp;
        a.lastBy = adminName || 'מנהל המערכת';
        logs.unshift({
          asset: a.id, name: a.name, catName: cat ? cat.name : '',
          worker: adminName || 'מנהל המערכת', at: stamp, result: 'resolved',
          comment: 'הליקוי טופל וסומן כתקין — נחשב כנבדק במחזור הנוכחי',
          answers: [],
        });
        logAdminAction('סימון בדיקה כטופלה', `${a.id} — ${a.name}`);
      }
      render();
      showToast(`${id} סומן כטופל ונבדק`, false);
    });
  });

  document.querySelectorAll('[data-openlog]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const idx = parseInt(el.getAttribute('data-openlog'), 10);
      openInspectionLog = logs[idx];
      openCategoryDrilldown = null;
      openWorkerDrilldown = null;
      render();
    });
  });

  const modalClose = document.getElementById('modal-close');
  if(modalClose) modalClose.addEventListener('click', ()=>{ openInspectionLog = null; render(); });

  const modalBackdrop = document.getElementById('modal-backdrop');
  if(modalBackdrop) modalBackdrop.addEventListener('click', (e)=>{
    if(e.target.id === 'modal-backdrop'){ openInspectionLog = null; render(); }
  });

  document.querySelectorAll('[data-catdrill]').forEach(el=>{
    el.addEventListener('click', ()=>{
      openCategoryDrilldown = el.getAttribute('data-catdrill');
      openWorkerDrilldown = null;
      render();
    });
  });

  const catModalClose = document.getElementById('cat-modal-close');
  if(catModalClose) catModalClose.addEventListener('click', ()=>{ openCategoryDrilldown = null; render(); });

  const catModalBackdrop = document.getElementById('cat-modal-backdrop');
  if(catModalBackdrop) catModalBackdrop.addEventListener('click', (e)=>{
    if(e.target.id === 'cat-modal-backdrop'){ openCategoryDrilldown = null; render(); }
  });

  document.querySelectorAll('[data-workerdrill]').forEach(el=>{
    el.addEventListener('click', ()=>{
      openWorkerDrilldown = el.getAttribute('data-workerdrill');
      openCategoryDrilldown = null;
      render();
    });
  });

  const workerModalClose = document.getElementById('worker-modal-close');
  if(workerModalClose) workerModalClose.addEventListener('click', ()=>{ openWorkerDrilldown = null; render(); });

  const workerModalBackdrop = document.getElementById('worker-modal-backdrop');
  if(workerModalBackdrop) workerModalBackdrop.addEventListener('click', (e)=>{
    if(e.target.id === 'worker-modal-backdrop'){ openWorkerDrilldown = null; render(); }
  });

  document.querySelectorAll('[data-obsdrill]').forEach(el=>{
    el.addEventListener('click', ()=>{
      openObsDrilldown = true;
      openCategoryDrilldown = null;
      openWorkerDrilldown = null;
      render();
    });
  });
  const obsModalClose = document.getElementById('obs-modal-close');
  if(obsModalClose) obsModalClose.addEventListener('click', ()=>{ openObsDrilldown = false; render(); });
  const obsModalBackdrop = document.getElementById('obs-modal-backdrop');
  if(obsModalBackdrop) obsModalBackdrop.addEventListener('click', (e)=>{
    if(e.target.id === 'obs-modal-backdrop'){ openObsDrilldown = false; render(); }
  });

  document.querySelectorAll('[data-openobs]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const idx = parseInt(el.getAttribute('data-openobs'), 10);
      openObservationLog = observationLogs[idx];
      openObsDrilldown = false;
      render();
    });
  });
  const obsDetailClose = document.getElementById('obsdetail-modal-close');
  if(obsDetailClose) obsDetailClose.addEventListener('click', ()=>{ openObservationLog = null; render(); });
  const obsDetailBackdrop = document.getElementById('obsdetail-modal-backdrop');
  if(obsDetailBackdrop) obsDetailBackdrop.addEventListener('click', (e)=>{
    if(e.target.id === 'obsdetail-modal-backdrop'){ openObservationLog = null; render(); }
  });

  const simReset = document.getElementById('simulate-reset');
  if(simReset) simReset.addEventListener('click', ()=>{
    let count = 0;
    assets.forEach(a=>{
      const cat = catOf(a.catId);
      if(cat && (cat.frequency==='חודשי'||cat.frequency==='שבועי')){ a.status='pending'; a.lastBy=null; a.lastAt=null; count++; }
    });
    logAdminAction('הפעלת איפוס מחזור ידני', `${count} פריטים הוגדרו כממתינים`);
    render();
    showToast(`איפוס מחזור: ${count} פריטים הוגדרו כממתינים`, false);
  });

  const assetSearch = document.getElementById('asset-search');
  if(assetSearch){
    assetSearch.addEventListener('input', e=>{
      assetSearchQuery = e.target.value;
      render();
      const el = document.getElementById('asset-search');
      if(el){ el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    });
  }
  const assetSearchClear = document.getElementById('asset-search-clear');
  if(assetSearchClear) assetSearchClear.addEventListener('click', ()=>{ assetSearchQuery=''; render(); });

  const addAsset = document.getElementById('add-asset');
  if(addAsset) addAsset.addEventListener('click', ()=>{
    const name = document.getElementById('na-name').value.trim();
    const id = document.getElementById('na-id').value.trim();
    const catId = document.getElementById('na-cat').value;
    const loc = document.getElementById('na-loc').value.trim();
    const expiryEl = document.getElementById('na-expiry');
    const expiry = expiryEl && expiryEl.value ? expiryEl.value : null;
    if(!name || !id){ showToast('שם הפריט והמזהה נדרשים', true); return; }
    if(assets.some(a=>a.id===id)){ showToast(`המזהה ${id} כבר קיים`, true); return; }
    assets.push({ id, name, catId, location: loc||'לא מוגדר', status:'pending', lastBy:null, lastAt:null, expiryDate: expiry });
    logAdminAction('הוספת פריט', `${id} — ${name}`);
    render();
    showToast(`${id} נוסף — קוד QR נוצר`, false);
  });

  document.querySelectorAll('[data-expiry]').forEach(el=>{
    el.addEventListener('change', ()=>{
      const id = el.getAttribute('data-expiry');
      const a = assets.find(x=>x.id===id);
      if(a){
        const oldVal = a.expiryDate || 'לא הוגדר';
        a.expiryDate = el.value || null;
        logAdminAction('שינוי תוקף לפריט', `${id} — מ-${oldVal} ל-${a.expiryDate||'לא הוגדר'}`);
        render();
        showToast(`תוקף ${id} עודכן`, false);
      }
    });
  });

  document.querySelectorAll('[data-printqr]').forEach(el=>{
    el.addEventListener('click', ()=>{ printSingleQr(el.getAttribute('data-printqr')); });
  });
  const printAllBtn = document.getElementById('print-all-qr');
  if(printAllBtn) printAllBtn.addEventListener('click', printAllQr);

  document.querySelectorAll('[data-del]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const id = el.getAttribute('data-del');
      const a = assets.find(x=>x.id===id);
      logAdminAction('מחיקת פריט', a ? `${id} — ${a.name}` : id);
      assets = assets.filter(a=>a.id!==id);
      render();
      showToast(`${id} הוסר`, false);
    });
  });

  document.querySelectorAll('[data-catfreq]').forEach(el=>{
    el.addEventListener('change', ()=>{
      const cat = catOf(el.getAttribute('data-catfreq'));
      const oldFreq = cat.frequency;
      cat.frequency = el.value;
      logAdminAction('שינוי תדירות קטגוריה', `${cat.name} — מ-${oldFreq} ל-${cat.frequency}`);
      render();
      showToast(`תדירות "${cat.name}" עודכנה ל${cat.frequency}`, false);
    });
  });

  document.querySelectorAll('[data-chkdel]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const cat = catOf(el.getAttribute('data-chkdel'));
      const idx = parseInt(el.getAttribute('data-idx'), 10);
      if(cat && cat.checklist){
        const removed = cat.checklist[idx];
        cat.checklist.splice(idx,1);
        logAdminAction('הסרת סעיף מצ׳ק ליסט', `${cat.name} — "${removed}"`);
      }
      render();
    });
  });

  function addChecklistItem(catId){
    const input = document.querySelector(`[data-chkadd="${catId}"]`);
    if(!input) return;
    const val = input.value.trim();
    if(!val) return;
    const cat = catOf(catId);
    if(!cat.checklist) cat.checklist = [];
    cat.checklist.push(val);
    logAdminAction('הוספת סעיף לצ׳ק ליסט', `${cat.name} — "${val}"`);
    render();
    showToast('נוסף לצ׳ק ליסט', false);
  }
  document.querySelectorAll('[data-chkaddbtn]').forEach(el=>{
    el.addEventListener('click', ()=>{ addChecklistItem(el.getAttribute('data-chkaddbtn')); });
  });
  document.querySelectorAll('[data-chkadd]').forEach(el=>{
    el.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'){ e.preventDefault(); addChecklistItem(el.getAttribute('data-chkadd')); }
    });
  });

  const addCat = document.getElementById('add-cat');
  if(addCat) addCat.addEventListener('click', ()=>{
    const name = document.getElementById('nc-name').value.trim();
    const freq = document.getElementById('nc-freq').value;
    if(!name){ showToast('שם הקטגוריה נדרש', true); return; }
    const id = 'cat-' + hashStr(name+Date.now());
    categories.push({ id, name, frequency:freq, checklist:[] });
    logAdminAction('הוספת קטגוריה', `${name} (${freq})`);
    render();
    showToast(`הקטגוריה "${name}" נוצרה — הוסף לה צ׳ק ליסט למטה`, false);
  });

  function exportLogsFor(catId){
    if(!catId) return logs;
    const cat = catOf(catId);
    return cat ? logs.filter(l=>l.catName===cat.name) : logs;
  }

  function doExportCsv(catId){
    const data = exportLogsFor(catId);
    const cat = catId ? catOf(catId) : null;
    let csv = '\uFEFF' + 'חותמת זמן,מזהה פריט,שם פריט,בודק,מס׳ עובד,תוצאה,הערה\n';
    data.forEach(l=>{
      const row = [l.at, l.asset, l.name, l.worker, l.workerId||'', statusLabel(l.result), (l.comment||'').replace(/"/g,'""')];
      csv += row.map(v=>`"${v}"`).join(',') + '\n';
    });
    downloadBlob(csv, 'text/csv', cat ? `inspection-history-${cat.id}.csv` : 'inspection-history.csv');
    showToast(cat ? `קובץ CSV של "${cat.name}" הורד` : 'קובץ CSV הורד', false);
  }

  function doExportWord(catId){
    const data = exportLogsFor(catId);
    const cat = catId ? catOf(catId) : null;
    let rows = data.map(l=>`<tr><td>${l.at}</td><td>${l.asset}</td><td>${esc(l.name)}</td><td>${esc(l.worker)}${l.workerId?' (#'+esc(l.workerId)+')':''}</td><td>${statusLabel(l.result)}</td><td>${esc(l.comment)}</td></tr>`).join('');
    const html = `<html dir="rtl"><head><meta charset="utf-8"><title>דוח תאימות</title></head><body>
      <h1>משק בית — דוח תאימות בדיקות בטיחות${cat?` — ${esc(cat.name)}`:''}</h1>
      <p>הופק בתאריך ${nowStamp()}</p>
      <table border="1" cellpadding="6" cellspacing="0" dir="rtl">
        <tr><th>חותמת זמן</th><th>מזהה פריט</th><th>פריט</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr>
        ${rows}
      </table></body></html>`;
    downloadBlob(html, 'application/msword', cat ? `compliance-report-${cat.id}.doc` : 'compliance-report.doc');
    showToast(cat ? `דוח Word של "${cat.name}" הורד` : 'דוח Word הורד', false);
  }

  function doExportPdf(catId){
    const data = exportLogsFor(catId);
    const cat = catId ? catOf(catId) : null;
    const rows = data.map(l=>`
      <tr>
        <td>${l.at}</td><td>${l.asset}</td><td>${esc(l.name)}</td>
        <td>${esc(l.worker)}${l.workerId?' (#'+esc(l.workerId)+')':''}</td>
        <td>${statusLabel(l.result)}</td><td>${esc(l.comment)}</td>
      </tr>`).join('');
    document.getElementById('print-area').innerHTML = `
      <div class="print-report">
        <h1>משק בית — דוח תאימות בדיקות בטיחות${cat?` — ${esc(cat.name)}`:''}</h1>
        <p>הופק בתאריך ${nowStamp()} &middot; ${data.length} רשומות</p>
        <table>
          <thead><tr><th>חותמת זמן</th><th>מזהה פריט</th><th>פריט</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    window.print();
  }

  function doExportObsCsv(){
    let csv = '\uFEFF' + 'חותמת זמן,שם עובד,בודק,מס׳ עובד,תוצאה,הערה\n';
    observationLogs.forEach(o=>{
      const row = [o.at, o.employeeName, o.worker, o.workerId||'', statusLabel(o.result), (o.comment||'').replace(/"/g,'""')];
      csv += row.map(v=>`"${v}"`).join(',') + '\n';
    });
    downloadBlob(csv, 'text/csv', 'employee-observations.csv');
    showToast('קובץ CSV של תצפיות הורד', false);
  }

  function doExportObsWord(){
    const rows = observationLogs.map(o=>`<tr><td>${o.at}</td><td>${esc(o.employeeName)}</td><td>${esc(o.worker)}${o.workerId?' (#'+esc(o.workerId)+')':''}</td><td>${statusLabel(o.result)}</td><td>${esc(o.comment)}</td></tr>`).join('');
    const html = `<html dir="rtl"><head><meta charset="utf-8"><title>דוח תצפיות</title></head><body>
      <h1>משק בית — דוח תצפיות בטיחות על עובדים</h1>
      <p>הופק בתאריך ${nowStamp()}</p>
      <table border="1" cellpadding="6" cellspacing="0" dir="rtl">
        <tr><th>חותמת זמן</th><th>עובד</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr>
        ${rows}
      </table></body></html>`;
    downloadBlob(html, 'application/msword', 'employee-observations.doc');
    showToast('דוח Word של תצפיות הורד', false);
  }

  function doExportObsPdf(){
    const rows = observationLogs.map(o=>`
      <tr>
        <td>${o.at}</td><td>${esc(o.employeeName)}</td>
        <td>${esc(o.worker)}${o.workerId?' (#'+esc(o.workerId)+')':''}</td>
        <td>${statusLabel(o.result)}</td><td>${esc(o.comment)}</td>
      </tr>`).join('');
    document.getElementById('print-area').innerHTML = `
      <div class="print-report">
        <h1>משק בית — דוח תצפיות בטיחות על עובדים</h1>
        <p>הופק בתאריך ${nowStamp()} &middot; ${observationLogs.length} רשומות</p>
        <table>
          <thead><tr><th>חותמת זמן</th><th>עובד</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    window.print();
  }

  const exportCsv = document.getElementById('export-csv');
  if(exportCsv) exportCsv.addEventListener('click', ()=>doExportCsv(null));
  const exportWord = document.getElementById('export-word');
  if(exportWord) exportWord.addEventListener('click', ()=>doExportWord(null));
  const exportPdf = document.getElementById('export-pdf');
  if(exportPdf) exportPdf.addEventListener('click', ()=>doExportPdf(null));

  document.querySelectorAll('[data-catexport-csv]').forEach(el=>{
    el.addEventListener('click', ()=>doExportCsv(el.getAttribute('data-catexport-csv')));
  });
  document.querySelectorAll('[data-catexport-word]').forEach(el=>{
    el.addEventListener('click', ()=>doExportWord(el.getAttribute('data-catexport-word')));
  });
  document.querySelectorAll('[data-catexport-pdf]').forEach(el=>{
    el.addEventListener('click', ()=>doExportPdf(el.getAttribute('data-catexport-pdf')));
  });

  const obsExportCsv = document.getElementById('obs-export-csv');
  if(obsExportCsv) obsExportCsv.addEventListener('click', doExportObsCsv);
  const obsExportWord = document.getElementById('obs-export-word');
  if(obsExportWord) obsExportWord.addEventListener('click', doExportObsWord);
  const obsExportPdf = document.getElementById('obs-export-pdf');
  if(obsExportPdf) obsExportPdf.addEventListener('click', doExportObsPdf);
  const obsPreviewBtn = document.getElementById('obs-preview');
  if(obsPreviewBtn) obsPreviewBtn.addEventListener('click', ()=>{
    previewFormat = 'csv';
    previewCategoryId = null;
    previewIsObs = true;
    render();
  });

  document.querySelectorAll('[data-preview]').forEach(el=>{
    el.addEventListener('click', ()=>{
      previewFormat = el.getAttribute('data-preview');
      previewCategoryId = null;
      previewIsObs = false;
      render();
    });
  });

  document.querySelectorAll('[data-catpreview]').forEach(el=>{
    el.addEventListener('click', ()=>{
      previewCategoryId = el.getAttribute('data-catpreview');
      previewFormat = 'csv';
      previewIsObs = false;
      render();
    });
  });

  const previewModalClose = document.getElementById('preview-modal-close');
  if(previewModalClose) previewModalClose.addEventListener('click', ()=>{ previewFormat = null; previewCategoryId = null; previewIsObs = false; render(); });

  const previewModalBackdrop = document.getElementById('preview-modal-backdrop');
  if(previewModalBackdrop) previewModalBackdrop.addEventListener('click', (e)=>{
    if(e.target.id === 'preview-modal-backdrop'){ previewFormat = null; previewCategoryId = null; previewIsObs = false; render(); }
  });
}

function downloadBlob(content, mime, filename){
  const blob = new Blob([content], {type:mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function bindEvents(){
  if(mode===null) bindLandingEvents();
  else if(mode==='field-login') bindFieldLoginEvents();
  else if(mode==='lock') bindLockEvents();
  else if(mode==='supervisor-login') bindSupervisorLoginEvents();
  else if(mode==='field') renderFieldEvents();
  else renderAdminEvents();
}

/* ---------------- top-level toggle ---------------- */
document.getElementById('tab-field').addEventListener('click', enterField);
document.getElementById('tab-admin').addEventListener('click', tryEnterAdmin);
document.getElementById('lang-select').addEventListener('change', (e)=>{ setLanguage(e.target.value); });
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('topbar-home').addEventListener('click', ()=>{
  stopCameraStream();
  mode = null;
  fieldScreen = 'scan';
  scanSelectedCategory = null;
  render();
});

// If this page was opened by scanning a printed QR label (?asset=EXT-014),
// skip the landing screen and go straight to the worker-details form —
// after login, submitWorkerLogin() routes directly into that asset's form.
let pendingScanAssetId = new URLSearchParams(window.location.search).get('asset');
if(pendingScanAssetId && assets.some(a=>a.id===pendingScanAssetId)){
  mode = 'field-login';
} else {
  pendingScanAssetId = null;
}

render();
})();
</script>
</body>
</html>
