'use client';

import Script from 'next/script';

// אפליקציית "משק בית · מעקב בטיחות" הומרה מ-HTML גולמי לקומפוננטת Next.js.
// ה-CSS וה-JS המקוריים (שהיו בתוך <style> ו-<script> בקובץ ה-HTML) הועברו
// לקבצים סטטיים בתיקיית public/, כדי לא לשבור אותם עם ה-parser של TypeScript/JSX.
// חשוב: יש להעתיק את הקבצים public/hazard-app.css ו-public/hazard-app.js
// לתיקיית public/ הראשית של הפרויקט שלך.

export default function Page() {
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

      {/* ספריות חיצוניות שהאפליקציה תלויה בהן (QR) — חייבות להיטען לפני הסקריפט הראשי */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.js" strategy="beforeInteractive" />
      {/* לוגיקת האפליקציה המקורית */}
      <Script src="/hazard-app.js" strategy="afterInteractive" />
    </>
  );
}
