import { Link } from "react-router-dom";

export default function AuthSwitch() {
  return (
    <p className="login-switch">
      Don't have an account? <Link to="/register">Sign Up</Link>
    </p>
  );
}