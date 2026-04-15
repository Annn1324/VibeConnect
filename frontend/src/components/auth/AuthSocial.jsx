import googleIcon from "../../assets/google-icon.png";
import appleIcon from "../../assets/apple-logo.png";

export default function AuthSocial() {
  return (
    <>
      <div className="login-divider">
        <p>OR CONTINUE WITH</p>
      </div>

      <div className="login-social">
        <button className="login-social-button">
          <img src={googleIcon} className="login-social-icon" />
          <span>Sign in with Google</span>
        </button>

        <button className="login-social-button">
          <img src={appleIcon} className="login-social-icon" />
          <span>Sign in with Apple</span>
        </button>
      </div>
    </>
  );
}