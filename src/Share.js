import React, { useState, useRef } from "react";
import "./styles/share.css";
import { Cancel, Label, PermMedia, Room } from "@mui/icons-material";
import db from "./firebase";
import firebase from "firebase";
import axios from "axios";

export default function Share({ setPosts, user }) {
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (desc.current.value !== "" || file) {
        setLoading(true);
        if (file) {
          try {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "o6d3xtcb");
            await axios
              .post(`https://api.cloudinary.com/v1_1/aluuu/image/upload`, data)
              .then((res) => {
                const post = {
                  desc: desc.current.value,
                  photo: res.data.url,
                  date: firebase.firestore.FieldValue.serverTimestamp(),
                  userId: user.userId,
                  like: [],
                };
                db.collection("posts").add(post);
                setPosts((prev) => [post, ...prev]);
                setFile(null);
                desc.current.value = "";
              });
            setLoading(false);
            alert("post shared succesfully");
          } catch (error) {
            setLoading(false);
            alert("error occured");
          }
        } else {
          try {
            const post = {
              desc: desc.current.value,
              photo: "",
              date: firebase.firestore.FieldValue.serverTimestamp(),
              userId: user.userId,
              like: [],
            };
            db.collection("posts").add(post);
            setPosts((prev) => [post, ...prev]);
            setFile(null);
            desc.current.value = "";
            setLoading(false);
            alert("post shared succesfully");
          } catch (error) {
            setLoading(false);
            alert("error occured");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={user?.profilePicture ? user?.profilePicture : "no-avatar.png"}
            alt=""
          />
          <input
            ref={desc}
            type="text"
            className="shareInput"
            placeholder="What's in your mind?"
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
          </div>
          <button type="submit" className="shareButton">
            {loading ? <div className="loadingSkeleton"></div> : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}
