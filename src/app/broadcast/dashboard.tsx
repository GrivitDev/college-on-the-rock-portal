"use client";

import NewsList from "./components/NewsList";
import HOFList from "./components/HOFList";
import ProtectedWrapper from "./components/ProtectedWrapper";

export default function DashboardPage() {
  return (
    <ProtectedWrapper>
      <div className="broadcast-dashboard">
        <h1>Broadcast Manager</h1>

        <section className="broadcast-section">
          <h2>News Management</h2>
          <NewsList />
        </section>

        <section className="broadcast-section">
          <h2>Hall of Famers Management</h2>
          <HOFList />
        </section>
      </div>
    </ProtectedWrapper>
  );
}
