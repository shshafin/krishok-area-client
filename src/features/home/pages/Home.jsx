import { useState, useEffect } from "react";
import { fetchMe } from "../../../api/authApi";

import "@/assets/styles/Home.css";

import FollowerSuggest from "@/components/layout/FollowerSuggest";
import CreatePost from "@/components/layout/CreatePost";
import InfiniteFeed from "../../feed/pages/InfiniteFeed";
import Posting from "@/components/layout/PostModel";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("post"); // "post" | "feelings"

  const openModal = (type = "post") => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handlePostSubmit = (data) => {
    console.log(`${modalType} Data:`, data);
    closeModal();
  };

  const [users, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const user = users?.data;

  if (loading) return <div>লোড হচ্ছে...</div>;

  return (
    <>
      <section className="flex FY-center">
        <FollowerSuggest />
        <section className="fake-follow-section"></section>

        <section className="feed-area">
          <CreatePost
            user={user.name.split(" ")[0]}
            profile={user.profileImage}
            onTextClick={() => openModal("post")}
            onPhotoVideoClick={() => openModal("post")}
            onFellingClick={() => openModal("feelings")}
          />

          <InfiniteFeed />
        </section>
      </section>

      {modalVisible && (
        <Posting
          user={{
            username: user.name,
            profile: user.profileImage,
          }}
          onPost={handlePostSubmit}
          onClose={closeModal}
        />
      )}
    </>
  );
}
