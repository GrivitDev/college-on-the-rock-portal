import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/admin.css";
import "@/styles/student.css";
import "@/styles/login.css";
import "@/styles/home.css";
import "@/styles/register.css";
import "@/styles/make-payment.css";
import "@/styles/upload-receipt.css";
import "@/styles/payment-history-page.css";
import "@/styles/admin-categories.css";
import "@/styles/payments.css";
import "@/styles/reciept-viewer.css";
import "@/styles/expenditure.css";
import '@/styles/admin-reports.css';
import '@/styles/Loader.module.css';
import { LoaderProvider } from "@/contexts/LoaderContext";
import Loader from "@/components/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BCCT-STUDENT BODY",
  description:
    "Official Student Body Payment Website Bishop Crowther College of Theology",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoaderProvider>
          <Loader />
          <div className="main-layout">
            <div className="page-wrapper">
              {children}
            </div>
            <footer className="home-footer">
              &copy; {new Date().getFullYear()} BCCT Student Body Payment System. All rights reserved.
            </footer>
          </div>
        </LoaderProvider>
      </body>
    </html>
  );
}
