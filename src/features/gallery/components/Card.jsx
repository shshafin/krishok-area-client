import { NavLink } from "react-router-dom";

const Card = ({ id, img, alt = "media", title, onOpen, path = "post" }) => {
  return (
    <div className="mibkk30">
      <div className="iandtkk30">
        <NavLink to={`/${path}/${id}`} onClick={onOpen}>
          <img className="gallery-img" src={img} alt={alt} />
        </NavLink>

        <p title="photo title" className="itkk30">
          {title}
        </p>
      </div>
    </div>
  );
};

export default Card;

