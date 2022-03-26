import auth, { googleProvider } from "../../functions/createFirebase";

function SignIn() {
  const signInWithGoogle = () => {
    const provider = googleProvider;
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

export default SignIn;
