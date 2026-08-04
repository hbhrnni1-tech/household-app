"use client";

import React, { useState } from 'react';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  
  // States עבור מסך בודק השטח
  const [selectedArea, setSelectedArea] = useState('');
  const [inspectionSubmitted, setInspectionSubmitted] = useState(false);
  const [answers, setAnswers] = useState({
    fireExtinguisher: 'tkn',
    emergencyExit: 'tkn',
    ppeWorn: 'tkn',
    cleanliness: 'tkn',
  });
  const [notes, setNotes] = useState('');

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
    setCurrentView('home');
  };

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
        {/* מסך ראשי - בחירת תפקיד */}
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

        {/* מסך בודק שטח */}
        {currentView === 'inspector' && !inspectionSubmitted && (
          <div className="bg-[#24282C] border border-[#2E3338] p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-right">
            <h2 className="text-2xl font-bold mb-6 text-[#F5B700] flex items-center gap-2">
              <span>📱</span> טופס בדיקת בטיחות שטח
            </h2>

            <form onSubmit={handleSubmitInspection} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">בחר אזור בדיקה במפעל:</label>
                <select 
                  value={selectedArea} 
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-[#1C1F22] border border-zinc-700 rounded-lg p-3 text-white focus:border-[#F5B700] outline-none"
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
                <div className="bg-[#1C1F22] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <span>מטפה כיבוי אש נגיש ותקין?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('fireExtinguisher', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.fireExtinguisher === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('fireExtinguisher', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.fireExtinguisher === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>

                {/* שאלה 2 */}
                <div className="bg-[#1C1F22] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <span>יציאות חירום פנויות וללא חסימות?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('emergencyExit', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.emergencyExit === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('emergencyExit', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.emergencyExit === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>

                {/* שאלה 3 */}
                <div className="bg-[#1C1F22] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <span>שימוש בציוד מגן אישי (PPE) כנדרש?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('ppeWorn', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.ppeWorn === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('ppeWorn', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.ppeWorn === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>

                {/* שאלה 4 */}
                <div className="bg-[#1C1F22] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                  <span>סביבת העבודה נקייה ומסודרת?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleAnswerChange('cleanliness', 'tkn')} className={`px-3 py-1 rounded text-sm ${answers.cleanliness === 'tkn' ? 'bg-green-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>תקין</button>
                    <button type="button" onClick={() => handleAnswerChange('cleanliness', 'lo_tkn')} className={`px-3 py-1 rounded text-sm ${answers.cleanliness === 'lo_tkn' ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>לא תקין</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">הערות חופשיות / תקלות לטיפול:</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="הכנס הערות במידת הצורך..."
                  className="w-full bg-[#1C1F22] border border-zinc-700 rounded-lg p-3 text-white focus:border-[#F5B700] outline-none h-24 resize-none"
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
                  onClick={() => setCurrentView('home')}
                  className="px-6 py-3 bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-600 transition"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        )}

        {/* אישור שליחת טופס */}
        {currentView === 'inspector' && inspectionSubmitted && (
          <div className="bg-[#24282C] border border-[#2E3338] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-[#F5B700]">הדיוווח נקלט בהצלחה!</h2>
            <p className="text-zinc-300 mb-6">הנתונים עבור <strong>{selectedArea}</strong> נשמרו במערכת בהצלחה.</p>
            <button 
              onClick={resetInspection}
              className="w-full py-3 bg-[#F5B700] text-[#1C1F22] font-bold rounded-xl hover:bg-yellow-500 transition"
            >
              חזרה למסך הראשי
            </button>
          </div>
        )}

        {/* שאר המסכים במידה ונבחרו */}
        {currentView !== 'home' && currentView !== 'inspector' && (
          <div className="bg-[#24282C] border border-[#2E3338] p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-[#F5B700]">מסך בבנייה: {currentView}</h2>
            <p className="text-zinc-400 mb-6">מסך זה יתווסף מיד.</p>
            <button 
              onClick={() => setCurrentView('home')}
              className="px-6 py-2 bg-[#F5B700] text-[#1C1F22] font-bold rounded-xl hover:bg-yellow-500 transition"
            >
              חזרה למסך הראשי
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
