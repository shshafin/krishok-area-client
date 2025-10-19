import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/adminScoped.css";
import SearchIcon from "@/assets/IconComponents/SearchIcon";
import DeleteBadgeIcon from "@/assets/IconComponents/DeleteBadgeIcon";

const INITIAL_BATCH = 12;
const LOAD_MORE_BATCH = 12;

const DESCRIPTION_BANK = [
  "Harvest-ready shoots after 90 days of integrated pest management.",
  "Evening golden hour over the paddy fields before irrigation.",
  "Weekly monitoring keeps leaf miners under control without spray.",
  "Community irrigation point balancing water usage across plots.",
  "Capturing growth stages for the farmer training module.",
  "Demonstration plot maintained by local volunteers.",
  "Low-light photo to monitor disease spots forming overnight.",
  "Documentation for crop insurance verification this season.",
];

const UPLOADERS = ["Md. Mosarrof Hossain", "Rana Khan", "Konika Mk", "Shoriful Islam", "Torikul Islam"];
const BASE_TIME = new Date("2024-10-18T07:00:00Z").getTime();

const RAW_PHOTOS = Array.from({ length: 60 }, (_, index) => {
  const id = 180 - index;
  const createdAt = new Date(BASE_TIME - index * 36 * 60 * 60 * 1000);
  return {
    id,
    description: DESCRIPTION_BANK[index % DESCRIPTION_BANK.length],
    imageUrl: `https://picsum.photos/seed/admin-gallery-${index}/720/480`,
    createdAt: createdAt.toISOString(),
    uploadedBy: UPLOADERS[index % UPLOADERS.length],
  };
});

const STORAGE_KEY_PHOTOS = "admin.manageGallery.photos";

const normalizePhoto = (photo, index) => {
  if (!photo || typeof photo !== "object") return null;
  return {
    id: photo.id ?? index + 1,
    description: photo.description ?? "",
    imageUrl: photo.imageUrl ?? "",
    createdAt: photo.createdAt ?? new Date().toISOString(),
    uploadedBy: photo.uploadedBy ?? "",
  };
};

const loadStoredPhotos = () => {
  if (typeof window === "undefined") return RAW_PHOTOS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PHOTOS);
    if (!raw) return RAW_PHOTOS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return RAW_PHOTOS;
    const normalized = parsed.map((item, index) => normalizePhoto(item, index)).filter(Boolean);
    return normalized.length ? normalized : RAW_PHOTOS;
  } catch (error) {
    console.warn("Failed to load stored gallery photos", error);
    return RAW_PHOTOS;
  }
};

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown";
  const time = timeFormatter.format(date);
  const formattedDate = dateFormatter.format(date).replace(/\//g, ", ");
  return `${time} (${formattedDate})`;
};

const useDebouncedValue = (value, delay) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
};

