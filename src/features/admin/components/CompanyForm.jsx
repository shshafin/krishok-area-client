import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../styles/companyForm.module.css";

export default function CompanyForm() {
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameBn.trim() || !location.trim()) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      nameEn: nameEn.trim(),
      nameBn: nameBn.trim(),
      location: location.trim(),
    };

    // replace with your real API call
    const submit = () =>
      new Promise((resolve) => setTimeout(resolve, 900));

    await toast.promise(submit(), {
      loading: "Submitting…",
      success: "Submitted successfully",
      error: "Submit failed",
    });

    console.log("Submitted:", payload);
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-center" />
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Company</h1>

        <label className={styles.label}>
          Company name (EN)
          <input
            className={styles.input}
            placeholder="Exp: Abedin Crop Care Ltd"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          কোম্পানির নাম (BN)
          <input
            className={styles.input}
            placeholder="Exp: অটো ক্রপ কেয়ার লিঃ"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Location
          <input
            className={styles.input}
            placeholder="চট্টগ্রাম, বাংলাদেশ"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <button type="submit" className={styles.btnPrimary}>
          Submit data
        </button>
      </form>
    </div>
  );
}