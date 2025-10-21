import PropTypes from "prop-types";
import "./LiquedLoader.css";

export default function LiquedLoader({ label }) {
  return (
    <div className="liqued-loader-wrapper" role="status" aria-live="polite">
      <div className="liqued-loader" />
    </div>
  );
}

LiquedLoader.propTypes = {
  label: PropTypes.string,
};

LiquedLoader.defaultProps = {
  label: "",
};
