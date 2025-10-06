import { useState, useRef, useEffect, useCallback } from "react";
import ModalShell from "@/components/ui/ModalShell";
import { toast } from "react-hot-toast";
import { createPost, fetchMe } from "@/api/authApi"; // fetchMe added

import CloseIcon from "@/assets/IconComponents/Close";
import ImageIcon from "@/assets/IconComponents/Image";
import VideoIcon from "@/assets/IconComponents/Video";
import CheckIcon from "@/assets/IconComponents/Check";
import PlayIcon from "@/assets/IconComponents/Play";
import { baseApi } from "../../api";

const MAX_FILES = 3;

const formatSize = (bytes) =>
  bytes
    ? `${(bytes / 1024 ** Math.floor(Math.log(bytes) / Math.log(1024))).toFixed(
        1
      )} ${
        ["B", "KB", "MB", "GB"][Math.floor(Math.log(bytes) / Math.log(1024))]
      }`
    : "0 B";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });

export default function Posting({ onClose }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [users, setUser] = useState({});

  const imageRef = useRef();
  const videoRef = useRef();

  // useEffect(() => {
  //   // fetch logged-in user
  //   fetchMe()
  //     .then((res) => {
  //       const u = res?.data;
  //       if (u) {
  //         setUser(u);
  //       }
  //     })
  //     .catch((err) => console.error("Failed to fetch user:", err));
  // }, []);

  useEffect(
    () => () =>
      files.forEach((f) => f.type === "video" && URL.revokeObjectURL(f.url)),
    [files]
  );

  const addFiles = useCallback(
    async (e, type) => {
      const newFiles = [...files];
      for (const f of e.target.files) {
        if (newFiles.length >= MAX_FILES) break;
        const url =
          type === "image" ? await fileToBase64(f) : URL.createObjectURL(f);
        newFiles.push({
          id: URL.createObjectURL(f),
          url,
          name: f.name,
          size: formatSize(f.size),
          type,
          file: f,
        });
      }
      setFiles(newFiles);
      e.target.value = "";
    },
    [files]
  );

  const removeFile = (id) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("text", content);

      files.forEach((f) => {
        if (f.type === "image") formData.append("images", f.file);
        if (f.type === "video") formData.append("videos", f.file);
      });

      await createPost(formData);
      toast.success("Post created successfully!");

      setContent("");
      setFiles([]);
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post");
    }
  };

  const imgCount = files.filter((f) => f.type === "image").length;
  const vidCount = files.filter((f) => f.type === "video").length;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>লোড হচ্ছে...</div>;

  const user = users?.data;
  console.log(user, "user");

  return (
    <ModalShell
      header="Create Post"
      onClose={onClose}>
      <section className="post-body">
        <div className="user flex FY-center">
          <div className="profile">
            <img
              src={
                user.profileImage
                  ? user.profileImage.startsWith("http")
                    ? user.profileImage
                    : `${baseApi}${user.profileImage}`
                  : `https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png`
              }
              alt={user.username}
            />
          </div>
          <div className="user-info">
            <div className="name">{user.username}</div>
            <span className="subtitle">Share your thoughts...</span>
          </div>
        </div>

        <section className="post-content">
          <textarea
            placeholder={`What's on your mind, ${user.username}?`}
            className="post-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </section>

        {!!files.length && (
          <div className="post-media">
            <div className="media-grid">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="media-item">
                  <div className="media-preview">
                    {f.type === "image" ? (
                      <img
                        src={f.url}
                        alt={f.name}
                        className="preview-image"
                      />
                    ) : (
                      <>
                        <video
                          src={f.url}
                          className="preview-video"
                        />
                        <div className="media-play-icon">
                          <PlayIcon />
                        </div>
                      </>
                    )}
                    <div className="media-status">
                      <CheckIcon />
                    </div>
                    <button
                      className="media-close-button"
                      onClick={() => removeFile(f.id)}>
                      <CloseIcon stroke="#fff" />
                    </button>
                  </div>
                  <p className="media-filename">
                    {f.name} ({f.size})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="post-footer">
        <div className="post-controls">
          <div className="post-options">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={imageRef}
              onChange={(e) => addFiles(e, "image")}
            />
            <button
              className="option-button"
              disabled={files.length >= MAX_FILES}
              onClick={() => imageRef.current?.click()}>
              <ImageIcon />{" "}
              <span className="option-text">
                Photo ({imgCount}/{MAX_FILES})
              </span>
            </button>

            <input
              type="file"
              accept="video/*"
              multiple
              hidden
              ref={videoRef}
              onChange={(e) => addFiles(e, "video")}
            />
            <button
              className="option-button"
              disabled={files.length >= MAX_FILES}
              onClick={() => videoRef.current?.click()}>
              <VideoIcon />{" "}
              <span className="option-text">
                Video ({vidCount}/{MAX_FILES})
              </span>
            </button>
          </div>
        </div>

        <div className="post-action">
          <button
            className="post-button"
            onClick={handlePost}
            disabled={!content.trim() && !files.length}>
            Post
          </button>
        </div>
      </footer>
    </ModalShell>
  );
}
