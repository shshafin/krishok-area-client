export default function MarketCard({
  id,
  image,
  timeTitle,
  timeText,
  title,
  onClick,
}) {
  return (
    <button
      className="minx_dbpx58 minx_dbpx14"
      disid={id}
      onClick={() => onClick(id)}
    >
      <span hidden className="obj">{id}</span>
      <div className="dixbp_xr5">
        <div className="minxi_imgseslesx45x">
          <img src={image} alt="" />
        </div>
        <div className="minxd_imagxds46">
          <h4>
            <p title={timeTitle}>
              <time style={{ fontSize: "small" }} className="timeago">
                {timeText}
              </time>
            </p>
            {title}
          </h4>
        </div>
      </div>
    </button>
  );
}