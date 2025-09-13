"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BroadcastLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/news/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.message === "Login successful") {
      localStorage.setItem("newsLoggedIn", "true"); // keep frontend state
      router.push("/broadcast/dashboard");
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="broadcast-login">
      <h1>Broadcast Manager Login</h1>
      <form onSubmit={handleSubmit} className="broadcast-login-form">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="broadcast-error">{error}</p>}
      </form>
    </div>
  );
}
