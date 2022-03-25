import "./App.scss";

import { useState } from "react";
import Attribution from "./components/Attribution";
import Header from "./components/Header";
import ChatComment from "./components/ChatComment";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";

firebase.initializeApp({
  apiKey: "AIzaSyDUVjHHltBrNc4i9UcSbkS9F4kuOp9GIYo",
  authDomain: "comments-section-ccef3.firebaseapp.com",
  projectId: "comments-section-ccef3",
  storageBucket: "comments-section-ccef3.appspot.com",
  messagingSenderId: "352784704241",
  appId: "1:352784704241:web:8d85273c2ca1a467adff50",
  measurementId: "G-SWYX3KY28E",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Header />
      <main className="App">{user ? <CommentsSection /> : <SignIn />}</main>
      <Attribution />
    </>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className="sign-in-container">
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function CommentsSection() {
  const commentsRef = firestore.collection("comments");
  const query = commentsRef.orderBy("createdAt").limitToLast(25);

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
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      counter,
      customId,
      votesUp: [],
      votesDown: [],
    });

    setFormValue("");
  };

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
      </div>

      <div>
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
      </div>
    </>
  );
}

export { SignOut };
export default App;
