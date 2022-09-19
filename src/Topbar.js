import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/topbar.css";
import { Search } from "@mui/icons-material";
import db from "./firebase";
import MenuIcon from "@mui/icons-material/Menu";
import { useStateProvider } from "./StateProvider";

export default function Topbar({ user }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [result, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [{ sidebar }, dispatch] = useStateProvider();
  const [sidebarOn, setSidebarOn] = useState(sidebar);

  const searchHandler = (e) => {
    e.preventDefault();
    setOpen(true);
    setLoading(true);
    if (input) {
      try {
        db.collection("users")
          .get()
          .then((res) => {
            const searched = res.docs.filter((doc) =>
              doc.data().username.startsWith(input)
            );
            setResults(
              searched.map((res) => ({ userId: res.id, ...res.data() }))
            );
          });
        setInput("");
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const sidebarHandler = () => {
    if (sidebar) {
      dispatch({
        type: "SIDEBAR-OFF",
      });
    } else {
      dispatch({
        type: "SIDEBAR-ON",
      });
    }
  };

  return (
    <div className="topbar">
      <div className="topbarLeft">
        <div onClick={() => sidebarHandler()} className="menuIcon">
          <MenuIcon />
        </div>
        <span onClick={() => navigate("/")} className="logo">
          SOCIAL
        </span>
      </div>
      <div className="topbarCenter">
        <form onSubmit={(e) => searchHandler(e)} className="searchBar">
          <Search className="searchIcon" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for friend, posts or video"
            className="searchInput"
          />
          <button type="submit"></button>
        </form>
        {open && (
          <div className="searchResults">
            <button onClick={() => setOpen(false)}>-</button>
            {result.length !== 0
              ? result.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => navigate("/profile/" + res.userId)}
                    className="searchResult"
                  >
                    <img
                      src={
                        res.profilePicture
                          ? res.profilePicture
                          : "no-avatar.png"
                      }
                      alt=""
                    />
                    <h5>{res.username}</h5>
                  </div>
                ))
              : !loading && <p>No user found</p>}
          </div>
        )}
      </div>
      <div className="topbarRight">
        <img
          onClick={() => navigate("/profile")}
          src={user?.profilePicture ? user?.profilePicture : "no-avatar.png"}
          className="topbarImg"
          alt=""
        />
      </div>
    </div>
  );
}
