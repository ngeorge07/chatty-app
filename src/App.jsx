import "./App.scss";

import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../functions/createFirebase";

import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Attribution from "./components/Attribution";
import CommentsSection from "./components/CommentsSection";

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

export default App;
