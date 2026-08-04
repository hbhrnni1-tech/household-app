'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- Types & Interfaces ---
type CategoryKey = 'electricity' | 'fire' | 'hazmat' | 'infrastructure' | 'firstaid';

interface CategoryConfig {
  name: string;
  freq: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  icon: string;
}

interface Asset {
  id: string;
  name: string;
  category: CategoryKey;
  location: string;
  status: 'pending' | 'pass' | 'fail' | 'resolved';
  lastChecked?: string;
  inspector?: string;
  checklist?: { text: string; done: boolean; photo?: string }[];
  comment?: string;
}

interface GeneralObservation {
  id: string;
  name: string;
  status: 'open' | 'met';
  date?: string;
  inspector?: string;
  comment?: string;
  photo?: string;
}

export default function HouseholdSafetyApp() {
  // --- States ---
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [viewMode, setViewMode] = useState<'field' | 'admin'>('field');
  const [landingRole, setLandingRole] = useState<'select' | 'worker' | 'admin-lock' | 'supervisor'>('select');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'assets' | 'categories' | 'export'>('dashboard');

  // Worker flow states inside the field view
  const [workerName, setWorkerName] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [currentFolder, setCurrentFolder] = useState<CategoryKey | 'observations' | null>(null);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);
  const [scanMode, setScanMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isFail?: boolean } | null>(null);

  // Modal drill-down state in admin
  const [modalAsset, setModalAsset] = useState<Asset | null>(null);

  // Asset search & filtering in admin
  const [assetSearch, setAssetSearch] = useState('');

  // --- Mock Data ---
  const [categories, setCategories] = useState<Record<CategoryKey, CategoryConfig>>({
    electricity: { name: 'לוחות חשמל ותשתיות', freq: 'weekly', icon: '⚡' },
    fire: { name: 'ציוד כיבוי אש', freq: 'monthly', icon: '🧯' },
    hazmat: { name: 'חומרים מסוכנים', freq: 'daily', icon: '⚠️' },
    infrastructure: { name: 'תשתיות מים וגז', freq: 'monthly', icon: '🔧' },
    firstaid: { name: 'עזרה ראשונה ובטיחות', freq: 'monthly', icon: '🩹' },
  });

  const [assets, setAssets] = useState<Asset[]>([
    { id: 'EL-01', name: 'לוח חשמל ראשי קומה 1', category: 'electricity', location: 'מסדרון מרכזי', status: 'pending' },
    { id: 'EL-02', name: 'לוח חשמל משנה מטבח', category: 'electricity', location: 'מטבח ראשי', status: 'pending' },
    { id: 'FIRE-01', name: 'מטחנה אבקת יבש 6ק"ג', category: 'fire', location: 'כניסה ראשית', status: 'pending' },
    { id: 'FIRE-02', name: 'גלגולון כיבוי אש', category: 'fire', location: 'מסדרון אגף מערבי', status: 'pending' },
    { id: 'HZ-01', name: 'ארון חומרי ניקוי וחיטוי', category: 'hazmat', location: 'חדר שירות', status: 'pending' },
    { id: 'INF-01', name: 'ברז כיבוי ראשי (ספרינקלרים)', category: 'infrastructure', location: 'חצר חיצונית', status: 'pending' },
    { id: 'FA-01', name: 'ערכת עזרה ראשונה מספר 1', category: 'firstaid', location: 'עמדת שמירה', status: 'pending' },
  ]);

  const [observations, setObservations] = useState<GeneralObservation[]>([
    { id: 'OBS-01', name: 'מעברים פנויים ללא חסימות ציוד', status: 'open' },
    { id: 'OBS-02', name: 'תאורת חירום תקינה במסדרונות', status: 'open' },
    { id: 'OBS-03', name: 'שילוט מילוט נראה וברור', status: 'open' },
  ]);

  // Handle Theme Attribute on HTML/Body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = (text: string, isFail = false) => {
    setToastMessage({ text, isFail });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '1234' || adminPass === 'admin') {
      setViewMode('admin');
      setLandingRole('select');
      setAdminPass('');
      setAdminError('');
    } else {
      setAdminError('סיסמה שגויה. נסה שוב (ברירת מחדל: 1234)');
    }
  };

  return (
    <div id="app">
      {/* Top Navigation Bar */}
      <header className="topbar">
        <div className="brand">
          <span className="eyebrow">HOUSEHOLD SAFETY · V1.0</span>
          <h1>מעקב בטיחות משק בית</h1>
        </div>
        <div className="topbar-right">
          {viewMode === 'field' && landingRole !== 'select' && (
            <button
              className="topbar-home-btn"
              onClick={() => {
                setLandingRole('select');
                setCurrentFolder(null);
                setActiveAsset(null);
              }}
            >
              ← חזרה לתפריט ראשי
            </button>
          )}
          <div className="mode-toggle">
            <button
              className={viewMode === 'field' ? 'active' : ''}
              onClick={() => setViewMode('field')}
            >
              שטח (עובד)
            </button>
            <button
              className={viewMode === 'admin' ? 'active' : ''}
              onClick={() => setViewMode('admin')}
            >
              ניהול (מנהל)
            </button>
          </div>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="החלף ערכת נושא"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as 'he' | 'en')}
          >
            <option value="he">HE</option>
            <option value="en">EN</option>
          </select>
        </div>
      </header>
      <div className="hazard"></div>

      <main>
        {viewMode === 'field' ? (
          <div className="field-wrap">
            <div className="phone">
              <div className="phone-screen">
                {/* Landing & Roles selection */}
                {landingRole === 'select' && (
                  <div className="landing-wrap" style={{ minHeight: 'auto', padding: '24px 16px' }}>
                    <div className="landing-card" style={{ boxShadow: 'none', border: 'none', background: 'transparent', padding: 0 }}>
                      <span className="landing-eyebrow">בחר את תפקידך לכניסה למערכת</span>
                      <div className="landing-buttons">
                        <button
                          className="landing-btn field"
                          onClick={() => setLandingRole('worker')}
                        >
                          <span className="landing-icon">👷‍♂️</span>
                          <span className="landing-title">בדיקות שטח / משתמש</span>
                          <span className="landing-sub">ביצוע ביקורות ותיעוד משק בית</span>
                        </button>
                        <button
                          className="landing-btn supervisor"
                          onClick={() => setLandingRole('supervisor')}
                        >
                          <span className="landing-icon">🛡️</span>
                          <span className="landing-title">מנהל אירועים / אחראי</span>
                          <span className="landing-sub">סקירת תקלות פתוחות ואישור מענים</span>
                        </button>
                        <button
                          className="landing-btn admin"
                          onClick={() => setLandingRole('admin-lock')}
                        >
                          <span className="landing-icon">⚙️</span>
                          <span className="landing-title">הנהלה וניהול מערכת</span>
                          <span className="landing-sub">צפייה بدוחות, הגדרות וניהול נכסים</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {landingRole === 'admin-lock' && (
                  <div className="landing-wrap" style={{ minHeight: 'auto', padding: '24px 16px' }}>
                    <div className="landing-card lock-card">
                      <div className="lock-title">כניסת מנהל מערכת</div>
                      <form onSubmit={handleAdminLogin}>
                        <div className="lock-input-wrap">
                          <input
                            type={showPass ? 'text' : 'password'}
                            className="lock-input mono"
                            placeholder="••••"
                            maxLength={6}
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="lock-eye-btn"
                            onClick={() => setShowPass(!showPass)}
                          >
                            {showPass ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                        {adminError && <div className="lock-error">{adminError}</div>}
                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                          <button type="submit" className="submit-btn" style={{ flex: 1, padding: '10px' }}>
                            כניסה למערכת
                          </button>
                          <button
                            type="button"
                            className="btn ghost"
                            onClick={() => { setLandingRole('select'); setAdminError(''); }}
                          >
                            ביטול
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {landingRole === 'worker' && (
                  <div className="field-header">
                    <div className="field-header-top">
                      <button className="entry-back-btn" onClick={() => setLandingRole('select')}>
                        החלף משתמש
                      </button>
                    </div>
                    <span className="eyebrow">FIELD INSPECTION V1.0</span>
                    <h2>בדיקות בטיחות שוטפות</h2>
                    <div className="inspector-row">
                      <span className="inspector-badge">👤 בודק: משתמש משק בית</span>
                    </div>
                  </div>
                )}

                {landingRole === 'supervisor' && (
                  <div className="field-header">
                    <div className="field-header-top">
                      <button className="entry-back-btn" onClick={() => setLandingRole('select')}>
                        החלף משתמש
                      </button>
                    </div>
                    <span className="eyebrow">SUPERVISOR DASHBOARD</span>
                    <h2>סקירת אירועים ותקלות</h2>
                  </div>
                )}

                {/* Worker Folders / Assets List */}
                {landingRole === 'worker' && !currentFolder && !activeAsset && (
                  <div className="field-body">
                    <div className="scan-instruction">
                      בחר קטגוריה לבדיקה או סרוק ברקוד נכס ישירות:
                    </div>
                    <div className="folder-grid">
                      {Object.entries(categories).map(([key, cat]) => {
                        const catAssets = assets.filter((a) => a.category === key);
                        const passedCount = catAssets.filter((a) => a.status === 'pass').length;
                        return (
                          <div
                            key={key}
                            className="folder-tile"
                            onClick={() => setCurrentFolder(key as CategoryKey)}
                          >
                            <div className="folder-icon">{cat.icon}</div>
                            <div className="folder-name">{cat.name}</div>
                            <div className="folder-count">
                              {passedCount}/{catAssets.length} בוצעו
                            </div>
                          </div>
                        );
                      })}
                      <div
                        className="folder-tile obs-folder"
                        onClick={() => setCurrentFolder('observations')}
                      >
                        <div className="folder-icon">📋</div>
                        <div className="folder-name">תצפיות בטיחות וכלליות</div>
                        <div className="folder-count obs-open">
                          {observations.filter((o) => o.status === 'open').length} תצפיות פתוחות
                        </div>
                      </div>
                    </div>
                    <button
                      className="scan-btn"
                      onClick={() => setScanMode(true)}
                    >
                      <span className="dot"></span>
                      סריקת קוד QR מהירה לנכס
                    </button>
                  </div>
                )}

                {/* Inside a Specific Folder */}
                {landingRole === 'worker' && currentFolder && currentFolder !== 'observations' && !activeAsset && (
                  <div className="field-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '10px' }}>
                      <button className="back-link" onClick={() => setCurrentFolder(null)}>
                        ← חזרה לקטגוריות
                      </button>
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>
                        {categories[currentFolder as CategoryKey]?.name}
                      </span>
                    </div>
                    <div className="qr-grid">
                      {assets
                        .filter((a) => a.category === currentFolder)
                        .map((asset) => (
                          <div
                            key={asset.id}
                            className="qr-tile"
                            onClick={() => setActiveAsset(asset)}
                          >
                            <div className="qr-code">
                              <span style={{ fontSize: '24px' }}>{categories[currentFolder as CategoryKey]?.icon}</span>
                            </div>
                            <div className="a-name">{asset.name}</div>
                            <div className="a-id">{asset.id}</div>
                            <div>
                              <span className={`a-status st-${asset.status}`}>
                                {asset.status === 'pending' && 'ממתין לבדיקה'}
                                {asset.status === 'pass' && 'תקין'}
                                {asset.status === 'fail' && 'תקול / לטיפול'}
                                {asset.status === 'resolved' && 'טופל'}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* General Observations Folder View */}
                {landingRole === 'worker' && currentFolder === 'observations' && (
                  <div className="field-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <button className="back-link" onClick={() => setCurrentFolder(null)}>
                        ← חזרה
                      </button>
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>תצפיות בטיחות</span>
                    </div>
                    <div className="obs-progress-banner">
                      דווח על ממצאים או ודא תקינות סביבתית שוטפת במשק הבית.
                    </div>
                    <div className="obs-recent-section">
                      {observations.map((obs) => (
                        <div key={obs.id} className="obs-recent-row">
                          <span className="obs-recent-name">{obs.name}</span>
                          <button
                            className={`btn small ${obs.status === 'met' ? 'yellow' : ''}`}
                            onClick={() => {
                              setObservations(
                                observations.map((o) =>
                                  o.id === obs.id
                                    ? { ...o, status: o.status === 'open' ? 'met' : 'open' }
                                    : o
                                )
                              );
                              showToast('סטטוס תצפית עודכן בהצלחה');
                            }}
                          >
                            {obs.status === 'open' ? 'סמן כבוצע' : 'פתוח מחדש'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Asset Inspection Form */}
                {landingRole === 'worker' && activeAsset && (
                  <div className="field-body">
                    <button className="back-link" onClick={() => setActiveAsset(null)}>
                      ← חזרה לרשימת נכסים
                    </button>
                    <div className="asset-card">
                      <span className="a-type mono">{activeAsset.id}</span>
                      <h3>{activeAsset.name}</h3>
                      <div className="asset-meta">
                        <div>
                          <span className="k">מיקום:</span> <span>{activeAsset.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="checklist-box">
                      <div className="checklist-head">
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>רשימת תיוג לבדיקה:</span>
                        <span className="checklist-count">3 סעיפים</span>
                      </div>
                      {['שלמות פיזית ומבנית של הציוד', 'אין חסימות גישה או סכנת מעידה סביבו', 'שילוט אזהרה או תוקף בתוקף'].map((chkText, idx) => (
                        <label key={idx} className="check-row">
                          <input type="checkbox" defaultChecked />
                          <div className="check-box">✓</div>
                          <div className="check-text">{chkText}</div>
                        </label>
                      ))}
                    </div>

                    <div className="pf-row">
                      <button
                        className="pf-btn pass sel"
                        onClick={() => {
                          setAssets(
                            assets.map((a) =>
                              a.id === activeAsset.id ? { ...a, status: 'pass', lastChecked: new Date().toLocaleDateString() } : a
                            )
                          );
                          showToast('הבדיקה עודכנה כתקינה בהצלחה!');
                          setActiveAsset(null);
                        }}
                      >
                        ✓ תקין לחלוטין
                      </button>
                      <button
                        className="pf-btn fail"
                        onClick={() => {
                          setAssets(
                            assets.map((a) =>
                              a.id === activeAsset.id ? { ...a, status: 'fail', lastChecked: new Date().toLocaleDateString() } : a
                            )
                          );
                          showToast('דווחה תקלה בהצלחה למערכת', true);
                          setActiveAsset(null);
                        }}
                      >
                        ⚠️ נמצאה תקלה
                      </button>
                    </div>
                  </div>
                )}

                {/* Supervisor View */}
                {landingRole === 'supervisor' && (
                  <div className="field-body">
                    <div className="obs-progress-banner" style={{ background: 'var(--surface)', border: '1px solid var(--line-light)' }}>
                      מרכז בקרה למנהל: מעקב אחר תקלות פתוחות ואישור מענים ממשק הבית.
                    </div>
                    {assets.filter((a) => a.status === 'fail').length === 0 ? (
                      <div className="empty-state">אין תקלות פתוחות הדורשות טיפול כרגע. הכל תקין!</div>
                    ) : (
                      assets
                        .filter((a) => a.status === 'fail')
                        .map((asset) => (
                          <div key={asset.id} className="asset-card" style={{ borderLeft: '4px solid var(--red)' }}>
                            <span className="a-type mono">{asset.id}</span>
                            <h3>{asset.name}</h3>
                            <div className="asset-meta" style={{ marginBottom: '10px' }}>
                              <div>
                                <span className="k">מיקום:</span> <span>{asset.location}</span>
                              </div>
                            </div>
                            <button
                              className="btn yellow small"
                              onClick={() => {
                                setAssets(
                                  assets.map((a) => (a.id === asset.id ? { ...a, status: 'resolved' } : a))
                                );
                                showToast('התקלה סומנה כטופלה בהצלחה');
                              }}
                            >
                              אשר כטופל / סגור אירוע
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Admin View */
          <div className="admin-wrap">
            <aside className="sidebar">
              <div
                className={`s-item ${adminTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setAdminTab('dashboard')}
              >
                📊 לוח בקרה ראשי
              </div>
              <div
                className={`s-item ${adminTab === 'assets' ? 'active' : ''}`}
                onClick={() => setAdminTab('assets')}
              >
                🗂️ ניהול נכסים
              </div>
              <div
                className={`s-item ${adminTab === 'categories' ? 'active' : ''}`}
                onClick={() => setAdminTab('categories')}
              >
                ⚙️ קטגוריות ותדירות
              </div>
              <div
                className={`s-item ${adminTab === 'export' ? 'active' : ''}`}
                onClick={() => setAdminTab('export')}
              >
                📥 דוחות וייצוא נתונים
              </div>
            </aside>
            <div className="admin-content">
              {adminTab === 'dashboard' && (
                <>
                  <h2 className="page-title">לוח בקרה ניהולי</h2>
                  <p className="page-sub">סקירה כללית של מצב הבטיחות, ביצועים והתרעות מערכת.</p>

                  <div className="cards-row">
                    <div className="prog-card">
                      <div className="cat-name">סך נכסים במערכת</div>
                      <div className="cat-num">{assets.length}</div>
                    </div>
                    <div className="prog-card">
                      <div className="cat-name">נכסים תקינים</div>
                      <div className="cat-num" style={{ color: 'var(--green)' }}>
                        {assets.filter((a) => a.status === 'pass').length}
                      </div>
                    </div>
                    <div className="prog-card">
                      <div className="cat-name">תקלות פתוחות</div>
                      <div className="cat-num" style={{ color: 'var(--red)' }}>
                        {assets.filter((a) => a.status === 'fail').length}
                      </div>
                    </div>
                  </div>

                  {assets.some((a) => a.status === 'fail') && (
                    <div className="alert-panel">
                      <div className="alert-head">
                        <div className="alert-title-wrap">
                          <span className="alert-badge">
                            {assets.filter((a) => a.status === 'fail').length}
                          </span>
                          <h3>תקלות פעילות הדורשות טיפול מיידי</h3>
                        </div>
                      </div>
                      <div className="cycle-alert-list">
                        {assets
                          .filter((a) => a.status === 'fail')
                          .map((a) => (
                            <div key={a.id} className="cycle-alert-row">
                              <span>
                                <b>{a.name}</b> ({a.location})
                              </span>
                              <button
                                className="btn small yellow"
                                onClick={() => {
                                  setAssets(
                                    assets.map((item) => (item.id === a.id ? { ...item, status: 'resolved' } : item))
                                  );
                                  showToast('התקלה סומנה כטופלה');
                                }}
                              >
                                סמן כטופל
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {adminTab === 'assets' && (
                <>
                  <div className="section-head">
                    <div>
                      <h2 className="page-title">ניהול נכסים ופריטים</h2>
                      <p className="page-sub" style={{ margin: 0 }}>הוספה, עריכה ומעקב אחר כלל רכיבי הבטיחות.</p>
                    </div>
                    <div className="asset-search-wrap">
                      <input
                        type="text"
                        className="asset-search-input"
                        placeholder="חיפוש נכס לפי שם או מזהה..."
                        value={assetSearch}
                        onChange={(e) => setAssetSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>מזהה</th>
                          <th>שם הנכס</th>
                          <th>קטגוריה</th>
                          <th>מיקום</th>
                          <th>סטטוס אחרון</th>
                          <th>פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets
                          .filter(
                            (a) =>
                              a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
                              a.id.toLowerCase().includes(assetSearch.toLowerCase())
                          )
                          .map((asset) => (
                            <tr key={asset.id} className="clickable-row" onClick={() => setModalAsset(asset)}>
                              <td className="mono-cell">{asset.id}</td>
                              <td><b>{asset.name}</b></td>
                              <td>{categories[asset.category]?.name}</td>
                              <td>{asset.location}</td>
                              <td>
                                <span className={`badge st-${asset.status}`}>
                                  {asset.status === 'pending' && 'ממתין'}
                                  {asset.status === 'pass' && 'תקין'}
                                  {asset.status === 'fail' && 'תקול'}
                                  {asset.status === 'resolved' && 'טופל'}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn small danger-o"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAssets(assets.filter((item) => item.id !== asset.id));
                                    showToast('הנכס הוסר בהצלחה');
                                  }}
                                >
                                  מחק
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {adminTab === 'categories' && (
                <>
                  <h2 className="page-title">הגדרת קטגוריות ותדירויות</h2>
                  <p className="page-sub">ניהול תדירות הביקורות הנדרשות לכל תחום במשק הבית.</p>
                  <div className="cat-list">
                    {Object.entries(categories).map(([key, cat]) => (
                      <div key={key} className="cat-card">
                        <div className="cat-row" style={{ border: 'none', margin: 0, padding: 0 }}>
                          <div className="c-left">
                            <b>
                              {cat.icon} {cat.name}
                            </b>
                            <div className="mono">מזהה: {key}</div>
                          </div>
                          <select
                            className="freq-select"
                            value={cat.freq}
                            onChange={(e) =>
                              setCategories({
                                ...categories,
                                [key]: { ...cat, freq: e.target.value as any },
                              })
                            }
                          >
                            <option value="daily">יומי</option>
                            <option value="weekly">שבועי</option>
                            <option value="monthly">חודשי</option>
                            <option value="quarterly">רבעוני</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {adminTab === 'export' && (
                <>
                  <h2 className="page-title">דוחות וייצוא נתונים</h2>
                  <p className="page-sub">הפקת דוחות בטיחות מלאים בפורמטים שונים לצורכי תיעוד ובקרה.</p>
                  <div className="export-row">
                    <div className="export-card">
                      <div className="ex-title">דוח נתונים מלא (CSV)</div>
                      <p>ייצוא כלל נתוני הנכסים והסטטוסים לקובץ טבלאי.</p>
                      <button
                        className="btn yellow"
                        onClick={() => showToast('הדוח הופק והורד בהצלחה!')}
                      >
                        הורד קובץ CSV
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal View for Asset Details */}
      {modalAsset && (
        <div className="modal-backdrop" onClick={() => setModalAsset(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="modal-eyebrow mono">{modalAsset.id}</span>
                <h3>{modalAsset.name}</h3>
              </div>
              <button className="modal-close" onClick={() => setModalAsset(null)}>
                ✕
              </button>
            </div>
            <div className="modal-meta">
              <div>מיקום: {modalAsset.location}</div>
              <div>סטטוס: {modalAsset.status}</div>
            </div>
            <div className="modal-comment">
              <b>הערות אחרונות:</b> הנכס נבדק ונמצא תחת מעקב שוטף של צוות משק הבית.
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast show ${toastMessage.isFail ? 'fail-toast' : ''}`}>
          <span>{toastMessage.isFail ? '⚠️' : '✓'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
