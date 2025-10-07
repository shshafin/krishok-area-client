import React, { useState, useRef } from "react";
import styles from "../styles/diseaseForm.module.css";
import toast, { Toaster } from "react-hot-toast";

/* small helper to preview files */
const usePreview = () => {
  const revokeRef = useRef(null);
  const mkUrl = (file) => {
    if (!file) return "";
    if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
    const url = URL.createObjectURL(file);
    revokeRef.current = url;
    return url;
  };
  return mkUrl;
};

function ImageCard({ label, value, onFile, title, onTitle, desc, onDesc }) {
  const makePreview = usePreview();
  const [preview, setPreview] = useState(
    typeof value === "string" ? value : ""
  );

  const handleFile = (file) => {
    if (file) {
      setPreview(makePreview(file));
      onFile?.(file);
    }
  };

  return (
    <div className={styles.mediaCard}>
      <div className={styles.mediaHead}>{label}</div>

      <label className={styles.dropzone}>
        {preview ? (
          // image/video preview (image only in this form)
          <img
            className={styles.preview}
            src={preview}
            alt={title || "image"}
          />
        ) : (
          <div className={styles.emptyZone}>ছবি দিন</div>
        )}
        <input
          type="file"
          accept="image/*"
          className={styles.file}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      <div className={styles.captionRow}>
        <div className={styles.labelSmall}>শিরোনাম</div>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="ছবির শিরোনাম"
        />
      </div>
      <div className={styles.captionRow}>
        <div className={styles.labelSmall}>বিবরণ</div>
        <input
          className={styles.input}
          value={desc}
          onChange={(e) => onDesc(e.target.value)}
          placeholder="ছবির সংক্ষিপ্ত বিবরণ"
        />
      </div>

      <div className={styles.mediaFoot}>আপলোড করলে প্রিভিউ দেখা যাবে।</div>
    </div>
  );
}

function DynamicList({ title, items, setItems, accent = "green" }) {
  const [text, setText] = useState("");

  const add = () => {
    const v = text.trim();
    if (!v) return;
    setItems((arr) => [...arr, v]);
    setText("");
  };

  const remove = (idx) => {
    setItems((arr) => arr.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.listCard}>
      <div className={`${styles.listHead} ${styles[`accent_${accent}`]}`}>
        {title}
      </div>

      <div className={styles.listAdd}>
        <input
          className={styles.input}
          placeholder="নতুন আইটেম লিখে Enter চাপুন…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" ? (e.preventDefault(), add()) : null
          }
        />
        <button type="button" className={styles.addBtn} onClick={add}>
          যোগ করুন
        </button>
      </div>

      <ul className={styles.listUl}>
        {items.map((it, i) => (
          <li key={`${it}-${i}`} className={styles.listItem}>
            <span className={styles.bullet} />
            <span className={styles.itemText}>{it}</span>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => remove(i)}
              aria-label="remove"
              title="Remove"
            >
              ✕
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className={styles.listEmpty}>এখানে আইটেম যোগ করুন</li>
        )}
      </ul>
    </div>
  );
}

export default function DiseaseAdminForm() {
  // top level
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // images (file + meta)
  const [img1, setImg1] = useState(null);
  const [img1Title, setImg1Title] = useState("");
  const [img1Desc, setImg1Desc] = useState("");

  const [img2, setImg2] = useState(null);
  const [img2Title, setImg2Title] = useState("");
  const [img2Desc, setImg2Desc] = useState("");

  const [img3, setImg3] = useState(null);
  const [img3Title, setImg3Title] = useState("");
  const [img3Desc, setImg3Desc] = useState("");

  // lists
  const [symptoms, setSymptoms] = useState([]); // রোগের লক্ষণঃ
  const [actions, setActions] = useState([]); // করনীয়ঃ

  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      description: description.trim(),
      images: [
        {
          title: img1Title.trim(),
          description: img1Desc.trim(),
          name: img1?.name || null,
        },
        {
          title: img2Title.trim(),
          description: img2Desc.trim(),
          name: img2?.name || null,
        },
        {
          title: img3Title.trim(),
          description: img3Desc.trim(),
          name: img3?.name || null,
        },
      ],
      lists: {
        symptoms, // রোগের লক্ষণঃ
        actions, // করনীয়ঃ
      },
    };

    setResult(payload);
    toast.success("Prepared JSON — ready to POST");
    // you can now POST FormData with files if needed
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-right" />
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>রোগ/পোকার পোস্ট — অ্যাডমিন</h1>

        {/* title & description */}
        <div className={styles.row2}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="উদা: আন্নু-জার পোকার আক্রমণ"
            />
          </label>
          <label className={styles.label}>
            Description
            <input
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="পোস্টের সংক্ষিপ্ত বিবরণ…"
            />
          </label>
        </div>

        {/* grid: left big image, right two lists */}
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <ImageCard
              label="প্রধান ছবি"
              value={img1}
              onFile={setImg1}
              title={img1Title}
              onTitle={setImg1Title}
              desc={img1Desc}
              onDesc={setImg1Desc}
            />
          </div>

          <div className={styles.rightCol}>
            <DynamicList
              title="রোগের লক্ষণঃ"
              items={symptoms}
              setItems={setSymptoms}
              accent="amber"
            />
            <DynamicList
              title="করনীয়ঃ"
              items={actions}
              setItems={setActions}
              accent="green"
            />
          </div>
        </div>

        {/* bottom: two more images */}
        <div className={styles.row2}>
          <ImageCard
            label="সহায়ক ছবি ১"
            value={img2}
            onFile={setImg2}
            title={img2Title}
            onTitle={setImg2Title}
            desc={img2Desc}
            onDesc={setImg2Desc}
          />
          <ImageCard
            label="সহায়ক ছবি ২"
            value={img3}
            onFile={setImg3}
            title={img3Title}
            onTitle={setImg3Title}
            desc={img3Desc}
            onDesc={setImg3Desc}
          />
        </div>

        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>

      {result && (
        <section className={styles.output}>
          <h2 className={styles.outTitle}>Result (JSON)</h2>
          <pre className={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
