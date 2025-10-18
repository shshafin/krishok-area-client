import React, { useState } from "react";

export default function TableView({ items = [], onDelete, onLogin }) {
  const [removing, setRemoving] = useState({});

  const handleDelete = (id) => {
    setRemoving((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      onDelete?.(id);
      setRemoving((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
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
          <tr key={u.id} id={`deleteadminuserdiv_${u.id}`} className={removing[u.id] ? "_row-removing" : ""}>
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
                    alt={u.name}
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
                  href="#"
                  className="btn btn-success btn-sm m-1"
                  onClick={(e) => {
                    e.preventDefault();
                    onLogin?.(u.username);
                  }}
                >
                  Login User
                </a>

                <button className="m-1 btn btn-danger btn-sm block_user_btn ub">Block</button>
                <button className="m-1 btn btn-primary btn-sm unblock_user_btn" style={{ display: "none" }}>
                  Unblock
                </button>

                <button className="m-1 btn btn-danger btn-sm noadmin_user_btn ub">No admin</button>
                <button className="m-1 btn btn-primary btn-sm admin_user_btn" style={{ display: "none" }}>
                  Admin
                </button>

                <button className="userdeletebtn" type="button" title="Delete User" onClick={() => handleDelete(u.id)}>
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
