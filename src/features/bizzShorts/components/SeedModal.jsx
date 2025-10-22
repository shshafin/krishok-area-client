import PropTypes from "prop-types";
import Modal from "@/features/profile/components/Modal";

export default function SeedModal({ open, short, onClose }) {
  if (!short) return null;

  const phone = short.phone || short.contact || null;
  const image = short.mediaUrl || short.img || null;
  const author = short.author || { username: short.username || "username", location: short.location || "" };
  const timeText = short.timeText || short.time || "";

  // Show location in Bengali if present (example: রাজশাহী). The value comes from author.location
  const locationText = author.location || short.location || "";

  return (
    <Modal open={open} onClose={onClose} size="md" className="seed-modal">
      <div className="seed-modal-inner">
        <div className="seed-header">
          <a href={`?krishokarea_user=${author.username}`} onClick={(e) => e.preventDefault()} className="seed-author">
            <img className="seed-author-avatar" alt="author avatar" src={author.avatar || author.img || "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png"} />
            <div className="seed-author-meta">
              <div className="seed-author-name">{author.username}</div>
              {(locationText || timeText) && (
                <div className="seed-author-submeta">
                  {locationText && <span className="seed-author-location">{locationText}</span>}
                  {timeText && <span className="seed-time">{timeText}</span>}
                </div>
              )}
            </div>
          </a>
        </div>

        <div className="seed-media-wrap">
          {image ? (
            <img className="seed-media" alt={short.title || "seed image"} src={image} />
          ) : (
            <div className="seed-media placeholder">No image</div>
          )}
        </div>

        <div className="seed-body">
          {phone && <div className="seed-contact">{phone} এই নম্বরে যোগাযোগ করুন</div>}
          {short.title && <h6 className="seed-title">{short.title}</h6>}
        </div>
      </div>
    </Modal>
  );
}

SeedModal.propTypes = {
  open: PropTypes.bool,
  short: PropTypes.object,
  onClose: PropTypes.func,
};

SeedModal.defaultProps = {
  open: false,
  short: null,
  onClose: undefined,
};
