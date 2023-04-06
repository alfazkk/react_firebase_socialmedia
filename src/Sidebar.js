import "./styles/sidebar.css";
import { Chat, RssFeed, School, WorkOutline } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useStateProvider } from "./StateProvider";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [{ sidebar }, dispatch] = useStateProvider();
  const logout = () => {
    sessionStorage.clear();
    dispatch({
      type: "LOGOUT",
    });
  };

  const navigate = useNavigate();

  return (
    <div className={`sidebar ${sidebar && "open"} `}>
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem" onClick={() => navigate("/")}>
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span
              className="sidebarListItemText"
              onClick={() => navigate("/messenger")}
            >
              Chat
            </span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <a
              href="https://www.linkedin.com/jobs/"
              className="sidebarListItemText"
            >
              Jobs
            </a>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <a href="https://www.udemy.com/" className="sidebarListItemText">
              Courses
            </a>
          </li>
          <li onClick={logout} className="sidebarListItem logout">
            <LogoutIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
