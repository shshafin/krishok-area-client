import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const fakeUpload = (payload) =>
  new Promise((resolve, reject) => {
    const ms = 900 + Math.random() * 900;
    setTimeout(() => {
      if (Math.random() < 0.15) reject(new Error("Network error. Try again."));
      else resolve({ ok: true, id: Math.random().toString(36).slice(2) });
    }, ms);
  });

const MAX_VIDEO_SIZE = 250 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function AddVideosPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const videoPreview = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : ""), [videoFile]);
  const thumbPreview = useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ""),
    [thumbnailFile]
  );

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    };
  }, [videoPreview, thumbPreview]);

  const resetForm = () => {
    setVideoUrl("");
    setVideoFile(null);
    setThumbnailFile(null);
    setTitle("");
    setDescription("");
    setLastSubmitted(null);
  };

  const payload = useMemo(
    () => ({
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
      visibility: "public",
      source: videoFile
        ? {
            type: "upload",
            name: videoFile.name,
            size: videoFile.size,
            mime: videoFile.type,
          }
        : videoUrl.trim()
        ? {
            type: "url",
            url: videoUrl.trim(),
          }
        : null,
      thumbnail: thumbnailFile
        ? {
            name: thumbnailFile.name,
            size: thumbnailFile.size,
            mime: thumbnailFile.type,
          }
        : null,
    }),
    [title, description, videoUrl, videoFile, thumbnailFile]
  );

  const validate = () => {
    if (!payload.title) return "Video title is required";
    if (!payload.source) return "Provide a video file or URL";
    if (videoFile && videoFile.size > MAX_VIDEO_SIZE) {
      return `Video "${videoFile.name}" exceeds ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB`;
    }
    if (thumbnailFile && thumbnailFile.size > MAX_IMAGE_SIZE) {
      return `Thumbnail "${thumbnailFile.name}" exceeds ${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB`;
    }
    if (payload.source?.type === "url" && !/^https?:\/\//i.test(payload.source.url)) {
      return "Video URL must start with http or https";
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading("Uploading video...");
    try {
      const result = await fakeUpload(payload);
      setLastSubmitted({ id: result.id, ...payload });
      toast.success("Video uploaded!", { id: toastId });
      resetForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Add Videos</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                </li>
                <li className="breadcrumb-item active">Add Videos</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-8">
                <div className="card card-outline card-primary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Video Source</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="videoUrl">Video URL</label>
                      <input
                        id="videoUrl"
                        type="url"
                        className="form-control"
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(event) => setVideoUrl(event.target.value)}
                      />
                      <small className="form-text text-muted">
                        Paste a public video link (YouTube, Vimeo, etc.).
                      </small>
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="videoFile">Upload Video</label>
                      <div className="custom-file">
                        <input
                          ref={videoInputRef}
                          id="videoFile"
                          type="file"
                          accept="video/*"
                          className="custom-file-input"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setVideoFile(file || null);
                            if (event.target.value) {
                              event.target.blur();
                            }
                          }}
                        />
                        <label className="custom-file-label" htmlFor="videoFile">
                          {videoFile ? videoFile.name : "Choose video file"}
                        </label>
                      </div>
                      <small className="form-text text-muted">
                        MP4, MOV, MKV up to {Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB.
                      </small>
                    </div>
                    {videoPreview && (
                      <div className="mt-3">
                        <video
                          src={videoPreview}
                          controls
                          className="w-100 rounded"
                          style={{ maxHeight: 240 }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="card card-outline card-info mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Video Details</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="videoTitle">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        id="videoTitle"
                        type="text"
                        className="form-control"
                        placeholder="Enter video title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="videoDescription">Description</label>
                      <textarea
                        id="videoDescription"
                        className="form-control"
                        rows={4}
                        placeholder="Enter video description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-success mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Thumbnail</h3>
                  </div>
                  <div className="card-body">
                    <div className="custom-file mb-3">
                      <input
                        ref={thumbInputRef}
                        id="thumbnailFile"
                        type="file"
                        accept="image/*"
                        className="custom-file-input"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setThumbnailFile(file || null);
                          if (event.target.value) {
                            event.target.blur();
                          }
                        }}
                      />
                      <label className="custom-file-label" htmlFor="thumbnailFile">
                        {thumbnailFile ? thumbnailFile.name : "Choose thumbnail image"}
                      </label>
                    </div>
                    {thumbPreview && (
                      <img
                        src={thumbPreview}
                        alt="Video thumbnail preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: 220 }}
                      />
                    )}
                    {!thumbPreview && (
                      <p className="text-muted mb-0">
                        Optional. Recommended size 1280x720px (JPG or PNG).
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card card-outline card-secondary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Submission Preview</h3>
                  </div>
                  <div className="card-body" style={{ maxHeight: 400, overflowY: "auto" }}>
                    <pre className="small mb-0">
{JSON.stringify(lastSubmitted ?? payload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="card card-outline card-dark">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                      disabled={submitting}
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
