

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | BCCT Student Portal",
  description: "Official BCCT student portal homepage for secure student payments.",
};


export default function Home() {
  
  return (
    <>

      <main className="home-page">
        <header className="home-header">
          <Image
            src="/ondrock.png"
            alt="Bishop Crowther College of Theology Official Logo"
            width={300}
            height={300}
            className="home-logo"
          />
          <h2 className="home-institution">
            Bishop Crowther College Of Theology, Okenne, Kogi State
          </h2>
        </header>

        <div className="home-content">
          <h1 className="home-title">Welcome to BCCT Student Body Payment Portal</h1>
          <p className="home-description">
            A secure and easy-to-use platform for student payments.
          </p>

          <div className="home-buttons">
            <Link href="/login" className="home-btn login-btn">
              Login
            </Link>
            <Link href="/register" className="home-btn register-btn">
              Register
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
