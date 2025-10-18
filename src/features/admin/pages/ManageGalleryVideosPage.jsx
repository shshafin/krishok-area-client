import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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

const VIDEO_TITLES = [
  "New video is on team",
  "ডিম ফুটে সাদা রঙের অতিক্ষুদ্র বাচ্চা বের হয়ে পাতার খোল থেকে রস খেয়ে বড় হতে থাকে।",
  "Organic farming best practices workshop",
  "Night irrigation monitoring recap",
  "Community training on integrated pest management",
  "Field visit highlights – seedling health check",
  "Solar dryer prototype walkthrough",
  "Weekly crop scouting summary",
];

const VIDEO_DESCRIPTIONS = [
  "Video description",
  "Seasonal pest alert briefing with practical demonstrations.",
  "Highlights from the farmer meet-up on sustainable irrigation.",
  "Livestream replay covering updated fertilizer schedule insights.",
  "Quick recap for the upcoming community workshop materials.",
  "Sharing the outcomes from the district-wide harvest competition.",
  "Overview of the new greenhouse installation and initial tests.",
  "Step-by-step walkthrough of the updated data collection form.",
];

const VIDEO_SOURCES = [
  "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
  "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
  "https://storage.googleapis.com/coverr-main/mp4/Little_Girl.mp4",
  "https://storage.googleapis.com/coverr-main/mp4/Night_City.mp4",
  "https://storage.googleapis.com/coverr-main/mp4/Bat_Selfie.mp4",
];

const UPLOADERS = ["Md. Mosarrof Hossain", "Rana Khan", "Konika Mk", "Shoriful Islam", "Torikul Islam"];
const CATEGORIES = ["Training", "Field Report", "Spotlight", "Awareness", "Weekly Digest"];
const DURATIONS = ["02:48", "04:05", "03:12", "05:20", "06:42", "01:55", "07:18", "03:47"];

const BASE_TIME = new Date("2025-10-16T13:50:00Z").getTime();

const RAW_VIDEOS = Array.from({ length: 60 }, (_, index) => {
  const id = 130 - index;
  const createdAt = new Date(BASE_TIME - index * 42 * 60 * 60 * 1000); // subtract 42 hours
  const statusKey = index % 11 === 0 ? "draft" : index % 17 === 0 ? "archived" : "published";
  return {
    id,
    title: VIDEO_TITLES[index % VIDEO_TITLES.length],
    description: VIDEO_DESCRIPTIONS[index % VIDEO_DESCRIPTIONS.length],
    videoUrl: `vid-${(1000 + id).toString(36).toUpperCase()}`,
    source: VIDEO_SOURCES[index % VIDEO_SOURCES.length],
    createdAt: createdAt.toISOString(),
    uploadedBy: UPLOADERS[index % UPLOADERS.length],
    category: CATEGORIES[index % CATEGORIES.length],
    duration: DURATIONS[index % DURATIONS.length],
    status: statusKey,
    viewCount: 2000 + index * 17,
  };
});

const STORAGE_KEY_VIDEOS = "admin.manageGallery.videos";

const normalizeVideo = (video, index) => {
  if (!video || typeof video !== "object") return null;
  return {
    id: video.id ?? 0,
    title: video.title ?? "",
    description: video.description ?? "",
    videoUrl: video.videoUrl ?? "",
    source: video.source ?? "",
    createdAt: video.createdAt ?? new Date().toISOString(),
    uploadedBy: video.uploadedBy ?? "",
    category: video.category ?? "",
    duration: video.duration ?? "",
    status: video.status ?? "published",
    viewCount: Number.isFinite(video.viewCount) ? video.viewCount : 0,
    no: index + 1,
  };
};

