import "../styles/common.css";
import SettingsIcon from "@/assets/IconComponents/SettingsIcon";
import LogOutIcon from "@/assets/IconComponents/LogOutIcon";

export default function AccountActions({ onSignOut }) {
  return (
    <section className="card">
      <div className="section-title">
        <SettingsIcon className="icon" style={{ color: "var(--darkGray)" }} />
        Account Actions
      </div>

      <div className="card-padding" style={{ paddingTop: 0 }}>
        <button className="btn btn-danger" style={{ width: "100%" }} type="button" onClick={onSignOut}>
          <LogOutIcon /> Sign Out
        </button>
      </div>
    </section>
  );
}