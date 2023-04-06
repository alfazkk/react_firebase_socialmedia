import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import Topbar from "./Topbar";
import db from "./firebase";
import firebase from "firebase";
import "./styles/messenger.css";

const Messenger = ({ user: loggeduser }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [text, setText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState({});
  const [recieverConversation, setRecieverConversation] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    db.collection("users")
      .get()
      .then((data) => {
        const usersList = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList.filter((u) => u.id !== loggeduser.userId));
      });

    db.collection("users")
      .doc(loggeduser.userId)
      .collection("conversations")
      .get()
      .then((data) =>
        setConversations(
          data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        )
      );
  }, [loggeduser]);

  useEffect(() => {
    db.collection("users")
      .doc(loggeduser.userId)
      .collection("conversations")
      .doc(conversation?.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });
  }, [conversation]);

  const clickHandler = (user) => {
    setUser(user);
    const chat = conversations?.find((c) => c.user?.id === user?.id);
    setConversation(chat);
    db.collection("users")
      .doc(user.id)
      .collection("conversations")
      .get()
      .then((data) => {
        const list = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const doc = list.find((c) => c.user?.id === loggeduser?.userId);
        setRecieverConversation(doc);
      });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const newMessage = {
        author: loggeduser.userId,
        msg: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      if (conversation === {} || !conversation) {
        // updation on sender
        let docId;
        await db
          .collection("users")
          .doc(loggeduser.userId)
          .collection("conversations")
          .add({ user })
          .then((doc) =>
            doc.get().then((docData) => {
              docId = docData.id;
              setConversations((prev) => [
                ...prev,
                { id: docData.id, ...docData.data() },
              ]);
              setConversation(() => ({
                id: docData.id,
                ...docData.data(),
              }));
            })
          );

        db.collection("users")
          .doc(loggeduser.userId)
          .collection("conversations")
          .doc(docId)
          .collection("messages")
          .add(newMessage);

        // updation on reciever
        let recDocId;
        await db
          .collection("users")
          .doc(user.id)
          .collection("conversations")
          .add({ user: { ...loggeduser, id: loggeduser.userId } })
          .then((doc) =>
            doc.get().then((docData) => {
              recDocId = docData.id;
              setRecieverConversation(() => ({
                id: docData.id,
                ...docData.data(),
              }));
            })
          );

        db.collection("users")
          .doc(user.id)
          .collection("conversations")
          .doc(recDocId)
          .collection("messages")
          .add(newMessage);
      } else {
        db.collection("users")
          .doc(loggeduser.userId)
          .collection("conversations")
          .doc(conversation?.id)
          .collection("messages")
          .add(newMessage);

        db.collection("users")
          .doc(user.id)
          .collection("conversations")
          .doc(recieverConversation?.id)
          .collection("messages")
          .add(newMessage);
      }
    } catch (error) {
      setText("");
      console.log(error);
    }
    setText("");
  };

  return (
    <>
      <Topbar user={loggeduser} />
      <div className="messenger">
        <div className="userBar">
          <ul className="userList">
            {users?.map((user) => {
              return (
                <li onClick={() => clickHandler(user)}>
                  <Avatar
                    src={user?.profilePicture}
                    sx={{ width: "50px", height: "50px", margin: "10px 0" }}
                  />
                  <h4>{user?.username}</h4>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="conversation">
          <div className="userTitle">
            <h2>{user?.username ?? "user"}</h2>
          </div>
          <div className="userMessages">
            {messages?.map((msg) => (
              <div
                className={`message ${
                  msg.author === loggeduser.userId ? "rightMsg" : "leftMsg"
                }`}
              >
                <p>{msg?.msg}</p>
              </div>
            ))}
          </div>
          <div className="msgBox">
            <textarea
              value={text}
              disabled={user?.id ? false : true}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button onClick={submit}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Messenger;
