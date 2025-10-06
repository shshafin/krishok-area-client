/* eslint-disable no-unused-vars */
import "@/assets/styles/createPost.css";
import ImageIcon from "@/assets/IconComponents/Image.jsx";
import { baseApi } from "../../api";

function CreatePost({
  user,
  profile,
  onTextClick,
  onPhotoVideoClick,
  onFellingClick,
}) {
  return (
    <div className="createPost">
      <section className="flex FY-center MB-1rem">
        <div className="createPostProfile">
          <img
            src={
              profile
                ? profile.startsWith("http")
                  ? profile
                  : `${baseApi}${profile}`
                : "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png"
            }
            alt="user profile"
          />
        </div>
        <div
          className="textPost"
          onClick={onTextClick}>
          <span>{`What's on your mind, ${user}?`}</span>
        </div>
      </section>

      <section className="flex FY-center MB-1rem">
        <div
          className="flex F-center FY-center mediaPostOptions"
          onClick={onPhotoVideoClick}>
          <ImageIcon stroke="#4ade80" />
          <span>Photo/Video</span>
        </div>

        {/* <div
          className="flex F-center flex FY-center fellingPostOption"
          onClick={onFellingClick}
        >
          <div>😊</div>
          <span>Feeling/Activity</span>
        </div> */}
      </section>
    </div>
  );
}

export default CreatePost;
