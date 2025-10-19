import React, { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const fakeSubmit = (payload) =>
  new Promise((resolve, reject) => {
    const time = 600 + Math.random() * 800;
    setTimeout(() => {
      if (Math.random() < 0.1) reject(new Error("Unable to save company. Try again."));
      else resolve({ ok: true, id: Math.random().toString(36).slice(2) });
    }, time);
  });

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const normalizeSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .toLowerCase();

export default function AddCompanyCategoryPage() {
  const [banglaName, setBanglaName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("published");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const slug = useMemo(() => {
    const base = title.trim() || englishName.trim() || banglaName.trim();
    return base ? normalizeSlug(base) : "";
  }, [title, englishName, banglaName]);

  const payload = useMemo(
    () => ({
      banglaName: banglaName.trim(),
      englishName: englishName.trim(),
      title: title.trim(),
      slug,
      status,
      location: location.trim(),
      notes: notes.trim(),
      meta: {
        createdBy: "admin",
        createdAt: new Date().toISOString(),
      },
    }),
    [banglaName, englishName, title, slug, status, location, notes]
  );

  const validate = () => {
    if (!payload.banglaName) return "Company name in Bangla is required";
    if (!payload.englishName) return "Company name in English is required";
    if (!payload.title) return "Company title is required";
    return null;
  };

  const resetFields = () => {
    setBanglaName("");
    setEnglishName("");
    setTitle("");
    setStatus("published");
    setLocation("");
    setNotes("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading("Saving company...");
    try {
      await fakeSubmit(payload);
      toast.success("Company saved!", { id: toastId });
      resetFields();
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Add Company</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/companies/manage">Manage Company</a>
                </li>
                <li className="breadcrumb-item active">Add Company</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-12">
                <div className="card card-outline card-primary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Company Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="banglaName">
                          Company Name (Bangla) <span className="text-danger">*</span>
                        </label>
                        <input
                          id="banglaName"
                          type="text"
                          className="form-control"
                          placeholder="বাংলা নাম লিখুন"
                          value={banglaName}
                          onChange={(event) => setBanglaName(event.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="englishName">
                          Company Name (English) <span className="text-danger">*</span>
                        </label>
                        <input
                          id="englishName"
                          type="text"
                          className="form-control"
                          placeholder="Enter company name in English"
                          value={englishName}
                          onChange={(event) => setEnglishName(event.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="title">
                        Company Title <span className="text-danger">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="Company headline or slogan"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        className="form-control"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <input
                        id="location"
                        type="text"
                        className="form-control"
                        placeholder="Enter company location (e.g., Dhaka, Bangladesh)"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="notes">Notes</label>
                      <textarea
                        id="notes"
                        className="form-control"
                        rows={4}
                        placeholder="Internal notes, partnerships, history, etc."
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="card card-outline card-success mt-3">
                  <div className="card-body">
                    <button type="submit" className="btn btn-primary btn-lg w-100 mb-2" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Company"}
                    </button>
                    <a href="/admin/companies/manage" className="btn btn-outline-secondary w-100">
                      Manage Company
                    </a>
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
