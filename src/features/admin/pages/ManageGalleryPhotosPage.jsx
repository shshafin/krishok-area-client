import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../styles/adminScoped.css";
import SearchIcon from "@/assets/IconComponents/SearchIcon";

const INITIAL_BATCH = 10;
const LOAD_MORE_BATCH = 10;

const STATUS_LABEL = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

const STATUS_CLASS = {
  published: "badge badge-success",
  draft: "badge badge-warning",
  archived: "badge badge-secondary",
};

const TITLE_BANK = [
  "ডিম ফুটে সাদা রঙের অতিক্ষুদ্র বাচ্চা বের হয়ে পাতার খোল থেকে রস খেয়ে বড় হতে থাকে।",
  "Golden hour over the paddy fields",
  "Organic pest management in pumpkin rows",
  "Night irrigation with solar powered pump",
  "Pruned mango trees after the monsoon season",
  "Freshly stacked jute after river washing",
  "Seedling inspection before transplanting",
  "High-yield tomato variety trial plot",
];

const DESCRIPTION_BANK = [
  "Harvest-ready shoots after 90 days of consistent integrated pest management.",
  "Soil fertility survey highlights the effect of organic mulching and compost tea.",
  "Weekly monitoring keeps leaf miners under control without chemical spray.",
  "Community irrigation point balancing water usage across 5 adjoining plots.",
  "Capturing the growth stages for the upcoming farmer training material.",
  "Demonstration plot maintained by local volunteers for awareness sessions.",
  "Low-light photo captured to monitor disease spots forming overnight.",
  "Documentation for crop insurance verification and seasonal reporting.",
];

const TAG_BANK = [
  ["organic", "education"],
  ["training", "featured"],
  ["field-report"],
  ["best-practice", "crop-care"],
  ["night-shot", "irrigation"],
  ["community"],
  ["soil-health"],
  ["pest-alert"],
];

const ALBUM_BANK = ["Village Archive", "Training Deck", "Research Material", "Pest Alert Board"];
const UPLOADERS = ["Md. Mosarrof Hossain", "Rana Khan", "Konika Mk", "Shoriful Islam", "Torikul Islam"];

const BASE_TIME = new Date("2024-10-18T07:00:00Z").getTime();

const RAW_PHOTOS = Array.from({ length: 60 }, (_, index) => {
  const id = 160 - index;
  const createdAt = new Date(BASE_TIME - index * 36 * 60 * 60 * 1000); // subtract 36 hours per item
  const statusIndex = index % 9 === 0 ? "draft" : index % 14 === 0 ? "archived" : "published";
  return {
    id,
    title: TITLE_BANK[index % TITLE_BANK.length],
    description: DESCRIPTION_BANK[index % DESCRIPTION_BANK.length],
    imageUrl: `https://picsum.photos/seed/admin-gallery-${index}/720/480`,
    photoUrl: `GLY-${(1000 + id).toString(36).toUpperCase()}`,
    createdAt: createdAt.toISOString(),
    uploadedBy: UPLOADERS[index % UPLOADERS.length],
    tags: TAG_BANK[index % TAG_BANK.length],
    album: ALBUM_BANK[index % ALBUM_BANK.length],
    status: statusIndex,
    fileSizeKb: 480 + (index % 12) * 22,
  };
});

const STORAGE_KEY_PHOTOS = "admin.manageGallery.photos";

