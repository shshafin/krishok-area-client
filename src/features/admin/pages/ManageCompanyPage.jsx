import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import EditBadgeIcon from "@/assets/IconComponents/EditBadgeIcon";
import DeleteBadgeIcon from "@/assets/IconComponents/DeleteBadgeIcon";
import SearchIcon from "@/assets/IconComponents/SearchIcon";
import AdminDataTable from "@/features/admin/components/AdminDataTable";
import "../styles/adminScoped.css";

const STORAGE_KEY = "admin.manageCompany";

const RAW_COMPANIES = [
  {
    no: 1,
    id: 1,
    banglaName: "এ সি আই ক্রপ কেয়ার 101",
    englishName: "ok aci ok 10 10",
    title: "",
    status: 0,
  },
  {
    no: 2,
    id: 2,
    banglaName: "অটো ক্রপ কেয়ার লিঃ ok",
    englishName: "pl",
    title: "ok",
    status: 0,
  },
  {
    no: 3,
    id: 11,
    banglaName: "আমদানী, বাজারজাতকারী ও পরিবেশক কোম্পানীর তালিকাসমূহ",
    englishName: "নাইok",
    title: "",
    status: 0,
  },
  {
    no: 4,
    id: 17,
    banglaName: "সিনজেনটা",
    englishName: "নাই",
    title: "",
    status: 0,
  },
  {
    no: 5,
    id: 19,
    banglaName: "এবিসিডি11",
    englishName: "নাই",
    title: "",
    status: 0,
  },
  {
    no: 6,
    id: 20,
    banglaName: "আবেদিন ক্রপ কেয়ার লিঃ",
    englishName: "অটো ক্রপ কেয়ার লিঃ এর একটি সহযোগী প্রতিষ্ঠান",
    title: "অটো ক্রপ কেয়ার লিঃ এর একটি সহযোগী প্রতিষ্ঠান",
    status: 0,
  },
  {
    no: 7,
    id: 21,
    banglaName: "বায়ার কেয়ার",
    englishName: "bayar cear",
    title: "বায়ার কেয়ার বায়ার কেয়ার বায়ার কেয়ার",
    status: 0,
  },
];

const STATUS_OPTIONS = [
  { label: "Inactive (0)", value: 0 },
  { label: "Active (1)", value: 1 },
];

const normalizeCompany = (company, index) => {
  if (!company || typeof company !== "object") return null;
  return {
    no: company.no ?? index + 1,
    id: company.id ?? index + 1,
    banglaName: company.banglaName ?? "",
    englishName: company.englishName ?? "",
    title: company.title ?? "",
    status: Number.isFinite(company.status) ? company.status : 0,
  };
};

const loadStoredCompanies = () => {
  if (typeof window === "undefined") return RAW_COMPANIES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return RAW_COMPANIES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return RAW_COMPANIES;
    const normalized = parsed.map((item, index) => normalizeCompany(item, index)).filter(Boolean);
    return normalized.length ? normalized : RAW_COMPANIES;
  } catch (error) {
    console.warn("Failed to load stored companies", error);
    return RAW_COMPANIES;
  }
};

