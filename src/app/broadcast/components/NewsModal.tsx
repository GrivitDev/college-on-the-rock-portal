"use client";

import { useState } from "react";

interface News {
  _id?: string;   // optional since new items won’t have it yet
  title: string;
  date: string;
  summary: string;
  details: string;
  by: string;
}

interface Props {
  onClose: () => void;
  refresh: () => void;
  editing?: News | null;
}

export default function NewsModal({ onClose, refresh, editing }: Props) {
  const [form, setForm] = useState<News>(
    editing || {
      title: "",
      date: "",
      summary: "",
      details: "",
      by: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/news/${editing._id}` : "/api/news";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    refresh();
    onClose();
  };

  return (
    <div className="broadcast-modal-overlay">
      <div className="broadcast-modal">
        <h2>{editing ? "Edit News" : "Add News"}</h2>
        <form onSubmit={handleSave}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
          <input
            name="summary"
            placeholder="Summary"
            value={form.summary}
            onChange={handleChange}
          />
          <textarea
            name="details"
            placeholder="Details"
            value={form.details}
            onChange={handleChange}
          />
          <input
            name="by"
            placeholder="By"
            value={form.by}
            onChange={handleChange}
          />

          <div className="broadcast-modal-actions">
            <button type="submit">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
