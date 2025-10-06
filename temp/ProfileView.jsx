import React, { useEffect, useState } from "react";
import { fetchMe } from "@/api/authApi";

import Profile from "../src/features/profile/components/Profile";

const ProfileView = () => {

  const userData = {
    profile: "https://api.dicebear.com/9.x/initials/svg?seed=JohanDeo",
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    followers: 120,
    following: 80,
    status: true,
  };

  const handleProfileChange = () => {
    console.log("Profile picture change clicked");
  };

  return (
    <>
      <Profile data={userData} changeProfile={handleProfileChange} />
    </>
  );
};

export default ProfileView;
