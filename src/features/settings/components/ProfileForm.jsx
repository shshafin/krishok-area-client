import "../styles/common.css";
import "../styles/Forms.css";
import UserIcon from "@/assets/IconComponents/UserIcon";
import GlobeIcon from "@/assets/IconComponents/GlobeIcon";
import PhoneIcon from "@/assets/IconComponents/PhoneIcon";
import MapPinIcon from "@/assets/IconComponents/MapPinIcon";
import LockIcon from "@/assets/IconComponents/LockIcon";
import SaveIcon from "@/assets/IconComponents/SaveIcon";
import EyeIcon from "@/assets/IconComponents/Eye.jsx";
import EyeOffIcon from "@/assets/IconComponents/EyeOff.jsx";

export default function ProfileForm({
  values = {},
  onChange = () => {},
  onSubmit = (e) => e.preventDefault(),
  passwordValue = "",
  onPasswordChange = () => {},
  isPasswordVisible = false,
  onTogglePasswordVisibility = () => {},
  isSubmitting = false,
}) {
  const safeValues = values || {};

  const {
    name = "",
    username = "",
    bio = "",
    phone = "",
    address = "",
  } = safeValues;

  const passwordToggleLabel = isPasswordVisible ? "Hide password" : "Show password";

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

          <div className="form-row">
            <label className="label">
              <LockIcon /> Password Confirmation
            </label>
            <div className="password-input-wrapper">
              <input
                name="password"
                className="input"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your account password"
                value={passwordValue}
                onChange={onPasswordChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={onTogglePasswordVisibility}
                aria-label={passwordToggleLabel}>
                {isPasswordVisible ? <EyeOffIcon width={22} height={22} /> : <EyeIcon width={22} height={22} />}
              </button>
            </div>
            <p className="field-help">
              Enter your current password to confirm changes.
            </p>
          </div>

          <div className="form-footer">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}>
              <SaveIcon /> {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

