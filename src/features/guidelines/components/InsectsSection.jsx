import { NavLink } from "react-router-dom";

export default function InsectsSection({ sections = [] }) {
  return (
    <div className="nir-size">
      {sections.map((sec) => (
        <div className="cco-A" key={sec.id || sec.title}>
          <h3 className="b">{sec.title}</h3>

          <div className="fsize">
            {sec.items?.map((it) => (
              <NavLink
                key={it.id}
                className="bb1"
                to={`/insects/${it.id}`}
              >
                {it.name}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}