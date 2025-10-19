import React, { useCallback, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const fakeUpload = (payload) =>
  new Promise((resolve, reject) => {
    const ms = 800 + Math.random() * 900;
    setTimeout(() => {
      if (Math.random() < 0.15) reject(new Error("Network error. Try again."));
      else resolve({ ok: true, id: Math.random().toString(36).slice(2) });
    }, ms);
  });

export default function AddPhotosPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const fileInputRef = useRef(null);

  const onPickFiles = () => fileInputRef.current?.click();

  const onFilesSelected = useCallback(
    (event) => {
      const list = Array.from(event.target.files || []);
      if (!list.length) return;
      const existing = new Set(files.map((f) => f.name + f.size + f.lastModified));
      const next = list.filter((f) => !existing.has(f.name + f.size + f.lastModified));
      setFiles((prev) => [...prev, ...next]);
      event.target.value = "";
    },
    [files]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const list = Array.from(event.dataTransfer.files || []);
      if (!list.length) return;
      const existing = new Set(files.map((f) => f.name + f.size + f.lastModified));
      const next = list.filter((f) => f.type.startsWith("image/") && !existing.has(f.name + f.size + f.lastModified));
      setFiles((prev) => [...prev, ...next]);
    },
    [files]
  );

  const removeFile = (idx) =>
    setFiles((prev) => prev.filter((_, index) => index !== idx));

  const payload = useMemo(
    () => ({
      title: title.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      visibility: isPublic ? "public" : "private",
      images: files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    }),
    [title, description, tags, isPublic, files]
  );

  const validate = () => {
    if (!payload.title) return "Title is required";
    if (files.length === 0) return "Please add at least one image";
    const tooBig = files.find((f) => f.size > 10 * 1024 * 1024);
    if (tooBig) return `File "${tooBig.name}" is larger than 10MB`;
    return null;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading("Uploading photos...");
    try {
      const res = await fakeUpload(payload);
      setLastSubmitted({ id: res.id, ...payload });
      toast.success("Upload complete!", { id: toastId });
      setTitle("");
      setDescription("");
      setTags("");
      setIsPublic(true);
      setFiles([]);
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
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
              <h1 className="m-0">Add Photos</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/media/manage-gallery-photo">Gallery</a>
                </li>
                <li className="breadcrumb-item active">Add Photos</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="col-lg-8">
                <div className="card card-outline card-primary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Photo Details</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="title">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          id="title"
                          type="text"
                          className="form-control"
                          placeholder="e.g., Summer Road Trip"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={120}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="tags">Tags</label>
                        <input
                          id="tags"
                          type="text"
                          className="form-control"
                          placeholder="comma,separated,tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        className="form-control"
                        rows={4}
                        placeholder="Write a short description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    {/* TODO: Commenting out Make as publick Gallery */}
                    {/* <div className="custom-control custom-switch mb-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <label className="custom-control-label" htmlFor="isPublic">
                        Make album public
                      </label>
                    </div> */}
                  </div>
                </div>

                <div className="card card-outline card-info mb-3">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">Upload Images</h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={onPickFiles}
                    >
                      Browse files
                    </button>
                  </div>
                  <div
                    className="card-body text-center border border-secondary border-dashed rounded"
                    style={{ padding: "2rem" }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={onDrop}
                  >
                    <p className="font-weight-bold mb-1">Drag & drop images here</p>
                    <p className="text-muted mb-3">PNG, JPG up to 10MB each</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="d-none"
                      onChange={onFilesSelected}
                    />
                    {files.length === 0 && (
                      <div className="text-muted">No files selected yet.</div>
                    )}
                    {files.length > 0 && (
                      <div className="row mt-4">
                        {files.map((file, idx) => (
                          <div className="col-md-6 col-lg-4 mb-3" key={file.name + idx}>
                            <div className="border rounded p-2 h-100 d-flex flex-column">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="img-fluid rounded mb-2"
                                onLoad={(event) => URL.revokeObjectURL(event.currentTarget.src)}
                              />
                              <div className="text-left small flex-grow-1">
                                <p className="mb-1 font-weight-bold text-truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-muted mb-2">
                                  {(file.size / 1024).toFixed(0)} KB
                                </p>
                              </div>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm btn-outline-danger mt-auto"
                                onClick={() => removeFile(idx)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card card-outline card-secondary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Submission Preview</h3>
                  </div>
                  <div className="card-body" style={{ maxHeight: 380, overflowY: "auto" }}>
                    <pre className="small mb-0">
{JSON.stringify(lastSubmitted ?? payload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="card card-outline card-success">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setTitle("");
                        setDescription("");
                        setTags("");
                        setIsPublic(true);
                        setFiles([]);
                      }}
                      disabled={submitting}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
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
