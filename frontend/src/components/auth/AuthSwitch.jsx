import { Link } from "react-router-dom";

export default function AuthSwitch({ prompt, linkText, to }) {
  return (
    <p className="auth-switch">
      {prompt} <Link to={to}>{linkText}</Link>
    </p>
  );
}
