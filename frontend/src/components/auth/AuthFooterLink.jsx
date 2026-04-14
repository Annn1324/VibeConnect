import { Link } from "react-router-dom";

export default function AuthFooterLink() {
  return (
    <>
      <p className="login-switch">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>

      <div className="login-legal">
        <span>PRIVACY</span>
        <span>TERMS</span>
        <span>HELP</span>
      </div>
    </>
  );
}