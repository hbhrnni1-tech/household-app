"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentView,].”use client”; // לית בטחון נשתמש במשתנים סטנדרטיים
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1C1F22] text-[#EDEEDE]' : 'bg-[#EDEEDE] text-[#1C1F22]'} flex flex-col font-sans transition-colors duration-300`} dir="rtl">
      {/* סרגל עליון */}
      <header className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-300'} border-b px-6 py-4 flex justify-between items-center shadow-md`}>
        <div className="flex items-center gap-4">
          <span className="bg-[#F5B700] text-[#1C1F22] font-black px-3 py-1 rounded text-sm shadow">דיגיטציה של תחזוקת בטיחות במפעל</span>
          <h1 className="text-xl font-bold tracking-wide">משק בית • מעקב בטיחות</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#2E3338] text-yellow-400' : 'bg-zinc-200 text-zinc-800'} transition`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <button 
            onClick={() => setActiveTab('home')} 
            className="px-4 py-2 bg-[#2E3338] hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition"
          >
            מסך כניסה
          </button>
        </div>
      </header>

      {/* פס עיצוב אזהרה צהוב-שחור */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(-45deg,#F5B700,#F5B700_15px,#1C1F22_15px,#1C1F22_30px)]"></div>

      {/* תוכן ראשי */}
      <main className="flex-1 flex items-center justify-center p-6">
        {activeTab === 'home' && (
          <div className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-200'} border p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center transition-colors`}>
            <h2 className="text-2xl font-bold mb-6 text-[#F5B700]">בחר את סוג הכניסה למערכת</h2>
            
            <div className="flex flex-col gap-4">
              {/* כפתור בודק שטח */}
              <button 
                onClick={() => setActiveTab('inspector')}
                className={`p-5 rounded-xl border-2 border-[#F5B700] ${isDarkMode ? 'bg-[#1C1F22] hover:bg-[#2E3338]' : 'bg-zinc-50 hover:bg-zinc-100'} transition flex items-center gap-4 text-right group shadow-lg`}
              >
                <div className="text-3xl bg-[#F5B700]/10 p-3 rounded-lg group-hover:bg-[#F5B700]/20 transition">📱</div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5B700]">בודק שטח</h3>
                  <p className="text-sm text-zinc-400">סריקת QR ומילוי בדיקות</p>
                </div>
              </button>

              {/* כפתור לוח ניהול */}
              <button 
                onClick={() => setActiveTab('admin')}
                className={`p-5 rounded-xl border-2 border-zinc-700 ${isDarkMode ? 'bg-[#1C1F22] hover:bg-[#2E3338]' : 'bg-zinc-50 hover:bg-zinc-100'} transition flex items-center gap-4 text-right group shadow-lg`}
              >
                <div className="text-3xl bg-zinc-800 p-3 rounded-lg">🔒</div>
                <div>
                  <h3 className="text-lg font-bold">לוח ניהול</h3>
                  <p className="text-sm text-zinc-400">דורש סיסמה</p>
                </div>
              </button>

              {/* כפתור מפקח */}
              <button 
                onClick={() => setActiveTab('viewer')}
                className={`p-5 rounded-xl border-2 border-zinc-700 ${isDarkMode ? 'bg-[#1C1F22] hover:bg-[#2E3338]' : 'bg-zinc-50 hover:bg-zinc-100'} transition flex items-center gap-4 text-right group shadow-lg`}
              >
                <div className="text-3xl bg-zinc-800 p-3 rounded-lg">🕵️‍♂️</div>
                <div>
                  <h3 className="text-lg font-bold">מפקח</h3>
                  <p className="text-sm text-zinc-400">תצוגה בלבד, ללא עריכה</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'home' && (
          <div className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-200'} border p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center`}>
            <h2 className="text-xl font-bold mb-4 text-[#F5B700]">מסך פעיל: {activeTab}</h2>
            <p className="text-zinc-400 mb-6">המסך טעון בהצלחה מתוך הקוד המקורי.</p>
            <button 
              onClick={() => setActiveTab('home')}
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
