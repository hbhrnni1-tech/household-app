'use client';

import React, { useState } from 'react';

interface Asset {
  id: string;
  name: string;
  location: string;
  category: string;
  lastChecked: string;
  status: 'תקין' | 'דורש תשומת לב' | 'בבדיקה';
  notes: string;
}

interface ChecklistItem {
  id: string;
  question: string;
  category: string;
}

export default function HouseholdSafetyApp() {
  const [view, setView] = useState<'landing' | 'field' | 'admin' | 'addAsset'>('landing');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('AST-001');
  const [shortageNote, setShortageNote] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('הכל');

  // טופס הוספת נכס חדש
  const [newAssetName, setNewAssetName] = useState<string>('');
  const [newAssetLocation, setNewAssetLocation] = useState<string>('');
  const [newAssetCategory, setNewAssetCategory] = useState<string>('בטיחות אש');

  // רשימת נכסים מלאה למערכת
  const [assets, setAssets] = useState<Asset[]>([
    { id: 'AST-001', name: 'ערכת עזרה ראשית ראשית', location: 'מטבח / סלון', category: 'רפואי', lastChecked: '04/08/2026', status: 'תקין', notes: 'נבדק, כל החומרים בתוקף.' },
    { id: 'AST-002', name: 'מטפה כיבוי אש 3 ק"ג', location: 'כניסה ראשית', category: 'בטיחות אש', lastChecked: '01/08/2026', status: 'תקין', notes: 'לחץ אוויר תקין מד טען ירוק.' },
    { id: 'AST-003', name: 'גלאי עשן אלחוטי', location: 'מסדרון חדרים', category: 'גילוי אש', lastChecked: '28/07/2026', status: 'דורש תשומת לב', notes: 'נדרשת החלפת סוללה בקרוב.' },
    { id: 'AST-004', name: 'שמיכת כיבוי אש', location: 'מטבח', category: 'בטיחות אש', lastChecked: '15/07/2026', status: 'תקין', notes: 'נמצא במארז נגיש.' },
    { id: 'AST-005', name: 'פנס חירום נטען', location: 'ממ"ד', category: 'חירום', lastChecked: '10/07/2026', status: 'בבדיקה', notes: 'בדיקת טעינה יזומה.' },
  ]);

  const checklistItems: ChecklistItem[] = [
    { id: 'c1', question: 'האם הציוד שלם ובאריזה מקורית?', category: 'שלמות פיזית' },
    { id: 'c2', question: 'האם תוקף הציוד/החומרים בתוקף?', category: 'תוקף' },
    { id: 'c3', question: 'האם הגישה לנכס פנויה וללא חסימות?', category: 'נגישות' },
  ];

  const handleFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // עדכון תאריך וסטטוס הנכס במערכת
    setAssets(prev => prev.map(a => {
      if (a.id === selectedAssetId) {
        return {
          ...a,
          lastChecked: new Date().toLocaleDateString('he-IL'),
          status: shortageNote ? 'דורש תשומת לב' : 'תקין',
          notes: shortageNote ? `חוסר ידני: ${shortageNote}` : 'נבדק בשטח ונמצא תקין.'
        };
      }
      return a;
    }));

    setTimeout(() => {
      setSubmitted(false);
      setView('landing');
      setShortageNote('');
    }, 2200);
  };

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetLocation) return;

    const newAsset: Asset = {
      id: `AST-00${assets.length + 1}`,
      name: newAssetName,
      location: newAssetLocation,
      category: newAssetCategory,
      lastChecked: new Date().toLocaleDateString('he-IL'),
      status: 'תקין',
      notes: 'נוצר לאחרונה במערכת'
    };

    setAssets([newAsset, ...assets]);
    setNewAssetName('');
    setNewAssetLocation('');
    setView('admin');
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'הכל' || asset.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="app" className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text)] transition-colors duration-200" dir="rtl">
      <div className="hazard"></div>
      
      {/* סרגל עליון */}
      <header className="topbar bg-[var(--charcoal)] text-[var(--paper)] flex items-center justify-between px-6 py-3.5 shadow-md">
        <div className="brand flex flex-col gap-0.5">
          <span className="eyebrow font-mono text-[10px] tracking-[0.06em] text-[var(--yellow)]">מערכת בקרה תפעולית משולבת</span>
          <h1 className="font-sans text-[20px] font-extrabold">משק בית · ניהול נכסים, בטיחות וחוסרים</h1>
        </div>
        <div className="topbar-right flex items-center gap-2.5">
          {view !== 'landing' && (
            <button 
              onClick={() => setView('landing')}
              className="topbar-home-btn bg-transparent border border-[var(--line)] text-[var(--gray)] font-sans text-[11.5px] font-semibold px-3 py-2 rounded-md cursor-pointer whitespace-nowrap hover:bg-[var(--charcoal-2)] hover:text-[var(--paper)] transition-colors"
            >
              חזרה לתפריט ראשי
            </button>
          )}
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        
        {/* 1. מסך נחיתה / בחירת מצב */}
        {view === 'landing' && (
          <div className="landing-card bg-[var(--surface)] border border-[var(--line-light)] rounded-2xl p-8 max-w-lg w-full text-center shadow-xl">
            <span className="landing-eyebrow font-sans font-bold text-sm text-[var(--charcoal)] mb-6 px-5 py-2 rounded-full bg-[var(--yellow)] inline-block">
              בחר מרחב עבודה במערכת
            </span>
            <div className="landing-buttons grid grid-cols-1 gap-4">
              <button 
                onClick={() => setView('field')}
                className="landing-btn field flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--yellow-dark)] bg-[var(--surface)] cursor-pointer hover:-translate-y-0.5 transition-all shadow-md text-right w-full"
              >
                <span className="text-3xl p-3 bg-amber-50 rounded-lg">📱</span>
                <div>
                  <span className="landing-title font-sans font-extrabold text-base block">עמדת שטח / סריקת QR</span>
                  <span className="landing-sub text-xs text-[var(--gray)]">ביצוע בדיקות תקופתיות והזנה ידנית של חוסרים בשטח</span>
                </div>
              </button>

              <button 
                onClick={() => setView('admin')}
                className="landing-btn admin flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--charcoal)] bg-[var(--surface)] cursor-pointer hover:-translate-y-0.5 transition-all shadow-md text-right w-full"
              >
                <span className="text-3xl p-3 bg-zinc-100 rounded-lg">📊</span>
                <div>
                  <span className="landing-title font-sans font-extrabold text-base block">לוח בקרה ניהולי (Admin)</span>
                  <span className="landing-sub text-xs text-[var(--gray)]">סקירת נכסים, מעקב אחר סטטוסים, חיפוש מתקדם ודוחות</span>
                </div>
              </button>

              <button 
                onClick={() => setView('addAsset')}
                className="landing-btn add flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] cursor-pointer hover:-translate-y-0.5 transition-all shadow-md text-right w-full"
              >
                <span className="text-3xl p-3 bg-zinc-100 rounded-lg">➕</span>
                <div>
                  <span className="landing-title font-sans font-extrabold text-base block">הגדרת נכס חדש</span>
                  <span className="landing-sub text-xs text-[var(--gray)]">הוספת ציוד חדש למעקב ובקרת מלאי המשק</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 2. מסך עמדת שטח (סימולציית טלפון נייד) */}
        {view === 'field' && (
          <div className="phone w-[400px] max-w-full bg-[var(--charcoal-2)] rounded-[26px] p-2.5 shadow-2xl">
            <div className="phone-screen bg-[var(--surface-alt)] rounded-[18px] min-h-[660px] flex flex-col overflow-hidden p-5">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div>
                  <h2 className="font-extrabold text-sm">עמדת סריקת שטח</h2>
                  <span className="text-[10px] text-[var(--gray)]">דימוי מסוף נייד / סריקת QR</span>
                </div>
                <span className="text-xs font-mono bg-[var(--yellow)] px-2.5 py-1 rounded-full text-[var(--charcoal)] font-bold">מקוון</span>
              </div>

              {submitted ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="text-5xl mb-3 animate-bounce">✅</div>
                  <h3 className="font-bold text-lg mb-1">הנתונים נקלטו בהצלחה</h3>
                  <p className="text-xs text-[var(--gray)]">הדוח והחוסרים הידניים עודכנו במערכת הניהולית.</p>
                </div>
              ) : (
                <form onSubmit={handleFieldSubmit} className="flex flex-col gap-3.5 flex-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[var(--charcoal)]">בחירת נכס נסרק:</label>
                    <select 
                      value={selectedAssetId} 
                      onChange={(e) => setSelectedAssetId(e.target.value)}
                      className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs font-semibold"
                    >
                      {assets.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.location})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 bg-[var(--surface)] p-3 rounded-lg border border-[var(--line-light)]">
                    <span className="text-xs font-bold text-[var(--charcoal)]">שאלון בדיקת תקינות מהירה:</span>
                    {checklistItems.map(item => (
                      <label key={item.id} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-[var(--charcoal)] h-4 w-4" />
                        <span className="text-[var(--text)]">{item.question}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[var(--charcoal)]">דיווח ידני על חוסרים / הערות:</label>
                    <textarea 
                      value={shortageNote}
                      onChange={(e) => setShortageNote(e.target.value)}
                      placeholder="הזן כאן חוסרים ידניים או פגמים שהתגלו בנכס..."
                      className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs h-20 resize-none"
                    />
                  </div>

                  <div className="mt-auto pt-2 flex gap-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-[var(--charcoal)] text-[var(--paper)] font-bold py-3 rounded-lg text-xs cursor-pointer hover:bg-black transition-colors shadow"
                    >
                      שגר דיווח חוסרים / תקינות
                    </button>
                    <button 
                      type="button"
                      onClick={() => setView('landing')}
                      className="px-3 bg-transparent border border-[var(--line)] text-[var(--gray)] font-semibold py-3 rounded-lg text-xs cursor-pointer"
                    >
                      ביטול
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 3. לוח בקרה ניהולי (Admin) */}
        {view === 'admin' && (
          <div className="admin-wrap flex flex-col w-full max-w-[1100px] bg-[var(--surface)] border border-[var(--line-light)] rounded-xl p-6 shadow-lg gap-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 gap-3">
              <div>
                <h2 className="font-extrabold text-xl">לוח בקרה ניהולי ודוחות מלאי</h2>
                <p className="text-xs text-[var(--gray)]">ניהול מרוכז של כל נכסי ובטיחות משק הבית.</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={() => setView('addAsset')}
                  className="bg-[var(--yellow)] text-[var(--charcoal)] font-bold px-4 py-2 rounded-lg text-xs cursor-pointer shadow hover:opacity-95"
                >
                  + הוסף נכס
                </button>
                <button 
                  onClick={() => setView('landing')}
                  className="bg-[var(--charcoal)] text-[var(--paper)] font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                >
                  חזרה לתפריט ראשי
                </button>
              </div>
            </div>

            {/* סרגלי חיפוש וסינון */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[var(--surface-alt)] p-3 rounded-lg border border-[var(--line-light)]">
              <input 
                type="text" 
                placeholder="חיפוש לפי שם נכס או מיקום..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-72 p-2 rounded-md border border-[var(--line)] bg-[var(--surface)] text-xs"
              />

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <span className="text-xs font-bold text-[var(--gray)]">סינון סטטוס:</span>
                {['הכל', 'תקין', 'דורש תשומת לב', 'בבדיקה'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                      filterStatus === status ? 'bg-[var(--charcoal)] text-[var(--paper)]' : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--gray)]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* טבלת נכסים מפורטת */}
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-[var(--line)] text-xs text-[var(--gray)] font-mono">
                    <th className="py-3 px-3">מזהה</th>
                    <th className="py-3 px-3">שם הנכס</th>
                    <th className="py-3 px-3">קטגוריה</th>
                    <th className="py-3 px-3">מיקום</th>
                    <th className="py-3 px-3">בדיקה אחרונה</th>
                    <th className="py-3 px-3">סטטוס ותיעוד</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map(asset => (
                      <tr key={asset.id} className="border-b border-[var(--line-light)] hover:bg-[var(--surface-alt)] transition-colors">
                        <td className="py-3.5 px-3 font-mono text-xs font-bold text-[var(--gray)]">{asset.id}</td>
                        <td className="py-3.5 px-3 font-bold">{asset.name}</td>
                        <td className="py-3.5 px-3 text-xs text-[var(--gray)]">{asset.category}</td>
                        <td className="py-3.5 px-3 text-xs">{asset.location}</td>
                        <td className="py-3.5 px-3 text-xs font-mono">{asset.lastChecked}</td>
                        <td className="py-3.5 px-3 flex flex-col gap-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold w-fit ${
                            asset.status === 'תקין' ? 'bg-green-100 text-green-800' : 
                            asset.status === 'דורש תשומת לב' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {asset.status}
                          </span>
                          <span className="text-[11px] text-[var(--gray)]">{asset.notes}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-xs text-[var(--gray)]">
                        לא נמצאו נכסים העונים לתנאי החיפוש.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. מסך הוספת נכס חדש */}
        {view === 'addAsset' && (
          <div className="add-card bg-[var(--surface)] border border-[var(--line-light)] rounded-2xl p-8 max-w-md w-full shadow-xl">
            <div className="border-b pb-3 mb-4 flex items-center justify-between">
              <h2 className="font-extrabold text-lg">הוספת נכס חדש למערכת</h2>
              <button 
                onClick={() => setView('landing')}
                className="text-xs text-[var(--gray)] hover:text-black cursor-pointer"
              >
                ✕ סגור
              </button>
            </div>

            <form onSubmit={handleAddAssetSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--charcoal)]">שם הנכס / הציוד:</label>
                <input 
                  type="text" 
                  required
                  placeholder="לדוגמה: ערכת עזרה ראשית קומה 2"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--charcoal)]">מיקום פיזי במשק הבית:</label>
                <input 
                  type="text" 
                  required
                  placeholder="לדוגמה: חדר שינה הורים"
                  value={newAssetLocation}
                  onChange={(e) => setNewAssetLocation(e.target.value)}
                  className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--charcoal)]">קטגוריית נכס:</label>
                <select 
                  value={newAssetCategory}
                  onChange={(e) => setNewAssetCategory(e.target.value)}
                  className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs"
                >
                  <option value="בטיחות אש">בטיחות אש</option>
                  <option value="רפואי">רפואי ועזרה ראשית</option>
                  <option value="חירום">ציוד חירום</option>
                  <option value="כללי">כללי ותחזוקה</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-[var(--charcoal)] text-[var(--paper)] font-bold py-2.5 rounded-lg text-xs cursor-pointer hover:bg-black transition-colors"
                >
                  שמור נכס במערכת
                </button>
                <button 
                  type="button"
                  onClick={() => setView('landing')}
                  className="px-4 bg-transparent border border-[var(--line)] text-[var(--gray)] font-semibold py-2.5 rounded-lg text-xs cursor-pointer"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
      
      <div className="hazard thin"></div>
    </div>
  );
}
