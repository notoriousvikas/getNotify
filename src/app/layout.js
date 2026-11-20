import "./globals.css";
import { AppProvider } from "../context/AppContext";
import AuthGuard from "../components/AuthGuard";

export const metadata = {
  title: "GetNotify – Notification & Email Infrastructure",
  description: "The modern notification and email delivery platform for developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark bg-[#0D0D0D]">
      <body className="bg-[#0D0D0D] text-[#FFFFFF] antialiased flex flex-col h-screen overflow-hidden select-none">
        <AppProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}
