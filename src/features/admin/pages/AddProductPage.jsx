import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { fetchAllCompanies, addProduct } from "../../../api/authApi"; // adjust path

const CATEGORY_OPTIONS = [
  { value: "আগাছানাশক", label: "আগাছানাশক" },
  { value: "কীটনাশক", label: "কীটনাশক" },
  { value: "ছত্রাকনাশক", label: "ছত্রাকনাশক" },
  { value: "অনুখাদ্য", label: "অনুখাদ্য" },
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
  const [companies, setCompanies] = useState([]);

  const slug = useMemo(() => {
    const source = productName.trim() || materialName.trim();
    return source ? normalizeSlug(source) : "";
  }, [productName, materialName]);

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  useEffect(() => {
    if (imagePreview) return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  // fetch companies on mount
  useEffect(() => {
    fetchAllCompanies()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setCompanies(res.data);
        else toast.error("Failed to load companies");
      })
      .catch(() => toast.error("Failed to fetch companies"));
  }, []);

  const payload = useMemo(() => {
    const cleanedApplications = applications
      .map((row) => ({
        crop: row.crop.trim(),
        pest: row.pest.trim(),
        dosage: row.dosage.trim(),
        instruction: row.instruction.trim(),
      }))
      .filter((row) => Object.values(row).some(Boolean));

    const formData = new FormData();
    formData.append("productName", productName.trim());
    formData.append("materialName", materialName.trim());
    formData.append("category", category);
    formData.append("company", company); // backend expects ObjectId
    formData.append("beboharerShubidha", benefits.trim());
    formData.append(
      "foshol",
      JSON.stringify(cleanedApplications.map((r) => r.crop))
    );
    formData.append(
      "balai",
      JSON.stringify(cleanedApplications.map((r) => r.pest))
    );
    formData.append(
      "matra",
      JSON.stringify(cleanedApplications.map((r) => r.dosage))
    );
    formData.append(
      "beboharBidhi",
      JSON.stringify(cleanedApplications.map((r) => r.instruction))
    );
    if (imageFile) formData.append("productImage", imageFile);
    formData.append("slug", slug);
    return formData;
  }, [
    productName,
    materialName,
    category,
    company,
    benefits,
    applications,
    imageFile,
    slug,
  ]);

  const validate = () => {
    if (!productName) return "Product name is required";
    if (!category) return "Select a product category";
    if (!company) return "Select a company";
    if (!applications.length)
      return "Add at least one application row with details";
    if (imageFile && imageFile.size > MAX_IMAGE_SIZE)
      return `Image "${imageFile.name}" is larger than ${Math.round(
        MAX_IMAGE_SIZE / (1024 * 1024)
      )}MB`;
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
      await addProduct(payload);
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
      prev.map((row, idx) => (idx === index ? { ...row, [key]: value } : row))
    );
  };

  const addApplicationRow = () =>
    setApplications((prev) => [...prev, { ...EMPTY_APPLICATION }]);
  const removeApplicationRow = (index) =>
    setApplications((prev) =>
      prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)
    );

  return (
    <div
      className="content-wrapper _scoped_admin"
      style={{ minHeight: "839px" }}>
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
                  <NavLink to="/admin/products/manage-details">
                    Manage Products Details
                  </NavLink>
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
                {/* Product Info */}
                <div className="card card-outline card-primary mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Product Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Product Material Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter material name"
                        value={materialName}
                        onChange={(e) => setMaterialName(e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>
                          Product Category{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required>
                          <option
                            value=""
                            hidden>
                            Select product category
                          </option>
                          {CATEGORY_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label>
                          Company Name <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          required>
                          <option
                            value=""
                            hidden>
                            Select company
                          </option>
                          {companies.map((c) => (
                            <option
                              key={c._id}
                              value={c._id}>
                              {c.banglaName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group mb-0">
                      <label>উপকারিতা ও ব্যবহার সংক্ষেপ</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="ব্যবহারের সুবিধা"
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="card card-outline card-info mb-3">
                  <div className="card-header">
                    <h3 className="card-title mb-0">Product Image</h3>
                  </div>
                  <div className="card-body">
                    <div className="custom-file">
                      <input
                        type="file"
                        accept="image/*"
                        className="custom-file-input"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                      />
                      <label className="custom-file-label">
                        {imageFile ? imageFile.name : "Choose product image"}
                      </label>
                    </div>
                    <small className="form-text text-muted">
                      PNG or JPG up to{" "}
                      {Math.round(MAX_IMAGE_SIZE / (1024 * 1024))}MB.
                    </small>
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="img-fluid rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Applications */}
                <div className="card card-outline card-success">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">Application Details</h3>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addApplicationRow}>
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
                            <tr key={index}>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="ফসল"
                                  value={row.crop}
                                  onChange={(e) =>
                                    updateApplication(
                                      index,
                                      "crop",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="বালাই"
                                  value={row.pest}
                                  onChange={(e) =>
                                    updateApplication(
                                      index,
                                      "pest",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="মাত্রা"
                                  value={row.dosage}
                                  onChange={(e) =>
                                    updateApplication(
                                      index,
                                      "dosage",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  placeholder="ব্যবহারবিধি"
                                  value={row.instruction}
                                  onChange={(e) =>
                                    updateApplication(
                                      index,
                                      "instruction",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="text-center align-middle">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => removeApplicationRow(index)}
                                  disabled={applications.length === 1}>
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="card card-outline card-success mt-3">
                  <div className="card-body">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 mb-2"
                      disabled={submitting}>
                      {submitting ? "Saving..." : "Save Product"}
                    </button>
                    <NavLink
                      to="/admin/products/manage-details"
                      className="btn btn-outline-secondary w-100">
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
