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

interface LogEntry {
  id: string;
  time: string;
  text: string;
  type: 'pass' | 'fail' | 'system' | 'add';
}

interface GeneralObservation {
  id: string;
  name: string;
  status: 'open' | 'met';
}

export default function HouseholdSafetyApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [viewMode, setViewMode] = useState<'field' | 'admin'>('field');
  const [landingRole, setLandingRole] = useState<'select' | 'worker' | 'admin-lock' | 'supervisor' | 'qr'>('select');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'assets' | 'categories' | 'logs' | 'export'>('dashboard');

  const [currentFolder, setCurrentFolder] = useState<CategoryKey | 'observations' | null>(null);
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isFail?: boolean } | null>(null);
  
  // New Asset Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetId, setNewAssetId] = useState('');
  const [newAssetCat, setNewAssetCat] = useState<CategoryKey>('electricity');
  const [newAssetLoc, setNewAssetLoc] = useState('');

  // QR Simulation Input
  const [qrInputCode, setQrInputCode] = useState('');

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

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'LOG-1', time: '08:30', text: 'אתחול מערכת בטיחות', type: 'system' }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = (text: string, isFail = false) => {
    setToastMessage({ text, isFail });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addLog = (text: string, type: LogEntry['type']) => {
    const timeStr = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [{ id: 'L-' + Date.now(), time: timeStr, text, type }, ...prev]);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '1234' || adminPass === 'admin') {
      setViewMode('admin');
      setLandingRole('select');
      setAdminPass('');
      setAdminError('');
      addLog('התחברות מנהל מערכת הצליחה', 'system');
    } else {
      setAdminError('סיסמה שגויה. נסה שוב (ברירת מחדל: 1234)');
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetId) {
      showToast('נא למלא את כל השדות החובה', true);
      return;
    }
    const newAsset: Asset = {
      id: newAssetId,
      name: newAssetName,
      category: newAssetCat,
      location: newAssetLoc || 'לא מוגדר',
      status: 'pending'
    };
    setAssets([...assets, newAsset]);
    addLog(`נוסף נכס חדש: ${newAssetName} (${newAssetId})`, 'add');
    setShowAddModal(false);
    setNewAssetName('');
    setNewAssetId('');
    setNewAssetLoc('');
    showToast('הנכס נוסף בהצלחה!');
  };

  const handleQrScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = assets.find(a => a.id.toLowerCase() === qrInputCode.trim().toLowerCase());
    if (found) {
      setActiveAsset(found);
      setLandingRole('worker');
      setQrInputCode('');
      showToast(`זוהה נכס: ${found.name}`);
    } else {
      showToast('נכס לא נמצא במערכת לפי מזהה זה', true);
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'Heebo, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: theme === 'dark' ? '#15171A' : '#EDEDE9', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22', transition: 'background 0.2s, color 0.2s' }}>
      {/* Hazard Strip */}
      <div style={{ height: '6px', background: 'repeating-linear-gradient(45deg, #F5B700 0 10px, #1C1F22 10px 20px)' }}></div>

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
              style={{ background: 'transparent', border: '1px solid #3A4046', color: '#8B9096', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '11.5px' }}
            >
              ← חזרה לתפריט
            </button>
          )}
          <div style={{ display: 'flex', background: '#24282C', border: '1px solid #3A4046', borderRadius: '3px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('field')}
              style={{ padding: '9px 18px', background: viewMode === 'field' ? '#F5B700' : 'transparent', color: viewMode === 'field' ? '#1C1F22' : '#8B9096', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              שטח (עובד)
            </button>
            <button
              onClick={() => setViewMode('admin')}
              style={{ padding: '9px 18px', background: viewMode === 'admin' ? '#F5B700' : 'transparent', color: viewMode === 'admin' ? '#1C1F22' : '#8B9096', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              ניהול
            </button>
          </div>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ background: '#24282C', border: '1px solid #3A4046', color: '#EDEDE9', width: '34px', height: '34px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {viewMode === 'field' ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '36px 16px 60px' }}>
            <div style={{ width: '390px', maxWidth: '100%', background: '#24282C', borderRadius: '26px', padding: '10px', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)' }}>
              <div style={{ background: theme === 'dark' ? '#262B32' : '#fff', borderRadius: '18px', minHeight: '640px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* Landing Roles */}
                {landingRole === 'select' && (
                  <div style={{ padding: '32px 28px', textAlign: 'center', margin: 'auto' }}>
                    <div style={{ display: 'inline-block', fontWeight: 700, fontSize: '14px', color: '#1C1F22', background: '#F5B700', padding: '8px 18px', borderRadius: '20px', marginBottom: '22px' }}>
                      בחר תפקיד לכניסה למערכת
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <button
                        onClick={() => setLandingRole('worker')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '18px 16px', borderRadius: '12px', border: '2px solid #C99200', background: theme === 'dark' ? '#20242A' : '#fff', cursor: 'pointer', textAlign: 'center', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}
                      >
                        <span style={{ fontSize: '26px' }}>👷‍♂️</span>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>בדיקות שטח / משתמש</div>
                        <div style={{ fontSize: '11px', color: '#8B9096' }}>ביצוע ביקורות ותיעוד שוטף</div>
                      </button>
                      <button
                        onClick={() => setLandingRole('qr')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '18px 16px', borderRadius: '12px', border: '2px solid #4C9A66', background: theme === 'dark' ? '#20242A' : '#fff', cursor: 'pointer', textAlign: 'center', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}
                      >
                        <span style={{ fontSize: '26px' }}>📷</span>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>סריקת קוד QR לנכס</div>
                        <div style={{ fontSize: '11px', color: '#8B9096' }}>פתיחת בדיקה מהירה באמצעות ברקוד</div>
                      </button>
                      <button
                        onClick={() => setLandingRole('supervisor')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '18px 16px', borderRadius: '12px', border: '2px solid #3A6EA5', background: theme === 'dark' ? '#20242A' : '#fff', cursor: 'pointer', textAlign: 'center', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}
                      >
                        <span style={{ fontSize: '26px' }}>🛡️</span>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>מנהל אירועים / אחראי</div>
                        <div style={{ fontSize: '11px', color: '#8B9096' }}>סקירת תקלות פתוחות ואישור מענים</div>
                      </button>
                      <button
                        onClick={() => setLandingRole('admin-lock')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '18px 16px', borderRadius: '12px', border: '2px solid #1C1F22', background: theme === 'dark' ? '#20242A' : '#fff', cursor: 'pointer', textAlign: 'center', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}
                      >
                        <span style={{ fontSize: '26px' }}>⚙️</span>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>הנהלה וניהול מערכת</div>
                        <div style={{ fontSize: '11px', color: '#8B9096' }}>דוחות והגדרות מערכת מתקדמות</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* QR Simulation Screen */}
                {landingRole === 'qr' && (
                  <div style={{ padding: '32px 28px', textAlign: 'center', margin: 'auto', width: '100%' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>סורק קוד QR</h3>
                    <p style={{ fontSize: '12px', color: '#8B9096', marginBottom: '20px' }}>צלם את הקוד על גבי הנכס או הקלד את מזהה הנכס (לדוגמה: EL-01)</p>
                    <div style={{ border: '2px dashed #C99200', borderRadius: '12px', padding: '24px', marginBottom: '20px', background: theme === 'dark' ? '#20242A' : '#FAFAFA' }}>
                      <div style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#C99200' }}>מכוון מצלמה אל הברקוד...</div>
                    </div>
                    <form onSubmit={handleQrScanSubmit}>
                      <input
                        type="text"
                        placeholder="הקלד מזהה נכס (לדוגמה: EL-01)"
                        value={qrInputCode}
                        onChange={(e) => setQrInputCode(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D8D6CE', marginBottom: '12px', textAlign: 'center', fontSize: '13px', background: theme === 'dark' ? '#20242A' : '#fff', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" style={{ flex: 1, padding: '11px', background: '#F5B700', color: '#1C1F22', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>אתר נכס</button>
                        <button type="button" onClick={() => setLandingRole('select')} style={{ padding: '11px', background: 'transparent', border: '1px solid #D8D6CE', borderRadius: '8px', cursor: 'pointer', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}>ביטול</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Admin Password Lock */}
                {landingRole === 'admin-lock' && (
                  <div style={{ padding: '36px 28px', textAlign: 'center', margin: 'auto' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '19px', marginBottom: '18px' }}>כניסת מנהל מערכת</h3>
                    <form onSubmit={handleAdminLogin}>
                      <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <input
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••"
                          maxLength={6}
                          value={adminPass}
                          onChange={(e) => setAdminPass(e.target.value)}
                          style={{ width: '100%', textAlign: 'center', fontSize: '22px', letterSpacing: '0.3em', padding: '14px 44px', border: '2px solid #D8D6CE', borderRadius: '10px', fontFamily: 'monospace', background: theme === 'dark' ? '#20242A' : '#fff', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '6px' }}
                        >
                          👁️
                        </button>
                      </div>
                      {adminError && <div style={{ color: '#D64545', fontSize: '12.5px', fontWeight: 600, marginBottom: '10px' }}>{adminError}</div>}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button type="submit" style={{ flex: 1, padding: '12px', background: '#1C1F22', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>אישור</button>
                        <button type="button" onClick={() => { setLandingRole('select'); setAdminError(''); }} style={{ padding: '12px', background: 'transparent', border: '1.5px solid #D8D6CE', borderRadius: '8px', cursor: 'pointer', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}>ביטול</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Worker Header & Categories */}
                {landingRole === 'worker' && (
                  <div style={{ background: '#1C1F22', color: '#EDEDE9', padding: '16px 18px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                      <button onClick={() => setLandingRole('select')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid #3A4046', color: '#b8bcc1', fontSize: '10.5px', padding: '5px 12px', borderRadius: '14px', cursor: 'pointer' }}>החלף משתמש</button>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.08em', color: '#F5B700' }}>FIELD INSPECTION</span>
                    <h2 style={{ fontWeight: 700, fontSize: '17px', margin: '2px 0 0' }}>בדיקות בטיחות שוטפות</h2>
                  </div>
                )}

                {landingRole === 'worker' && !currentFolder && !activeAsset && (
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#8B9096', textAlign: 'center' }}>בחר קטגוריה לבדיקה בשטח:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {Object.entries(categories).map(([key, cat]) => {
                        const count = assets.filter((a) => a.category === key && a.status === 'pass').length;
                        const total = assets.filter((a) => a.category === key).length;
                        return (
                          <div
                            key={key}
                            onClick={() => setCurrentFolder(key as CategoryKey)}
                            style={{ background: theme === 'dark' ? '#20242A' : '#fff', border: '1.5px solid #D8D6CE', borderRadius: '10px', padding: '20px 12px', textAlign: 'center', cursor: 'pointer' }}
                          >
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                            <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{cat.name}</div>
                            <div style={{ fontSize: '10.5px', color: '#8B9096', marginTop: '4px' }}>{count}/{total} בוצעו</div>
                          </div>
                        );
                      })}
                      <div
                        onClick={() => setCurrentFolder('observations')}
                        style={{ gridColumn: '1 / -1', background: theme === 'dark' ? '#20242A' : '#fff', border: '1.5px solid #3A6EA5', borderRadius: '10px', padding: '16px', textAlign: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>📋</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>תצפיות בטיחות וכלליות</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inside Category Folder */}
                {landingRole === 'worker' && currentFolder && currentFolder !== 'observations' && !activeAsset && (
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => setCurrentFolder(null)} style={{ alignSelf: 'flex-start', background: '#F5B700', border: 'none', padding: '6px 14px', borderRadius: '15px', fontWeight: 700, cursor: 'pointer', fontSize: '11px', color: '#1C1F22' }}>← חזרה לקטגוריות</button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {assets.filter((a) => a.category === currentFolder).map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => setActiveAsset(asset)}
                          style={{ background: theme === 'dark' ? '#20242A' : '#fff', border: '1px solid #D8D6CE', borderRadius: '8px', padding: '12px', textAlign: 'center', cursor: 'pointer' }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>{asset.name}</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#8B9096', margin: '2px 0 6px' }}>{asset.id}</div>
                          <span style={{ fontSize: '10px', padding: '2px 9px', borderRadius: '20px', background: asset.status === 'pass' ? '#E7F2EA' : asset.status === 'fail' ? '#FBEAEA' : '#EFE9DA', color: asset.status === 'pass' ? '#4C9A66' : asset.status === 'fail' ? '#D64545' : '#8a6d1f' }}>
                            {asset.status === 'pass' ? 'תקין' : asset.status === 'fail' ? 'תקלה' : 'ממתין'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observations View */}
                {landingRole === 'worker' && currentFolder === 'observations' && (
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => setCurrentFolder(null)} style={{ alignSelf: 'flex-start', background: '#F5B700', border: 'none', padding: '6px 14px', borderRadius: '15px', fontWeight: 700, cursor: 'pointer', fontSize: '11px', color: '#1C1F22' }}>← חזרה</button>
                    {observations.map((obs) => (
                      <div key={obs.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme === 'dark' ? '#20242A' : '#fff', padding: '12px', borderRadius: '8px', fontSize: '12.5px', border: '1px solid #D8D6CE' }}>
                        <span>{obs.name}</span>
                        <button
                          onClick={() => {
                            setObservations(observations.map(o => o.id === obs.id ? { ...o, status: o.status === 'open' ? 'met' : 'open' } : o));
                            showToast('סטטוס תצפית עודכן');
                            addLog(`תצפית ${obs.id} עודכנה לסטטוס ${obs.status === 'open' ? 'בוצע' : 'פתוח'}`, 'pass');
                          }}
                          style={{ padding: '6px 10px', fontSize: '11px', background: obs.status === 'met' ? '#4C9A66' : '#1C1F22', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          {obs.status === 'open' ? 'סמן כבוצע' : 'פתוח מחדש'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Active Asset Check Form */}
                {landingRole === 'worker' && activeAsset && (
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <button onClick={() => setActiveAsset(null)} style={{ alignSelf: 'flex-start', background: '#F5B700', border: 'none', padding: '6px 14px', borderRadius: '15px', fontWeight: 700, cursor: 'pointer', fontSize: '11px', color: '#1C1F22' }}>← חזרה לרשימה</button>
                    <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', padding: '16px', borderRadius: '8px', border: '1.5px solid #D8D6CE' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#C99200' }}>{activeAsset.id}</div>
                      <div style={{ fontWeight: '700', fontSize: '18px', marginTop: '3px' }}>{activeAsset.name}</div>
                      <div style={{ fontSize: '12px', color: '#8B9096', marginTop: '6px' }}>מיקום: {activeAsset.location}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                      <button
                        onClick={() => {
                          setAssets(assets.map(a => a.id === activeAsset.id ? { ...a, status: 'pass' } : a));
                          showToast('הנכס סומן כתקין!');
                          addLog(`נכס ${activeAsset.name} (${activeAsset.id}) סומן כתקין`, 'pass');
                          setActiveAsset(null);
                        }}
                        style={{ flex: 1, padding: '14px', background: '#4C9A66', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                      >
                        ✓ תקין לחלוטין
                      </button>
                      <button
                        onClick={() => {
                          setAssets(assets.map(a => a.id === activeAsset.id ? { ...a, status: 'fail' } : a));
                          showToast('דווחה תקלה!', true);
                          addLog(`נמצאה תקלה בנכס ${activeAsset.name} (${activeAsset.id})`, 'fail');
                          setActiveAsset(null);
                        }}
                        style={{ flex: 1, padding: '14px', background: '#D64545', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                      >
                        ⚠️ נמצאה תקלה
                      </button>
                    </div>
                  </div>
                )}

                {/* Supervisor View */}
                {landingRole === 'supervisor' && (
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '15.5px', fontWeight: 700, marginBottom: '6px' }}>תקלות פתוחות לטיפול</h3>
                    {assets.filter(a => a.status === 'fail').length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#8B9096', padding: '40px 20px', fontSize: '13px' }}>אין תקלות פתוחות כרגע. הכל תקין!</div>
                    ) : (
                      assets.filter(a => a.status === 'fail').map(a => (
                        <div key={a.id} style={{ background: theme === 'dark' ? '#20242A' : '#fff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #D64545', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700 }}>{a.name}</div>
                            <div style={{ fontSize: '11px', color: '#8B9096' }}>{a.location}</div>
                          </div>
                          <button
                            onClick={() => {
                              setAssets(assets.map(item => item.id === a.id ? { ...item, status: 'resolved' } : item));
                              showToast('התקלה סומנה כטופלה');
                              addLog(`תקלה בנכס ${a.name} טופלה`, 'pass');
                            }}
                            style={{ background: '#F5B700', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#1C1F22' }}
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
          <div style={{ display: 'flex', minHeight: 'calc(100vh - 58px)' }}>
            <aside style={{ width: '200px', background: '#1C1F22', color: '#EDEDE9', flexShrink: 0, padding: '18px 0' }}>
              <div onClick={() => setAdminTab('dashboard')} style={{ padding: '11px 20px', cursor: 'pointer', background: adminTab === 'dashboard' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13.5px', borderRight: adminTab === 'dashboard' ? '3px solid #F5B700' : '3px solid transparent' }}>📊 לוח בקרה ראשי</div>
              <div onClick={() => setAdminTab('assets')} style={{ padding: '11px 20px', cursor: 'pointer', background: adminTab === 'assets' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13.5px', borderRight: adminTab === 'assets' ? '3px solid #F5B700' : '3px solid transparent' }}>🗂️ ניהול נכסים</div>
              <div onClick={() => setAdminTab('categories')} style={{ padding: '11px 20px', cursor: 'pointer', background: adminTab === 'categories' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13.5px', borderRight: adminTab === 'categories' ? '3px solid #F5B700' : '3px solid transparent' }}>⚙️ קטגוריות ותדירות</div>
              <div onClick={() => setAdminTab('logs')} style={{ padding: '11px 20px', cursor: 'pointer', background: adminTab === 'logs' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13.5px', borderRight: adminTab === 'logs' ? '3px solid #F5B700' : '3px solid transparent' }}>📜 יומן אירועים</div>
              <div onClick={() => setAdminTab('export')} style={{ padding: '11px 20px', cursor: 'pointer', background: adminTab === 'export' ? '#24282C' : 'transparent', fontWeight: 700, fontSize: '13.5px', borderRight: adminTab === 'export' ? '3px solid #F5B700' : '3px solid transparent' }}>📥 דוחות וייצוא נתונים</div>
            </aside>
            <div style={{ flex: 1, padding: '28px 32px 60px', maxWidth: '1180px' }}>
              {adminTab === 'dashboard' && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>לוח בקרה ניהולי</h2>
                  <p style={{ color: '#8B9096', fontSize: '13px', marginBottom: '22px' }}>סקירה כללית של מצב הבטיחות במשק הבית.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                    <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', padding: '16px 18px', borderRadius: '8px', border: '1px solid #D8D6CE' }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700 }}>סך נכסים במערכת</div>
                      <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '12px' }}>{assets.length}</div>
                    </div>
                    <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', padding: '16px 18px', borderRadius: '8px', border: '1px solid #D8D6CE' }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#4C9A66' }}>נכסים תקינים</div>
                      <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '12px', color: '#4C9A66' }}>{assets.filter(a => a.status === 'pass').length}</div>
                    </div>
                    <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', padding: '16px 18px', borderRadius: '8px', border: '1px solid #D8D6CE' }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#D64545' }}>תקלות פתוחות</div>
                      <div style={{ fontSize: '30px', fontWeight: 800, marginTop: '12px', color: '#D64545' }}>{assets.filter(a => a.status === 'fail').length}</div>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'assets' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800 }}>ניהול נכסים</h2>
                    <button onClick={() => setShowAddModal(true)} style={{ background: '#F5B700', color: '#1C1F22', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>+ הוסף נכס חדש</button>
                  </div>
                  <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', borderRadius: '8px', border: '1px solid #D8D6CE', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: theme === 'dark' ? '#262B32' : '#F4F3EE', borderBottom: '1px solid #D8D6CE' }}>
                          <th style={{ padding: '12px 16px' }}>מזהה</th>
                          <th style={{ padding: '12px 16px' }}>שם הנכס</th>
                          <th style={{ padding: '12px 16px' }}>קטגוריה</th>
                          <th style={{ padding: '12px 16px' }}>מיקום</th>
                          <th style={{ padding: '12px 16px' }}>סטטוס</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map(a => (
                          <tr key={a.id} style={{ borderBottom: '1px solid #D8D6CE' }}>
                            <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{a.id}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 600 }}>{a.name}</td>
                            <td style={{ padding: '12px 16px' }}>{categories[a.category]?.name}</td>
                            <td style={{ padding: '12px 16px' }}>{a.location}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontSize: '10.5px', padding: '3px 10px', borderRadius: '20px', background: a.status === 'pass' ? '#E7F2EA' : a.status === 'fail' ? '#FBEAEA' : '#EFE9DA', color: a.status === 'pass' ? '#4C9A66' : a.status === 'fail' ? '#D64545' : '#8a6d1f' }}>
                                {a.status === 'pass' ? 'תקין' : a.status === 'fail' ? 'תקלה' : 'ממתין'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminTab === 'categories' && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>הגדרת קטגוריות ותדירות בדיקה</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {Object.entries(categories).map(([key, cat]) => (
                      <div key={key} style={{ background: theme === 'dark' ? '#20242A' : '#fff', padding: '18px', borderRadius: '8px', border: '1px solid #D8D6CE' }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>{cat.name}</div>
                        <div style={{ fontSize: '12px', color: '#8B9096', marginTop: '6px' }}>תדירות בדיקה נדרשת: {cat.freq}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === 'logs' && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>יומן אירועים ומערכת</h2>
                  <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', borderRadius: '8px', border: '1px solid #D8D6CE', padding: '16px' }}>
                    {logs.map(log => (
                      <div key={log.id} style={{ display: 'flex', gap: '14px', padding: '10px 0', borderBottom: '1px solid #D8D6CE', fontSize: '13px' }}>
                        <span style={{ fontFamily: 'monospace', color: '#8B9096' }}>{log.time}</span>
                        <span style={{ flex: 1 }}>{log.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === 'export' && (
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>דוחות וייצוא נתונים</h2>
                  <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #D8D6CE' }}>
                    <p style={{ fontSize: '13.5px', marginBottom: '16px' }}>ניתן לייצא את נתוני המערכת והלוגים לשימוש חיצוני או לצורך תיעוד וגיבוי.</p>
                    <button onClick={() => showToast('הדוח יוצא בהצלחה!')} style={{ background: '#1C1F22', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>הורד דוח מלא (CSV/Excel)</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: theme === 'dark' ? '#20242A' : '#fff', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22', width: '100%', maxWidth: '420px', borderRadius: '12px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>הוספת נכס חדש למערכת</h3>
            <form onSubmit={handleCreateAsset} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>שם הנכס</label>
                <input type="text" value={newAssetName} onChange={e => setNewAssetName(e.target.value)} placeholder="לדוגמה: לוח חשמל קומה 2" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D8D6CE', background: theme === 'dark' ? '#15171A' : '#fff', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>מזהה ייחודי (קוד)</label>
                <input type="text" value={newAssetId} onChange={e => setNewAssetId(e.target.value)} placeholder="לדוגמה: EL-03" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D8D6CE', background: theme === 'dark' ? '#15171A' : '#fff', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>קטגוריה</label>
                <select value={newAssetCat} onChange={e => setNewAssetCat(e.target.value as CategoryKey)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D8D6CE', background: theme === 'dark' ? '#15171A' : '#fff', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}>
                  {Object.entries(categories).map(([k, c]) => (
                    <option key={k} value={k}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>מיקום בשטח</label>
                <input type="text" value={newAssetLoc} onChange={e => setNewAssetLoc(e.target.value)} placeholder="לדוגמה: אגף צפוני" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D8D6CE', background: theme === 'dark' ? '#15171A' : '#fff', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '11px', background: '#F5B700', color: '#1C1F22', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>שמור נכס</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '11px', background: 'transparent', border: '1px solid #D8D6CE', borderRadius: '6px', cursor: 'pointer', color: theme === 'dark' ? '#EAE8E1' : '#1C1F22' }}>ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: toastMessage.isFail ? '#D64545' : '#1C1F22', color: '#fff', padding: '10px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 600, boxShadow: '0 10px 20px rgba(0,0,0,0.2)', zIndex: 1100, transition: 'all 0.2s' }}>
          {toastMessage.text}
        </div>
      )}
    </div>
  );
}
