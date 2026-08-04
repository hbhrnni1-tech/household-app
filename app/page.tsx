"use client";

import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // States עבור מסך בודק שטח
  const [selectedArea, setSelectedArea] = useState('');
  const [inspectionSubmitted, setInspectionSubmitted] = useState(false);
  const [answers, setAnswers] = useState({
    fireExtinguisher: 'tkn',
    emergencyExit: 'tkn',
    ppeWorn: 'tkn',
    cleanliness: 'tkn',
  });
  const [notes, setNotes] = useState('');

  // States עבור לוח ניהול (סיסמה)
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea) {
      alert('נא לבחור אזור בדיקה');
      return;
    }
    setInspectionSubmitted(true);
  };

  const resetInspection = () => {
    setSelectedArea('');
    setInspectionSubmitted(false);
    setAnswers({ fireExtinguisher: 'tkn', emergencyExit: 'tkn', ppeWorn: 'tkn', cleanliness: 'tkn' });
    setNotes('');
    setActiveTab('home');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '1234') {
      setIsAdminAuthenticated(true);
    } else {
      alert('סיסמה שגויה (נסה 1234)');
    }
  };

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
            onClick={() => { setActiveTab('home'); setIsAdminAuthenticated(false); setAdminPassword(''); }} 
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
        
        {/* 1. מסך ראשי - בחירת תפקיד */}
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

        {/* 2. מסך בודק שטח */}
        {activeTab === 'inspector' && !inspectionSubmitted && (
          <div className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-200'} border p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-right`}>
            <h2 className="text-2xl font-bold mb-6 text-[#F5B700] flex items-center gap-2">
              <span>📱</span> טופס בדיקת בטיחות שטח
            </h2>

            <form onSubmit={handleSubmitInspection} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">בחר אזור בדיקה במפעל:</label>
                <select 
                  value={selectedArea} 
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-[#1C1F22] text-white border-zinc-700' : 'bg-zinc-100 text-black border-zinc-300'} border rounded-lg p-3 focus:border-[#F5B700] outline-none`}
                >
                  <option value="">-- בחר אזור --</option>
                  <option value="קו ייצור 1">קו ייצור 1</option>
                  <option value="מחסן מרכזי">מחסן מרכזי</option>
                  <option value="אזור טעינה ופריקה">אזור טעינה ופריקה</option>
                  <option value="משרדי הנהלה">משרדי הנהלה</option>
                </select>
              </div>

              <div className="border-t border-zinc-700 pt-4 flex flex-col gap-4">
                <h3 className="font-bold text-[#F5B700]">שאלון בדיקה תקופתי:</h3>

                {/* שאלה 1 */}
                <div className={`${isDarkMode ? 'bg-[#1C1F22] border-zinc-800' : 'bg-zinc-100 border-zinc-300'} p-4 rounded-xl border flex justify-between items-center`}>
                  <span>מטפה כיבוי אש נגיש ותקין?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('fireExtinguisher', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.fireExtinguisher === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('fireExtinguisher', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.fireExtinguisher === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>

                {/* שאלה 2 */}
                <div className={`${isDarkMode ? 'bg-[#1C1F22] border-zinc-800' : 'bg-zinc-100 border-zinc-300'} p-4 rounded-xl border flex justify-between items-center`}>
                  <span>יציאות חירום פנויות וללא חסימות?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('emergencyExit', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.emergencyExit === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('emergencyExit', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.emergencyExit === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>

                {/* שאלה 3 */}
                <div className={`${isDarkMode ? 'bg-[#1C1F22] border-zinc-800' : 'bg-zinc-100 border-zinc-300'} p-4 rounded-xl border flex justify-between items-center`}>
                  <span>שימוש בציוד מגן אישי (PPE) כנדרש?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('ppeWorn', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.ppeWorn === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('ppeWorn', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.ppeWorn === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>

                {/* שאלה 4 */}
                <div className={`${isDarkMode ? 'bg-[#1C1F22] border-zinc-800' : 'bg-zinc-100 border-zinc-300'} p-4 rounded-xl border flex justify-between items-center`}>
                  <span>סביבת העבודה נקייה ומסודרת?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('cleanliness', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.cleanliness === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('cleanliness', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.cleanliness === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">הערות חופשיות / תקלות לטיפול:</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="הכנס הערות במידת הצורך..."
                  className={`w-full ${isDarkMode ? 'bg-[#1C1F22] text-white border-zinc-700' : 'bg-zinc-100 text-black border-zinc-300'} border rounded-lg p-3 focus:border-[#F5B700] outline-none h-24 resize-none`}
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#F5B700] text-[#1C1F22] font-bold rounded-xl hover:bg-yellow-500 transition shadow-lg"
                >
                  שלח דיווח בדיקה
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-600 transition"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        )}

        {/* אישור שליחת טופס בודק שטח */}
        {activeTab === 'inspector' && inspectionSubmitted && (
          <div className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-200'} border p-8 rounded-2xl shadow-2xl max-w-md w-full text-center`}>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-[#F5B700]">הדיוווח נקלט בהצלחה!</h2>
            <p className="opacity-80 mb-6">הנתונים עבור <strong>{selectedArea}</strong> נשמרו במערכת בהצלחה.</p>
            <button 
              onClick={resetInspection}
              className="w-full py-3 bg-[#F5B700] text-[#1C1F22] font-bold rounded-xl hover:bg-yellow-500 transition"
            >
              חזרה למסך הראשי
            </button>
          </div>
        )}

        {/* 3. לוח ניהול (עם אימות סיסמה 1234) */}
        {activeTab === 'admin' && !isAdminAuthenticated && (
          <div className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-200'} border p-8 rounded-2xl shadow-2xl max-w-md w-full text-center`}>
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-2xl font-bold mb-2 text-[#F5B700]">כניסה ללוח ניהול</h2>
            <p className="text-sm opacity-70 mb-6">הזן סיסמה כדי לגשת להגדרות ולתצוגת הנתונים (סיסמה לדוגמה: 1234)</p>
            
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 text-right">
              <input 
                type="password"
                placeholder="הכנס סיסמה..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={`w-full ${isDarkMode ? 'bg-[#1C1F22] text-white border-zinc-700' : 'bg-zinc-100 text-black border-zinc-300'} border rounded-lg p-3 focus:border-[#F5B700] outline-none text-center tracking-widest text-lg`}
              />
              <button 
                type="submit"
                className="w-full py-3 bg-[#F5B700] text-[#1C1F22] font-bold rounded-xl hover:bg-yellow-500 transition shadow-lg"
              >
                התחבר
              </button>
            </form>
          </div>
        )}

        {activeTab === 'admin' && isAdminAuthenticated && (
          <div className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-200'} border p-8 rounded-2xl shadow-2xl max-w-3xl w-full text-right`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#F5B700]">🛠️ לוח ניהול מערכת</h2>
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded text-xs font-bold border border-green-600/30">מחובר כמנהל</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`${isDarkMode ? 'bg-[#1C1F22]' : 'bg-zinc-100'} p-4 rounded-xl border border-zinc-700 text-center`}>
                <div className="text-2xl font-bold text-[#F5B700]">12</div>
                <div className="text-xs opacity-70">בדיקות שבוצעו השבוע</div>
              </div>
              <div className={`${isDarkMode ? 'bg-[#1C1F22]' : 'bg-zinc-100'} p-4 rounded-xl border border-zinc-700 text-center`}>
                <div className="text-2xl font-bold text-red-500">3</div>
                <div className="text-xs opacity-70">תקלות פתוחות לטיפול</div>
              </div>
              <div className={`${isDarkMode ? 'bg-[#1C1F22]' : 'bg-zinc-100'} p-4 rounded-xl border border-zinc-700 text-center`}>
                <div className="text-2xl font-bold text-green-500">92%</div>
                <div className="text-xs opacity-70">ציון עמידה בתקן</div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-[#1C1F22]' : 'bg-zinc-100'} p-6 rounded-xl border border-zinc-700 mb-6`}>
              <h3 className="font-bold mb-3 text-lg">ניהול אזורי בדיקה והגדרות</h3>
              <p className="text-sm opacity-70 mb-4">כאן ניתן להוסיף אזורים חדשים במפעל או לעדכן את השאלונים המחזוריים.</p>
              <button 
                onClick={() => alert('הפעולה בוצעה בהצלחה')}
                className="px-4 py-2 bg-[#F5B700] text-[#1C1F22] font-bold rounded-lg hover:bg-yellow-500 transition text-sm"
              >
                + הוסף אזור בדיקה חדש
              </button>
            </div>
          </div>
        )}

        {/* 4. מסך מפקח */}
        {activeTab === 'viewer' && (
          <div className={`${isDarkMode ? 'bg-[#24282C] border-[#2E3338]' : 'bg-white border-zinc-200'} border p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-right`}>
            <h2 className="text-2xl font-bold mb-4 text-[#F5B700]">🕵️‍♂️ תצוגת מפקח (צפייה בלבד)</h2>
            <p className="opacity-70 mb-6">מבט על סטטוס הבטיחות העדכני בכלל חלקי המפעל.</p>
            
            <div className="flex flex-col gap-3">
              <div className={`${isDarkMode ? 'bg-[#1C1F22]' : 'bg-zinc-100'} p-4 rounded-xl border border-zinc-700 flex justify-between items-center`}>
                <div>
                  <h4 className="font-bold">קו ייצור 1</h4>
                  <p className="text-xs opacity-60">נבדק היום ב-08:30 ע"י יוסי</p>
                </div>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs font-bold">תקין לחלוטין</span>
              </div>

              <div className={`${isDarkMode ? 'bg-[#1C1F22]' : 'bg-zinc-100'} p-4 rounded-xl border border-zinc-700 flex justify-between items-center`}>
                <div>
                  <h4 className="font-bold">מחסן מרכזי</h4>
                  <p className="text-xs opacity-60">נבדק אתמול ב-14:15 ע"י דני</p>
                </div>
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs font-bold">דורש מעקב (תקלה פתוחה)</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
