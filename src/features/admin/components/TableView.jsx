import React, { useState } from "react";

/**
 * TableView renders with same AdminLTE table classes you used.
 * Delete animates height/opacity without external libs.
 */
export default function TableView({ items = [], onDelete, onLogin }) {
  const [removing, setRemoving] = useState({}); // id -> true while animating

  const handleDelete = (id) => {
    setRemoving((r) => ({ ...r, [id]: true }));
    // match CSS duration in adminScoped.css (300ms)
    setTimeout(() => {
      onDelete?.(id);
      setRemoving((r) => {
        const n = { ...r };
        delete n[id];
        return n;
      });
    }, 300);
  };

  return (
    <table className="table table-bordered table-hover">
      <thead>
        <tr>
          <th>No</th>
          <th>User</th>
          <th>User ID</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((u) => (
          <tr
            key={u.id}
            id={`deleteadminuserdiv_${u.id}`}
            className={removing[u.id] ? "_row-removing" : ""}
          >
            <td>
              <span className="idposition">{u.no}</span>
            </td>

            <td>
              <div className="d-flex">
                <div className="userimg47">
                  <img
                    src={u.avatar}
                    className="admin-user-image rounded-circle border border-2 shadow-sm mx-2"
                    width="55"
                    height="55"
                    style={{ objectFit: "cover" }}
                    alt=""
                  />
                </div>
                <div>
                  <h5>{u.name}</h5>
                  <h6 className="text-muted">{u.handle}</h6>
                  <h6 className="text-muted">{u.email}</h6>

                  <span className="user-dep mr-3">{u.dept}</span>
                  <span className="user-add mr-3">{u.address}</span>
                  <span className="user-mob">{u.phone}</span>
                </div>
              </div>
            </td>

            <td>
              <span className="idposition">{u.id}</span>
            </td>

            <td>
              <div className="idposition">
                <a
                  href={`${window.location.origin}/user/${encodeURIComponent(
                    u.username
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-sm m-1"
                >
                  Login User
                </a>

                {/* Show/Hide buttons as needed in your real app */}
                <button className="m-1 btn  btn-sm">Block</button>
                <button
                  className="m-1 btn btn-primary btn-sm"
                  style={{ display: "none" }}
                >
                  Unblock
                </button>

                <button className="m-1 btn  btn-sm">No admin</button>
                <button
                  className="m-1 btn btn-primary btn-sm"
                  style={{ display: "none" }}
                >
                  Admin
                </button>

                <button
                  className="userdeletebtn"
                  type="button"
                  title="Delete User"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
