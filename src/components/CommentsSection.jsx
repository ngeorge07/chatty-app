import auth, { createdTime, firestore } from "../../functions/createFirebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useRef, useEffect } from "react";

import ChatComment from "./ChatComment";

// let size;

function CommentsSection() {
  const commentsRef = firestore.collection("comments");
  const query = commentsRef.orderBy("createdAt").limitToLast(25);

  const [comments] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const { uid } = auth.currentUser;

  let counter;

  const dummy = useRef();
  const [size, increaseSize] = useState(0);

  const sendMessage = async (e) => {
    e.preventDefault();

    counter = 0;

    // firestore
    //   .collection("comments")
    //   .get()
    //   .then((snap) => {
    //     size = snap.size; // will return the collection size
    //   });

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
    increaseSize(size + 1);
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [size]);

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