const normalizePhoto = (photo, index) => {
  if (!photo || typeof photo !== "object") return null;
  const tags = Array.isArray(photo.tags)
    ? photo.tags
    : String(photo.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  return {
    no: index + 1,
    id: photo.id ?? 0,
    title: photo.title ?? "",
    description: photo.description ?? "",
    imageUrl: photo.imageUrl ?? "",
    photoUrl: photo.photoUrl ?? "",
    createdAt: photo.createdAt ?? new Date().toISOString(),
    uploadedBy: photo.uploadedBy ?? "",
    tags,
    album: photo.album ?? "",
    status: photo.status ?? "published",
    fileSizeKb: photo.fileSizeKb ?? 0,
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

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }
  const time = timeFormatter.format(date);
  const formattedDate = dateFormatter.format(date).replace(/\//g, ", ");
  return `${time}  (${formattedDate})`;
}

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

export default function ManageGalleryPhotosPage() {
  const [photos, setPhotos] = useState(loadStoredPhotos);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(() => Math.min(INITIAL_BATCH, loadStoredPhotos().length));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    imageUrl: "",
    photoUrl: "",
    album: "",
    tags: "",
    status: "published",
  });
  const sentinelRef = useRef(null);
  const loadTimerRef = useRef();

  const debouncedSearch = useDebouncedValue(search, 300);

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
    if (!debouncedSearch.trim()) {
      return photos;
    }
    const term = debouncedSearch.trim().toLowerCase();
    return photos.filter((photo) => {
      return (
        photo.title.toLowerCase().includes(term) ||
        photo.description.toLowerCase().includes(term) ||
        photo.photoUrl.toLowerCase().includes(term) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        String(photo.id).includes(term) ||
        photo.album.toLowerCase().includes(term) ||
        photo.uploadedBy.toLowerCase().includes(term)
      );
    });
  }, [photos, debouncedSearch]);

  const slice = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  useEffect(() => {
    setVisible((prev) => {
      if (filtered.length === 0) return 0;
      if (!prev) return Math.min(INITIAL_BATCH, filtered.length);
      return Math.min(prev, filtered.length);
    });
  }, [filtered.length]);

  useEffect(() => {
    if (!sentinelRef.current) return undefined;
    const target = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || isLoadingMore || visible >= filtered.length) {
          return;
        }
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
      clearTimeout(loadTimerRef.current);
    };
  }, [filtered.length, isLoadingMore, visible]);

  useEffect(() => {
    if (!editing) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setEditing(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [editing]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setVisible(Math.min(INITIAL_BATCH, photos.length));
  };

  const handleDelete = useCallback(
    (photo) => {
      setPhotos((prev) => prev.filter((item) => item.id !== photo.id));
      toast.success(`Photo #${photo.id} removed`);
    },
    []
  );

  const handleEditStart = useCallback((photo) => {
    setEditing(photo);
    setFormState({
      title: photo.title,
      description: photo.description,
      imageUrl: photo.imageUrl,
      photoUrl: photo.photoUrl,
      album: photo.album,
      tags: photo.tags.join(", "),
      status: photo.status,
    });
  }, []);

  const handleModalClose = () => {
    setEditing(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!editing) return;
    const trimmedTitle = formState.title.trim();
    if (!trimmedTitle) {
      toast.error("Title cannot be empty.");
      return;
    }
    const toastId = toast.loading("Saving changes...");
    setPhotos((prev) =>
      prev.map((item) => {
        if (item.id !== editing.id) return item;
        return {
          ...item,
          title: trimmedTitle,
          description: formState.description.trim(),
          imageUrl: formState.imageUrl.trim() || item.imageUrl,
          photoUrl: formState.photoUrl.trim() || item.photoUrl,
          album: formState.album.trim() || item.album,
          tags: formState.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          status: formState.status,
        };
      })
    );
    toast.success(`Photo #${editing.id} updated`, { id: toastId });
    setEditing(null);
  };

  const handleRefresh = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setPhotos((prev) => [...prev].sort((a, b) => (a.id < b.id ? 1 : -1)));
          resolve();
        }, 350);
      }),
      {
        loading: "Refreshing gallery...",
        success: "Gallery data refreshed",
        error: "Unable to refresh gallery",
      }
    );
  };

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage All Gallery Photo</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/media/manage-gallery-photo">Gallery</a>
                </li>
                <li className="breadcrumb-item active">Manage</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="card w-100">
              <div className="card-header d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-md-between">
                <h3 className="card-title mb-0">Gallery Photos</h3>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <SearchIcon size={18} color="#64748b" />
                      </span>
                    </div>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search by title, id, tag or uploader"
                      value={search}
                      onChange={handleSearchChange}
                      aria-label="Search gallery photos"
                    />
                  </div>
                  <button type="button" className="btn btn-outline-secondary" onClick={handleRefresh}>
                    Refresh
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                  <div className="text-muted small">
                    Showing {slice.length} of {filtered.length} photo{filtered.length === 1 ? "" : "s"}
                  </div>
                  <div className="text-muted small">
                    Total records: {photos.length} | Matching search: {filtered.length}
                  </div>
                </div>

                {slice.map((photo) => (
                  <div className="photoditails-body" id={`deletediv_${photo.id}`} key={photo.id}>
                    <div className="photodetailsimg">
                      <div className="photoimgdetails">
                        <div className="photoimgbox">
                          <img src={photo.imageUrl} alt={photo.title} />
                        </div>
                        <div className="phototextbox">
                          <div className="fl photoqub">
                            <span></span>
                            <h5>
                              Photo_id : <span>[{photo.id}]</span>
                            </h5>
                          </div>
                          <div className="fl photoqub">
                            <span></span>
                            <h5>
                              Photo_url : <span>[{photo.photoUrl}]</span>
                            </h5>
                          </div>
                          <div className="fl photoqub">
                            <span></span>
                            <h5>
                              Time : <span>[{formatTimestamp(photo.createdAt)}]</span>
                            </h5>
                          </div>
                          <div className="fl photoqub">
                            <span></span>
                            <h5>
                              Uploaded By : <span className="depcolor">[{photo.uploadedBy}]</span>
                            </h5>
                          </div>
                          <div className="fl photoqub">
                            <span></span>
                            <h5>
                              Album : <span>[{photo.album}]</span>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div className="phototitlebox">
                        <h5>{photo.title}</h5>
                      </div>

                      <div className="photodetails-status-delete-edit">
                        <div className="edit-detete">
                          <button
                            className="adminphotoeditbtn btn btn-primary btn-block"
                            data-id={photo.id}
                            type="button"
                            onClick={() => handleEditStart(photo)}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="edit-detete">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-block"
                            onClick={() => handleDelete(photo)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="photodetailstext">
                      <div className="phototextdetails">
                        <div className="phototexts">
                          <span>Status</span>
                          <h5>
                            <span className={STATUS_CLASS[photo.status]}>{STATUS_LABEL[photo.status]}</span>
                          </h5>
                        </div>
                        <div className="phototexts">
                          <span>Photo_Description</span>
                          <h5>{photo.description}</h5>
                        </div>
                        <div className="phototexts">
                          <span>Tags</span>
                          <h5>{photo.tags.join(", ")}</h5>
                        </div>
                        <div className="phototexts">
                          <span>File Size</span>
                          <h5>{photo.fileSizeKb} KB</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="card mt-3">
                    <div className="card-body text-center text-muted py-5">No photos found for this search.</div>
                  </div>
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

      {editing && (
        <div id="photo-modal" style={{ display: "flex" }} onClick={handleModalClose}>
          <div
            id="photo-modal-form"
            className="newsizephotobox"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="edit-header">Edit Photo Box</h2>
            <form id="editFormData" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="photoTitle">Title</label>
                  <input
                    id="photoTitle"
                    name="title"
                    type="text"
                    className="form-control"
                    value={formState.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="photoStatus">Status</label>
                  <select
                    id="photoStatus"
                    name="status"
                    className="form-control"
                    value={formState.status}
                    onChange={handleFormChange}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="photoUrl">Photo URL</label>
                  <input
                    id="photoUrl"
                    name="photoUrl"
                    type="text"
                    className="form-control"
                    value={formState.photoUrl}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="imageUrl">Image Source</label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    className="form-control"
                    value={formState.imageUrl}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="album">Album</label>
                  <input
                    id="album"
                    name="album"
                    type="text"
                    className="form-control"
                    value={formState.album}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="tags">Tags</label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    className="form-control"
                    placeholder="Comma separated"
                    value={formState.tags}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="4"
                  value={formState.description}
                  onChange={handleFormChange}
                ></textarea>
              </div>
            </form>
            <div className="card-footer faa d-flex justify-content-between align-items-center">
              <button type="button" className="btn btn-outline-secondary" onClick={handleModalClose}>
                Cancel
              </button>
              <button type="submit" form="editFormData" id="editphotoid" className="btn btn-primary">
                Edit Photo
              </button>
            </div>
            <div id="photo-closebtn" role="button" tabIndex={0} onClick={handleModalClose}>
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
