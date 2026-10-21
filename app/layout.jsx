import '@/styles/globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata = {
  title: "JeevanSeva - India's All-in-One Life Services Marketplace",
  description: 'Book verified home, healthcare, education, wedding, travel, legal, and last rites services under one roof.',
  keywords: 'home services, electrician, cleaning, elder care, nurse at home, funeral service, wedding planner, tutors, salon at home, India marketplace',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E3A8A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
