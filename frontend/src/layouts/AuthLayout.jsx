

export default function AuthLayout({ children }) {
  return (
    <div className="login-page">
      <div className="login-glow login-glow-left" />
      <div className="login-glow login-glow-right" />

      <div className="login-shell">
        {children}
      </div>
    </div>
  );
}