import React, { useState, useEffect } from "react";
import { MoreVert } from "@mui/icons-material";
import { format } from "timeago.js";
import "./styles/post.css";
import db from "./firebase";
import firebase from "firebase";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "./StateProvider";

export default function Post({ post, self, setPosts }) {
  const [like, setLike] = useState(post?.like);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState({});
  const [{ user: loggedUser }] = useStateProvider();
  const [commentSec, setCommentSec] = useState(false);
  const [comment, setComment] = useState("");
  const [more, setMore] = useState(false);
  const PF = "https://social-media-567c8.web.app/";
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    db.collection("users")
      .get()
      .then((data) => {
        const userData = data.docs.find((doc) => doc.id === post.userId);
        setUser({ userId: userData.id, ...userData.data() });
      });
    setLike(post.like);
    setComments([]);
  }, [post]);

  const likehandler = () => {
    if (like.includes(loggedUser.userId)) {
      db.collection("posts")
        .doc(post.id)
        .update(
          "like",
          firebase.firestore.FieldValue.arrayRemove(loggedUser.userId)
        );
      setLike((prev) => prev.filter((id) => id !== loggedUser.userId));
    } else {
      db.collection("posts")
        .doc(post.id)
        .update(
          "like",
          firebase.firestore.FieldValue.arrayUnion(loggedUser.userId)
        );
      setLike((prev) => [loggedUser.userId, ...prev]);
    }
  };

  const openComments = () => {
    db.collection("posts")
      .doc(post.id)
      .collection("comments")
      .orderBy("date", "desc")
      .get()
      .then((data) => {
        setComments(
          data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    setCommentSec((val) => !val);
  };

  const commentHandler = (e) => {
    e.preventDefault();
    try {
      const newComment = {
        comment,
        userId: loggedUser.userId,
        date: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.collection("posts")
        .doc(post.id)
        .collection("comments")
        .add(newComment);
      setComments((prev) => [newComment, ...prev]);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const navigateProfile = (profileId) => {
    navigate("/profile/" + profileId);
  };

  const deleteHandler = () => {
    try {
      if (post.userId === loggedUser.userId) {
        db.collection("posts").doc(post.id).delete();
        setPosts((prev) => prev.filter((po) => po.id !== post.id));
        alert("post deleted");
        setMore(false);
      }
    } catch (error) {}
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              onClick={() => navigateProfile(post.userId)}
              className="postProfileImg"
              src={
                user?.profilePicture
                  ? user.profilePicture
                  : PF + "no-avatar.png"
              }
              alt=""
              loading="lazy"
            />
            <span className="postUsername">{user?.username}</span>
            <span className="postDate">
              {format(
                new Date(
                  post?.date?.toDate && post?.date?.toDate().toUTCString()
                )
              )}
            </span>
          </div>
          <div className="postTopRight">
            {self && (
              <div className="more">
                <MoreVert onClick={() => setMore((val) => !val)} />
                {more && (
                  <button onClick={deleteHandler} className="dlt-btn">
                    delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img
            className="postImg"
            src={post?.photo}
            loading="lazy"
            // onLoad={() => setLoaded(true)}
            alt=""
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {like.includes(loggedUser.userId) ? (
              <img
                className="likeIcon"
                src={`${PF}heart.png`}
                onClick={likehandler}
                alt=""
              />
            ) : (
              <img
                className="likeIcon"
                src={`${PF}like.png`}
                onClick={likehandler}
                alt=""
              />
            )}
            <span className="postLikeCounter">
              {like.length} people liked it
            </span>
          </div>
          <div className="postBottomRight">
            <span onClick={openComments} className="postCommentText">
              comments
            </span>
          </div>
        </div>
        {commentSec && (
          <div className="commentSection">
            <h4>{comments?.length} comments</h4>
            <form action="" onSubmit={(e) => commentHandler(e)}>
              <input
                value={comment}
                type="text"
                placeholder="post a comment..."
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit">submit</button>
            </form>
            {comments?.map((comm, i) => (
              <Comment key={i} data={comm} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Comment = ({ data }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    db.collection("users")
      .doc(data.userId)
      .get()
      .then((res) => setUserData(res.data()));
  }, [data]);

  return (
    <div className="comment">
      <div className="commentLeft">
        <img src={userData.profilePicture} loading="lazy" alt="" />
      </div>
      <div className="commentRight">
        <div className="commentRightTop">
          <h5>{userData.username}</h5>
          <p>
            {format(
              new Date(data?.date?.toDate && data?.date?.toDate().toUTCString())
            )}
          </p>
        </div>
        <div className="commentRightBtm">
          <p>{data.comment}</p>
        </div>
      </div>
    </div>
  );
};
