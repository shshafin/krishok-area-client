import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const fakeSubmit = (payload) =>
  new Promise((resolve, reject) => {
    const latency = 900 + Math.random() * 800;
    setTimeout(() => {
      if (Math.random() < 0.12) reject(new Error("Server timeout. Please retry."));
      else resolve({ ok: true, id: Math.random().toString(36).slice(2) });
    }, latency);
  });

const CATEGORY_OPTIONS = [
  { value: "rice-pests", label: "ধান — ক্ষতিকর পোকামাকড়" },
  { value: "rice-disease", label: "ধান — রোগবালাই" },
  { value: "vegetable-pests", label: "সবজি — ক্ষতিকর পোকামাকড়" },
  { value: "vegetable-disease", label: "সবজি — রোগবালাই" },
  { value: "fruit-care", label: "ফল — রোগ ও পরিচর্যা" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const DEFAULT_SECTIONS = {
  introduction: "",
  damageExtent: "",
  precautions: "",
  symptoms: "",
  actions: "",
};

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB

const normalizeSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .toLowerCase();

export default function AddCropDetailsPage() {
  const [category, setCategory] = useState("");
  const [cropName, setCropName] = useState("");
  const [cropTitle, setCropTitle] = useState("");
  const [status, setStatus] = useState("published");
  const [season, setSeason] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [sections, setSections] = useState({ ...DEFAULT_SECTIONS });
  const [markAsNone, setMarkAsNone] = useState({
    introduction: false,
    damageExtent: false,
    precautions: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const slug = useMemo(
    () => (cropTitle.trim() || cropName.trim() ? normalizeSlug(cropTitle || cropName) : ""),
    [cropName, cropTitle]
  );

  const imagePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ""), [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const payload = useMemo(() => {
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const detailSections = {
      introduction: markAsNone.introduction ? "নাই" : sections.introduction.trim(),
      damageExtent: markAsNone.damageExtent ? "নাই" : sections.damageExtent.trim(),
      precautions: markAsNone.precautions ? "নাই" : sections.precautions.trim(),
      symptoms: sections.symptoms.trim(),
      actions: sections.actions.trim(),
    };

    return {
      category,
      cropName: cropName.trim(),
      cropTitle: cropTitle.trim(),
      slug,
      status,
      season: season.trim(),
      tags: tagsArray,
      image: imageFile
        ? {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type,
          }
        : null,
      details: detailSections,
      meta: {
        createdBy: "admin",
        createdAt: new Date().toISOString(),
      },
    };
  }, [category, cropName, cropTitle, slug, status, season, tags, imageFile, sections, markAsNone]);

  const validate = () => {
    if (!payload.category) return "Please select a crop category";
    if (!payload.cropName) return "Crop name is required";
    if (!payload.cropTitle) return "Crop title is required";
    if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
      return `Image "${imageFile.name}" exceeds ${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB`;
    }
    return null;
  };

  const resetForm = () => {
    setCategory("");
    setCropName("");
    setCropTitle("");
    setStatus("published");
    setSeason("");
    setTags("");
    setImageFile(null);
    setSections({ ...DEFAULT_SECTIONS });
    setMarkAsNone({
      introduction: false,
      damageExtent: false,
      precautions: false,
    });
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
    const toastId = toast.loading("Saving crop details...");
    try {
      const response = await fakeSubmit(payload);
      setLastSubmitted({ id: response.id, ...payload });
      toast.success("Crop details saved!", { id: toastId });
      resetForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const updateSection = (key, value) =>
    setSections((prev) => ({
      ...prev,
      [key]: value,
    }));

  const toggleNone = (key) =>
    setMarkAsNone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key]) return next;
      setSections((prevSections) => ({
        ...prevSections,
        [key]: "",
      }));
      return next;
    });

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Add Crop Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/crops/manage-details">Manage Crop Details</a>
                </li>
                <li className="breadcrumb-item active">Add Crop Details</li>
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
                    <h3 className="card-title mb-0">Primary Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="category">
                        Crop Category <span className="text-danger">*</span>
                      </label>
                      <select
                        id="category"
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
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="cropName">
                          Crop Name <span className="text-danger">*</span>
                        </label>
                        <input
                          id="cropName"
                          type="text"
                          className="form-control"
                          placeholder="Enter crop name"
                          value={cropName}
                          onChange={(event) => setCropName(event.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="cropTitle">
                          Crop Title <span className="text-danger">*</span>
                        </label>
                        <input
                          id="cropTitle"
                          type="text"
                          className="form-control"
                          placeholder="Headline for this entry"
                          value={cropTitle}
                          onChange={(event) => setCropTitle(event.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
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
                      <div className="form-group col-md-6">
                        <label htmlFor="season">Season Window</label>
                        <input
                          id="season"
                          type="text"
                          className="form-control"
                          placeholder="e.g., Boishakh - Ashwin"
                          value={season}
                          onChange={(event) => setSeason(event.target.value)}
                        />
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
                      <small className="form-text text-muted">Helps group similar crop issues.</small>
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-info mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Crop Media</h3>
                  </div>
                  <div className="card-body">
                    <div className="custom-file">
                      <input
                        id="cropImage"
                        type="file"
                        accept="image/*"
                        className="custom-file-input"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setImageFile(file);
                        }}
                      />
                      <label className="custom-file-label" htmlFor="cropImage">
                        {imageFile ? imageFile.name : "Choose crop image"}
                      </label>
                    </div>
                    <small className="form-text text-muted">
                      PNG or JPG up to {Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB.
                    </small>
                    {imagePreview && (
                      <div className="mt-3">
                        <img src={imagePreview} alt="Crop preview" className="img-fluid rounded border" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="card card-outline card-success">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Detailed Guidance</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="mb-0" htmlFor="introduction">
                          পরিচিতি (Introduction)
                        </label>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0"
                          onClick={() => toggleNone("introduction")}
                        >
                          {markAsNone.introduction ? "Undo 'নাই'" : "Mark as 'নাই'"}
                        </button>
                      </div>
                      <textarea
                        id="introduction"
                        className="form-control"
                        rows={3}
                        placeholder="ফসলের রোগ/পোকার পরিচিতি লিখুন"
                        value={markAsNone.introduction ? "" : sections.introduction}
                        onChange={(event) => updateSection("introduction", event.target.value)}
                        disabled={markAsNone.introduction}
                      />
                    </div>
                    <div className="form-group">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="mb-0" htmlFor="damageExtent">
                          ক্ষতির ব্যপ্তি (Damage extent)
                        </label>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0"
                          onClick={() => toggleNone("damageExtent")}
                        >
                          {markAsNone.damageExtent ? "Undo 'নাই'" : "Mark as 'নাই'"}
                        </button>
                      </div>
                      <textarea
                        id="damageExtent"
                        className="form-control"
                        rows={3}
                        placeholder="ক্ষতির বিস্তার/প্রভাব"
                        value={markAsNone.damageExtent ? "" : sections.damageExtent}
                        onChange={(event) => updateSection("damageExtent", event.target.value)}
                        disabled={markAsNone.damageExtent}
                      />
                    </div>
                    <div className="form-group">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="mb-0" htmlFor="precautions">
                          সাবধানতা (Precautions)
                        </label>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0"
                          onClick={() => toggleNone("precautions")}
                        >
                          {markAsNone.precautions ? "Undo 'নাই'" : "Mark as 'নাই'"}
                        </button>
                      </div>
                      <textarea
                        id="precautions"
                        className="form-control"
                        rows={3}
                        placeholder="প্রাথমিক সাবধানতা বা প্রতিরোধ ব্যবস্থা"
                        value={markAsNone.precautions ? "" : sections.precautions}
                        onChange={(event) => updateSection("precautions", event.target.value)}
                        disabled={markAsNone.precautions}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="symptoms">রোগের লক্ষণ</label>
                      <textarea
                        id="symptoms"
                        className="form-control"
                        rows={4}
                        placeholder="লক্ষণগুলো বিস্তারিত লিখুন"
                        value={sections.symptoms}
                        onChange={(event) => updateSection("symptoms", event.target.value)}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="actions">করনীয়</label>
                      <textarea
                        id="actions"
                        className="form-control"
                        rows={4}
                        placeholder="প্রস্তাবিত পদক্ষেপ ও কৃষি পরামর্শ"
                        value={sections.actions}
                        onChange={(event) => updateSection("actions", event.target.value)}
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
                      <dt>Category</dt>
                      <dd>{CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label || "—"}</dd>
                      <dt>Crop Name</dt>
                      <dd>{payload.cropName || "—"}</dd>
                      <dt>Title</dt>
                      <dd>{payload.cropTitle || "—"}</dd>
                      <dt>Slug</dt>
                      <dd>{slug || "Auto-generated"}</dd>
                      <dt>Status</dt>
                      <dd>{STATUS_OPTIONS.find((opt) => opt.value === status)?.label}</dd>
                      <dt>Season</dt>
                      <dd>{payload.season || "—"}</dd>
                      <dt>Tags</dt>
                      <dd>{payload.tags.length ? payload.tags.join(", ") : "—"}</dd>
                    </dl>
                  </div>
                </div>

                <div className="card card-outline card-dark mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Submission JSON</h3>
                  </div>
                  <div className="card-body" style={{ maxHeight: 320, overflowY: "auto" }}>
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
                        resetForm();
                        setLastSubmitted(null);
                      }}
                      disabled={submitting}
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Details"}
                    </button>
                  </div>
                </div>

                <div className="text-right mt-3">
                  <a href="/admin/crops/manage-details" className="btn btn-link p-0">
                    Manage Crop Details
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
