import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const fakeSubmit = (payload) =>
  new Promise((resolve, reject) => {
    const delay = 800 + Math.random() * 900;
    setTimeout(() => {
      if (Math.random() < 0.12) reject(new Error("Server took too long. Please try again."));
      else resolve({ ok: true, id: Math.random().toString(36).slice(2) });
    }, delay);
  });

const CATEGORY_OPTIONS = [
  { value: "herbicide", label: "আগাছানাশক" },
  { value: "insecticide", label: "কীটনাশক" },
  { value: "fungicide", label: "ছত্রাকনাশক" },
  { value: "micronutrient", label: "অনুখাদ্য" },
];

const COMPANY_OPTIONS = [
  { value: "aci-crop-care", label: "এ সি আই ক্রপ কেয়ার" },
  { value: "auto-crop-care", label: "অটো ক্রপ কেয়ার লিঃ" },
  { value: "importer-list", label: "আমদানী ও পরিবেশক তালিকাসমূহ" },
  { value: "syngenta", label: "সিনজেনটা" },
  { value: "abcd", label: "এবিসিডি Agro" },
  { value: "abedin", label: "আবেদিন ক্রপ কেয়ার লিঃ" },
  { value: "bayer", label: "বায়ার কেয়ার" },
];

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
const EMPTY_APPLICATION = { crop: "", pest: "", dosage: "", instruction: "" };

const normalizeSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .toLowerCase();

export default function AddProductPage() {
  const [productName, setProductName] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [benefits, setBenefits] = useState("");
  const [applications, setApplications] = useState([{ ...EMPTY_APPLICATION }]);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const slug = useMemo(() => {
    const primary = productName.trim();
    const fallback = materialName.trim();
    const source = primary || fallback;
    return source ? normalizeSlug(source) : "";
  }, [productName, materialName]);

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const payload = useMemo(() => {
    const cleanedApplications = applications
      .map((row) => ({
        crop: row.crop.trim(),
        pest: row.pest.trim(),
        dosage: row.dosage.trim(),
        instruction: row.instruction.trim(),
      }))
      .filter((row) => Object.values(row).some(Boolean));

    return {
      productName: productName.trim(),
      materialName: materialName.trim(),
      category,
      company,
      slug,
      benefits: benefits.trim(),
      applications: cleanedApplications,
      image: imageFile
        ? {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type,
          }
        : null,
      meta: {
        createdBy: "admin",
        createdAt: new Date().toISOString(),
      },
    };
  }, [productName, materialName, category, company, slug, benefits, applications, imageFile]);

  const validate = () => {
    if (!payload.productName) return "Product name is required";
    if (!payload.category) return "Select a product category";
    if (!payload.company) return "Select a company";
    if (!payload.applications.length)
      return "Add at least one application row with details";
    if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
      return `Image "${imageFile.name}" is larger than ${Math.round(
        MAX_IMAGE_SIZE / (1024 * 1024)
      )}MB`;
    }
    return null;
  };

  const resetForm = () => {
    setProductName("");
    setMaterialName("");
    setCategory("");
    setCompany("");
    setBenefits("");
    setApplications([{ ...EMPTY_APPLICATION }]);
    setImageFile(null);
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
    const toastId = toast.loading("Saving product...");
    try {
      await fakeSubmit(payload);
      toast.success("Product saved!", { id: toastId });
      resetForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const updateApplication = (index, key, value) => {
    setApplications((prev) =>
      prev.map((row, idx) =>
        idx === index
          ? {
              ...row,
              [key]: value,
            }
          : row
      )
    );
  };

  const addApplicationRow = () => {
    setApplications((prev) => [...prev, { ...EMPTY_APPLICATION }]);
  };

  const removeApplicationRow = (index) => {
    setApplications((prev) =>
      prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)
    );
  };

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Add Products</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                </li>
                <li className="breadcrumb-item">
                  <NavLink to="/admin/products/manage-details">Manage Products Details</NavLink>
                </li>
                <li className="breadcrumb-item active">Add Products</li>
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
                    <h3 className="card-title mb-0">Product Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="productName">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        id="productName"
                        type="text"
                        className="form-control"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="materialName">Product Material Name</label>
                      <input
                        id="materialName"
                        type="text"
                        className="form-control"
                        placeholder="Enter product material name"
                        value={materialName}
                        onChange={(event) => setMaterialName(event.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="category">
                          Product Category <span className="text-danger">*</span>
                        </label>
                        <select
                          id="category"
                          className="form-control"
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select product category
                          </option>
                          {CATEGORY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="company">
                          Company Name <span className="text-danger">*</span>
                        </label>
                        <select
                          id="company"
                          className="form-control"
                          value={company}
                          onChange={(event) => setCompany(event.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select company name
                          </option>
                          {COMPANY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="benefits">উপকারিতা ও ব্যবহার সংক্ষেপ</label>
                      <textarea
                        id="benefits"
                        className="form-control"
                        rows={4}
                        placeholder="ব্যবহারের সুবিধা গুলো"
                        value={benefits}
                        onChange={(event) => setBenefits(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="card card-outline card-info mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Product Image</h3>
                  </div>
                  <div className="card-body">
                    <div className="custom-file">
                      <input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        className="custom-file-input"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setImageFile(file);
                        }}
                      />
                      <label className="custom-file-label" htmlFor="productImage">
                        {imageFile ? imageFile.name : "Choose product image"}
                      </label>
                    </div>
                    <small className="form-text text-muted">
                      PNG or JPG up to {Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB.
                    </small>
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="img-fluid rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="card card-outline card-success">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">Application Details</h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addApplicationRow}
                    >
                      Add Row
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>ফসল</th>
                            <th>বালাই</th>
                            <th>মাত্রা</th>
                            <th>ব্যবহারবিধি</th>
                            <th style={{ width: 110 }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((row, index) => (
                            <tr key={`app-row-${index}`}>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="ফসলের নাম"
                                  value={row.crop}
                                  onChange={(event) =>
                                    updateApplication(index, "crop", event.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="আক্রান্ত বালাই"
                                  value={row.pest}
                                  onChange={(event) =>
                                    updateApplication(index, "pest", event.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="প্রয়োগের মাত্রা"
                                  value={row.dosage}
                                  onChange={(event) =>
                                    updateApplication(index, "dosage", event.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="ব্যবহারবিধি"
                                  value={row.instruction}
                                  onChange={(event) =>
                                    updateApplication(index, "instruction", event.target.value)
                                  }
                                />
                              </td>
                              <td className="text-center align-middle">
                                <div className="btn-group btn-group-sm">
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeApplicationRow(index)}
                                    disabled={applications.length === 1}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card card-outline card-success mt-3">
                  <div className="card-body">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 mb-2"
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : "Save Product"}
                    </button>
                    <NavLink to="/admin/products/manage-details" className="btn btn-outline-secondary w-100">
                      Manage Product Details
                    </NavLink>
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
