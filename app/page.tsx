'use client';

import { useEffect } from 'react';

// אפליקציית "משק בית · מעקב בטיחות" הומרה מ-HTML גולמי לקומפוננטת Next.js.
// ה-CSS וה-JS המקוריים (שהיו בתוך <style> ו-<script> בקובץ ה-HTML) הועברו
// לקבצים סטטיים בתיקיית public/, כדי לא לשבור אותם עם ה-parser של TypeScript/JSX.
// חשוב: יש להעתיק את הקבצים public/hazard-app.css ו-public/hazard-app.js
// לתיקיית public/ הראשית של הפרויקט שלך.
//
// הסקריפטים נטענים ידנית וברצף (במקום next/script strategy="beforeInteractive",
// שמותר להשתמש בו רק בתוך app/layout.tsx) כדי להבטיח שהם רצים
// בדיוק בסדר הנכון: קודם qrcode, אחר כך jsQR, ורק בסוף hazard-app.js.
function loadScriptsInOrder(srcs: string[], onDone: () => void) {
  let i = 0;
  function next() {
    if (i >= srcs.length) {
      onDone();
      return;
    }
    const src = srcs[i];
    // אם הסקריפט כבר נטען (למשל ב-hot reload), לא לטעון שוב
    if (document.querySelector(`script[src="${src}"]`)) {
      i++;
      next();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      i++;
      next();
    };
    script.onerror = () => {
      console.error('נכשלה טעינת הסקריפט:', src);
    };
    document.body.appendChild(script);
  }
  next();
}

export default function Page() {
  useEffect(() => {
    loadScriptsInOrder(
      [
        'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
        'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
        '/hazard-app.js',
      ],
      () => {
        // כל הסקריפטים נטענו בהצלחה, לוגיקת האפליקציה כבר רצה מתוך hazard-app.js
      }
    );
  }, []);

  return (
    <>
      {/* גופנים */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      {/* עיצוב האפליקציה */}
      <link rel="stylesheet" href="/hazard-app.css" />

      <div id="app">
        <div className="topbar">
          <div className="brand">
            <div className="eyebrow" id="app-eyebrow">
              דיגיטציה של תחזוקת בטיחות במפעל
            </div>
            <h1 id="app-title">משק בית · מעקב בטיחות</h1>
          </div>
          <div className="topbar-right">
            <button id="theme-toggle" className="theme-toggle-btn" aria-label="Toggle dark mode">
              🌙
            </button>
            <select id="lang-select" className="lang-select" defaultValue="he">
              <option value="he">🇮🇱 עברית</option>
              <option value="en">🇬🇧 English</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="ar">🇸🇦 العربية</option>
            </select>
            <div className="mode-toggle">
              <button id="tab-field" className="active">
                בודק שטח
              </button>
              <button id="tab-admin">לוח ניהול</button>
            </div>
            <button id="topbar-home" className="topbar-home-btn">
              🏠 מסך כניסה
            </button>
          </div>
        </div>
        <div className="hazard" />
        <main id="main" />
      </div>
      <div id="print-area" />
      <div className="toast" id="toast" />
    </>
  );
}
