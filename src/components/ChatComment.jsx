import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { doc, updateDoc, deleteDoc } from "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDUVjHHltBrNc4i9UcSbkS9F4kuOp9GIYo",
  authDomain: "comments-section-ccef3.firebaseapp.com",
  projectId: "comments-section-ccef3",
  storageBucket: "comments-section-ccef3.appspot.com",
  messagingSenderId: "352784704241",
  appId: "1:352784704241:web:8d85273c2ca1a467adff50",
  measurementId: "G-SWYX3KY28E",
});

const firestore = firebase.firestore();
const auth = firebase.auth();

function ChatComment(props) {
  const { content, uid, customId } = props.comment;
  let { counter, votesUp, votesDown } = props.comment;

  let isActiveUp;
  let isActiveDown;

  let disabledUp;
  let disabledDown;

  const commentClass = uid === auth.currentUser.uid ? "sent" : "received";

  function DeleteButton({ sent }) {
    if (sent === "sent") {
      return (
        <button
          className="delete-button"
          onClick={async () =>
            await deleteDoc(doc(firestore, "comments", customId))
          }
        >
          Delete
        </button>
      );
    } else return null;
  }

  if (!votesUp.includes(auth.currentUser.uid)) {
    isActiveUp = "active";
    disabledUp = false;
  } else {
    isActiveUp = "inactive";
    disabledUp = true;
  }

  if (!votesDown.includes(auth.currentUser.uid)) {
    isActiveDown = "active";
    disabledDown = false;
  } else {
    isActiveDown = "inactive";
    disabledDown = true;
  }

  async function upVote(customId, disabledUp) {
    const messageRef = doc(firestore, "comments", customId);

    if (!disabledUp) {
      votesUp.push(auth.currentUser.uid);
      if (votesDown.includes(auth.currentUser.uid)) {
        votesDown.splice(votesDown.indexOf(auth.currentUser.uid), 1);
      }

      if (disabledDown) {
        counter += 2;
      } else counter++;

      await updateDoc(messageRef, {
        counter: counter,
        votesUp: votesUp,
        votesDown: votesDown,
      });
    } else {
      votesUp.splice(votesUp.indexOf(auth.currentUser.uid), 1);
      await updateDoc(messageRef, {
        counter: counter - 1,
        votesUp: votesUp,
      });
    }
  }

  async function downVote(customId, disabledDown) {
    const messageRef = doc(firestore, "comments", customId);

    if (!disabledDown) {
      votesDown.push(auth.currentUser.uid);

      if (disabledUp) {
        counter -= 2;
      } else counter--;

      if (votesUp.includes(auth.currentUser.uid)) {
        votesUp.splice(votesUp.indexOf(auth.currentUser.uid), 1);
      }

      await updateDoc(messageRef, {
        counter: counter,
        votesUp: votesUp,
        votesDown: votesDown,
      });
    } else {
      votesDown.splice(votesDown.indexOf(auth.currentUser.uid), 1);
      await updateDoc(messageRef, {
        counter: counter + 1,
        votesDown: votesDown,
      });
    }
  }

  return (
    <div className={`comment ${commentClass}`}>
      <div className="vote-buttons">
        <button
          className={isActiveUp}
          onClick={() => upVote(customId, disabledUp)}
        >
          <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
              fill="#C5C6EF"
            />
          </svg>
        </button>

        <p>{counter}</p>

        <button
          className={isActiveDown}
          onClick={() => downVote(customId, disabledDown)}
        >
          <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
              fill="#C5C6EF"
            />
          </svg>
        </button>
      </div>

      <div className="comment-info">
        <div>
          <img
            alt=""
            src={`https://avatars.dicebear.com/api/pixel-art/${uid.substring(
              0,
              5
            )}.svg?size=50&radius=50&backgroundColor=lightgray`}
          />
          <p>{uid.substring(0, 5)}</p>
          <DeleteButton sent={commentClass} />
        </div>

        <p>{content}</p>
      </div>
    </div>
  );
}

export default ChatComment;
