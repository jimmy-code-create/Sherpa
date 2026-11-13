import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieBanner } from "@/components/cookie-consent";
import { PwaRegistration } from "@/components/pwa";

// Fonts are self-hosted from the @fontsource npm packages (works offline and
// keeps LCP fast — no third-party font request at runtime).
const nunito = localFont({
  src: "../../node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2",
  variable: "--font-nunito",
  display: "swap",
  weight: "400 1000",
});
const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const jetbrains = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-mono-jet",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sherpa — Your entire syllabus. One guided path.",
    template: "%s · Sherpa",
  },
  description:
    "Pick your country, your class, your chapter. Sherpa builds a roadmap, deep original notes, vetted institutes and a Socratic tutor — in seconds.",
  applicationName: "Sherpa",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Sherpa", statusBarStyle: "default" },
  openGraph: {
    title: "Sherpa — Your entire syllabus. One guided path.",
    description:
      "A curriculum-aware AI study guide. Roadmap, deep notes, vetted resources, a tutor that makes you think.",
    type: "website",
    siteName: "Sherpa",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

const bootstrap = `
(function(){
  try {
    var raw = localStorage.getItem('sherpa_preferences');
    var p = raw ? JSON.parse(raw) : {};
    var sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = p.theme === 'dark' || ((p.theme === 'system' || !p.theme) && sys);
    var r = document.documentElement;
    if (dark) { r.classList.add('dark'); r.dataset.theme = 'dark'; } else { r.dataset.theme = 'light'; }
    if (p.reducedMotion) r.dataset.reducedMotion = 'true';
    if (p.dyslexiaFont) r.dataset.dyslexia = 'true';
    if (p.highContrast) r.dataset.contrast = 'high';
    if (p.fontScale) r.dataset.fontScale = String(p.fontScale);
    if (p.readingTheme) r.dataset.reading = p.readingTheme;
    if (p.noteFontSize) r.style.setProperty('--note-font-size', p.noteFontSize + 'px');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ThemeProvider>
          <div id="main">{children}</div>
          <CookieBanner />
          <PwaRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
