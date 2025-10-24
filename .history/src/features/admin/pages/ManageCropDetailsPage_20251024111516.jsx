import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/adminScoped.css";
import TrashIcon from "@/assets/IconComponents/Trash";
import {
  fetchAllCropDetails,
  editCropDetails,
  deleteCropDetails,
} from "@/api/authApi";
import { baseApi } from "../../../api";

const SUMMARY_ORDER = [
  { key: "rogLokkho", label: "রোগের লক্ষণ" },
  { key: "koroniyo", label: "করণীয়" },
];

export default function ManageCropDetailsPage() {
  const [cropDetails, setCropDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const [confirmDetail, setConfirmDetail] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  // ✅ Fetch all crop details
  useEffect(() => {
    const loadCropDetails = async () => {
      try {
        setLoading(true);
        const res = await fetchAllCropDetails();
        if (res?.success) {
          setCropDetails(res.data);
        } else {
          toast.error("Failed to load crop details");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading crop details");
      } finally {
        setLoading(false);
      }
    };
    loadCropDetails();
  }, []);

  // ✅ Filter list
  const categories = useMemo(() => {
    const list = Array.from(
      new Set(
        cropDetails.map((detail) => detail.category?.banglaName).filter(Boolean)
      )
    );
    return list;
  }, [cropDetails]);

  const filteredDetails = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return cropDetails.filter((detail) => {
      const matchesCategory =
        categoryFilter === "all" ||
        detail.category?.banglaName?.toLowerCase() ===
          categoryFilter.toLowerCase();

      if (!matchesCategory) return false;
      if (!term) return true;

      return (
        detail.cropTitle?.toLowerCase().includes(term) ||
        detail.rogLokkho?.toLowerCase().includes(term) ||
        detail.koroniyo?.toLowerCase().includes(term) ||
        detail.category?.banglaName?.toLowerCase().includes(term)
      );
    });
  }, [cropDetails, searchTerm, categoryFilter]);

  // ✅ Delete
  const handleConfirmDelete = async () => {
    if (!confirmDetail) return;
    const id = confirmDetail._id;
    setConfirmDetail(null);
    try {
      const res = await deleteCropDetails(id);
      if (res?.success) {
        setCropDetails((prev) => prev.filter((item) => item._id !== id));
        toast.success("ফসলের তথ্য মুছে ফেলা হয়েছে");
      } else {
        toast.error("মুছে ফেলা ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি ঘটেছে");
    }
  };

  // ✅ Expand toggle
  // const toggleExpanded = (id) => {
  //   setExpandedIds((prev) => {
  //     const next = new Set(prev);
  //     next.has(id) ? next.delete(id) : next.add(id);
  //     return next;
  //   });
  // };

  if (loading) {
    return (
      <div className="content-wrapper _scoped_admin">
        <div className="p-5 text-center text-muted">
          Loading crop details...
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper _scoped_admin manage-crop-details-page">
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">ফসলের তথ্য ব্যবস্থাপনা</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">ড্যাশবোর্ড</NavLink>
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
                <span>মোট এন্ট্রি: {cropDetails.length}</span>
                <span>দেখানো হচ্ছে: {filteredDetails.length}</span>
              </div>
              <div className="crop-details-controls">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ফসল, ক্যাটাগরি বা শিরোনাম দিয়ে খুঁজুন..."
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}>
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

            <div className="crop-details-grid">
              {filteredDetails.map((detail) => {
                const isExpanded = expandedIds.has(detail._id);
                return (
                  <article
                    key={detail._id}
                    className={`crop-detail-card ${
                      removing[detail._id] ? "is-removing" : ""
                    }`}>
                    <button
                      className="crop-detail-delete-icon"
                      onClick={() => setConfirmDetail(detail)}
                      disabled={Boolean(removing[detail._id])}>
                      <TrashIcon
                        width={20}
                        height={20}
                        strokeWidth={1.8}
                      />
                    </button>
                    <div className="crop-detail-media">
                      {/* <img
                        src={detail.cropImage}
                        alt={detail.cropTitle}
                        loading="lazy"
                      /> */}
                      <img
                        src={
                          detail.cropImage
                            ? detail.cropImage.startsWith("http")
                              ? detail.cropImage
                              : `${baseApi}${detail.cropImage}`
                            : "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png"
                        }
                        alt={detail.cropTitle || "Crop Detail image"}
                        loading="lazy"
                      />
                      <span className="badge badge-info">
                        {detail.category?.banglaName || "N/A"}
                      </span>
                    </div>
                    <div className="crop-detail-body">
                      <h3>{detail.cropTitle}</h3>
                      <div className="crop-detail-summary">
                        {SUMMARY_ORDER.map(({ key, label }) => (
                          <div key={key}>
                            <strong>{label}:</strong>{" "}
                            <p>{detail[key] || "N/A"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!filteredDetails.length && (
              <div className="text-center text-muted p-5">
                কোনো তথ্য পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmDetail && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h5>ফসলের তথ্য মুছে ফেলতে চাও?</h5>
            </div>
            <div className="admin-modal-body">
              <p>
                <strong>{confirmDetail.cropTitle}</strong> সম্পর্কিত তথ্য
                স্থায়ীভাবে মুছে যাবে।
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setConfirmDetail(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
