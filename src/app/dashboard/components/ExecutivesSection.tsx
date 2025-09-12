'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';

interface Executive {
  _id: string;
  name: string;
  position: string;
  imageUrl?: string;
}

export default function ExecutivesSection() {
  const [executives, setExecutives] = useState<Executive[]>([]);

  useEffect(() => {
    api
      .get('/executives')
      .then((res) => setExecutives(res.data))
      .catch(() => setExecutives([]));
  }, []);

  return (
    <section className="executives-section-wrapper">
      <h2 className="executives-section-title">👔 College Executives</h2>

      {executives.length === 0 && <p className="executives-no-items">No executives found.</p>}

      <div className="executives-cards-container">
        {executives.map((exec) => (
          <div key={exec._id} className="executive-card-item">
            <div className="executive-card-image-wrapper">
              <Image
                src={exec.imageUrl || '/default-profile.png'}
                alt={exec.name}
                width={120}
                height={120}
                className="executive-card-image"
              />
            </div>
            <div className="executive-card-info">
              <h3 className="executive-card-name">{exec.name}</h3>
              <p className="executive-card-position">{exec.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
