"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  refresh: () => void;
  editing?: any | null;
}

export default function HOFModal({ onClose, refresh, editing }: Props) {
  const [form, setForm] = useState({
    name: editing?.name || "",
    description: editing?.description || "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    if (form.description) formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/hall-of-famers/${editing._id}`
      : "/api/hall-of-famers";

    await fetch(url, {
      method,
      body: formData,
    });

    refresh();
    onClose();
  };

  return (
    <div className="broadcast-modal-overlay">
      <div className="broadcast-modal">
        <h2>{editing ? "Edit Hall of Famer" : "Add Hall of Famer"}</h2>
        <form onSubmit={handleSave}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input type="file" accept="image/*" onChange={handleFile} />

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
