export default function AuthStatus({ error, success }) {
  return (
    <>
      {error ? <p className="auth-status auth-status-error">{error}</p> : null}
      {success ? <p className="auth-status auth-status-success">{success}</p> : null}
    </>
  );
}
