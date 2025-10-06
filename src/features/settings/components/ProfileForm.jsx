import "../styles/common.css";
import "../styles/Forms.css";
import UserIcon from "@/assets/IconComponents/UserIcon";
import GlobeIcon from "@/assets/IconComponents/GlobeIcon";
import PhoneIcon from "@/assets/IconComponents/PhoneIcon";
import MapPinIcon from "@/assets/IconComponents/MapPinIcon";
import SaveIcon from "@/assets/IconComponents/SaveIcon";

export default function ProfileForm({
  values = {},
  onChange = () => {},
  onSubmit = (e) => e.preventDefault(),
}) {
  const {
    name = "",
    username = "",
    bio = "",
    phone = "",
    address = "",
  } = values;

  return (
    <section className="card">
      <div className="section-title">
        <UserIcon /> Profile Information
      </div>

      <form
        className="form-section"
        onSubmit={onSubmit}>
        <div className="form-stack">
          <div className="form-row">
            <label className="label">
              <UserIcon /> Full Name
            </label>
            <input
              className="input"
              name="name"
              placeholder="Enter your full name"
              value={name}
              onChange={onChange}
            />
          </div>

          <div className="form-row">
            <label className="label">
              <UserIcon /> Username
            </label>
            <input
              className="input"
              name="username"
              required
              placeholder="Enter a username"
              value={username}
              onChange={onChange}
            />
          </div>

          <div className="form-row">
            <label className="label">
              <GlobeIcon /> Bio
            </label>
            <textarea
              className="textarea"
              name="bio"
              rows={4}
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={onChange}
            />
          </div>

          <div className="form-row">
            <label className="label">
              <PhoneIcon /> Phone Number
            </label>
            <input
              className="input"
              name="phone"
              placeholder="+880 1234 567890"
              value={phone}
              onChange={onChange}
            />
          </div>

          <div className="form-row">
            <label className="label">
              <MapPinIcon /> Address/Location
            </label>
            <input
              className="input"
              name="address"
              placeholder="Enter your address or location"
              value={address}
              onChange={onChange}
            />
          </div>

          <div className="form-footer">
            <button
              className="btn btn-primary"
              type="submit">
              <SaveIcon /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
