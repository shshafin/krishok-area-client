import React, { useState } from 'react';
import '@/assets/styles/Filter.css';

export default function Filter({ onFilterChange, onViewChange, counts = { all: 0, images: 0, videos: 0 } }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeView, setActiveView] = useState('grid');

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'images', label: 'Images' },
    { key: 'videos', label: 'Videos' },
  ];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  const handleViewClick = (view) => {
    setActiveView(view);
    if (onViewChange) onViewChange(view);
  };

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h2 className="title">Gallery</h2>
        <div className="view-toggle">
          {['grid', 'list'].map((view) => (
            <button
              key={view}
              className={`btn${activeView === view ? ' btn-primary' : ''}`}
              onClick={() => handleViewClick(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            className={`btn${activeFilter === key ? ' btn-primary' : ''}`}
            onClick={() => handleFilterClick(key)}
          >
            {label} ({counts[key] || 0})
          </button>
        ))}
      </div>
    </div>
  );
}
