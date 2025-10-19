import React, { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const fakeSubmit = (payload) =>
  new Promise((resolve, reject) => {
    const delay = 700 + Math.random() * 800;
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error("Unexpected server error. Please try again."));
      } else {
        resolve({ ok: true, id: Math.random().toString(36).slice(2) });
      }
    }, delay);
  });

const CATEGORY_OPTIONS = [
  { value: "pest-control", label: "ক্ষতিকর পোকামাকড়" },
  { value: "disease-management", label: "রোগবালাই" },
  { value: "nutrition", label: "সার ও পুষ্টি" },
  { value: "climate-support", label: "আবহাওয়া সহায়তা" },
  { value: "equipment-tools", label: "যন্ত্রপাতি ও সরঞ্জাম" },
];

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

export default function AddCropCategoryPage() {
  const [banglaName, setBanglaName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("published");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const slug = useMemo(() => {
    const base = englishName.trim() || banglaName.trim();
    return base ? normalizeSlug(base) : "";
  }, [banglaName, englishName]);

  const payload = useMemo(
    () => ({
      banglaName: banglaName.trim(),
      englishName: englishName.trim(),
      categoryType: category,
      status,
      slug,
      tags: tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      notes: notes.trim(),
      meta: {
        createdBy: "admin",
        createdAt: new Date().toISOString(),
      },
    }),
    [banglaName, englishName, category, status, slug, tags, notes]
  );

  const validate = () => {
    if (!payload.banglaName) return "Bangla crop name is required";
    if (!payload.englishName) return "English crop name is required";
    if (!payload.categoryType) return "Please select a crop category";
    return null;
  };

  const resetFields = () => {
    setBanglaName("");
    setEnglishName("");
    setCategory("");
    setStatus("published");
    setTags("");
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
    const toastId = toast.loading("Saving crop category...");
    try {
      const response = await fakeSubmit(payload);
      setLastSubmitted({ id: response.id, ...payload });
      toast.success("Crop category saved!", { id: toastId });
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
              <h1 className="m-0">Add Crop Category</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/crops/manage-category">Manage Crop Category</a>
                </li>
                <li className="breadcrumb-item active">Add Crop Category</li>
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
                <div className="card card-outline card-primary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Category Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="banglaName">
                          Crop Name (Bangla) <span className="text-danger">*</span>
                        </label>
                        <input
                          id="banglaName"
                          type="text"
                          className="form-control"
                          placeholder="বাংলা ফসলের নাম লিখুন"
                          value={banglaName}
                          onChange={(event) => setBanglaName(event.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="englishName">
                          Crop Name (English) <span className="text-danger">*</span>
                        </label>
                        <input
                          id="englishName"
                          type="text"
                          className="form-control"
                          placeholder="Enter crop name in English"
                          value={englishName}
                          onChange={(event) => setEnglishName(event.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="categoryType">
                          Crop Category <span className="text-danger">*</span>
                        </label>
                        <select
                          id="categoryType"
                          className="form-control"
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select crop category
                          </option>
                          {CATEGORY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
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
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="tags">Tags</label>
                      <input
                        id="tags"
                        type="text"
                        className="form-control"
                        placeholder="Comma separated tags"
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                      />
                      <small className="form-text text-muted">
                        Helps users find related content, e.g. গম, pest-control, nutrition.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-info">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Additional Notes</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group mb-0">
                      <label htmlFor="notes">Internal Notes</label>
                      <textarea
                        id="notes"
                        className="form-control"
                        rows={4}
                        placeholder="Add agronomic guidance, seasonal info, or reminders for editors."
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card card-outline card-secondary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Summary</h3>
                  </div>
                  <div className="card-body">
                    <dl className="mb-0">
                      <dt>Bangla</dt>
                      <dd>{payload.banglaName || "—"}</dd>
                      <dt>English</dt>
                      <dd>{payload.englishName || "—"}</dd>
                      <dt>Slug</dt>
                      <dd>{slug || "Auto-generated"}</dd>
                      <dt>Category</dt>
                      <dd>
                        {CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label || "—"}
                      </dd>
                      <dt>Status</dt>
                      <dd>{STATUS_OPTIONS.find((opt) => opt.value === status)?.label}</dd>
                    </dl>
                  </div>
                </div>

                <div className="card card-outline card-dark mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Submission JSON</h3>
                  </div>
                  <div className="card-body" style={{ maxHeight: 300, overflowY: "auto" }}>
                    <pre className="small mb-0">
{JSON.stringify(lastSubmitted ?? payload, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="card card-outline card-success">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        resetFields();
                        setLastSubmitted(null);
                      }}
                      disabled={submitting}
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Category"}
                    </button>
                  </div>
                </div>

                <div className="text-right mt-3">
                  <a href="/admin/crops/manage-category" className="btn btn-link p-0">
                    Manage Crop Categories
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
