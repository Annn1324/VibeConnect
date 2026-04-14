export default function AuthStatus({ error, success }) {
  return (
    <>
      {error && <p className="login-status login-status-error">{error}</p>}
      {success && <p className="login-status login-status-success">{success}</p>}
    </>
  );
}