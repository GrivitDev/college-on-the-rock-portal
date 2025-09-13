"use client";

import { useEffect, useState } from "react";
import HOFModal from "./HOFModal";

interface HOF {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
}

export default function HOFList() {
  const [hofs, setHofs] = useState<HOF[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HOF | null>(null);

  const fetchHOFs = async () => {
    const res = await fetch("/api/hall-of-famers");
    const data = await res.json();
    setHofs(data);
  };

  useEffect(() => {
    fetchHOFs();
  }, []);

  return (
    <div className="broadcast-hof-list">
      <button
        className="broadcast-hof-add-btn"
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      >
        + Add Hall of Famer
      </button>

      <ul className="broadcast-hof-items">
        {hofs.map((hof) => (
          <li key={hof._id} className="broadcast-hof-item">
            <img
              src={hof.imageUrl}
              alt={hof.name}
              className="broadcast-hof-img"
            />
            <div>
              <h3>{hof.name}</h3>
              <p>{hof.description}</p>
            </div>
            <div className="broadcast-hof-actions">
              <button
                onClick={() => {
                  setEditing(hof);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/hall-of-famers/${hof._id}`, {
                    method: "DELETE",
                  });
                  fetchHOFs();
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <HOFModal
          onClose={() => setModalOpen(false)}
          refresh={fetchHOFs}
          editing={editing}
        />
      )}
    </div>
  );
}
