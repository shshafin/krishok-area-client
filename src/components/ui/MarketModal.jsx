export default function MarketModal({
  open,
  onClose,
  name,
  location,
  image,
  priceImage,
  contact,
  description,
  mobile = false,
}) {
  if (!open) return null;

  return (
    <div id="distirctmodal" style={{ display: "block" }}>
      <div id="distirct-modal-box">
        <div className="bazar_data seed_data">
          <div className="baxuse4x">
            <a href={`?krishokarea_user=${name}`}>
              <img
                className="distirct-img"
                src={image}
                alt="bazar user image"
              />
              <h4>
                {name}
                <span>{location}</span>
              </h4>
            </a>
            <span className="ubzx_timex">08:12 PM</span>
          </div>

          <div className="bazar-img-details">
            <div className="bazar-main-img">
              <img
                className="distirct-img"
                src={priceImage}
                alt="bazar price image"
              />
            </div>
            <div className="bazar_xrx4">
              <div className="addtoobuy">
                <span className="addtoocard">
                  {contact || "এই নাম্বারে যোগাযোগ করুন"}
                </span>
              </div>
              <h6 dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>
        <div id="disclose" onClick={onClose}>X</div>
      </div>
    </div>
  );
}