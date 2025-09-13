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
import '@/styles/users.css'
import "@/styles/dashboard.css";
import "@/styles/hero-section.css";
import "@/styles/news-section.css";
import "@/styles/student-page.css";
import "@/styles/hof-section.css";
import "@/styles/executives-section.css";

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
  title: "BCCT Student Portal | College on The Rock",
  description:
    "Official student payment portal for Bishop Crowther College of Theology, Okenne, Kogi State. Secure platform for student payments, receipts, and Payment records.",
  keywords: [
    "BCCT Okenne",
    "Kogi State",
    "College on The Rock",
    "Bishop Crowther college of Theology",
    "Anglican Theological Seminary",
    "Church of Nigeria Anglican Communion",
    "Ajayi Crowther University",
    "Crowther Graduate Theological Seminary",
    "Seven Anglican theological Seminaries in Nigeria"
  ],
  openGraph: {
    title: "BCCT Student Portal | College on The Rock",
    description: "Access the official BCCT student portal to make payments, upload receipts, and manage your Payment records.",
    url: "https://college-on-the-rock.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://college-on-the-rock.vercel.app/og-image.png",
        width: 1024,
        height: 1024,
        alt: "BCCT Student Body Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCCT Student Portal | College on The Rock",
    description: "Access the official BCCT student portal to make payments, upload receipts, and manage your Payment records.",
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
            &copy; {new Date().getFullYear()} BCCT Student Body Payment System. All rights reserved. <br />
            Website by <strong>Grivit</strong> | 📞 <a href="tel:+2348164580712">0816 458 0712</a> | 
            <a href="https://wa.me/2348164580712" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '0.3rem' }}>
              WhatsApp
            </a>
          </footer>

        </div>
      </body>
    </html>
  );
}
