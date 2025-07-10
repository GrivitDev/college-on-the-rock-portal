import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
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
import "@/styles/admin-reports.css";
import "@/styles/reset.css";

// Font Setup
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BCCT-STUDENT BODY",
  description:
    "Official Student Body Payment Website Bishop Crowther College of Theology",
  icons: {
    icon: "/favicon.png",
  },
      openGraph: {
    title: "BCCT - STUDENT BODY",
    description: "Raising students on the solid rock of Christ.",
    url: "https://college-on-the-rock.vercel.app/",
    siteName: "BCCT",
    images: [
      {
        url: "https://college-on-the-rock.vercel.app/og-image.png",
        width: 1024,
        height: 1024,
        alt: "BCCT Student Body Logo",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BCCT - STUDENT BODY",
    description: "Raising students on the solid rock of Christ.",
    images: ["https://college-on-the-rock.vercel.app/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <div className="main-layout">
          <div className="page-wrapper">
            {children}
          </div>
          <footer className="home-footer">
            &copy; {new Date().getFullYear()} BCCT Student Body Payment System. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
