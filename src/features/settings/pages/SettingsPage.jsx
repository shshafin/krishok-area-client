import { useState, useEffect } from "react";
import { fetchMe, updateProfile, changePassword } from "@/api/authApi";

import "../styles/common.css";
import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/PasswordForm";
import Appearance from "../components/Appearance";
import AccountActions from "../components/AccountActions";
import { logoutUser } from "../../../api/authApi";
import { baseApi } from "../../../api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetchMe();
        const me = res?.data ?? res;

        if (!alive) return;

        // profile সেট করা
        setProfile({
          profileImage: me?.profileImage,
          coverImage: me?.coverImage,
          name: me?.name,
          email: me?.email,
          username: me?.username,
          followers: me?.followers ? me.followers.length : 0,
          following: me?.following ? me.following.length : 0,
          isOnline: me?.isOnline || false,
        });

        // form values সেট করা
        setFormValues({
          name: me?.name,
          username: me?.username,
          bio: me?.bio,
          phone: me?.phone,
          address: me?.address,
        });
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ======================
  // ProfileForm submit handler
  // ======================
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("username", formValues.username);
      formData.append("bio", formValues.bio);
      formData.append("phone", formValues.phone);
      formData.append("address", formValues.address);

      const res = await updateProfile(formData);
      console.log("Profile updated:", res);

      setProfile((p) => ({
        ...p,
        name: formValues.name,
        username: formValues.username,
      }));

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Profile update failed!");
    }
  };
  // ======================
  // ProfileImage handler
  // ======================
  const handleProfilePhotoChange = async (file) => {
    setProfile((p) => ({
      ...p,
      profileImage: URL.createObjectURL(file),
    }));

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await updateProfile(formData);
      console.log("Profile photo updated:", res);

      const newProfileUrl = res?.data?.profileImage;
      if (newProfileUrl) {
        setProfile((p) => ({
          ...p,
          profileImage: `${baseApi}${newProfileUrl}`,
        }));
      }

      alert("Profile photo updated successfully!");
    } catch (err) {
      console.error("Failed to update profile photo:", err);
      alert("Profile photo update failed!");
    }
  };

  // ======================
  // CoverImage handler
  // ======================
  const handleCoverPhotoChange = async (file) => {
    // Step 1: temporary preview
    setProfile((p) => ({
      ...p,
      coverImage: URL.createObjectURL(file),
    }));

    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      const res = await updateProfile(formData);
      console.log("Cover photo updated:", res);

      // Step 2: server response path update (যদি available)
      const newCoverUrl = res?.data?.coverImage;
      if (newCoverUrl) {
        setProfile((p) => ({
          ...p,
          coverImage: `${baseApi}${newCoverUrl}`,
        }));
      }

      alert("Cover photo updated successfully!");
    } catch (err) {
      console.error("Failed to update cover photo:", err);
      alert("Cover photo update failed!");
    }
  };

  // ======================
  // Password change handler
  // ======================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const oldPassword = form.oldPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const res = await changePassword({ oldPassword, newPassword });
      console.log("Password changed:", res);
      alert("Password changed successfully!");
      form.reset();
    } catch (err) {
      console.error("Password change failed:", err);
      alert(err?.message || "Password change failed!");
    }
  };

  // ======================
  // logout handler
  // ======================
  const handleSignOut = async () => {
    try {
      const res = await logoutUser(); // API call
      if (res.success) {
        // token remove
        localStorage.removeItem("accessToken"); // বা sessionStorage

        // Redirect
        window.location.href = "/auth/login";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return <h1>Loading Profile...</h1>;

  return (
    <div className="container">
      <ProfileCard
        data={profile}
        onChangePhoto={handleProfilePhotoChange}
        onChangeCover={handleCoverPhotoChange}
      />

      <div className="grid-2 mt-24">
        <ProfileForm
          values={formValues}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, [e.target.name]: e.target.value }))
          }
          onSubmit={handleProfileSubmit}
        />
        <PasswordForm onSubmit={handleChangePassword} />
      </div>

      <div className="grid-2 mt-24">
        <Appearance />
        <AccountActions onSignOut={handleSignOut} />
      </div>
    </div>
  );
}
