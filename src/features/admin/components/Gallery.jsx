import { useState,useRef } from "react";
import styles from "../styles/gallery.module.css";
import toast from "react-hot-toast";

const AdminGallery = () => {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const accept = "image/*,video/*";

  const pickFile = () => inputRef.current?.click();

  const applyFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setPreviewURL(URL.createObjectURL(f));
  };

  const onFileChange = (e) => applyFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    applyFile(e.dataTransfer.files?.[0]);
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please add an image or video first.");

    setUploading(true);
    setProgress(0);

    toast.success("Done")

    // simulate upload
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 5);
        if (next === 100) {
          clearInterval(timer);
          setUploading(false);
          setResult({
            title,
            description,
            filename: file.name,
            type: file.type || "unknown",
            bytes: file.size,
            sizeKB: +(file.size / 1024).toFixed(2),
          });
        }
        return next;
      });
    }, 120);
  };

  return (
    <div className={styles.page}>
    <AdminSlide />
      <form className={styles.card} onSubmit={handleSubmit}>
        {/* Image-first column: dropzone/preview */}
        <div
          className={`${styles.dropzone} ${!file ? styles.dropzoneEmpty : ""}`}
          onClick={pickFile}
          onDrop={onDrop}
          onDragEnter={onDrag}
          onDragOver={onDrag}
          role="button"
          aria-label="Upload image or video"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" ? pickFile() : null)}
        >
          {!previewURL ? (
            <div className={styles.dropHint}>
              <span className={styles.badge}>Upload</span>
              <p>Drag & drop image/video here, or click to browse</p>
              <small>PNG • JPG • GIF • MP4 • WEBM</small>
            </div>
          ) : (
            <>
              {file?.type?.startsWith("video/") ? (
                <video
                  className={styles.media}
                  src={previewURL}
                  controls
                  preload="metadata"
                />
              ) : (
                <img className={styles.media} src={previewURL} alt="preview" />
              )}
            </>
          )}

          {/* progress mask */}
          {uploading && (
            <div className={styles.progressMask} aria-hidden>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className={styles.hiddenInput}
            onChange={onFileChange}
          />
        </div>

        {/* Content column (stacked) */}
        <div className={styles.stack}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a short, clear name"
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Say a few words about this upload…"
            />
          </label>

          <button type="submit" className={styles.cta} disabled={uploading}>
            {uploading ? `Uploading ${progress}%` : "Upload"}
          </button>
        </div>
      </form>

      {result && (
        <section className={styles.result}>
          <h3>Result (JSON)</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </div>
  );
};

export default AdminGallery;
