import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import addImage from "@/assets/icons/add.png";

export default function MarketCreateModal({ open = false, onClose, user, title }) {
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setPreview(null);
      setText("");
      setFile(null);
    }
  }, [open]);

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !file) {
      toast.error("টেক্সট বা ছবি অন্তত একটি দিন।");
      return;
    }

    // Fake submit — log payload
    const payload = {
      userId: user?.id || "anonymous",
      text,
      fileName: file?.name || null,
      fileType: file?.type || null,
      createdAt: new Date().toISOString(),
    };
    console.log("[Seed Bazar Submit]", payload);

    // Show success toast
    toast.success("সফলভাবে যোগ করা হয়েছে!");

    // Close and reset
    onClose?.();
  };

  const modalClass = open ? "modal fade show" : "modal fade";
  const style = { display: open ? "block" : "none" };
  const ariaHidden = open ? undefined : true;

  return (
    <>
      <div
        className={modalClass}
        id="userseedbazar6boxmodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-modal={open ? "true" : undefined}
        role="dialog"
        style={style}
        aria-hidden={ariaHidden}
        onClick={(e) => {
          if (e.target.id === "userseedbazar6boxmodal") onClose?.();
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-3 m-auto" id="exampleModalLabel">{title}</h1>

              {/* keep classes + attributes; control via React */}
              <button
                type="button"
                className="btn-close mainbtnclose"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="user-id">
                <a href={`?krishokarea_user=${user?.id || "anonymous"}`}>
                  <img
                    className="user-img-activestatus"
                    src={
                      user?.img ||
                      "assets/images/profile/1760363697WhatsApp Image 2025-10-10 at 10.42.36 AM.jpeg"
                    }
                    alt="user profile image"
                  />
                  <h5>{user?.name || "User"}</h5>
                </a>
              </div>

              {/* React submit; no PHP action */}
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="user-input-box">
                  <textarea
                    className="box-aria"
                    name="add_seed_bazar_text"
                    placeholder="এখানে বীজ সম্পর্কে লিখুন..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                </div>

                {/* Preview below textarea (no empty src) */}
                <div className="ab" style={{ marginTop: "5px" }}>
                  {preview && (
                    <img
                      src={preview}
                      id="post_img"
                      alt="selected image"
                      style={{
                        borderRadius: "6px",
                        width: "100%",
                        height: "auto",
                        display: "block",
                        marginTop: "5px",
                      }}
                    />
                  )}
                </div>

                <div className="user-image-box">
                  <div className="icon-text">
                    <img className="add-img" src={addImage} alt="add image icon" />
                  </div>

                  <input
                    className="add-image-box multiple"
                    name="seed_bazar_img"
                    type="file"
                    id="select_post_img"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                  />
                </div>

                <input type="submit" className="add-post-dtn" value="বীজ যোগ করুন" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}