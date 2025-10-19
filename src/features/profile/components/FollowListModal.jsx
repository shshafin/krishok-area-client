import PropTypes from "prop-types";
import Modal from "./Modal";

export default function FollowListModal({
  open,
  title,
  users,
  onClose,
  actionLabel,
  onAction,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {users?.length ? (
        <div className="follow-list">
          {users.map((user) => (
            <div className="follow-item" key={user.id}>
              <div className="follow-item-info">
                <img src={user.avatar} alt={user.name} />
                <div>
                  <h5>{user.name}</h5>
                  <div style={{ color: "#64748b", fontSize: "0.85rem" }}>@{user.username}</div>
                </div>
              </div>
              {actionLabel && (
                <button
                  type="button"
                  onClick={() => onAction?.(user)}
                >
                  {actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">দুঃখিত, কোনো ব্যবহারকারী পাওয়া যায়নি</div>
      )}
    </Modal>
  );
}

FollowListModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ),
  onClose: PropTypes.func,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

FollowListModal.defaultProps = {
  open: false,
  title: "",
  users: [],
  onClose: undefined,
  actionLabel: undefined,
  onAction: undefined,
};
