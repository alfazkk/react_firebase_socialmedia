import React, { useState, useEffect } from "react";
import Topbar from "./Topbar";
import "./styles/home.css";
import Share from "./Share";
import Post from "./Post";
import Sidebar from "./Sidebar";
import db from "./firebase";
import { useStateProvider } from "./StateProvider";

export default function Home({ user }) {
  const [reload, setReload] = useState();
  const [{ loading, posts }, dispatch] = useStateProvider();

  useEffect(() => {
    dispatch({
      type: "FETCH_POSTS_START",
    });
    try {
      db.collection("posts")
        .orderBy("date", "desc")
        .get()
        .then((res) =>
          dispatch({
            type: "FETCH_POSTS_SUCCESS",
            data: res.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          })
        );
    } catch (error) {
      dispatch({
        type: "FETCH_POSTS_FAIL",
      });
    }
  }, [reload]);

  return (
    <div className="home">
      <Topbar user={user} />
      <div>
        <Sidebar />
        <div className="feed">
          <Share setReload={setReload} user={user} />
          {posts?.map((p, i) => (
            <Post key={i} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
