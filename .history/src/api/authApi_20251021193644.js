// src/api/authApi.js
import { request } from "./index";

// Register user
export const registerUser = (data) => {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Login user
export const loginUser = (data) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Get me
export const fetchMe = () => request("/users/me", { method: "GET" });

// Update Profile
export const updateProfile = (formData) => {
  return request("/users/profile", {
    method: "PUT",
    body: formData, // FormData send হবে
    credentials: "include",
  });
};

// password change
export const changePassword = (data) => {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
};

// Logout user
export const logoutUser = () => {
  return request("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};

// total followers
export const totalFollowers = (userId) => {
  return request(`/users/followers/${userId}`, { method: "GET" });
};

// total following
export const totalFollowing = (userId) => {
  return request(`/users/following/${userId}`, { method: "GET" });
};

// all users
export const fetchAllUsers = () => {
  return request("/users/all", { method: "GET" });
};

// follow user
export const followUser = (userId) => {
  return request(`/users/follow/${userId}`, {
    method: "POST",
    credentials: "include",
  });
};
// unfollow user
export const unfollowUser = (userId) => {
  return request(`/users/unfollow/${userId}`, {
    method: "POST",
    credentials: "include",
  });
};

// create post
export const createPost = (formData) => {
  return request("/posts/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};

// delete post
export const deletePost = (postId) => {
  return request(`/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });
};

// fetch posts
export const fetchPosts = () => {
  return request("/posts/", { method: "GET" });
};

// like/unlike toggle post
export const likePost = (postId) => {
  return request(`/posts/${postId}/like`, {
    method: "PUT",
    credentials: "include",
  });
};

// comment on post
export const commentOnPost = (postId, comment) => {
  return request(`/posts/${postId}/comment`, {
    method: "POST",
    body: JSON.stringify({ text: comment }),
    credentials: "include",
  });
};

// add galleries
export const addGalleries = (formData) => {
  return request("/galleries/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};

// crops create
export const addCrops = (formData) => {
  return request("/crops/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};

// fetch all crops
export const fetchAllCrops = () => {
  return request("/crops/all", { method: "GET" });
};

// create crop details
export const addCropDetails = (formData) => {
  return request("/crop-details/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};

// add company
export const addCompany = (data) => {
  return request("/companies/create", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
};

// fetch all companies
export const fetchAllCompanies = () => {
  return request("/companies/all", { method: "GET" });
};

// add product
export const addProduct = (formData) => {
  return request("/products/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};
