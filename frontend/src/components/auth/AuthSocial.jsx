import googleIcon from "../../assets/google-icon.png";
import appleIcon from "../../assets/apple-logo.png";

export default function AuthSocial() {
  return (
    <>
      <div className="auth-divider">
        <p>OR CONTINUE WITH</p>
      </div>

      <div className="auth-social">
        <button type="button" className="auth-social-button">
          <img src={googleIcon} alt="Google logo" className="auth-social-icon" />
          <span>Sign in with Google</span>
        </button>

        <button type="button" className="auth-social-button">
          <img src={appleIcon} alt="Apple logo" className="auth-social-icon" />
          <span>Sign in with Apple</span>
        </button>
      </div>
    </>
  );
}
