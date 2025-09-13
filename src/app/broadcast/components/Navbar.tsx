"use client";

interface NavbarProps {
  activeTab: "news" | "hof";
  setActiveTab: (tab: "news" | "hof") => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <nav className="broadcast-navbar">
      <button
        className={`broadcast-navbar-btn ${
          activeTab === "news" ? "active" : ""
        }`}
        onClick={() => setActiveTab("news")}
      >
        Manage News
      </button>
      <button
        className={`broadcast-navbar-btn ${
          activeTab === "hof" ? "active" : ""
        }`}
        onClick={() => setActiveTab("hof")}
      >
        Hall of Famers
      </button>
    </nav>
  );
}