export default function ManageCompanyPage() {
  const [companies, setCompanies] = useState(loadStoredCompanies);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({
    banglaName: "",
    englishName: "",
    title: "",
    status: 0,
  });
  const [removing, setRemoving] = useState({});
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    } catch (error) {
      console.warn("Failed to persist companies", error);
    }
    return undefined;
  }, [companies]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return companies;
    return companies.filter((item) => {
      return (
        item.banglaName.toLowerCase().includes(term) ||
        item.englishName.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term) ||
        String(item.id).includes(term) ||
        String(item.no ?? "").includes(term)
      );
    });
  }, [companies, search]);

  const handleDelete = (company) => {
    setRemoving((prev) => ({ ...prev, [company.id]: true }));
    setTimeout(() => {
      setCompanies((prev) => prev.filter((item) => item.id !== company.id));
      setRemoving((prev) => {
        const next = { ...prev };
        delete next[company.id];
        return next;
      });
      toast.success(`"${company.banglaName}" কোম্পানি তালিকা থেকে সরানো হয়েছে।`);
    }, 280);
  };

  const handleEditStart = (company) => {
    setEditing(company);
    setFormState({
      banglaName: company.banglaName,
      englishName: company.englishName,
      title: company.title,
      status: company.status,
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const handleModalClose = () => {
    setEditing(null);
    setFormState({
      banglaName: "",
      englishName: "",
      title: "",
      status: 0,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!editing) return;

    const payload = {
      ...editing,
      ...formState,
    };

    setCompanies((prev) => prev.map((item) => (item.id === editing.id ? payload : item)));
    toast.success(`"${payload.banglaName}" কোম্পানি তথ্য হালনাগাদ হয়েছে।`);
    handleModalClose();
  };

  const totalCompanies = companies.length;
  const totalActive = companies.filter((item) => item.status === 1).length;

  return (
    <div className="content-wrapper _scoped_admin">
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 align-items-center">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Company</h1>
              <p className="text-muted mt-1 mb-0">Keep company records organised and current.</p>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                </li>
                <li className="breadcrumb-item active">Manage Company</li>
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
                <h3 className="card-title mb-0">Total Company Category = [{totalCompanies}]</h3>
                <span className="text-muted small">Currently active companies: {totalActive}</span>
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
                    placeholder="Search companies..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search companies"
                  />
                </div>
              </div>

              <div className="card-body">
                <AdminDataTable
                  columns={[
                    {
                      key: "no",
                      label: "NO",
                      render: (_, index) => index + 1,
                    },
                    { key: "id", label: "ID" },
                    {
                      key: "banglaName",
                      label: "Company Bangla Name",
                      render: (row) => (
                        <div className="d-flex">
                          <h5>{row.banglaName || "-"}</h5>
                        </div>
                      ),
                    },
                    {
                      key: "englishName",
                      label: "Company English Name",
                      render: (row) => (
                        <div className="d-flex">
                          <h5>{row.englishName || "-"}</h5>
                        </div>
                      ),
                    },
                    {
                      key: "title",
                      label: "Company Name Title",
                      render: (row) => (
                        <div className="d-flex">
                          <h5>{row.title || "-"}</h5>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      label: "Company Status",
                      render: (row) => (
                        <span className={`badge badge-${row.status === 1 ? "success" : "muted"}`}>{row.status}</span>
                      ),
                    },
                    {
                      key: "actions",
                      label: "Actions",
                      cellClassName: "cropandcompanydeletbtn text-right",
                      render: (row) => (
                        <>
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn--edit"
                            onClick={() => handleEditStart(row)}
                            aria-label={`Edit company ${row.banglaName}`}
                          >
                            <EditBadgeIcon size={28} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn--delete"
                            onClick={() => handleDelete(row)}
                            aria-label={`Delete company ${row.banglaName}`}
                          >
                            <DeleteBadgeIcon size={28} />
                          </button>
                        </>
                      ),
                    },
                  ]}
                  rows={filtered}
                  emptyMessage="No companies found."
                  getRowKey={(row) => row.id}
                  getRowClassName={(row) => (removing[row.id] ? "is-removing" : "")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {editing && (
        <div id="photo-modal" style={{ display: "flex" }} onClick={handleModalClose}>
          <div id="photo-modal-form" onClick={(event) => event.stopPropagation()}>
            <h2 className="edit-header">Edit Company</h2>

            <form autoComplete="off" id="editCompanyForm" onSubmit={handleFormSubmit}>
              <div className="card-bodyy">
                <div className="display-flex flex-column flex-md-row gap-3">
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_company_bn">Company Bangla Name</label>
                    <input
                      type="text"
                      id="edit_company_bn"
                      name="banglaName"
                      value={formState.banglaName}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_company_en">Company English Name</label>
                    <input
                      type="text"
                      id="edit_company_en"
                      name="englishName"
                      value={formState.englishName}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="display-flex flex-column flex-md-row gap-3">
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_company_title">Company Name Title</label>
                    <textarea
                      id="edit_company_title"
                      name="title"
                      className="form-control"
                      rows={3}
                      value={formState.title}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group amf flex-grow-1">
                    <label htmlFor="edit_company_status">Company Status</label>
                    <select
                      id="edit_company_status"
                      name="status"
                      className="form-control"
                      value={formState.status}
                      onChange={handleFormChange}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                <button type="submit" className="btn btn-primary">
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
