'use client';

import React, { useState, useEffect } from 'react';

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
}

interface GeneralObservation {
  id: string;
  name: string;
  status: 'open' | 'met';
}

export default function HouseholdSafetyApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const [viewMode, setViewMode] = useState<'field' | 'admin'>('field');
  const [landingRole, setLandingRole] = useState<'select' | 'worker' | 'admin-lock' | 'supervisor'>('select');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'assets' | 'categories' | 'export'>('dashboard');

  const [currentFolder, setCurrentFolder] = useState<CategoryKey | 'observations' | null>(null);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isFail?: boolean } | null>(null);
  const [modalAsset, setModalAsset] = useState<Asset | null>(null);
  const [assetSearch, setAssetSearch] = useState('');

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
    <div dir="rtl" style={{ fontFamily: 'Heebo, sans-serif', background: theme === 'dark' ? '#15171A' : '#EDEDE9', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22', minHeight: '100vh', transition: 'background 0.2s, color 0.2s' }}>
      {/* Top Navigation Bar */}
      <header style={{ background: '#1C1F22', color: '#EDEDE9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.06em', color: '#F5B700' }}>משק בית · מעקב בטיחות</span>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>מערכת ניהול ובקרה</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {viewMode === 'field' && landingRole !== 'select' && (
            <button
              onClick={() => { setLandingRole('select'); setCurrentFolder(null); setActiveAsset(null); }}
              style={{ background: 'transparent', border: '1px solid #3A4046', color: '#8B9096', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              ← חזרה לתפריט
            </button>
          )}
          <div style={{ display: 'flex', background: '#24282C', border: '1px solid #3A4046', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('field')}
              style={{ padding: '8px 16px', background: viewMode === 'field' ? '#F5B700' : 'transparent', color: viewMode === 'field' ? '#1C1F22' : '#8B9096', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              שטח (עובד)
            </button>
            <button
              onClick={() => setViewMode('admin')}
              style={{ padding: '8px 16px', background: viewMode === 'admin' ? '#F5B700' : 'transparent', color: viewMode === 'admin' ? '#1C1F22' : '#8B9096', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              ניהול
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ background: '#24282C', border: '1px solid #3A4046', color: '#EDEDE9', width: '34px', height: '34px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <div style={{ height: '6px', background: 'repeating-linear-gradient(45deg, #F5B700 0 10px, #1C1F22 10px 20px)' }}></div>

      <main style={{ padding: '24px 16px', maxWidth: '1200px', margin: '0 auto' }}>
        {viewMode === 'field' ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '420px', background: '#24282C', borderRadius: '24px', padding: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', borderRadius: '16px', minHeight: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* Landing Roles */}
                {landingRole === 'select' && (
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', background: '#F5B700', color: '#1C1F22', padding: '8px 18px', borderRadius: '20px', fontWeight: 700, marginBottom: '20px' }}>
                      בחר תפקיד לכניסה למערכת
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button
                        onClick={() => setLandingRole('worker')}
                        style={{ padding: '18px', borderRadius: '10px', border: '2px solid #C99200', background: 'transparent', cursor: 'pointer', textAlign: 'right' }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>👷‍♂️ בדיקות שטח / משתמש</div>
                        <div style={{ fontSize: '12px', color: '#8B9096', marginTop: '4px' }}>ביצוע ביקורות ותיעוד שוטף</div>
                      </button>
                      <button
                        onClick={() => setLandingRole('supervisor')}
                        style={{ padding: '18px', borderRadius: '10px', border: '2px solid #3A6EA5', background: 'transparent', cursor: 'pointer', textAlign: 'right' }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>🛡️ מנהל אירועים / אחראי</div>
                        <div style={{ fontSize: '12px', color: '#8B9096', marginTop: '4px' }}>סקירת תקלות פתוחות ואישור מענים</div>
                      </button>
                      <button
                        onClick={() => setLandingRole('admin-lock')}
                        style={{ padding: '18px', borderRadius: '10px', border: '2px solid #1C1F22', background: 'transparent', cursor: 'pointer', textAlign: 'right' }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>⚙️ הנהלה וניהול מערכת</div>
                        <div style={{ fontSize: '12px', color: '#8B9096', marginTop: '4px' }}>דוחות והגדרות מערכת מתקדמות</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Admin Password Lock inside Phone View */}
                {landingRole === 'admin-lock' && (
                  <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>כניסת מנהל מערכת</h3>
                    <form onSubmit={handleAdminLogin}>
                      <div style={{ position: 'relative', marginBottom: '12px' }}>
                        <input
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••"
                          maxLength={6}
                          value={adminPass}
                          onChange={(e) => setAdminPass(e.target.value)}
                          style={{ width: '100%', textAlign: 'center', fontSize: '20px', letterSpacing: '0.2em', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                          autoFocus
                        />
                      </div>
                      {adminError && <div style={{ color: '#D64545', fontSize: '12px', marginBottom: '10px', fontWeight: 600 }}>{adminError}</div>}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" style={{ flex: 1, padding: '10px', background: '#1C1F22', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>כניסה</button>
                        <button type="button" onClick={() => { setLandingRole('select'); setAdminError(''); }} style={{ padding: '10px', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>ביטול</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Worker Header & Folders */}
                {landingRole === 'worker' && (
                  <div style={{ background: '#1C1F22', color: '#fff', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', color: '#F5B700', fontFamily: 'monospace' }}>FIELD INSPECTION</span>
                      <button onClick={() => setLandingRole('select')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', cursor: 'pointer' }}>החלף משתמש</button>
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>בדיקות בטיחות שוטפות</h2>
                  </div>
                )}

                {landingRole === 'worker' && !currentFolder && !activeAsset && (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#8B9096', textAlign: 'center' }}>בחר קטגוריה לבדיקה:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {Object.entries(categories).map(([key, cat]) => {
                        const count = assets.filter((a) => a.category === key && a.status === 'pass').length;
                        const total = assets.filter((a) => a.category === key).length;
                        return (
                          <div
                            key={key}
                            onClick={() => setCurrentFolder(key as CategoryKey)}
                            style={{ background: theme === 'dark' ? '#262B32' : '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '16px 10px', textAlign: 'center', cursor: 'pointer' }}
                          >
                            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{cat.icon}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>{cat.name}</div>
                            <div style={{ fontSize: '10px', color: '#8B9096', marginTop: '4px' }}>{count}/{total} בוצעו</div>
                          </div>
                        );
                      })}
                      <div
                        onClick={() => setCurrentFolder('observations')}
                        style={{ gridColumn: '1 / -1', background: theme === 'dark' ? '#262B32' : '#f9f9f9', border: '1px solid #3A6EA5', borderRadius: '8px', padding: '14px', textAlign: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>📋</div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>תצפיות בטיחות וכלליות</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inside Category Folder */}
                {landingRole === 'worker' && currentFolder && currentFolder !== 'observations' && !activeAsset && (
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={() => setCurrentFolder(null)} style={{ alignSelf: 'flex-start', background: '#F5B700', border: 'none', padding: '6px 12px', borderRadius: '15px', fontWeight: 700, cursor: 'pointer', fontSize: '11px' }}>← חזרה לקטגוריות</button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                      {assets.filter((a) => a.category === currentFolder).map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => setActiveAsset(asset)}
                          style={{ background: theme === 'dark' ? '#262B32' : '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '12px', textAlign: 'center', cursor: 'pointer' }}
                        >
                          <div style={{ fontSize: '11px', fontWeight: 700 }}>{asset.name}</div>
                          <div style={{ fontSize: '9px', color: '#8B9096', fontFamily: 'monospace', margin: '4px 0' }}>{asset.id}</div>
                          <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '10px', background: asset.status === 'pass' ? '#E7F2EA' : '#EFE9DA', color: asset.status === 'pass' ? '#4C9A66' : '#8a6d1f' }}>
                            {asset.status === 'pass' ? 'תקין' : 'ממתין לבדיקה'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observations View */}
                {landingRole === 'worker' && currentFolder === 'observations' && (
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={() => setCurrentFolder(null)} style={{ alignSelf: 'flex-start', background: '#F5B700', border: 'none', padding: '6px 12px', borderRadius: '15px', fontWeight: 700, cursor: 'pointer', fontSize: '11px' }}>← חזרה</button>
                    {observations.map((obs) => (
                      <div key={obs.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme === 'dark' ? '#262B32' : '#f9f9f9', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
                        <span>{obs.name}</span>
                        <button
                          onClick={() => {
                            setObservations(observations.map(o => o.id === obs.id ? { ...o, status: o.status === 'open' ? 'met' : 'open' } : o));
                            showToast('סטטוס תצפית עודכן');
                          }}
                          style={{ padding: '4px 8px', fontSize: '10px', background: obs.status === 'met' ? '#4C9A66' : '#1C1F22', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {obs.status === 'open' ? 'סמן כבוצע' : 'פתוח מחדש'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Active Asset Check Form */}
                {landingRole === 'worker' && activeAsset && (
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => setActiveAsset(null)} style={{ alignSelf: 'flex-start', background: '#F5B700', border: 'none', padding: '6px 12px', borderRadius: '15px', fontWeight: 700, cursor: 'pointer', fontSize: '11px' }}>← חזרה לרשימה</button>
                    <div style={{ background: theme === 'dark' ? '#262B32' : '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#C99200', fontFamily: 'monospace' }}>{activeAsset.id}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{activeAsset.name}</div>
                      <div style={{ fontSize: '11px', color: '#8B9096', marginTop: '4px' }}>מיקום: {activeAsset.location}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                      <button
                        onClick={() => {
                          setAssets(assets.map(a => a.id === activeAsset.id ? { ...a, status: 'pass' } : a));
                          showToast('הבדיקה עודכנה כתקינה!');
                          setActiveAsset(null);
                        }}
                        style={{ flex: 1, padding: '12px', background: '#4C9A66', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        ✓ תקין לחלוטין
                      </button>
                      <button
                        onClick={() => {
                          setAssets(assets.map(a => a.id === activeAsset.id ? { ...a, status: 'fail' } : a));
                          showToast('דווחה תקלה!', true);
                          setActiveAsset(null);
                        }}
                        style={{ flex: 1, padding: '12px', background: '#D64545', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        ⚠️ נמצאה תקלה
                      </button>
                    </div>
                  </div>
                )}

                {/* Supervisor View */}
                {landingRole === 'supervisor' && (
                  <div style={{ padding: '16px', flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>תקלות פתוחות לטיפול</h3>
                    {assets.filter(a => a.status === 'fail').length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#8B9096', padding: '30px', fontSize: '12px' }}>אין תקלות פתוחות כרגע. הכל תקין!</div>
                    ) : (
                      assets.filter(a => a.status === 'fail').map(a => (
                        <div key={a.id} style={{ background: theme === 'dark' ? '#262B32' : '#f9f9f9', padding: '10px', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700 }}>{a.name}</div>
                            <div style={{ fontSize: '10px', color: '#8B9096' }}>{a.location}</div>
                          </div>
                          <button
                            onClick={() => {
                              setAssets(assets.map(item => item.id === a.id ? { ...item, status: 'resolved' } : item));
                              showToast('התקלה סומנה כטופלה');
                            }}
                            style={{ background: '#F5B700', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            סמן כטופל
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
          <div style={{ display: 'flex', gap: '20px' }}>
            <aside style={{ width: '220px', background: '#1C1F22', color: '#fff', borderRadius: '8px', padding: '12px 0', flexShrink: '0' }}>
              <div onClick={() => setAdminTab('dashboard')} style={{ padding: '10px 16px', cursor: 'pointer', background: adminTab === 'dashboard' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13px' }}>📊 לוח בקרה ראשי</div>
              <div onClick={() => setAdminTab('assets')} style={{ padding: '10px 16px', cursor: 'pointer', background: adminTab === 'assets' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13px' }}>🗂️ ניהול נכסים</div>
              <div onClick={() => setAdminTab('categories')} style={{ padding: '10px 16px', cursor: 'pointer', background: adminTab === 'categories' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13px' }}>⚙️ קטגוריות ותדירות</div>
              <div onClick={() => setAdminTab('export')} style={{ padding: '10px 16px', cursor: 'pointer', background: adminTab === 'export' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13px' }}>📥 דוחות וייצוא נתונים</div>
            </aside>
            <div style={{ flex: 1, background: theme === 'dark' ? '#20242A' : '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd' }}>
              {adminTab === 'dashboard' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>לוח בקרה ניהולי</h2>
                  <p style={{ color: '#8B9096', fontSize: '12px', marginBottom: '20px' }}>סקירה כללית של מצב הבטיחות במשק הבית.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ background: theme === 'dark' ? '#262B32' : '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>סך נכסים</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{assets.length}</div>
                    </div>
                    <div style={{ background: theme === 'dark' ? '#262B32' : '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#4C9A66' }}>תקינים</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: '#4C9A66' }}>{assets.filter(a => a.status === 'pass').length}</div>
                    </div>
                    <div style={{ background: theme === 'dark' ? '#262B32' : '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#D64545' }}>תקלות פתוחות</div>
                      <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px', color: '#D64545' }}>{assets.filter(a => a.status === 'fail').length}</div>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'assets' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>ניהול נכסים</h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#EDEDE9', textAlign: 'right' }}>
                        <th style={{ padding: '8px' }}>מזהה</th>
                        <th style={{ padding: '8px' }}>שם הנכס</th>
                        <th style={{ padding: '8px' }}>מיקום</th>
                        <th style={{ padding: '8px' }}>סטטוס</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map(asset => (
                        <tr key={asset.id} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '8px', fontFamily: 'monospace' }}>{asset.id}</td>
                          <td style={{ padding: '8px', fontWeight: 600 }}>{asset.name}</td>
                          <td style={{ padding: '8px' }}>{asset.location}</td>
                          <td style={{ padding: '8px' }}>{asset.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {adminTab === 'categories' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>הגדרת קטגוריות</h2>
                  {Object.entries(categories).map(([key, cat]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd', fontSize: '13px' }}>
                      <span>{cat.icon} {cat.name}</span>
                      <span style={{ fontWeight: 700, color: '#F5B700' }}>{cat.freq}</span>
                    </div>
                  ))}
                </div>
              )}

              {adminTab === 'export' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>ייצוא נתונים</h2>
                  <button onClick={() => showToast('הדוח הורד בהצלחה')} style={{ background: '#F5B700', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>הורד קובץ CSV</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1C1F22', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', borderRight: `4px solid ${toastMessage.isFail ? '#D64545' : '#4C9A66'}`, zIndex: 1000 }}>
          {toastMessage.text}
        </div>
      )}
    </div>
  );
}
