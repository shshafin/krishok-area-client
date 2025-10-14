import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function CompanyHeader() {
  const location = useLocation();

  // Get the last segment after the final "/"
  const pathParts = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1] || "";

  // Convert slug (like auto-crop-ltd) to readable name
  const formatName = (text) => {
    if (!text) return "কোম্পানী নাম পাওয়া যায়নি";
    return decodeURIComponent(text)
      .replace(/-/g, " ") // replace dashes with spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
  };

  const companyName = formatName(lastSegment);
  
  return (
    <div className="com-header-back">
      <div className="com-mainback">
        <div className="com-backlink">
          <NavLink
            to="/companyes"
            title="কোম্পানীসমূহতে ফিরে যান"
            className="flex items-center text-blue-600 hover:underline"
          >
            <span className="mr-1">⇦</span> 
          </NavLink>
        </div>

        <div className="company-header text-center mt-2">
          <h4 className="text-xl font-semibold">{companyName}</h4>
          <span className="co4by8h"></span>
        </div>
      </div>
    </div>
  );
}