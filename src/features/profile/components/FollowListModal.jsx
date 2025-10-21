import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";

export default function FollowListModal({
  open,
  title,
  users,
  onClose,
  actionLabel,
  onAction,
  onToggleFollow,
  isFollowing,
}) {
  const resolveActionLabel = (user) => {
    if (typeof actionLabel === "function") return actionLabel(user);
    return actionLabel;
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {users?.length ? (
        <div className="follow-list">
          {users.map((user) => {
            const dynamicLabel = resolveActionLabel(user);
            const following = isFollowing?.(user) ?? false;

            return (
              <div className="follow-item" key={user.id}>
                <NavLink
                  className="follow-item-info"
                  to={`/user/${user.username}`}
                  onClick={() => onClose?.()}
                >
                  <img src={user.avatar} alt={user.name} />
                  <div>
                    <h5>{user.name}</h5>
                    <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>@{user.username}</div>
                  </div>
                </NavLink>

                <div className="follow-item-actions">
                  {onToggleFollow && (
                    <button
                      type="button"
                      className={`follow-toggle ${following ? "following" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFollow(user, following);
                      }}
                    >
                      {following ? "আনফলো" : "ফলো"}
                    </button>
                  )}

                  {dynamicLabel && (
                    <button
                      type="button"
                      className="follow-secondary-action"
                      onClick={(event) => {
                        event.stopPropagation();
                        onAction?.(user);
                      }}
                    >
                      {dynamicLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">কোনো ব্যবহারকারী খুঁজে পাওয়া যায়নি</div>
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
  actionLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onAction: PropTypes.func,
  onToggleFollow: PropTypes.func,
  isFollowing: PropTypes.func,
};

FollowListModal.defaultProps = {
  open: false,
  title: "",
  users: [],
  onClose: undefined,
  actionLabel: undefined,
  onAction: undefined,
  onToggleFollow: undefined,
  isFollowing: undefined,
};