const loadStoredVideos = () => {
  if (typeof window === "undefined") return RAW_VIDEOS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_VIDEOS);
    if (!raw) return RAW_VIDEOS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return RAW_VIDEOS;
    const normalized = parsed.map((item, index) => normalizeVideo(item, index)).filter(Boolean);
    return normalized.length ? normalized : RAW_VIDEOS;
  } catch (error) {
    console.warn("Failed to load stored gallery videos", error);
    return RAW_VIDEOS;
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
  if (Number.isNaN(date.getTime())) return "Unknown";
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

export default function ManageGalleryVideosPage() {
  const [videos, setVideos] = useState(loadStoredVideos);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(() => Math.min(INITIAL_BATCH, loadStoredVideos().length));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({
    videoUrl: "",
    title: "",
    description: "",
    source: "",
    status: "published",
    category: "",
  });

  const sentinelRef = useRef(null);
  const loadTimerRef = useRef();

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    try {
      window.localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
    } catch (error) {
      console.warn("Failed to persist gallery videos", error);
    }
    return undefined;
  }, [videos]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) {
      return videos;
    }
    return videos.filter((video) => {
      return (
        String(video.id).includes(term) ||
        video.title.toLowerCase().includes(term) ||
        video.description.toLowerCase().includes(term) ||
        video.videoUrl.toLowerCase().includes(term) ||
        video.category.toLowerCase().includes(term) ||
        video.uploadedBy.toLowerCase().includes(term)
      );
    });
  }, [videos, debouncedSearch]);

  const slice = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  useEffect(() => {
    setVisible((prev) => {
      if (filtered.length === 0) return 0;
      if (!prev) return Math.min(INITIAL_BATCH, filtered.length);
      return Math.min(prev, filtered.length);
    });
  }, [filtered.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return undefined;

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
        }, 300);
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(loadTimerRef.current);
    };
  }, [filtered.length, isLoadingMore, visible]);

  useEffect(() => {
    if (!editing) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setEditing(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setVisible(Math.min(INITIAL_BATCH, videos.length));
  };

  const handleDelete = useCallback((video) => {
    setVideos((prev) => prev.filter((item) => item.id !== video.id));
    toast.success(`Video #${video.id} deleted`);
  }, []);

  const handleEditStart = useCallback((video) => {
    setEditing(video);
    setFormState({
      videoUrl: video.videoUrl,
      title: video.title,
      description: video.description,
      source: video.source,
      status: video.status,
      category: video.category,
    });
  }, []);

  const handleModalClose = () => setEditing(null);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!editing) return;

    const trimmedTitle = formState.title.trim();
    const trimmedUrl = formState.videoUrl.trim();
    if (!trimmedTitle) {
      toast.error("Title cannot be empty.");
      return;
    }
    if (!trimmedUrl) {
      toast.error("Video identifier cannot be empty.");
      return;
    }

    const toastId = toast.loading("Saving changes...");
    setVideos((prev) =>
      prev.map((item) => {
        if (item.id !== editing.id) return item;
        return {
          ...item,
          title: trimmedTitle,
          description: formState.description.trim(),
          videoUrl: trimmedUrl,
          source: formState.source.trim() || item.source,
          status: formState.status,
          category: formState.category.trim() || item.category,
        };
      })
    );
    toast.success(`Video #${editing.id} updated`, { id: toastId });
    setEditing(null);
  };

  const handleRefresh = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setVideos((prev) => [...prev].sort((a, b) => (a.id < b.id ? 1 : -1)));
          resolve();
        }, 350);
      }),
      {
        loading: "Refreshing videos...",
        success: "Video list refreshed",
        error: "Unable to refresh list",
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
              <h1 className="m-0">Manage All Video</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/media/manage-video">Video</a>
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
                <h3 className="card-title mb-0">Gallery Videos</h3>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-search" aria-hidden="true"></i>
                      </span>
                    </div>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search by title, id, uploader or category"
                      value={search}
                      onChange={handleSearchChange}
                      aria-label="Search videos"
                    />
                  </div>
                  <button type="button" className="btn btn-outline-secondary" onClick={handleRefresh}>
                    Refresh
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 text-muted small">
                  <div>Showing {slice.length} of {filtered.length} video{filtered.length === 1 ? "" : "s"}</div>
                  <div>Total records: {videos.length} | Matching search: {filtered.length}</div>
                </div>

                {slice.map((video) => (
                  <div className="videoditails-body" id={`deletevdiv_${video.id}`} key={video.id}>
                    <div className="videodetailsimg">
                      <div className="videoimgdetails">
                        <div className="videoimgbox">
                          <video
                            width="100%"
                            height="100%"
                            controls
                            preload="metadata"
                            poster={`https://picsum.photos/seed/video-${video.id}/400/240`}
                          >
                            <source src={video.source} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <div className="videotextbox">
                          <div className="fl videoqub">
                            <span></span>
                            <h5>
                              Video_id : <span>[{video.id}]</span>
                            </h5>
                          </div>
                          <div className="fl videoqub">
                            <span></span>
                            <h5>
                              Video_url : <span>[{video.videoUrl}]</span>
                            </h5>
                          </div>
                          <div className="fl videoqub">
                            <span></span>
                            <h5>
                              Time : <span>[{formatTimestamp(video.createdAt)}]</span>
                            </h5>
                          </div>
                          <div className="fl videoqub">
                            <span></span>
                            <h5>
                              Uploaded By : <span className="depcolor">[{video.uploadedBy}]</span>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div className="videotitlebox">
                        <h5>{video.title}</h5>
                      </div>

                      <div className="videodetails-status-delete-edit">
                        <div className="edit-detete">
                          <button
                            className="adminvideoditbtn btn btn-primary btn-block"
                            data-eid={video.id}
                            type="button"
                            onClick={() => handleEditStart(video)}
                          >
                            Edit
                          </button>
                        </div>
                        <div className="edit-detete">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-block"
                            onClick={() => handleDelete(video)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="videodetailstext">
                      <div className="videotextdetails">
                        <div className="videotexts">
                          <span>Status</span>
                          <h5>
                            <span className={STATUS_CLASS[video.status]}>{STATUS_LABEL[video.status]}</span>
                          </h5>
                        </div>
                        <div className="videotexts">
                          <span>Video_Description</span>
                          <h5>{video.description}</h5>
                        </div>
                        <div className="videotexts">
                          <span>Category</span>
                          <h5>{video.category}</h5>
                        </div>
                        <div className="videotexts">
                          <span>Duration</span>
                          <h5>{video.duration}</h5>
                        </div>
                        <div className="videotexts">
                          <span>Views</span>
                          <h5>{video.viewCount.toLocaleString()}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="card mt-3">
                    <div className="card-body text-center text-muted py-5">No videos found for this search.</div>
                  </div>
                )}

                <div ref={sentinelRef} aria-hidden="true" />

                <div className="py-3 text-center text-muted">
                  {isLoadingMore && <span>Loading more videos...</span>}
                  {!isLoadingMore && visible >= filtered.length && filtered.length > 0 && (
                    <span>You reached the end of the list.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {editing && (
        <div id="photo-modal" style={{ display: "flex" }} onClick={handleModalClose}>
          <div id="photo-modal-form" onClick={(event) => event.stopPropagation()}>
            <h2 className="edit-header">Edit Video Box</h2>
            <form autoComplete="off" id="editFormData" onSubmit={handleFormSubmit}>
              <div className="card-body">
                <div className="display-flex flex-column flex-md-row gap-3">
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_video_url">
                      edit a New URL....
                      <br />
                      <span>{editing.videoUrl}</span>
                    </label>
                    <input
                      type="text"
                      id="edit_video_url"
                      name="videoUrl"
                      value={formState.videoUrl}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                    <input type="text" id="edit_video_id" hidden value={editing.id} readOnly className="form-control" />
                  </div>
                </div>

                <div className="display-flex flex-column flex-md-row gap-3">
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_video_title">edit a Video Title</label>
                    <input
                      type="text"
                      id="edit_video_title"
                      name="title"
                      value={formState.title}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_video_description">edit a Video Description</label>
                    <input
                      type="text"
                      id="edit_video_description"
                      name="description"
                      value={formState.description}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="display-flex flex-column flex-md-row gap-3">
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_video_source">edit a Video Source (MP4 URL)</label>
                    <input
                      type="text"
                      id="edit_video_source"
                      name="source"
                      value={formState.source}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_video_category">edit a Video Category</label>
                    <input
                      type="text"
                      id="edit_video_category"
                      name="category"
                      value={formState.category}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_video_status">Status</label>
                    <select
                      id="edit_video_status"
                      name="status"
                      value={formState.status}
                      onChange={handleFormChange}
                      className="form-control"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card-footer faa">
                <button type="submit" className="editvideoid btn btn-primary">
                  Edit Video
                </button>
              </div>
            </form>
            <div id="photo-closebtn" role="button" tabIndex={0} onClick={handleModalClose}>
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
