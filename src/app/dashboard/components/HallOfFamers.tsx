'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Image from 'next/image';

interface HOF {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
}

export default function HallOfFamers() {
  const [hofs, setHofs] = useState<HOF[]>([]);

  useEffect(() => {
    api
      .get('/hall-of-famers')
      .then((res) => setHofs(res.data))
      .catch(() => setHofs([]));
  }, []);

  return (
    <section className="hof-section-wrapper">
      <h2 className="hof-section-title">🏆 Hall of Famers</h2>

      {hofs.length === 0 && <p className="hof-no-items">No Hall of Famers yet.</p>}

      <div className="hof-cards-container">
        {hofs.map((hof) => (
          <div key={hof._id} className="hof-card-item">
            <div className="hof-card-image-wrapper">
              <Image
                src={hof.imageUrl}
                alt={hof.name}
                width={140}
                height={140}
                className="hof-card-image"
              />
            </div>
            <div className="hof-card-info">
              <h3 className="hof-card-name">{hof.name}</h3>
              {hof.description && (
                <p className="hof-card-description">{hof.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
