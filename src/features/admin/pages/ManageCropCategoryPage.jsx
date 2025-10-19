import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../styles/adminScoped.css";
import EditBadgeIcon from "@/assets/IconComponents/EditBadgeIcon";
import DeleteBadgeIcon from "@/assets/IconComponents/DeleteBadgeIcon";
import SearchIcon from "@/assets/IconComponents/SearchIcon";

const STORAGE_KEY = "admin.manageCropCategory";
const CATEGORY_OPTIONS = ["ক্ষতিকর পোকামাকড়", "রোগবালাই", "সার প্রয়োগ", "আবহাওয়া সতর্কতা"];

const RAW_CATEGORIES = [
  {
    id: 21,
    banglaName: "পটল",
    englishName: "Potol",
    categoryName: "ক্ষতিকর পোকামাকড়",
    status: 0,
  },
  {
    id: 22,
    banglaName: "পেপে",
    englishName: "Pepe",
    categoryName: "রোগবালাই",
    status: 0,
  },
  {
    id: 23,
    banglaName: "ধান",
    englishName: "Rice",
    categoryName: "ক্ষতিকর পোকামাকড়",
    status: 0,
  },
  {
    id: 24,
    banglaName: "টমেটো",
    englishName: "Tomato",
    categoryName: "রোগবালাই",
    status: 1,
  },
  {
    id: 25,
    banglaName: "আলু",
    englishName: "Potato",
    categoryName: "সার প্রয়োগ",
    status: 1,
  },
  {
    id: 26,
    banglaName: "গম",
    englishName: "Wheat",
    categoryName: "আবহাওয়া সতর্কতা",
    status: 1,
  },
];

const normalizeCategory = (category, index) => {
  if (!category || typeof category !== "object") return null;
  return {
    no: category.no ?? index + 1,
    id: category.id ?? index + 1,
    banglaName: category.banglaName ?? "",
    englishName: category.englishName ?? "",
    categoryName: category.categoryName ?? "",
    status: Number.isFinite(category.status) ? category.status : 0,
  };
};

const loadStoredCategories = () => {
  if (typeof window === "undefined") return RAW_CATEGORIES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return RAW_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return RAW_CATEGORIES;
    const normalized = parsed.map((item, index) => normalizeCategory(item, index)).filter(Boolean);
    return normalized.length ? normalized : RAW_CATEGORIES;
  } catch (error) {
    console.warn("Failed to load stored crop categories", error);
    return RAW_CATEGORIES;
  }
};

const highlightClass = (categoryName) =>
  categoryName === "ক্ষতিকর পোকামাকড়" ? "cropctgred" : "";

