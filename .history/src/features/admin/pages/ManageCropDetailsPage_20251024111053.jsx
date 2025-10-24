import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/adminScoped.css";
import TrashIcon from "@/assets/IconComponents/Trash";

const RAW_CROP_DETAILS = [
  {
    id: 401,
    cropNameBn: "পটল",
    cropNameEn: "Pointed Gourd",
    categoryName: "ক্ষতিকর পোকামাকড়",
    categoryTone: "danger",
    headline: "কচি পাতায় এফিডের ঘন আক্রমণ",
    heroImage:
      "https://images.unsplash.com/photo-1437751059337-82e6f6488760?auto=format&fit=crop&w=900&q=80",
    summary: {
      intro:
        "কচি পাতায় আঠালো স্রাব জমে গাছ দুর্বল হয়ে যাচ্ছে এবং চারা বৃদ্ধিও থেমে আছে।",
      extent: "সময়মতো ব্যবস্থা না নিলে ফলন ২০-২৫ শতাংশ পর্যন্ত কমে যেতে পারে।",
      caution:
        "সপ্তাহে দুই দিন করে স্কাউটিং করুন এবং গুরুতর আক্রান্ত লতা দ্রুত কেটে ফেলুন।",
      symptoms: "পাতা কুঁকড়ে যায়, রং ফ্যাকাসে হয় এবং নতুন লতা বিকাশ বন্ধ থাকে।",
      remedy:
        "নিম তেল ও সাবান মিশ্রণ স্প্রে করুন, প্রয়োজন হলে হালকা সিস্টেমিক কীটনাশক ব্যবহার করুন।",
    },
  },
];

const normalizeCropDetail = (detail, index) => {
  if (!detail || typeof detail !== "object") {
    return null;
  }
  return {
    id: detail.id ?? index + 1,
    cropNameBn: detail.cropNameBn ?? "",
    cropNameEn: detail.cropNameEn ?? "",
    categoryName: detail.categoryName ?? "",
    categoryTone: detail.categoryTone ?? "info",
    headline: detail.headline ?? "",
    heroImage: detail.heroImage ?? "https://picsum.photos/seed/crop/640/480",
    summary: detail.summary || {},
  };
};

const SUMMARY_ORDER = [
  { key: "intro", label: "পরিচিতি" },
  { key: "extent", label: "ক্ষতির সম্ভাবনা" },
  { key: "caution", label: "সতর্কতা" },
  { key: "symptoms", label: "লক্ষণ" },
  { key: "remedy", label: "করণীয়" },
];

