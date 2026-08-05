<div class="compliance-strip" title="מצב תאימות חודשי שנתי">
    ${colors.map((c,i)=>`
      <div class="compliance-col">
        <div class="compliance-cell compliance-${c}" title="${MONTH_NAMES_HE[i]}"></div>
        <span class="compliance-label">${MONTH_ABBR_HE[i]}</span>
      </div>
    `).join('')}
  </div>
  `;
}

function nowStamp(){
  const d = new Date();
  const pad = n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Global window-level helper so generated QR label print sheets can call print()
window.printSheet = function(htmlContent){
  const area = document.getElementById('print-area');
  area.innerHTML = htmlContent;
  window.print();
};

function showToast(msg, isFail=false){
  const tEl = document.getElementById('toast');
  tEl.textContent = msg;
  tEl.className = 'toast show' + (isFail ? ' fail-toast' : '');
  setTimeout(()=>{ tEl.className = 'toast'; }, 3200);
}

/* ---------------- RENDER DISPATCHER ---------------- */
function render(){
  setTheme(currentTheme);
  const main = document.getElementById('main');
  const eyebrowEl = document.getElementById('app-eyebrow');
  const titleEl = document.getElementById('app-title');

  eyebrowEl.textContent = t('appEyebrow');
  titleEl.textContent = t('appTitle');

  // mode-toggle buttons active state
  const tabField = document.getElementById('tab-field');
  const tabAdmin = document.getElementById('tab-admin');
  if(tabField && tabAdmin){
    tabField.className = (mode==='field'||mode==='field-login'||mode==='lock') ? 'active' : '';
    tabAdmin.className = (mode==='admin'||mode==='supervisor') ? 'active' : '';
    tabField.textContent = t('tabField');
    tabAdmin.textContent = t('tabAdmin');
  }

  if(mode===null){
    main.innerHTML = renderLanding();
    attachLandingEvents();
  } else if(mode==='field-login'){
    main.innerHTML = renderFieldLogin();
    attachFieldLoginEvents();
  } else if(mode==='field'){
    main.innerHTML = renderFieldView();
    attachFieldEvents();
  } else if(mode==='lock'){
    main.innerHTML = renderAdminLock();
    attachAdminLockEvents();
  } else if(mode==='admin'||mode==='supervisor'){
    main.innerHTML = renderAdminView();
    attachAdminEvents();
  }
}

/* ================= LANDING VIEW ================= */
function renderLanding(){
  return `
    <div class="landing-wrap">
      <div class="landing-card">
        <div class="landing-eyebrow">משק בית &middot; מערכת בטיחות ואחזקה</div>
        <div class="landing-buttons">
          <button class="landing-btn field" id="go-field">
            <span class="landing-icon">👷</span>
            <span class="landing-title">${t('landingFieldTitle')}</span>
            <span class="landing-sub">${t('landingFieldSub')}</span>
          </button>
          <button class="landing-btn supervisor" id="go-supervisor">
            <span class="landing-icon">🕵️</span>
            <span class="landing-title">${t('landingSupervisorTitle')}</span>
            <span class="landing-sub">${t('landingSupervisorSub')}</span>
          </button>
          <button class="landing-btn admin" id="go-admin">
            <span class="landing-icon">📊</span>
            <span class="landing-title">${t('landingAdminTitle')}</span>
            <span class="landing-sub">${t('landingAdminSub')}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
function attachLandingEvents(){
  document.getElementById('go-field').onclick = ()=>{
    isReadOnly = false;
    supervisorName = '';
    supervisorLoginError = '';
    mode = 'field-login';
    render();
  };
  document.getElementById('go-supervisor').onclick = ()=>{
    isReadOnly = true;
    supervisorName = '';
    supervisorLoginError = '';
    mode = 'lock'; // reused for supervisor name prompt or admin lock
    render();
  };
  document.getElementById('go-admin').onclick = ()=>{
    isReadOnly = false;
    supervisorName = '';
    adminUnlocked = false;
    passwordDraft = '';
    passwordError = '';
    mode = 'lock';
    render();
  };
}

/* ================= SUPERVISOR LOGIN ================= */
function renderSupervisorLogin(){
  return `
    <div class="landing-wrap">
      <div class="landing-card lock-card">
        <div class="landing-eyebrow">${t('supervisorLoginEyebrow')}</div>
        <div class="lock-title">${t('supervisorLoginTitle')}</div>
        <div class="worker-form">
          <input type="text" class="worker-input" id="sup-name" placeholder="לדוגמה: אברהם כהן" value="${escapeHtml(supervisorName)}">
          ${supervisorLoginError ? `<div class="lock-error">${supervisorLoginError}</div>` : ''}
          <button class="scan-btn" id="sup-submit">${t('supervisorLoginSubmit')}</button>
        </div>
        <div style="margin-top:16px;">
          <button class="back-link" id="sup-back">${backArrow()} ${t('backLink')}</button>
        </div>
      </div>
    </div>
  `;
}
function attachSupervisorLoginEvents(){
  document.getElementById('sup-submit').onclick = ()=>{
    const val = document.getElementById('sup-name').value.trim();
    if(!val){
      supervisorLoginError = t('supervisorLoginError');
      render();
      return;
    }
    if(!isLettersOnly(val)){
      supervisorLoginError = t('lettersOnlyError', t('fieldFullName'));
      render();
      return;
    }
    supervisorName = val;
    adminName = val;
    mode = 'supervisor';
    render();
  };
  document.getElementById('sup-back').onclick = ()=>{
    mode = null;
    render();
  };
}

/* ================= FIELD LOGIN ================= */
function renderFieldLogin(){
  return `
    <div class="landing-wrap">
      <div class="landing-card lock-card">
        <div class="landing-eyebrow">${t('workerLoginEyebrow')}</div>
        <div class="lock-title">${t('workerLoginTitle')}</div>
        <div class="worker-form">
          <div>
            <label class="field-label">${t('fieldFullName')}</label>
            <input type="text" class="worker-input" id="w-name" placeholder="${t('placeholderName')}" value="${escapeHtml(inspectorName)}">
          </div>
          <div>
            <label class="field-label">${t('fieldEmployeeId')}</label>
            <input type="text" class="worker-input" id="w-id" placeholder="${t('placeholderId')}" value="${escapeHtml(workerEmployeeNumber)}">
          </div>
          <div>
            <label class="field-label">${t('fieldRole')}</label>
            <input type="text" class="worker-input" id="w-role" placeholder="${t('placeholderRole')}" value="${escapeHtml(workerDepartment)}">
          </div>
          ${workerLoginError ? `<div class="lock-error">${workerLoginError}</div>` : ''}
          <button class="scan-btn" id="w-submit" style="margin-top:8px;">${t('workerLoginSubmit')}</button>
        </div>
        <div style="margin-top:16px;">
          <button class="back-link" id="w-back">${backArrow()} ${t('backLink')}</button>
        </div>
      </div>
    </div>
  `;
}
function attachFieldLoginEvents(){
  document.getElementById('w-submit').onclick = ()=>{
    const name = document.getElementById('w-name').value.trim();
    const id = document.getElementById('w-id').value.trim();
    const role = document.getElementById('w-role').value.trim();
    if(!name || !id || !role){
      workerLoginError = t('workerLoginError');
      render();
      return;
    }
    if(!isLettersOnly(name)){
      workerLoginError = t('lettersOnlyError', t('fieldFullName'));
      render();
      return;
    }
    if(!isDigitsOnly(id)){
      workerLoginError = t('digitsOnlyError', t('fieldEmployeeId'));
      render();
      return;
    }
    inspectorName = name;
    workerEmployeeNumber = id;
    workerDepartment = role;
    workerLoginError = '';
    fieldScreen = 'scan';
    scanSelectedCategory = null;
    selectedAsset = null;
    mode = 'field';
    render();
  };
  document.getElementById('w-back').onclick = ()=>{
    mode = null;
    render();
  };
}

/* ================= ADMIN LOCK / SUPERVISOR LOCK ================= */
function renderAdminLock(){
  if(isReadOnly) return renderSupervisorLogin();
  return `
    <div class="landing-wrap">
      <div class="landing-card lock-card">
        <div class="landing-eyebrow">${t('adminLockEyebrow')}</div>
        <div class="lock-title">${t('adminLockTitle')}</div>
        <div class="lock-input-wrap">
          <input type="password" class="lock-input" id="lock-pw" placeholder="••••" value="${escapeHtml(passwordDraft)}">
          <button class="lock-eye-btn" id="lock-eye-btn" title="${t('showPassword')}" aria-label="${t('showPassword')}">👁</button>
        </div>
        ${passwordError ? `<div class="lock-error">${passwordError}</div>` : ''}
        <button class="scan-btn" id="lock-submit" style="margin-top:16px;">${t('adminLockSubmit')}</button>
        <div style="margin-top:16px;">
          <button class="back-link" id="lock-back">${backArrow()} ${t('backLink')}</button>
        </div>
      </div>
    </div>
  `;
}
function attachAdminLockEvents(){
  if(isReadOnly){
    attachSupervisorLoginEvents();
    return;
  }
  const pwInput = document.getElementById('lock-pw');
  const eyeBtn = document.getElementById('lock-eye-btn');
  if(pwInput){
    pwInput.focus();
    pwInput.oninput = (e)=>{ passwordDraft = e.target.value; };
    pwInput.onkeydown = (e)=>{ if(e.key==='Enter') document.getElementById('lock-submit').click(); };
  }
  if(eyeBtn && pwInput){
    eyeBtn.onclick = ()=>{
      if(pwInput.type==='password'){
        pwInput.type = 'text';
        eyeBtn.textContent = '🔒';
        eyeBtn.setAttribute('title', t('hidePassword'));
        eyeBtn.setAttribute('aria-label', t('hidePassword'));
      } else {
        pwInput.type = 'password';
        eyeBtn.textContent = '👁';
        eyeBtn.setAttribute('title', t('showPassword'));
        eyeBtn.setAttribute('aria-label', t('showPassword'));
      }
    };
  }
  document.getElementById('lock-submit').onclick = ()=>{
    if(passwordDraft==='1234' || passwordDraft==='admin'){
      adminUnlocked = true;
      adminName = 'מנהל ראשי';
      passwordError = '';
      mode = 'admin';
      render();
    } else {
      passwordError = t('adminLockError');
      render();
    }
  };
  document.getElementById('lock-back').onclick = ()=>{
    mode = null;
    render();
  };
}

