'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function HouseholdSafetyApp() {
  const [view, setView] = useState<'landing' | 'field' | 'admin'>('landing');

  return (
    <div id="app" className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text)] transition-colors duration-200">
      <div className="hazard"></div>
      
      <header className="topbar bg-[var(--charcoal)] text-[var(--paper)] flex items-center justify-between px-6 py-3.5">
        <div className="brand flex flex-col gap-0.5">
          <span className="eyebrow font-mono text-[10px] tracking-[0.06em] text-[var(--yellow)]">מערכת בקרה</span>
          <h1 className="font-sans text-[20px] font-extrabold">משק בית · מעקב בטיחות</h1>
        </div>
        <div className="topbar-right flex items-center gap-2.5">
          {view !== 'landing' && (
            <button 
              onClick={() => setView('landing')}
              className="topbar-home-btn bg-transparent border border-[var(--line)] text-[var(--gray)] font-sans text-[11.5px] font-semibold px-3 py-2 rounded-md cursor-pointer whitespace-nowrap hover:bg-[var(--charcoal-2)] hover:text-[var(--paper)]"
            >
              ראשי
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        {view === 'landing' && (
          <div className="landing-card bg-[var(--surface)] border border-[var(--line-light)] rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <span className="landing-eyebrow font-sans font-bold text-sm text-[var(--charcoal)] mb-5 px-4.5 py-2 rounded-full bg-[var(--yellow)] inline-block">
              בחר מצב כניסה
            </span>
            <div className="landing-buttons flex flex-col gap-3.5">
              <button 
                onClick={() => setView('field')}
                className="landing-btn field flex flex-col items-center gap-1 p-5 rounded-xl border-2 border-[var(--yellow-dark)] bg-[var(--surface)] cursor-pointer hover:-translate-y-0.5 shadow-md"
              >
                <span className="landing-icon text-3xl">📱</span>
                <span className="landing-title font-sans font-extrabold text-base">עמדת שטח / סריקה</span>
                <span className="landing-sub text-[11.5px] text-[var(--gray)]">ביצוע בדיקות והזנת נתונים</span>
              </button>

              <button 
                onClick={() => setView('admin')}
                className="landing-btn admin flex flex-col items-center gap-1 p-5 rounded-xl border-2 border-[var(--charcoal)] bg-[var(--surface)] cursor-pointer hover:-translate-y-0.5 shadow-md"
              >
                <span className="landing-icon text-3xl">📊</span>
                <span className="landing-title font-sans font-extrabold text-base">לוח בקרה ניהולי</span>
                <span className="landing-sub text-[11.5px] text-[var(--gray)]">דוחות, התראות וניהול נכסים</span>
              </button>
            </div>
          </div>
        )}

        {view === 'field' && (
          <div className="phone w-[390px] max-w-full bg-[var(--charcoal-2)] rounded-[26px] p-2.5 shadow-2xl">
            <div className="phone-screen bg-[var(--surface-alt)] rounded-[18px] min-h-[640px] flex flex-col overflow-hidden p-4">
              <div className="text-center py-10">
                <h2 className="font-bold text-lg mb-4">עמדת שטח פעילה</h2>
                <p className="text-sm text-[var(--gray)] mb-6">כאן יופיע ממשק סריקת ה-QR ובדיקת הנכסים.</p>
                <button 
                  onClick={() => setView('landing')}
                  className="bg-[var(--yellow)] text-[var(--charcoal)] font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  חזרה לתפריט הראשי
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="admin-wrap flex w-full max-w-[1180px] bg-[var(--surface)] border border-[var(--line-light)] rounded-xl p-6 shadow-lg">
            <div className="w-full text-center py-10">
              <h2 className="font-extrabold text-2xl mb-4">לוח בקרה ניהולי</h2>
              <p className="text-sm text-[var(--gray)] mb-6">ניהול הנתונים והדוחות של מערכת בטיחות משק הבית.</p>
              <button 
                onClick={() => setView('landing')}
                className="bg-[var(--charcoal)] text-[var(--paper)] font-bold px-5 py-2.5 rounded-lg cursor-pointer"
              >
                חזרה לתפריט הראשי
              </button>
            </div>
          </div>
        )}
      </main>
      
      <div className="hazard thin"></div>
    </div>
  );
}
