import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/adminScoped.css";
import TrashIcon from "@/assets/IconComponents/Trash";

const RAW_PRODUCTS = [
  {
    id: 701,
    companyName: "ACI Crop Care",
    productName: "Tido Plus",
    materialName: "Imidacloprid",
    categoryName: "Insecticide",
    heroImage: "https://images.unsplash.com/photo-1586867809830-320cb0b937a2?auto=format&fit=crop&w=900&q=80",
    summary: {
      benefits: "Controls common paddy weeds before germination and protects the crop for weeks.",
      crop: "Rice",
      pest: "Stem borer",
      dosage: "10 ml per 20 litres of water",
      instruction: "Spray in the early morning or late afternoon for best results.",
    },
  },
  {
    id: 702,
    companyName: "Syngenta",
    productName: "Ridomil Gold",
    materialName: "Metalaxyl + Mancozeb",
    categoryName: "Fungicide",
    heroImage: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
    summary: {
      benefits: "Systemic action keeps new leaves protected from blight and rot.",
      crop: "Potato and Tomato",
      pest: "Late blight",
      dosage: "20 g per 10 litres of water",
      instruction: "Apply every 15 days during the growing season.",
    },
  },
  {
    id: 703,
    companyName: "Bayer Crop Science",
    productName: "Magic Drop",
    materialName: "Carbendazim 12% + Mancozeb 63%",
    categoryName: "Fungicide",
    heroImage: "https://images.unsplash.com/photo-1615485290382-1ff2f71bb9f2?auto=format&fit=crop&w=900&q=80",
    summary: {
      benefits: "Improves plant resistance and reduces foliar diseases on vegetables.",
      crop: "Vegetables",
      pest: "Leaf spot and rot",
      dosage: "25 g per 10 litres of water",
      instruction: "Spray after sunset to minimise evaporation and drift.",
    },
  },
];

const SUMMARY_ORDER = [
  { key: "benefits", label: "Benefits" },
  { key: "crop", label: "Recommended Crop" },
  { key: "pest", label: "Target Pest" },
  { key: "dosage", label: "Dosage" },
  { key: "instruction", label: "Application Instructions" },
];

const normalizeProduct = (product, index) => {
  if (!product || typeof product !== "object") return null;
  return {
    id: product.id ?? index + 1,
    companyName: product.companyName ?? "",
    productName: product.productName ?? "",
    materialName: product.materialName ?? "",
    categoryName: product.categoryName ?? "",
    heroImage: product.heroImage ?? "https://picsum.photos/seed/product/640/480",
    summary: product.summary || {},
  };
};

export default function ManageProductDetailsPage() {
  const [products, setProducts] = useState(() => RAW_PRODUCTS.map(normalizeProduct).filter(Boolean));
  const [searchTerm, setSearchTerm] = useState("");
  const [removing, setRemoving] = useState({});
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [confirmProduct, setConfirmProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => {
      return [product.companyName, product.productName, product.materialName, product.categoryName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [products, searchTerm]);

  const deleteProduct = (product) => {
    setRemoving((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setRemoving((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      toast.success(`"${product.productName}" removed from the list.`);
    }, 280);
  };

  const handleDelete = (product) => setConfirmProduct(product);

  const handleConfirmDelete = () => {
    if (!confirmProduct) return;
    deleteProduct(confirmProduct);
    setConfirmProduct(null);
  };

  const handleCancelDelete = () => setConfirmProduct(null);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="content-wrapper _scoped_admin manage-crop-details-page" style={{ minHeight: "839px" }}>
      <Toaster position="top-right" />

      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Product Details</h1>
              <p className="text-muted mt-1 mb-0">
                Review product highlights, usage summaries, and delete outdated entries when needed.
              </p>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                </li>
                <li className="breadcrumb-item">
                  <NavLink to="/admin/products/add">Add Product</NavLink>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Manage Product Details
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="crop-details-shell">
            <div className="crop-details-toolbar">
              <div className="crop-details-stats">
                <span className="crop-details-total">Total Products: {products.length}</span>
                <span className="crop-details-visible">Showing: {filteredProducts.length}</span>
              </div>
              <div className="crop-details-controls">
                <div className="crop-details-search">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by company, product or category..."
                  />
                </div>
              </div>
            </div>

            <div className="crop-details-grid">
              {filteredProducts.map((product) => {
                const isExpanded = expandedIds.has(product.id);
                const summaryEntries = SUMMARY_ORDER.map(({ key, label }) => {
                  const value = product.summary[key];
                  if (!value) return null;
                  return { key, label, value };
                }).filter(Boolean);
                const hasHidden = summaryEntries.length > 2;
                const visibleEntries = isExpanded || !hasHidden ? summaryEntries : summaryEntries.slice(0, 2);

                return (
                  <article key={product.id} className={`crop-detail-card ${removing[product.id] ? "is-removing" : ""}`}>
                    <button
                      type="button"
                      className="crop-detail-delete-icon"
                      onClick={() => handleDelete(product)}
                      disabled={Boolean(removing[product.id])}
                      title="Delete this product"
                      aria-label={`Delete details for ${product.productName}`}
                    >
                      <TrashIcon width={20} height={20} strokeWidth={1.8} />
                    </button>
                    <div className="crop-detail-media">
                      <img src={product.heroImage} alt={`${product.productName} product`} />
                      <span className="crop-detail-category badge-info">{product.categoryName}</span>
                    </div>

                    <div className="crop-detail-body">
                      <div className="crop-detail-header">
                        <div>
                          <h3 className="crop-detail-title">{product.productName}</h3>
                          <p className="crop-detail-meta">
                            <span>{product.companyName}</span>
                            <span className="divider" aria-hidden="true">
                              |
                            </span>
                            <span>{product.materialName}</span>
                          </p>
                        </div>
                      </div>

                      <div className="crop-detail-summary">
                        <div className={`crop-detail-summary-inner ${!isExpanded && hasHidden ? "is-collapsed" : ""}`}>
                          {visibleEntries.map(({ key, label, value }) => (
                            <div key={key} className="crop-detail-summary-item">
                              <span className="summary-label">{label}</span>
                              <p className="summary-value">{value}</p>
                            </div>
                          ))}
                        </div>
                        {hasHidden && (
                          <button
                            type="button"
                            className="crop-detail-toggle"
                            onClick={() => toggleExpanded(product.id)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded
                              ? "Show less"
                              : `View more (${summaryEntries.length - visibleEntries.length})`}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!filteredProducts.length && (
              <div className="crop-details-empty">
                <h4>No products found</h4>
                <p>Try adjusting your filters or search terms to locate the product details you are looking for.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmProduct && (
        <div className="admin-modal-backdrop" role="presentation">
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-delete-title"
            aria-describedby="product-delete-description"
          >
            <div className="admin-modal-header">
              <h5 id="product-delete-title" className="mb-0">
                Delete product detail?
              </h5>
            </div>
            <div id="product-delete-description" className="admin-modal-body">
              <p className="mb-2">
                Are you sure you want to delete the entry for <strong>{confirmProduct.productName}</strong>?
              </p>
              <p className="text-muted mb-0">This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
