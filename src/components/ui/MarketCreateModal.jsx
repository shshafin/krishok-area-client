export default function MarketCreateModal({ open, onClose, user, onSubmit }) {
  if (!open) return null;

  return (
    <div
      className="modal fade show"
      id="userseedbazar6boxmodal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ display: "block" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-3 m-auto" id="exampleModalLabel">
              বীজ যোগ করুন
            </h1>
            <button
              type="button"
              className="btn-close mainbtnclose"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="user-id">
              <a href={`?krishokarea_user=${user?.id || "anonymous"}`}>
                <img
                  className="user-img-activestatus"
                  src={user?.img}
                  alt="user profile"
                />
                <h5>{user?.name}</h5>
              </a>
            </div>

            <form onSubmit={onSubmit}>
              <div className="user-input-box">
                <textarea
                  className="box-aria"
                  name="add_seed_bazar_text"
                  placeholder="এখানে বীজ সম্পর্কে লিখুন..."
                />
              </div>

              <div className="ab">
                <img
                  src=""
                  style={{ display: "none" }}
                  id="post_img"
                  alt="preview"
                />
              </div>

              <div className="user-image-box">
                <div className="icon-text">
                  <img
                    className="add-img"
                    src="assets/icon/add image.png"
                    alt="add image icon"
                  />
                </div>
                <input
                  className="add-image-box multiple"
                  type="file"
                  id="select_post_img"
                  accept="image/jpeg,image/jpg"
                />
              </div>

              <input type="submit" className="add-post-dtn" value="বীজ যোগ করুন" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}