"use client";

import { useEffect, useState } from "react";
import NewsModal from "./NewsModal";

interface News {
  _id: string;
  title: string;
  date: string;
  summary: string;
  details: string;
  by: string;
  imageUrl?: string;
}

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);

  const fetchNews = async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="broadcast-news-list">
      <button
        className="broadcast-news-add-btn"
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      >
        + Add News
      </button>

      <ul className="broadcast-news-items">
        {news.map((item) => (
          <li key={item._id} className="broadcast-news-item">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="broadcast-news-actions">
              <button
                onClick={() => {
                  setEditing(item);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/news/${item._id}`, { method: "DELETE" });
                  fetchNews();
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <NewsModal
          onClose={() => setModalOpen(false)}
          refresh={fetchNews}
          editing={editing}
        />
      )}
    </div>
  );
}
