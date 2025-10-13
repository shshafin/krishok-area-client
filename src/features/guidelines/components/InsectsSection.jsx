import { NavLink } from "react-router-dom";

export default function InsectsSection({ sections = [] }) {
  return (
    <div className="nir-size">
      {sections.map((sec, secIndex) => {
        // first array → insects, second → disease
        const basePath = secIndex === 0 ? "insects" : "disease";

        return (
          <div className="cco-A" key={sec.title}>
            <h3 className="b">{sec.title}</h3>

            <div className="fsize">
              {sec.items?.map((it) => (
                <NavLink
                  key={it.id}
                  className="bb1"
                  to={`/${basePath}/${it.name}`}
                >
                  {it.name}
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
