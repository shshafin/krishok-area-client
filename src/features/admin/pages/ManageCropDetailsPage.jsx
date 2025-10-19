import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/adminScoped.css";
import TrashCircleIcon from "@/assets/IconComponents/TrashCircleIcon";

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
    status: "draft",
    summary: {
      intro: "কচি পাতায় আঠালো স্রাব জমে গাছ দুর্বল হয়ে যাচ্ছে এবং চারা বৃদ্ধিও থেমে আছে।",
      extent: "সময়মতো ব্যবস্থা না নিলে ফলন ২০-২৫ শতাংশ পর্যন্ত কমে যেতে পারে।",
      caution: "সপ্তাহে দুই দিন করে স্কাউটিং করুন এবং গুরুতর আক্রান্ত লতা দ্রুত কেটে ফেলুন।",
      symptoms: "পাতা কুঁকড়ে যায়, রং ফ্যাকাসে হয় এবং নতুন লতা বিকাশ বন্ধ থাকে।",
      remedy: "নিম তেল ও সাবান মিশ্রণ স্প্রে করুন, প্রয়োজন হলে হালকা সিস্টেমিক কীটনাশক ব্যবহার করুন।",
    },
  },
  {
    id: 402,
    cropNameBn: "পেপে",
    cropNameEn: "Papaya",
    categoryName: "রোগবালাই",
    categoryTone: "info",
    headline: "পেপে ক্ষেত জুড়ে মোজাইক ভাইরাস",
    heroImage:
      "https://images.unsplash.com/photo-1439122954014-111107a16f65?auto=format&fit=crop&w=900&q=80",
    status: "published",
    summary: {
      intro: "পাতায় সবুজ-হলুদের অসমান দাগ এবং পাতার টিস্যু মোটা হয়ে যাচ্ছে।",
      extent: "প্রথম ফুল আসার আগেই হলে ফলন ৫০ শতাংশ পর্যন্ত কমে যেতে পারে।",
      caution: "পরিচ্ছন্ন যন্ত্রপাতি ব্যবহার করুন এবং আশপাশের অবাঞ্ছিত পেপে গাছ তুলে ফেলুন।",
      symptoms: "পাতার শিরার মাঝে হলুদ দাগ, পাতার প্রান্ত গুটিয়ে যায় এবং কচি ডাল ভঙ্গুর হয়।",
      remedy: "সংক্রমিত গাছ তুলে ফেলুন, ভেক্টর দমন জোরদার করুন এবং সহনশীল জাতের চারা লাগান।",
    },
  },
  {
    id: 403,
    cropNameBn: "টমেটো",
    cropNameEn: "Tomato",
    categoryName: "পুষ্টি ঘাটতি",
    categoryTone: "warning",
    headline: "টানেল হাউসে ব্লসম এন্ড রট",
    heroImage:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80",
    status: "draft",
    summary: {
      intro: "ফার্টিগেশনের অনিয়মে ক্যালসিয়াম গ্রহণ ব্যাহত হয়েছে এবং ফলের ডগা শুকিয়ে যাচ্ছে।",
      extent: "দ্রুত ক্ষতিগ্রস্ত ফল সরালে ক্ষতি ১৫ শতাংশের মধ্যে রাখা সম্ভব।",
      caution: "সমান বিরতিতে সেচ দিন এবং লাইনে জমে থাকা লবণ ধুয়ে ফেলুন।",
      symptoms: "ফলের ডগায় কালো শক্ত দাগ, বাকিটা স্বাভাবিক থাকে।",
      remedy: "পাতায় ক্যালসিয়াম নাইট্রেট স্প্রে করুন এবং মাটির আর্দ্রতা স্থিতিশীল রাখুন।",
    },
  },
  {
    id: 404,
    cropNameBn: "ধান",
    cropNameEn: "Rice",
    categoryName: "রোগবালাই",
    categoryTone: "info",
    headline: "ধানের ব্লাস্ট দ্রুত ছড়িয়ে পড়ছে",
    heroImage:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80",
    status: "published",
    summary: {
      intro: "ঠান্ডা ও মেঘলা আবহাওয়ায় পাতায় চওড়া ধূসর দাগ তৈরি হচ্ছে।",
      extent: "আগের মৌসুমে একই রোগে পাশের ব্লকের অর্ধেক ফলন নষ্ট হয়েছিল।",
      caution: "অতিরিক্ত ইউরিয়া ব্যবহার করবেন না এবং সেচের পর জমি ২৪ ঘণ্টা শুকনো রাখুন।",
      symptoms: "পাতায় চওড়া দাগ পরে গলায় পৌঁছে শিষে আক্রমণ করে।",
      remedy: "ট্রাইসাইক্লাজল ৭ দিনের ব্যবধানে দুবার স্প্রে করুন।",
    },
  },
  {
    id: 405,
    cropNameBn: "শিম",
    cropNameEn: "Yardlong Bean",
    categoryName: "ক্ষতিকর পোকামাকড়",
    categoryTone: "danger",
    headline: "কোঁচে ভিতর পচা পোকার দাপট",
    heroImage:
      "https://images.unsplash.com/photo-1438465313278-7806831dcd6a?auto=format&fit=crop&w=900&q=80",
    status: "draft",
    summary: {
      intro: "পোকার লার্ভা কোঁচের ভিতর ঢুকে বীজ খেয়ে ফেলছে এবং কোঁচ বিকৃত হচ্ছে।",
      extent: "দুই সপ্তাহেই বাজারযোগ্য কোঁচের ৩০ শতাংশ ক্ষতি হতে পারে।",
      caution: "ফেরোমোন ফাঁদ বসান এবং ভোরে আক্রান্ত কোঁচ সংগ্রহ করে নষ্ট করুন।",
      symptoms: "কোঁচে ছোট গর্ত, ভিতরে লার্ভা ও বিষ্ঠা দেখা যায়।",
      remedy: "ট্রাইকোগ্রামা কার্ড ছাড়ুন এবং নির্বাচিত কীটনাশক পর্যায়ক্রমে ব্যবহার করুন।",
    },
  },
  {
    id: 406,
    cropNameBn: "মরিচ",
    cropNameEn: "Chili",
    categoryName: "ক্ষতিকর পোকামাকড়",
    categoryTone: "danger",
    headline: "থ্রিপসের কারণে মরিচের গায়ে দাগ",
    heroImage:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80&sat=-20",
    status: "archived",
    summary: {
      intro: "পার্শ্ববর্তী বাগান পরিষ্কার করার পর থ্রিপস মরিচ ক্ষেতে ঢুকেছে।",
      extent: "আক্রান্ত মরিচের চকচকে ভাব নষ্ট হয়ে বাজারমূল্য কমে যায়।",
      caution: "নীল স্টিকি ট্র্যাপ বাড়ান এবং জমির চারপাশে আগাছা মুক্ত রাখুন।",
      symptoms: "ফলে রুপালি দাগ, ফুল ঝরে পড়া এবং কচি ডাল শুকিয়ে যাওয়া।",
      remedy: "স্পিনোসাড ও ইমামেকটিন পর্যায়ক্রমে স্প্রে করুন, সূর্যোদয়ের আগে প্রয়োগ করুন।",
    },
  },
];

