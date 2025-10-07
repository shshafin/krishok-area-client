import { useState } from "react";
import styles from "../styles/seed.module.css";
import toast, { Toaster } from "react-hot-toast";

/* your interactive star rating */
import StarRating from "@/components/ui/StarRating";

export default function SeedForm() {
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");

  const [rating, setRating] = useState(0);

  const [type, setType] = useState("");              // e.g., "কৃষি খামার" / "Farmer Farm"
  const [whatDoingBn, setWhatDoingBn] = useState(""); // জৈব সবজি চাষ
  const [description, setDescription] = useState("");

  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");

  const [ownership, setOwnership] = useState("");    // মালিকের নাম

  const [result, setResult] = useState(null);

  const addTag = () => {
    const v = tagText.trim();
    if (!v) return;
    if (!tags.includes(v)) setTags((t) => [...t, v]);
    setTagText("");
  };
  const removeTag = (idx) => setTags((t) => t.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: { en: titleEn.trim(), bn: titleBn.trim() },
      rating: Number(rating || 0),
      type: type.trim(),
      taglineBn: whatDoingBn.trim(),
      description: description.trim(),
      location: location.trim(),
      phone: phone.trim(),
      email: email.trim(),
      tags,
      ownership: ownership.trim(),
      // foundedAt removed
    };

    setResult(payload);
    toast.success("Prepared JSON — ready to POST");
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-right" />

      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Company — Admin Form</h1>

        {/* titles */}
        <div className={styles.row2}>
          <label className={styles.label}>
            Title (EN)
            <input
              className={styles.input}
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Green Valley Agro Farm"
            />
          </label>

          <label className={styles.label}>
            শিরোনাম (BN)
            <input
              className={styles.input}
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="গ্রিন ভ্যালি এগ্রো ফার্ম"
            />
          </label>
        </div>

        {/* rating */}
        <div className={styles.ratingRow}>
          <span className={styles.labelText}>Rating</span>
          <div className={styles.ratingBox}>
            <StarRating value={rating} onChange={setRating} allowZero step={0.5} />
            <span className={styles.ratingVal}>{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        {/* type + what doing + ownership */}
        <div className={styles.row3}>
          <label className={styles.label}>
            Type of
            <input
              list="company-types"
              className={styles.input}
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="কৃষি খামার / Farmer Farm"
            />
            <datalist id="company-types">
              <option value="কৃষি খামার" />
              <option value="বীজ বিক্রেতা" />
              <option value="সার সরবরাহকারী" />
              <option value="ফার্ম" />
              <option value="রিটেইল শপ" />
            </datalist>
          </label>

          <label className={styles.label}>
            What doing (BN)
            <input
              className={styles.input}
              value={whatDoingBn}
              onChange={(e) => setWhatDoingBn(e.target.value)}
              placeholder="জৈব সবজি চাষ"
            />
          </label>

          <label className={styles.label}>
            Ownership / মালিক
            <input
              className={styles.input}
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
              placeholder="মোঃ রহিম উদ্দিন"
            />
          </label>
        </div>

        {/* location + phone + email */}
        <div className={styles.row3}>
          <label className={styles.label}>
            Location
            <input
              className={styles.input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="সাভার, ঢাকা"
            />
          </label>

          <label className={styles.label}>
            Phone Number
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880-1711-123456"
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="greenvalley@gmail.com"
              type="email"
            />
          </label>
        </div>

        {/* description */}
        <label className={styles.label}>
          Description
          <textarea
            className={styles.textarea}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="জৈব পদ্ধতিতে সবজি চাষ ও বিক্রয়। তাজা ও নিরাপদ সবজি সরবরাহ।"
          />
        </label>

        {/* tags (enter to add) */}
        <div className={styles.tagsWrap}>
          <label className={styles.label} style={{ flex: "1 1 100%" }}>
            Tags (press Enter to add)
            <input
              className={styles.input}
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="টমেটো, বেগুন, শসা…"
            />
          </label>

          <div className={styles.chips}>
            {tags.map((t, i) => (
              <span key={`${t}-${i}`} className={styles.chip}>
                {t}
                <button
                  type="button"
                  className={styles.chipX}
                  onClick={() => removeTag(i)}
                  aria-label="remove tag"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.submit}>Submit</button>
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