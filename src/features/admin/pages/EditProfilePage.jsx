import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const PROFILE_DEFAULTS = {
  fullName: "Krishok Mosarrof",
  displayName: "K. Mosarrof",
  role: "Administrator",
  email: "admin@krishokarea.com",
  phone: "+880 1710-000000",
  location: "Rajshahi, Bangladesh",
  language: "bn",
  timezone: "Asia/Dhaka",
  bio: "Managing the KrishokArea community and keeping farmer resources up to date.",
  facebook: "https://facebook.com/krishokarea",
  twitter: "https://twitter.com/krishokarea",
  linkedin: "https://linkedin.com/company/krishokarea",
  youtube: "https://youtube.com/@krishokarea",
  allowMarketing: true,
  enableTwoFactor: false,
};

const ROLE_OPTIONS = ["Administrator", "Manager", "Editor", "Support"];
const LANGUAGE_OPTIONS = [
  { value: "bn", label: "Bengali" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
];
const TIMEZONE_OPTIONS = [
  "Asia/Dhaka",
  "Asia/Kolkata",
  "Asia/Kuala_Lumpur",
  "Asia/Singapore",
];

export default function EditProfilePage() {
  const [form, setForm] = useState(() => ({ ...PROFILE_DEFAULTS }));
  const [status, setStatus] = useState("idle");
  const timeoutRef = useRef(null);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("saved");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      timeoutRef.current = null;
    }, 3000);
  };

  const socialSummary = useMemo(
    () =>
      ["facebook", "twitter", "linkedin", "youtube"].filter(
        (key) => form[key]?.trim()
      ).length,
    [form]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Edit Profile</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                </li>
                <li className="breadcrumb-item active">Edit Profile</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-8">
                <div className="card card-primary card-outline mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Account Details</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          className="form-control"
                          value={form.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="displayName">Display Name</label>
                        <input
                          id="displayName"
                          name="displayName"
                          type="text"
                          className="form-control"
                          value={form.displayName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="role">Role</label>
                        <select
                          id="role"
                          name="role"
                          className="form-control"
                          value={form.role}
                          onChange={handleChange}
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="location">Location</label>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          className="form-control"
                          value={form.location}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio">About</label>
                      <textarea
                        id="bio"
                        name="bio"
                        className="form-control"
                        rows={4}
                        value={form.bio}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-info mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Contact Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="email">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="form-control"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="form-control"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="language">Preferred Language</label>
                        <select
                          id="language"
                          name="language"
                          className="form-control"
                          value={form.language}
                          onChange={handleChange}
                        >
                          {LANGUAGE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="timezone">Timezone</label>
                        <select
                          id="timezone"
                          name="timezone"
                          className="form-control"
                          value={form.timezone}
                          onChange={handleChange}
                        >
                          {TIMEZONE_OPTIONS.map((tz) => (
                            <option key={tz} value={tz}>
                              {tz}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-success mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Social Links</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="facebook">Facebook</label>
                      <input
                        id="facebook"
                        name="facebook"
                        type="url"
                        className="form-control"
                        value={form.facebook}
                        onChange={handleChange}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="twitter">Twitter / X</label>
                      <input
                        id="twitter"
                        name="twitter"
                        type="url"
                        className="form-control"
                        value={form.twitter}
                        onChange={handleChange}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="linkedin">LinkedIn</label>
                      <input
                        id="linkedin"
                        name="linkedin"
                        type="url"
                        className="form-control"
                        value={form.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="youtube">YouTube</label>
                      <input
                        id="youtube"
                        name="youtube"
                        type="url"
                        className="form-control"
                        value={form.youtube}
                        onChange={handleChange}
                        placeholder="https://youtube.com/@..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card card-outline card-secondary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Preferences</h3>
                  </div>
                  <div className="card-body">
                    <div className="custom-control custom-switch mb-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="allowMarketing"
                        name="allowMarketing"
                        checked={form.allowMarketing}
                        onChange={handleChange}
                      />
                      <label className="custom-control-label" htmlFor="allowMarketing">
                        Receive product updates & announcements
                      </label>
                    </div>
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="enableTwoFactor"
                        name="enableTwoFactor"
                        checked={form.enableTwoFactor}
                        onChange={handleChange}
                      />
                      <label className="custom-control-label" htmlFor="enableTwoFactor">
                        Enable two-factor authentication
                      </label>
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-dark mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Profile Snapshot</h3>
                  </div>
                  <div className="card-body">
                    <dl className="mb-0">
                      <dt>Role</dt>
                      <dd>{form.role}</dd>
                      <dt>Email</dt>
                      <dd className="text-truncate">{form.email}</dd>
                      <dt>Phone</dt>
                      <dd>{form.phone || "Not provided"}</dd>
                      <dt>Social Accounts</dt>
                      <dd>{socialSummary} linked</dd>
                    </dl>
                  </div>
                </div>

                <div className="card card-outline card-light">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    {status === "saved" && (
                      <span className="text-success small font-weight-bold">
                        Saved locally
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