const STATUS_VARIANTS = {
  published: { label: "Published", tone: "success" },
  draft: { label: "Draft", tone: "warning" },
  archived: { label: "Archived", tone: "muted" },
};

const normalizeCropDetail = (detail, index) => {
  if (!detail || typeof detail !== "object") {
    return null;
  }
  const status = STATUS_VARIANTS[detail.status] ? detail.status : "draft";
  return {
    id: detail.id ?? index + 1,
    cropNameBn: detail.cropNameBn ?? "",
    cropNameEn: detail.cropNameEn ?? "",
    categoryName: detail.categoryName ?? "",
    categoryTone: detail.categoryTone ?? "info",
    headline: detail.headline ?? "",
    heroImage: detail.heroImage ?? "https://picsum.photos/seed/crop/640/480",
    status,
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
    RAW_CROP_DETAILS.map((detail, index) => normalizeCropDetail(detail, index)).filter(Boolean)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [removing, setRemoving] = useState({});
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

  const handleDelete = (detail) => {
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

  const formatStatus = (status) => STATUS_VARIANTS[status] ?? STATUS_VARIANTS.draft;

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
    <div className="content-wrapper _scoped_admin manage-crop-details-page" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">ফসলের তথ্য ব্যবস্থাপনা</h1>
              <p className="text-muted mt-1 mb-0">
                মাঠ পর্যায়ে শনাক্ত করা সমস্যাগুলো এক জায়গায় রাখুন এবং অগ্রগতি পর্যবেক্ষণ করুন।
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
                <span className="crop-details-total">মোট এন্ট্রি: {cropDetails.length}</span>
                <span className="crop-details-visible">দেখানো হচ্ছে: {filteredDetails.length}</span>
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
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="crop-details-grid">
              {filteredDetails.map((detail) => {
                const statusInfo = formatStatus(detail.status);
                const isExpanded = expandedIds.has(detail.id);
                const summaryEntries = SUMMARY_ORDER.map(({ key, label }) => {
                  const value = detail.summary[key];
                  if (!value) return null;
                  return { key, label, value };
                }).filter(Boolean);
                const hasHidden = summaryEntries.length > 2;
                const visibleEntries = isExpanded || !hasHidden ? summaryEntries : summaryEntries.slice(0, 2);
                return (
                  <article
                    key={detail.id}
                    className={`crop-detail-card ${removing[detail.id] ? "is-removing" : ""}`}
                  >
                    <button
                      type="button"
                      className="crop-detail-delete-icon"
                      onClick={() => handleDelete(detail)}
                      disabled={Boolean(removing[detail.id])}
                      title="তথ্য মুছে ফেলুন"
                      aria-label={`${detail.cropNameBn} সম্পর্কে তথ্য মুছে ফেলুন`}
                    >
                      <TrashCircleIcon size={20} />
                    </button>
                    <div className="crop-detail-media">
                      <img src={detail.heroImage} alt={`${detail.cropNameBn} ফসলের ছবি`} />
                      <span className={`crop-detail-category badge-${detail.categoryTone}`}>
                        {detail.categoryName}
                      </span>
                      <span className={`crop-detail-status badge-${statusInfo.tone}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="crop-detail-body">
                      <div className="crop-detail-header">
                        <div>
                          <h3 className="crop-detail-title">{detail.headline}</h3>
                          <p className="crop-detail-meta">
                            <span>{detail.cropNameBn}</span>
                            <span className="divider" aria-hidden="true">
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
                          }`}
                        >
                          {visibleEntries.map(({ key, label, value }) => (
                            <div key={key} className="crop-detail-summary-item">
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
                            aria-expanded={isExpanded}
                          >
                            {isExpanded
                              ? "কম দেখুন"
                              : `আরও দেখুন (${summaryEntries.length - visibleEntries.length})`}
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
                <p>অন্য কীওয়ার্ড ব্যবহার করুন বা ক্যাটাগরি পরিবর্তন করে আবার চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