export default function ManageCropCategoryPage() {
  const [categories, setCategories] = useState(loadStoredCategories);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({
    banglaName: "",
    englishName: "",
    categoryName: CATEGORY_OPTIONS[0],
  });
  const [removing, setRemoving] = useState({});
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.warn("Failed to persist crop categories", error);
    }
    return undefined;
  }, [categories]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((item) => {
      return (
        item.banglaName.toLowerCase().includes(term) ||
        item.englishName.toLowerCase().includes(term) ||
        item.categoryName.toLowerCase().includes(term) ||
        String(item.id).includes(term) ||
        String(item.no ?? "").includes(term)
      );
    });
  }, [categories, search]);

  const handleDelete = (category) => {
    setRemoving((prev) => ({ ...prev, [category.id]: true }));
    setTimeout(() => {
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
      setRemoving((prev) => {
        const next = { ...prev };
        delete next[category.id];
        return next;
      });
      toast.success(`Crop category #${category.id} deleted`);
    }, 260);
  };

  const handleEditStart = (category) => {
    setEditing(category);
    setFormState({
      banglaName: category.banglaName,
      englishName: category.englishName,
      categoryName: category.categoryName,
    });
  };

  const handleModalClose = () => setEditing(null);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!editing) return;
    const trimmedBangla = formState.banglaName.trim();
    const trimmedEnglish = formState.englishName.trim();
    if (!trimmedBangla || !trimmedEnglish) {
      toast.error("Bangla and English names are required.");
      return;
    }
    const toastId = toast.loading("Saving changes...");
    setCategories((prev) =>
      prev.map((item) => {
        if (item.id !== editing.id) return item;
        return {
          ...item,
          banglaName: trimmedBangla,
          englishName: trimmedEnglish,
          categoryName: formState.categoryName,
        };
      })
    );
    toast.success(`Crop category #${editing.id} updated`, { id: toastId });
    setEditing(null);
  };

  const totalCount = categories.length;
  const visibleCount = filtered.length;

  return (
    <div className="content-wrapper _scoped_admin" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Crop Category</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/admin/crops/manage-category">Crops</a>
                </li>
                <li className="breadcrumb-item active">Manage Category</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="card w-100">
              <div className="card-header d-flex flex-column flex-md-row gap-3 justify-content-md-between align-items-md-center">
                <h3 className="card-title mb-0">Total Crop Category = [{totalCount}]</h3>
                <span className="text-muted small">Showing {visibleCount} item{visibleCount === 1 ? "" : "s"}</span>
                <div className="input-group" style={{ maxWidth: 340 }}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <SearchIcon size={18} color="#64748b" />
                    </span>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="search"
                    className="form-control"
                    placeholder="Search by name or id"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search crop categories"
                  />
                </div>
              </div>

              <div className="card-body table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>ID</th>
                      <th>Crop Bangla Name</th>
                      <th>Crop English Name</th>
                      <th>Crop Category Name</th>
                      <th>Crop Category Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((category, index) => {
                      const rowIndex = index + 1;
                      return (
                        <tr
                          key={category.id}
                          id={`deletecropctgtr_${category.id}`}
                          className={removing[category.id] ? "is-removing" : ""}
                        >
                          <td>{rowIndex}</td>
                          <td>{category.id}</td>
                          <td>
                            <div className="d-flex">
                              <h5>{category.banglaName}</h5>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex">
                              <h5>{category.englishName}</h5>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex">
                              <h5 className={highlightClass(category.categoryName)}>{category.categoryName}</h5>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex">
                              <h5>{category.status}</h5>
                            </div>
                          </td>
                          <td className="cropandcompanydeletbtn">
                            <button
                              type="button"
                              className="admin-icon-btn admin-icon-btn--edit"
                              data-cid={category.id}
                              onClick={() => handleEditStart(category)}
                              aria-label={`Edit crop category ${category.banglaName}`}
                            >
                              <EditBadgeIcon size={30} />
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn admin-icon-btn--delete"
                              onClick={() => handleDelete(category)}
                              aria-label={`Delete crop category ${category.banglaName}`}
                            >
                              <DeleteBadgeIcon size={30} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          No crop categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {editing && (
        <div id="photo-modal" style={{ display: "flex" }} onClick={handleModalClose}>
          <div id="photo-modal-form" onClick={(event) => event.stopPropagation()}>
            <h2 className="edit-header">Edit Crop Category Box</h2>

            <form autoComplete="off" id="editFormData" onSubmit={handleFormSubmit}>
              <div className="card-bodyy">
                <div className="display-flex flex-column flex-md-row gap-3">
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_cropctg_bangname">Crop Bangla Name</label>
                    <input
                      type="text"
                      id="edit_cropctg_bangname"
                      name="banglaName"
                      value={formState.banglaName}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                    <input type="text" id="edit_crop_ctg_id" hidden value={editing.id} readOnly className="form-control" />
                  </div>

                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_cropctg_engname">Crop English Name</label>
                    <input
                      type="text"
                      id="edit_cropctg_engname"
                      name="englishName"
                      value={formState.englishName}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="display-flex flex-column flex-md-row gap-3">
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_crop_ctg">Crop Category Name</label>
                    <select
                      className="add-product-box form-control"
                      id="edit_crop_ctg"
                      name="categoryName"
                      value={formState.categoryName}
                      onChange={handleFormChange}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="card-footer faa d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary" onClick={handleModalClose}>
                  Cancel
                </button>
                <button type="submit" className="editcropctgid btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>

            <div id="photo-closebtn" role="button" tabIndex={0} onClick={handleModalClose}>
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
