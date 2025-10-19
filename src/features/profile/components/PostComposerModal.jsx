import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const ACCEPTED_MEDIA = "image/jpeg,image/png,image/webp,video/mp4,video/webm";

export default function PostComposerModal({
  open,
  mode,
  onClose,
  onSubmit,
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setText("");
      setFile(null);
      setPreviewUrl("");
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const mediaType = useMemo(() => {
    if (!file) return null;
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    return null;
  }, [file]);

  const handleFileChange = (event) => {
    const targetFile = event.target.files?.[0];
    if (!targetFile) return;
    setFile(targetFile);
  };

  const handleSubmit = async () => {
    const payload = {
      text: text.trim(),
      media: file
        ? {
            file,
            type: mediaType,
          }
        : null,
      mode,
    };

    if (!payload.text && !payload.media) return;

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  const headerTitle =
    mode === "video"
      ? "লাইভ ভিডিও (ড্রাফ্ট)"
      : mode === "media"
        ? "ছবি / ভিডিও পোস্ট"
        : "নতুন পোস্ট তৈরি করুন";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={headerTitle}
      size="lg"
      footer={
        <div className="composer-actions">
          <button
            type="button"
            className="secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary"
            onClick={handleSubmit}
            disabled={submitting || (!text.trim() && !file)}
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      }
    >
      <div className="composer-body">
        <textarea
          placeholder="এখানে লিখুন..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <label className="composer-upload">
          <strong>ছবি বা ভিডিও সংযুক্ত করুন</strong>
          <p style={{ marginTop: "0.35rem", color: "#64748b" }}>
            সমর্থিত ফরম্যাট: JPG, PNG, MP4
          </p>
          <input
            type="file"
            accept={ACCEPTED_MEDIA}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {previewUrl && (
          <div className="composer-preview">
            {mediaType === "video" ? (
              <video src={previewUrl} controls muted />
            ) : (
              <img src={previewUrl} alt="নতুন পোস্ট প্রিভিউ" />
            )}
            <button type="button" onClick={() => setFile(null)} aria-label="Remove attachment">
              ×
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

PostComposerModal.propTypes = {
  open: PropTypes.bool,
  mode: PropTypes.oneOf(["text", "media", "video"]),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

PostComposerModal.defaultProps = {
  open: false,
  mode: "text",
  onClose: undefined,
  onSubmit: undefined,
};
