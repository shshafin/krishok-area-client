import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const fakeSubmit = (payload) =>
  new Promise((resolve, reject) => {
    const ms = 700 + Math.random() * 900;
    setTimeout(() => {
      if (Math.random() < 0.12) reject(new Error("Network hiccup. Please retry."));
      else resolve({ ok: true, id: Math.random().toString(36).slice(2) });
    }, ms);
  });

const DIVISION_OPTIONS = [
  { value: "rajshahi", label: "রাজশাহী" },
  { value: "chittagong", label: "চট্টগ্রাম" },
  { value: "khulna", label: "খুলনা" },
  { value: "barishal", label: "বরিশাল" },
  { value: "sylhet", label: "সিলেট" },
  { value: "rangpur", label: "রংপুর" },
  { value: "mymensingh", label: "ময়মনসিংহ" },
  { value: "dhaka", label: "ঢাকা" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;

const normalizeSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .toLowerCase();

export default function AddDistrictPage() {
  const [nameBn, setNameBn] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [division, setDivision] = useState("");
  const [status, setStatus] = useState("published");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [mapFile, setMapFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  const slug = useMemo(() => {
    const base = nameEn.trim() || nameBn.trim();
    return base ? normalizeSlug(base) : "";
  }, [nameBn, nameEn]);

  const photoPreview = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : ""),
    [photoFile]
  );
  const mapPreview = useMemo(
    () => (mapFile ? URL.createObjectURL(mapFile) : ""),
    [mapFile]
  );

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      if (mapPreview) URL.revokeObjectURL(mapPreview);
    };
  }, [photoPreview, mapPreview]);

  const payload = useMemo(
    () => ({
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim(),
      division,
      status,
      slug,
      tags: tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: description.trim(),
      media: {
        photo: photoFile
          ? { name: photoFile.name, size: photoFile.size, type: photoFile.type }
          : null,
        map: mapFile
          ? { name: mapFile.name, size: mapFile.size, type: mapFile.type }
          : null,
      },
      meta: {
        createdBy: "admin",
        createdAt: new Date().toISOString(),
      },
    }),
    [nameBn, nameEn, division, status, slug, tags, description, photoFile, mapFile]
  );

  const validate = () => {
    if (!payload.nameBn) return "District name (Bangla) is required";
    if (!payload.division) return "Select a division";
    if (!payload.description) return "Provide district details";
    if (photoFile && photoFile.size > MAX_IMAGE_SIZE) {
      return `Photo "${photoFile.name}" exceeds ${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB`;
    }
    if (mapFile && mapFile.size > MAX_IMAGE_SIZE) {
      return `Map "${mapFile.name}" exceeds ${Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB`;
    }
    return null;
  };

  const resetForm = () => {
    setNameBn("");
    setNameEn("");
    setDivision("");
    setStatus("published");
    setDescription("");
    setTags("");
    setPhotoFile(null);
    setMapFile(null);
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
    const toastId = toast.loading("Saving district...");
    try {
      const response = await fakeSubmit(payload);
      setLastSubmitted({ id: response.id, ...payload });
      toast.success("District saved!", { id: toastId });
      resetForm();
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
              <h1 className="m-0">Add District</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/locations/manage-district">Manage District</a>
                </li>
                <li className="breadcrumb-item active">Add District</li>
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
                    <h3 className="card-title mb-0">District Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="nameBn">
                          District Name (Bangla) <span className="text-danger">*</span>
                        </label>
                        <input
                          id="nameBn"
                          type="text"
                          className="form-control"
                          placeholder="জেলার নাম লিখুন"
                          value={nameBn}
                          onChange={(event) => setNameBn(event.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="nameEn">District Name (English)</label>
                        <input
                          id="nameEn"
                          type="text"
                          className="form-control"
                          placeholder="Enter district name in English"
                          value={nameEn}
                          onChange={(event) => setNameEn(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="division">
                          Division <span className="text-danger">*</span>
                        </label>
                        <select
                          id="division"
                          className="form-control"
                          value={division}
                          onChange={(event) => setDivision(event.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select division
                          </option>
                          {DIVISION_OPTIONS.map((option) => (
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
                    <div className="form-group">
                      <label htmlFor="tags">Tags</label>
                      <input
                        id="tags"
                        type="text"
                        className="form-control"
                        placeholder="Comma separated tags (e.g., কৃষি, ভ্রমণ, ইতিহাস)"
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="description">
                        District Details <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id="description"
                        className="form-control"
                        rows={5}
                        placeholder="অবকাঠামো, কৃষি, ইতিহাস বা বিশেষ বৈশিষ্ট্য সম্পর্কে লিখুন"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-info">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Media Uploads</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="photoFile">District Photo</label>
                      <div className="custom-file">
                        <input
                          id="photoFile"
                          type="file"
                          accept="image/*"
                          className="custom-file-input"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setPhotoFile(file);
                          }}
                        />
                        <label className="custom-file-label" htmlFor="photoFile">
                          {photoFile ? photoFile.name : "Choose district image"}
                        </label>
                      </div>
                      <small className="form-text text-muted">
                        Recommended size 1280x720px, JPG/PNG up to{" "}
                        {Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB.
                      </small>
                      {photoPreview && (
                        <div className="mt-3">
                          <img
                            src={photoPreview}
                            alt="District preview"
                            className="img-fluid rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-0">
                      <label htmlFor="mapFile">District Map</label>
                      <div className="custom-file">
                        <input
                          id="mapFile"
                          type="file"
                          accept="image/*"
                          className="custom-file-input"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setMapFile(file);
                          }}
                        />
                        <label className="custom-file-label" htmlFor="mapFile">
                          {mapFile ? mapFile.name : "Upload district map image"}
                        </label>
                      </div>
                      <small className="form-text text-muted">
                        Optional. Include clear boundary map if available.
                      </small>
                      {mapPreview && (
                        <div className="mt-3">
                          <img
                            src={mapPreview}
                            alt="Map preview"
                            className="img-fluid rounded border"
                          />
                        </div>
                      )}
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
                      <dt>District</dt>
                      <dd>{payload.nameBn || "—"}</dd>
                      <dt>English Name</dt>
                      <dd>{payload.nameEn || "—"}</dd>
                      <dt>Division</dt>
                      <dd>
                        {DIVISION_OPTIONS.find((opt) => opt.value === division)?.label || "—"}
                      </dd>
                      <dt>Status</dt>
                      <dd>{STATUS_OPTIONS.find((opt) => opt.value === status)?.label}</dd>
                      <dt>Slug</dt>
                      <dd>{slug || "Auto-generated"}</dd>
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
                      {submitting ? "Saving..." : "Save District"}
                    </button>
                  </div>
                </div>

                <div className="text-right mt-3">
                  <a href="/admin/locations/manage-district" className="btn btn-link p-0">
                    Manage Districts
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
