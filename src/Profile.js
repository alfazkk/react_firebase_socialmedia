import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import "./styles/profile.css";
import db from "./firebase";
import axios from "axios";
import { useStateProvider } from "./StateProvider";
import Post from "./Post";
import { useParams } from "react-router-dom";
import Compressor from "compressorjs";

export default function Profile({ user }) {
  const [username, setUserName] = useState(user?.username);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [file, setFile] = useState(null);
  const [state, dispatch] = useStateProvider();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      db.collection("posts")
        .orderBy("date", "desc")
        .get()
        .then((data) => {
          const userPosts = data.docs.filter(
            (doc) => doc.data().userId === user.userId
          );
          setPosts(
            userPosts.map((post) => ({
              id: post.id,
              ...post.data(),
            }))
          );
        });
    };
    fetchPosts();
  }, []);

  const clickHandler = async () => {
    setLoading(true);
    if (file) {
      try {
        new Compressor(file, {
          quality: 0.8,
          success: async (compressedImg) => {
            const data = new FormData();
            data.append("file", compressedImg);
            data.append("upload_preset", "o6d3xtcb");
            await axios
              .post(`https://api.cloudinary.com/v1_1/aluuu/image/upload`, data)
              .then((res) => {
                db.collection("users").doc(user.userId).update({
                  username,
                  email,
                  name,
                  phone,
                  profilePicture: res.data.url,
                });
                dispatch({
                  type: "SET_USER",
                  user: {
                    userId: user.userId,
                    username,
                    email,
                    name,
                    phone,
                    profilePicture: res.data.url,
                  },
                });
                sessionStorage.setItem(
                  "user",
                  JSON.stringify({
                    userId: user.userId,
                    username,
                    email,
                    name,
                    phone,
                    profilePicture: res.data.url,
                  })
                );
              });
            setLoading(false);
            alert("profile updated succesfully");
          },
        });
      } catch (error) {
        setLoading(false);
        alert("error occured");
      }
    } else if (username && name && email && phone) {
      try {
        db.collection("users")
          .doc(user.userId)
          .update({ username, email, name, phone });
        dispatch({
          type: "SET_USER",
          user: {
            username,
            email,
            name,
            phone,
            userId: user.userId,
            profilePicture: user.profilePicture,
          },
        });
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            userId: user.userId,
            username,
            email,
            name,
            phone,
            userId: user.userId,
            profilePicture: user.profilePicture,
          })
        );
        setLoading(false);
        alert("profile updated succesfully");
      } catch (error) {
        setLoading(false);
        alert("error occured");
        console.log(error);
      }
    } else {
      alert("fill all field");
    }
  };

  return (
    <div className="home">
      <Topbar user={user} />
      <div className="feed">
        <Sidebar />
        <div className="profileContainer">
          <div className="profile">
            <div className="profile-top">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : user?.profilePicture
                    ? user?.profilePicture
                    : "no-avatar.png"
                }
                alt=""
              />
              <label htmlFor="file">
                Edit
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
            <div className="profile-btm">
              <label htmlFor="">username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              <label htmlFor="">name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="">phone number</label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button onClick={clickHandler}>
                {loading ? <div className="loadingSkeleton"></div> : "Save"}
              </button>
            </div>
          </div>
          <div className="profilePostsContainer">
            <h2>Posts</h2>
            <div className="profilePosts">
              {posts &&
                posts?.map((p, i) => (
                  <Post key={i} post={p} self setPosts={setPosts} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SearchedProfile = () => {
  const { id } = useParams();
  const [searchedUser, setSearchedUser] = useState({});
  const [{ user: loggedUser }] = useStateProvider();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = () => {
      db.collection("users")
        .get()
        .then((data) => {
          const userData = data.docs.find((doc) => doc.id === id);
          setSearchedUser({
            userId: userData.id,
            ...userData.data(),
          });
        });
    };
    const fetchPosts = () => {
      db.collection("posts")
        .orderBy("date", "desc")
        .get()
        .then((data) => {
          const userPosts = data.docs.filter((doc) => doc.data().userId === id);
          setPosts(
            userPosts.map((post) => ({
              id: post.id,
              ...post.data(),
            }))
          );
        });
    };
    fetchUser();
    fetchPosts();
  }, [id]);

  return (
    <div className="home">
      <Topbar user={loggedUser} />
      <div className="feed">
        <Sidebar />
        <div className="profileContainer">
          <div className="profile">
            <div className="profile-top">
              <img
                src={
                  searchedUser?.profilePicture
                    ? searchedUser.profilePicture
                    : "no-avatar.png"
                }
                alt=""
              />
            </div>
            <div className="profile-btm">
              <label htmlFor="">username</label>
              <p>{searchedUser?.username}</p>
              <label htmlFor="">name</label>
              <p>{searchedUser?.name}</p>
              <label htmlFor="">email</label>
              <p>{searchedUser?.email}</p>
              <label htmlFor="">phone number</label>
              <p>{searchedUser?.phone}</p>
            </div>
          </div>
          <div className="profilePostsContainer">
            <h2>Posts</h2>
            <div className="profilePosts">
              {posts && posts?.map((p, i) => <Post key={i} post={p} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
