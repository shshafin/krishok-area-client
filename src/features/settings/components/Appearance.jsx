import "../styles/common.css";
import "../styles/Forms.css";
import MoonIcon from "@/assets/IconComponents/MoonIcon";

export default function Appearance({ mode = "Dark", onToggle }) {
  const isDark = (mode || "").toLowerCase() === "dark";
  const next = isDark ? "Light" : "Dark";

  return (
    <section className="card">
      <div className="section-title">
        <MoonIcon className="icon" style={{ color: "#60a5fa" }} />
        Appearance
      </div>

      <div className="form-section">
        <div className="flex FY-center F-space" style={{ border: `1px solid var(--border)`, borderRadius: "12px", padding: "1rem" }}>
          <div className="flex FY-center gap-12">
            <MoonIcon className="icon" style={{ color: "#60a5fa" }} />
            <div>
              <div className="h2" style={{ fontSize: "1rem" }}>Theme</div>
              <div className="gray" style={{ fontSize: ".9rem" }}>{mode} mode is active</div>
            </div>
          </div>
          <button className="btn btn-outline" onClick={onToggle}>Switch to {next}</button>
        </div>
      </div>
    </section>
  );
}