export default function ManageCropDetailsPage() {
  const [cropDetails, setCropDetails] = useState(() =>
    RAW_CROP_DETAILS.map((detail, index) =>
      normalizeCropDetail(detail, index)
    ).filter(Boolean)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [removing, setRemoving] = useState({});
  const [confirmDetail, setConfirmDetail] = useState(null);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const categories = useMemo(() => {
    const list = Array.from(
      new Set(cropDetails.map((detail) => detail.categoryName).filter(Boolean))
    );
    return list;
  }, [cropDetails]);

  const filteredDetails = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return cropDetails.filter((detail) => {
      const matchesCategory =
        categoryFilter === "all" ||
        detail.categoryName.toLowerCase() === categoryFilter.toLowerCase();
      if (!matchesCategory) return false;
      if (!term) return true;
      return (
        detail.cropNameBn.toLowerCase().includes(term) ||
        detail.cropNameEn.toLowerCase().includes(term) ||
        detail.categoryName.toLowerCase().includes(term) ||
        detail.headline.toLowerCase().includes(term)
      );
    });
  }, [cropDetails, searchTerm, categoryFilter]);

  const deleteDetail = (detail) => {
    setRemoving((prev) => ({ ...prev, [detail.id]: true }));
    setTimeout(() => {
      setCropDetails((prev) => prev.filter((item) => item.id !== detail.id));
      setRemoving((prev) => {
        const next = { ...prev };
        delete next[detail.id];
        return next;
      });
      toast.success(`"${detail.cropNameBn}" সম্পর্কিত তথ্য মুছে ফেলা হয়েছে`);
    }, 280);
  };

  const handleDelete = (detail) => {
    setConfirmDetail(detail);
  };

  const handleConfirmDelete = () => {
    if (!confirmDetail) return;
    const detail = confirmDetail;
    setConfirmDetail(null);
    deleteDetail(detail);
  };

  const handleCancelDelete = () => {
    setConfirmDetail(null);
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className="content-wrapper _scoped_admin manage-crop-details-page"
      style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">ফসলের তথ্য ব্যবস্থাপনা</h1>
              <p className="text-muted mt-1 mb-0">
                মাঠ পর্যায়ে শনাক্ত করা সমস্যাগুলো এক জায়গায় রাখুন এবং অগ্রগতি
                পর্যবেক্ষণ করুন।
              </p>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">ড্যাশবোর্ড</NavLink>
                </li>
                <li className="breadcrumb-item">
                  <NavLink to="/admin/crops/add-details">ফসল</NavLink>
                </li>
                <li className="breadcrumb-item active">ব্যবস্থাপনা</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="crop-details-shell">
            <div className="crop-details-toolbar">
              <div className="crop-details-stats">
                <span className="crop-details-total">
                  মোট এন্ট্রি: {cropDetails.length}
                </span>
                <span className="crop-details-visible">
                  দেখানো হচ্ছে: {filteredDetails.length}
                </span>
              </div>
              <div className="crop-details-controls">
                <div className="crop-details-search">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="ফসল, ক্যাটাগরি বা শিরোনাম দিয়ে খুঁজুন..."
                  />
                </div>
                <div className="crop-details-filter">
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}>
                    <option value="all">সব ক্যাটাগরি</option>
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="crop-details-grid">
              {filteredDetails.map((detail) => {
                const isExpanded = expandedIds.has(detail.id);
                const summaryEntries = SUMMARY_ORDER.map(({ key, label }) => {
                  const value = detail.summary[key];
                  if (!value) return null;
                  return { key, label, value };
                }).filter(Boolean);
                const hasHidden = summaryEntries.length > 2;
                const visibleEntries =
                  isExpanded || !hasHidden
                    ? summaryEntries
                    : summaryEntries.slice(0, 2);
                return (
                  <article
                    key={detail.id}
                    className={`crop-detail-card ${
                      removing[detail.id] ? "is-removing" : ""
                    }`}>
                    <button
                      type="button"
                      className="crop-detail-delete-icon"
                      onClick={() => handleDelete(detail)}
                      disabled={Boolean(removing[detail.id])}
                      title="তথ্য মুছে ফেলুন"
                      aria-label={`${detail.cropNameBn} সম্পর্কে তথ্য মুছে ফেলুন`}>
                      <TrashIcon
                        width={20}
                        height={20}
                        strokeWidth={1.8}
                      />
                    </button>
                    <div className="crop-detail-media">
                      <img
                        src={detail.heroImage}
                        alt={`${detail.cropNameBn} ফসলের ছবি`}
                      />
                      <span
                        className={`crop-detail-category badge-${detail.categoryTone}`}>
                        {detail.categoryName}
                      </span>
                    </div>

                    <div className="crop-detail-body">
                      <div className="crop-detail-header">
                        <div>
                          <h3 className="crop-detail-title">
                            {detail.headline}
                          </h3>
                          <p className="crop-detail-meta">
                            <span>{detail.cropNameBn}</span>
                            <span
                              className="divider"
                              aria-hidden="true">
                              |
                            </span>
                            <span>{detail.cropNameEn}</span>
                          </p>
                        </div>
                      </div>

                      <div className="crop-detail-summary">
                        <div
                          className={`crop-detail-summary-inner ${
                            !isExpanded && hasHidden ? "is-collapsed" : ""
                          }`}>
                          {visibleEntries.map(({ key, label, value }) => (
                            <div
                              key={key}
                              className="crop-detail-summary-item">
                              <span className="summary-label">{label}</span>
                              <p className="summary-value">{value}</p>
                            </div>
                          ))}
                        </div>
                        {hasHidden && (
                          <button
                            type="button"
                            className="crop-detail-toggle"
                            onClick={() => toggleExpanded(detail.id)}
                            aria-expanded={isExpanded}>
                            {isExpanded
                              ? "কম দেখুন"
                              : `আরও দেখুন (${
                                  summaryEntries.length - visibleEntries.length
                                })`}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!filteredDetails.length && (
              <div className="crop-details-empty">
                <h4>কোনো তথ্য পাওয়া যায়নি</h4>
                <p>
                  অন্য কীওয়ার্ড ব্যবহার করুন বা ক্যাটাগরি পরিবর্তন করে আবার
                  চেষ্টা করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmDetail && (
        <div
          className="admin-modal-backdrop"
          role="presentation">
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-delete-title"
            aria-describedby="crop-delete-description">
            <div className="admin-modal-header">
              <h5
                id="crop-delete-title"
                className="mb-0">
                Remove crop detail?
              </h5>
            </div>
            <div
              id="crop-delete-description"
              className="admin-modal-body">
              <p className="mb-2">
                Are you sure you want to delete the entry for{" "}
                <strong>{confirmDetail.cropNameBn}</strong>?
              </p>
              <p className="text-muted mb-0">This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancelDelete}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleConfirmDelete}>
                Delete Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