export default function ManageGalleryPhotosPage() {
  const [photos, setPhotos] = useState(loadStoredPhotos);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(() => Math.min(INITIAL_BATCH, loadStoredPhotos().length));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [removing, setRemoving] = useState({});
  const [confirmPhoto, setConfirmPhoto] = useState(null);

  const sentinelRef = useRef(null);
  const loadTimerRef = useRef();
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    try {
      window.localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
    } catch (error) {
      console.warn("Failed to persist gallery photos", error);
    }
    return undefined;
  }, [photos]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return photos;
    return photos.filter((photo) => {
      return (
        photo.description.toLowerCase().includes(term) ||
        photo.uploadedBy.toLowerCase().includes(term) ||
        String(photo.id).includes(term)
      );
    });
  }, [photos, debouncedSearch]);

  const slice = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  useEffect(() => {
    if (!filtered.length) {
      setVisible(0);
      return;
    }
    setVisible((prev) => {
      if (!prev) return Math.min(INITIAL_BATCH, filtered.length);
      return Math.min(prev, filtered.length);
    });
  }, [filtered.length]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || isLoadingMore || visible >= filtered.length) return;
        setIsLoadingMore(true);
        loadTimerRef.current = setTimeout(() => {
          setVisible((prev) => Math.min(prev + LOAD_MORE_BATCH, filtered.length));
          setIsLoadingMore(false);
        }, 280);
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
    };
  }, [filtered.length, isLoadingMore, visible]);

  useEffect(
    () => () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
    },
    []
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setVisible((prev) => (prev ? Math.min(prev, photos.length) : Math.min(INITIAL_BATCH, photos.length)));
  };

  const removePhoto = useCallback((photo) => {
    setRemoving((prev) => ({ ...prev, [photo.id]: true }));
    setTimeout(() => {
      setPhotos((prev) => prev.filter((item) => item.id !== photo.id));
      setRemoving((prev) => {
        const next = { ...prev };
        delete next[photo.id];
        return next;
      });
      toast.success(`Photo #${photo.id} deleted`);
    }, 240);
  }, []);

  const handleDelete = useCallback((photo) => {
    setConfirmPhoto(photo);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmPhoto) {
      removePhoto(confirmPhoto);
      setConfirmPhoto(null);
    }
  }, [confirmPhoto, removePhoto]);

  const handleCancelDelete = useCallback(() => {
    setConfirmPhoto(null);
  }, []);

  const totalCount = filtered.length;
  const showingCount = slice.length;
  const remainingCount = Math.max(totalCount - showingCount, 0);

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Gallery Photos</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                </li>
                <li className="breadcrumb-item active">Gallery</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="card w-100">
              <div className="card-header d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-lg-between">
                <div className="gallery-status d-flex flex-column gap-2">
                  <h3 className="card-title mb-0">Gallery Photos</h3>
                  <div className="manage-gallery-summary">
                    <span className="manage-gallery-chip manage-gallery-chip--visible">
                      Visible {showingCount}
                    </span>
                    <span className="manage-gallery-chip manage-gallery-chip--total">
                      Total {totalCount}
                    </span>
                    <span className="manage-gallery-chip manage-gallery-chip--remaining">
                      Remaining {remainingCount}
                    </span>
                  </div>
                </div>
                <div className="manage-gallery-search input-group" style={{ maxWidth: 360 }}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <SearchIcon size={18} color="#64748b" />
                    </span>
                  </div>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search description, uploader or id"
                    value={search}
                    onChange={handleSearchChange}
                    aria-label="Search gallery photos"
                  />
                </div>
              </div>

              <div className="card-body">
                {slice.length > 0 ? (
                  <div className="manage-gallery-grid">
                    {slice.map((photo) => (
                      <article
                        key={photo.id}
                        className={`manage-gallery-card ${removing[photo.id] ? "is-removing" : ""}`}
                      >
                        <div className="manage-gallery-thumb">
                          <img src={photo.imageUrl} alt={`Gallery photo ${photo.id}`} />
                        </div>
                        <div className="manage-gallery-body">
                          <p className="manage-gallery-description">{photo.description}</p>
                        </div>
                        <footer className="manage-gallery-footer">
                          <div className="manage-gallery-info">
                            <span className="manage-gallery-time">{formatTimestamp(photo.createdAt)}</span>
                          </div>
                          <div className="manage-gallery-actions">
                            <button
                              type="button"
                              className="admin-icon-btn admin-icon-btn--delete manage-gallery-delete"
                              onClick={() => handleDelete(photo)}
                              aria-label={`Delete photo ${photo.id}`}
                            >
                              <DeleteBadgeIcon size={28} />
                            </button>
                          </div>
                        </footer>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-5">No photos found.</div>
                )}

                <div ref={sentinelRef} aria-hidden="true" />

                <div className="py-3 text-center text-muted">
                  {isLoadingMore && <span>Loading more photos...</span>}
                  {!isLoadingMore && visible >= filtered.length && filtered.length > 0 && (
                    <span>You reached the end of the gallery.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {confirmPhoto && (
        <div className="admin-modal-backdrop" role="presentation">
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-delete-title"
            aria-describedby="gallery-delete-description"
          >
            <div className="admin-modal-header">
              <h5 id="gallery-delete-title" className="mb-0">
                Delete photo?
              </h5>
            </div>
            <div id="gallery-delete-description" className="admin-modal-body">
              <p className="mb-2">
                Are you sure you want to remove this photo uploaded by{" "}
                <strong>{confirmPhoto.uploadedBy}</strong>?
              </p>
              <p className="text-muted mb-0">This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={handleConfirmDelete}>
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
