import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { addVideo } from "@/api/authApi";

export default function AddVideosPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const payload = useMemo(
    () => ({
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
      visibility: "public",
      source: videoUrl.trim()
        ? {
            type: "url",
            url: videoUrl.trim(),
          }
        : null,
    }),
    [title, description, videoUrl]
  );

  const validate = () => {
    if (!payload.title) return "Video title is required";
    if (!payload.source) return "Provide a video URL";
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
      const formData = new FormData();

      // Add video URL
      if (videoUrl.trim()) {
        formData.append("videoUrl", videoUrl.trim());
      }

      // Add metadata
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      const result = await addVideo(formData);
      toast.success("Video uploaded successfully!", { id: toastId });

      // Redirect to manage videos page after a short delay
      setTimeout(() => {
        window.location.href = "/admin/video/manage-videos";
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload video", { id: toastId });
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
                <li className="breadcrumb-item">
                  <NavLink to="/admin/video/manage-videos">Videos</NavLink>
                </li>
                <li className="breadcrumb-item active">Add Video</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
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
              </div>

              <div className="col-12">
                <div className="card card-outline card-dark">
                  <div className="card-body d-flex justify-content-center align-items-center video-submit-section">
                    <button type="submit" className="btn btn-primary btn-lg video-submit-btn" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Video"}
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
