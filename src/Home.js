import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import "./styles/home.css";
import Share from "./Share";
import Post from "./Post";
import Sidebar from "./Sidebar";
import db from "./firebase";

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("date", "desc")
      .get()
      .then((data) =>
        setPosts(
          data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      );
  }, []);

  return (
    <div className="home">
      <Topbar user={user} />
      <div>
        <Sidebar />
        <div className="feed">
          <Share setPosts={setPosts} user={user} />
          {posts?.map((p, i) => (
            <Post key={i} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
