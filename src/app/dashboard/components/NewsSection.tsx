'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';

interface NewsItem {
  _id: string;
  title: string;
  date: string;
  summary: string;
  details: string;
  by: string;
  imageUrl?: string;
}

export default function NewsUpdates() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/news')
      .then((res) => setNews(res.data))
      .catch(() => setNews([]));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="news-section-wrapper">
      <h2 className="news-section-title">📢 Latest News & Updates</h2>

      <div className="news-cards-container">
        {news.length === 0 && <p className="news-no-items">No news available.</p>}

        {news.map((item) => {
          const isExpanded = expandedId === item._id;
          return (
            <div key={item._id} className="news-card-item">
              <div
                className="news-card-header"
                onClick={() => toggleExpand(item._id)}
              >
                <div className="news-card-title-wrapper">
                  <h3 className="news-card-title">{item.title}</h3>
                  <span className="news-card-by">By: {item.by}</span>
                </div>
                {item.imageUrl && (
                  <div className="news-card-image">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="news-card-thumbnail"
                    />
                  </div>
                )}
              </div>

              <div className={`news-card-body ${isExpanded ? 'expanded' : ''}`}>
                <p className="news-card-summary">{item.summary}</p>
                {isExpanded && (
                  <div className="news-card-details">
                    <p>{item.details}</p>
                    <p className="news-card-date">
                      📅 {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
