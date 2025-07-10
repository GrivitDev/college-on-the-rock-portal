'use client';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bishop Crowther College of Theology, Okenne | Student Portal</title>
        <meta
          name="description"
          content="Official student payment portal for Bishop Crowther College of Theology, Okenne, Kogi State. Secure platform for student payments, receipts, and Payment records."
        />
        <meta
          name="keywords"
          content="BCCT Okenne, Kogi State, College on The Rock, Bishop Crowther college of Theology, Anglican Theological Seminary, Church of Nigeria Anglican Communion, Ajayi Crowther University, Crowther Graduate Theological Seminary, Seven Anglican theological Seminaries in Nigeria"
        />
        <meta property="og:title" content="BCCT Student Portal | College on The Rock" />
        <meta
          property="og:description"
          content="Access the official BCCT student portal to make payments, upload receipts, and manage your Payment records."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://college-on-the-rock.vercel.app/" />
        <meta property="og:image" content="/og-image.png" />
        <link rel="canonical" href="https://college-on-the-rock.vercel.app/" />
      </Head>

      <main className="home-page">
        <header className="home-header">
          <Image
            src="/ondrock.png"
            alt="BCCT Logo"
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
