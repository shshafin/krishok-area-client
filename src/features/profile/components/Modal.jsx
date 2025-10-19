import { useEffect } from "react";
import PropTypes from "prop-types";

export default function Modal({
  open,
  onClose,
  title,
  header,
  footer,
  size = "md",
  children,
  className = "",
}) {
  useEffect(() => {
    if (!open) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="ka-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`ka-modal ka-modal-${size} ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {header ?? (
          <div className="ka-modal-header">
            {title ? <h5>{title}</h5> : <span />}
            <button
              type="button"
              className="ka-modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              x
            </button>
          </div>
        )}

        <div className="ka-modal-body">{children}</div>

        {footer && <div className="ka-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  children: PropTypes.node,
  className: PropTypes.string,
};
