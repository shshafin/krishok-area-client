import React, { useEffect, useMemo, useRef, useState } from "react";
import "@/assets/styles/SearchBar.css";

export default function SearchBar({
  placeholder = "Search…",
  onChange,
  defaultValue = "",
  delay = 250, // debounce ms
}) {
  const [value, setValue] = useState(defaultValue);
  const timer = useRef();

  // Debounce changes to avoid filtering every keystroke
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onChange?.(value.trim());
    }, delay);
    return () => clearTimeout(timer.current);
  }, [value, delay, onChange]);

  const inputId = useMemo(() => `search-input-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className="searchbar">
      <label htmlFor={inputId} className="sr-only">Search</label>
      <span className="search-icon" aria-hidden="true">
        {/* Lucide Search */}
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </span>
      <input
        id={inputId}
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        autoComplete="off"
      />
      {value && (
        <button
          className="clear-btn"
          aria-label="Clear search"
          onClick={() => setValue("")}
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
}