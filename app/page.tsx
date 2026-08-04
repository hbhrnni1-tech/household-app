"use client";

import React, { useState } from 'react';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-[#1C1F22] text-[#EDEEDE] flex flex-col font-sans" dir="rtl">
      {/* סרגל עליון */}
      <header className="bg-[#24282C] border-b border-[#2E3338] px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <span className="bg-[#F5B700] text-[#1C1F22] font-black px-3 py-1 rounded text-sm shadow">דיגיטציה במפעל</span>
          <h1 className="text-xl font-bold tracking-wide">משק בית • מעקב בטיחות</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentView === 'home' ? 'bg-[#F5B700] text-[#1C1F22]' : 'bg-[#2E3338] hover:bg-[#3E454C]'}`}
          >
            מסך כניסה
          </button>
        </div>
      </header>

      {/* פס עיצוב צהוב-שחור אזהרה */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(-45deg,#F5B700,#F5B700_15px,#1C1F22_15px,#1C1F22_30px)]"></div>

      {/* תוכן ראשי */}
      <main className="flex-1 flex items-center justify-center p-6">
        {currentView === 'home' && (
          <div className="bg-[#24282C] border border-[#2E3338] p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-6 text-[#F5B700]">בחר את סוג הכניסה למערכת</h2>
            
            <div className="flex flex-col gap-4">
              {/* כפתור בודק שטח */}
              <button 
                onClick={() => setCurrentView('inspector')}
                className="p-5 rounded-xl border-2 border-[#F5B700] bg-[#1C1F22] hover:bg-[#2E3338] transition flex items-center gap-4 text-right group shadow-lg"
              >
                <div className="text-3xl bg-[#F5B700]/10 p-3 rounded-lg group-hover:bg-[#F5B700]/20 transition">📱</div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5B700]">בודק שטח</h3>
                  <p className="text-sm text-zinc-400">סריקת QR ומילוי בדיקות</p>
                </div>
              </button>

              {/* כפתור לוח ניהול */}
              <button 
                onClick={() => setCurrentView('admin')}
                className="p-5 rounded-xl border-2 border-zinc-700 bg-[#1C1F22] hover:bg-[#2E3338] transition flex items-center gap-4 text-right group shadow-lg"
              >
                <div className="text-3xl bg-zinc-800 p-3 rounded-lg">🔒</div>
                <div>
                  <h3 className="text-lg font-bold text-white">לוח ניהול</h3>
                  <p className="text-sm text-zinc-400">דורש סיסמה</p>
                </div>
              </button>

              {/* כפתור מפקח */}
              <button 
                onClick={() => setCurrentView('viewer')}
                className="p-5 rounded-xl border-2 border-zinc-700 bg-[#1C1F22] hover:bg-[#2E3338] transition flex items-center gap-4 text-right group shadow-lg"
              >
                <div className="text-3xl bg-zinc-800 p-3 rounded-lg">🕵️‍♂️</div>
                <div>
                  <h3 className="text-lg font-bold text-white">מפקח</h3>
                  <p className="text-sm text-zinc-400">תצוגה בלבד, ללא עריכה</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {currentView !== 'home' && (
          <div className="bg-[#24282C] border border-[#2E3338] p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-[#F5B700]">מסך בבנייה: {currentView}</h2>
            <p className="text-zinc-400 mb-6">כאן יופיע התוכן עבור המסך שבחרת.</p>
            <button 
              onClick={() => setCurrentView('home')}
              className="px-6 py-2 bg-[#F5B700] text-[#1C1F22] font-bold rounded-lg hover:bg-yellow-500 transition"
            >
              חזרה למסך הראשי
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
