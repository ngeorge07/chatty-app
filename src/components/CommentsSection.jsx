import auth, { createdTime, firestore } from "../functions/createFirebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useRef, useEffect } from "react";

import ChatComment from "./ChatComment";

function CommentsSection() {
  const commentsRef = firestore.collection("comments");
  const query = commentsRef.orderBy("createdAt").limitToLast(25);
  const dummy = useRef();

  const [comments] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const { uid } = auth.currentUser;

  let counter;
  const sendMessage = async (e) => {
    e.preventDefault();

    counter = 0;

    const customId = firestore.collection("comments").doc().id;
    await commentsRef.doc(customId).set({
      content: formValue,
      createdAt: createdTime,
      uid,
      counter,
      customId,
      votesUp: [],
      votesDown: [],
    });

    setFormValue("");
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  return (
    <>
      <div className="comments">
        {comments &&
          comments.map((msg) => (
            <ChatComment
              key={msg.customId}
              comment={msg}
              customId={msg.customId}
            />
          ))}
        <span ref={dummy}></span>
      </div>

      <form onSubmit={sendMessage}>
        <img
          alt=""
          src={`https://avatars.dicebear.com/api/bottts/${uid.substring(
            0,
            5
          )}.svg?size=50&radius=50&backgroundColor=lightgray`}
        />
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          Send
        </button>
      </form>
    </>
  );
}

export default CommentsSection;