/* ================= FIELD VIEW ================= */
let activeVideoStream = null;
function stopCamera(){
  if(activeVideoStream){
    activeVideoStream.getTracks().forEach(tr=>tr.stop());
    activeVideoStream = null;
  }
}

function renderFieldView(){
  return `
    <div class="field-wrap">
      <div class="phone">
        <div class="phone-screen">
          <div class="field-header">
            <div class="field-header-top">
              <button class="entry-back-btn" id="field-entry-back">${t('backToEntry')}</button>
            </div>
            <div class="eyebrow">${t('scanEyebrow')}</div>
            <h2>משק בית &middot; בודק שטח</h2>
            <div class="inspector-row">
              <span class="inspector-badge">👤 ${escapeHtml(inspectorName)} (${escapeHtml(workerEmployeeNumber)})</span>
              <span class="inspector-badge">🏷️ ${escapeHtml(workerDepartment)}</span>
            </div>
          </div>
          <div class="hazard thin"></div>
          <div class="field-body" id="field-body-content">
            ${renderFieldBodyContent()}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFieldBodyContent(){
  if(fieldScreen==='scan'){
    if(scanSelectedCategory===null){
      // Show category folders + observation tile
      const totalObsDone = observationLogs.filter(o=>o.at.startsWith(new Date().toISOString().slice(0,7))).length;
      return `
        <div class="scan-instruction">
          ${t('scanInstruction')}
        </div>
        <button class="scan-btn" id="btn-camera-scan">
          <span class="dot"></span>
          ${t('scanCameraBtn')}
        </button>
        <div class="folder-grid" style="margin-top:4px;">
          ${categories.map(cat=>{
            const {done,total} = progressOf(cat.id);
            return `
              <div class="folder-tile" data-cat="${cat.id}">
                <div class="folder-icon">${cat.id==='ext'?'🧯':cat.id==='shower'?'🚿':cat.id==='cabinet'?'⚡':cat.id==='shelter'?'🛡️':'❤️'}</div>
                <div class="folder-name">${escapeHtml(cat.name)}</div>
                <div class="folder-count">${done}/${total} נבדקו</div>
              </div>
            `;
          }).join('')}
          <div class="folder-tile obs-folder" id="tile-obs-folder">
            <div class="folder-icon">👷</div>
            <div class="folder-name">בדיקת בטיחות עובדים (התנהגות בשטח)</div>
            <div class="folder-count ${totalObsDone>=OBS_MONTHLY_GOAL?'obs-met':'obs-open'}">
              ${totalObsDone}/${OBS_MONTHLY_GOAL} תצפיות החודש
            </div>
          </div>
        </div>
      `;
    } else {
      // Show list of assets for the selected category
      const cat = catOf(scanSelectedCategory);
      const list = assetsIn(scanSelectedCategory);
      return `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <button class="back-link" id="btn-back-folders" style="padding:5px 12px;font-size:11.5px;">${backArrow()} ${t('backLink')}</button>
          <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:13.5px;color:var(--charcoal);">${escapeHtml(cat.name)}</span>
        </div>
        <div class="scan-instruction">בחר פריט לרשימה או <b>סרוק QR</b></div>
        <button class="scan-btn" id="btn-camera-scan">
          <span class="dot"></span>
          ${t('scanCameraBtn')}
        </button>
        <div style="display:flex;flex-direction:column;gap:8px;overflow-y:auto;max-height:380px;margin-top:4px;">
          ${list.map(ast=>`
            <div class="qr-tile" data-asset="${ast.id}" style="display:flex;align-items:center;gap:12px;text-align:right;padding:10px 14px;">
              <div class="qr-code" style="width:48px;height:48px;margin:0;flex-shrink:0;" id="mini-qr-${ast.id}"></div>
              <div style="flex:1;min-width:0;">
                <div class="a-name" style="font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(ast.name)}</div>
                <div class="a-id" style="text-align:right;">${ast.id} · ${escapeHtml(ast.location)}</div>
              </div>
              <span class="a-status ${statusClass(ast.status)}">${statusLabel(ast.status)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  } else if(fieldScreen==='camera'){
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:13px;">${t('cameraEyebrow')}</span>
        <button class="back-link" id="btn-cancel-camera" style="padding:4px 10px;font-size:11px;">${t('cancelCamera')}</button>
      </div>
      <div class="camera-wrap">
        <video id="camera-video" autoplay playsinline muted></video>
        <div class="camera-frame"></div>
      </div>
      <div class="camera-status" id="camera-status-text">${t('cameraRequesting')}</div>
      <div style="display:flex;gap:8px;">
        <button class="scan-btn camera" id="btn-sim-scan" style="flex:1;font-size:12px;padding:10px;">🧪 הדמה סריקת QR מוצלחת</button>
      </div>
    `;
  } else if(fieldScreen==='obs-name'){
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <button class="back-link" id="btn-cancel-obs-name" style="padding:5px 12px;font-size:11.5px;">${backArrow()} ${t('backLink')}</button>
        <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:13.5px;color:var(--charcoal);">תצפית בטיחות עובד</span>
      </div>
      <div class="landing-card" style="padding:20px;max-width:100%;box-shadow:none;border:1px solid var(--line-light);">
        <div class="lock-title" style="font-size:16px;margin-bottom:12px;">הזן את שם העובד הנבדק</div>
        <div class="worker-form">
          <div>
            <label class="field-label">שם העובד המלא</label>
            <input type="text" class="worker-input" id="obs-emp-name" placeholder="לדוגמה: רון אביטן" value="${escapeHtml(observationEmployeeName)}">
          </div>
          ${observationNameError ? `<div class="lock-error">${observationNameError}</div>` : ''}
          <button class="scan-btn" id="btn-start-obs" style="margin-top:6px;">התחל צ'ק ליסט תצפית</button>
        </div>
      </div>
    `;
  } else if(fieldScreen==='obs-form'){
    const items = OBS_CHECKLIST;
    const allAnswered = items.every((_,idx)=>checklistStatus['obs_'+idx]);
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <button class="back-link" id="btn-back-obs-scan" style="padding:5px 12px;font-size:11.5px;">${backArrow()} ${t('backLink')}</button>
        <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:13px;color:var(--charcoal);">תצפית: ${escapeHtml(observationEmployeeName)}</span>
      </div>
      <div style="overflow-y:auto;max-height:460px;display:flex;flex-direction:column;gap:10px;padding-right:2px;">
        <div class="asset-card">
          <div class="a-type">BEHAVIORAL SAFETY OBSERVATION</div>
          <h3>${escapeHtml(observationEmployeeName)}</h3>
          <div class="asset-meta">
            <div><span class="k">משקיף:</span> <span>${escapeHtml(inspectorName)}</span></div>
            <div><span class="k">תאריך:</span> <span>${new Date().toLocaleDateString('he-IL')}</span></div>
          </div>
        </div>
        <div class="checklist-box">
          <div class="checklist-head">
            <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:12.5px;color:#5c4a10;">צ׳ק ליסט התנהגות בטיחותית</span>
            <span class="checklist-count">${items.filter((_,i)=>checklistStatus['obs_'+i]).length}/${items.length}</span>
          </div>
          ${items.map((q,idx)=>{
            const st = checklistStatus['obs_'+idx];
            const hasPhoto = !!checklistPhoto['obs_'+idx];
            return `
              <div class="chk-row-v2">
                <div class="chk-row-text"><b>${idx+1}.</b> ${escapeHtml(q)}</div>
                <div class="chk-row-actions">
                  <button class="chk-mini pass ${st==='pass'?'sel':''}" data-obs-idx="${idx}" data-val="pass">✓ תקין</button>
                  <button class="chk-mini fail ${st==='fail'?'sel':''}" data-obs-idx="${idx}" data-val="fail">✕ לא תקין</button>
                </div>
                ${st==='fail' ? `
                  <div class="chk-photo-row" style="margin-top:6px;">
                    <button class="chk-photo-btn ${hasPhoto?'on':''}" data-obs-photo="${idx}">
                      ${hasPhoto ? '🔄 החלף תמונה' : '📷 צרף תמונה לליקוי'}
                    </button>
                    ${hasPhoto ? `<img src="${checklistPhoto['obs_'+idx]}" class="chk-photo-thumb">` : ''}
                    ${hasPhoto ? `<button class="chk-photo-remove" data-obs-remove="${idx}" title="הסר תמונה">✕</button>` : ''}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
        <div class="result-summary ${allAnswered ? (Object.values(checklistStatus).some(v=>v==='fail')?'bad':'ok') : 'wait'}" id="obs-res-summary">
          ${allAnswered ? (Object.values(checklistStatus).some(v=>v==='fail')?'✕ נמצאו ליקויי התנהגות — תוצאה: לא תקין':'✓ כל הסעיפים תקינים — תוצאה: תקין') : `יש לענות על כל ${items.length} הסעיפים`}
        </div>
        <div>
          <label class="field-label">${t('commentsLabel')}</label>
          <textarea class="comment" id="obs-comment" placeholder="${t('commentsPlaceholder')}"></textarea>
        </div>
        <button class="submit-btn" id="btn-submit-obs" ${!allAnswered?'disabled':''}>${t('submitInspection')}</button>
      </div>
    `;
  } else if(fieldScreen==='form'){
    const cat = catOf(selectedAsset.catId);
    const questions = cat.checklist;
    const allAnswered = questions.every((_,idx)=>checklistStatus[idx]);
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <button class="back-link" id="btn-back-scan" style="padding:5px 12px;font-size:11.5px;">${backArrow()} ${t('backToScan')}</button>
        <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:13px;color:var(--charcoal);">${escapeHtml(cat.name)}</span>
      </div>
      <div style="overflow-y:auto;max-height:460px;display:flex;flex-direction:column;gap:10px;padding-right:2px;">
        <div class="asset-card">
          <div class="a-type">${escapeHtml(cat.id.toUpperCase())} &middot; ${escapeHtml(selectedAsset.id)}</div>
          <h3>${escapeHtml(selectedAsset.name)}</h3>
          <div class="asset-meta">
            <div><span class="k">${t('fieldLocation')}</span> <span>${escapeHtml(selectedAsset.location)}</span></div>
            <div><span class="k">${t('fieldFrequency')}</span> <span>${escapeHtml(cat.frequency)}</span></div>
            ${selectedAsset.expiryDate ? `<div><span class="k">תוקף:</span> <span style="font-family:'IBM Plex Mono',monospace;">${expiryLabel(selectedAsset.expiryDate)}</span></div>` : ''}
          </div>
        </div>

        <div class="checklist-box">
          <div class="checklist-head">
            <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:12.5px;color:#5c4a10;">${t('checklistHeader')}</span>
            <span class="checklist-count">${questions.filter((_,i)=>checklistStatus[i]).length}/${questions.length}</span>
          </div>
          ${questions.map((q,idx)=>{
            const st = checklistStatus[idx];
            const hasPhoto = !!checklistPhoto[idx];
            return `
              <div class="chk-row-v2">
                <div class="chk-row-text"><b>${idx+1}.</b> ${escapeHtml(q)}</div>
                <div class="chk-row-actions">
                  <button class="chk-mini pass ${st==='pass'?'sel':''}" data-chk-idx="${idx}" data-val="pass">${t('resultPass')}</button>
                  <button class="chk-mini fail ${st==='fail'?'sel':''}" data-chk-idx="${idx}" data-val="fail">${t('resultFail')}</button>
                </div>
                ${st==='fail' ? `
                  <div class="chk-photo-row" style="margin-top:6px;">
                    <button class="chk-photo-btn ${hasPhoto?'on':''}" data-photo-idx="${idx}">
                      ${hasPhoto ? t('replacePhoto') : t('attachPhoto')}
                    </button>
                    ${hasPhoto ? `<img src="${checklistPhoto[idx]}" class="chk-photo-thumb">` : ''}
                    ${hasPhoto ? `<button class="chk-photo-remove" data-remove-photo="${idx}" title="הסר תמונה">✕</button>` : ''}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="result-summary ${allAnswered ? (Object.values(checklistStatus).some(v=>v==='fail')?'bad':'ok') : 'wait'}" id="res-summary">
          ${allAnswered ? (Object.values(checklistStatus).some(v=>v==='fail')?t('resultSummaryBad'):t('resultSummaryOk')) : t('resultSummaryWait', questions.length)}
        </div>

        <div>
          <label class="field-label">${t('commentsLabel')}</label>
          <textarea class="comment" id="asset-comment" placeholder="${t('commentsPlaceholder')}"></textarea>
        </div>

        <button class="submit-btn" id="btn-submit-inspection" ${!allAnswered?'disabled':''}>${t('submitInspection')}</button>
      </div>
    `;
  } else if(fieldScreen==='photo-capture'){
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-family:'Heebo',sans-serif;font-weight:700;font-size:13px;">${t('photoEyebrow')}</span>
        <button class="back-link" id="btn-cancel-photo" style="padding:4px 10px;font-size:11px;">${t('cancelPhotoBtn')}</button>
      </div>
      <div class="camera-wrap">
        <video id="photo-video" autoplay playsinline muted></video>
        <div class="camera-frame"></div>
      </div>
      <div class="camera-status">${t('photoReady')}</div>
      <button class="scan-btn" id="btn-capture-now">${t('capturePhotoBtn')}</button>
    `;
  }
}

function attachFieldEvents(){
  const entryBack = document.getElementById('field-entry-back');
  if(entryBack){
    entryBack.onclick = ()=>{
      stopCamera();
      mode = null;
      render();
    };
  }

  // Folder tiles on scan screen
  document.querySelectorAll('.folder-tile[data-cat]').forEach(el=>{
    el.onclick = ()=>{
      scanSelectedCategory = el.getAttribute('data-cat');
      render();
    };
  });
  const backFolders = document.getElementById('btn-back-folders');
  if(backFolders){
    backFolders.onclick = ()=>{
      scanSelectedCategory = null;
      render();
    };
  }

  // Observation folder tile
  const obsFolder = document.getElementById('tile-obs-folder');
  if(obsFolder){
    obsFolder.onclick = ()=>{
      fieldScreen = 'obs-name';
      observationEmployeeName = '';
      observationNameError = '';
      render();
    };
  }
  const cancelObsName = document.getElementById('btn-cancel-obs-name');
  if(cancelObsName){
    cancelObsName.onclick = ()=>{
      fieldScreen = 'scan';
      render();
    };
  }
  const startObsBtn = document.getElementById('btn-start-obs');
  if(startObsBtn){
    startObsBtn.onclick = ()=>{
      const val = document.getElementById('obs-emp-name').value.trim();
      if(!val){
        observationNameError = 'יש להזין שם עובד';
        render();
        return;
      }
      if(!isLettersOnly(val)){
        observationNameError = 'שם עובד יכול להכיל אותיות בלבד';
        render();
        return;
      }
      observationEmployeeName = val;
      checklistStatus = {};
      checklistPhoto = {};
      fieldScreen = 'obs-form';
      render();
    };
  }
  const backObsScan = document.getElementById('btn-back-obs-scan');
  if(backObsScan){
    backObsScan.onclick = ()=>{
      fieldScreen = 'scan';
      render();
    };
  }

  // Observation checklist buttons
  document.querySelectorAll('.chk-mini[data-obs-idx]').forEach(btn=>{
    btn.onclick = ()=>{
      const idx = btn.getAttribute('data-obs-idx');
      const val = btn.getAttribute('data-val');
      checklistStatus['obs_'+idx] = val;
      if(val==='pass'){ delete checklistPhoto['obs_'+idx]; }
      render();
    };
  });
  document.querySelectorAll('button[data-obs-photo]').forEach(btn=>{
    btn.onclick = ()=>{
      photoCaptureIndex = 'obs_'+btn.getAttribute('data-obs-photo');
      // Simulate photo capture directly
      checklistPhoto[photoCaptureIndex] = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="%23D64545" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M9 3v2m6-2v2"/></svg>';
      showToast(t('photoCapturedToast'));
      render();
    };
  });
  document.querySelectorAll('button[data-obs-remove]').forEach(btn=>{
    btn.onclick = ()=>{
      delete checklistPhoto['obs_'+btn.getAttribute('data-obs-remove')];
      render();
    };
  });
  const submitObsBtn = document.getElementById('btn-submit-obs');
  if(submitObsBtn){
    submitObsBtn.onclick = ()=>{
      const comment = document.getElementById('obs-comment').value.trim();
      const hasFail = Object.values(checklistStatus).some(v=>v==='fail');
      const result = hasFail ? 'fail' : 'pass';
      const answers = OBS_CHECKLIST.map((q,i)=>({ text:q, status:checklistStatus['obs_'+i], photo:checklistPhoto['obs_'+i]||null }));
      const newObs = {
        id: 'obs-' + (observationLogs.length + 1),
        employeeName: observationEmployeeName,
        worker: inspectorName,
        workerId: workerEmployeeNumber,
        at: nowStamp(),
        result,
        comment,
        answers
      };
      observationLogs.unshift(newObs);
      showToast(`תצפית עבור ${observationEmployeeName} נרשמה כ-${statusLabel(result)}`);
      fieldScreen = 'scan';
      scanSelectedCategory = null;
      render();
    };
  }

  // QR tiles in category view
  document.querySelectorAll('.qr-tile[data-asset]').forEach(el=>{
    el.onclick = ()=>{
      const aid = el.getAttribute('data-asset');
      selectedAsset = assets.find(a=>a.id===aid);
      if(selectedAsset){
        checklistStatus = {};
        checklistPhoto = {};
        fieldScreen = 'form';
        render();
      }
    };
  });

  // Render mini QR codes for the list
  assetsIn(scanSelectedCategory||'').forEach(ast=>{
    const el = document.getElementById(`mini-qr-${ast.id}`);
    if(el && typeof QRCode !== 'undefined'){
      el.innerHTML = '';
      new QRCode(el, { text: ast.id, width: 48, height: 48, correctLevel: QRCode.CorrectLevel.L });
    }
  });

  // Camera scan button
  const camBtn = document.getElementById('btn-camera-scan');
  if(camBtn){
    camBtn.onclick = ()=>{
      fieldScreen = 'camera';
      render();
      startRealCamera();
    };
  }

  const cancelCam = document.getElementById('btn-cancel-camera');
  if(cancelCam){
    cancelCam.onclick = ()=>{
      stopCamera();
      fieldScreen = 'scan';
      render();
    };
  }

  const simScan = document.getElementById('btn-sim-scan');
  if(simScan){
    simScan.onclick = ()=>{
      stopCamera();
      // Pick the first pending asset, or just EXT-017
      selectedAsset = assets.find(a=>a.status==='pending') || assets[0];
      checklistStatus = {};
      checklistPhoto = {};
      fieldScreen = 'form';
      render();
    };
  }

  // Inspection form checklist buttons
  document.querySelectorAll('.chk-mini[data-chk-idx]').forEach(btn=>{
    btn.onclick = ()=>{
      const idx = btn.getAttribute('data-chk-idx');
      const val = btn.getAttribute('data-val');
      checklistStatus[idx] = val;
      if(val==='pass'){ delete checklistPhoto[idx]; }
      render();
    };
  });

  document.querySelectorAll('button[data-photo-idx]').forEach(btn=>{
    btn.onclick = ()=>{
      photoCaptureIndex = btn.getAttribute('data-photo-idx');
      fieldScreen = 'photo-capture';
      render();
      startPhotoCamera();
    };
  });

  document.querySelectorAll('button[data-remove-photo]').forEach(btn=>{
    btn.onclick = ()=>{
      const idx = btn.getAttribute('data-remove-photo');
      delete checklistPhoto[idx];
      render();
    };
  });

  const cancelPhoto = document.getElementById('btn-cancel-photo');
  if(cancelPhoto){
    cancelPhoto.onclick = ()=>{
      stopCamera();
      fieldScreen = 'form';
      render();
    };
  }

  const captureNow = document.getElementById('btn-capture-now');
  if(captureNow){
    captureNow.onclick = ()=>{
      stopCamera();
      // Attach a mock SVG data URL representing the captured photo
      checklistPhoto[photoCaptureIndex] = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="%23D64545" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M9 3v2m6-2v2"/></svg>';
      showToast(t('photoCapturedToast'));
      fieldScreen = 'form';
      render();
    };
  }

  const backScan = document.getElementById('btn-back-scan');
  if(backScan){
    backScan.onclick = ()=>{
      fieldScreen = 'scan';
      render();
    };
  }

  const submitInsp = document.getElementById('btn-submit-inspection');
  if(submitInsp){
    submitInsp.onclick = ()=>{
      const comment = document.getElementById('asset-comment').value.trim();
      const hasFail = Object.values(checklistStatus).some(v=>v==='fail');
      const finalResult = hasFail ? 'fail' : 'pass';

      // Update asset
      selectedAsset.status = finalResult;
      selectedAsset.lastBy = inspectorName;
      selectedAsset.lastAt = nowStamp();

      // Build answers array with question texts
      const cat = catOf(selectedAsset.catId);
      const answers = cat.checklist.map((q,i)=>({
        text: q,
        status: checklistStatus[i] || 'pass',
        photo: checklistPhoto[i] || null
      }));

      // Add to logs
      logs.unshift({
        asset: selectedAsset.id,
        name: selectedAsset.name,
        worker: inspectorName,
        at: selectedAsset.lastAt,
        result: finalResult,
        comment,
        answers
      });

      showToast(t('toastLogged', selectedAsset.id, statusLabel(finalResult)));
      fieldScreen = 'scan';
      scanSelectedCategory = null;
      render();
    };
  }
}

function startRealCamera(){
  const video = document.getElementById('camera-video');
  const statusEl = document.getElementById('camera-status-text');
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    if(statusEl) statusEl.textContent = t('cameraNotSupported');
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream=>{
      activeVideoStream = stream;
      if(video){ video.srcObject = stream; video.play(); }
      if(statusEl) statusEl.textContent = t('cameraSearching');
      requestAnimationFrame(scanQRCodeLoop);
    })
    .catch(err=>{
      console.warn('Camera error:', err);
      if(statusEl) statusEl.textContent = t('cameraDenied');
    });
}

function startPhotoCamera(){
  const video = document.getElementById('photo-video');
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream=>{
      activeVideoStream = stream;
      if(video){ video.srcObject = stream; video.play(); }
    })
    .catch(err=>{ console.warn('Photo camera error:', err); });
}

function scanQRCodeLoop(){
  if(fieldScreen!=='camera') return;
  const video = document.getElementById('camera-video');
  const statusEl = document.getElementById('camera-status-text');
  if(video && video.readyState===video.HAVE_ENOUGH_DATA){
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if(typeof jsQR !== 'undefined'){
      const code = jsQR(imgData.data, imgData.width, imgData.height);
      if(code && code.data){
        stopCamera();
        const found = assets.find(a=>a.id.toLowerCase()===code.data.toLowerCase());
        if(found){
          selectedAsset = found;
          checklistStatus = {};
          checklistPhoto = {};
          fieldScreen = 'form';
          render();
          return;
        } else {
          if(statusEl) statusEl.textContent = t('cameraNotRecognized', code.data);
          setTimeout(()=>{ requestAnimationFrame(scanQRCodeLoop); }, 1500);
          return;
        }
      }
    }
  }
  requestAnimationFrame(scanQRCodeLoop);
}

/* ================= ADMIN VIEW ================= */
function renderAdminView(){
  return `
    <div class="admin-wrap">
      <div class="sidebar">
        <div class="s-item ${adminTab==='dashboard'?'active':''}" data-tab="dashboard">📊 ${t('tabDashboard')}</div>
        <div class="s-item ${adminTab==='assets'?'active':''}" data-tab="assets">🏷️ ${t('tabAssets')}</div>
        <div class="s-item ${adminTab==='categories'?'active':''}" data-tab="categories">📁 ${t('tabCategories')}</div>
        <div class="s-item ${adminTab==='workers'?'active':''}" data-tab="workers">👷 ${t('tabWorkers')}</div>
        <div class="s-item ${adminTab==='obs'?'active':''}" data-tab="obs">👁️ תצפיות עובדים</div>
        <div class="s-item ${adminTab==='history'?'active':''}" data-tab="history">📋 ${t('tabHistory')}</div>
        <div class="s-item ${adminTab==='export'?'active':''}" data-tab="export">📥 ${t('tabExport')}</div>
        <div class="s-item ${adminTab==='audit'?'active':''}" data-tab="audit">🛡️ יומן אבטחה</div>
      </div>
      <div class="admin-content">
        ${isReadOnly ? `<div class="readonly-banner">${t('readOnlyBadge', supervisorName)}</div>` : ''}
        ${adminTab==='dashboard' ? renderAdminDashboard() : ''}
        ${adminTab==='assets' ? renderAdminAssets() : ''}
        ${adminTab==='categories' ? renderAdminCategories() : ''}
        ${adminTab==='workers' ? renderAdminWorkers() : ''}
        ${adminTab==='obs' ? renderAdminObs() : ''}
        ${adminTab==='history' ? renderAdminHistory() : ''}
        ${adminTab==='export' ? renderAdminExport() : ''}
        ${adminTab==='audit' ? renderAdminAudit() : ''}
      </div>
    </div>
    ${openInspectionLog ? renderInspectionModal() : ''}
    ${openCategoryDrilldown ? renderCategoryModal() : ''}
    ${openWorkerDrilldown ? renderWorkerModal() : ''}
    ${previewFormat ? renderPreviewModal() : ''}
    ${openObservationLog ? renderObservationModal() : ''}
  `;
}

function attachAdminEvents(){
  document.querySelectorAll('.sidebar .s-item').forEach(el=>{
    el.onclick = ()=>{
      adminTab = el.getAttribute('data-tab');
      render();
    };
  });

  // Dashboard buttons & rows
  const resetBtn = document.getElementById('btn-simulate-reset');
  if(resetBtn){
    resetBtn.onclick = ()=>{
      assets.forEach(a=>{ a.status = 'pending'; a.lastBy = null; a.lastAt = null; });
      logAdminAction('איפוס מחזור', 'אפס את סטטוס כל הפריטים לממתין');
      showToast('המחזור החודשי אופס בהצלחה — כל הפריטים חזרו למצב ממתין');
      render();
    };
  }

  document.querySelectorAll('.prog-card[data-cat-drill]').forEach(card=>{
    card.onclick = ()=>{
      openCategoryDrilldown = card.getAttribute('data-cat-drill');
      render();
    };
  });

  document.querySelectorAll('.clickable-inspection').forEach(row=>{
    row.onclick = ()=>{
      const id = row.getAttribute('data-log-id');
      openInspectionLog = logs.find(l=>l.asset===id || l.at===id);
      render();
    };
  });

  document.querySelectorAll('.clickable-obs-row').forEach(row=>{
    row.onclick = ()=>{
      const oid = row.getAttribute('data-obs-id');
      openObservationLog = observationLogs.find(o=>o.id===oid);
      render();
    };
  });

  document.querySelectorAll('button[data-resolve-fail]').forEach(btn=>{
    btn.onclick = (e)=>{
      e.stopPropagation();
      if(isReadOnly) return;
      const aid = btn.getAttribute('data-resolve-fail');
      const ast = assets.find(a=>a.id===aid);
      if(ast){
        ast.status = 'resolved';
        logs.unshift({
          asset: ast.id,
          name: ast.name,
          worker: adminName || 'מנהל',
          at: nowStamp(),
          result: 'resolved',
          comment: 'סומן כטופל ידנית על ידי מנהל',
          answers: []
        });
        logAdminAction('סימון כטופל', `פריט ${aid} (${ast.name}) סומן כטופל`);
        showToast(`הפריט ${aid} סומן כטופל`);
        render();
      }
    };
  });

  // Assets tab
  const addAssetBtn = document.getElementById('btn-add-asset');
  if(addAssetBtn && !isReadOnly){
    addAssetBtn.onclick = ()=>{
      const name = document.getElementById('new-asset-name').value.trim();
      const id = document.getElementById('new-asset-id').value.trim();
      const catId = document.getElementById('new-asset-cat').value;
      const location = document.getElementById('new-asset-loc').value.trim();
      if(!name || !id || !location){
        showToast('יש למלא את כל שדות הפריט', true);
        return;
      }
      if(assets.some(a=>a.id.toLowerCase()===id.toLowerCase())){
        showToast('מזהה פריט זהה כבר קיים במערכת', true);
        return;
      }
      assets.push({ id, name, catId, location, status:'pending', lastBy:null, lastAt:null, expiryDate:'2027-01-01' });
      logAdminAction('הוספת פריט', `נוסף פריט חדש ${id} (${name})`);
      showToast(`הפריט ${id} נוסף בהצלחה`);
      render();
    };
  }

  document.querySelectorAll('button[data-del-asset]').forEach(btn=>{
    btn.onclick = ()=>{
      if(isReadOnly) return;
      const aid = btn.getAttribute('data-del-asset');
      const idx = assets.findIndex(a=>a.id===aid);
      if(idx>=0){
        assets.splice(idx, 1);
        logAdminAction('מחיקת פריט', `הוסר פריט ${aid}`);
        showToast(`הפריט ${aid} נמחק`);
        render();
      }
    };
  });

  document.querySelectorAll('button[data-print-qr]').forEach(btn=>{
    btn.onclick = ()=>{
      const aid = btn.getAttribute('data-print-qr');
      const ast = assets.find(a=>a.id===aid);
      if(!ast) return;
      const cat = catOf(ast.catId);
      const sheetHtml = `
        <div class="print-sheet">
          <div class="qr-label">
            <div class="qr-label-strip"></div>
            <div class="qr-label-qr" id="print-qr-box-${ast.id}"></div>
            <div class="qr-label-name">${escapeHtml(ast.name)}</div>
            <div class="qr-label-id">${ast.id}</div>
            <div class="qr-label-cat">${escapeHtml(cat.name)} · ${escapeHtml(ast.location)}</div>
            <div class="qr-label-foot">משק בית · בטיחות מפעל</div>
          </div>
        </div>
      `;
      window.printSheet(sheetHtml);
      setTimeout(()=>{
        const box = document.getElementById(`print-qr-box-${ast.id}`);
        if(box && typeof QRCode !== 'undefined'){
          new QRCode(box, { text: ast.id, width: 110, height: 110, correctLevel: QRCode.CorrectLevel.M });
        }
      }, 100);
    };
  });

  const printAllBtn = document.getElementById('btn-print-all-qr');
  if(printAllBtn){
    printAllBtn.onclick = ()=>{
      const sheetHtml = `
        <div class="print-sheet grid">
          ${assets.map((ast, i)=>{
            const cat = catOf(ast.catId);
            return `
              <div class="qr-label">
                <div class="qr-label-strip"></div>
                <div class="qr-label-qr" id="print-all-qr-${i}"></div>
                <div class="qr-label-name">${escapeHtml(ast.name)}</div>
                <div class="qr-label-id">${ast.id}</div>
                <div class="qr-label-cat">${escapeHtml(cat ? cat.name : '')} · ${escapeHtml(ast.location)}</div>
                <div class="qr-label-foot">משק בית · בטיחות מפעל</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
      window.printSheet(sheetHtml);
      setTimeout(()=>{
        assets.forEach((ast, i)=>{
          const box = document.getElementById(`print-all-qr-${i}`);
          if(box && typeof QRCode !== 'undefined'){
            new QRCode(box, { text: ast.id, width: 110, height: 110, correctLevel: QRCode.CorrectLevel.M });
          }
        });
      }, 150);
    };
  }

  // Asset search filter
  const searchInput = document.getElementById('asset-search-input');
  if(searchInput){
    searchInput.oninput = (e)=>{
      assetSearchQuery = e.target.value;
      // Re-filter table rows without full re-render for responsiveness
      const q = assetSearchQuery.toLowerCase();
      document.querySelectorAll('#asset-table-body tr').forEach(tr=>{
        const text = tr.textContent.toLowerCase();
        tr.style.display = text.includes(q) ? '' : 'none';
      });
    };
  }
  const clearSearch = document.getElementById('asset-search-clear');
  if(clearSearch){
    clearSearch.onclick = ()=>{
      assetSearchQuery = '';
      const input = document.getElementById('asset-search-input');
      if(input) input.value = '';
      document.querySelectorAll('#asset-table-body tr').forEach(tr=>{ tr.style.display = ''; });
    };
  }

  // Categories tab
  const addCatBtn = document.getElementById('btn-add-category');
  if(addCatBtn && !isReadOnly){
    addCatBtn.onclick = ()=>{
      const name = document.getElementById('new-cat-name').value.trim();
      const freq = document.getElementById('new-cat-freq').value;
      if(!name){ showToast('יש להזין שם קטגוריה', true); return; }
      const id = 'cat-' + Math.random().toString(36).substr(2, 5);
      categories.push({ id, name, frequency: freq, checklist: [
        'האם הפריט בתוקף ובמקומו המיועד?',
        'אין נזק פיזי או פגם חיצוני',
        'הגישה לפריט פנויה ואינה חסומה'
      ]});
      logAdminAction('הוספת קטגוריה', `נוספה קטגוריה חדשה ${name}`);
      showToast(`הקטגוריה "${name}" נוצרה בהצלחה`);
      render();
    };
  }

  document.querySelectorAll('.freq-select[data-cat-freq]').forEach(sel=>{
    sel.onchange = ()=>{
      if(isReadOnly) return;
      const cid = sel.getAttribute('data-cat-freq');
      const cat = catOf(cid);
      if(cat){
        cat.frequency = sel.value;
        logAdminAction('שינוי תדירות', `קטגוריה ${cat.name} שונתה לתדירות ${sel.value}`);
        showToast('התדירות עודכנה');
      }
    };
  });

  document.querySelectorAll('button[data-del-chk]').forEach(btn=>{
    btn.onclick = ()=>{
      if(isReadOnly) return;
      const cid = btn.getAttribute('data-cat-id');
      const idx = parseInt(btn.getAttribute('data-del-chk'), 10);
      const cat = catOf(cid);
      if(cat && cat.checklist.length>1){
        cat.checklist.splice(idx, 1);
        render();
      } else {
        showToast('חייב להישאר לפחות סעיף אחד בצ׳ק ליסט', true);
      }
    };
  });

  document.querySelectorAll('button[data-add-chk]').forEach(btn=>{
    btn.onclick = ()=>{
      if(isReadOnly) return;
      const cid = btn.getAttribute('data-add-chk');
      const input = document.getElementById(`new-chk-input-${cid}`);
      const val = input ? input.value.trim() : '';
      if(!val) return;
      const cat = catOf(cid);
      if(cat){
        cat.checklist.push(val);
        render();
      }
    };
  });

  // Expiry date inputs on asset tab
  document.querySelectorAll('.expiry-input').forEach(inp=>{
    inp.onchange = ()=>{
      if(isReadOnly) return;
      const aid = inp.getAttribute('data-expiry-asset');
      const ast = assets.find(a=>a.id===aid);
      if(ast){
        ast.expiryDate = inp.value || null;
        showToast(`תוקף ${aid} עודכן`);
        render();
      }
    };
  });

  // Workers tab rows
  document.querySelectorAll('.clickable-worker').forEach(row=>{
    row.onclick = ()=>{
      openWorkerDrilldown = row.getAttribute('data-worker-name');
      render();
    };
  });

  // Export buttons
  const dlCsv = document.getElementById('btn-download-csv');
  if(dlCsv){
    dlCsv.onclick = ()=>{
      let csv = '\uFEFFחותמת זמן,פריט,מזהה,בודק,תוצאה,הערה\n';
      logs.forEach(l=>{
        csv += `"${l.at}","${l.name}","${l.asset}","${l.worker}","${statusLabel(l.result)}","${(l.comment||'').replace(/"/g,'""')}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `mishek-bayit-safety-audit-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      logAdminAction('ייצוא CSV', 'הורדת יומן בדיקות כקובץ CSV');
      showToast('קובץ CSV הורד בהצלחה');
    };
  }

  const dlWord = document.getElementById('btn-download-word');
  if(dlWord){
    dlWord.onclick = ()=>{
      const htmlDoc = `
        <html dir="rtl" lang="he">
        <head><meta charset="UTF-8"><title>דוח תאימות בטיחות</title></head>
        <body style="font-family:Arial,sans-serif;direction:rtl;padding:20px;">
          <h1 style="color:#1C1F22;">משק בית · דוח תאימות בדיקות בטיחות</h1>
          <p>הופק בתאריך: ${new Date().toLocaleString('he-IL')}</p>
          <hr/>
          <h2>סיכום מחזורים וסטטוס פריטים</h2>
          <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;font-size:12px;">
            <tr style="background:#EDEDE9;"><th>קטגוריה</th><th>תדירות</th><th>סה״כ פריטים</th><th>נבדקו</th><th>עמידה במחזור</th></tr>
            ${categories.map(c=>{
              const {done,total} = progressOf(c.id);
              const ok = total>0 && done===total;
              return `<tr><td>${escapeHtml(c.name)}</td><td>${c.frequency}</td><td>${total}</td><td>${done}</td><td style="color:${ok?'green':'goldenrod'}">${ok?'עומד ביעד':'בטיפול'}</td></tr>`;
            }).join('')}
          </table>
          <h2>יומן בדיקות אחרון</h2>
          <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;font-size:12px;">
            <tr style="background:#EDEDE9;"><th>חותמת זמן</th><th>פריט</th><th>מזהה</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr>
            ${logs.map(l=>`<tr><td>${l.at}</td><td>${escapeHtml(l.name)}</td><td>${l.asset}</td><td>${escapeHtml(l.worker)}</td><td>${statusLabel(l.result)}</td><td>${escapeHtml(l.comment||'')}</td></tr>`).join('')}
          </table>
        </body>
        </html>
      `;
      const blob = new Blob(['\uFEFF' + htmlDoc], { type: 'application/msword;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `mishek-bayit-compliance-report-${new Date().toISOString().slice(0,10)}.doc`;
      a.click();
      logAdminAction('ייצוא Word', 'הורדת דוח תאימות כקובץ Word');
      showToast('מסמך Word הורד בהצלחה');
    };
  }

  const genPdf = document.getElementById('btn-generate-pdf');
  if(genPdf){
    genPdf.onclick = ()=>{
      const reportHtml = `
        <div class="print-report">
          <h1>${t('reportTitle')}</h1>
          <p>הופק בתאריך: ${new Date().toLocaleString('he-IL')} | מנהל: ${escapeHtml(adminName)}</p>
          <h3>סיכום קטגוריות</h3>
          <table>
            <tr><th>קטגוריה</th><th>תדירות</th><th>סטטוס בדיקות</th></tr>
            ${categories.map(c=>{
              const {done,total} = progressOf(c.id);
              return `<tr><td>${escapeHtml(c.name)}</td><td>${c.frequency}</td><td>${done} מתוך ${total} נבדקו</td></tr>`;
            }).join('')}
          </table>
          <h3 style="margin-top:6mm;">יומן ביקורת מפורט</h3>
          <table>
            <tr><th>חותמת זמן</th><th>פריט</th><th>מזהה</th><th>בודק</th><th>תוצאה</th><th>הערה</th></tr>
            ${logs.map(l=>`<tr><td>${l.at}</td><td>${escapeHtml(l.name)}</td><td>${l.asset}</td><td>${escapeHtml(l.worker)}</td><td>${statusLabel(l.result)}</td><td>${escapeHtml(l.comment||'-')}</td></tr>`).join('')}
          </table>
        </div>
      `;
      window.printSheet(reportHtml);
      logAdminAction('הפקת PDF', 'פתיחת חלון הדפסה לדוח PDF');
    };
  }

  // Preview modal triggers
  document.querySelectorAll('button[data-preview-cat]').forEach(btn=>{
    btn.onclick = ()=>{
      previewCategoryId = btn.getAttribute('data-preview-cat');
      previewIsObs = false;
      previewFormat = 'table';
      render();
    };
  });
  const previewObsBtn = document.getElementById('btn-preview-obs');
  if(previewObsBtn){
    previewObsBtn.onclick = ()=>{
      previewIsObs = true;
      previewCategoryId = null;
      previewFormat = 'table';
      render();
    };
  }

  // Modal close buttons
  const modalClose = document.getElementById('modal-close-btn');
  if(modalClose){ modalClose.onclick = ()=>{ openInspectionLog = null; render(); }; }
  const catModalClose = document.getElementById('cat-modal-close-btn');
  if(catModalClose){ catModalClose.onclick = ()=>{ openCategoryDrilldown = null; render(); }; }
  const workerModalClose = document.getElementById('worker-modal-close-btn');
  if(workerModalClose){ workerModalClose.onclick = ()=>{ openWorkerDrilldown = null; render(); }; }
  const previewClose = document.getElementById('preview-close-btn');
  if(previewClose){ previewClose.onclick = ()=>{ previewFormat = null; render(); }; }
  const obsModalClose = document.getElementById('obs-modal-close-btn');
  if(obsModalClose){ openObservationLog = null; render(); }
  const backdrop = document.getElementById('modal-backdrop-el');
  if(backdrop){
    backdrop.onclick = (e)=>{
      if(e.target===backdrop){
        openInspectionLog = null;
        openCategoryDrilldown = null;
        openWorkerDrilldown = null;
        previewFormat = null;
        openObservationLog = null;
        render();
      }
    };
  }
}

/* ================= ADMIN SUB-VIEWS ================= */
function renderAdminDashboard(){
  const failedAssets = assets.filter(a=>a.status==='fail');
  const cycleAlerts = categories.map(cat=>{
    const days = daysUntilCycleEnd(cat.frequency);
    const {done,total} = progressOf(cat.id);
    if(days!==null && days<=7 && done<total){
      return { cat, days, done, total };
    }
    return null;
  }).filter(Boolean);

  return `
    <h2 class="page-title">${t('dashboardTitle')}</h2>
    <div class="page-sub">${t('dashboardSub')}</div>

    <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
      <button class="btn yellow small" id="btn-simulate-reset">🔄 ${t('simulateReset')}</button>
    </div>

    ${cycleAlerts.length>0 ? `
      <div class="alert-panel cycle-alert">
        <div class="alert-head">
          <div class="alert-title-wrap">
            <span class="alert-badge cycle">⏰</span>
            <h3>התראות סיום מחזור בדיקות מתקרב</h3>
          </div>
        </div>
        <div class="cycle-alert-list">
          ${cycleAlerts.map(al=>`
            <div class="cycle-alert-row clickable-row" data-cat-drill="${al.cat.id}">
              <div><b>${escapeHtml(al.cat.name)}</b> (${al.cat.frequency}) — נותרו <b>${al.days} ימים</b> לסיום המחזור (${al.done}/${al.total} נבדקו).</div>
              <div class="cycle-alert-arrow">הצג קטגוריה ←</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${failedAssets.length>0 ? `
      <div class="alert-panel">
        <div class="alert-head">
          <div class="alert-title-wrap">
            <span class="alert-badge">${failedAssets.length}</span>
            <h3>${t('alertPanelTitle')}</h3>
          </div>
          <div style="font-size:12px;color:var(--gray);margin-top:2px;">${t('alertPanelHint')}</div>
        </div>
        <div class="table-wrap" style="margin-bottom:0;border:none;">
          <table>
            <thead>
              <tr>
                <th>${t('colId')}</th>
                <th>${t('colAsset')}</th>
                <th>${t('colLocation')}</th>
                <th>${t('colWorker')}</th>
                <th>${t('colTimestamp')}</th>
                <th>פעולה</th>
              </tr>
            </thead>
            <tbody>
              ${failedAssets.map(ast=>{
                const lastLog = logs.find(l=>l.asset===ast.id && l.result==='fail');
                return `
                  <tr class="clickable-inspection" data-log-id="${ast.id}">
                    <td class="mono-cell">${ast.id}</td>
                    <td><b>${escapeHtml(ast.name)}</b></td>
                    <td>${escapeHtml(ast.location)}</td>
                    <td>${escapeHtml(lastLog ? lastLog.worker : '—')}</td>
                    <td class="mono-cell">${lastLog ? lastLog.at : '—'}</td>
                    <td>
                      <button class="btn small yellow" data-resolve-fail="${ast.id}">${t('markResolved')}</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : `
      <div class="alert-panel" style="border-color:var(--green);border-right-color:var(--green);background:var(--green-bg);box-shadow:none;">
        <div style="font-weight:700;color:var(--green);font-size:14px;">🎉 ${t('noFailedInspections')}</div>
      </div>
    `}

    <div class="cards-row">
      ${categories.map(cat=>{
        const {done,total} = progressOf(cat.id);
        const pct = total>0 ? Math.round((done/total)*100) : 0;
        const isComplete = total>0 && done===total;
        return `
          <div class="prog-card clickable-row" data-cat-drill="${cat.id}">
            <div class="cat-name">${escapeHtml(cat.name)}</div>
            <div class="cat-freq">${cat.frequency} &middot; מחזור נוכחי</div>
            <div class="cat-num">${done} <span>/ ${total} ${t('checkedLabel')}</span></div>
            <div class="prog-bar-bg">
              <div class="prog-bar-fill ${isComplete?'complete':''}" style="width:${pct}%"></div>
            </div>
            ${renderComplianceStrip(cat)}
          </div>
        `;
      }).join('')}
    </div>

    <div class="section-head">
      <h3>${t('recentActivity')}</h3>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>${t('colTimestamp')}</th>
            <th>${t('colAsset')}</th>
            <th>${t('colId')}</th>
            <th>${t('colWorker')}</th>
            <th>${t('colResult')}</th>
            <th>${t('colComment')}</th>
          </tr>
        </thead>
        <tbody>
          ${logs.length===0 ? `<tr><td colspan="6" class="empty-state">${t('noInspectionsYet')}</td></tr>` : logs.slice(0,8).map(l=>`
            <tr class="clickable-inspection" data-log-id="${l.asset}">
              <td class="mono-cell">${l.at}</td>
              <td><b>${escapeHtml(l.name)}</b></td>
              <td class="mono-cell">${l.asset}</td>
              <td>${escapeHtml(l.worker)}</td>
              <td><span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span></td>
              <td style="color:var(--gray);">${escapeHtml(l.comment || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminAssets(){
  return `
    <h2 class="page-title">${t('assetsTitle')}</h2>
    <div class="page-sub">${t('assetsSub')}</div>

    ${!isReadOnly ? `
      <div class="form-grid">
        <div>
          <label>${t('fieldAssetName')}</label>
          <input type="text" id="new-asset-name" placeholder="לדוגמה: מטף — קפיטריה">
        </div>
        <div>
          <label>${t('fieldAssetId')}</label>
          <input type="text" id="new-asset-id" placeholder="לדוגמה: EXT-019" class="ltr">
        </div>
        <div>
          <label>${t('fieldCategory')}</label>
          <select id="new-asset-cat">
            ${categories.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>${t('fieldLocationLabel')}</label>
          <input type="text" id="new-asset-loc" placeholder="לדוגמה: בניין א׳ / קומה 1">
        </div>
        <div class="actions">
          <button class="btn yellow" id="btn-add-asset">${t('addAssetBtn')}</button>
        </div>
      </div>
    ` : ''}

    <div class="section-head" style="margin-top:16px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <h3>${t('allItemsTitle')} (${assets.length})</h3>
        <button class="btn ghost small" id="btn-print-all-qr">${t('printAllBtn')}</button>
      </div>
      <div class="asset-search-wrap">
        <span class="asset-search-icon">🔍</span>
        <input type="text" class="asset-search-input" id="asset-search-input" placeholder="חיפוש לפי שם, מזהה או מיקום..." value="${escapeHtml(assetSearchQuery)}">
        ${assetSearchQuery ? `<button class="asset-search-clear" id="asset-search-clear" title="נקה חיפוש">✕</button>` : ''}
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>${t('colId')}</th>
            <th>${t('colAsset')}</th>
            <th>${t('colCategory')}</th>
            <th>${t('colLocation')}</th>
            <th>תוקף בדיקה / כיול</th>
            <th>${t('colStatus')}</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody id="asset-table-body">
          ${assets.length===0 ? `<tr><td colspan="7" class="empty-state">${t('noAssetsYet')}</td></tr>` : assets.map(ast=>{
            const cat = catOf(ast.catId);
            const st = expiryStatus(ast.expiryDate);
            return `
              <tr>
                <td class="mono-cell">${ast.id}</td>
                <td><b>${escapeHtml(ast.name)}</b></td>
                <td>${escapeHtml(cat ? cat.name : '')}</td>
                <td>${escapeHtml(ast.location)}</td>
                <td>
                  <div class="expiry-cell">
                    <input type="date" class="expiry-input" data-expiry-asset="${ast.id}" value="${ast.expiryDate||''}" ${isReadOnly?'disabled':''}>
                    <span class="badge exp-${st}">${expiryLabel(ast.expiryDate)}</span>
                  </div>
                </td>
                <td><span class="badge ${statusClass(ast.status)}">${statusLabel(ast.status)}</span></td>
                <td>
                  <div class="row-actions">
                    <button class="btn ghost small" data-print-qr="${ast.id}">${t('printQrBtn')}</button>
                    ${!isReadOnly ? `<button class="btn danger-o small" data-del-asset="${ast.id}">${t('deleteBtn')}</button>` : ''}
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminCategories(){
  return `
    <h2 class="page-title">${t('categoriesTitle')}</h2>
    <div class="page-sub">${t('categoriesSub')}</div>

    ${!isReadOnly ? `
      <div class="form-grid" style="grid-template-columns:2fr 1fr auto;align-items:flex-end;">
        <div>
          <label>${t('newCategoryName')}</label>
          <input type="text" id="new-cat-name" placeholder="לדוגמה: עמדות שטيפה">
        </div>
        <div>
          <label>${t('frequencyLabel')}</label>
          <select id="new-cat-freq">
            <option value="שבועי">${t('freqWeekly')}</option>
            <option value="חודשי" selected>${t('freqMonthly')}</option>
            <option value="רבעוני">${t('freqQuarterly')}</option>
            <option value="שנתי">${t('freqAnnually')}</option>
          </select>
        </div>
        <div>
          <button class="btn yellow" id="btn-add-category" style="height:38px;">${t('createCategoryBtn')}</button>
        </div>
      </div>
    ` : ''}

    <div class="cat-list" style="margin-top:16px;">
      ${categories.map(cat=>{
        const {done,total} = progressOf(cat.id);
        return `
          <div class="cat-card">
            <div class="cat-row">
              <div class="c-left">
                <b>${escapeHtml(cat.name)}</b>
                <div class="mono">${t('itemsCountLabel', total, done, total)}</div>
              </div>
              <div style="display:flex;align-items:center;gap:12px;">
                <select class="freq-select" data-cat-freq="${cat.id}" ${isReadOnly?'disabled':''}>
                  <option value="שבועי" ${cat.frequency==='שבועי'?'selected':''}>${t('freqWeekly')}</option>
                  <option value="חודשי" ${cat.frequency==='חודשי'?'selected':''}>${t('freqMonthly')}</option>
                  <option value="רבעוני" ${cat.frequency==='רבעוני'?'selected':''}>${t('freqQuarterly')}</option>
                  <option value="שנתי" ${cat.frequency==='שנתי'?'selected':''}>${t('freqAnnually')}</option>
                </select>
                <button class="btn ghost small" data-preview-cat="${cat.id}">👁 ${t('previewBtn')}</button>
              </div>
            </div>
            <div class="chk-editor">
              <label class="field-label" style="margin-bottom:6px;">${t('checklistEditorLabel')}</label>
              <ul class="chk-list">
                ${cat.checklist.length===0 ? `<li class="chk-item empty">${t('noChecklistItems')}</li>` : cat.checklist.map((q,idx)=>`
                  <li class="chk-item">
                    <span><b>${idx+1}.</b> ${escapeHtml(q)}</span>
                    ${!isReadOnly ? `<button class="chk-del" data-del-chk="${idx}" data-cat-id="${cat.id}" title="${t('deleteBtn')}">✕ ${t('deleteBtn')}</button>` : ''}
                  </li>
                `).join('')}
              </ul>
              ${!isReadOnly ? `
                <div class="chk-add-row">
                  <input type="text" class="chk-add-input" id="new-chk-input-${cat.id}" placeholder="${t('addChecklistItemPlaceholder')}">
                  <button class="btn small" data-add-chk="${cat.id}">${t('addBtn')}</button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderAdminWorkers(){
  // Aggregate inspector stats from logs
  const workerMap = {};
  logs.forEach(l=>{
    if(!l.worker) return;
    if(!workerMap[l.worker]){
      workerMap[l.worker] = { name:l.worker, total:0, pass:0, lastAt:l.at };
    }
    workerMap[l.worker].total++;
    if(l.result==='pass') workerMap[l.worker].pass++;
    if(l.at > workerMap[l.worker].lastAt) workerMap[l.worker].lastAt = l.at;
  });
  const workersList = Object.values(workerMap);
  const totalInsp = logs.length;
  const avg = workersList.length>0 ? (totalInsp / workersList.length).toFixed(1) : 0;
  const top = workersList.reduce((prev, curr)=> (curr.total > (prev?prev.total:0) ? curr : prev), null);

  return `
    <h2 class="page-title">${t('workersTitle')}</h2>
    <div class="page-sub">${t('workersSub')}</div>

    <div class="cards-row">
      <div class="prog-card">
        <div class="cat-name">${t('activeWorkers')}</div>
        <div class="cat-num">${workersList.length}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">${t('totalInspections')}</div>
        <div class="cat-num">${totalInsp}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">${t('avgPerWorker')}</div>
        <div class="cat-num">${avg}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">${t('topWorker')}</div>
        <div class="cat-num" style="font-size:20px;margin-top:16px;">${top ? escapeHtml(top.name) : '—'}</div>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>${t('colName')}</th>
            <th>${t('colTotal')}</th>
            <th>${t('colPassRate')}</th>
            <th>${t('colLastActivity')}</th>
          </tr>
        </thead>
        <tbody>
          ${workersList.length===0 ? `<tr><td colspan="4" class="empty-state">${t('noInspectionsRecorded')}</td></tr>` : workersList.map(w=>{
            const rate = w.total>0 ? Math.round((w.pass/w.total)*100) : 0;
            return `
              <tr class="clickable-worker clickable-row" data-worker-name="${escapeHtml(w.name)}">
                <td><b>${escapeHtml(w.name)}</b></td>
                <td class="mono-cell">${w.total}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span>${rate}%</span>
                    <div class="prog-bar-bg" style="width:80px;margin:0;"><div class="prog-bar-fill complete" style="width:${rate}%"></div></div>
                  </div>
                </td>
                <td class="mono-cell">${w.lastAt}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminObs(){
  const totalObs = observationLogs.length;
  const passObs = observationLogs.filter(o=>o.result==='pass').length;
  const rate = totalObs>0 ? Math.round((passObs/totalObs)*100) : 100;
  return `
    <h2 class="page-title">תצפיות בטיחות עובדים (התנהגות בשטח)</h2>
    <div class="page-sub">מעקב אחר בטיחות התנהגותית של עובדי המפעל — קסדות, ציוד מגן, ארגונומיה ונהלי עבודה.</div>

    <div class="cards-row">
      <div class="prog-card">
        <div class="cat-name">סה״כ תצפיות</div>
        <div class="cat-num">${totalObs}</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">אחוז עמידה בנהלי התנהגות</div>
        <div class="cat-num">${rate}%</div>
      </div>
      <div class="prog-card">
        <div class="cat-name">יעד חודשי</div>
        <div class="cat-num">${OBS_MONTHLY_GOAL} <span>תצפיות</span></div>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
      <button class="btn ghost small" id="btn-preview-obs">👁 תצוגה מקדימה וייצוא תצפיות</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>${t('colTimestamp')}</th>
            <th>שם העובד</th>
            <th>משקיף</th>
            <th>${t('colResult')}</th>
            <th>${t('colComment')}</th>
          </tr>
        </thead>
        <tbody>
          ${observationLogs.length===0 ? `<tr><td colspan="5" class="empty-state">טרם נרשמו תצפיות עובדים.</td></tr>` : observationLogs.map(o=>`
            <tr class="clickable-obs-row clickable-row" data-obs-id="${o.id}">
              <td class="mono-cell">${o.at}</td>
              <td><b>${escapeHtml(o.employeeName)}</b></td>
              <td>${escapeHtml(o.worker)}</td>
              <td><span class="badge ${logBadgeClass(o.result)}">${statusLabel(o.result)}</span></td>
              <td style="color:var(--gray);">${escapeHtml(o.comment || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminHistory(){
  return `
    <h2 class="page-title">${t('historyTitle')}</h2>
    <div class="page-sub">${t('historySub')}</div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>${t('colTimestamp')}</th>
            <th>${t('colAsset')}</th>
            <th>${t('colId')}</th>
            <th>${t('colWorker')}</th>
            <th>${t('colResult')}</th>
            <th>${t('colComment')}</th>
          </tr>
        </thead>
        <tbody>
          ${logs.length===0 ? `<tr><td colspan="6" class="empty-state">${t('noInspectionsYet')}</td></tr>` : logs.map(l=>`
            <tr class="clickable-inspection clickable-row" data-log-id="${l.asset}">
              <td class="mono-cell">${l.at}</td>
              <td><b>${escapeHtml(l.name)}</b></td>
              <td class="mono-cell">${l.asset}</td>
              <td>${escapeHtml(l.worker)}</td>
              <td><span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span></td>
              <td style="color:var(--gray);">${escapeHtml(l.comment || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminExport(){
  return `
    <h2 class="page-title">${t('exportTitle')}</h2>
    <div class="page-sub">${t('exportSub')}</div>

    <div class="export-row">
      <div class="export-card">
        <div class="ex-title">${t('csvTitle')}</div>
        <p>${t('csvDesc')}</p>
        <button class="btn yellow" id="btn-download-csv">${t('csvBtn')}</button>
      </div>
      <div class="export-card">
        <div class="ex-title">${t('wordTitle')}</div>
        <p>${t('wordDesc')}</p>
        <button class="btn yellow" id="btn-download-word">${t('wordBtn')}</button>
      </div>
      <div class="export-card">
        <div class="ex-title">${t('pdfTitle')}</div>
        <p>${t('pdfDesc')}</p>
        <button class="btn yellow" id="btn-generate-pdf">${t('pdfBtn')}</button>
      </div>
    </div>

    <h3 style="margin-bottom:12px;font-family:'Heebo',sans-serif;font-weight:700;font-size:16px;">ייצוא לפי קטגוריות</h3>
    <div class="cat-export-list">
      ${categories.map(cat=>{
        const {done,total} = progressOf(cat.id);
        const pct = total>0 ? Math.round((done/total)*100) : 0;
        return `
          <div class="cat-export-row">
            <div class="cat-export-info">
              <span class="cat-export-icon">${cat.id==='ext'?'🧯':cat.id==='shower'?'🚿':cat.id==='cabinet'?'⚡':cat.id==='shelter'?'🛡️':'❤️'}</span>
              <div>
                <b>${escapeHtml(cat.name)}</b>
                <div style="font-size:12px;color:var(--gray);">${t('itemsCountLabel', total, done, total)}</div>
              </div>
            </div>
            <div class="cat-export-progress">
              <span class="cat-progress-badge">${pct}%</span>
              <span class="cat-progress-label">השלמה</span>
            </div>
            <div class="cat-export-actions">
              <button class="btn ghost small" data-preview-cat="${cat.id}">👁 ${t('previewBtn')}</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderAdminAudit(){
  return `
    <h2 class="page-title">יומן פעילות ואבטחה</h2>
    <div class="page-sub">תיעוד מוצפן של פעולות ניהול רגישות במערכת לצורכי בקרה ואבטחת מידע.</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>חותמת זמן</th>
            <th>מנהל / משקיף</th>
            <th>פעולה</th>
            <th>פרטים</th>
          </tr>
        </thead>
        <tbody>
          ${adminAuditLog.length===0 ? `<tr><td colspan="4" class="empty-state">אין אירועי אבטחה או פעולות ניהול רשומות בסשן זה.</td></tr>` : adminAuditLog.map(a=>`
            <tr>
              <td class="mono-cell">${a.at}</td>
              <td><b>${escapeHtml(a.admin)}</b></td>
              <td><span class="badge" style="background:var(--paper-2);color:var(--charcoal);">${escapeHtml(a.action)}</span></td>
              <td style="color:var(--gray);">${escapeHtml(a.details)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ================= MODALS ================= */
function renderInspectionModal(){
  const l = openInspectionLog;
  if(!l) return '';
  return `
    <div class="modal-backdrop" id="modal-backdrop-el">
      <div class="modal-box">
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow">${escapeHtml(l.asset)} &middot; ${l.at}</div>
            <h3>${escapeHtml(l.name)}</h3>
          </div>
          <button class="modal-close" id="modal-close-btn">✕</button>
        </div>
        <div class="modal-meta">
          <div><b>בודק:</b> ${escapeHtml(l.worker)}</div>
          <div><b>תוצאה:</b> <span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span></div>
        </div>
        ${l.result==='resolved' ? `
          <div style="background:#E8F0F8;color:var(--blue);border-radius:7px;padding:12px;font-size:12.5px;margin-bottom:14px;">
            ${t('inspectionDetailResolvedNote')}
          </div>
        ` : ''}
        <div class="modal-checklist">
          ${!l.answers || l.answers.length===0 ? `<div style="font-size:12.5px;color:var(--gray);text-align:center;padding:20px;">${t('inspectionDetailNoChecklist')}</div>` : l.answers.map((ans,i)=>`
            <div class="modal-chk-row ${ans.status}">
              <span class="modal-chk-icon">${ans.status==='pass'?'✓':'✕'}</span>
              <span class="modal-chk-text"><b>${i+1}.</b> ${escapeHtml(ans.text)}</span>
              ${ans.photo ? `<img src="${ans.photo}" class="modal-chk-thumb">` : ''}
            </div>
          `).join('')}
        </div>
        ${l.comment ? `
          <div style="margin-top:10px;">
            <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:4px;">${t('commentsHeading')}</div>
            <div class="modal-comment">${escapeHtml(l.comment)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderObservationModal(){
  const o = openObservationLog;
  if(!o) return '';
  return `
    <div class="modal-backdrop" id="modal-backdrop-el">
      <div class="modal-box">
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow">תצפית בטיחות עובד &middot; ${o.at}</div>
            <h3>${escapeHtml(o.employeeName)}</h3>
          </div>
          <button class="modal-close" id="obs-modal-close-btn">✕</button>
        </div>
        <div class="modal-meta">
          <div><b>משקיף:</b> ${escapeHtml(o.worker)} (${escapeHtml(o.workerId||'—')})</div>
          <div><b>תוצאה:</b> <span class="badge ${logBadgeClass(o.result)}">${statusLabel(o.result)}</span></div>
        </div>
        <div class="modal-checklist">
          ${o.answers.map((ans,i)=>`
            <div class="modal-chk-row ${ans.status}">
              <span class="modal-chk-icon">${ans.status==='pass'?'✓':'✕'}</span>
              <span class="modal-chk-text"><b>${i+1}.</b> ${escapeHtml(ans.text)}</span>
              ${ans.photo ? `<img src="${ans.photo}" class="modal-chk-thumb">` : ''}
            </div>
          `).join('')}
        </div>
        ${o.comment ? `
          <div style="margin-top:10px;">
            <div style="font-size:11px;font-weight:700;color:var(--gray);margin-bottom:4px;">${t('commentsHeading')}</div>
            <div class="modal-comment">${escapeHtml(o.comment)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderCategoryModal(){
  const cat = catOf(openCategoryDrilldown);
  if(!cat) return '';
  const list = assetsIn(cat.id);
  const checked = list.filter(a=>a.status==='pass'||a.status==='fail'||a.status==='resolved');
  const pending = list.filter(a=>a.status==='pending');

  return `
    <div class="modal-backdrop" id="modal-backdrop-el">
      <div class="modal-box" style="max-width:580px;">
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow">${cat.frequency} &middot; ${list.length} פריטים</div>
            <h3>${escapeHtml(cat.name)}</h3>
          </div>
          <button class="modal-close" id="cat-modal-close-btn">✕</button>
        </div>

        <div class="drill-section">
          <div class="drill-section-title ok">${t('categoryModalChecked')} (${checked.length})</div>
          ${checked.length===0 ? `<div style="font-size:12px;color:var(--gray);padding:6px 0;">${t('categoryModalNoneChecked')}</div>` : checked.map(ast=>`
            <div class="drill-row">
              <div class="drill-row-main">
                <div class="drill-row-name">${escapeHtml(ast.name)}</div>
                <div class="drill-row-id">${ast.id} &middot; ${escapeHtml(ast.location)}</div>
              </div>
              <div class="drill-row-side">
                <span class="drill-row-date">${ast.lastAt || ''}</span>
                <span class="badge ${statusClass(ast.status)}">${statusLabel(ast.status)}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="drill-section" style="margin-top:16px;">
          <div class="drill-section-title wait">${t('categoryModalPending')} (${pending.length})</div>
          ${pending.length===0 ? `<div style="font-size:12px;color:var(--green);padding:6px 0;font-weight:600;">${t('categoryModalAllDone')}</div>` : pending.map(ast=>`
            <div class="drill-row">
              <div class="drill-row-main">
                <div class="drill-row-name">${escapeHtml(ast.name)}</div>
                <div class="drill-row-id">${ast.id} &middot; ${escapeHtml(ast.location)}</div>
              </div>
              <span class="badge st-pending">${statusLabel(ast.status)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderWorkerModal(){
  const wname = openWorkerDrilldown;
  const wlogs = logs.filter(l=>l.worker===wname);
  return `
    <div class="modal-backdrop" id="modal-backdrop-el">
      <div class="modal-box" style="max-width:580px;">
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow">היסטוריית בודק שטח</div>
            <h3>${escapeHtml(wname)}</h3>
          </div>
          <button class="modal-close" id="worker-modal-close-btn">✕</button>
        </div>
        <div class="modal-checklist">
          ${wlogs.length===0 ? `<div style="font-size:12.5px;color:var(--gray);text-align:center;padding:20px;">${t('noInspectionHistoryForWorker')}</div>` : wlogs.map(l=>`
            <div class="drill-row">
              <div class="drill-row-main">
                <div class="drill-row-name">${escapeHtml(l.name)} (${l.asset})</div>
                <div class="drill-row-id">${l.at}</div>
              </div>
              <span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderPreviewModal(){
  let targetLogs = logs;
  let title = 'תצוגה מקדימה — כל הבדיקות';
  if(previewIsObs){
    const items = observationLogs;
    return `
      <div class="modal-backdrop" id="modal-backdrop-el">
        <div class="modal-box" style="max-width:700px;">
          <div class="modal-head">
            <div>
              <div class="modal-eyebrow">תצוגה מקדימה</div>
              <h3>תצפיות בטיחות עובדים</h3>
            </div>
            <button class="modal-close" id="preview-close-btn">✕</button>
          </div>
          <div class="table-wrap" style="max-height:400px;overflow-y:auto;">
            <table>
              <thead><tr><th>חותמת זמן</th><th>עובד</th><th>משקיף</th><th>תוצאה</th></tr></thead>
              <tbody>
                ${items.map(o=>`<tr><td class="mono-cell">${o.at}</td><td><b>${escapeHtml(o.employeeName)}</b></td><td>${escapeHtml(o.worker)}</td><td><span class="badge ${logBadgeClass(o.result)}">${statusLabel(o.result)}</span></td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  if(previewCategoryId){
    const cat = catOf(previewCategoryId);
    const catAssetIds = assetsIn(previewCategoryId).map(a=>a.id);
    targetLogs = logs.filter(l=>catAssetIds.includes(l.asset));
    title = `תצוגה מקדימה — ${cat ? cat.name : ''}`;
  }
  return `
    <div class="modal-backdrop" id="modal-backdrop-el">
      <div class="modal-box" style="max-width:700px;">
        <div class="modal-head">
          <div>
            <div class="modal-eyebrow">תצוגה מקדימה לנתונים</div>
            <h3>${title}</h3>
          </div>
          <button class="modal-close" id="preview-close-btn">✕</button>
        </div>
        <div class="table-wrap" style="max-height:400px;overflow-y:auto;">
          <table>
            <thead>
              <tr>
                <th>${t('colTimestamp')}</th>
                <th>${t('colAsset')}</th>
                <th>${t('colWorker')}</th>
                <th>${t('colResult')}</th>
              </tr>
            </thead>
            <tbody>
              ${targetLogs.length===0 ? `<tr><td colspan="4" class="empty-state">אין נתונים לתצוגה.</td></tr>` : targetLogs.map(l=>`
                <tr>
                  <td class="mono-cell">${l.at}</td>
                  <td><b>${escapeHtml(l.name)}</b> (${l.asset})</td>
                  <td>${escapeHtml(l.worker)}</td>
                  <td><span class="badge ${logBadgeClass(l.result)}">${statusLabel(l.result)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str){
  if(!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ---------------- INITIALIZE ---------------- */
document.getElementById('theme-toggle').onclick = toggleTheme;
document.getElementById('lang-select').onchange = (e)=>{ setLanguage(e.target.value); };
document.getElementById('tab-field').onclick = ()=>{
  isReadOnly = false;
  mode = mode===null ? 'field-login' : 'field';
  render();
};
document.getElementById('tab-admin').onclick = ()=>{
  mode = adminUnlocked ? 'admin' : 'lock';
  render();
};
document.getElementById('topbar-home').onclick = ()=>{
  mode = null;
  render();
};

render();

})();
</script>
</body>
</html>
