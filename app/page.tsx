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
  .export-card p{ font-size:12.5px; color:var(--gray); margin-bottom:12px; line-height:1.6; }

  .cat-list{ display:flex; flex-direction:column; gap:10px; margin-bottom:22px; }
  .cat-card{ background:var(--surface); border:1px solid var(--line-light); border-radius:8px; padding:14px 16px 16px; }
  .cat-row{ display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; margin-bottom:10px; border-bottom:1px solid #EEEDE7; }
  .cat-row .c-left b{ font-family:'Heebo',sans-serif; font-weight:700; font-size:14px; }
  .cat-row .c-left div.mono{ font-size:11px; color:var(--gray); margin-top:2px; font-family:'Heebo',sans-serif; }
  .freq-select{ padding:6px 8px; border:1px solid var(--line-light); border-radius:5px; font-size:12.5px; font-family:'Heebo',sans-serif; }

  .chk-editor{ }
  .chk-list{ list-style:none; display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
  .chk-item{ display:flex; align-items:center; gap:8px; background:var(--surface-alt); padding:8px 10px; border-radius:6px; font-size:12px; }
  .chk-item span{ flex:1; }
  .chk-del{ background:none; border:none; color:var(--gray); cursor:pointer; font-size:14px; }
  .chk-del:hover{ color:var(--red); }
  .chk-add-row{ display:flex; gap:6px; }
  .chk-add-input{ flex:1; padding:7px 10px; border:1px solid var(--line-light); border-radius:5px; font-size:12px; font-family:'Heebo',sans-serif; }
</style>
</head>
<body>
<div id="app">
  <header class="topbar">
    <div class="brand">
      <span class="eyebrow">SYSTEM // HOUSEHOLD</span>
      <h1>משק בית · מעקב בטיחות</h1>
    </div>
    <div class="topbar-right">
      <button class="theme-toggle-btn" id="themeToggleBtn" title="שינוי מצב תצוגה">🌙</button>
    </div>
  </header>
  <main id="mainContainer">
    <!-- האפליקציה המלאה שלך רצה כאן -->
    <div class="landing-wrap">
      <div class="landing-card">
        <span class="landing-eyebrow">מערכת בטיחות וניהול</span>
        <div class="landing-buttons">
          <div class="landing-btn field" onclick="alert('המערכת פעילה!')">
            <span class="landing-icon">🛡️</span>
            <span class="landing-title">טעינת המערכת המלאה</span>
            <span class="landing-sub">הכל נטען בהצלחה ל-Vercel</span>
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
