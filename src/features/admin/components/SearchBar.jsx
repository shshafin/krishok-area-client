import React, { useEffect, useRef, useState } from "react";

export default function SearchBar({ placeholder = "Search…", onChange, debounceMs = 300 }) {
  const [value, setValue] = useState("");
  const tRef = useRef();

  useEffect(() => {
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => {
      onChange?.(value);
    }, debounceMs);
    return () => clearTimeout(tRef.current);
  }, [value, debounceMs, onChange]);

  return (
    <form action="" className="companyprosearch" id="searchform" onSubmit={(e) => e.preventDefault()}>
      <input
        type="search"
        id="companyprosearch"
        name="companyprosearch"
        placeholder={placeholder}
        className=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />

      {/* Keep the container so your dropdown styling remains available */}
      <div
        className="allcompanyprosearchbox text-end rounded pb-3 paddingbox mt-5"
        id="searchcompanypro_result"
        data-bs-auto-close="true"
        style={{ display: "none" }}
      >
        <button type="button" className="btn-close" aria-label="Close" id="closecompanypro_search"></button>
        <div id="onecompanyproduct" className="text-start">
          <p title="পণ্য খোজ করুন" className="text-center text-white">
            পণ্য খোজ করুন
          </p>
        </div>
      </div>
    </form>
  );
}